import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../services/toast/toast.service';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';

import { Role } from '../../../../models/link-seguranca/Role';
import { RoleTag } from '../../../../models/link-seguranca/RoleTag';
import { UsuarioRole } from '../../../../models/link-seguranca/UsuarioRole';
import { Usuario } from '../../../../models/usuario/Usuario';
import { UsuarioAlterarSenha } from '../../../../models/usuario/UsuarioAlterarSenha';
import { MenuApp } from '../../../../models/menu/MenuApp';
import { MenuGestao } from '../../../../models/menu/MenuGestao';
import { MenuModulo } from '../../../../models/menu/MenuModulo';
import { MenuTipo } from '../../../../models/menu/MenuTipo';


import { MenuCrudComponent } from '../../../../components/crud/menu-crud/menu-crud.component';
import { ListaUsuarioPageComponent } from "../lista-usuario-page/lista-usuario-page.component";

import { MenuService } from '../../../../services/menu/menu.service';
import { AcessosAplicacaoService } from '../../../../services/controle-acesso/acessos-aplicacao.service';
import { ErrorHandleService } from '../../../../services/error-handle/error-handle.service';
import { UrlService } from '../../../../services/url/url.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-controle-acesso-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    DialogModule,
    DividerModule,
    SelectButtonModule,
    PasswordModule,
    ButtonModule,
    AccordionModule,
    TableModule,
    ConfirmDialogModule,
    ToastModule,
    DropdownModule,
    MenuCrudComponent,

    ListaUsuarioPageComponent
  ],
  templateUrl: './controle-acesso-page.component.html',
  styleUrl: './controle-acesso-page.component.scss'
})
export class ControleAcessoPageComponent implements OnInit {


  formUser!: FormGroup;
  formModulo!: FormGroup;
  formApp!: FormGroup;
  formRole!: FormGroup;
  formTag!: FormGroup;

  menuGestao: MenuGestao[] = [];
  menuModulo: MenuModulo[] = [];
  menuTipo: MenuTipo[] = [];
  menuApp: MenuApp[] = [];

  roles: Role[] = [];
  selectedRole: Role = {};
  editRole: Role = {};

  roleTags: RoleTag[] = [];
  selectedRoleTag: RoleTag = {};
  editTag: RoleTag = {}

  roleUsers: UsuarioRole[] = [];
  selectedRoleUsers: UsuarioRole = {}

  users: Usuario[] = [];
  selectedUsers: Usuario = {};
  userChange!: UsuarioAlterarSenha;

  newPassword!: UsuarioAlterarSenha;
  newUser!: Usuario;

  selectedGestao: MenuGestao = {};
  selectedModulo: MenuModulo = {};
  selectedTipo: MenuTipo = {};
  selectedApp: MenuApp = {};

  buttonUserOrigem!: string;

  loading: boolean = false;
  saving: boolean = false;

  excluindo!: string;

  visibleApp: boolean = false;
  visibleModulo: boolean = false;
  visibleRole: boolean = false;
  visibleTag: boolean = false;
  visibleListUser: boolean = false;

