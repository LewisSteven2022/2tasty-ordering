import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "2Tasty - Jersey's Favorite Cafe",
	description:
		"Fresh, local ingredients prepared with love. Order online for delivery or collection.",
	keywords: "food delivery, Jersey cafe, fresh food, local ingredients, 2Tasty",
	authors: [{ name: "2Tasty" }],
	openGraph: {
		title: "2Tasty - Jersey's Favorite Cafe",
		description:
			"Fresh, local ingredients prepared with love. Order online for delivery or collection.",
		type: "website",
		locale: "en_GB",
	},
	twitter: {
		card: "summary_large_image",
		title: "2Tasty - Jersey's Favorite Cafe",
		description:
			"Fresh, local ingredients prepared with love. Order online for delivery or collection.",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#f1641f",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full">
			<body className={`${inter.className} h-full antialiased`}>
				<div id="root" className="min-h-full">
					{children}
				</div>
			</body>
		</html>
	);
}
