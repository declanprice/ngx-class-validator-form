import { Component } from '@angular/core';

import { makeForm } from '@declanprice/ngx-class-validator-form';

import { IsOptional, IsString } from 'class-validator';

class RegisterCustomerCommand {
  @IsString()
  username!: string;

  @IsString()
  email!: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'app';

  registerCustomerForm = makeForm(RegisterCustomerCommand);

  constructor() {}
}
