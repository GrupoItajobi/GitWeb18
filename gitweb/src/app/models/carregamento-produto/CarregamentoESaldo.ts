import { EstoqueProduto } from "../producao/estoqueProduto";
import { CarregamentoFila } from "./CarregamentoFila";

export interface CarregamentoESaldo {
  carregamentos?:CarregamentoFila[];
  estoqueProduto?:EstoqueProduto[];
}
