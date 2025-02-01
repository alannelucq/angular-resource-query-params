import { Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { rxResource, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";
import { UsersGateway } from "../users.gateway";

export type UserSearch = {
  name: string | null;
  companyName: string | null;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usersGateway = inject(UsersGateway);

  name = input<string>('');
  companyName = input<string>('');
  private search = computed<UserSearch>(() => ({ name: this.name(), companyName: this.companyName() }));
  private debouncedSearch = toSignal(toObservable(this.search).pipe(debounceTime(300)));

  usersResource = rxResource({
    request: () => this.debouncedSearch(),
    loader: ({request}) => this.usersGateway.searchUsers(request)
  })
  .asReadonly();

  updateQueryParams(key: keyof UserSearch, value: string) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: value || null },
      queryParamsHandling: 'merge'
    });
  }
}
