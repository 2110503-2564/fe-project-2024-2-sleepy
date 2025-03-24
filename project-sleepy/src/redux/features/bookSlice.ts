import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingItem } from "../../../interface";

type BookingState = {
    bookItems: BookingItem[]
}

const initialState: BookingState = { bookItems: [] }

export const bookSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        addBooking: (state, action: PayloadAction<BookingItem>) => {
            const index = state.bookItems.findIndex(obj =>
                obj.MassageShop === action.payload.MassageShop &&
                obj.bookDate === action.payload.bookDate
            );

            if (index !== -1) {
                // Replace the existing booking with the new one
                state.bookItems[index] = action.payload;
            } else {
                // Add new booking if no match is found
                state.bookItems.push(action.payload);
            }
        },
        removeBooking: (state, action: PayloadAction<BookingItem>) => {
            const remainItems = state.bookItems.filter(obj => {
                return ((obj.nameLastname !== action.payload.nameLastname)
                    || (obj.tel !== action.payload.tel)
                    || (obj.MassageShop !== action.payload.MassageShop)
                    || (obj.bookDate !== action.payload.bookDate))
            })
            state.bookItems = remainItems
        }
    }
})

export const { addBooking, removeBooking } = bookSlice.actions
export default bookSlice.reducer