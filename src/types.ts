// Em src/types.ts
export interface Task {
  id: string;
  _id?: string;
  description: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface LoginResponse {
  token: string;
}

export interface IAuthContext {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

export type AuthResult = {
  success: boolean;
  message?: string;
};