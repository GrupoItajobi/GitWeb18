export interface PlanejamentoMetaMoagemDia {
    id: string,
    version: number,
    grupoEmpresaCodigo: number,
    empresaCodigo: number,
    filialCodigo: number,
    dataMoagem: Date,
    tonelada: number
  }

  export interface EnviarDados{
    empresaCodigo: number,
    grupoEmpresaCodigo: number,
    filialCodigo: number,
    de: Date,
    ate: Date 
  }