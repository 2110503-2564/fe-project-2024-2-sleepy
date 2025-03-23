import Card from "./Card";
import { MSItem, MSJson } from "../../interface"
import booking from "@/app/booking/page";


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