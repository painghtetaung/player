import { AlertTriangle, X } from "lucide-react";
import type { Team } from "../types/team";

interface DeleteTeamModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	team: Team | null;
}

export function DeleteTeamModal({
	isOpen,
	onClose,
	onConfirm,
	team,
}: DeleteTeamModalProps) {
	if (!isOpen || !team) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-red-100 rounded-lg">
							<AlertTriangle className="w-6 h-6 text-red-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900">Delete Team</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				<div className="p-6">
					<p className="text-gray-700 mb-4">
						Are you sure you want to delete{" "}
						<strong className="text-gray-900">"{team.name}"</strong>?
					</p>

					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
						<p className="text-sm text-red-800">
							<strong>Warning:</strong> This action cannot be undone.
						</p>
						{team.playerIds.length > 0 && (
							<p className="text-sm text-red-800 mt-2">
								All {team.playerIds.length} player(s) will be removed from this
								team.
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center justify-end gap-3 p-6 bg-gray-50 rounded-b-xl">
					<button
						onClick={onClose}
						className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
					>
						Delete Team
					</button>
				</div>
			</div>
		</div>
	);
}
