import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserCredential } from '@angular/fire/auth';
import { User } from 'src/app/domain/auth/auth.type';
import { AuthRepository } from 'src/app/infrastructure/repositories/auth/auth.repository';
import { AuthStore } from './auth.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private authStore: AuthStore
  ) {}

  async login(email: string, password: string): Promise<User | null> {
    try {
      const result = await this.authRepository.loginUser(email, password);
      if(result) {
        this.authStore.user.set(result);
      }
      throw console.error();      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(user: User, password: string): Promise<User | null> {
    try {
      const result = await this.authRepository.registerUser(user, password);
      if(result) {
        this.authStore.user.set(result);
      }
      throw console.error();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authRepository.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}
