import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
	id: string;
	email: string;
	name: string;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

const loadAuthFromStorage = (): AuthState => {
	if (typeof window === "undefined") {
		return {
			user: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
		};
	}

	try {
		const serializedAuth = localStorage.getItem("auth");
		if (serializedAuth) {
			const parsed = JSON.parse(serializedAuth);
			return {
				user: parsed.user,
				isAuthenticated: parsed.isAuthenticated,
				isLoading: false,
				error: null,
			};
		}
	} catch (error) {
		console.error("Failed to load auth state from localStorage:", error);
	}

	return {
		user: null,
		isAuthenticated: false,
		isLoading: false,
		error: null,
	};
};

const initialState: AuthState = loadAuthFromStorage();

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginStart: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		loginSuccess: (state, action: PayloadAction<User>) => {
			state.isLoading = false;
			state.isAuthenticated = true;
			state.user = action.payload;
			state.error = null;

			try {
				localStorage.setItem(
					"auth",
					JSON.stringify({
						user: action.payload,
						isAuthenticated: true,
					}),
				);
			} catch (error) {
				console.error("Failed to save auth state to localStorage:", error);
			}
		},
		loginFailure: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.isAuthenticated = false;
			state.user = null;
			state.error = action.payload;
		},
		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.error = null;

			try {
				localStorage.removeItem("auth");
			} catch (error) {}
		},
	},
});

export const { loginStart, loginSuccess, loginFailure, logout } =
	authSlice.actions;
export default authSlice.reducer;
