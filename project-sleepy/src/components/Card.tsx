'use client'
import * as React from 'react';
import InteractiveCard from './InteractiveCard';
import { MSItem, MSJson } from "../../interface"

export default function Card ({MSItem} : { MSItem:MSItem}) {
    return(
        <InteractiveCard>
            <h1 className="text-xl font-bold">{MSItem.name}</h1>
            <div className="flex flex-col items-start mx-7 my-3">
                <p>Name: {MSItem.name}</p>
                <p>Address: {MSItem.address}</p>
                <p>District: {MSItem.district}</p>
                <p>Province: {MSItem.province}</p>
                <p>Postal Code: {MSItem.postalcode}</p>
                <p>Tel: {MSItem.tel}</p>
                <p>Open: {MSItem.openTime}</p>
                <p>Close: {MSItem.closeTime}</p>
            </div>
        </InteractiveCard>
    );
}