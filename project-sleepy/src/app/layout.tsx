import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import NextAuthProvider from "./providers/NextAuthProvider";
import ReduxProvider from "@/redux/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Massage Booking Service",
  description: "Find and book the best massage services near you",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        <ReduxProvider>
          <NextAuthProvider session={session}>
            <div className="flex flex-col min-h-screen bg-white">
              <TopMenu />
              <div className="flex-grow w-full bg-white">
                {children}
              </div>
            </div>
          </NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}