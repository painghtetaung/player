import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit2, Trash2, Users as UsersIcon } from "lucide-react";
import { useTeams } from "../../hooks/useTeams";
import { TeamModal } from "../../components/TeamModal";
import { DeleteTeamModal } from "../../components/DeleteTeamModal";
import type { Team } from "../../types/team";

export const Route = createFileRoute("/_private/teams")({
	component: TeamsPage,
});

function TeamsPage() {
	const { teams, createTeam, updateTeam, deleteTeam } = useTeams();

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

	const handleEdit = (team: Team) => {
		setSelectedTeam(team);
		setIsEditModalOpen(true);
	};

	const handleDelete = (team: Team) => {
		setSelectedTeam(team);
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = () => {
		if (selectedTeam) {
			deleteTeam(selectedTeam.id);
			setSelectedTeam(null);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="max-w-7xl mx-auto px-4 py-12">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-4xl font-bold text-gray-900 mb-2">Teams</h1>
						<p className="text-gray-600">
							Manage your teams and assign players
						</p>
					</div>
					<button
						onClick={() => setIsCreateModalOpen(true)}
						className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30"
					>
						<Plus className="w-5 h-5" />
						Create Team
					</button>
				</div>

				{teams.length === 0 ? (
					<div className="text-center py-20">
						<UsersIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-700 mb-2">
							No teams yet
						</h3>
						<p className="text-gray-500 mb-6">
							Create your first team to get started
						</p>
						<button
							onClick={() => setIsCreateModalOpen(true)}
							className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
						>
							<Plus className="w-5 h-5" />
							Create Team
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{teams.map((team) => (
							<div
								key={team.id}
								className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
							>
								<div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
									<h3 className="text-2xl font-bold mb-2">{team.name}</h3>
									<div className="flex items-center gap-2 text-indigo-100">
										<UsersIcon className="w-4 h-4" />
										<span className="text-sm">
											{team.playerIds.length} Player
											{team.playerIds.length !== 1 ? "s" : ""}
										</span>
									</div>
								</div>

								<div className="p-6">
									<div className="space-y-3 mb-4">
										<div>
											<p className="text-xs text-gray-500 uppercase tracking-wide">
												Region
											</p>
											<p className="text-sm font-semibold text-gray-900">
												{team.region}
											</p>
										</div>
										<div>
											<p className="text-xs text-gray-500 uppercase tracking-wide">
												Country
											</p>
											<p className="text-sm font-semibold text-gray-900">
												{team.country}
											</p>
										</div>
									</div>

									{/* Actions */}
									<div className="flex items-center gap-2 pt-4 border-t border-gray-100">
										<button
											onClick={() => handleEdit(team)}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
										>
											<Edit2 className="w-4 h-4" />
											Edit
										</button>
										<button
											onClick={() => handleDelete(team)}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
										>
											<Trash2 className="w-4 h-4" />
											Delete
										</button>
									</div>
								</div>

								{/* Footer */}
								<div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
									<p className="text-xs text-gray-500">
										Updated: {new Date(team.updatedAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<TeamModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={createTeam}
				mode="create"
			/>

			<TeamModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedTeam(null);
				}}
				onSubmit={(data) => {
					if (selectedTeam) {
						return updateTeam(selectedTeam.id, data);
					}
					return { success: false, error: "No team selected" };
				}}
				team={selectedTeam || undefined}
				mode="edit"
			/>

			<DeleteTeamModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedTeam(null);
				}}
				onConfirm={handleConfirmDelete}
				team={selectedTeam}
			/>
		</div>
	);
}
