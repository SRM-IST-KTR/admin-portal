import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if we're in the browser
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    handleLogout();
                }
            }
        }
        setIsLoading(false);
    }, []);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            // Clear all auth-related data
            localStorage.removeItem('user');
            localStorage.removeItem('loginTime');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('token');

            // Clear any other stored data
            sessionStorage.clear();

            setUser(null);
            setIsAdmin(false);

            // Redirect to home page
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        setUser,
        isAdmin,
        setIsAdmin,
        isLoading,
        handleLogout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 