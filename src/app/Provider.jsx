"use client";

import * as React from "react";

import {NextUIProvider} from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

export default function App({children}) {
  return (<SessionProvider><NextUIProvider>{children}</NextUIProvider></SessionProvider>);
}