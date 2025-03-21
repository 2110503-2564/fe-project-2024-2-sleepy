import getMassageShop from "@/libs/getMassageShop";
import Link from "next/link";

export default async function MSDetailPage( {params} : { params: {mid:string}}) {
    const MSDetail = await getMassageShop(params.mid)

    return(
        <main >
            <div className="flex flex-row my-5">
                <div className="text-md mx-5 text-black text-left "><h1 className="font-medium">{MSDetail.data.name}</h1>
                    <div className="text-md mx-5 text-black">Name: {MSDetail.data.name}</div>
                    <div className="text-md mx-5 text-black">Address: {MSDetail.data.address}</div>
                    <div className="text-md mx-5 text-black">District: {MSDetail.data.district}</div>
                    <div className="text-md mx-5 text-black">Province: {MSDetail.data.province}</div>
                    <div className="text-md mx-5 text-black">Postal Code: {MSDetail.data.postalcode}</div>
                    <div className="text-md mx-5 text-black">Tel: {MSDetail.data.tel}</div>
                    <div className="text-md mx-5 text-black">Open: {MSDetail.data.openTime}</div>
                    <div className="text-md mx-5 text-black">Close: {MSDetail.data.closeTime}</div>

                    <Link href={`/booking?id=${params.mid}&name=${MSDetail.data.name}`}>
                        <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 text-white shadow-sm">Booking</button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

