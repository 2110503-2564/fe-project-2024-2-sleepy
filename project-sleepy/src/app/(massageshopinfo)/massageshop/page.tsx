import getVenues from "@/libs/getMassageShops";
import VenueCatalog from "@/components/MSCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import { VenuesJson } from "../../../../interface"

export default async function venue() {
    const venues:Promise<VenuesJson> = await getVenues()

    return(
        <main className="text-center p-5">
            <h1 className="text-xl text-black font-medium">Select your venue</h1>
            <Suspense fallback={<p className="text-black">Loading ... <LinearProgress/></p>}>
                <VenueCatalog venuesJson={venues}/>
            </Suspense>
        </main>
    );
}