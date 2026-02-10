export function isAuthenticated(): boolean {
	if (typeof window === "undefined") {
		return false;
	}

	try {
		const auth = localStorage.getItem("auth");
		if (!auth) return false;

		const parsed = JSON.parse(auth);
		return parsed.isAuthenticated === true;
	} catch (_) {
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
	} catch (_) {
		return null;
	}
}
