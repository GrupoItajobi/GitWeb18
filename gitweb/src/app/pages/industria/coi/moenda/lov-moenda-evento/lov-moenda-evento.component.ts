import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

import { MoendaEvento } from './../../../../../models/industria/rotacao-moenda/moendaEvento';

import { MoendaEventoService } from './../../../../../services/rotacao-moenda/moenda-evento.service';
import { ErrorHandleService } from './../../../../../services/error-handle/error-handle.service';

@Component({
  selector: 'app-lov-moenda-evento',
  standalone: true,
  imports: [DialogModule, TableModule],
  templateUrl: './lov-moenda-evento.component.html',
  styleUrl: './lov-moenda-evento.component.scss'
})

export class LovMoendaEventoComponent implements OnInit {
  @Input() dialogVisible: boolean = false;

  @Output() selecionouEvento = new EventEmitter();


  eventos: MoendaEvento[] = [];
  eventoSelecionado!:MoendaEvento;

  constructor(
    private moendaEventoService: MoendaEventoService,
    private errorHandleService: ErrorHandleService,
  ) { }

  ngOnInit(): void {
  }


  onHideDialog() {
    this.dialogVisible = false;
    this.selecionouEvento.emit(null);
  }

  onShowDialog() {
    this.downloadEventos();
  }

  onSelecionouEvento() {
    this.dialogVisible = false;
    this.selecionouEvento.emit('teste');
  }

  onRowSelect(event: any) {
    this.selecionouEvento.emit(this.eventoSelecionado);
}

  downloadEventos() {
    this.eventos = [];
    this.eventoSelecionado={} as MoendaEvento;
    this.moendaEventoService.listarEventos()
      .then(response => {
        this.eventos = response;
        console.log(this.eventos);
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
  }
}
