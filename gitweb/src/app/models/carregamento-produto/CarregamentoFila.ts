export interface CarregamentoFila {

  idCarregamentoFila?: string,
  idCarregamentocheckpoint?: string,

  ue?: string,

  nrOrdemRetirada?: number,
  nrPedido?: number,
  nrNotaFiscal?: number,

  // ordem?: Date,
  // ordemFila?: Date,

  quantidadeVolume?: number,
  quantidadeVolumePed?: number,
  quantidadeVolumeNF?: number,

  temperatura?: number,
  unidade?: string,

  //Chegada
  chegadaData?: Date,
  chegadaTempo?: string,

  // Fila
  filaData?: Date,
  filaTempo?: string,

  // para montar a ordem em qualquer parte do cilco
  filaSequencia?: number,
  ordemFila?: Date,

  motoristaNome?: string,
  motoristaCPF?: string,

  caminhaoPlaca?: string,

  transportadoraCodigo?: number,
  transportadoraRazaoSocial?: string,
  transportadora?: string,

  icone?: string,

  produto?: string,
  produtoCodigo?: number,
  produtoDescricao?: string,

  checkpoint?: string,

  tipoEncerramento?: string,
  motivoEncerramento?: string,

  tipoVenda?: string,
  clienteNome?: string,
  nrContratoOrigem?: string,

  obsComercialBloqueio?: string,

  simuladoSaldoEstoque?: number,

  // informações do Checklist / Carregamento
  pontoDeCarregamentoDescricao?: string,
  tipoEqpDescricao?: string,
  t1EmMinutos?: number,
  quantidadeEquipamentos?: number,
  sequencia?:number

}
