import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Search, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useInfinitePlayers } from "../../hooks/useInfinitePlayers";

export const Route = createFileRoute("/_private/players")({
	component: PlayersPage,
});

function PlayersPage() {
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);

	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfinitePlayers({
		search: debouncedSearch,
		per_page: 10,
	});

	const loadMoreRef = useRef<HTMLDivElement>(null);
	const lastFetchTimeRef = useRef<number>(0);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const now = Date.now();
				const timeSinceLastFetch = now - lastFetchTimeRef.current;

				if (
					entries[0].isIntersecting &&
					hasNextPage &&
					!isFetchingNextPage &&
					timeSinceLastFetch > 1000
				) {
					lastFetchTimeRef.current = now;
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => {
			if (loadMoreRef.current) {
				observer.unobserve(loadMoreRef.current);
			}
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const allPlayers = data?.pages.flatMap((page) => page.data) ?? [];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="max-w-7xl mx-auto px-4 py-12">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">NBA Players</h1>
					<p className="text-gray-600">Search and explore NBA player data</p>
				</div>

				<div className="mb-8">
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search players..."
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
						/>
					</div>
				</div>

				{isLoading && (
					<div className="flex items-center justify-center py-12">
						<div className="flex flex-col items-center gap-4">
							<div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
							<p className="text-lg text-gray-600 font-medium">
								Loading players...
							</p>
						</div>
					</div>
				)}

				{error && (
					<div
						className={`mb-4 border px-6 py-4 rounded-lg ${
							error.message?.includes("Rate limit")
								? "bg-yellow-50 border-yellow-200 text-yellow-800"
								: "bg-red-50 border-red-200 text-red-700"
						}`}
					>
						<p className="font-medium">
							{error.message?.includes("Rate limit")
								? "Rate Limit Reached"
								: "Error loading players"}
						</p>
						<p className="text-sm mt-1">{error.message}</p>
					</div>
				)}

				{!isLoading && allPlayers.length > 0 && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{allPlayers.map((player) => (
								<div
									key={player.id}
									className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
								>
									<div className="flex items-start gap-4">
										<div className="p-3 bg-indigo-100 rounded-lg">
											<User className="w-6 h-6 text-indigo-600" />
										</div>
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-gray-900">
												{player.first_name} {player.last_name}
											</h3>
											<p className="text-sm text-gray-600 mt-1">
												{player.position || "N/A"} • #
												{player.jersey_number || "N/A"}
											</p>
											<div className="mt-3 pt-3 border-t border-gray-100">
												<p className="text-sm font-medium text-gray-700">
													{player.team.full_name}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{player.height || "N/A"} • {player.weight || "N/A"}
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>

						<div ref={loadMoreRef} className="mt-8 text-center">
							{isFetchingNextPage && (
								<div className="flex items-center justify-center gap-2 text-indigo-600">
									<Loader2 className="w-6 h-6 animate-spin" />
									<span className="font-medium">Loading more players...</span>
								</div>
							)}
							{!hasNextPage && (
								<p className="text-sm text-gray-500">
									No more players to load • Total: {allPlayers.length}
								</p>
							)}
						</div>
					</>
				)}

				{!isLoading && allPlayers.length === 0 && (
					<div className="text-center py-12">
						<User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<p className="text-lg text-gray-600">No players found</p>
						<p className="text-sm text-gray-500 mt-2">
							Try a different search term
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
