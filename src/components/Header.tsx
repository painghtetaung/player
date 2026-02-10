import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogIn, LogOut, Menu, User, X, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const { isAuthenticated, user, logout } = useAuth();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleLogout = () => {
		logout();
		setIsOpen(false);
		window.location.href = "/login";
	};

	return (
		<>
			<header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
				<div className="flex items-center">
					<button
						onClick={() => setIsOpen(true)}
						className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
						aria-label="Open menu"
					>
						<Menu size={24} />
					</button>
					<h1 className="ml-4 text-xl font-semibold">
						<Link to="/dashboard">
							<img
								src="/tanstack-word-logo-white.svg"
								alt="TanStack Logo"
								className="h-10"
							/>
						</Link>
					</h1>
				</div>

				<div className="flex items-center gap-3">
					{!mounted ? (
						<div className="w-24 h-10 bg-gray-700 rounded-lg animate-pulse" />
					) : isAuthenticated && user ? (
						<div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
							<User size={20} />
							<span className="text-sm font-medium">{user.name}</span>
						</div>
					) : (
						<Link
							to="/login"
							className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
						>
							<LogIn size={20} />
							<span className="font-medium">Login</span>
						</Link>
					)}
				</div>
			</header>

			<aside
				className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-4 border-b border-gray-700">
					<h2 className="text-xl font-bold">Navigation</h2>
					<button
						onClick={() => setIsOpen(false)}
						className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
						aria-label="Close menu"
					>
						<X size={24} />
					</button>
				</div>

				<nav className="flex-1 p-4 overflow-y-auto">
					{!mounted ? (
						<div className="h-12 bg-gray-800 rounded-lg animate-pulse" />
					) : isAuthenticated ? (
						<>
							<Link
								to="/dashboard"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
								activeProps={{
									className:
										"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
								}}
							>
								<LayoutDashboard size={20} />
								<span className="font-medium">Dashboard</span>
							</Link>
							<Link
								to="/players"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
								activeProps={{
									className:
										"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
								}}
							>
								<Users size={20} />
								<span className="font-medium">Players</span>
							</Link>
						</>
					) : (
						<Link
							to="/login"
							onClick={() => setIsOpen(false)}
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
							activeProps={{
								className:
									"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
							}}
						>
							<LogIn size={20} />
							<span className="font-medium">Login</span>
						</Link>
					)}
				</nav>

				<div className="p-4 border-t border-gray-700">
					{!mounted ? (
						<div className="h-20 bg-gray-800 rounded-lg animate-pulse" />
					) : isAuthenticated && user ? (
						<div className="space-y-2">
							<div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
								<User size={20} />
								<div className="flex-1">
									<p className="font-medium">{user.name}</p>
									<p className="text-sm text-gray-400">{user.email}</p>
								</div>
							</div>
							<button
								onClick={handleLogout}
								className="w-full flex items-center justify-center gap-2 p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
							>
								<LogOut size={20} />
								<span className="font-medium">Logout</span>
							</button>
						</div>
					) : (
						<Link
							to="/login"
							onClick={() => setIsOpen(false)}
							className="flex items-center justify-center gap-2 p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
						>
							<LogIn size={20} />
							<span className="font-medium">Login</span>
						</Link>
					)}
				</div>
			</aside>
		</>
	);
}
