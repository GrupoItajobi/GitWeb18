import { FolhaEvento } from "./folha-evento"
import { RelogioPonto } from "./relogio-ponto"

export interface FolhaEventoPonto {
  id?: string,
  gef?: string,
  filialNomeFantasia?: string,
  funcionarioCodigo?: number,
  funcionarioNome?: string,
  objCustoCodigo?: number,
  objCustoDescricao?: string,
  deptoCodigo?: number,
  deptoDescricao?: string,
  cargoCodigo?: number,
  cargoDescricao?: string,
  dataReferencia?: Date,
  ueId?: string,
  ueDescricao?: string,
  pontos?: string;
  referencia?: number,
  importacoes?: RelogioPonto[],
  eventos?: FolhaEvento[],
  eventosAprovacoes?: FolhaEvento[],
}
