'use client'
import { MSItem } from "../../interface";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaLocationDot, FaClock, FaPhone, FaStar, FaAngleDown, FaAngleUp } from "react-icons/fa6";

export default function Card({ MSItem }: { MSItem: MSItem }) {
    const [toggle, setToggle] = useState(false);
    const router = useRouter();

    const stars = Array(5).fill(0).map(() => "text-yellow-500");

    return (
        <div className="w-full rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden mb-4 border border-gray-100">
            <div className="p-6">
                <div className="flex justify-between">
                    <h1 className="text-xl font-bold text-gray-800">{MSItem.name}</h1>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setToggle(prev => !prev);
                        }}
                        className="text-gray-600 hover:text-orange-500 transition-colors"
                    >
                        {toggle ? <FaAngleUp size={20} /> : <FaAngleDown size={20} />}
                    </button>
                </div>

                <div className="flex items-center mt-1 mb-3">
                    {
                        stars.map((starClass, index) => (
                            <FaStar key={index} className={starClass} />
                        ))
                    }
                    <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                    <FaLocationDot className="mr-2 text-orange-500" />
                    <span>{MSItem.address}, {MSItem.district}, {MSItem.province} {MSItem.postalcode}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                    <FaClock className="mr-2 text-orange-500" />
                    <span>Open: {MSItem.openTime} - Close: {MSItem.closeTime}</span>
                </div>

                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${toggle ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <h3 className="font-medium text-gray-800 mb-2">Contact Information</h3>
                            <div className="flex items-center text-gray-600">
                                <FaPhone className="mr-2 text-orange-500" />
                                <span>{MSItem.tel}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-800 mb-2">Status</h3>
                            <div className="flex items-center">
                                <span className={`inline-block h-3 w-3 rounded-full mr-2 ${MSItem.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-gray-600">{MSItem.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    className="mt-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-6 rounded-lg font-medium shadow-md hover:from-orange-600 hover:to-orange-700 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/booking?shop=${MSItem._id}`);
                    }}
                >
                    Book Now
                </button>
            </div>
        </div>
    );
}