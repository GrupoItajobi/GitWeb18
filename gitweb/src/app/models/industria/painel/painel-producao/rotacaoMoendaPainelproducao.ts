export interface RotacaoMoendaPainelProducao {

  id?: string;

  moendaUe?: string;
  moendaDescricao?: string;

  rotacaoIdeal?: number;
  rotacaoAtual?: number;
  rotacaoPonderadaIdeal?: number;
  rotacaoPonderadaAtual?: number;

  dataInicio?: Date;
  dataFim?: Date;
  dataPrevistaRetorno?: Date;
  dataIndustriaRotacao?: Date;
  dataIndustriaNow?: Date;

  eventoCode?: number;
  eventoDescricao?: string;

  responsavelId?: string;
  responsavelDescricao?: string;
  trabalhando?: string;
  observacao?: string,

}
