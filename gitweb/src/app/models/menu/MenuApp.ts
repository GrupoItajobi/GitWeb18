import { MenuModulo } from "./MenuModulo";

export interface MenuApp {
  id?: string;
  descricao?: string;
  ordem?: number,
  link?: string,
  publico?: boolean,
  backOuFront?: string;
  menuTipo?: string;
  menuModulo?: MenuModulo;
}
