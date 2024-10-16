import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { EmpresaService } from '../../../services/empresa/empresa.service';

@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [DividerModule],
  templateUrl: './unidades.component.html',
  styleUrl: './unidades.component.scss'
})
export class UnidadesComponent implements OnInit {

  @Output() selecionouUnidade = new EventEmitter();

  ueSelecionada?: string;
  styleSelecionado: string = "transform: translateY(-15px); box-shadow: 10px 20px 17px rgba(0, 0, 0, 0.50);"

  mapStyle = new Map<string, string>();

  constructor(
    private empresaService: EmpresaService
  ) {
    this.initStyle();

  }

  ngOnInit(): void {

  }

  initStyle() {
    this.mapStyle = new Map<string, string>();
    this.mapStyle.set('Itajobi', '');
    this.mapStyle.set('Carolo', '');
    this.mapStyle.set('VO-Cat', '');
    this.mapStyle.set('Centroalcool', '');
    this.mapStyle.set('Furlan', '');
    this.mapStyle.set('RioPardo', '');
  }

  alterarStyle(ue: string) {
    this.mapStyle.set(ue, this.styleSelecionado);
  }

  selecionarUnidade(ue: string) {
    this.initStyle();
    this.alterarStyle(ue)
    this.ueSelecionada = ue;
    this.empresaService.carregarEmpresaViaUnidade(ue);
    this.selecionouUnidade.emit(ue);
  }

}
