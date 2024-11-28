import { Component, Input} from '@angular/core';

import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-bloquear-tela',
  standalone: true,
  imports: [BlockUIModule, ProgressSpinnerModule],
  templateUrl: './bloquear-tela.component.html',
  styleUrl: './bloquear-tela.component.scss'
})

export class BloquearTelaComponent  {
  @Input() blockedDocument = false;
}
