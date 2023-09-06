import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { CustomerAddressFieldComponent } from './components/customer-form/customer-address-field/customer-address-field.component';
import { CustomerPaymentMethodsFieldComponent } from './components/customer-form/customer-payment-methods-field/customer-payment-methods-field.component';

@NgModule({
  declarations: [AppComponent, CustomerFormComponent, CustomerAddressFieldComponent, CustomerPaymentMethodsFieldComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
