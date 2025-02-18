import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { delay, Observable } from "rxjs";
import { UserSearch } from "./home/home.component";
import { User } from "./user.model";

@Injectable({ providedIn: 'root' })
export class UsersGateway {
  private readonly http = inject(HttpClient);

  searchUsers(search?: UserSearch): Observable<User[]> {
    const params = new HttpParams()
    .set('name_like', search?.name ?? '')
    .set('company.name_like', search?.companyName ?? '');

    return this.http.get<User[]>(`https://jsonplaceholder.typicode.com/users`, { params }).pipe(
      delay(500)
    );
  }
}
