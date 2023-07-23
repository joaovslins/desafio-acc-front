import { Enterprise } from "../../enterprise/shared/enterprise.model";

export class Provider {
    constructor(
        public id?: number,
        public name?: string,
        public email?: string,
        public cep?: string,
        public birthday?: string,
        public document?: string,
        public age?: number,
        public rg?: number,
        public type?: number,   
        public enterprises?: Enterprise[],
    ){}
}