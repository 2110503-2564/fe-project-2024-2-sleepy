'use client';
import { useState, useEffect } from 'react';
import Card from "./Card";
import { MSItem, MSJson } from "../../interface";
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

export default function MSCatalog({ MSJson }: { MSJson: Promise<MSJson> }) {
    const [msData, setMsData] = useState<MSJson | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filteredItems, setFilteredItems] = useState<MSItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [provinceFilter, setProvinceFilter] = useState<string | null>(null);
    const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);

    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await MSJson;
                setMsData(result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching massage shop data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [MSJson]);

    useEffect(() => {
        if (!msData) return;

        let result = [...msData.data];

        if (filter) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(filter.toLowerCase()) ||
                item.address.toLowerCase().includes(filter.toLowerCase()) ||
                item.province.toLowerCase().includes(filter.toLowerCase()) ||
                item.district.toLowerCase().includes(filter.toLowerCase())
            );
        }

        if (provinceFilter) {
            result = result.filter(item => item.province === provinceFilter);
        }

        if (isActiveFilter !== null) {
            result = result.filter(item => item.isActive === isActiveFilter);
        }

        result.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

        setFilteredItems(result);
        setCurrentPage(1);
    }, [msData, filter, sortOrder, provinceFilter, isActiveFilter]);

    const totalPages = msData ? Math.ceil(filteredItems.length / itemsPerPage) : 0;
    const currentItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const provinces = msData ? Array.from(new Set(msData.data.map(item => item.province))) : [];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!msData) {
        return (
            <div className="text-center py-10 text-red-500">
                <p>Unable to load massage shop data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="text-black max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-md p-5 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search massage shops..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-none"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <FaFilter /> Filters
                        </button>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                            {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="mt-4 p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                            <select
                                value={provinceFilter || ''}
                                onChange={(e) => setProvinceFilter(e.target.value || null)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                            >
                                <option value="">All Provinces</option>
                                {provinces.map((province) => (
                                    <option key={province} value={province}>{province}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <div className="flex gap-3">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="statusFilter"
                                        checked={isActiveFilter === null}
                                        onChange={() => setIsActiveFilter(null)}
                                        className="form-radio h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2">All</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="statusFilter"
                                        checked={isActiveFilter === true}
                                        onChange={() => setIsActiveFilter(true)}
                                        className="form-radio h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2">Active</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="statusFilter"
                                        checked={isActiveFilter === false}
                                        onChange={() => setIsActiveFilter(false)}
                                        className="form-radio h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2">Inactive</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-4 text-gray-600">
                Showing {currentItems.length} of {filteredItems.length} massage shops
            </div>

            <div className="space-y-4">
                {currentItems.length > 0 ? (
                    currentItems.map((MSItem) => (
                        <Card key={MSItem._id} MSItem={MSItem} />
                    ))
                ) : (
                    <div className="text-center py-8 bg-white rounded-lg shadow-md">
                        <div className="text-gray-500 text-lg">No massage shops found matching your criteria</div>
                        <button
                            onClick={() => {
                                setFilter("");
                                setProvinceFilter(null);
                                setIsActiveFilter(null);
                            }}
                            className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="flex rounded-md">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 border rounded-l-md ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 border-t border-b ${currentPage === page
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 border rounded-r-md ${currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}