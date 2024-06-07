import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children, isAuth }) => {
	const [authUser, setAuthUser] = useState(isAuth || null);

	return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};

/*
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from 'your-google-oauth-library'; // Import your Google OAuth library

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        // Subscribe to authentication changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in
                setAuthUser(user);
            } else {
                // User is signed out
                setAuthUser(null);
            }
        });

        // Clean up subscription on unmount
        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ authUser }}>{children}</AuthContext.Provider>;
};
*/