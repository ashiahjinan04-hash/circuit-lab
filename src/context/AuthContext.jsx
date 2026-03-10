import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API = "https://circuit-lab.onrender.com";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (token) {
                localStorage.setItem('token', token);
                try {
                    const response = await fetch(`${API}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem('token');
                        setToken(null);
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile", error);
                }
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        };

        fetchProfile();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username: email, password: password })
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.access_token);
                setIsLoginModalOpen(false);
                return true;
            } else {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

        } catch (error) {
            throw error;
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await fetch(`${API}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                await login(email, password);
                setIsSignupModalOpen(false);
                return true;
            } else {
                const error = await response.json();
                throw new Error(error.detail || 'Signup failed');
            }

        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const openLogin = () => {
        setIsSignupModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const openSignup = () => {
        setIsLoginModalOpen(false);
        setIsSignupModalOpen(true);
    };

    const updateProfile = async (name) => {
        if (!token) throw new Error("Not authenticated");

        try {
            const response = await fetch(`${API}/api/auth/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                return updatedUser;
            } else {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to update profile');
            }

        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    const closeModals = () => {
        setIsLoginModalOpen(false);
        setIsSignupModalOpen(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            signup,
            logout,
            updateProfile,
            isLoginModalOpen,
            isSignupModalOpen,
            openLogin,
            openSignup,
            closeModals
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}