import { Component, computed, inject, model } from '@angular/core';
import { rxResource, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";
import { UsersGateway } from "../users.gateway";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [FormsModule],
  styleUrl: './home.component.scss'
})
export default class HomeComponent {
  private usersGateway = inject(UsersGateway);

  name = model('');
  companyName = model('');
  private search = computed(() => ({ name: this.name(), companyName: this.companyName() }));
  private debouncedSearch = toSignal(toObservable(this.search).pipe(debounceTime(300)));

  usersResource = rxResource({
    request: () => this.debouncedSearch(),
    loader: ({request}) => this.usersGateway.searchUsers(request)
  })
  .asReadonly();
}
