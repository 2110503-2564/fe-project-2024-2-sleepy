import Image from "next/image";
import TopmenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";

export default async function Topmenu() {
  const session = await getServerSession(authOptions);

  return (
    <div className="w-full bg-orange-500 text-white py-4 px-6 shadow-md z-30 fixed top-0 left-0 right-0">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Logo + Nav + Slogan */}
        <div className="flex items-center gap-4 flex-wrap">
          <Image
            src="/logo/logo.jpg"
            alt="logo"
            width={40}
            height={40}
            className="w-auto h-10"
          />
          <span className="text-xl font-bold">Time for relax !</span>
          <TopmenuItem title="Booking" pageRef="/booking" />
          <TopmenuItem title="Promotion" pageRef="/promotion" />
        </div>

        {/* Middle: Search Form */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 w-full md:max-w-3xl bg-white p-2 rounded-xl text-black">
          <input className="p-2 rounded border text-sm" placeholder="LOCATION" defaultValue="RAYONG" />
          <input className="p-2 rounded border text-sm" placeholder="DATE" defaultValue="28 dec 2025" />
          <input className="p-2 rounded border text-sm" placeholder="TIME" defaultValue="12:00" />
          <input className="p-2 rounded border text-sm" placeholder="STAR" defaultValue="4-5 STAR" />
          <button className="bg-blue-600 text-white text-sm rounded px-2 py-2">Search</button>
        </div>

        {/* Right: Language + Login/Logout */}
        <div className="flex items-center gap-3 text-sm whitespace-nowrap">
          <button className="text-white">🌐</button>
          {session ? (
            <Link href="/api/auth/signout" className="underline">
              Sign-Out of {session.user?.name}
            </Link>
          ) : (
            <Link href="/api/auth/signin" className="underline">
              Sign-In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
