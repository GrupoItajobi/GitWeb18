import { Component } from '@angular/core';
import { UnidadesComponent } from "../../../../components/unidades/unidades/unidades.component";
import { TableModule } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PlanejamentoMetaMoagemDia } from '../../../../models/agricola/planejamento/safra/moagem-safra';
import { MoagemSafraService } from '../../../../services/agricola/planejamento/moagem-safra.service';
import { ErrorHandleService } from '../../../../services/error-handle/error-handle.service';

@Component({
  selector: 'app-safra',
  standalone: true,
  imports: [UnidadesComponent,  TableModule, ReactiveFormsModule],
  templateUrl: './moagem-safra.component.html',
})
export class MoagemSafraComponent {
  [x: string]: any;

  form!: FormGroup;
  dataInicio: Date = new Date;
  dataFim: Date = new Date;  

  planejamentoMetaMoagemDia: PlanejamentoMetaMoagemDia[] = [];

  codEmpresa: number = 0; 
  codFilial: number = 0;
  codGrupoEmpresa: number = 0;
  

  constructor(
    private formBuilder: FormBuilder,
    private moagemSafraService: MoagemSafraService,
    private errorHandleService: ErrorHandleService,   
  ) { }

  ngOnInit() {
    this.initForm();  
  }

  async initForm(){ 

    this.form = this.formBuilder.group({      
      dataInicio: new FormControl(),
      dataHoraFim: new FormControl()
    })
    this.form.valueChanges.subscribe((newValue) => { });
  }

  selecionouUnidade(event: any) {
    
    switch (event) {
      case 'Itajobi':
        this.codEmpresa = 1;
        this.codFilial = 1;
        this.codGrupoEmpresa = 1;
        break;
        
      case 'Centroalcool':
        this.codEmpresa = 22;
        this.codFilial = 1;
        this.codGrupoEmpresa = 1;
        break;
          
      case 'Carolo':
        this.codEmpresa = 30;
        this.codFilial = 1;
        this.codGrupoEmpresa = 1;
        break;

      case 'VO-Cat':
        this.codEmpresa = 10;
        this.codFilial = 1;
        this.codGrupoEmpresa = 1;
        break;
            
      case 'Furlan':
        this.codEmpresa = 0;
        this.codFilial = 0;
        this.codGrupoEmpresa = 0;
        break;
              
      case 'RioPardo':
        this.codEmpresa = 0;
        this.codFilial = 0;
        this.codGrupoEmpresa = 0;
        break;
    }

    this.dataInicio = this.form.controls['dataInicio'].value;
    this.dataFim = this.form.controls['dataHoraFim'].value;
    

    const enviaDados = {
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
      codEmpresa: this.codEmpresa,
      codFilial: this.codFilial,
      codGrupo: this.codGrupoEmpresa     
    };

    console.log(enviaDados);
    this.enviarDados(enviaDados);
    
  }

  async enviarDados(enviaDados: any){

    try {
      const response = await this.moagemSafraService.busca(
        enviaDados
      );
      
      this.planejamentoMetaMoagemDia = response;

    } catch (error) {
      this.errorHandleService.handle(error);
    }
  }
}
