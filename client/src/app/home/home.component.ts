import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-component',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [],
  imports: [MatCardModule, MatButtonModule, RouterLink]
})
export class HomeComponent {
  constructor(
    private route: ActivatedRoute,
  ) {}

}
