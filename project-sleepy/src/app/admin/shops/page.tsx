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
    FaClock,
    FaArrowLeft,
    FaArrowRight
    
} from 'react-icons/fa';
import { Dialog, DialogContent, DialogTitle, Button, CircularProgress } from '@mui/material';
import UnauthenticatedMessage from '@/components/UnauthenticatedMessage';
import AccessDeniedMessage from '@/components/AccessDeniedMessage';
import removeReservation from '@/libs/removeReservation';
import updateMassageShop from '@/libs/updateMassageShop';
import getMassageShops from '@/libs/getMassageShops';
import { MSJson } from '../../../../interface';

export interface MSItem {
    _id: string,
    name: string,
    address: string,
    district: string,
    province: string,
    postalcode: string,
    tel: string,
    openTime: string,
    closeTime: string,
    isActive: boolean
  }

export default function AdminBookingsPage() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [MassageShops, setMassageShops] = useState<MSItem[]>([]);
    const [filteredMassageShops, setFilteredMassageShops] = useState<MSItem[]>([]);
    const [selectedMassageShops, setselectedMassageShops] = useState<MSItem | null>(null);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [MsData, setMsData] = useState<MSJson>()

    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [district, setDistrict] = useState<string>('');
    const [province, setProvince] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const [tel, setTel] = useState<string>('');
    const [openTime, setOpenTime] = useState<string>('');
    const [closeTime, setCloseTime] = useState<string>('');

    // Update state when selectedMassageShops changes
    useEffect(() => {
        if (selectedMassageShops) {
            setName(selectedMassageShops.name);
            setAddress(selectedMassageShops.address);
            setDistrict(selectedMassageShops.district);
            setProvince(selectedMassageShops.province);
            setPostalCode(selectedMassageShops.postalcode);
            setTel(selectedMassageShops.tel);
            setOpenTime(selectedMassageShops.openTime);
            setCloseTime(selectedMassageShops.closeTime);
        }
    }, [selectedMassageShops]); // Runs when selectedMassageShops changes

    const [filters, setFilters] = useState({
        searchTerm: '',
    });
    const [actionLoading, setActionLoading] = useState({
        update: false,
        delete: false
    });
    const [error, setError] = useState('');
    const [activeView, setActiveView] = useState<'table' | 'grid'>('table');
    const [statsView, setStatsView] = useState(false);

    const fetchMassageShops = useCallback(async () => {
            try {
                setLoading(true);
                const result = await getMassageShops(currentPage);
                setMassageShops(result.data);
                setFilteredMassageShops(result.data);
                setMsData(result)
            } catch (error) {
                console.error("Error fetching massage shop data:", error);
            } finally {
                setLoading(false);
            }

    }, [session?.user?.token, currentPage]);
    

    const handleUpdateMassageShop = async () => {
        if (!selectedMassageShops || !session?.user?.token) return;

        setActionLoading(prev => ({ ...prev, update: true }));
        try {
            const updatedReservation = await updateMassageShop(
                session.user.token,
                selectedMassageShops._id,
                name,
                address,
                district,
                province,
                postalCode,
                tel,
                openTime,
                closeTime,
            );

            setMassageShops(prev =>
                prev.map(massageShop =>
                    massageShop._id === selectedMassageShops._id
                        ? { ...massageShop, reservDate: updatedReservation.reservDate }
                        : massageShop
                )
            );

            setIsUpdateDialogOpen(false);
            setselectedMassageShops(null);
        } catch (error) {
            console.error('Error updating reservation:', error);
            setError('Failed to update reservation');
        } finally {
            setActionLoading(prev => ({ ...prev, update: false }));
        }
    };

    const handleDeleteMassageShops = async () => {
        if (!selectedMassageShops || !session?.user?.token) return;

        setActionLoading(prev => ({ ...prev, delete: true }));
        try {
            await removeReservation(session.user.token, selectedMassageShops._id);

            setMassageShops(prev =>
                prev.filter(MassageShop => MassageShop._id !== selectedMassageShops._id)
            );

            setIsDeleteDialogOpen(false);
            setselectedMassageShops(null);
        } catch (error) {
            console.error('Error deleting reservation:', error);
            setError('Failed to delete reservation');
        } finally {
            setActionLoading(prev => ({ ...prev, delete: false }));
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchMassageShops(); // Fetch data whenever currentPage changes
        }
    }, [status, currentPage, fetchMassageShops]); // Adding currentPage as dependency

    const totalMassageShops = filteredMassageShops.length;
    const MassageShopByProvince = filteredMassageShops.reduce((acc, MassageShop) => {
        acc[MassageShop.province] =
            (acc[MassageShop.province] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostBookedProvince = Object.entries(MassageShopByProvince).reduce(
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

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if(currentPage < MassageShops.length-1){
            setCurrentPage(currentPage + 1);
        }
    };
    const hasNextPage = MsData?.pagination && MsData.pagination.next;
    const hasPrevPage = currentPage > 1;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200">
                    <div className="relative h-48 bg-gradient-to-r from-orange-500 to-orange-600">
                        <div className="absolute inset-0 opacity-20 pattern-dots-lg"></div>
                        <div className="absolute inset-0 flex items-center justify-between px-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Massage Shops Management</h1>
                                <p className="text-white text-opacity-95 mt-2">View and manage all massage shops</p>
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
                                <h3 className="text-xl font-semibold text-gray-700">Total MassageShops</h3>
                                <p className="text-3xl font-bold text-orange-500 mt-2">{totalMassageShops}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <h3 className="text-xl font-semibold text-gray-700">Most Massage Shop Province</h3>
                                <p className="text-3xl font-bold text-orange-500 mt-2">
                                    {mostBookedProvince.province || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {mostBookedProvince.count} massage shops
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <h3 className="text-xl font-semibold text-gray-700">Unique Provinces</h3>
                                <p className="text-3xl font-bold text-orange-500 mt-2">
                                    {Object.keys(MassageShopByProvince).length}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="p-8">
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search massage shops..."
                                    value={filters.searchTerm}
                                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-none"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {activeView === 'table' ? (
                            <div className="overflow-x-auto">
                                {
                                    loading ? (
                                        <div className="text-center py-8 text-gray-500">
                                            Loading massage shops...
                                        </div>
                                    ) : filteredMassageShops.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No massage shop found
                                        </div>
                                    ) : (
                                        <table className="w-full bg-white border border-gray-200">
                                            <thead>
                                                <tr className="bg-gray-100 border-b">
                                                    <th className="p-3 text-left text-neutral-600">Massage Shop</th>
                                                    <th className="p-3 text-left text-neutral-600">Address</th>
                                                    <th className="p-3 text-left text-neutral-600">Province</th>
                                                    <th className="p-3 text-left text-neutral-600">District</th>
                                                    <th className="p-3 text-left text-neutral-600">Postal Code</th>
                                                    <th className="p-3 text-left text-neutral-600">Tel.</th>
                                                    <th className="p-3 text-left text-neutral-600">Open Time</th>
                                                    <th className="p-3 text-left text-neutral-600">Close Time</th>
                                                    <th className="p-3 text-center text-neutral-600">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filteredMassageShops.map(MassageShop => (
                                                        <tr key={MassageShop._id} className="border-b hover:bg-gray-50 transition-colors">
                                                            <td className="p-3 text-stone-500">{MassageShop.name}</td>
                                                            <td className="p-3 text-stone-500">{MassageShop.address}</td>
                                                            <td className="p-3 text-stone-500">{MassageShop.province}</td>
                                                            <td className="p-3 text-stone-500">{MassageShop.district}</td>
                                                            <td className="p-3 text-stone-500">{MassageShop.postalcode}</td>
                                                            <td className="p-3 text-stone-500">{MassageShop.tel}</td>
                                                            <td className="p-3 text-stone-500">{MassageShop.openTime}</td>
                                                            <td className="p-3 text-stone-500">{MassageShop.closeTime}</td>
                                                            <td className="p-3 text-center">
                                                                <div className="flex justify-center space-x-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setselectedMassageShops(MassageShop);
                                                                            setIsUpdateDialogOpen(true);
                                                                        }}
                                                                        className="text-blue-500 hover:text-blue-600 transition-colors"
                                                                    >
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setselectedMassageShops(MassageShop);
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
                                            Loading massage shops...
                                        </div>
                                    ) : filteredMassageShops.length === 0 ? (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            No massage shop found
                                        </div>
                                    ) : (
                                        filteredMassageShops.map(MassageShop => (
                                            <div
                                                key={MassageShop._id}
                                                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-800">
                                                            {MassageShop.name}
                                                        </h3>

                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                setselectedMassageShops(MassageShop);
                                                                setIsUpdateDialogOpen(true);
                                                            }}
                                                            className="text-blue-500 hover:text-blue-600 transition-colors"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setselectedMassageShops(MassageShop);
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
                                                        <FaMapMarkerAlt className="text-orange-500" />
                                                        <span>{MassageShop.address}, {MassageShop.province}, {MassageShop.district}, {MassageShop.postalcode}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FaPhone className="text-orange-500" />
                                                        <span>{MassageShop.tel}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FaClock className="text-orange-500" />
                                                        <span>{MassageShop.openTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FaClock className="text-orange-500" />
                                                        <span>{MassageShop.closeTime}</span>
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
                    Update Massage Shop
                </DialogTitle>
                <DialogContent className="mt-4 pb-6">
                    {selectedMassageShops && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Massage Shop</label>
                                <input
                                    type="text"
                                    defaultValue={selectedMassageShops.name}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    onChange={(e) => {setName(e.target.value)}}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Address</label>
                                <input
                                    type="text"
                                    defaultValue={selectedMassageShops.address}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    onChange={(e) => {setAddress(e.target.value)}}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">District</label>
                                <input
                                    type="text"
                                    defaultValue={selectedMassageShops.district}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    onChange={(e) => {setDistrict(e.target.value)}}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Province</label>
                                <input
                                    type="text"
                                    defaultValue={selectedMassageShops.province}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    onChange={(e) => {setProvince(e.target.value)}}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Postal Code</label>
                                <input
                                    type="text"
                                    defaultValue={selectedMassageShops.postalcode}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    onChange={(e) => {setPostalCode(e.target.value)}}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Tel.</label>
                                <input
                                    type="text"
                                    defaultValue={selectedMassageShops.tel}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    onChange={(e) => {setTel(e.target.value)}}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Open</label>
                                <input
                                    type="text"
                                    defaultValue={selectedMassageShops.openTime}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    onChange={(e) => {setOpenTime(e.target.value)}}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Close</label>
                                <input
                                    type="text"
                                    defaultValue={selectedMassageShops.closeTime}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    onChange={(e) => {setCloseTime(e.target.value)}}
                                />
                            </div>
        
                            <div className="flex justify-end space-x-2">
                                <Button
                                    onClick={() => setIsUpdateDialogOpen(false)}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpdateMassageShop}
                                    variant="contained"
                                    disabled={actionLoading.update}
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                                >
                                    {actionLoading.update ? 'Updating...' : 'Update Massage Shop'}
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
                    {selectedMassageShops && (
                        <div>
                            <div className="text-center mb-6">
                                <div className="text-5xl text-red-500 mb-4">⚠️</div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h2>
                                <p className="text-gray-600 text-center">
                                    Do you really want to delete this booking for
                                    <span className="font-semibold"> {selectedMassageShops.name}</span>?
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <div className="text-xs text-gray-700">Massage Shop</div>
                                        <div className="font-medium">{selectedMassageShops.name}</div>
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
                                    onClick={handleDeleteMassageShops}
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
            <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-lg shadow-sm">
                <button
                    onClick={handlePrevPage}
                    disabled={!hasPrevPage || loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors 
                        ${!hasPrevPage || loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                    <FaArrowLeft /> Previous
                </button>

                <div className="text-gray-600 font-medium">
                    Page {currentPage}
                </div>

                <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage || loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors 
                        ${!hasNextPage || loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                    Next <FaArrowRight />
                </button>
            </div>
        </div>
    );
}