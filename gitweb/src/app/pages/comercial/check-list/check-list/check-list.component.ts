import { Component } from '@angular/core';
import { GedComponent } from "../../../../components/ged/ged/ged.component";
import { FotoComponent } from '../../../../components/camera/foto/foto.component';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-check-list',
  standalone: true,
  imports: [
    GedComponent,
    FotoComponent,
    DialogModule
  ],
  templateUrl: './check-list.component.html',
  styleUrl: './check-list.component.scss'
})
export class CheckListComponent {

  tabelaNome:string = 'checklist';
  tabelaId:string = 'id1';
  tabelaIdTitulo:string = 'FotoLona';

  visible:boolean=true;
}
