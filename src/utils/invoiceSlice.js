import { createSlice } from "@reduxjs/toolkit";


const invoiceSlice = createSlice({
    name: "invoice",
    initialState: null,
    reducers: {
        addInvoice: (state, action) => {
            return action.payload
        }
    }
})

export const { addInvoice } = invoiceSlice.actions
export default invoiceSlice.reducer