export function isAuthenticated(): boolean {
	if (typeof window === "undefined") {
		return false;
	}

	try {
		const auth = localStorage.getItem("auth");
		if (!auth) return false;

		const parsed = JSON.parse(auth);
		return parsed.isAuthenticated === true;
	} catch (error) {
		console.error("Error checking auth:", error);
		return false;
	}
}

export function getAuthUser() {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const auth = localStorage.getItem("auth");
		if (!auth) return null;

		const parsed = JSON.parse(auth);
		return parsed.user || null;
	} catch (error) {
		console.error("Error getting auth user:", error);
		return null;
	}
}
