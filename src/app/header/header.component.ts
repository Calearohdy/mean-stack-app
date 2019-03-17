import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSub: Subscription;
  private userIsAuth = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuth = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatus()
      .subscribe(isAuthenticated => {
        this.userIsAuth = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onLogout() {
    this.authService.userLogout();
  }

}
