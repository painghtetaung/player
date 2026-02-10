import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

interface User {
	id: string;
	email: string;
	name: string;
}

interface AuthContext {
	isAuthenticated: boolean;
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const savedAuth = localStorage.getItem("auth");
		if (savedAuth) {
			try {
				const parsed = JSON.parse(savedAuth);
				setUser(parsed.user);
				setIsAuthenticated(parsed.isAuthenticated);
			} catch (error) {
				console.error("Failed to load auth from localStorage:", error);
			}
		}
	}, []);

	const login = (userData: User) => {
		setUser(userData);
		setIsAuthenticated(true);
		localStorage.setItem(
			"auth",
			JSON.stringify({
				user: userData,
				isAuthenticated: true,
			}),
		);
	};

	const logout = () => {
		setUser(null);
		setIsAuthenticated(false);
		localStorage.removeItem("auth");
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
}
