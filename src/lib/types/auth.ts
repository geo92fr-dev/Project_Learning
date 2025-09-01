// 🔐 FunLearning V2.0 - Auth Types
// Types TypeScript pour l'authentification

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  displayName?: string;
  confirmPassword: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}
