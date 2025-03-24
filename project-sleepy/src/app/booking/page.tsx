'use client'
import DateReserve from "@/components/DateReserve";
import { TextField , Select ,MenuItem} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useState, ChangeEvent } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { BookingItem } from "../../../interface";
import { addBooking } from "@/redux/features/bookSlice";
import Banner from "@/components/Banner";
import { MSItem } from "../../../interface";
import { useEffect } from "react";
import getMassageShops from "@/libs/getMassageShops";
export default function booking() {

    const urlParams = useSearchParams()
    const venueName = urlParams.get('name') || ''
    const [massageShops, setMassageShops] = useState<MSItem[]>([]);
    const [nameLastname, setNameLastname ] = useState('')
    const [Contact, setContact ] = useState('')
    const [venue, setVenue] = useState(venueName)
    const [bookingDate, setBookingDate] = useState<Dayjs|null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getMassageShops();
                // Only set state if the component is still mounted
                if (data && Array.isArray(data)) {
                    setMassageShops(data);
                } else {
                    setMassageShops([]); // Set to empty array in case of invalid data
                }
            } catch (error) {
                console.error("Error fetching massage shops:", error);
                setMassageShops([]); // Handle error gracefully
            }
        }
        fetchData();
    }, []);  // Empty dependency array ensures this runs once when the component mounts

    const dispatch = useDispatch<AppDispatch>()

    const BookingHandler = () => {
        
        if(nameLastname && Contact && venue && bookingDate){
            const item:BookingItem = {
                nameLastname: String(nameLastname),
                tel: String(Contact),
                MassageShop: venue,
                bookDate: dayjs(bookingDate).format("YYYY/MM/DD")
            }
            alert("submit success")
            dispatch(addBooking(item))
        }
    }

    const handleChange = (event: SelectChangeEvent) => {
        setVenue(event.target.value as string);
    }

    return(
        <main className="w-[100%] flex flex-col items-center space-y-4">
            <Banner text1="Let Booking!" text2="Book your massage in just one click on our website and treat yourself to total relaxation"/>
            <div className="text-xl text-black font-medium">New Booking</div>
            <div>
                <div className="text-xl font-medium text-black flex flex-row">Name<p className="text-red-600">*</p></div>
                <TextField
                    required
                    id="filled-required"
                    defaultValue="Hello World"
                    variant="filled"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setNameLastname(event.target.value)}
                />
                
                <div className="text-xl font-medium text-black flex flex-row">Contact-Number <p className="text-red-600">*</p></div>
                <TextField
                    required
                    id="filled-required"
                    defaultValue="Hello World"
                    variant="filled"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setContact(event.target.value)}
                />

                <div className="text-xl font-medium text-black">Place</div>
                <Select id="massageShop" className=" h-[2em] w-[200px]" value={venue} onChange={handleChange}>
                    {massageShops.map((shop) => (
                        <MenuItem key={shop._id} value={shop._id}>
                            {shop.name}
                        </MenuItem>
                    ))}
                </Select>
                <div className="w-fit space-y-2">
                    <div className="text-xl font-medium text-black">Date</div>
                    <DateReserve onDateChange={(value:Dayjs) => {setBookingDate(value)}}/>
                </div>
                <button name="Book Venue" className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 my-2"
                onClick={BookingHandler}>Book Venue</button>
            </div>
        </main>
    );
}