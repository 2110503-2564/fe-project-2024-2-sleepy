'use client'
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPhone, FaCalendarAlt, FaTrash, FaEdit, FaTimes, FaMapMarkerAlt, FaClock, FaSync } from 'react-icons/fa';
import removeReservation from '@/libs/removeReservation';
import updateReservation from '@/libs/updateReservation';
import getReservations from '@/libs/getReservations';
import getMassageShop from '@/libs/getMassageShop';
import { Dialog, DialogContent, DialogTitle, Button, CircularProgress } from '@mui/material';
import DateReserve from '@/components/DateReserve';
import dayjs, { Dayjs } from 'dayjs';
import { MSItem } from '../../../interface';
import UnauthenticatedMessage from '@/components/UnauthenticatedMessage';
import UserInfoCard from '@/components/UserInfoCard';
import NoBookingsMessage from '@/components/NoBookingMessage';


interface Reservation {
  _id: string;
  reservDate: string;
  user: string;
  massageShop: {
    _id: string;
    name: string;
    province: string;
    tel: string;
  };
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [newBookingDate, setNewBookingDate] = useState<Dayjs | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [apiReservations, setApiReservations] = useState<Reservation[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [shopDetailsCache, setShopDetailsCache] = useState<{ [key: string]: MSItem }>({});
  const [loadingShopIds, setLoadingShopIds] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.data) {
      fetchReservations();
    }

    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status, session]);

  useEffect(() => {
    if (apiReservations.length > 0) {
      apiReservations.forEach(reservation => {
        fetchShopDetails(reservation.massageShop._id);
      });
    }
  }, [apiReservations]);

  const fetchShopDetails = async (shopId: string) => {
    if (shopDetailsCache[shopId]) {
      return shopDetailsCache[shopId];
    }

    if (loadingShopIds.includes(shopId)) {
      return null;
    }

    setLoadingShopIds(prev => [...prev, shopId]);

    try {
      const response = await getMassageShop(shopId);
      if (response && response.data) {
        const shopDetails = response.data;

        setShopDetailsCache(prev => ({
          ...prev,
          [shopId]: shopDetails
        }));

        return shopDetails;
      }
    } catch (error) {
      console.error(`Error fetching shop details for ID ${shopId}:`, error);
    } finally {
      setLoadingShopIds(prev => prev.filter(id => id !== shopId));
    }

    return null;
  };

  const fetchReservations = async () => {
    if (!session?.user?.data?._id) return;

    setApiLoading(true);
    setApiError(null);

    try {
      const response = await getReservations(session?.user?.token);
      if (response && response.data) {
        const userReservations = response.data.filter(
          (reservation: Reservation) => reservation.user === session.user.data._id
        );
        setApiReservations(userReservations);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setApiError("Failed to load your reservations. Please try again later.");
    } finally {
      setApiLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReservations();
  };

  const handleCancelBooking = async (reservation: Reservation) => {
    setCancellingId(reservation._id);

    try {
      if (status === 'authenticated' && session?.user?.token) {
        await removeReservation(session.user.token, reservation._id);

        setApiReservations(prev => prev.filter(r => r._id !== reservation._id));
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    } finally {
      setCancellingId(null);
    }
  };

  const openUpdateDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setNewBookingDate(dayjs(reservation.reservDate));
    setIsDialogOpen(true);
    setUpdateError(null);
  };

  const closeUpdateDialog = () => {
    setIsDialogOpen(false);
    setSelectedReservation(null);
    setNewBookingDate(null);
    setUpdateError(null);
  };

  const handleDateChange = (value: Dayjs) => {
    setNewBookingDate(value);
  };

  const handleUpdateBooking = async () => {
    if (!selectedReservation || !newBookingDate) {
      return;
    }

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      if (status === 'authenticated' && session?.user?.token) {
        const reservDate = newBookingDate.format("YYYY-MM-DD HH:mm");

        await updateReservation(session.user.token, selectedReservation._id, reservDate);

        setApiReservations(prev =>
          prev.map(reservation =>
            reservation._id === selectedReservation._id
              ? { ...reservation, reservDate: newBookingDate.toISOString() }
              : reservation
          )
        );

        closeUpdateDialog();
        setUpdatingId(selectedReservation._id);

        setTimeout(() => {
          setUpdatingId(null);
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      setUpdateError("Failed to update reservation. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("YYYY/MM/DD HH:mm");
  };

  const getFullShopDetails = (shopId: string) => {
    if (shopDetailsCache[shopId]) {
      return shopDetailsCache[shopId];
    }

    if (!loadingShopIds.includes(shopId)) {
      fetchShopDetails(shopId);
    }

    return null;
  };

  const isShopLoading = (shopId: string) => {
    return loadingShopIds.includes(shopId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <UnauthenticatedMessage />
    );
  }

  const userData = session?.user?.data;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="absolute left-8 -bottom-16">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'User')}&background=000001&color=ffffff&size=128`}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 pb-8 px-8">
            <h1 className="text-3xl font-bold text-gray-800">{userData?.name || 'User'}</h1>
            <p className="text-orange-500 font-medium mt-1 mb-6">
              {userData?.role === 'admin' ? 'Administrator' : 'Customer'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UserInfoCard />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">My Bookings</h2>
                  <button
                    onClick={handleRefresh}
                    disabled={apiLoading || refreshing}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {
                  apiLoading ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                      <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-orange-500 rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading your reservations...</p>
                    </div>
                  ) : apiError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                      <p className="text-red-500 mb-2">{apiError}</p>
                      <button
                        onClick={handleRefresh}
                        className="text-orange-500 hover:text-orange-600 font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : apiReservations.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {
                        apiReservations.map((reservation) => {
                          const fullShopDetails = getFullShopDetails(reservation.massageShop._id);
                          const isLoading = isShopLoading(reservation.massageShop._id);

                          return (
                            <div
                              key={reservation._id}
                              className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all 
                            ${(cancellingId === reservation._id || updatingId === reservation._id) ? 'opacity-50 scale-95' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-800 text-lg">{reservation.massageShop.name}</h3>
                                  <div className="text-sm text-gray-500 mt-2">
                                    {
                                      fullShopDetails ? (
                                        <>
                                          <div className="flex items-center">
                                            <FaMapMarkerAlt className="mr-2 text-orange-500" />
                                            <span>{fullShopDetails.address}, {fullShopDetails.district}, {fullShopDetails.province} {fullShopDetails.postalcode}</span>
                                          </div>

                                          <div className="flex items-center mt-1">
                                            <FaPhone className="mr-2 text-orange-500" />
                                            <span>{fullShopDetails.tel}</span>
                                          </div>

                                          <div className="flex items-center mt-1">
                                            <FaClock className="mr-2 text-orange-500" />
                                            <span>Open: {fullShopDetails.openTime} - Close: {fullShopDetails.closeTime}</span>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="flex items-center">
                                            <FaMapMarkerAlt className="mr-2 text-orange-500" />
                                            <span>{reservation.massageShop.province}</span>
                                          </div>

                                          <div className="flex items-center mt-1">
                                            <FaPhone className="mr-2 text-orange-500" />
                                            <span>{reservation.massageShop.tel}</span>
                                          </div>

                                          {isLoading && (
                                            <div className="text-xs text-gray-400 mt-1 italic">Loading shop details...</div>
                                          )}
                                        </>
                                      )
                                    }

                                    <div className="flex items-center mt-2 font-medium">
                                      <FaCalendarAlt className="mr-2 text-orange-500" />
                                      <span>Appointment: {formatDate(reservation.reservDate)}</span>
                                      {updatingId === reservation._id && (
                                        <span className="ml-2 text-green-500 text-xs animate-pulse">
                                          Updated successfully!
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                                  Active
                                </div>
                              </div>

                              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                                <div className="flex space-x-2">
                                  <button
                                    className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors"
                                    onClick={() => openUpdateDialog(reservation)}
                                    disabled={cancellingId === reservation._id || updatingId === reservation._id}
                                  >
                                    <FaEdit size={12} /> Change Date
                                  </button>
                                  <button
                                    className="flex items-center gap-1 px-3 py-1 text-xs bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                                    onClick={() => handleCancelBooking(reservation)}
                                    disabled={cancellingId === reservation._id || updatingId === reservation._id}
                                  >
                                    {
                                      cancellingId === reservation._id ? (
                                        <span className="flex items-center">
                                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                          Cancelling...
                                        </span>
                                      ) : (
                                        <>
                                          <FaTrash size={12} /> Cancel Booking
                                        </>
                                      )
                                    }
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  ) : (
                    <NoBookingsMessage />
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={closeUpdateDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex justify-between items-center">
            <span>Update Booking Date</span>
            <button
              onClick={closeUpdateDialog}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </DialogTitle>
        <DialogContent className="mt-4 pb-6">
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Please select a new date and time for your booking at <span className="font-bold">{selectedReservation?.massageShop.name}</span>
            </p>

            {
              updateError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {updateError}
                </div>
              )
            }

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Current Date and Time:</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
                {selectedReservation && formatDate(selectedReservation.reservDate)}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">New Date and Time:</label>
              <div className="w-full">
                <DateReserve onDateChange={handleDateChange} />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outlined"
                onClick={closeUpdateDialog}
                className="text-gray-500 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdateBooking}
                disabled={!newBookingDate || updateLoading}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
              >
                {
                  updateLoading ? (
                    <>
                      <CircularProgress size={20} color="inherit" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Booking'
                  )
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}