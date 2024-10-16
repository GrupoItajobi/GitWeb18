import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { EmpresaService } from '../../../services/empresa/empresa.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarModule,PanelMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent implements OnInit {
  @Input() sidebarVisible: boolean = true;

  @Output() eventSidebarClose = new EventEmitter();

  items!: MenuItem[];

  constructor(
    private empresaService: EmpresaService,
  ) { }


  ngOnInit(): void {
    this.items = [
      {
        label: 'Itajobi',
        icon: 'pi pi-fw pi-map-marker',
        items: [
          {
            label: 'Usina Itajobi',
            icon: 'pi pi-fw pi-align-left',
            command: () => {
              this.onSelect(1, 1, 1, 'Usina Itajobi');
            }
          },

        ]
      },
      {
        label: 'Carolo',
        icon: 'pi pi-fw pi-map-marker',
        items: [
          {
            label: 'Usina Carolo',
            icon: 'pi pi-align-left',
            command: () => {
              this.onSelect(1, 30, 1, 'Usina Carolo');
            }
          },

        ]
      },
      {
        label: 'VO Catanduva',
        icon: 'pi pi-fw pi-map-marker',
        items: [
          {
            label: 'Virgolino de Oliveira',
            icon: 'pi pi-fw pi-align-left',
            command: () => {
              this.onSelect(1, 10, 1, 'Virgolino de Oliveira - Catanduva');
            }
          },
          {
            label: 'Agropecuária NSC',
            icon: 'pi pi-fw pi-align-left',
            command: () => {
              this.onSelect(1, 11, 1, 'Agropecuária NSC - Catanduva');
            }
          },

        ]
      },
      {
        label: 'Centroalcool',
        icon: 'pi pi-fw pi-map-marker',
        items: [
          {
            label: 'Usina Centrolalcool',
            icon: 'pi pi-align-left',
            command: () => {
              this.onSelect(1, 22, 1, 'Usina Usina Centroalcool');
            }
          },

        ]
      },

    ];
  }

  onSelect(grupoCodigo: number, empresaCodigo: number, filialCodigo: number, filialNome: string) {
    this.empresaService.gef(grupoCodigo, empresaCodigo, filialCodigo, filialNome);
    this.onHide()
  }

  onHide() {
    this.sidebarVisible = false;
    this.eventSidebarClose.emit(this.sidebarVisible);
  }
}
