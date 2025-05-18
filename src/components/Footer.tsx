const Footer = () => {
	const currentYear = new Date().getFullYear();
	return (
		<footer className="bg-slate-900 text-slate-400 text-center p-6 mt-12">
			<p>
				&copy; {currentYear} LANShare. All files are shared peer-to-peer
				on your local network.
			</p>
			<p className="text-xs mt-1">Use responsibly.</p>
		</footer>
	);
};

export default Footer;
