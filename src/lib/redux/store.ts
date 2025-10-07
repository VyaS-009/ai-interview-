// src/lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createMigrate, PersistState, PersistConfig, PersistedState } from "redux-persist";
import { combineReducers } from "redux";
import interviewReducer from "./slices/interviewSlice";
import { UIState } from "./slices/uiSlice";
import { InterviewState } from "@/types/interview";
import uiReducer from "./slices/uiSlice";
import { interviewApi } from "@/lib/api/interviewApi";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => ({
  getItem(): Promise<null> {
    return Promise.resolve(null);
  },
  setItem(_: string, value: unknown) {
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

const rootReducer = combineReducers({
  interview: interviewReducer,
  ui: uiReducer,
  [interviewApi.reducerPath]: interviewApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

interface OldStateV1 {
  candidates: unknown[];
  interview?: Partial<InterviewState>;
  ui: UIState;
  _persist: PersistState;
}

const migrations = {
  // The version number should be one higher than the previous version.
  // Since the old state has no version, it's considered -1.
  // This migration will run for any state that doesn't have a version >= 2.
  2: (state: PersistedState | undefined): PersistedState | undefined => {
    // Handle case where state is not defined
    if (!state) {
      return undefined;
    }
    const oldState = state as unknown as OldStateV1;

    // Migration to move `candidates` from root into `interview` slice
    if (oldState.candidates && oldState.interview) {
      const { candidates, interview, ...rest } = oldState;
      return {
        ...rest,
        interview: { ...interview, candidates: candidates },
      } as PersistedState;
    }
    return state;
  },
};

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["interview", "ui"],
  version: 2, // Bump the version to apply the migration
  migrate: createMigrate(migrations, { debug: process.env.NODE_ENV === 'development' }),
};
 
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

export type AppDispatch = typeof store.dispatch;
