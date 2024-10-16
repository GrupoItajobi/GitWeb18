export interface EstoqueProduto {

  id?: string,
  idUe?: string,
  codigoGrupo?: number,
  codigoEmpresa?: number,
  codigoFilial?: number,
  codigoDeposito?: number,
  descricaoDeposito?: string,
  codigoProduto?: number,
  descricaoProduto?: string,
  unidadeProduto?: string,
  data?: Date,
  quantidade?: number,
  codigoGrupoLocalRetirada?: number,
  codigoEmpresaLocalRetirada?: number,
  codigoFilialLocalRetirada?: number,
  tagProduto?:string,
  localArmazenamento?:string

}
