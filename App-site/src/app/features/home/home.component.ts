import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppNavbarComponent } from '../../shared/components/app-navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, AppNavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
