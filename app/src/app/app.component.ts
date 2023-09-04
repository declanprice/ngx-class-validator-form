import { Component } from '@angular/core';

import { makeZodForm } from '@declanprice/ngx-make-form';

import { z } from 'zod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  registerCustomerForm = makeZodForm(
    z.object({
      username: z.string(),
      email: z.string(),
    })
  );

  constructor() {}
}
