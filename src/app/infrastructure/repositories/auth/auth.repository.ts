import { Injectable } from '@angular/core';
import { User } from 'src/app/domain/auth/auth.type';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthRepository {

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  async registerUser(user: User, password: string): Promise<User | void> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(user.email, password);
      if (result.user) {
        
        const userData: User = {
          ...user,
          id: result.user.uid,
          email: result.user.email || user.email,
          photoURL: result.user.photoURL || user.photoURL || undefined,
          name: result.user.displayName || user.name || user.email.split('@')[0],
          phoneNumber: result.user.phoneNumber || user.phoneNumber || undefined,
          emailVerified: result.user.emailVerified,
          createdAt: new Date(),
        };

        await this.firestore.collection('users').doc(result.user.uid).set(userData);
        return userData;
      }
    } catch (error) {
      console.error('Error registering and saving user data:', error);
      throw error;
    }
  }


  async loginUser(email: string, password: string): Promise<User | void> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (result.user) {
        const userDocRef = this.firestore.collection('users').doc(result.user.uid);
        const userDoc = await userDocRef.get().toPromise();
  
        if (!userDoc?.exists) {
          // Se o documento não existir, criar com os dados do usuário
          const userData = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName || 'Returning User',
            phoneNumber: result.user.phoneNumber || null,
            emailVerified: result.user.emailVerified,
            lastLogin: new Date().toISOString(),
          };
  
          await userDocRef.set(userData);
          console.log('User data created in Firestore on login:', userData);
        } else {
          // Atualizar último login
          await userDocRef.update({
            lastLogin: new Date().toISOString(),
          });
          console.log('User last login updated in Firestore.');
        }
      }
    } catch (error) {
      console.error('Error logging in and synchronizing data:', error);
      throw error;
    }
  }
  
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}
