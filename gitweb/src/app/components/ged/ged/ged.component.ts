import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';

import { environment } from '../../../../environments/environment';

import { GedService } from '../../../services/ged/ged.service';
import { ErrorHandleService } from '../../../services/error-handle/error-handle.service';
import { ToastService } from '../../../services/toast/toast.service';

import { FileInfo } from '../../../models/ged/FileInfo';
import { Ged } from '../../../models/ged/ged';
import { MenuCrudComponent } from '../../crud/menu-crud/menu-crud.component';


@Component({
  selector: 'app-ged',
  standalone: true,
  imports: [
    CommonModule,

    FileUploadModule,
    TableModule,
    DialogModule,
    ButtonModule,
    BadgeModule,

    MenuCrudComponent
  ],
  templateUrl: './ged.component.html',
  styleUrl: './ged.component.scss'
})
export class GedComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();
  @Input() id!: string;
  @Input() visualizarGed: boolean = false;
  @Input() multiple: boolean = true;
  @Input() tabelaNome: any = "";
  @Input() tabelaId: any = "";
  @Input() tabelaIdTitulo: any = "Geral";
  @Input() opcoesDeTitulo: any[] = [];



  habilitarBotaoSalvar: boolean = false;
  habilitarBotaoAdicionar: boolean = true;
  habilitarBotaoExcluir: boolean = false;
  habilitarBotaoUpload: boolean = true;

  files: any[] = [];
  fileInfo?: FileInfo = {}
  visualizarUpload:boolean=false;

  geds: Ged[] = [];
  expandedRows = {};

  url: string;
  constructor(
    private toastService: ToastService,
    private gedService: GedService,
    private errorHandleService: ErrorHandleService,
  ) {
    this.url = environment.apiUrl + "GIt-api/ged/upload";
  }

  ngOnInit(): void {
    this.opcoesDeTitulo.push('Geral')
    this.geds = [];
    this.fileInfo = ({
      id: this.id,
      tabelaNome: this.tabelaNome,
      tabelaId: this.tabelaId,
      tabelaIdTitulo: this.tabelaIdTitulo
    });
    this.init();
  }

  async init() {
    await this.gedService.downloadGedPorRow(this.tabelaNome, this.tabelaId)
      .then(data => {
        this.geds = data;
        // console.log(this.geds)
      })
      .catch()
  }
  onUpload(event: any) {
    this.files = [];
    for (let file of event.files) {
      console.log('onUpLoad: ' + file.name)
      this.files.push(file);
    }
    this.toastService.showInfoMsg('Files Upload!');
  }

  onHide() {
    this.files = []
    this.eventEmitter.emit('');
  }

  async listarArquivosDisponiveis() {
  }

  editGed(ged: Ged) {
    console.log('editGed')
  }
  deleteGed(ged: Ged) {
    console.log("editGed")
  }



  clickSalvar(click: boolean) {

  }
  clickAdicionar(click: boolean) {

  }
  clickExcluir(click: boolean) {

  }
  clickUpload(event: any) {
    console.log('clickUpload')
    this.visualizarUpload = true;
  }
}

