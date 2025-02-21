import { configureStore } from '@reduxjs/toolkit';
import tempReducer from './Slices/temp'
import themeReducer from './Slices/themeSlice'

const store = configureStore({
    reducer:{
        temp: tempReducer,
        theme: themeReducer,
    }
})

export default store