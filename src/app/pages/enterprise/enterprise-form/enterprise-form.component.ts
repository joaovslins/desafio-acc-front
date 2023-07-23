import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EntepriseService } from '../shared/enteprise.service';
import { Enterprise } from '../shared/enterprise.model';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider } from '../../provider/shared/provider.model';
import { ProviderService } from '../../provider/shared/provider.service';	

@Component({
  selector: 'app-enterprise-form',
  templateUrl: './enterprise-form.component.html',
  styleUrls: ['./enterprise-form.component.css']
})
export class EnterpriseFormComponent {
  currentAction!: string;
  enterpriseForm!: FormGroup;
  pageTitle!: string;
  serverErrorMessages?: string[];
  submittingForm!: boolean;
  enterprise: Enterprise = new Enterprise();
  cepValue!: string;
  invalidCep!: boolean;
  addressData: any;
  providersSelectOptions: any[] = [];

  constructor(
    private toastr: ToastrService,
    private enterpriseService: EntepriseService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private providerService: ProviderService,
  ){}

  ngOnInit() {
    this.setCurrentyAction();
    this.buildEnterpriseForm();
    this.loadEnterprise();
    this.getProviders();
  }

  onCepChange(event: any) {
    const cep = event.target.value;
    this.cepValue = cep;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://cep.la/${cep}`, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = () => {
      if ((xhr.readyState == 0 || xhr.readyState == 4) && xhr.status == 200) {
        this.addressData = JSON.parse(xhr.responseText);
        this.invalidCep = this.validateJsonFormat(this.addressData);
      }
    };
    xhr.send(null);
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction == "new"){
      this.createEnterprise();
    }else{
      this.updateEnterprise();
    }
  }

  private createEnterprise(){
    const enteprise: Enterprise = Object.assign(new Enterprise(), this.enterpriseForm.value);
    this.enterpriseService.create(enteprise).subscribe(
      enteprise => this.actionsForSuccess(enteprise),
      error => this.actionsForError(error)
    )
  }

  private updateEnterprise(){
    const enteprise: Enterprise = Object.assign(new Enterprise(), this.enterpriseForm.value);

    this.enterpriseService.update(enteprise).subscribe(
      enteprise => this.actionsForSuccess(enteprise),
      error => this.actionsForError(error)
    )
  }

  private loadEnterprise(){
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.enterpriseService.getOne(+params.get("id")!))
      ).subscribe(
        enterprise => {
          this.enterprise = enterprise;
          this.enterpriseForm?.patchValue(enterprise);
        },
        () => this.toastr.error("Erro ao carregar Empresa")
      )
    }
  }

  private setCurrentyAction(){
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
      this.pageTitle = "Nova Empresa";
    }else{
      this.currentAction = "edit";
      this.pageTitle = "Editando Empresa";
    }
  }

  private buildEnterpriseForm() {
    this.enterpriseForm = this.formBuilder.group({
      id: [null],
      fantasy_name: [null, [Validators.required]],
      corporate_name: [null, [Validators.required]],
      cep: [null, [Validators.required, Validators.minLength(8)]],
      cnpj: [null, [Validators.required]],  
      providers: [[]],
    });
  }

  private setPageTitle(){
    const enterpriseName = this.enterprise.fantasy_name || "";

    this.pageTitle = this.currentAction == "new" ?
     "Criando Nova Empresa" :
     `Editando Empresa: ${enterpriseName}`;
  }


  private actionsForSuccess(enteprise: Enterprise){
    this.toastr.success("Empresa salva com sucesso!");
    this.router.navigateByUrl("enterprise", {skipLocationChange: true}).then(
      () => this.router.navigate(["enterprise", enteprise.id, "edit"])
    );
  }

  private actionsForError(error: any){
    this.toastr.error("Erro ao processar a sua solicitação");

    this.submittingForm = false;

    this.serverErrorMessages = [error.error];
  }

  validateJsonFormat(jsonData: any): boolean {
    if (
      jsonData &&
      jsonData.cep &&
      jsonData.uf &&
      jsonData.cidade &&
      jsonData.bairro &&
      jsonData.logradouro
    ) {
      return false;
    } else {
      return true;
    }
  }

  getProviders(){
    return this.providerService.getAll().subscribe(
      providers => {
        this.providersSelectOptions = providers.map(providers => ({
          label: providers.name,
          value: providers
        }));
      },
      error => {
        console.log(error);
      }
    );
  }
}
