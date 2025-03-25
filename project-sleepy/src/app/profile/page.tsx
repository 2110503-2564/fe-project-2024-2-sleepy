'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaEnvelope, FaPhone, FaIdCard, FaUserTag, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { removeBooking } from '@/redux/features/bookSlice';
import { BookingItem } from '../../../interface';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const bookings = useAppSelector((state) => state.bookSlice.bookItems);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  const handleCancelBooking = (booking: BookingItem, index: number) => {
    setCancellingId(index);

    setTimeout(() => {
      dispatch(removeBooking(booking));
      setCancellingId(null);
    }, 500);
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
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden p-8 text-center">
            <div className="text-6xl text-orange-500 mb-4">🔒</div>
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
            <Link
              href="/login"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:from-orange-600 hover:to-orange-700 transition-colors inline-block"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userData = session?.user?.data;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="absolute left-8 -bottom-16">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'User')}&background=f97316&color=ffffff&size=128`}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-8 px-8">
            <h1 className="text-3xl font-bold text-gray-800">{userData?.name || 'User'}</h1>
            <p className="text-orange-500 font-medium mt-1 mb-6">
              {userData?.role === 'admin' ? 'Administrator' : 'Customer'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-lg mr-4">
                      <FaIdCard className="text-orange-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">User ID</div>
                      <div className="text-gray-700">{userData?._id || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-lg mr-4">
                      <FaEnvelope className="text-orange-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email Address</div>
                      <div className="text-gray-700">{userData?.email || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-lg mr-4">
                      <FaPhone className="text-orange-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone Number</div>
                      <div className="text-gray-700">{userData?.tel || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-lg mr-4">
                      <FaUserTag className="text-orange-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Account Type</div>
                      <div className="text-gray-700 capitalize">{userData?.role || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">My Bookings</h2>
                {
                  bookings.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {
                        bookings.map((booking, index) => (
                          <div
                            key={index}
                            className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all ${cancellingId === index ? 'opacity-50 scale-95' : ''
                              }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-800">{booking.MassageShop}</h3>
                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                  <FaCalendarAlt className="mr-2 text-orange-500" />
                                  <span>{booking.bookDate}</span>
                                </div>
                              </div>
                              <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                                Active
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                              <div className="text-sm text-gray-600">
                                <span className="block">{booking.nameLastname}</span>
                                <span className="block">{booking.tel}</span>
                              </div>
                              <button
                                className="flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                                onClick={() => handleCancelBooking(booking, index)}
                                disabled={cancellingId === index}
                              >
                                {cancellingId === index ? (
                                  <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Cancelling...
                                  </span>
                                ) : (
                                  <>
                                    <FaTrash size={12} /> Cancel
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                      <div className="text-4xl mb-2">🏖️</div>
                      <h3 className="text-lg font-medium text-gray-700 mb-1">No Bookings Yet</h3>
                      <p className="text-gray-500 mb-4">You haven't made any massage bookings yet.</p>
                      <Link
                        href="/massageshop"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm hover:from-orange-600 hover:to-orange-700 transition-colors inline-block"
                      >
                        Find Massage Shops
                      </Link>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}