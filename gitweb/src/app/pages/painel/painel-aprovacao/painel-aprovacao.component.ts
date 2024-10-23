import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-painel-aprovacao',
  standalone: true,
  imports: [],
  templateUrl: './painel-aprovacao.component.html',
  styleUrl: './painel-aprovacao.component.scss'
})
export class PainelAprovacaoComponent implements OnInit {

  constructor(

  ) { }


  ngOnInit(): void {

  }



  aprovacaoHoraExtra() {
    //  this.router.navigate(['/industria/painel/painel-producao']);

  }
}
