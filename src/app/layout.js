import { Inter } from "next/font/google";
import "./globals.css";
import  Provider  from "./Provider";
import Navbar from "./components/NavBar";
import {ThemeProvider}  from "./components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  manifest: "/manifest.json",  
  title: "Resgate de Fauna",
  description: "Software para manejo de resgate de fauna",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
      <Provider>
      <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
      <Navbar />
      {children}
      </ThemeProvider>
      </Provider>
      </body>
    </html>
  );
}
