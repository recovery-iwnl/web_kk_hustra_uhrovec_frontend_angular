import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  readonly apiUrl = 'http://192.168.1.56:8080';
  constructor() { }
}
