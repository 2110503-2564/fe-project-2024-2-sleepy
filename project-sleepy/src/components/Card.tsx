'use client'
import * as React from 'react';
import InteractiveCard from './InteractiveCard';

export default function Card ({MSName} : { MSName:string}) {
    return(
        <InteractiveCard>
            <div className="w-full h-[60%] relative rounded-t-lg font-medium p-[10px]">
                <h1>{MSName}</h1>
            </div>
        </InteractiveCard>
    );
}