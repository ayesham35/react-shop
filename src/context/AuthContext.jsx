import {createContext, useContext, useEffect, useState} from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'react-shop-auth-v1';

export function AuthProvider({ children }) {
    // lazy initializer - read user from localStorage on first load
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        }
        catch {
            return null;
        }
    });

    // whenever user changes, save to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }
        else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [user]);

    // called when user submits the login form
    async function login(username, password) {
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || `Login failed (HTTP ${response.status})`);
        }

        const data = await response.json();

        // store only what is needed from the response
        setUser({
            id: data.id,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            token: data.accessToken,
        });
    }

    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (ctx === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}