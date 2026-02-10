import { X, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { Team, TeamFormData } from "../types/team";
import { PlayerPicker } from "./PlayerPicker";

interface TeamModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: TeamFormData) => { success: boolean; error?: string };
	team?: Team;
	mode: "create" | "edit";
}

export function TeamModal({
	isOpen,
	onClose,
	onSubmit,
	team,
	mode,
}: TeamModalProps) {
	const [formData, setFormData] = useState<TeamFormData>({
		name: "",
		region: "",
		country: "",
		playerIds: [],
	});
	const [errors, setErrors] = useState<Partial<Record<keyof TeamFormData, string>>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string>("");

	useEffect(() => {
		if (team && mode === "edit") {
			setFormData({
				name: team.name,
				region: team.region,
				country: team.country,
				playerIds: team.playerIds,
			});
		} else {
			setFormData({
				name: "",
				region: "",
				country: "",
				playerIds: [],
			});
		}
		setErrors({});
		setSubmitError("");
	}, [team, mode, isOpen]);

	const validate = (): boolean => {
		const newErrors: Partial<Record<keyof TeamFormData, string>> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Team name is required";
		} else if (formData.name.trim().length < 3) {
			newErrors.name = "Team name must be at least 3 characters";
		}

		if (!formData.region.trim()) {
			newErrors.region = "Region is required";
		}

		if (!formData.country.trim()) {
			newErrors.country = "Country is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) return;

		setIsSubmitting(true);
		setSubmitError("");

		setTimeout(() => {
			const result = onSubmit(formData);

			if (result.success) {
				onClose();
			} else {
				setSubmitError(result.error || "An error occurred");
			}

			setIsSubmitting(false);
		}, 300);
	};

	const handlePlayerSelect = (playerIds: number[]) => {
		setFormData({ ...formData, playerIds });
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-2xl font-bold text-gray-900">
						{mode === "create" ? "Create New Team" : "Edit Team"}
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					{submitError && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
							<AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
							<span>{submitError}</span>
						</div>
					)}

					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
							Team Name *
						</label>
						<input
							id="name"
							type="text"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
								errors.name ? "border-red-300" : "border-gray-300"
							}`}
							placeholder="Enter team name"
						/>
						{errors.name && (
							<p className="text-red-600 text-sm mt-1">{errors.name}</p>
						)}
					</div>

					<div>
						<label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
							Region *
						</label>
						<input
							id="region"
							type="text"
							value={formData.region}
							onChange={(e) => setFormData({ ...formData, region: e.target.value })}
							className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
								errors.region ? "border-red-300" : "border-gray-300"
							}`}
							placeholder="e.g., North America, Europe, Asia"
						/>
						{errors.region && (
							<p className="text-red-600 text-sm mt-1">{errors.region}</p>
						)}
					</div>

					<div>
						<label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
							Country *
						</label>
						<input
							id="country"
							type="text"
							value={formData.country}
							onChange={(e) => setFormData({ ...formData, country: e.target.value })}
							className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
								errors.country ? "border-red-300" : "border-gray-300"
							}`}
							placeholder="e.g., USA, Canada, UK"
						/>
						{errors.country && (
							<p className="text-red-600 text-sm mt-1">{errors.country}</p>
						)}
					</div>

					<PlayerPicker
						selectedPlayerIds={formData.playerIds}
						onPlayerSelect={handlePlayerSelect}
						excludeTeamId={team?.id}
					/>

					<div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
						<p className="text-sm">
							<strong>Player Count:</strong> {formData.playerIds.length} player(s) selected
						</p>
					</div>

					<div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
							{isSubmitting
								? "Saving..."
								: mode === "create"
									? "Create Team"
									: "Update Team"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
