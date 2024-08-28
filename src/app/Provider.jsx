import * as React from "react";

import {NextUIProvider} from "@nextui-org/react";

export default function App({children}) {
  return (<NextUIProvider>{children}</NextUIProvider>);
}