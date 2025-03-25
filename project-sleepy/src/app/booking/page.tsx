'use client'
import { useState, useEffect, ChangeEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText, Alert, Button, CircularProgress } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { MSItem } from "../../../interface";
import Link from "next/link";
import DateReserve from "@/components/DateReserve";
import Banner from "@/components/Banner";
import getMassageShops from "@/libs/getMassageShops";
import addReservations from "@/libs/addReservations";
import dayjs, { Dayjs } from "dayjs";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaPhone, FaCheck } from "react-icons/fa";

export default function BookingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const urlParams = useSearchParams();
    const shopId = urlParams.get('shop') || '';

    const [massageShops, setMassageShops] = useState<MSItem[]>([]);
    const [nameLastname, setNameLastname] = useState('');
    const [contact, setContact] = useState('');
    const [venue, setVenue] = useState(shopId);
    const [bookingDate, setBookingDate] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState({
        name: false,
        contact: false,
        venue: false,
        date: false
    });

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.data) {
            setNameLastname(session.user.data.name || '');
            setContact(session.user.data.tel || '');
        }
    }, [session, status]);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await getMassageShops(1);
                if (response && response.data && Array.isArray(response.data)) {
                    const shops = response.data;
                    setMassageShops(shops);

                    if (!venue && shops.length > 0) {
                        setVenue(shops[0]._id);
                    }
                } else {
                    setError("Couldn't retrieve massage shops. Please try again later.");
                    setMassageShops([]);
                }
            } catch (error) {
                console.error("Error fetching massage shops:", error);
                setError("Failed to load massage shops. Please check your connection and try again.");
                setMassageShops([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [venue]);

    const validateForm = () => {
        const errors = {
            name: !nameLastname.trim(),
            contact: !contact.trim() || !/^\d{10}$|^\d{3}-\d{3}-\d{4}$/.test(contact.replace(/-/g, '')),
            venue: !venue,
            date: !bookingDate
        };

        setFormErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');

        if (cleaned.length <= 3) {
            return cleaned;
        } else if (cleaned.length <= 6) {
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
        } else {
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
    };

    const handleContactChange = (event: ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(event.target.value);
        setContact(formatted);
    };

    const handleVenueChange = (event: SelectChangeEvent) => {
        setVenue(event.target.value as string);
    };

    const handleDateChange = (value: Dayjs) => {
        setBookingDate(value);
    };

    const bookingHandler = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const selectedShop = massageShops.find(shop => shop._id === venue);

            if (!selectedShop) {
                throw new Error("Selected massage shop not found");
            }

            if (status === 'authenticated' && session?.user?.token) {
                const reservDate = dayjs(bookingDate).format("YYYY-MM-DD HH:mm");

                await addReservations(session.user.token, selectedShop._id, reservDate);
                
                setSuccess(true);

                setTimeout(() => {
                    router.push('/profile');
                }, 2000);
            }
        } catch (error) {
            console.error("Booking error:", error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (status === 'unauthenticated') {
        return (
            <main className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
                <div className="bg-white rounded-xl shadow-md max-w-md w-full p-8 text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h1>
                    <p className="text-gray-600 mb-6">
                        Please sign in to make a booking for massage services.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login"
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-6 rounded-lg font-medium shadow-md hover:from-orange-600 hover:to-orange-700 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/massageshop"
                            className="border border-orange-500 text-orange-500 py-2 px-6 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                        >
                            Browse Massage Shops
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const selectedShop = massageShops.find(shop => shop._id === venue);

    return (
        <main className="min-h-screen bg-gray-50 pb-12">
            <Banner text1="Book Your Massage" text2="Schedule your perfect massage session in just a few clicks" />

            <div className="max-w-4xl mx-auto p-4">
                {
                    success && (
                        <Alert
                            severity="success"
                            className="mb-6 animate-fadeDown"
                            icon={<FaCheck />}
                        >
                            Booking successful! Redirecting to your profile...
                        </Alert>
                    )
                }

                {
                    error && (
                        <Alert
                            severity="error"
                            className="mb-6 animate-fadeDown"
                            onClose={() => setError(null)}
                        >
                            {error}
                        </Alert>
                    )
                }
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">New Booking</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <TextField
                                    label="Full Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={nameLastname}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNameLastname(e.target.value)}
                                    error={formErrors.name}
                                    helperText={formErrors.name ? "Please enter your full name" : ""}
                                    InputProps={{
                                        startAdornment: <FaUser className="text-gray-400 mr-2" />,
                                    }}
                                />
                            </div>

                            <div>
                                <TextField
                                    label="Contact Number"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={contact}
                                    onChange={handleContactChange}
                                    error={formErrors.contact}
                                    helperText={formErrors.contact ? "Please enter a valid 10-digit phone number" : ""}
                                    placeholder="XXX-XXX-XXXX"
                                    InputProps={{
                                        startAdornment: <FaPhone className="text-gray-400 mr-2" />,
                                    }}
                                />
                            </div>

                            <div>
                                <FormControl fullWidth error={formErrors.venue}>
                                    <InputLabel id="massage-shop-label">Massage Shop</InputLabel>
                                    <Select
                                        labelId="massage-shop-label"
                                        id="massage-shop-select"
                                        value={venue}
                                        label="Massage Shop"
                                        onChange={handleVenueChange}
                                        startAdornment={<FaMapMarkerAlt className="text-gray-400 mr-2" />}
                                    >
                                        {
                                            massageShops.length === 0 ? (
                                                <MenuItem disabled value="">
                                                    No shops available
                                                </MenuItem>
                                            ) : (
                                                massageShops.map((shop) => (
                                                    <MenuItem key={shop._id} value={shop._id}>
                                                        {shop.name}
                                                    </MenuItem>
                                                ))
                                            )
                                        }
                                    </Select>
                                    {formErrors.venue && <FormHelperText>Please select a massage shop</FormHelperText>}
                                </FormControl>
                            </div>

                            <div>
                                <FormControl fullWidth error={formErrors.date}>
                                    <InputLabel
                                        shrink
                                        htmlFor="booking-date"
                                        className="bg-white px-1"
                                    >
                                        Booking Date & Time
                                    </InputLabel>
                                    <div className="pt-2">
                                        <DateReserve onDateChange={handleDateChange} />
                                    </div>
                                    {formErrors.date && <FormHelperText>Please select a date and time</FormHelperText>}
                                </FormControl>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                            <h3 className="font-semibold text-lg text-orange-400 mb-4 flex items-center">
                                <FaCalendarAlt className="text-orange-500 mr-2" />
                                Booking Summary
                            </h3>

                            {selectedShop ? (
                                <div className="space-y-4">
                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="text-sm text-gray-500">Selected Shop</div>
                                        <div className="font-medium text-stone-600">{selectedShop.name}</div>
                                        <div className="text-sm text-gray-500 mt-1">{selectedShop.address}, {selectedShop.district}</div>
                                        <div className="text-sm text-gray-500">{selectedShop.province}, {selectedShop.postalcode}</div>
                                    </div>

                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="text-sm text-gray-500">Hours</div>
                                        <div className="font-medium text-stone-600">Open: {selectedShop.openTime} - Close: {selectedShop.closeTime}</div>
                                    </div>

                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="text-sm text-gray-500">Phone</div>
                                        <div className="font-medium text-stone-600">{selectedShop.tel}</div>
                                    </div>

                                    {
                                        bookingDate && (
                                            <div className="border-b border-gray-200 pb-3">
                                                <div className="text-sm text-gray-500">Selected Date & Time</div>
                                                <div className="font-medium text-stone-600">
                                                    {dayjs(bookingDate).format("DD MMMM YYYY, HH:mm")}
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            ) : (
                                <div className="text-gray-500 italic">
                                    Please select a massage shop to see details
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Button
                            variant="contained"
                            disabled={loading || success}
                            onClick={bookingHandler}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-8 rounded-lg text-lg shadow-md"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {loading ? "Processing..." : "Confirm Booking"}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}