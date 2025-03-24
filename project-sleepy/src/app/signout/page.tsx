'use client';
import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheckCircle, FaHome, FaSignInAlt } from 'react-icons/fa';

export default function SignoutPage() {
    const [isSigningOut, setIsSigningOut] = useState(true);
    const [countdown, setCountdown] = useState(5);
    const router = useRouter();

    useEffect(() => {
        const handleSignOut = async () => {
            try {
                await signOut({ redirect: false });
                setIsSigningOut(false);
            } catch (error) {
                console.error('Error signing out:', error);
            }
        };

        handleSignOut();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;

        if (!isSigningOut && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        }

        if (countdown === 0) {
            router.push('/');
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [countdown, isSigningOut, router]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="relative h-32 bg-gradient-to-r from-orange-500 to-orange-600">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-white text-2xl font-bold">
                                    {isSigningOut ? 'Signing Out...' : 'Sign Out Successful'}
                                </h1>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                            <div className="bg-white p-2 rounded-full shadow-lg">
                                <Image
                                    src="/logo/logo.jpg"
                                    alt="Logo"
                                    width={60}
                                    height={60}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-8 pt-16 text-center">
                        {
                            isSigningOut ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                                    <p className="text-gray-600">Please wait while we sign you out...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <FaCheckCircle className="text-green-500 text-5xl mb-4" />
                                    <h2 className="text-xl font-semibold mb-2">You've been signed out successfully</h2>
                                    <p className="text-gray-600 mb-8">
                                        Thank you for using our service. We hope to see you again soon!
                                    </p>
                                    <p className="text-gray-500 mb-6">
                                        Redirecting to home page in <span className="font-bold text-orange-500">{countdown}</span> seconds...
                                    </p>
                                    <div className="flex gap-4">
                                        <Link
                                            href="/"
                                            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-6 rounded-lg font-medium shadow-md hover:from-orange-600 hover:to-orange-700 transition-colors"
                                        >
                                            <FaHome /> Home
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="flex items-center gap-2 border border-orange-500 text-orange-500 py-2 px-6 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                                        >
                                            <FaSignInAlt /> Sign In Again
                                        </Link>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}