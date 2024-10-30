import { MenuModulo } from "./MenuModulo";

export interface MenuApp {
  id?: string;
  descricao?: string;
  ordem?: number,
  link?: string,
  publico?: string,
  backOuFront?: string;
  menuTipo?: string;
  menuModulo?: MenuModulo;
}
