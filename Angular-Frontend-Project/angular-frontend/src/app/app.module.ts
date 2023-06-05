import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';

const routes:Routes = [
  // Angular by default adds '/' in path like '/category' and hence we do not need to add '/' explicitly,
  // Angular advices to add routes in specific to generic manner, coming from top to down approach here below, 1st, 2nd, 3rd paths being specific
  // If first three specific paths do not matches, then we give 4th one with redirectTo but only this will start path with '/' explicitly
  // If none of 1st four matches, then generic wildcard is used in 5th case below,
  // NOTE: Being single page application, only modified part of page gets updated, and not the entire page
  { path: 'search/:keyword', component: ProductListComponent},
  { path: 'category/:id/:name', component: ProductListComponent },
  { path: 'category', component:ProductListComponent},
  { path: 'products', component:ProductListComponent},
  { path: '', redirectTo: '/products', pathMatch: 'full'},
  { path: '**', redirectTo: '/products', pathMatch: 'full'}
  
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent
  ],
  imports: [
    // We just import the above created routes here in 1st line using Router Module
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
