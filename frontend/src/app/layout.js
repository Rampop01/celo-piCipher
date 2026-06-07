import { Orbitron } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata = {
  title: "PicCipher",
  description: "A picture-word guessing game on Celo",
  other: {
    "talentapp:project_verification": "9d25ab3ae17b10b809fc45ec76bd66286674724e417d199ad695eb269d7d197d0548b9c60fcecd81b55bd80ca590c04dbf8f541ab59cefd79777bb0b6f428dfc",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} font-orbitron`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
