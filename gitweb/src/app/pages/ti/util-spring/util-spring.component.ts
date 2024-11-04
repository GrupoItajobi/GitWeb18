import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { initcap, initLower } from '../../../core/util/gitweb-util';
@Component({
  selector: 'app-util-spring',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextareaModule, FormsModule],
  templateUrl: './util-spring.component.html',
  styleUrl: './util-spring.component.scss'
})
export class UtilSpringComponent implements OnInit {
  form!: FormGroup;
  script!: string;

  entity!: string;
  repository!: string;
  service!: string;
  controller!: string;
  // dto!: string;
  crudDto!: string;
  responseDto!: string;
  mapper!: string;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initClasse() {
    let classe:string = this.form.value.classe;
    let isEntity:boolean=true;
    if (classe.substring(0,2).toUpperCase() ==="V_") {
      isEntity=false;
      classe = classe.substring(2);
    }
    classe = initcap(classe.replaceAll('_',' ')).replaceAll(' ', '');

    this.entity = classe + "Entity";
    if (!isEntity) {
      this.entity = classe + "View";
      classe = this.entity;
    }

    this.repository = classe + "Repository";
    this.service = classe + "Service";
    this.controller = classe + "Controller";
    // this.dto = classe + 'Dto';
    this.crudDto = classe + 'CrudDto';
    this.responseDto = classe + 'ResponseDto';
    this.mapper = classe + 'Mapper';
  }
  gerarEntity() {
    this.initClasse();

    // dependencias
    let script = "@Getter\n";
    script += "@Setter\n";
    script += "@Entity\n";
    let table: string = this.form.value.table
    script += '@Table(schema="gittec", name="' + table.toLowerCase() + '")\n';

    // criando a Classe
    script += 'public class ' + this.entity + ' extends EntityId {\n';
    script += 'private static final long serialVersionUID = 1L;\n\n'
    script += '@Column(name="")\n';
    script += 'private \n\n';
    script += '}'


    this.form.patchValue({
      script: script
    })

  }

  gerarRepository() {
    this.initClasse();
    let script: string = '@Repository\n';
    script += 'public interface ' + this.repository + ' extends JpaRepository<' + this.entity + ', String> {\n'
    script += '\n}'
    this.form.patchValue({
      script: script
    })
  }

  gerarService() {
    this.initClasse();
    // definir classe
    let script: string = '@Service \n';
    script += 'public class ' + this.service + '{\n\n';
    script += '@Autowired\n'
    script += 'private ' + this.repository + ' ' + initLower(this.repository) + ';\n\n'

    // criar classe
    script += 'public List<' + this.entity + '> listarTodos() { \n';
    script += 'return  ' + initLower(this.repository) + '.findAll(); \n';
    script += '} \n';

    // Buscar ou Falhar
    script += 'public ' + this.entity + " buscarOuFalhar(String id) {\n";
    script += "var entity =" + initLower(this.repository) + ".findById(id);\n";
    script += 'if (entity.isEmpty()) { \n'
    script += 'throw new EntidadeNaoEncontradaException("???? não localizado! : "+id); \n'
    script += '}\n'
    script += 'return entity.get();\n';
    script += '}\n\n'

    // Salvar
    script += '@Transactional \n';
    script += 'public ' + this.entity + ' salvar(' + this.entity + " entity) { \n";
    script += 'return save(entity); \n';
    script += '}\n\n';

    //Save
    script += 'private ' + this.entity + ' save(' + this.entity + " entity) { \n";
    script += 'return ' + initLower(this.repository) + '.saveAndFlush(entity); \n';
    script += '}\n\n';

    // Deletar
    script += 'public void deletar(String id) { \n';
    script += 'delete(id); \n';
    script += '}\n \n';

    // Delete
    script += 'private void delete(String id) { \n';
    script += initLower(this.repository) + '.deleteById(id); \n';
    script += '}\n \n';


    script += '}\n'
    this.form.patchValue({
      script: script
    })
  }

