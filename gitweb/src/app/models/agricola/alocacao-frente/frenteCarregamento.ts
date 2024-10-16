import { FA} from "../fa/fa"
import { Frente } from "./frente"

export interface FrenteCarregamento {

  frente?: number,
  fa?: number,
  tempoIdaMinutos?: number,
  tempoBateMinutos?: number,
  tempoVoltaMinutos?: number,
  tempoCarregamentoMinutos?: number,
  dataInicio?: Date
  dataFim?: Date
  ativo?: string
}
