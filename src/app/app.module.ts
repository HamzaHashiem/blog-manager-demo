import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoutingModule, routingComponents } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppComponent } from './app.component';
import { AppLayoutComponent, AppSiderComponent } from './layout';

import { NgZorroAntdModule, NZ_ICONS } from 'ng-zorro-antd';

// Ant: Icons
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
);

@NgModule({
  declarations: [
    routingComponents,
    AppComponent,
    AppSiderComponent,
    AppLayoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    RoutingModule,
    HttpClientModule,
  ],
  providers: [{ provide: NZ_ICONS, useValue: icons }],
  bootstrap: [AppComponent],
})
export class AppModule {}
