import Card from "./Card";
import Link from "next/link";
import { MSItem, MSJson } from "../../interface"
import Banner from "./Banner";

export default async function VenueCatalog({MSJson} : {MSJson:Promise<MSJson>}) {
    const MSJsonResult = await MSJson
    return(
        <div className="text-black">
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