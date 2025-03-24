'use client';
import Image from "next/image";
import TopmenuItem from "./TopMenuItem";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaSearch, FaUser, FaSignOutAlt, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";

export default function Topmenu() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 shadow-lg z-50 fixed top-0 left-0 right-0">
        <div className="container mx-auto">
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Image
                  src="/logo/logo.jpg"
                  alt="logo"
                  width={50}
                  height={50}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
                <span className="text-xl font-bold">TIME FOR RELAX!</span>
              </Link>
              <div className="flex items-center gap-4">
                <TopmenuItem title="Home" pageRef="/" />
                <TopmenuItem title="Massage Shops" pageRef="/venue" />
                <TopmenuItem title="Booking" pageRef="/booking" />
                <TopmenuItem title="Promotion" pageRef="/promotion" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <FaSearch className="text-lg" />
              </button>
              {
                session ? (
                  <Link href="/signout" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors">
                    <FaSignOutAlt />
                    <span>Sign out</span>
                  </Link>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors">
                    <FaSignInAlt />
                    <span>Sign in</span>
                  </Link>
                )
              }
              {
                session && (
                  <Link href="/profile" className="flex items-center gap-2 bg-white text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors">
                    <FaUser />
                    <span className="font-medium">{session.user?.name}</span>
                  </Link>
                )
              }
            </div>
          </div>

          <div className="flex md:hidden items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo/logo.jpg"
                alt="logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <span className="text-lg font-bold">TIME FOR RELAX!</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>

          {
            mobileMenuOpen && (
              <div className="md:hidden pt-4 pb-2 flex flex-col gap-2 animate-fadeDown">
                <Link href="/" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                  Home
                </Link>
                <Link href="/venue" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                  Massage Shops
                </Link>
                <Link href="/booking" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                  Booking
                </Link>
                <Link href="/promotion" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                  Promotion
                </Link>
                {
                  session ? (
                    <>
                      <Link href="/profile" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                        My Profile
                      </Link>
                      <Link href="/signout" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                        Sign out
                      </Link>
                    </>
                  ) : (
                    <Link href="/login" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                      Sign in
                    </Link>
                  )
                }
              </div>
            )
          }
        </div>

        {
          searchOpen && (
            <div className="container mx-auto mt-3 bg-white rounded-xl p-3 shadow-lg animate-fadeDown">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                <input className="p-2 rounded border border-gray-300 text-black text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all" placeholder="LOCATION" defaultValue="RAYONG" />
                <input className="p-2 rounded border border-gray-300 text-black text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all" placeholder="DATE" defaultValue="28 dec 2025" />
                <input className="p-2 rounded border border-gray-300 text-black text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all" placeholder="TIME" defaultValue="12:00" />
                <input className="p-2 rounded border border-gray-300 text-black text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all" placeholder="STAR" defaultValue="4-5 STAR" />
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded px-4 py-2 hover:from-orange-600 hover:to-orange-700 transition-all shadow">
                  <FaSearch className="inline mr-2" /> Find Massage
                </button>
              </div>
            </div>
          )
        }
      </div>
      <div className="w-full h-16 bg-white"></div>
    </>
  );
}