  publicoOptions: any[] = [
    { label: 'Sim', value: 'S' },
    { label: 'Não', value: 'N' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    private appService: AcessosAplicacaoService,
    private auth: AuthService,
    private errorHandleService: ErrorHandleService,
    private confirmationService: ConfirmationService,
    private toastMessageService: ToastService,
    private router: Router,
    private urlService: UrlService,
  ) {
    // this.init();
  }


  ngOnInit(): void {
    this.init();
    this.initForms()

  }

  async init() {
    await this.urlService.permissaoParaoLink(this.router.url);

    this.limparGestao();
    this.buscarGestao();
  }

  buscarGestao() {
    this.menuService.apiBuscarMenuGestao()
      .then(request => {
        this.menuGestao = request;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
  }
  showDialogModulo() {
    this.initFormModulo();
    this.visibleModulo = true;
  }
  showDialogRole() {
    this.initFormRole();
    this.visibleRole = true;
  }
  showDialogTag() {
    this.initFormTag();
    this.visibleTag = true;
  }
  showDialogApp() {
    this.initFormApp();
    this.visibleApp = true;
  }
  onHideDialogApp() {

  }

  closeDialogApp() {
    this.visibleApp = false;
  }
  closeDialogModulo() {
    this.visibleModulo = false;
  }
  closeDialogRole() {
    this.visibleRole = false;
  }
  closeDialogTag() {
    this.visibleTag = false;
  }

  showListUsers(buttonUserOrigem: string) {
    this.selectedUsers = {};
    this.buttonUserOrigem = buttonUserOrigem;
    this.visibleListUser = true;
  }

  async emitterUser(user: Usuario) {

    if (user != null) {
      this.selectedUsers = user;
      if (this.buttonUserOrigem == 'roleUser') {
        await this.saveRoleUser(user);
      } else if (this.buttonUserOrigem == 'formUser') {
        this.initFormUser();
      }
    }

    this.visibleListUser = false;

  }
  async emmitterUsuarioCrudSalvar(value: boolean) {
    console.log(this.formUser.value)

    this.selectedUsers = this.formUser.value;

    if (this.selectedUsers.id) {
      // change user
      await this.auth.resetUser(this.selectedUsers)
        .then(response => {
          this.selectedUsers = response;
          this.initFormUser();
          this.toastMessageService.showSuccessMsg(`Usuario: ${this.selectedUsers.nome} Atualizado!`)
        })
        .catch(error => this.errorHandleService.handle(error));
    } else {
      // create user
      await this.auth.create(this.selectedUsers)
        .then(response => {
          this.selectedUsers = response;
          this.initFormUser();
          this.toastMessageService.showSuccessMsg(`Usuario: ${this.selectedUsers.nome} Atualizado!`)
        })
        .catch(error => this.errorHandleService.handle(error));
    }
  }

  emmitterUsuarioCrudAdicionar(value: boolean) {
    this.selectedUsers = {}
    this.initFormUser();
  }

  emmitterUsuarioCrudExcluir(value: boolean) {
    this.excluindo = 'user';
    this.controleDeExclusao();
  }

  async saveRoleUser(user: Usuario) {

    await this.appService.apiIncluirUsuarioRole(user!.login!, this.selectedRole!.id!, this.selectedApp!.id!)
      .then(response => {
        this.selectedRoleUsers = response;
        this.roleUsers.push(this.selectedRoleUsers);
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      });
  }

  async saveModulo() {
    let modulo: MenuModulo = this.formModulo.value;

    await this.menuService.apiSalvarModulo(modulo)
      .then(response => {
        this.visibleModulo = false;
        this.onRowSelectGestao(null);
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
  }

  async saveApp() {
    let app: MenuApp = this.formApp.value;
    if (!app.id) {
      await this.incluirApp(app);
    } else {
      await this.alterarApp(app);
    }

    this.visibleApp = false;

  }

  private async incluirApp(app: MenuApp) {
    await this.appService.apiIncluirApp(app)
      .then(response => {
        this.selectedApp = response;
      })
      .catch(error => {
        this.errorHandleService.handle(error)
      });

    await this.buscarApp();
  }
  private async alterarApp(app: MenuApp) {
    await this.appService.apiAlterarApp(app)
      .then(response => {
        this.selectedApp = response;
      })
      .catch(error => {
        this.errorHandleService.handle(error)
      });

    await this.buscarApp();
  }

  async saveRole() {
    this.editRole = {
      id: this.selectedRole.id,
      descricao: this.formRole.value.descricao,
      tag: this.formRole.value.tag,
      linkId: this.selectedApp.id,
    }

    if (this.editRole.id) {
      await this.alterarRole();
    } else {
      await this.incluirRole();
    }

  }

  private async alterarRole() {
    await this.appService.apiAlterarRoleRoleDoApp(this.editRole)
      .then(response => {
        this.selectedRole = response;

        // atualizando a lista..
        // se atualizar o objeto todo não funciona
        this.roles.forEach(t => {
          if (t.id == this.selectedRole.id) {
            t.tag = this.selectedRole.tag;
            t.descricao = this.selectedRole.descricao;
          }
        })
        this.visibleRole = false;
      })
      .catch(error => this.errorHandleService.handle(error));
  }

  private async incluirRole() {
    await this.appService.apiIncluirRoleDoApp(this.editRole)
      .then(response => {
        this.selectedRole = response;
        this.roles.push(this.selectedRole);
        this.visibleRole = false;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      });
  }

  async saveTag() {

    let tag: RoleTag = {
      id: this.formTag.value.id,
      tag: this.formTag.value.tag,
      descricao: this.formTag.value.descricao,
      roleId: this.selectedRole.id,
    }

    this.appService.apiSalvarTagParaRole(tag)
      .then(response => {
        this.selectedRoleTag = response;
        if (!tag.id) {
          this.roleTags.push(this.selectedRoleTag);
        } else {
          this.roleTags.forEach(t => {
            if (t.id == tag.id) {
              t.descricao = this.selectedRoleTag.descricao;
              t.tag = this.selectedRoleTag.tag;
            }
          })
        }

        this.visibleTag = false;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })

  }

  onRowUnselectGestao(event: any) {
    this.selectedGestao = {}
    this.limparModulo();
  }

  onRowSelectGestao(event: any) {
    this.limparModulo();
    this.menuService.apiBuscarMenuModulo(this.selectedGestao!.id!)
      .then(request => {
        this.menuModulo = request;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
  }

  onRowSelectModulo(event: any) {
    this.limparTipo()
    this.menuTipo = this.menuService.apiBuscarMenuTipo();
  }
  onRowUnselectModulo(event: any) {
    this.selectedModulo = {}
    this.limparTipo();
  }
  onRowSelectTipo(event: any) {
    this.limparApp();
    this.buscarApp();
  }

  onRowUnselectTipo(event: any) {
    this.selectedTipo = {}
    this.limparApp();
  }

  async buscarApp() {
    await this.menuService.apiBuscarMenuApp(this.selectedModulo!.id!, this.selectedTipo!.id!)
      .then(request => {
        this.menuApp = request;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
  }


  async onRowSelectApp(event: any) {
    this.roles = [];
    await this.appService.apiBuscarRolesDoApp(this.selectedApp!.id!)
      .then(response => {
        this.roles = response;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
  }
  onRowUnselectApp(event: any) {
    this.limparRole()
    this.selectedApp = {}
  }

  async onRowSelectRole(event: any) {
    this.limparRoleTag();
    this.limparRoleUsers();
    await this.apiBuscarRoleUsuarios();
    await this.apiBuscarRoleTags();
  }


  async apiBuscarRoleTags() {
    await this.appService.apiBuscarTagsDaRole(this.selectedRole!.id!)
      .then(response => {
        this.roleTags = response;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      });
  }
  async apiBuscarRoleUsuarios() {
    await this.appService.apiBuscarUsuariosDaRole(this.selectedRole!.id!)
      .then(response => {
        this.roleUsers = response;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      });
  }


  onRowUnselectRole(event: any) {
    this.selectedRole = {}
    this.limparRoleTag()
  }

  onRowSelectRoleTag(event: any) {
  }
  onRowUnselectRoleTag(event: any) {
    this.selectedRoleTag = {}
  }


  onRowSelectRoleUser(event: any) {
  }
  onRowUnselectRoleUser(event: any) {
    this.selectedRoleUsers = {}
  }
  popularGestao() {

  }

  limparGestao() {
    this.menuGestao = [];
    this.selectedGestao = {};
    this.limparModulo();
  }

  limparModulo() {
    this.menuModulo = [];
    this.selectedModulo = {};
    this.limparTipo();
  }

  limparTipo() {
    this.menuTipo = [];
    this.selectedTipo = {};
    this.limparApp();
  }

  limparApp() {
    this.limparRole();
    this.menuApp = [];
    this.selectedApp = {};
  }

  limparRole() {
    this.limparRoleUsers();
    this.limparRoleTag();
    this.roles = [];
    this.selectedRole = {}

  }

  limparRoleTag() {
    this.roleTags = [];
    this.selectedRoleTag = {}
  }

  limparRoleUsers() {
    this.roleUsers = [];
    this.selectedRoleUsers = {}
  }
  onChange() {
    console.log('onChange');
    console.log(this.selectedGestao)
  }

  initForms() {
    this.initFormApp();
    this.initFormModulo();
    this.initFormRole();

    this.initFormTag();
    this.initFormUser();
  }

  initFormRole() {

    this.formRole = this.formBuilder.group(
      {
        id: new FormControl(this.selectedRole.id),
        tag: new FormControl(this.selectedRole.tag, Validators.required),
        descricao: new FormControl(this.selectedRole.descricao, Validators.required),
      });

    this.formRole.valueChanges.subscribe(newValue => { });
  }

  initFormModulo() {

    this.formModulo = this.formBuilder.group(
      {
        id: new FormControl(this.selectedModulo.id),
        descricao: new FormControl(this.selectedModulo.descricao, Validators.required),
        menuGestaoId: new FormControl(this.selectedGestao.id),
        ordem: new FormControl(this.selectedModulo.ordem),
        version: new FormControl(this.selectedModulo.version),
      });

    this.formModulo.valueChanges.subscribe(newValue => { });
  }

  initFormTag() {
    this.editTag = this.selectedRoleTag;
    this.formTag = this.formBuilder.group(
      {
        id: new FormControl(this.editTag.id),
        tag: new FormControl(this.editTag.tag, Validators.required),
        descricao: new FormControl(this.editTag.descricao, Validators.required),
      });

    this.formRole.valueChanges.subscribe(newValue => { });
  }

  initFormApp() {


    this.formApp = this.formBuilder.group(
      {
        id: new FormControl(this.selectedApp!.id!),
        link: new FormControl(this.selectedApp!.link!, Validators.required),
        descricao: new FormControl(this.selectedApp!.descricao, Validators.required),
        ordem: new FormControl(this.selectedApp!.ordem!),
        publico: new FormControl(this.selectedApp!.publico!, Validators.required),
        menuModuloId: new FormControl(this.selectedModulo!.id!, Validators.required),
        menuTipo: new FormControl(this.selectedTipo!.id, Validators.required),
        backOuFront: 'Front'
      });

    this.formApp.valueChanges.subscribe(newValue => {

    });
  }

  initFormUser() {
    this.formUser = this.formBuilder.group(
      {
        id: new FormControl(this.selectedUsers!.id!),
        login: new FormControl(this.selectedUsers.login, Validators.required),
        nome: new FormControl(this.selectedUsers.nome, Validators.required),
        password: new FormControl('', Validators.required),
      });

    this.formUser.valueChanges.subscribe(newValue => {

    });
  }

  private async controleDeExclusao() {

    if (this.excluindo == "app") {
      await this.apiExcluirApp();

    } else if (this.excluindo == "modulo") {
      await this.menuService.apiExcluirModulo(this.selectedModulo.id!)
        .then(data => {
          this.onRowSelectGestao(null);
          this.toastMessageService.showSuccessMsg("Modulo Excluído!")
        })
        .catch(error => {
          this.errorHandleService.handle(error);
        });

    } else if (this.excluindo == "role") {
      await this.apiExcluirRole();

    } else if (this.excluindo == "tag") {
      await this.apiExcluirTag();

    } else if (this.excluindo == "roleUser") {
      await this.apiExcluirRoleUser();

    } else if (this.excluindo == "user") {
      console.log('controleDeExclusao user');
      await this.apiExcluirUser()
    }
    console.log('saindo')
    this.excluindo = "";
  }

  private async apiExcluirUser() {

    await this.auth.deleteUser(this.selectedUsers!.id!)
      .then(response => {
        this.toastMessageService.showSuccessMsg(`Usuário [${this.selectedUsers.login}] Removido!`);
        this.selectedUsers = {};
        this.initFormUser();
      })
      .catch(error => {
        this.errorHandleService.handle(error)
      });
  }

  private async apiExcluirRoleUser() {
    await this.appService.apiExcluirUsuarioDaRole(this.selectedRoleUsers!.id!)
      .then(response => {
        console.log(response)
        if (response && response == true) {
          this.roleUsers.forEach((t, index) => {
            if (t.id == this.selectedRoleUsers.id) {
              this.roleUsers.splice(index, 1);
            }
          });
          this.selectedRoleUsers = {}
          this.toastMessageService.showSuccessMsg('Usuário Removido!');
        }
      })
      .catch(error => {
        this.errorHandleService.handle(error)
      });
  }

  private async apiExcluirRole() {
    await this.appService.apiExcluirRoleRoleDoApp(this.selectedRole)
      .then(response => {
        console.log(response)
        if (response && response == true) {
          this.roles.forEach((t, index) => {
            if (t.id == this.selectedRole.id) {
              this.roles.splice(index, 1);
            }
          });
          this.limparRoleTag();
          this.roleTags = [];
          this.selectedRole = {}
          this.toastMessageService.showSuccessMsg('Role Removida com Sucesso');
        }
      })
      .catch(error => {
        this.errorHandleService.handle(error)
      });

  }
  private async apiExcluirTag() {
    await this.appService.apiExcluirTagDaRole(this.selectedRoleTag)
      .then(response => {
        console.log(response)
        if (response && response == true) {
          this.roleTags.forEach((t, index) => {
            if (t.id == this.selectedRoleTag.id) {
              this.roleTags.splice(index, 1);
            }
          });
          this.selectedRoleTag = {}
          this.toastMessageService.showSuccessMsg('Tag Removida com Sucesso');
        }
      })
      .catch(error => {
        this.errorHandleService.handle(error)
      });

  }

  private async apiExcluirApp() {
    await this.appService.apiExcluirApp(this.selectedApp)
      .then(response => {
        console.log(response)
        if (response && response == true) {
          this.selectedApp = {}
          this.toastMessageService.showSuccessMsg('Removido com Sucesso');
        }
      })
      .catch(error => {
        this.errorHandleService.handle(error)
      });

    await this.buscarApp();
  }

  confirmExcluir(event: Event, excluindo: string) {
    this.excluindo = excluindo;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Quer realmente Excluir este Registo?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass: "p-button-success p-button-text",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      defaultFocus: "reject",
      acceptIcon: "none",
      rejectIcon: "none",
      reject: () => {
      },
      accept: () => {
        this.controleDeExclusao();
      },

    });
  }
}
