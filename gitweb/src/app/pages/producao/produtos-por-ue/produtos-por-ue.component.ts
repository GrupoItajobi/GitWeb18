import { Component, Input, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Producao } from '../../../models/producao/producao';
import { UE } from '../../../models/empresa/ue';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produtos-por-ue',
  standalone: true,
  imports: [ProdutosPorUeComponent, TableModule, CommonModule],
  templateUrl: './produtos-por-ue.component.html',
  styleUrl: './produtos-por-ue.component.scss'
})
export class ProdutosPorUeComponent implements OnInit {
  @Input() unidades!: UE[];
  @Input() producao!: Producao[];


  mapUeProduto = new Map<string, Map<number, Producao>>();
  produtos: Producao[] = [];

  constructor(

  ) { }


  ngOnInit(): void {
    this.mapearMapUeProduto();
  }

  mapearMapUeProduto() {
    console.log('Producao por Unidade: mapearMapUeProduto')
    this.produtos=[];
    this.mapUeProduto = new Map<string, Map<number, Producao>>();


    let mapProdutos = new Map<number, Producao>();

    console.log('==========================================')
    console.log(this.producao);
    this.producao.forEach(t => {
      let mapProduto = new Map<number, Producao>;

      if (this.mapUeProduto.has(t.ueId!)) {
        mapProduto = this.mapUeProduto.get(t.ueId!)!;
      }
      mapProduto.set(t.produtoCodigo!, t);
      this.mapUeProduto.set(t.ueId!, mapProduto);

      mapProdutos.set(t.produtoCodigo!, t)
    })

    mapProdutos.forEach((value, key) => {
      this.produtos.push(value);
    })
    console.log('produtos')
    console.log(this.produtos)

  }

  retornarQuantidade(ue:string,produtoCodigo:number):number {

    if (this.mapUeProduto.has(ue)) {
      let mapProducao = this.mapUeProduto.get(ue);
      if (mapProducao?.has(produtoCodigo)) {
        let producao = mapProducao.get(produtoCodigo);
        return producao?.quantidade!;
      }
    }
    return 0;
  }

}
