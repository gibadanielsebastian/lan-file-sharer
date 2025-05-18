import { Share2, Wifi } from "lucide-react";

const Navbar = () => {
	return (
		<nav className="bg-slate-900 text-white shadow-lg">
			<div className="container mx-auto px-6 py-4 flex items-center justify-between">
				<div className="flex items-center">
					<Share2 className="h-8 w-8 mr-3 text-sky-400" />
					<h1 className="text-2xl font-bold tracking-tight">
						LAN<span className="text-sky-400">Share</span>
					</h1>
				</div>
				<div className="flex items-center text-sm text-slate-300">
					<Wifi size={20} className="mr-2 text-green-400" />
					<span>Connected to Local Network</span>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
