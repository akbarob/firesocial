import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { socialApi } from "./Services/socialApi";

export const store = configureStore({
  reducer: { [socialApi.reducerPath]: socialApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socialApi.middleware),
});

setupListeners(store.dispatch);
