import { Component } from '@angular/core';

import { makeJoiForm, makeZodForm } from '@declanprice/ngx-make-form';

import { z } from 'zod';
import joi from 'joi';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  registerCustomerForm = makeZodForm(
    z.object({
      user: z.object({
        username: z.string(),
        email: z.string(),
      }),
    })
  );

  // registerCustomerForm = makeJoiForm(
  //   joi.object({
  //     user: joi.object({
  //       username: joi.string().required(),
  //       email: joi.string().required(),
  //     }),
  //   })
  // );

  // registerCustomerForm: FormGroup;

  constructor(public fb: FormBuilder) {
    // this.registerCustomerForm = this.fb.group({
    //   user: this.fb.group({
    //     username: ['', [Validators.required]],
    //     email: ['', []],
    //   }),
    // });
  }

  submit(value: any) {
    console.log(value);
  }
}
