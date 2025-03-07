import { configureStore } from '@reduxjs/toolkit';
import tempReducer from './Slices/temp'
import themeReducer from './Slices/themeSlice'
import authReducer from './Slices/authSlice'
import customerReducer from './Slices/customerSlice'
import billReducer from './Slices/billSlice'

const store = configureStore({
    reducer:{
        temp: tempReducer,
        theme: themeReducer,
        auth: authReducer,
        customers: customerReducer,
        bills: billReducer,
    }
})

export default store