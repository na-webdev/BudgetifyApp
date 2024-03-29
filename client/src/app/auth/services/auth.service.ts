import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { CategoryService } from 'src/app/category/services/category.service';
import { UserDataInterface } from '../types/userData.interface';
import { environment } from '../../../environments/environment';

const BASE_API = `${environment.apiURL}`;

const defaultExpenseCategories = [
  'food',
  'transportation',
  'housing',
  'shopping',
  'education',
  'kids',
  'entertainment',
  'health and beauty',
  'pet',
  'internet',
  'mobile',
];

const defaultIncomeCategories = [
  'salary',
  'gifts',
  'other',
  'rental income',
  'premium/bonuses',
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  login(email: string, password: string): Observable<UserDataInterface> {
    return this.http
      .post(`${BASE_API}/users/login`, { email, password })
      .pipe(tap((res: any) => this.setSession(res)));
  }

  registerUser(
    email: string,
    password: string,
    country: string,
    firstName: string,
    lastName: string,
    birthDate: string
  ): Observable<any> {
    return this.http.post(`${BASE_API}/users/signup`, {
      email,
      password,
      country,
      firstName,
      lastName,
      birthDate,
    });
  }

  isLoggedIn(): boolean {
    const expiresIn = localStorage.getItem('expiresIn');
    if (expiresIn) {
      return Date.now() < Number(expiresIn);
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('country');
    localStorage.removeItem('userId');
  }

  healthCheck(): Observable<any> {
    return this.http.post(`${BASE_API}/api/health-check`, {
      test: 'test',
    });
  }

  private setSession(res: UserDataInterface): void {
    const expiresIn = Date.now() + Number(res.user.expiresIn);
    localStorage.setItem('token', res.user.token);
    localStorage.setItem('expiresIn', expiresIn.toString());
    localStorage.setItem('country', res.user.country);
    localStorage.setItem('userId', res.user.id);
    localStorage.setItem('fullName', res.user.fullName);

    let userId = localStorage.getItem('userId');
    if (!localStorage.getItem('firstLogin')) {
      defaultExpenseCategories.map((title) => {
        let uniqueness = userId + title + 'expense';
        this.categoryService
          .addNewCateogry(title, 'expense', userId, uniqueness)
          .pipe(take(1))
          .subscribe();
      });
      defaultIncomeCategories.map((title) => {
        let uniqueness = userId + title + 'income';
        this.categoryService
          .addNewCateogry(title, 'income', userId, uniqueness)
          .pipe(take(1))
          .subscribe();
      });
      localStorage.setItem('firstLogin', 'false');
    }
  }
}
