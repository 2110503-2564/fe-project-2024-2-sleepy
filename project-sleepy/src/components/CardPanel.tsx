'use client'
import Card from "./Card";
import { useReducer, useEffect, useState } from "react";
import Link from "next/link";
import getVenues from "@/libs/getMassageShops";
import { MSItem, MSJson } from "../../interface"

export default function CardPanel() {
    const [venueResponnse, setVenueResponse] = useState<MSJson|null>(null)
    useEffect(() => {
        const fetchData = async () => {
            const venues = await getVenues()
            setVenueResponse(venues)
        }
        fetchData()
    }, [])

    if(!venueResponnse) return(<p>Massage Shop Panel is loading ...</p>)

    return(
        <div>
            <div style={{margin:"20px", display:"flex", flexDirection:"row", alignContent:"space-around", justifyContent:"space-around", flexWrap:"wrap"}}>
                {
                    venueResponnse.data.map((MSItem:MSItem) => (
                        <Link key={MSItem._id} href={`/venue/${MSItem._id}`} className="w-1/5">
                            <Card venueName={MSItem.name} />
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}