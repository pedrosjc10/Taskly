import { computed, Injectable, signal } from '@angular/core';
import { User } from 'src/app/domain/auth/auth.type';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  public readonly user = signal<User | undefined>(undefined);

  public readonly isAutenticated = computed(() => {
    return !!this.user()
  });
  
}
