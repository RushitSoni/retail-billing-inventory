import { configureStore } from '@reduxjs/toolkit';
import tempReducer from './Slices/temp'

const store = configureStore({
    reducer:{
        temp: tempReducer
    }
})

export default store