export interface OrdemDeCarregamento {
  checkListCarregamentoId?: string,
  especificacaoId?: string,
  especificacaoIdSelecionadaNoCarregamento?: string,
  ue?: string,
  nrOrdemRetirada?: number
  produto?: string,
  produtoCodigo?: number,
  produtoDescricao?: string,
  sequencia?: number,
  dataInicio?: Date,
  dataFim?: Date,
  tempo1EmMinutos?: number,
  clienteCodigo?: number
  clienteNome?: string,
  transportadoraCodigo?: number,
  transportadoraRazaoSocial?: string,
  motoristaNome?: string,
  MotoristaCPF?: string,
  caminhaoPlaca?: string,
  pontoCarregamentoCodigo?: number,
  pontoCarregamentoDescricao?: string,
  checkpoint?: string,
  tipoEquipamentoDescricao?: string,
  quantidadeEquipamento?: number;

}
