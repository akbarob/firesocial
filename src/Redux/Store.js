import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { socialApi } from "./Services/socialApi";
import userReducer from "./Features/UserSlice";

export const store = configureStore({
  reducer: { [socialApi.reducerPath]: socialApi.reducer, user: userReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      socialApi.middleware
    ),
});

setupListeners(store.dispatch);
