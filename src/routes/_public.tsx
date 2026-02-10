import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/_public")({
	component: PublicLayout,
});

function PublicLayout() {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			navigate({ to: "/players" });
		}
	}, [isAuthenticated, isLoading, navigate]);

	return <Outlet />;
}
