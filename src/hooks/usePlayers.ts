import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api";

interface Player {
	id: number;
	first_name: string;
	last_name: string;
	position: string;
	height: string;
	weight: string;
	jersey_number: string;
	college: string;
	country: string;
	draft_year: number | null;
	draft_round: number | null;
	draft_number: number | null;
	team: {
		id: number;
		conference: string;
		division: string;
		city: string;
		name: string;
		full_name: string;
		abbreviation: string;
	};
}

interface PlayersResponse {
	data: Player[];
	meta: {
		next_cursor: number | null;
		per_page: number;
	};
}

interface UsePlayersOptions {
	cursor?: number;
	per_page?: number;
	search?: string;
	first_name?: string;
	last_name?: string;
	team_ids?: number[];
	player_ids?: number[];
}

export function usePlayers(options: UsePlayersOptions = {}) {
	const {
		cursor,
		per_page = 25,
		search,
		first_name,
		last_name,
		team_ids,
		player_ids,
	} = options;

	return useQuery<PlayersResponse, Error>({
		queryKey: [
			"players",
			{ cursor, per_page, search, first_name, last_name, team_ids, player_ids },
		],
		queryFn: async () => {
			const params = new URLSearchParams();

			if (cursor) params.append("cursor", cursor.toString());
			if (per_page) params.append("per_page", per_page.toString());
			if (search) params.append("search", search);
			if (first_name) params.append("first_name", first_name);
			if (last_name) params.append("last_name", last_name);

			if (team_ids && team_ids.length > 0) {
				team_ids.forEach((id) => params.append("team_ids[]", id.toString()));
			}

			if (player_ids && player_ids.length > 0) {
				player_ids.forEach((id) =>
					params.append("player_ids[]", id.toString()),
				);
			}

			const response = await apiClient.get<PlayersResponse>("/players", {
				params,
			});

			return response.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: true,
	});
}

export type { Player, PlayersResponse, UsePlayersOptions };
