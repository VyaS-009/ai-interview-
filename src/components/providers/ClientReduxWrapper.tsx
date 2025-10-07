// src/components/providers/ClientReduxWrapper.tsx
"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/lib/redux/store";
import { Spin } from "antd";

export default function ClientReduxWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<div className="flex h-screen w-full items-center justify-center"><Spin size="large" /></div>}
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}