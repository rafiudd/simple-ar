import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { LoginCredentials } from '../types';
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../constants';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../utils';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  userId: string | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { userId: string; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  userId: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        userId: action.payload.userId,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        userId: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        userId: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getLocalStorage<string>(TOKEN_KEY, '');
      //   const storedRefresh = getLocalStorage<string>(REFRESH_TOKEN_KEY, '');
      const storedUserId = getLocalStorage<string | null>(USER_KEY, null);

      if (storedToken && storedUserId) {
        try {
          authService.setAuthToken(storedToken);
          await authService.verifyToken();
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { userId: storedUserId || '', token: storedToken },
          });
        } catch {
          clearStoredAuth();
          dispatch({ type: 'AUTH_ERROR', payload: 'Session expired' });
        }
      }
    };
    initializeAuth();
  }, []);

  const clearStoredAuth = () => {
    removeLocalStorage(TOKEN_KEY);
    removeLocalStorage(USER_KEY);
    authService.setAuthToken('');
  };

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const resp = await authService.login(credentials);
      // simpan ke storage
      setLocalStorage(TOKEN_KEY, resp.token);
      setLocalStorage(USER_KEY, String(resp.userId));

      // set token utk request berikutnya
      authService.setAuthToken(resp.token);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          userId: String(resp.userId),
          token: resp.token,
        },
      });

      // opsional: arahkan ke dashboard
      // navigate('/');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // await authService.logout();
    } catch (e) {
      // abaikan error logout server
    } finally {
      clearStoredAuth();
      dispatch({ type: 'LOGOUT' });
      //   navigate('/login');
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
