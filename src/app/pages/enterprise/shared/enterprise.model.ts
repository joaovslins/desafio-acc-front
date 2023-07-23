import { Provider } from "../../provider/shared/provider.model";

export class Enterprise {
    constructor(
        public id?: number,
        public cep?: string,
        public corporate_name?: string,
        public fantasy_name?: string,
        public cnpj?: string,  
        public providers?: Provider[],
    ){}
}