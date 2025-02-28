import { createSlice } from "@reduxjs/toolkit";


const savedTheme = localStorage.getItem("darkMode") === "true";

const initialState = {
  darkMode: savedTheme,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode)
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
