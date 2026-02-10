import { createFileRoute, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/_private")({
	component: PrivateLayout,
});

function PrivateLayout() {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate({ to: "/login" });
		}
	}, [isAuthenticated, navigate]);

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
				<div className="flex flex-col items-center gap-4">
					<div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
					<p className="text-lg text-gray-600 font-medium">Loading...</p>
				</div>
			</div>
		);
	}

	return <Outlet />;
}
