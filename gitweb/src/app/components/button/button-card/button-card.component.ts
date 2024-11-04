import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { BloquearTelaComponent } from "../../bloquear-tela/bloquear-tela.component";
const STYLE_SELECIONADO: string = "transform: translateY(-15px); box-shadow: 10px 20px 17px rgba(0, 0, 0, 0.50);";

@Component({
  selector: 'app-button-card',
  standalone: true,
  imports: [BadgeModule, ProgressSpinnerModule, BlockUIModule, PanelModule, BloquearTelaComponent],
  templateUrl: './button-card.component.html',
  styleUrl: './button-card.component.scss'
})



export class ButtonCardComponent implements OnInit, OnChanges {
  @Output() clickButtonCard = new EventEmitter();
  @Input() width: number = 30;
  @Input() selected: boolean = true; // se true após clicado o botão fica em alto relevo, senão ficar normal
  @Input() blockedDocument: boolean = false; // se true após clicado o botão fica o documento é bloqueado até o termino do processamento
  @Input() loading: boolean = false; // usado em conjunto com loadingClicked, coloca em loading o botação clicado e retira e para o loading do botão clocado
  @Input() options: ButtonCardOptions[] = [];

  count: number = 0;

  buttonCardClicked: ButtonCardOptions | null = null;
  blockedPanel: boolean = false;


  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkOptionsChange(this.buttonCardClicked!);
  }

  ngOnInit(): void {
    if (!this.options || this.options.length == 0) {
      this.optionsDefault();
    }

    this.options.forEach(e => {
      e.id = this.count++
    });
  }

  style(event: ButtonCardOptions): string {
    if (this.options[event.id!]!.clicked!) {
      return STYLE_SELECIONADO;
    }
    return "";
  }

  click(event: ButtonCardOptions) {
    this.buttonCardClicked = event;
    let clicked: boolean = this.checkOptionsChange(event);
    if (clicked) {
      this.clickButtonCard.emit(this.options[event.id!].returnWhenClicked!);
    }
  }

  checkOptionsChange(event: ButtonCardOptions): boolean {
    let clicked: boolean = false;
    if (event != null) {
      this.options.forEach(e => {
        e.loading = false;

        if (e.id == event.id) {

          clicked = true;
          if (this.selected) {
            // manter o button selecionado;
            e.clicked = true;
          }

          if (this.loading) {
            e.loading = this.loading;
          }
        } else {
          e.clicked = false;
        }
      })
    }
    return clicked;
  }
  optionsDefault() {
    this.options = [
      {
        id: 1,
        img: "/assets/layout/img/sistema/emogiGIt.png",
        title: "Title1",
        clicked: false,
        returnWhenClicked: "option01"
      },
      {
        id: 2,
        img: "/assets/layout/img/sistema/emogiGIt.png",
        title: "Title2",
        titleDescription: "desc 2",
        clicked: false,
        returnWhenClicked: "option02"
      }
    ];
  }

 }


export interface ButtonCardOptions {
  id?: number,
  img?: string,
  title?: string,
  titleDescription?: string,
  returnWhenClicked?: any,
  quantidade?: number,
  clicked?: boolean,
  loading?: boolean
}
