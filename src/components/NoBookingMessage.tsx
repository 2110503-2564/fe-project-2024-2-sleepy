import Link from 'next/link';

export default function NoBookingsMessage() {
    return (
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
    );
};