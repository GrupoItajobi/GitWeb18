export interface UsuarioAlterarSenha {
  login: string,
  oldPassword: string,
  newPassword: string,
  newPasswordConfirm?: string;
}
