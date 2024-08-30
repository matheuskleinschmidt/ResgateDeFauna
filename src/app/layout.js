import { Inter } from "next/font/google";
import "./globals.css";
import  Provider  from "./Provider";
import Navbar from "./components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  manifest: "/manifest.json",  
  title: "ACME",
  description: "ACME - Animal Care Management Environment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Provider>
      <Navbar></Navbar>
      {children}
      </Provider>
      </body>
    </html>
  );
}
