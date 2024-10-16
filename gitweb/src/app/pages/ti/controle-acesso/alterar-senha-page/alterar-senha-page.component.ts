import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { UsuarioAlterarSenha } from '../../../../models/usuario/UsuarioAlterarSenha';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { ErrorHandleService } from '../../../../services/error-handle/error-handle.service';

@Component({
  selector: 'app-alterar-senha-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DialogModule
  ],
  templateUrl: './alterar-senha-page.component.html',
  styleUrl: './alterar-senha-page.component.scss'
})
export class AlterarSenhaPageComponent implements OnInit {
  @Output() eventCloseDialog = new EventEmitter();
  @Input() visible: boolean = false;
  @Input() login!: string;

  form!: FormGroup;
  user!: UsuarioAlterarSenha;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private toastMessageService: ToastService ,
    private errorHandleService: ErrorHandleService,
  ) { }

  ngOnInit(): void {
    this.user = {} as UsuarioAlterarSenha;
    this.initForm();
  }

  async alterarSenha() {
    this.user = this.form.value;
    await this.auth.alterarSenha(this.user)
      .then(request => {
        this.toastMessageService.showSuccessMsg("Senha Alterada");
        this.eventCloseDialog.emit(true);
      })
      .catch(erro => {
        this.errorHandleService.handle(erro);
      });
  }

  onHideDialog() {
    console.log('onHide');
    this.visible = false;
    this.eventCloseDialog.emit(true);
  }

  initForm() {
    this.user = {
      login: this.login,
      oldPassword: "",
      newPassword: ""
    }
    this.form = this.formBuilder.group(
      {
        login: new FormControl(this.login, Validators.required),
        oldPassword: new FormControl(this.user.oldPassword, Validators.required),
        newPassword: new FormControl(this.user.newPassword, Validators.required),
      });

    this.form.valueChanges.subscribe(newValue => {
      this.checkChanges(newValue);
    });
  }

  checkChanges(change: any) {
  }

}
