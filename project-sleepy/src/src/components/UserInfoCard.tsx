'use client'
import { useSession } from 'next-auth/react';
import { FaIdCard, FaEnvelope, FaPhone, FaUserTag } from 'react-icons/fa';

export default function UserInfoCard() {
    const { data: session } = useSession();
    const userData = session?.user?.data;

    return (
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
    );
}