import { Component } from '@angular/core';
import { Userboton } from './userboton/userboton';
import { Logo } from './logo/logo';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ Logo, Userboton],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {}
