import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    protected readonly authService: AuthService,
    protected readonly tokenService: TokenService,
    private readonly sharedService: SharedService,
    private readonly router: ActivatedRoute
  ) {}

  isSearchActive: boolean = false;

  ngOnInit(): void {
    // if /#search or /#favorites or #my-recipes  is routed
    this.router.fragment.subscribe((fragment: string | null) => {
      if (fragment && fragment === 'search') {
        this.isSearchActive = true;
        this.sharedService.setSearchActive(true);
      }
      if (fragment && fragment === 'favorites') {
        this.sharedService.setIsFavoriteActive(true);
      }
      if (fragment && fragment === 'my-recipes') {
        this.sharedService.setIsMyRecipesActive(true);
      }
    });
  }
}
