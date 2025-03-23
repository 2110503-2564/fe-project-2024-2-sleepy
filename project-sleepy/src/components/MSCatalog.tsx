import Card from "./Card";
import Link from "next/link";
import { MSItem, MSJson } from "../../interface"

export default async function VenueCatalog({MSJson} : {MSJson:Promise<MSJson>}) {
    const MSJsonResult = await MSJson
    return(
        <div className="text-black">
            Explore {MSJsonResult.count} fabulous venues in our catalog
            <div style={{margin:"40px", display:"flex", flexDirection:"column", alignContent:"space-around", justifyContent:"space-around", flexWrap:"wrap"}}>
                {
                    MSJsonResult.data.map((MSItem:MSItem) => (
                        <Card MSItem={MSItem}/>
                    ))
                }
            </div>
        </div>
    )
}