'use client'
import Image from 'next/image'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'

export default function Banner () {
    const covers = ['/Banner/Banner1.jpg', '/Banner/Banner2.jpg', '/Banner/Banner3.jpg', '/Banner/Banner4.jpg']
    const [index, setIndex] = useState(0)
    const router = useRouter()

    //const {data: session} = useSession()

    return(
        <div className={"block p-[5px] m-0 w-screen h-full"} onClick={()=> { setIndex(index+1)}}>
            <Image src={covers[index%4]} alt='Banner' fill={true} objectFit='cover' priority/>
            <div className={"relative top-[100px] z-20 text-center"}>
                <h1 className='text-4xl font-medium'>where every event finds its venue</h1>
                <h3 className='text-xl font-serif'>Our venue offers exceptional banquet services, perfect for any celebration or special event.</h3>
                <button className='bg-amber-800 text-white border-cyan-600 font-semibold py-2 px-2 m-2 roumded z-30  
                    hover:bg-cyan-600 hover:text-white hover:border-transparent'
                    onClick={(e) => { e.stopPropagation; router.push('/venue') }}>
                Select Venue
            </button>
            </div>
            {
                //session? <div className='z-30 absolute top-5 right-10 font-semibold text-cyan-800 text-xl'>Hello {session.user?.name}</div> : null
            }
            
        </div>
    );
}