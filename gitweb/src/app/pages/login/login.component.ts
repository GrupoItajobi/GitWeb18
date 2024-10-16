import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandleService } from '../../services/error-handle/error-handle.service';
import { MessageService } from 'primeng/api';
import { MenuService } from '../../services/menu/menu.service';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { UrlService } from '../../services/url/url.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordModule, ToastModule, MessagesModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  formLogin!: FormGroup;


  url = inject(UrlService);

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private errorHandleService: ErrorHandleService,
    private messageService: MessageService,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.initFormLogin();
    this.auth.clear();
    this.url.clear();
  }

  home() {
    this.auth.link = "";
    this.router.navigate(["/home"]);
  }


  async login():Promise<any> {
    this.messageService.clear();
    await this.auth.login(this.formLogin.value.login, this.formLogin.value.password)
      .then(data => {
        this.menuService.clear()
        let link = '/home';
        if (this.auth.link) {
          link = this.auth.link!;
          this.auth.link = "";
        }
        this.auth.startRefresh();
        this.router.navigate([link]);
      })
      .catch(error => {
        // this.auth.stopRefresh();
        this.errorHandleService.handle(error);
        Promise.reject(error)
      });
  }


  initFormLogin() {
    this.formLogin = this.formBuilder.group(
      {
        login: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
      }
    );
    this.formLogin.valueChanges.subscribe(newValue => {
    });
  }
}
