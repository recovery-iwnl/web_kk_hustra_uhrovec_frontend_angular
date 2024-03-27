import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  readonly apiUrl = 'http://192.168.1.63:8080';
  constructor() { }
}
