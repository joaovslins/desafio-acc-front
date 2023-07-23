import { Component } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { format } from 'date-fns';

import { EntepriseService } from '../shared/enteprise.service';
import { Enterprise } from '../shared/enterprise.model';

@Component({
  selector: 'app-enterprise-list',
  templateUrl: './enterprise-list.component.html',
  styleUrls: ['./enterprise-list.component.css']
})
export class EnterpriseListComponent {

  enterprises: Enterprise[] = [];

  constructor(private entepriseService: EntepriseService, private toastr: ToastrService) { }

  ngOnInit() {
    this.entepriseService.getAll().subscribe(
      enterprises => this.enterprises = enterprises,
      error => console.log(error)
    );
  }

  deleteProvider(id: number) {

    const mustDelete = confirm("deseja deletar essa empresa?");

    if(mustDelete){
      this.entepriseService.delete(id).subscribe(
        () => this.enterprises = this.enterprises.filter(p => p.id !== id),
        error => this.toastr.error(error.error)
      );
    }
  }

  converterData(data: any){
    if(data){
      const dataObj = new Date(data);
      return format(dataObj, 'dd/MM/yyyy');
    }
    return null;
  }
}
