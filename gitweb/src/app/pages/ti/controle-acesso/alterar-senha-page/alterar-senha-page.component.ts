import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { UsuarioAlterarSenha } from '../../../../models/usuario/UsuarioAlterarSenha';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { ErrorHandleService } from '../../../../services/error-handle/error-handle.service';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-alterar-senha-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    PasswordModule
  ],
  templateUrl: './alterar-senha-page.component.html',
  styleUrl: './alterar-senha-page.component.scss'
})
export class AlterarSenhaPageComponent implements OnInit {
  @Output() eventCloseDialog = new EventEmitter();
  @Input() visible: boolean = false;

  form!: FormGroup;
  user!: UsuarioAlterarSenha;

  constructor(
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private toastMessageService: ToastService,
    private errorHandleService: ErrorHandleService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  async alterarSenha() {

    this.form.patchValue({ login: this.auth.usuarioLogado().login! });
    this.user = this.form.value;

    if (this.user.newPassword && this.user.newPasswordConfirm && this.user.newPassword === this.user.newPasswordConfirm) {

      await this.auth.alterarSenha(this.user)
        .then(request => {
          this.initForm();
          this.toastMessageService.showSuccessMsg("Senha Alterada");
          this.eventCloseDialog.emit(true);
        })
        .catch(erro => {
          this.errorHandleService.handle(erro);
          this.onHideDialog();
        });
    } else {
      this.toastMessageService.showWarnMsg('Senhas não conferem...')
    }
  }

  onHideDialog() {
    this.initForm();

    this.visible = false;
    this.eventCloseDialog.emit(true);
  }


  initForm() {

    this.user = {
      login: this.auth.usuarioLogado().login!,
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    }
    this.form = this.formBuilder.group(
      {
        login: new FormControl(this.auth.usuarioLogado().login, Validators.required),
        oldPassword: new FormControl(this.user.oldPassword, Validators.required),
        newPassword: new FormControl(this.user.newPassword, Validators.required),
        newPasswordConfirm: new FormControl(this.user.newPasswordConfirm, Validators.required),
      });

    this.form.valueChanges.subscribe(newValue => {
      this.checkChanges(newValue);
    });
  }

  checkChanges(change: any) {
  }

}
