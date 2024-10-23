export interface SolicitacaoHoraExtraIncluir{    
    id?: number,
    version?: number,
    funcionarioCodigo?: number,
    departamentoCodigo?: number,
    motivoCodigo?: number,
    dia?: Date,
    minutos?: number,
    observacao?: string,
    quantidadeDias?: number,
}