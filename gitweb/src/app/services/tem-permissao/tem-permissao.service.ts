import { inject, Injectable } from '@angular/core';
import { UrlService } from '../url/url.service';

// Ordem alfabetica
const ADICIONAR: string = "adicionar";
const ALL: string = "all";
const CONSULTAR: string = "consultar";
const CRIAR: string = "criar";
const EDITAR: string = "editar";
const ENCERRAR: string = "encerrar";
const EXCLUIR: string = "excluir";

@Injectable({
  providedIn: 'root'
})
export class TemPermissaoService {

  url = inject(UrlService)

  constructor() { }

  public adicionar(unidade: string = ALL) {
    return this.temTag(ADICIONAR, unidade);
  }
  public criar(unidade: string = ALL) {
    return this.temTag(CRIAR, unidade);
  }
  public consultar(unidade: string = ALL) {
    return this.temTag(CONSULTAR, unidade);
  }
  public editar(unidade: string = ALL) {
    return this.temTag(EDITAR, unidade);
  }
  public encerrar(unidade: string = ALL) {
    return this.temTag(ENCERRAR, unidade);
  }
  public excluir(unidade: string = ALL) {
    return this.temTag(EXCLUIR, unidade);
  }

  public temTag(tag: string, unidade: string = ALL): boolean {
    let tagUnidade: string = tag.toLowerCase() + '.' + unidade.toLowerCase();
    let tagAll = tag.toLowerCase() + '.' + ALL;
    let admin = 'admin';
    return this.url.roleTags.has(admin) || this.url.roleTags.has(tagAll) || this.url.roleTags.has(tagUnidade);
  }



}
