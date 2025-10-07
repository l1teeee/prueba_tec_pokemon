import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './shared/components/header/header';
import {Formuser} from './shared/components/form-user/form-user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,Formuser],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pruebatec-pokemon');
}
