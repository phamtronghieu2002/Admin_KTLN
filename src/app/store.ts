import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import userReducer from "../features/user/userSlice"
import interfaceReducer from "../features/interface/interfaceSlice"
import appReducer from "../features/app/appSlice"


export const store = configureStore({
  reducer: {
    user: userReducer,
    interface: interfaceReducer,
    app:appReducer

  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
