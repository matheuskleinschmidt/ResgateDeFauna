"use client"; // This directive makes this a client component

import { SessionProvider } from "next-auth/react";

export default function AppProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
