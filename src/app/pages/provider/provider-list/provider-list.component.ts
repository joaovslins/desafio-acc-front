import { Component } from '@angular/core';

import { ProviderService } from '../shared/provider.service'; 
import { Provider } from '../shared/provider.model';

import { ToastrService } from 'ngx-toastr';
import { format } from 'date-fns';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.css']
})
export class ProviderListComponent {

  providers: Provider[] = [];
  documentProvider = '';
  nameProvider = '';

  constructor(private providerService: ProviderService, private toastr: ToastrService) { }

  ngOnInit() {
    this.providerService.getAll().subscribe(
      providers => this.providers = providers,
      error => console.log(error)
    );
  }

  deleteProvider(id: number) {

    const mustDelete = confirm("deseja deletar esse Fornecedor?");

    if(mustDelete){
      this.providerService.delete(id).subscribe(
        () => this.providers = this.providers.filter(p => p.id !== id),
        error => this.toastr.error(error.error)
      );
    }
  }

  typeAsText(type: any): string {
    switch (type) {
      case 1:
        return "Pessoa Física";
      case 2:
        return "Pessoa Jurídica";
      default:
        return "Não Definido";
    }
  }

  converterData(data: any){
    if(data){
      const dataObj = new Date(data);
      return format(dataObj, 'dd/MM/yyyy');
    }
    return null;
  }

  filter() {
    if (this.nameProvider || this.documentProvider) {
      this.providers = this.providers.filter(provider => {
        const nomeMatch = provider.name?.toLowerCase().indexOf(this.nameProvider?.toLowerCase()) !== -1;
        const documentMatch = provider.document?.indexOf(this.documentProvider);
  
        return nomeMatch || documentMatch;
      });
    } else {
      this.providerService.getAll().subscribe(
        providers => this.providers = providers,
        error => console.log(error)
      );
    }
  }

}
