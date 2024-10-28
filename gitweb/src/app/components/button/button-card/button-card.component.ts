import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-card',
  standalone: true,
  imports: [],
  templateUrl: './button-card.component.html',
  styleUrl: './button-card.component.scss'
})


export class ButtonCardComponent implements OnInit {
  @Output() clickButtonCard = new EventEmitter();
  @Input() width: number = 50;
  @Input() options: ButtonCardOptions[] = [];

  styleSelecionado: string = "transform: translateY(-15px); box-shadow: 10px 20px 17px rgba(0, 0, 0, 0.50);";
  count: number = 0;
  constructor() {

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
      return this.styleSelecionado;
    }
    return "";
  }

  click(event: ButtonCardOptions) {
    let clicked: boolean = false;
    this.options.forEach(e => {

      if (e.id == event.id) {
        if (!e.clicked) {
          clicked = true;
        }
        e.clicked = true;
      } else {
        e.clicked = false;
      }
    })

    if (clicked) {
      // se já estava clicado o valor é falso
      this.clickButtonCard.emit(this.options[event.id!].returnWhenClicked!);
    }
  }

  carregarStyle() {

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
  clicked?: boolean,
  returnWhenClicked?: any,
}
