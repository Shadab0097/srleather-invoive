import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "./invoiceSlice";
import userReducer from "./userSlice";
import authReducer from './authSlice'


const appStore = configureStore({
    reducer: {
        invoice: invoiceReducer,
        auth: authReducer,
        user: userReducer
    }
})

export default appStore;