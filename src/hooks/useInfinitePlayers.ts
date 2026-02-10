import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import type { Player, PlayersResponse } from "./usePlayers";

interface UseInfinitePlayersOptions {
	per_page?: number;
	search?: string;
	first_name?: string;
	last_name?: string;
	team_ids?: number[];
	player_ids?: number[];
}

export function useInfinitePlayers(options: UseInfinitePlayersOptions = {}) {
	const {
		per_page = 10,
		search,
		first_name,
		last_name,
		team_ids,
		player_ids,
	} = options;

	return useInfiniteQuery<PlayersResponse, Error>({
		queryKey: [
			"players-infinite",
			{ per_page, search, first_name, last_name, team_ids, player_ids },
		],
		queryFn: async ({ pageParam }) => {
			const params = new URLSearchParams();

			if (pageParam) params.append("cursor", pageParam.toString());
			params.append("per_page", per_page.toString());

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

			try {
				const response = await apiClient.get<PlayersResponse>("/players", {
					params,
				});

				return response.data;
			} catch (error: any) {
				if (error.response?.status === 429) {
					const retryAfter = error.response.headers["retry-after"];
					const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;

					throw new Error(
						`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds before trying again.`,
					);
				}
				throw error;
			}
		},
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => {
			return lastPage.meta.next_cursor ?? undefined;
		},
		staleTime: 1000 * 60 * 10,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		retry: (failureCount, error: any) => {
			if (error.message?.includes("Rate limit exceeded")) {
				return false;
			}
			return failureCount < 2;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});
}

export type { Player, PlayersResponse, UseInfinitePlayersOptions };
