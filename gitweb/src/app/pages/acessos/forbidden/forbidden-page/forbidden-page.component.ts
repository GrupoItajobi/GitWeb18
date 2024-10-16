import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-forbidden-page',
  standalone: true,
  imports: [ButtonModule,RouterModule],
  templateUrl: './forbidden-page.component.html',
  styleUrl: './forbidden-page.component.scss'
})
export class ForbiddenPageComponent {

}
