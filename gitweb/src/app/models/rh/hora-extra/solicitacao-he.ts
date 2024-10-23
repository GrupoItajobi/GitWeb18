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
    dataHe?: number
}