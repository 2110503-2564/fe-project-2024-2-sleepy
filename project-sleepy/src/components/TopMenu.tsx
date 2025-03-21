import Image from 'next/image';
import TopMenuItem from './TopMenuItem'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { Link } from '@mui/material'

export default async function TopMenu() {
    const session = await getServerSession(authOptions)
    return(
        <div className={"h-[50px] bg-amber-700 fixed top-0 left-0 right-0 z-30 border-t border-b border-amber-800 flex flex-row )"}>
            <Image src={'/logo/logo.jpg'} className={"h-full w-auto"} alt='logo' width={0} height={0} sizes='100vh'/>
            <TopMenuItem title='Menu Item Booking' pageRef='/booking'/>
            <TopMenuItem title='My Booking' pageRef='/myBooking'/>
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
    );
}