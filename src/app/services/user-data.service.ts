import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData, createEmptyUserData } from '@models/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private readonly STORAGE_KEY = 'userData';

  private userDataSubject = new BehaviorSubject<UserData>(this.loadFromStorage());

  public userData$: Observable<UserData> = this.userDataSubject.asObservable();

  constructor() {
    this.loadUserData();
  }

  /* Datos actuales del usuario*/
  getCurrentUserData(): UserData {
    return this.userDataSubject.value;
  }

  /* Actualiza los datos del usuario */
  updateUserData(data: Partial<UserData>): void {
    const currentData = this.getCurrentUserData();
    const updatedData = { ...currentData, ...data };
    this.userDataSubject.next(updatedData);
  }

  /* Guarda los datos del usuario en localStorage */
  saveUserData(data: UserData): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      this.userDataSubject.next(data);
      return true;
    } catch (error) {
      console.error('Error al guardar datos del usuario:', error);
      return false;
    }
  }

  /**
   * Carga los datos del usuario desde localStorage
   */
  loadUserData(): UserData {
    const data = this.loadFromStorage();
    this.userDataSubject.next(data);
    return data;
  }

  /**
   * Limpia los datos del usuario
   */
  clearUserData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.userDataSubject.next(createEmptyUserData());
  }

  /**
   * Verifica si existen datos guardados
   */
  hasStoredData(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  /**
   * Método privado para cargar desde storage
   */
  private loadFromStorage(): UserData {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        return { ...createEmptyUserData(), ...JSON.parse(savedData) };
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
    return createEmptyUserData();
  }
}
