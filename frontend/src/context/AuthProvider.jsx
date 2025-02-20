import { useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        const checkLogin = async () => {
            try {
                await axios.get(`${backendUrl}/api/check-auth`, { 
                    withCredentials: true 
                });
                setIsLoggedIn(true);
            } catch (err) {
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkLogin();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;