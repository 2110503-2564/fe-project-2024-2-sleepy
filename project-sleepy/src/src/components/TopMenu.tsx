'use client'
import Image from "next/image";
import TopmenuItem from "./TopMenuItem";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaUser, FaSignOutAlt, FaSignInAlt, FaBars, FaTimes, FaUserShield } from "react-icons/fa";

export default function Topmenu() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = session?.user?.data?.role === 'admin';

  return (
    <>
      <div className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 shadow-lg z-50 fixed top-0 left-0 right-0">
        <div className="container mx-auto">
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="relative w-12 h-12 rounded-full border-4 border-white shadow-md overflow-hidden bg-black">
                  <Image
                    src="/logo/logo.jpg"
                    alt="logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold">TIME FOR RELAX!</span>
              </Link>
              <div className="flex items-center gap-4">
                <TopmenuItem title="Home" pageRef="/" />
                <TopmenuItem title="Massage Shops" pageRef="/massageshop" />
                {
                  isAdmin && (
                    <TopmenuItem title="Admin Panel" pageRef="/admin" />
                  )
                }
              </div>
            </div>

            <div className="flex items-center gap-4">
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
                    {isAdmin ? <FaUserShield /> : <FaUser />}
                    <span className="font-medium">{session?.user?.data.name}</span>
                  </Link>
                )
              }
            </div>
          </div>

          <div className="flex md:hidden items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full border-3 border-white shadow-md overflow-hidden bg-white">
                <Image
                  src="/logo/logo.jpg"
                  alt="logo"
                  fill
                  className="object-contain"
                />
              </div>
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
                <Link href="/massageshop" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                  Massage Shops
                </Link>
                {
                  isAdmin && (
                    <Link href="/admin" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                      Admin Panel
                    </Link>
                  )
                }
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
      </div>
      <div className="w-full h-16 bg-white"></div>
    </>
  );
}