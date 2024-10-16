export interface Producao {
  nrMovimentacao?: number;
  grupoEmpresa?: number;
  empresa?: number;
  filial?: number;
  ueId?: string;
  ueDescricao?: string;
  produtoCodigo?: number;
  produtoDescricao?: string;
  produtoUnidade?: string;
  dataMovimento?: Date;
  quantidade?: number;
  usuario?: string;
}
