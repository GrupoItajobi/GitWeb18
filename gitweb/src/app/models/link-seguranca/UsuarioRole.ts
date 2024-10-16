import { Usuario } from "../usuario/Usuario";
import { Role } from "./Role";

export interface UsuarioRole {
  id?: string;
  role?: Role;
  usuario?: Usuario;
}
