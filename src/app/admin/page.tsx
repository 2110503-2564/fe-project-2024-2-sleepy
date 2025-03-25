'use client'
import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { FaStore, FaCalendarAlt, FaUserShield, FaEnvelope, FaPhone } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import UnauthenticatedMessage from '@/components/UnauthenticatedMessage';
import AccessDeniedMessage from '@/components/AccessDeniedMessage';
import getMassageShops from '@/libs/getMassageShops';
import getReservations from '@/libs/getReservations';
import { MSItem, MSJson } from '../../../interface';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState({
        shops: 0,
        bookings: 0,
        activeShops: 0
    });

    const fetchAdminDashboardData = useCallback(async () => {
        if (!session?.user?.token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            let allShops: MSItem[] = [];
            let currentPage = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                const shopsResponse: MSJson = await getMassageShops(currentPage);

                if (shopsResponse && shopsResponse.data) {
                    allShops = [...allShops, ...shopsResponse.data];

                    hasNextPage = !!shopsResponse.pagination?.next;
                    currentPage++;
                } else {
                    break;
                }
            }

            const reservationsResponse = await getReservations(session.user.token);

            const totalShops = allShops.length;
            const activeShops = allShops.filter((shop: MSItem) => shop.isActive).length;
            const totalBookings = reservationsResponse?.data?.length || 0;

            setStatsData({
                shops: totalShops,
                bookings: totalBookings,
                activeShops: activeShops
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.token]);

    useEffect(() => {
        if (status !== 'loading' && status === 'authenticated') {
            fetchAdminDashboardData();
        }
    }, [status, fetchAdminDashboardData]);

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
    const isAdmin = userData?.role === 'admin';

    if (!isAdmin) {
        return (
            <AccessDeniedMessage />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200">
                            <div className="relative h-48 bg-gradient-to-r from-orange-500 to-orange-600">
                                <div className="absolute inset-0 opacity-20 pattern-dots-lg"></div>
                                <div className="absolute inset-0 flex items-center px-8">
                                    <div>
                                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                                        <p className="text-white text-opacity-90 mt-2">Manage shops and bookings</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all transform hover:scale-105 duration-300">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold text-blue-800">Massage Shops</h3>
                                            <div className="bg-blue-600 p-3 rounded-full text-white shadow-md">
                                                <FaStore className="text-xl" />
                                            </div>
                                        </div>
                                        <div className="text-4xl font-bold text-indigo-900 mb-2">{statsData.shops}</div>
                                        <div className="flex items-center mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{ width: `${statsData.shops > 0 ? Math.round((statsData.activeShops / statsData.shops) * 100) : 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-2 flex justify-between">
                                            <span><span className="text-green-600 font-medium">{statsData.activeShops} active</span></span>
                                            <span><span className="text-red-600 font-medium">{statsData.shops - statsData.activeShops} inactive</span></span>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-rose-50 to-amber-50 border border-amber-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all transform hover:scale-105 duration-300">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold text-amber-800">Bookings</h3>
                                            <div className="bg-amber-500 p-3 rounded-full text-white shadow-md">
                                                <FaCalendarAlt className="text-xl" />
                                            </div>
                                        </div>
                                        <div className="text-4xl font-bold text-amber-900 mb-2">{statsData.bookings}</div>
                                        <div className="flex items-center text-sm text-gray-600 mt-4">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                                                <span>Average {statsData.shops > 0 ? (statsData.bookings / statsData.shops).toFixed(1) : 0} bookings per shop</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                                    <h2 className="text-2xl font-bold mb-8 text-gray-800 pb-2 border-b border-gray-200">Management</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Link href="/admin/shops" className="flex items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-colors transform hover:scale-105 duration-300 border border-blue-100 shadow-sm hover:shadow-md">
                                            <div className="bg-blue-600 p-4 rounded-full mr-6 text-white shadow-md">
                                                <FaStore className="text-2xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-blue-800">Massage Shops</h3>
                                                <p className="text-gray-600 mt-1">Manage massage shop listings and details</p>
                                            </div>
                                        </Link>

                                        <Link href="/admin/bookings" className="flex items-center p-6 bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl hover:from-rose-100 hover:to-amber-100 transition-colors transform hover:scale-105 duration-300 border border-amber-100 shadow-sm hover:shadow-md">
                                            <div className="bg-amber-500 p-4 rounded-full mr-6 text-white shadow-md">
                                                <FaCalendarAlt className="text-2xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-amber-800">Bookings</h3>
                                                <p className="text-gray-600 mt-1">Review and manage customer appointments</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800 pb-2 border-b border-gray-200">Admin Profile</h2>
                                    <div className="flex flex-col items-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                        <Image
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'Admin')}&background=000001&color=ffffff&size=128`}
                                            width={80}
                                            height={80}
                                            alt="Admin"
                                            className="rounded-full border-4 border-white shadow-lg mb-4"
                                        />
                                        <h3 className="font-bold text-xl text-gray-800">{userData?.name}</h3>
                                        <div className="bg-indigo-600 text-white text-sm font-medium px-4 py-1 rounded-full mt-2 shadow-sm">
                                            Administrator
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                            <FaEnvelope className="text-blue-600 mr-3" />
                                            <div>
                                                <div className="text-xs text-gray-500 font-medium">Email Address</div>
                                                <div className="text-gray-800 font-medium">{userData?.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                            <FaPhone className="text-blue-600 mr-3" />
                                            <div>
                                                <div className="text-xs text-gray-500 font-medium">Phone Number</div>
                                                <div className="text-gray-800 font-medium">{userData?.tel || 'Not provided'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                            <FaUserShield className="text-blue-600 mr-3" />
                                            <div>
                                                <div className="text-xs text-gray-500 font-medium">User ID</div>
                                                <div className="text-gray-800 font-mono text-sm">{userData?._id || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}