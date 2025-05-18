import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Tailwind CSS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "LANShare - Local File Sharing",
	description: "Easily share files with anyone on your local network.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} bg-slate-900`}>
				{children}
			</body>
		</html>
	);
}
