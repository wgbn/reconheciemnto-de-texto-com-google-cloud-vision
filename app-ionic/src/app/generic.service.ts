import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class GenericService {

    private baseURL: string = 'http://livros.pokemonbase.ml';

    constructor(private http: HttpClient) { }

    create(resource: string, item: any): Observable<any> {
        return this.http.post(`${this.baseURL}/${resource}`, item, {observe: 'response'});
    }

    list(resource: string, query?: string): Observable<any> {
        return this.http.get(`${this.baseURL}/${resource}${(query ? '?' + query : '')}`, {observe: 'response'});
    }

    getOne(resource: string, id: any): Observable<any> {
        return this.http.get(`${this.baseURL}/${resource}/${id}`, {observe: 'response'});
    }

    update(resource: string, item: any): Observable<any> {
        return this.http.put(`${this.baseURL}/${resource}/${item.id}`, item, {observe: 'response'});
    }

    delete(resource: string, id: any): Observable<any> {
        return this.http.delete(`${this.baseURL}/${resource}/${id}`, {observe: 'response'});
    }

    upload(resource: string, item: any): Observable<any> {
        return this.http.request('post', `${this.baseURL}/${resource}`, {body: item, observe: 'response'});
    }

}
