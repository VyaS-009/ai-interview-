// src/lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createMigrate } from "redux-persist";
import { combineReducers } from "redux";
import interviewReducer from "./slices/interviewSlice";
import uiReducer from "./slices/uiSlice";
import { interviewApi } from "@/lib/api/interviewApi";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const migrations = {
  // The version number should be one higher than the previous version.
  // Since the old state has no version, it's considered -1.
  // This migration will run for any state that doesn't have a version >= 2.
  2: (state: any) => {
    // Migration to move `candidates` from root into `interview` slice
    if (state && state.candidates && state.interview) {
      const { candidates, ...rest } = state;
      return {
        ...rest,
        interview: { ...state.interview, candidates: candidates },
      };
    }
    return state;
  },
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["interview", "ui"],
  version: 2, // Bump the version to apply the migration
  migrate: createMigrate(migrations, { debug: process.env.NODE_ENV === 'development' }),
};

const rootReducer = combineReducers({
  interview: interviewReducer,
  ui: uiReducer,
  [interviewApi.reducerPath]: interviewApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(interviewApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
