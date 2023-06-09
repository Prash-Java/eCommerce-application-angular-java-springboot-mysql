import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "books";
  searchMode: boolean = false;

  // Adding properties to include Pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  //  here we would integrate this component with product service using dependency injection,
  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    // Check if categoryId is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    // If CategoryId is available, convert it into number using "+" operator to read that id as number, else assign it value of 1 as default
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    // Angular might not reload the existing components everytime due to performance issues,
    // So we check if current Category Id is not equal to Previous Category Id,
    // If above line check is true, then thePageNumber == 1;

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId = ${this.currentCategoryId}, thePageNumber = ${this.thePageNumber}`);

    // In Angular Index starts with 1, whereas in Java, it starts with 0,
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(
        data => {
          // L.H.S belongs to Angular frontend and R.H.S belongs to Java backend,
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        }
      )

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }
}
