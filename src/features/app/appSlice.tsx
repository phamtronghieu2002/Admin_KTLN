import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import { act } from "react"

interface appState {
  categories: any
}

// Define the initial state using that type
const initialState: appState = {
  categories: null,
}

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    initAppCategory: (state, action: any) => {
      state.categories = action.payload
    },
  },
})

export const { initAppCategory } = appSlice.actions

export default appSlice.reducer
