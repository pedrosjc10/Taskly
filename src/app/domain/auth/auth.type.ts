// auth.type.ts

// Tipo personalizado para representar um usuário no estado de autenticação
export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
  emailVerified: boolean;
  phoneNumber?: string;
  birthDate?: Date;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
  lastLoginIP: number;
}

export interface Address {
  street: string;
  number: number;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

// Tipo para o estado de autenticação
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
  