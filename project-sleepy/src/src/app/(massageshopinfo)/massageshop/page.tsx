import getMassageShops from "@/libs/getMassageShops";
import MSCatalog from "@/components/MSCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import { MSJson } from "../../../../interface";
import Banner from "@/components/Banner";

export default async function venue() {
    const massageShops: MSJson = await getMassageShops(1);

    return (
        <main className="text-center p-5">
            <Banner text1='ALL MASSAGE IS HERE' text2="WE've gathered all the massage shops here for you" />
            <Suspense fallback={<p className="text-black">Loading ... <LinearProgress /></p>}>
                <MSCatalog initialData={massageShops} />
            </Suspense>
        </main>
    );
}