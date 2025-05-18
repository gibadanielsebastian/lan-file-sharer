"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";

// Dynamically construct BACKEND_URL based on the hostname the frontend is served from
// This ensures it works when accessed via localhost or LAN IP.
// The backend is assumed to be on the same host, but port 5000.
let backendHost = "http://localhost:5000"; // Default for SSR or if window is not defined yet
if (typeof window !== "undefined") {
	backendHost = `${window.location.protocol}//${window.location.hostname}:5000`;
}
const BACKEND_URL = backendHost;

interface UploadedFile {
	file: File;
	id: string; // Client-side ID for managing the list before upload
}

interface UploadFormProps {
	onUploadSuccess: () => void; // Callback to refresh file list
}

const UploadForm = ({ onUploadSuccess }: UploadFormProps) => {
	const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0); // For future progress bar
	const [currentBackendUrl, setCurrentBackendUrl] = useState(BACKEND_URL);

	// Re-evaluate BACKEND_URL on client-side mount if it wasn't set correctly initially
	useEffect(() => {
		if (typeof window !== "undefined") {
			const dynamicBackendUrl = `${window.location.protocol}//${window.location.hostname}:5000`;
			setCurrentBackendUrl(dynamicBackendUrl);
		}
	}, []);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const newFiles = Array.from(event.target.files).map((file) => ({
				file,
				id: Math.random().toString(36).substring(7),
			}));
			setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
			event.target.value = ""; // Reset file input to allow selecting the same file again
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);
		if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			const newFiles = Array.from(event.dataTransfer.files).map(
				(file) => ({
					file,
					id: Math.random().toString(36).substring(7),
				})
			);
			setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
			event.dataTransfer.clearData();
		}
	};

	const removeFile = (id: string) => {
		setSelectedFiles((prevFiles) =>
			prevFiles.filter((fileWrapper) => fileWrapper.id !== id)
		);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (selectedFiles.length === 0) {
			alert("Please select files to upload.");
			return;
		}

		setIsUploading(true);
		setUploadProgress(0); // Reset progress

		const formData = new FormData();
		selectedFiles.forEach((fileWrapper) => {
			formData.append("files", fileWrapper.file);
		});

		try {
			const response = await fetch(`${currentBackendUrl}/api/upload`, {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const result = await response.json();
				alert(result.message || "Files uploaded successfully!");
				setSelectedFiles([]);
				onUploadSuccess();
			} else {
				const errorData = await response.json().catch(() => ({
					error: `Upload failed: ${response.statusText}`,
				}));
				alert(
					errorData.error || `Upload failed: ${response.statusText}`
				);
			}
		} catch (error: any) {
			console.error("Upload error:", error);
			alert(
				`An error occurred during upload: ${
					error.message || "Network error or server unavailable."
				}`
			);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl">
			<h2 className="text-2xl font-semibold text-sky-400 mb-6">
				Share Files
			</h2>
			<form onSubmit={handleSubmit}>
				<div
					className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer
                     ${
							isDragging
								? "border-sky-400 bg-slate-700"
								: "border-slate-600 hover:border-sky-500"
						}
                     transition-colors duration-200 ease-in-out relative ${
							isUploading ? "opacity-50 pointer-events-none" : ""
						}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={() =>
						!isUploading &&
						document.getElementById("fileInput")?.click()
					}
				>
					<input
						type="file"
						id="fileInput"
						multiple
						onChange={handleFileChange}
						className="hidden"
						accept="*"
						disabled={isUploading}
					/>
					<UploadCloud
						className={`mx-auto h-16 w-16 mb-4 ${
							isDragging ? "text-sky-400" : "text-slate-500"
						}`}
					/>
					<p className="text-slate-300">
						{isDragging
							? "Drop files here"
							: "Drag & drop files here, or click to select"}
					</p>
					<p className="text-xs text-slate-400 mt-1">
						Max file size: 1GB (as per backend config)
					</p>
				</div>

				{isUploading && (
					<div className="mt-4 text-center">
						<Loader2 className="h-8 w-8 text-sky-400 animate-spin mx-auto" />
						<p className="text-slate-300 mt-2">
							Uploading files, please wait...
						</p>
					</div>
				)}

				{selectedFiles.length > 0 && !isUploading && (
					<div className="mt-6">
						<h3 className="text-sm font-medium text-slate-300 mb-2">
							Selected files:
						</h3>
						<ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
							{selectedFiles.map((fileWrapper) => (
								<li
									key={fileWrapper.id}
									className="flex items-center justify-between bg-slate-700 p-2 rounded-md text-sm"
								>
									<div className="flex items-center overflow-hidden">
										<FileText
											size={18}
											className="mr-2 text-sky-400 flex-shrink-0"
										/>
										<span
											className="text-slate-200 truncate"
											title={fileWrapper.file.name}
										>
											{fileWrapper.file.name}
										</span>
										<span className="text-slate-400 ml-2 flex-shrink-0">
											(
											{(
												fileWrapper.file.size /
												1024 /
												1024
											).toFixed(2)}{" "}
											MB)
										</span>
									</div>
									<button
										type="button"
										onClick={() =>
											removeFile(fileWrapper.id)
										}
										className="text-red-400 hover:text-red-300 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
										aria-label="Remove file"
									>
										<X size={18} />
									</button>
								</li>
							))}
						</ul>
					</div>
				)}

				<button
					type="submit"
					disabled={selectedFiles.length === 0 || isUploading}
					className="mt-8 w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 flex items-center justify-center"
				>
					{isUploading ? (
						<>
							<Loader2 className="animate-spin h-5 w-5 mr-3" />
							Uploading...
						</>
					) : (
						"Upload Selected Files"
					)}
				</button>
			</form>
		</div>
	);
};

export default UploadForm;
