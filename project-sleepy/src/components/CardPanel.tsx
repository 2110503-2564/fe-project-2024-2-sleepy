'use client'
import Card from "./Card";
import { useReducer, useEffect, useState } from "react";
import Link from "next/link";
import getVenues from "@/libs/getVenues";
import { VenueItem, VenuesJson } from "../../interface"

export default function CardPanel() {
    const [venueResponnse, setVenueResponse] = useState<VenuesJson|null>(null)
    useEffect(() => {
        const fetchData = async () => {
            const venues = await getVenues()
            setVenueResponse(venues)
        }
        fetchData()
    }, [])

    /*mock data
    const mockVenueRepo = [
        {vid: "001", name: "The Bloom Pavilion", image: "/image/bloom.jpg"},
        {vid: "002", name: "Spark Space", image: "/image/sparkspace.jpg"},
        {vid: "003", name: "The Grand Table", image: "/image/grandtable.jpg"},
    ]
    */

    if(!venueResponnse) return(<p>Venue Panel is loading ...</p>)

    return(
        <div>
            <div style={{margin:"20px", display:"flex", flexDirection:"row", alignContent:"space-around", justifyContent:"space-around", flexWrap:"wrap"}}>
                {
                    venueResponnse.data.map((venueItem:VenueItem) => (
                        <Link href={`/venue/${venueItem.id}`} className="w-1/5">
                            <Card venueName={venueItem.name} />
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}