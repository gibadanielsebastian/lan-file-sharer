"use client"; // Needed for useState

import { useState } from "react";
import Navbar from "@/components/Navbar";
import UploadForm from "@/components/UploadForm";
import FileList from "@/components/FileList";
import Footer from "@/components/Footer";

// Define the backend URL at the top level if it's used across multiple components,
// or pass it as a prop. For simplicity, it's also defined in UploadForm and FileList.
// const BACKEND_URL = 'http://localhost:5000'; // Already defined in components

export default function HomePage() {
	const [refreshKey, setRefreshKey] = useState(0);

	const handleUploadSuccess = () => {
		setRefreshKey((prevKey) => prevKey + 1); // Increment key to trigger FileList refresh
	};

	return (
		<div className="min-h-screen bg-slate-800/50 text-slate-100 flex flex-col">
			<Navbar />
			<main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				<div className="max-w-4xl mx-auto">
					<UploadForm onUploadSuccess={handleUploadSuccess} />
					<FileList refreshTrigger={refreshKey} />
				</div>
			</main>
			<Footer />
		</div>
	);
}
