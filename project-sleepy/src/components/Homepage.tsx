'use client';
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function Homepage() {
  const { data: session } = useSession();

  return (
    <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-yellow-500">
      <div className="relative w-full h-[500px]">
        <Image
          src="/Banner/Banner1.jpg"
          alt="Massage Promo Banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col items-start justify-center p-8 text-white">
          <h1 className="text-5xl font-bold mb-2 leading-tight">
            <span className="text-yellow-400">TIME</span> FOR <br />
            <span className="text-yellow-400">RELAX</span>
          </h1>
          <p className="mb-6 max-w-md text-lg">
            Discover premium massage services tailored to your needs.
            Book your perfect relaxation experience today !
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/massageshop" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold flex items-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-colors">
              Explore Massage Shops <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-16 mx-8 mb-8 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">🔍</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Easy Search</h3>
          <p className="text-gray-600">Find the perfect massage shop with our advanced search filters.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">📅</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Quick Booking</h3>
          <p className="text-gray-600">Book your massage appointment in just a few clicks.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">⭐</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Trusted Reviews</h3>
          <p className="text-gray-600">Read authentic reviews from our community of massage enthusiasts.</p>
        </div>
      </div>
    </div>
  );
}