import { configureStore } from '@reduxjs/toolkit';
import tempReducer from './Slices/temp'
import themeReducer from './Slices/themeSlice'
import authReducer from './Slices/authSlice'

const store = configureStore({
    reducer:{
        temp: tempReducer,
        theme: themeReducer,
        auth: authReducer
    }
})

export default store