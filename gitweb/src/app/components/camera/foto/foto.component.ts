import { ErrorHandleService } from './../../../services/error-handle/error-handle.service';
import { ToastService } from './../../../services/toast/toast.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';

import { nowString } from '../../../core/util/gitweb-util';
import { FileInfo } from './../../../models/ged/FileInfo';
import { GedService } from './../../../services/ged/ged.service';
import { SelectButtonModule } from 'primeng/selectbutton';


@Component({
  selector: 'app-foto',
  standalone: true,
  imports: [CommonModule, DropdownModule, SidebarModule, ReactiveFormsModule, SelectButtonModule],
  templateUrl: './foto.component.html',
  styleUrl: './foto.component.scss'
})
export class FotoComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();
  @Input() tabelaNome: any = "TESTE-TABELA-NOME";
  @Input() tabelaId: any = "TESTE-TABELA-ID";
  @Input() tabelaIdTitulo: any = "TESTE-TABELA-ID-TITULO";
  @Input() visible: boolean = true;

  @Input() position: any = "top";

  @ViewChild('video', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;


  form!: FormGroup;
  foto!: string;
  devices!: any[];
  constraints!: any[];

  showFoto: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private gedService: GedService,
    private _sanitizer: DomSanitizer,
    private toastService: ToastService,
    private errorHandleService: ErrorHandleService
  ) {

  }
  ngOnInit(): void {
    this.initForm();
    // this.getDevices();
    this.getCameraSelection();

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        const video = this.videoElement.nativeElement;
        video.srcObject = stream;
        this.form.patchValue({cameraSelection: this.devices[0].deviceId})

      })
      .catch(error => {
        console.log(error)
      });
  }


  selecionouDevice(sel: any) {
    console.log(this.form.value.cameraSelection)
    const constraints = {
      video: {
        deviceId: {
          exact: this.form.value.cameraSelection,
        },
      },
    };

    this.startStream(constraints);
  }

  async getCameraSelection() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.devices = devices.filter(device => device.kind === 'videoinput');
  };

  async getDevices() {
    this.devices = await navigator.mediaDevices.enumerateDevices();
  }
  close() {
    this.visible = false;

  }
  cancelarFoto() {
    this.showFoto = false;
  }
  enviarFoto() {
    const fileInfo: FileInfo = {
      nomeArquivo: 'Foto-' + this.tabelaIdTitulo + '-' + nowString() + '.png',
      tabelaNome: this.tabelaNome,
      tabelaId: this.tabelaId,
      tabelaIdTitulo: this.tabelaIdTitulo,
      extensao: 'PNG'
    }

    this.gedService.upLoadFoto(fileInfo, this.foto)
      .then(data => {
        this.toastService.showSuccessMsg('Foto Salva !');
        this.showFoto = false;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
  }

  tirarFoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    console.log(video)
    canvas.width = video.width;
    canvas.height = video.height;
    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const urlCanvas = canvas.toDataURL('image/png');
      this.foto = canvas.toDataURL('image/png');
      const linkTmp = document.createElement('a');

      linkTmp.href = urlCanvas;
      linkTmp.download = 'foto.png';
      // linkTmp.click();
      this.showFoto = true;
    }
  }


  handleStream(stream: any) {
    const video = this.videoElement.nativeElement;
    video.srcObject = stream;
    video.play();
  }

  async startStream(constraints: any) {
    console.log("startStream")
    console.log(constraints)
    let stream = await navigator.mediaDevices.getUserMedia(constraints);

    console.log(stream)
    this.handleStream(stream);
  };

  initForm() {
    this.form = this.formBuilder.group(
      {
        cameraSelection: new FormControl({ value: '', disabled: this.showFoto}),
      }
    );
    // this.calcularTempoEstimado();
    this.form.valueChanges.subscribe(newValue => {
    });
  }
}
