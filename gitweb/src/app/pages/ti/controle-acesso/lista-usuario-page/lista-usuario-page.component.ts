import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Usuario } from '../../../../models/usuario/Usuario';
import { ErrorHandleService } from '../../../../services/error-handle/error-handle.service';
import { UserService } from '../../../../services/user/user.service';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lista-usuario-page',
  standalone: true,
  imports: [
    DialogModule,
    TableModule
  ],
  templateUrl: './lista-usuario-page.component.html',
  styleUrl: './lista-usuario-page.component.scss'
})
export class ListaUsuarioPageComponent implements OnInit {

  @Output() outputUser = new EventEmitter();
  @Input() visible: boolean = false;

  users: Usuario[] = [];
  selectedUsers: Usuario = {}

  constructor(
    private userService: UserService,
    private errorHandleService: ErrorHandleService,
  ) { }

  ngOnInit(): void {

  }

  onHide() {
    this.outputUser.emit(null);
  }

  async onShow() {
    await this.apiBuscarUsers();

  }

  onRowSelectUser(event:any) {
    this.outputUser.emit(this.selectedUsers);
  }

  private async apiBuscarUsers() {
    await this.userService.apiBuscarUsuarios()
      .then(response => {
        this.users = response;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      });
  }


}
