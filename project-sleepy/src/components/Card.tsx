'use client'
import * as React from 'react';
import InteractiveCard from './InteractiveCard';

export default function Card ({venueName} : { venueName:string}) {
    return(
        <InteractiveCard>
            <div className="w-full h-[60%] relative rounded-t-lg font-medium">
                <h1>{venueName}</h1>
            </div>
            <div className='w-full h-[15%] p-[10px] text-l text-black'> 
                <h3>{venueName}</h3>
            </div>
        </InteractiveCard>
    );
}