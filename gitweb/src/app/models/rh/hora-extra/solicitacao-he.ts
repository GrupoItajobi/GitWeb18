export interface SolicitacaoHoraExtra{
    id?: string,
    version?: number,
    funcionarioCodigo?: number,
    funcionarioNome?: string,
    departamentoCodigo?: number,
    departamentoDescricao?: string,
    motivoCodigo?: number,
    motivoDescricao?: string,
    dia?: Date,
    minutos?: number,
    usuarioNome?: string,
    observacao?: string,
    dataHe?: number,
    horas?: string,
    quantidadeAprovador?: number,
    dataInicio?: Date,
    dataFim?: Date,
    aprovadores?: string,
    status?: string,
    departamentoGef?: dadosGef
}

export interface dadosGef{
    aprovadores: dadosAprovador[],
    codigoEmpresa?: number,
    codigoFilial?: number,
    codigoGrupoEmpresa?: number,
    departamentoCodigo?: number
}

export interface dadosAprovador{
    aprovadorCodigo?: number,
    aprovadorNome?: string,
    departametoCodigo?: number,
    departamentoDescricao?: string,
    gef?: string,
    id?: string,
    version?: number
}




