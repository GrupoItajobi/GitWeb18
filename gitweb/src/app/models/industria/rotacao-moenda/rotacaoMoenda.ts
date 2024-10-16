import { Moenda } from './moenda';
import { UE } from "../../empresa/ue";
import { MoendaEvento } from './moendaEvento';

export interface RotacaoMoenda {
  id?: string,
  version?: number,
  ue?: UE
  moenda?: Moenda,
  dataInicio?: Date,
  dataFim?: Date,
  rotacaoIdeal?: number,
  rotacaoAtual?: number,
  observacao?: string,
  dataPrevistaRetorno?:Date,
  evento?: MoendaEvento
}
