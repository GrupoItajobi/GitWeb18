import { RoleTag } from "./RoleTag";

export interface Role {
  id?: string,
  tag?: string,
  descricao?: string;
  linkId?:String,
  tags?: RoleTag[],
}
