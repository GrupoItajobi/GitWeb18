export interface RotacaoMoendaCrud {
  id?:string,
  version?:number,
  ueId:string,
  moendaId:string,
  eventoCode:number,
  dataInicio:Date,
  dataFim?:Date,
  dataPrevistaRetorno?:Date,
  observacao?:string,
  rotacaoAtual:number,
}
