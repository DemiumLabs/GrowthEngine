import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SDKBrowserModule } from './shared/sdk';
import { TaxNamePipe } from './tax-name.pipe';
import { TaggerCountPipe } from './tagger-count.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TaxNamePipe,
    TaggerCountPipe
  ],
  imports: [
    BrowserModule,
    SDKBrowserModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
