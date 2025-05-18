"use client";

import {
	Download,
	File as FileIcon,
	ServerCrash,
	RefreshCw,
	FileText,
	Loader2,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

// Dynamically construct BACKEND_URL
let backendHostFileList = "http://localhost:5000"; // Default
if (typeof window !== "undefined") {
	backendHostFileList = `${window.location.protocol}//${window.location.hostname}:5000`;
}
const BACKEND_URL = backendHostFileList;

// Interface for file data received from the backend
interface SharedFile {
	id: string;
	name: string;
	size: string; // Formatted size string from backend
	rawSize: number; // Raw size in bytes from backend
	type: string;
	uploadedAt: string; // ISO date string
	uploader?: string;
	_internal_filename?: string; // Backend internal filename
}

interface FileListProps {
	refreshTrigger: number; // A prop to trigger refresh
}

const FileList = ({ refreshTrigger }: FileListProps) => {
	const [files, setFiles] = useState<SharedFile[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentBackendUrl, setCurrentBackendUrl] = useState(BACKEND_URL);

	// Re-evaluate BACKEND_URL on client-side mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			const dynamicBackendUrl = `${window.location.protocol}//${window.location.hostname}:5000`;
			setCurrentBackendUrl(dynamicBackendUrl);
		}
	}, []);

	const fetchFiles = useCallback(async () => {
		// Use currentBackendUrl which is set in useEffect to ensure it has the correct client-side hostname
		if (!currentBackendUrl.startsWith("http")) {
			// Guard against initial undefined or incorrect value
			console.warn(
				"Backend URL not ready or invalid, skipping fetch.",
				currentBackendUrl
			);
			// Optionally set an error or wait
			setError("Backend URL is not configured correctly yet.");
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(`${currentBackendUrl}/api/files`);
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({
					error: `Server error: ${response.statusText}`,
				}));
				throw new Error(
					errorData.error ||
						`Failed to fetch files: ${response.statusText}`
				);
			}
			const data: SharedFile[] = await response.json();
			setFiles(data);
		} catch (err: any) {
			console.error(
				"Fetch files error:",
				err,
				"using URL:",
				`${currentBackendUrl}/api/files`
			);
			setError(
				err.message ||
					"Could not connect to the server or an unknown error occurred."
			);
			setFiles([]);
		} finally {
			setIsLoading(false);
		}
	}, [currentBackendUrl]); // Add currentBackendUrl as a dependency

	useEffect(() => {
		// Ensure currentBackendUrl is valid before fetching
		if (currentBackendUrl.startsWith("http")) {
			fetchFiles();
		}
	}, [fetchFiles, refreshTrigger, currentBackendUrl]); // Add currentBackendUrl as a dependency

	const handleDownload = (file: SharedFile) => {
		window.location.href = `${currentBackendUrl}/api/download/${file.id}`;
	};

	const formatUploadTime = (isoDate: string) => {
		try {
			const date = new Date(isoDate);
			if (isNaN(date.getTime())) return "Invalid date";
			return date.toLocaleString([], {
				dateStyle: "medium",
				timeStyle: "short",
			});
		} catch (e) {
			return "Invalid date";
		}
	};

	if (isLoading) {
		return (
			<div className="text-center py-10 bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl mt-8">
				<Loader2 className="h-12 w-12 text-sky-400 animate-spin mx-auto" />
				<p className="mt-4 text-slate-300">Loading shared files...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-10 bg-red-900/30 border border-red-700 p-6 rounded-lg mt-8">
				<ServerCrash className="h-12 w-12 text-red-400 mx-auto" />
				<p className="mt-4 text-red-300 font-semibold">
					Error Loading Files
				</p>
				<p className="text-red-400 text-sm mb-6">{error}</p>
				<button
					onClick={fetchFiles}
					className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
				>
					<RefreshCw size={18} className="mr-2" />
					Try Again
				</button>
			</div>
		);
	}

	if (files.length === 0) {
		return (
			<div className="text-center py-10 bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl mt-8">
				<FileIcon className="h-12 w-12 text-slate-500 mx-auto" />
				<p className="mt-4 text-slate-400">
					No files are currently shared on the network.
				</p>
				<p className="text-slate-500 text-sm">
					Upload some files to get started!
				</p>
			</div>
		);
	}

	return (
		<div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl mt-8">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-semibold text-sky-400">
					Available Files
				</h2>
				<button
					onClick={fetchFiles}
					className="text-sky-400 hover:text-sky-300 p-2 rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-1 focus:ring-sky-400"
					title="Refresh file list"
					disabled={isLoading}
				>
					{isLoading ? (
						<Loader2 className="animate-spin h-5 w-5" />
					) : (
						<RefreshCw size={20} />
					)}
				</button>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full min-w-[600px] text-left text-sm text-slate-300">
					<thead className="border-b border-slate-700 text-xs uppercase text-slate-400">
						<tr>
							<th scope="col" className="py-3 px-4">
								File Name
							</th>
							<th scope="col" className="py-3 px-4">
								Size
							</th>
							<th
								scope="col"
								className="py-3 px-4 hidden md:table-cell"
							>
								Uploader IP
							</th>
							<th
								scope="col"
								className="py-3 px-4 hidden lg:table-cell"
							>
								Uploaded At
							</th>
							<th scope="col" className="py-3 px-4 text-center">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{files.map((file) => (
							<tr
								key={file.id}
								className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
							>
								<td className="py-3 px-4 font-medium text-slate-100 flex items-center">
									<FileText
										size={18}
										className="mr-3 text-sky-400 flex-shrink-0"
									/>
									<span
										className="truncate"
										title={file.name}
									>
										{file.name}
									</span>
								</td>
								<td className="py-3 px-4">{file.size}</td>
								<td
									className="py-3 px-4 text-slate-400 hidden md:table-cell truncate"
									title={file.uploader || "Unknown"}
								>
									{file.uploader || "N/A"}
								</td>
								<td className="py-3 px-4 text-slate-400 hidden lg:table-cell">
									{formatUploadTime(file.uploadedAt)}
								</td>
								<td className="py-3 px-4 text-center">
									<button
										onClick={() => handleDownload(file)}
										className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center transition-colors text-xs shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
									>
										<Download
											size={16}
											className="mr-1.5"
										/>
										Download
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default FileList;
