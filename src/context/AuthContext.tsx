"use client";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { upsertUser } from "@/lib/db/users";

interface AuthContextType {
	user: { id: string; email: string; username?: string } | null;
	loading: boolean;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthContextType["user"]>(null);
	const [loading, setLoading] = useState(true);

	const signOut = async () => {
		try {
			await firebaseSignOut(auth);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				try {
					// First upsert the user to ensure we have a record
					const dbUser = await upsertUser({
						id: firebaseUser.uid,
						email: firebaseUser.email!,
						username: firebaseUser.displayName || undefined,
					});

					// Combine Firebase user with Prisma user data
					setUser({
						id: dbUser.id,
						email: dbUser.email,
						username: dbUser?.username,
					});
				} catch (error) {
					console.error("Error syncing user data:", error);
					setUser(null);
				}
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}
