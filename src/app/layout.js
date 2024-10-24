import { Inter } from "next/font/google";
import "./globals.css";
import  Provider  from "./Provider";
import Navbar from "./components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  manifest: "/manifest.json",  
  title: "Resgate de Fauna",
  description: "Software para manejo de resgate de fauna",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Provider>
      <Navbar />
      {children}
      </Provider>
      </body>
    </html>
  );
}
