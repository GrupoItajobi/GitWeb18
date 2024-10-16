import { Injectable, OnInit } from '@angular/core';
import { EmpresaHeader } from '../../models/empresa/EmpresaHeader';

@Injectable({
  providedIn: 'root'
})

export class EmpresaService implements OnInit {

  mapUe = new Map<string, EmpresaHeader>();

  empresaHeader: EmpresaHeader = {
    grupoCodigo: 1,
    empresaCodigo: 1,
    filialCodigo: 1,
    filialNome: 'Usina Itajobi'
  };

  constructor() {
    this.mapearEmpresaUe();
  }

  ngOnInit(): void {

  }

  get empresaSelecionada(): EmpresaHeader {
    return this.empresaHeader;
  }

  gef(grupoCodigo: number, empresaCodigo: number, filialCodigo: number, filialNome: string) {
    this.empresaHeader.grupoCodigo = grupoCodigo;
    this.empresaHeader.empresaCodigo = empresaCodigo;
    this.empresaHeader.filialCodigo = filialCodigo;
    this.empresaHeader.filialNome = filialNome;
  }

  mapearEmpresaUe() {
    this.mapUe.set('Itajobi', {
      grupoCodigo: 1,
      empresaCodigo: 1,
      filialCodigo: 1,
      filialNome: 'Usina Itajobi'
    });

    this.mapUe.set('Carolo', {
      grupoCodigo: 1,
      empresaCodigo: 30,
      filialCodigo: 1,
      filialNome: 'Usina Carolo'
    });

    this.mapUe.set('VO-Cat', {
      grupoCodigo: 1,
      empresaCodigo: 10,
      filialCodigo: 1,
      filialNome: 'Virgolino de Oliveira - Catanduva'
    });
    this.mapUe.set('Centroalcool', {
      grupoCodigo: 1,
      empresaCodigo: 22,
      filialCodigo: 1,
      filialNome: 'Centroalcool'
    });

  }

  carregarEmpresaViaUnidade(unidade: string) {
    if (unidade && this.mapUe.has(unidade)) {
      let empresaHeader = this.mapUe.get(unidade);
      this.gef(empresaHeader!.grupoCodigo, empresaHeader!.empresaCodigo, empresaHeader!.filialCodigo, empresaHeader!.filialNome);
    }
  }
}


