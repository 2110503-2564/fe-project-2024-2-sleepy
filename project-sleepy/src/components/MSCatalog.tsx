import Card from "./Card";
import Link from "next/link";
import { MSItem, MSJson } from "../../interface"

export default async function VenueCatalog({MSJson} : {MSJson:Promise<MSJson>}) {
    const MSJsonResult = await MSJson
    return(
        <div className="text-black">
            Explore {MSJsonResult.count} fabulous venues in our catalog
            <div style={{margin:"20px", display:"flex", flexDirection:"column", alignContent:"space-around", justifyContent:"space-around", flexWrap:"wrap"}}>
                {
                    MSJsonResult.data.map((MSItem:MSItem) => (
                        <Link key={MSItem._id} href={`/massageshop/${MSItem._id}`} className="w-[100%] sm:w-[50%] md:w-[30%] lg:w-[25%] p-2 sm:p-4 md:p-4 lg:p-8" >
                            <Card MSName={MSItem.name}/>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}