  gerarController() {
    this.initClasse();
    // Criano Classe
    let script: string = '@RestController\n';
    script += '@RequestMapping("GIt-api/ ?")\n';
    script += 'public class ' + this.controller + ' {\n';
    script += '  \n';

    // Importando  Servicos e mapper
    script += ' @Autowired\n';
    script += ' private ' + this.service + ' ' + initLower(this.service) + ';\n';
    script += '  \n';
    script += ' @Autowired\n';
    script += ' private ' + this.mapper + ' ' + initLower(this.mapper) + ';\n';
    script += '  \n';

    // Criando GetMapping
    script += '@GetMapping\n';
    script += 'public ResponseEntity<List<' + this.responseDto + '>> listarTodos() {\n';
    script += 'List<' + this.entity + '> entities = ' + initLower(this.service) + '.listarTodos();\n';
    script += 'List<' + this.responseDto + '> dtos = ' + initLower(this.mapper) + '.entityToDto' + this.responseDto + '(entities);\n';
    script += 'return ResponseEntity.status(HttpStatus.OK).body(dtos);\n';
    script += '}\n';
    script += '\n';

    // Criando PostMapping
    script += '@PostMapping\n';
    script += 'public ResponseEntity<' + this.responseDto + '> create (@Valid @RequestBody ' + this.crudDto + ' crud) {\n';
    script += this.entity + ' entity = ' + initLower(this.mapper) + '.dto' + this.crudDto + 'ToEntity(crud); \n';
    script += 'entity =  ' + initLower(this.service) + '.salvar(entity);  \n';
    script += this.responseDto + ' dto = ' + initLower(this.mapper) + '.entityToDto' + this.responseDto + '(entity);\n';
    script += 'return ResponseEntity.ok(dto);\n';
    script += '}\n\n';

    // Criando PutMapping
    script += '@PutMapping("/{id}")\n';
    script += 'public ResponseEntity<' + this.responseDto + '> update (@Valid @RequestBody ' + this.crudDto + ' crud, @PathVariable String id) {\n';
    script += this.entity + ' entityAtual= ' + initLower(this.service) + '.buscarOuFalhar(id);\n'
    script += 'BeanUtils.copyProperties(crud,entityAtual,"id");'
    script += 'entityAtual =  ' + initLower(this.service) + '.salvar(entityAtual);\n'
    script += this.responseDto + ' dto = ' + initLower(this.mapper) + '.entityToDto' + this.responseDto + '(entityAtual);\n'
    script += 'return ResponseEntity.ok(dto);\n'
    script += '}\n';


    // Fechando Controller
    script += '\n }  \n';

    this.form.patchValue({
      script: script
    });
  }


  gerarResponseDto() {
    this.initClasse();
    let script!: String;
    script = this.dependenciasDto();
    script += 'public class ' + this.responseDto + ' implements Serializable {\n';
    script += 'private static final long serialVersionUID = 1L;\n\n'
    script += 'private String id;\n\n'
    script += 'private Integer version;\n\n'
    script += '}\n';
    this.form.patchValue({
      script: script
    })
  }
  gerarCrudDto() {
    this.initClasse();
    let script!: String;
    script = this.dependenciasDto();
    script += 'public class ' + this.crudDto + ' implements Serializable {\n';
    script += 'private static final long serialVersionUID = 1L;\n\n'
    script += 'private String id;\n\n'
    script += 'private Integer version;\n\n'
    script += '}\n';
    this.form.patchValue({
      script: script
    })
  }

  dependenciasDto(): string {
    let script: string = "";
    script += 'import java.io.Serializable;\n\n';
    script += 'import lombok.AllArgsConstructor;\n';
    script += 'import lombok.Builder;\n';
    script += 'import lombok.Getter;\n';
    script += 'import lombok.NoArgsConstructor;\n';
    script += 'import lombok.Setter;\n\n';
    script += '@Getter\n';
    script += '@Setter\n';
    script += '@Builder\n';
    script += '@AllArgsConstructor\n';
    script += '@NoArgsConstructor\n';
    return script;

  }

  gerarMapper() {
    this.initClasse();
    // criar
    let script: string = '\n';
    script += '@AllArgsConstructor\n';
    script += '@Component\n';
    script += 'public class ' + this.mapper + '{  \n \n';
    script += ' private ModelMapper modelMapper;\n \n';
    script += '\n';

    // DtoCrud para Entidade
    script += " // dtoCrud para Entidade\n"
    script += 'public ' + this.entity + ' dto' + this.crudDto + 'ToEntity(' + this.crudDto + ' dto) {  \n';
    script += 'return modelMapper.map(dto,' + this.entity + '.class);  \n';
    script += '}  \n \n';

    // Entidade para Dto Response
    script += " // entidade para dto RESPONSE \n"
    script += 'public ' + this.responseDto + '  entityToDto' + this.responseDto + '(' + this.entity + ' entity) {  \n';
    script += 'return modelMapper.map(entity,' + this.responseDto + '.class);  \n';
    script += '}  \n \n';

    // Lista de Entidade para Lista de Dto
    script += " // List de entidades para dto \n"
    script += 'public List<' + this.responseDto + '> entityToDto' + this.responseDto + '(List<' + this.entity + '> entities) {  \n';
    script += 'List<' + this.responseDto + '> dtos = new ArrayList<>(); \n';
    script += 'entities.forEach( entity -> { \n';
    script += ' var dto = entityToDto' + this.responseDto + '(entity); \n';
    script += ' dtos.add(dto); \n';
    script += '}); \n';
    script += 'return dtos; \n';
    script += ' \n';
    script += '}  \n \n';

    script += '\n }  \n';

    this.form.patchValue({
      script: script
    })
  }

  initForm() {

    this.form = this.formBuilder.group(
      {
        table: new FormControl(''),
        classe: new FormControl(''),
        script: new FormControl(''),
      }
    );
    this.form.valueChanges.subscribe(newValue => {
    });
  }
}
