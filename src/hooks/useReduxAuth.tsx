import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  login,
  logoutAsync,
  updateProfile,
  setUser,
  clearError,
  logout,
  loadUserFromStorage,
  getProfile,
  refreshAccessToken,
  register,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyToken,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectInitialLoading,
  selectUserRole,
  selectIsAdmin,
  selectIsDoctor,
  selectIsStaff,
  selectIsReceptionist,
  selectAccessToken,
  setTokens,
} from "@/redux/slices/authSlice";
import type { User, UserRole } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";


// interface RegisterData {
//   email: string;
//   password: string;
//   name?: string;
//   role?: UserRole; 
// }

export function useReduxAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Selectors
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const initialLoading = useAppSelector(selectInitialLoading);
  const error = useAppSelector(selectAuthError);
  const role = useAppSelector(selectUserRole);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isDoctor = useAppSelector(selectIsDoctor);
  const isStaff = useAppSelector(selectIsStaff);
  const isReceptionist = useAppSelector(selectIsReceptionist);
  const accessToken = useAppSelector(selectAccessToken);

  // Load user from localStorage on mount
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // ========================
  // AUTH METHODS
  // ========================

  const signin = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await dispatch(login({ email, password })).unwrap();
        toast.success("Login successful!");
        return result;
      } catch (error: any) {
        toast.error(error || "Login failed");
        throw error;
      }
    },
    [dispatch]
  );

  const signup = useCallback(
    async (userData: {
      email: string;
      password: string;
      name?: string;
      role?: UserRole;
    }) => {
      try {
        // Ensure role is valid UserRole or undefined
        const validUserRole = userData.role as UserRole | undefined;
        
        const result = await dispatch(register({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: validUserRole
        })).unwrap();
        
        toast.success("Registration successful!");
        return result;
      } catch (error: any) {
        toast.error(error || "Registration failed");
        throw error;
      }
    },
    [dispatch]
  );

  // Alternative signup with string role (converts to UserRole)
  const signupWithStringRole = useCallback(
    async (userData: {
      email: string;
      password: string;
      name?: string;
      role?: string;
    }) => {
      try {
        // Convert string role to UserRole if provided
        let validRole: UserRole | undefined;
        if (userData.role) {
          // Type guard to ensure it's a valid UserRole
          const validRoles: UserRole[] = ["ADMIN", "DOCTOR", "NURSE", "STAFF", "RECEPTIONIST"];
          if (validRoles.includes(userData.role as UserRole)) {
            validRole = userData.role as UserRole;
          } else {
            // Default to STAFF if invalid role
            validRole = "STAFF";
          }
        }

        const result = await dispatch(register({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: validRole
        })).unwrap();
        
        toast.success("Registration successful!");
        return result;
      } catch (error: any) {
        toast.error(error || "Registration failed");
        throw error;
      }
    },
    [dispatch]
  );

  const signout = useCallback(async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    }
  }, [dispatch, navigate]);

  const updateUserProfile = useCallback(
    async (profileData: { name?: string; email?: string }) => {
      try {
        const result = await dispatch(updateProfile(profileData)).unwrap();
        toast.success("Profile updated successfully!");
        return result;
      } catch (error: any) {
        toast.error(error || "Failed to update profile");
        throw error;
      }
    },
    [dispatch]
  );

  const changeUserPassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
        toast.success("Password changed successfully!");
      } catch (error: any) {
        toast.error(error || "Failed to change password");
        throw error;
      }
    },
    [dispatch]
  );

  const requestPasswordReset = useCallback(
    async (email: string) => {
      try {
        await dispatch(forgotPassword(email)).unwrap();
        toast.success("Reset instructions sent to your email");
      } catch (error: any) {
        toast.error(error || "Failed to process request");
        throw error;
      }
    },
    [dispatch]
  );

  const resetUserPassword = useCallback(
    async (token: string, newPassword: string) => {
      try {
        await dispatch(resetPassword({ token, newPassword })).unwrap();
        toast.success("Password reset successfully!");
      } catch (error: any) {
        toast.error(error || "Failed to reset password");
        throw error;
      }
    },
    [dispatch]
  );

  const fetchProfile = useCallback(async () => {
    try {
      const result = await dispatch(getProfile()).unwrap();
      return result;
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  }, [dispatch]);

  const refreshToken = useCallback(async () => {
    try {
      const result = await dispatch(refreshAccessToken()).unwrap();
      return result;
    } catch (error: any) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  }, [dispatch]);

  const verifyAuthToken = useCallback(async () => {
    try {
      const result = await dispatch(verifyToken()).unwrap();
      return result;
    } catch (error: any) {
      console.error("Token verification failed:", error);
      throw error;
    }
  }, [dispatch]);

  const updateCurrentUser = useCallback(
    (userData: Partial<User>) => {
      if (user) {
        dispatch(setUser({ user: { ...user, ...userData } }));
      }
    },
    [dispatch, user]
  );

  const setUserData = useCallback(
    (userData: { user: User; accessToken?: string; refreshToken?: string }) => {
      dispatch(setUser(userData));
    },
    [dispatch]
  );

  const updateTokens = useCallback(
    (tokens: { accessToken: string; refreshToken: string }) => {
      dispatch(setTokens(tokens));
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // ========================
  // HELPER FUNCTIONS
  // ========================

  const hasPermission = useCallback(
    (requiredRole: UserRole | UserRole[]): boolean => {
      if (!role) return false;
      
      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(role);
      }
      
      return role === requiredRole;
    },
    [role]
  );

  const hasAnyPermission = useCallback(
    (requiredRoles: UserRole[]): boolean => {
      if (!role) return false;
      return requiredRoles.includes(role);
    },
    [role]
  );

  const isUserType = useCallback(
    (userType: UserRole): boolean => {
      if (!role) return false;
      return role === userType;
    },
    [role]
  );

  const getUserName = useCallback((): string => {
    if (!user) return "";
    return user.name || user.email.split("@")[0];
  }, [user]);

  const getInitials = useCallback((): string => {
    if (!user) return "";
    
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    return user.email[0].toUpperCase();
  }, [user]);

  const isTokenExpired = useCallback((): boolean => {
    if (!accessToken) return true;
    
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }, [accessToken]);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (!accessToken) return {};
    
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }, [accessToken]);

  // ========================
  // ROLE-BASED ACCESS
  // ========================

  const canViewPatients = useCallback((): boolean => {
    return hasAnyPermission(["ADMIN", "DOCTOR", "RECEPTIONIST", "STAFF"]);
  }, [hasAnyPermission]);

  const canEditPatients = useCallback((): boolean => {
    return hasAnyPermission(["ADMIN", "DOCTOR", "RECEPTIONIST"]);
  }, [hasAnyPermission]);

  const canViewDoctors = useCallback((): boolean => {
    return hasAnyPermission(["ADMIN", "RECEPTIONIST", "STAFF"]);
  }, [hasAnyPermission]);

  const canEditDoctors = useCallback((): boolean => {
    return hasAnyPermission(["ADMIN"]);
  }, [hasAnyPermission]);

  const canViewAppointments = useCallback((): boolean => {
    return hasAnyPermission(["ADMIN", "DOCTOR", "RECEPTIONIST", "STAFF"]);
  }, [hasAnyPermission]);

  const canEditAppointments = useCallback((): boolean => {
    return hasAnyPermission(["ADMIN", "DOCTOR", "RECEPTIONIST"]);
  }, [hasAnyPermission]);

  const canViewInvoices = useCallback((): boolean => {
    return hasAnyPermission(["ADMIN", "RECEPTIONIST", "STAFF"]);
  }, [hasAnyPermission]);

  const canEditInvoices = useCallback((): boolean => {
    return hasAnyPermission(["ADMIN", "RECEPTIONIST"]);
  }, [hasAnyPermission]);

  const canManageUsers = useCallback((): boolean => {
    return isAdmin;
  }, [isAdmin]);

  const canManageInventory = useCallback((): boolean => {
    return hasAnyPermission(["ADMIN", "STAFF"]);
  }, [hasAnyPermission]);

  // Get user role as string (for display purposes)
  const getUserRoleDisplay = useCallback((): string => {
    if (!role) return "";
    
    // Map role to display name
    const roleMap: Record<UserRole, string> = {
      ADMIN: "Administrator",
      DOCTOR: "Doctor",
      NURSE: "Nurse",
      STAFF: "Staff",
      RECEPTIONIST: "Receptionist"
    };
    
    return roleMap[role] || role;
  }, [role]);

  // Check if user can access a specific module
  const canAccessModule = useCallback((moduleName: string): boolean => {
    if (!role) return false;
    
    const modulePermissions: Record<string, UserRole[]> = {
      // Patient Management
      patients: ["ADMIN", "DOCTOR", "RECEPTIONIST", "STAFF"],
      patientCreate: ["ADMIN", "DOCTOR", "RECEPTIONIST"],
      patientEdit: ["ADMIN", "DOCTOR", "RECEPTIONIST"],
      patientDelete: ["ADMIN", "DOCTOR"],
      
      // Doctor Management
      doctors: ["ADMIN", "RECEPTIONIST", "STAFF"],
      doctorCreate: ["ADMIN"],
      doctorEdit: ["ADMIN"],
      doctorDelete: ["ADMIN"],
      
      // Appointment Management
      appointments: ["ADMIN", "DOCTOR", "RECEPTIONIST", "STAFF"],
      appointmentCreate: ["ADMIN", "DOCTOR", "RECEPTIONIST"],
      appointmentEdit: ["ADMIN", "DOCTOR", "RECEPTIONIST"],
      appointmentDelete: ["ADMIN", "DOCTOR"],
      
      // Invoice Management
      invoices: ["ADMIN", "RECEPTIONIST", "STAFF"],
      invoiceCreate: ["ADMIN", "RECEPTIONIST"],
      invoiceEdit: ["ADMIN", "RECEPTIONIST"],
      invoiceDelete: ["ADMIN"],
      
      // Inventory Management
      inventory: ["ADMIN", "STAFF"],
      inventoryCreate: ["ADMIN", "STAFF"],
      inventoryEdit: ["ADMIN", "STAFF"],
      inventoryDelete: ["ADMIN"],
      
      // User Management
      users: ["ADMIN"],
      userCreate: ["ADMIN"],
      userEdit: ["ADMIN"],
      userDelete: ["ADMIN"],
      
      // Reports
      reports: ["ADMIN", "DOCTOR", "RECEPTIONIST"],
      
      // Dashboard
      dashboard: ["ADMIN", "DOCTOR", "RECEPTIONIST", "STAFF", "NURSE"],
    };
    
    const allowedRoles = modulePermissions[moduleName] || [];
    return allowedRoles.includes(role);
  }, [role]);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    initialLoading,
    error,
    role,
    isAdmin,
    isDoctor,
    isStaff,
    isReceptionist,
    accessToken,

    // Auth Actions
    signin,
    signup,
    signupWithStringRole, // Alternative for string roles
    signout,
    updateUserProfile,
    changeUserPassword,
    requestPasswordReset,
    resetUserPassword,
    fetchProfile,
    refreshToken,
    verifyAuthToken,
    updateCurrentUser,
    setUser: setUserData,
    updateTokens,
    clearError: clearAuthError,

    // Helper Functions
    hasPermission,
    hasAnyPermission,
    isUserType,
    getUserName,
    getInitials,
    getUserRoleDisplay,
    isTokenExpired,
    getAuthHeaders,
    canAccessModule,

    // Role-based Access
    canViewPatients,
    canEditPatients,
    canViewDoctors,
    canEditDoctors,
    canViewAppointments,
    canEditAppointments,
    canViewInvoices,
    canEditInvoices,
    canManageUsers,
    canManageInventory,
  };
}

export type UseAuthReturn = ReturnType<typeof useReduxAuth>;