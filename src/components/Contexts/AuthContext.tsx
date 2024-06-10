import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


export const login = () => {
    localStorage.setItem('trello_token', 'mock_token');
};

export const logout = () => {
    localStorage.removeItem('trello_token');
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('trello_token');
};


interface AuthStateInterface {
    isAuthenticated: boolean;
    username: string;
    password: string;
}

interface AuthContextProps extends AuthStateInterface {
    login: () => void;
    logout: () => void;
}

const initialAuthState: AuthStateInterface = {
    isAuthenticated: false,
    username: '',
    password: '',
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthStateInterface>(initialAuthState);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('trelloUser') || '{}');
        if (userInfo && userInfo.isAuthenticated) {
            setAuthState(userInfo);
        }
    }, []);

    const handleLogin = () => {
        login();
        setAuthState((prevState) => ({
            ...prevState,
            isAuthenticated: true,
        }));
        localStorage.setItem('trelloUser', JSON.stringify({ ...authState, isAuthenticated: true }));
    };

    const handleLogout = () => {
        logout();
        setAuthState(initialAuthState);
        localStorage.removeItem('trelloUser');
    };

    return (
        <AuthContext.Provider value={{ ...authState, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
