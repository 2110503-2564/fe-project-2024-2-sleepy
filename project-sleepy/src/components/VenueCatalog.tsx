import Card from "./Card";
import Link from "next/link";
import { VenueItem, VenuesJson } from "../../interface"

export default async function VenueCatalog({venuesJson} : {venuesJson:Promise<VenuesJson>}) {
    const venuesJsonResult = await venuesJson
    return(
        <div className="text-black">
            Explore {venuesJsonResult.count} fabulous venues in our catalog
            <div style={{margin:"20px", display:"flex", flexDirection:"row", alignContent:"space-around", justifyContent:"space-around", flexWrap:"wrap"}}>
                {
                    venuesJsonResult.data.map((venueItem:VenueItem) => (
                        <Link href={`/venue/${venueItem.id}`} className="w-[100%] sm:w-[50%] md:w-[30%] lg:w-[25%] p-2 sm:p-4 md:p-4 lg:p-8" >
                            <Card venueName={venueItem.name}/>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}