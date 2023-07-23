import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../shared/provider.service';
import { Provider } from '../shared/provider.model';
import { Enterprise } from '../../enterprise/shared/enterprise.model';
import { EntepriseService } from '../../enterprise/shared/enteprise.service';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.css']
})
export class ProviderFormComponent {

  currentAction!: string;
  providerForm!: FormGroup;
  pageTitle!: string;
  serverErrorMessages?: string[];
  submittingForm!: boolean;
  provider: Provider = new Provider();
  cepValue!: string;
  invalidCep!: boolean;
  addressData: any;
  enterprisesSelectOptions: any[] = [];

  constructor(
    private toastr: ToastrService,
    private providerService: ProviderService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private enterpriseService: EntepriseService
  ){}

  ngOnInit() {
    this.setCurrentyAction();
    this.buildProviderForm();
    this.loadProvider();

    this.providerForm.get('type')!.valueChanges.subscribe(() => {
      this.updateValidation();
    });
  
    this.updateValidation();
    this.getEnterprises();
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
      this.createProvider();
    }else{
      this.updateProvider();
    }
  }

  private createProvider(){
    const provider: Provider = Object.assign(new Provider(), this.providerForm.value);
    this.providerService.create(provider).subscribe(
      provider => this.actionsForSuccess(provider),
      error => this.actionsForError(error)
    )
  }

  private updateProvider(){
    const provider: Provider = Object.assign(new Provider(), this.providerForm.value);

    this.providerService.update(provider).subscribe(
      provider => this.actionsForSuccess(provider),
      error => this.actionsForError(error)
    )
  }

  private loadProvider(){
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.providerService.getOne(+params.get("id")!))
      ).subscribe(
        provider => {
          this.provider = provider;
          this.providerForm?.patchValue(provider);
        },
        () => this.toastr.error("Erro ao carregar fornecedor")
      )
    }
  }

  private setCurrentyAction(){
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
      this.pageTitle = "Novo Fornecedor";
    }else{
      this.currentAction = "edit";
      this.pageTitle = "Editando Fornecedor";
    }
  }

  private buildProviderForm() {
    this.providerForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      type: [null],
      email: [null, [Validators.required, Validators.email]],
      cep: [null, [Validators.required, Validators.minLength(8)]],
      birthday: [null],
      document: [null, [Validators.required]],
      age: [null, Validators.required],
      rg: [null, [Validators.maxLength(9), Validators.minLength(9)]], 
      enterprises: [[]]
    });
  }

  private setPageTitle(){
    const providerName = this.provider.name || "";

    this.pageTitle = this.currentAction == "new" ?
     "Criando Novo Fornecedor" :
     `Editando Fornecedor: ${providerName}`;
  }


  private actionsForSuccess(provider: Provider){
    this.toastr.success("Fornecedor salvo com sucesso!");
    this.router.navigateByUrl("provider", {skipLocationChange: true}).then(
      () => this.router.navigate(["provider", provider.id, "edit"])
    );
  }

  private actionsForError(error: any){
    this.toastr.error("Erro ao processar a sua solicitação");

    this.submittingForm = false;

    this.serverErrorMessages = [error.error];
  }


  private updateValidation() {
    const typeValue = this.providerForm.get('type')!.value;
    const rgControl = this.providerForm.get('rg');
    const birthdayControl = this.providerForm.get('birthday');

    if (typeValue === '1') { 
      rgControl!.setValidators([Validators.required]);
      birthdayControl!.setValidators([Validators.required]);
    } else {
      rgControl!.clearValidators();
      birthdayControl!.clearValidators();
    }

    rgControl!.updateValueAndValidity();
    birthdayControl!.updateValueAndValidity();
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

  getEnterprises(){
    return this.enterpriseService.getAll().subscribe(
      enterprises => {
        this.enterprisesSelectOptions = enterprises.map(enterprise => ({
          label: enterprise.corporate_name,
          value: enterprise
        }));
      },
      error => {
        console.log(error);
      }
    );
  }
}
