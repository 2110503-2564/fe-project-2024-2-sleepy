'use client'
import Card from "./Card";
import { useReducer, useEffect, useState } from "react";
import Link from "next/link";
import { MSItem, MSJson } from "../../interface"
import getMassageShops from "@/libs/getMassageShops";

export default function CardPanel() {
    const [MSResponnse, setVenueResponse] = useState<MSJson|null>(null)
    useEffect(() => {
        const fetchData = async () => {
            const venues = await getMassageShops()
            setVenueResponse(venues)
        }
        fetchData()
    }, [])

    if(!MSResponnse) return(<p>Massage Shop Panel is loading ...</p>)

    return(
        <div>
            <div style={{margin:"20px", display:"flex", flexDirection:"row", alignContent:"space-around", justifyContent:"space-around", flexWrap:"wrap"}}>
                {
                    MSResponnse.data.map((MSItem:MSItem) => (
                        <Link key={MSItem._id} href={`/venue/${MSItem._id}`} className="w-1/5">
                            <Card MSItem={MSItem} />
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}