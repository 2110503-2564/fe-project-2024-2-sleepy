import Image from "next/image";
import TopmenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";

export default async function TopMenu() {
    const session = await getServerSession(authOptions)
    return(
        <div className={"h-[70px] bg-amber-700 fixed top-0 left-0 right-0 z-30 border-t border-b border-amber-800 flex flex-row )"}>
            <Image src={'/logo/logo.jpg'} className={"h-full w-auto"} alt='logo' width={0} height={0} sizes='100vh'/>
            <TopmenuItem title='Menu Item Booking' pageRef='/booking'/>
            <TopmenuItem title='My Booking' pageRef='/myBooking'/>
            <div className='flex flex-row absolute right-0 h-full'>
                {
                    session? <Link href='/api/auth/signout'>
                        <div className='flex items-center h-full px-2 text-cyan-600-sm'>
                            Sign-Out of {session.user?.name}
                        </div>
                        </Link>
                    :<Link href='/api/auth/signin'><div className='flex items-center h-full px-2 text-cyan-600-sm'> Sign-In</div></Link>
                }
                
            </div>
        </div>

        /* Middle: Search Form }
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 w-full md:max-w-3xl bg-white p-2 rounded-xl text-black">
          <input className="p-2 rounded border text-sm" placeholder="LOCATION" defaultValue="RAYONG" />
          <input className="p-2 rounded border text-sm" placeholder="DATE" defaultValue="28 dec 2025" />
          <input className="p-2 rounded border text-sm" placeholder="TIME" defaultValue="12:00" />
          <input className="p-2 rounded border text-sm" placeholder="STAR" defaultValue="4-5 STAR" />
          <button className="bg-blue-600 text-white text-sm rounded px-2 py-2">Search</button>
        </div>

        {/* Right: Language + Login/Logout }
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
    </div>*/
  );
}
