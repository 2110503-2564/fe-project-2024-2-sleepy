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
                obj.reservationID === action.payload.reservationID
            );

            if (index !== -1) {
                state.bookItems[index] = action.payload;
            } else {
                state.bookItems.push(action.payload);
            }
        },
        removeBooking: (state, action: PayloadAction<BookingItem>) => {
            const remainItems = state.bookItems.filter(obj => {
                return obj.reservationID !== action.payload.reservationID;
            });
            state.bookItems = remainItems;
        }
    }
})

export const { addBooking, removeBooking } = bookSlice.actions
export default bookSlice.reducer