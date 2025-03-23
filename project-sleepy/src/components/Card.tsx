'use client'
import * as React from 'react'
import { MSItem } from "../../interface"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaLocationDot } from "react-icons/fa6"

export default function Card({ MSItem }: { MSItem: MSItem }) {
    const [toggle, setToggle] = useState(false);
    const router = useRouter();
    
    return (
        <div className="w-full rounded-lg shadow-xl bg-white transition-all duration-300 cursor-pointer my-2" 
            onClick={() => setToggle(prev => !prev)}> 
            <div className="flex flex-col items-start px-7 py-3">
                <h1 className="text-xl font-bold">{MSItem.name}</h1>
                <h3 className='text-xl '>5 Star</h3>
                <h5 className='flex flex-row mt-4'><FaLocationDot/> <div className='mx-1'>{MSItem.province}</div></h5>
                <div className={`flex flex-col items-start transition-all duration-300 ease-in-out overflow-hidden ${toggle ? "h-[240px] p-2" : "h-0 p-0"}`}>
                    <p>Address: {MSItem.address}</p>
                    <p>District: {MSItem.district}</p>
                    <p>Province: {MSItem.province}</p>
                    <p>Postal Code: {MSItem.postalcode}</p>
                    <p>Tel: {MSItem.tel}</p>
                    <p>Open: {MSItem.openTime}</p>
                    <p>Close: {MSItem.closeTime}</p>
                    <button className='bg-amber-800 text-white border-cyan-600 font-semibold py-2 px-2 my-2 roumded z-30  
                        hover:bg-cyan-600 hover:text-white hover:border-transparent'
                        onClick={(e) => { e.stopPropagation; router.push('/booking') }}>
                    Booking
                    </button>
                </div>
            </div> 
        </div>
    );
}
