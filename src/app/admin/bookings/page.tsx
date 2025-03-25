'use client'
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
    FaTrash,
    FaEdit,
    FaSearch,
    FaTimes,
    FaFilter,
    FaCalendar,
    FaTable,
    FaMapMarkerAlt,
    FaPhone,
    FaUser
} from 'react-icons/fa';
import { Dialog, DialogContent, DialogTitle, Button, CircularProgress } from '@mui/material';
import DateReserve from '@/components/DateReserve';
import UnauthenticatedMessage from '@/components/UnauthenticatedMessage';
import AccessDeniedMessage from '@/components/AccessDeniedMessage';
import removeReservation from '@/libs/removeReservation';
import updateReservation from '@/libs/updateReservation';
import getReservations from '@/libs/getReservations';
import dayjs, { Dayjs } from 'dayjs';

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

export default function AdminBookingsPage() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [newBookingDate, setNewBookingDate] = useState<Dayjs | null>(null);
    const [filters, setFilters] = useState({
        searchTerm: '',
        dateRange: {
            start: null as Dayjs | null,
            end: null as Dayjs | null
        }
    });
    const [actionLoading, setActionLoading] = useState({
        update: false,
        delete: false
    });
    const [error, setError] = useState('');
    const [activeView, setActiveView] = useState<'table' | 'grid'>('table');
    const [statsView, setStatsView] = useState(false);

    const fetchReservations = useCallback(async () => {
        if (!session?.user?.token) return;

        setLoading(true);
        try {
            const response = await getReservations(session.user.token);
            if (response?.data) {
                setReservations(response.data);
                setFilteredReservations(response.data);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setError('Failed to fetch reservations');
        } finally {
            setLoading(false);
        }
    }, [session?.user?.token]);

    useEffect(() => {
        let result = [...reservations];

        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            result = result.filter(
                reservation =>
                    reservation.massageShop.name.toLowerCase().includes(searchLower) ||
                    reservation.massageShop.province.toLowerCase().includes(searchLower) ||
                    reservation.user.toLowerCase().includes(searchLower)
            );
        }

        if (filters.dateRange.start && filters.dateRange.end) {
            result = result.filter(reservation => {
                const reservDate = dayjs(reservation.reservDate);
                return reservDate.isAfter(filters.dateRange.start!) &&
                    reservDate.isBefore(filters.dateRange.end!);
            });
        }

        setFilteredReservations(result);
    }, [reservations, filters]);

    const handleUpdateReservation = async () => {
        if (!selectedReservation || !newBookingDate || !session?.user?.token) return;

        setActionLoading(prev => ({ ...prev, update: true }));
        try {
            const updatedReservation = await updateReservation(
                session.user.token,
                selectedReservation._id,
                newBookingDate.format("YYYY-MM-DD HH:mm")
            );

            setReservations(prev =>
                prev.map(reservation =>
                    reservation._id === selectedReservation._id
                        ? { ...reservation, reservDate: updatedReservation.reservDate }
                        : reservation
                )
            );

            setIsUpdateDialogOpen(false);
            setSelectedReservation(null);
            setNewBookingDate(null);
        } catch (error) {
            console.error('Error updating reservation:', error);
            setError('Failed to update reservation');
        } finally {
            setActionLoading(prev => ({ ...prev, update: false }));
        }
    };

    const handleDeleteReservation = async () => {
        if (!selectedReservation || !session?.user?.token) return;

        setActionLoading(prev => ({ ...prev, delete: true }));
        try {
            await removeReservation(session.user.token, selectedReservation._id);

            setReservations(prev =>
                prev.filter(reservation => reservation._id !== selectedReservation._id)
            );

            setIsDeleteDialogOpen(false);
            setSelectedReservation(null);
        } catch (error) {
            console.error('Error deleting reservation:', error);
            setError('Failed to delete reservation');
        } finally {
            setActionLoading(prev => ({ ...prev, delete: false }));
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchReservations();
        }
    }, [status, fetchReservations]);

    const totalBookings = filteredReservations.length;
    const bookingsByProvince = filteredReservations.reduce((acc, reservation) => {
        acc[reservation.massageShop.province] =
            (acc[reservation.massageShop.province] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostBookedProvince = Object.entries(bookingsByProvince).reduce(
        (max, [province, count]) => count > max.count ? { province, count } : max,
        { province: '', count: 0 }
    );

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return <UnauthenticatedMessage />;
    }

    const userData = session?.user?.data;
    const isAdmin = userData?.role === 'admin';

    if (!isAdmin) {
        return <AccessDeniedMessage />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200">
                    <div className="relative h-48 bg-gradient-to-r from-orange-500 to-orange-600">
                        <div className="absolute inset-0 opacity-20 pattern-dots-lg"></div>
                        <div className="absolute inset-0 flex items-center justify-between px-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Bookings Management</h1>
                                <p className="text-white text-opacity-95 mt-2">View and manage all bookings</p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex bg-white/20 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveView('table')}
                                        className={`px-3 py-2 rounded-lg flex items-center gap-2 ${activeView === 'table' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/10'}`}
                                    >
                                        <FaTable /> Table
                                    </button>
                                    <button
                                        onClick={() => setActiveView('grid')}
                                        className={`px-3 py-2 rounded-lg flex items-center gap-2 ${activeView === 'grid' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/10'}`}
                                    >
                                        <FaFilter /> Grid
                                    </button>
                                </div>
                                <button
                                    onClick={() => setStatsView(!statsView)}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${statsView ? 'bg-white text-orange-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                >
                                    <FaCalendar /> Stats
                                </button>
                            </div>
                        </div>
                    </div>

                    {statsView && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <h3 className="text-xl font-semibold text-gray-700">Total Bookings</h3>
                                <p className="text-3xl font-bold text-orange-500 mt-2">{totalBookings}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <h3 className="text-xl font-semibold text-gray-700">Most Booked Province</h3>
                                <p className="text-3xl font-bold text-orange-500 mt-2">
                                    {mostBookedProvince.province || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {mostBookedProvince.count} bookings
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <h3 className="text-xl font-semibold text-gray-700">Unique Provinces</h3>
                                <p className="text-3xl font-bold text-orange-500 mt-2">
                                    {Object.keys(bookingsByProvince).length}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="p-8">
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    value={filters.searchTerm}
                                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-none"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            <div>
                                <input
                                    type="date"
                                    value={filters.dateRange.start?.format('YYYY-MM-DD') || ''}
                                    onChange={(e) => setFilters(prev => ({
                                        ...prev,
                                        dateRange: {
                                            ...prev.dateRange,
                                            start: e.target.value ? dayjs(e.target.value) : null
                                        }
                                    }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-none text-gray-400"
                                />
                            </div>

                            <div>
                                <input
                                    type="date"
                                    value={filters.dateRange.end?.format('YYYY-MM-DD') || ''}
                                    onChange={(e) => setFilters(prev => ({
                                        ...prev,
                                        dateRange: {
                                            ...prev.dateRange,
                                            end: e.target.value ? dayjs(e.target.value) : null
                                        }
                                    }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-non text-gray-400"
                                />
                            </div>
                        </div>

                        {activeView === 'table' ? (
                            <div className="overflow-x-auto">
                                {
                                    loading ? (
                                        <div className="text-center py-8 text-gray-500">
                                            Loading bookings...
                                        </div>
                                    ) : filteredReservations.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No bookings found
                                        </div>
                                    ) : (
                                        <table className="w-full bg-white border border-gray-200">
                                            <thead>
                                                <tr className="bg-gray-100 border-b">
                                                    <th className="p-3 text-left text-neutral-600">Massage Shop</th>
                                                    <th className="p-3 text-left text-neutral-600">Province</th>
                                                    <th className="p-3 text-left text-neutral-600">Booking Date</th>
                                                    <th className="p-3 text-left text-neutral-600">Shop Contact</th>
                                                    <th className="p-3 text-center text-neutral-600">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filteredReservations.map(reservation => (
                                                        <tr key={reservation._id} className="border-b hover:bg-gray-50 transition-colors">
                                                            <td className="p-3 text-stone-500">{reservation.massageShop.name}</td>
                                                            <td className="p-3 text-stone-500">{reservation.massageShop.province}</td>
                                                            <td className="p-3 text-stone-500">
                                                                {dayjs(reservation.reservDate).format('YYYY-MM-DD HH:mm')}
                                                            </td>
                                                            <td className="p-3 text-stone-500">{reservation.massageShop.tel}</td>
                                                            <td className="p-3 text-center">
                                                                <div className="flex justify-center space-x-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedReservation(reservation);
                                                                            setNewBookingDate(dayjs(reservation.reservDate));
                                                                            setIsUpdateDialogOpen(true);
                                                                        }}
                                                                        className="text-blue-500 hover:text-blue-600 transition-colors"
                                                                    >
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedReservation(reservation);
                                                                            setIsDeleteDialogOpen(true);
                                                                        }}
                                                                        className="text-red-500 hover:text-red-600 transition-colors"
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    )
                                }
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {
                                    loading ? (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            Loading bookings...
                                        </div>
                                    ) : filteredReservations.length === 0 ? (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            No bookings found
                                        </div>
                                    ) : (
                                        filteredReservations.map(reservation => (
                                            <div
                                                key={reservation._id}
                                                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-800">
                                                            {reservation.massageShop.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                                            <FaMapMarkerAlt className="text-orange-500" />
                                                            {reservation.massageShop.province}
                                                        </p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedReservation(reservation);
                                                                setNewBookingDate(dayjs(reservation.reservDate));
                                                                setIsUpdateDialogOpen(true);
                                                            }}
                                                            className="text-blue-500 hover:text-blue-600 transition-colors"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedReservation(reservation);
                                                                setIsDeleteDialogOpen(true);
                                                            }}
                                                            className="text-red-500 hover:text-red-600 transition-colors"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FaCalendar className="text-orange-500" />
                                                        <span>{dayjs(reservation.reservDate).format('YYYY-MM-DD HH:mm')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FaPhone className="text-orange-500" />
                                                        <span>{reservation.massageShop.tel}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FaUser className="text-orange-500" />
                                                        <span>{reservation.user}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog
                open={isUpdateDialogOpen}
                onClose={() => setIsUpdateDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    Update Booking
                </DialogTitle>
                <DialogContent className="mt-4 pb-6">
                    {selectedReservation && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Massage Shop</label>
                                <input
                                    type="text"
                                    value={selectedReservation.massageShop.name}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Current Booking Date</label>
                                <input
                                    type="text"
                                    value={dayjs(selectedReservation.reservDate).format('YYYY-MM-DD HH:mm')}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">New Booking Date</label>
                                <DateReserve onDateChange={setNewBookingDate} />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    onClick={() => setIsUpdateDialogOpen(false)}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpdateReservation}
                                    variant="contained"
                                    disabled={!newBookingDate || actionLoading.update}
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                                >
                                    {actionLoading.update ? 'Updating...' : 'Update Booking'}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    Confirm Booking Deletion
                </DialogTitle>
                <DialogContent className="mt-4 pb-6">
                    {selectedReservation && (
                        <div>
                            <div className="text-center mb-6">
                                <div className="text-5xl text-red-500 mb-4">⚠️</div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h2>
                                <p className="text-gray-600 text-center">
                                    Do you really want to delete this booking for
                                    <span className="font-semibold"> {selectedReservation.massageShop.name}</span>?
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <div className="text-xs text-gray-700">Massage Shop</div>
                                        <div className="font-medium">{selectedReservation.massageShop.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Booking Date</div>
                                        <div className="font-medium">
                                            {dayjs(selectedReservation.reservDate).format('YYYY-MM-DD HH:mm')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    variant="outlined"
                                    className="text-gray-600 border-gray-300"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDeleteReservation}
                                    variant="contained"
                                    disabled={actionLoading.delete}
                                    className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                                >
                                    {actionLoading.delete ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Delete Booking'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {error && (
                <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-lg flex items-center">
                    <FaTimes className="mr-2" />
                    {error}
                    <button
                        onClick={() => setError('')}
                        className="ml-4 text-red-500 hover:text-red-600"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}
        </div>
    );
}