import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  login, 
  logoutAsync, 
  updateUser, 
  setUser, 
  clearError, 
  logout,
  loadUserFromStorage,
  checkAuth,
  refreshAccessToken,
  register,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectInitialLoading
} from '@/redux/slices/authSlice';
import type { User } from '@/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';

export function useReduxAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Use selectors directly for better performance
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const initialLoading = useAppSelector(selectInitialLoading);
  const error = useAppSelector(selectAuthError);

  // Load user from localStorage on mount
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const signin = useCallback(async (email: string, password: string) => {
    return dispatch(login({ email, password })).unwrap();
  }, [dispatch]);

  const signup = useCallback(async (registrationData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    [key: string]: any;
  }) => {
    return dispatch(register(registrationData)).unwrap();
  }, [dispatch]);

  const signout = useCallback(async () => {   
    try {
      await dispatch(logoutAsync()).unwrap();
      navigate('/login'); // Adjust the path as needed
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logout());
      navigate('/login');
    }
  }, [dispatch, navigate]);

  const updateCurrentUser = useCallback((userData: Partial<User>) => {
    dispatch(updateUser(userData));
  }, [dispatch]);

  const setUserData = useCallback((userData: { user: User }) => {
    dispatch(setUser(userData));
  }, [dispatch]);

  const verifyAuth = useCallback(async () => {
    try {
      await dispatch(checkAuth()).unwrap();
      return true;
    } catch (error) {
      console.error('Auth verification failed:', error);
      return false;
    }
  }, [dispatch]);

  const refreshToken = useCallback(async () => {
    try {
      await dispatch(refreshAccessToken()).unwrap();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Helper function to check if user has specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  // Helper function to check if user has specific role
  const hasRole = useCallback((role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }, [user]);

  // Helper function to check if user is of specific type
  const isUserType = useCallback((userType: string): boolean => {
    if (!user) return false;
    return user.userType === userType;
  }, [user]);

  // Get full name helper
  const getFullName = useCallback((): string => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  }, [user]);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    initialLoading,
    error,
    
    // Actions
    signin,
    signup,
    signout,
    updateCurrentUser,
    setUser: setUserData,
    verifyAuth,
    refreshToken,
    clearError: clearAuthError,
    
    // Helper functions
    hasPermission,
    hasRole,
    isUserType,
    getFullName,
  };
}