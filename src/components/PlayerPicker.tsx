import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, UserPlus, Loader2 } from "lucide-react";
import { useInfinitePlayers } from "../hooks/useInfinitePlayers";
import { usePlayers } from "../hooks/usePlayers";
import { useTeams } from "../hooks/useTeams";
import { useDebounce } from "../hooks/useDebounce";

interface PlayerPickerProps {
	selectedPlayerIds: number[];
	onPlayerSelect: (playerIds: number[]) => void;
	excludeTeamId?: string;
}

export function PlayerPicker({
	selectedPlayerIds,
	onPlayerSelect,
	excludeTeamId,
}: PlayerPickerProps) {
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);

	const {
		data,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		error,
	} = useInfinitePlayers({
		search: debouncedSearch,
		per_page: 20,
	});

	const { data: selectedPlayersData } = usePlayers({
		player_ids: selectedPlayerIds.length > 0 ? selectedPlayerIds : undefined,
		per_page: 100,
	});

	const { isPlayerInTeam, getPlayerTeam } = useTeams();

	const observerTarget = useRef<HTMLDivElement>(null);
	const lastFetchTimeRef = useRef<number>(0);

	const searchedPlayers = data?.pages.flatMap((page) => page.data) || [];

	const allPlayers = useMemo(() => {
		const selectedPlayers = selectedPlayersData?.data || [];
		const combined = [...selectedPlayers];

		searchedPlayers.forEach((player) => {
			if (!combined.some((p) => p.id === player.id)) {
				combined.push(player);
			}
		});

		return combined;
	}, [searchedPlayers, selectedPlayersData]);

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

		const currentTarget = observerTarget.current;
		if (currentTarget) {
			observer.observe(currentTarget);
		}

		return () => {
			if (currentTarget) {
				observer.unobserve(currentTarget);
			}
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const handleAddPlayer = (playerId: number) => {
		if (!selectedPlayerIds.includes(playerId)) {
			onPlayerSelect([...selectedPlayerIds, playerId]);
		}
	};

	const handleRemovePlayer = (playerId: number) => {
		onPlayerSelect(selectedPlayerIds.filter((id) => id !== playerId));
	};

	const selectedPlayers =
		allPlayers.filter((player) => selectedPlayerIds.includes(player.id)) || [];

	const availablePlayers =
		allPlayers.filter((player) => {
			if (selectedPlayerIds.includes(player.id)) return false;

			const playerTeam = getPlayerTeam(player.id);

			if (playerTeam && playerTeam.id !== excludeTeamId) {
				return false;
			}

			return true;
		}) || [];

	return (
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Players
				</label>

				{selectedPlayers.length > 0 && (
					<div className="mb-4">
						<p className="text-sm text-gray-600 mb-2">Selected Players:</p>
						<div className="flex flex-wrap gap-2">
							{selectedPlayers.map((player) => (
								<div
									key={player.id}
									className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg"
								>
									<span className="text-sm font-medium">
										{player.first_name} {player.last_name}
									</span>
									<button
										type="button"
										onClick={() => handleRemovePlayer(player.id)}
										className="hover:bg-indigo-200 rounded p-0.5 transition-colors"
									>
										<X className="w-4 h-4" />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="relative mb-3">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search players to add..."
						className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
					/>
				</div>

				<div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
					{error && (
						<div className="p-4 bg-yellow-50 border-b border-yellow-100">
							<p className="text-sm text-yellow-800">{error.message}</p>
						</div>
					)}

					{isLoading && (
						<div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
							<Loader2 className="w-5 h-5 animate-spin" />
							<span>Loading players...</span>
						</div>
					)}

					{!isLoading && availablePlayers.length === 0 && (
						<div className="p-4 text-center text-gray-500">
							{search
								? "No available players found"
								: "Search for players to add to the team"}
						</div>
					)}

					{!isLoading &&
						availablePlayers.map((player) => (
							<button
								key={player.id}
								type="button"
								onClick={() => handleAddPlayer(player.id)}
								className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
							>
								<div className="text-left">
									<p className="font-medium text-gray-900">
										{player.first_name} {player.last_name}
									</p>
									<p className="text-sm text-gray-500">
										{player.position} • #{player.jersey_number} •{" "}
										{player.team.abbreviation}
									</p>
								</div>
								<UserPlus className="w-5 h-5 text-indigo-600" />
							</button>
						))}

					{!isLoading && availablePlayers.length > 0 && (
						<div ref={observerTarget} className="h-4" />
					)}

					{isFetchingNextPage && (
						<div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2 border-t border-gray-100">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span className="text-sm">Loading more players...</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
