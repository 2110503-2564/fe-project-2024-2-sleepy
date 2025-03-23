import getMassageShops from "@/libs/getMassageShops";
import VenueCatalog from "@/components/MSCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import { MSJson } from "../../../../interface"

export default async function venue() {
    const massageShops:Promise<MSJson> = await getMassageShops()

    return(
        <main className="text-center p-5">
            <h1 className="text-xl text-black font-medium">Select your massage shop</h1>
            <Suspense fallback={<p className="text-black">Loading ... <LinearProgress/></p>}>
                <VenueCatalog MSJson={massageShops}/>
            </Suspense>
        </main>
    );
}