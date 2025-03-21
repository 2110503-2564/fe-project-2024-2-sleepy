import Image from "next/image"
import getVenue from "@/libs/getMassageShop"
import Link from "next/link";
export default async function VenueDetailPage( {params} : { params: {vid:string}}) {
    const venueDetail = await getVenue(params.vid)

    return(
        <main >
            <div className="flex flex-row my-5">
                <Image src={venueDetail.data.picture} alt="Venue Image" width={0} height={0} sizes="100vw" className="rounded-lg w-[30%]"/>
                <div className="text-md mx-5 text-black text-left "><h1 className="font-medium">{venueDetail.data.name}</h1>
                    <div className="text-md mx-5 text-black">Name: {venueDetail.data.name}</div>


                    <Link href={`/booking?id=${params.vid}&name=${venueDetail.data.name}`}>
                        <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 text-white shadow-sm">Booking</button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

