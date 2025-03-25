import Link from 'next/link';

export default function UnauthenticatedMessage() {
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
};