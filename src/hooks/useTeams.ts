import { useState, useEffect } from "react";
import type { Team, TeamFormData } from "../types/team";

const TEAMS_STORAGE_KEY = "nba_teams";

export function useTeams() {
	const [teams, setTeams] = useState<Team[]>([]);

	useEffect(() => {
		const stored = localStorage.getItem(TEAMS_STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				setTeams(parsed);
			} catch (error) {
				console.error("Failed to load teams from localStorage:", error);
			}
		}
	}, []);

	const saveTeams = (updatedTeams: Team[]) => {
		setTeams(updatedTeams);
		localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(updatedTeams));
	};

	const createTeam = (data: TeamFormData): { success: boolean; error?: string } => {
		const nameExists = teams.some(
			(team) => team.name.toLowerCase() === data.name.toLowerCase(),
		);

		if (nameExists) {
			return { success: false, error: "Team name already exists" };
		}

		const newTeam: Team = {
			id: crypto.randomUUID(),
			name: data.name,
			region: data.region,
			country: data.country,
			playerIds: data.playerIds,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		saveTeams([...teams, newTeam]);
		return { success: true };
	};

	const updateTeam = (
		teamId: string,
		data: TeamFormData,
	): { success: boolean; error?: string } => {
		const nameExists = teams.some(
			(team) =>
				team.id !== teamId &&
				team.name.toLowerCase() === data.name.toLowerCase(),
		);

		if (nameExists) {
			return { success: false, error: "Team name already exists" };
		}

		const updatedTeams = teams.map((team) =>
			team.id === teamId
				? {
						...team,
						name: data.name,
						region: data.region,
						country: data.country,
						playerIds: data.playerIds,
						updatedAt: new Date().toISOString(),
					}
				: team,
		);

		saveTeams(updatedTeams);
		return { success: true };
	};

	const deleteTeam = (teamId: string) => {
		const updatedTeams = teams.filter((team) => team.id !== teamId);
		saveTeams(updatedTeams);
	};

	const getPlayerTeam = (playerId: number): Team | undefined => {
		return teams.find((team) => team.playerIds.includes(playerId));
	};

	const isPlayerInTeam = (playerId: number): boolean => {
		return teams.some((team) => team.playerIds.includes(playerId));
	};

	return {
		teams,
		createTeam,
		updateTeam,
		deleteTeam,
		getPlayerTeam,
		isPlayerInTeam,
	};
}
