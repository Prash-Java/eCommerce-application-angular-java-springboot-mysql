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
  thePageSize: number = 5;
  theTotalElements: number = 0;
  thePreviousKeyword: string = "";

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
      this.currentCategoryId).subscribe(this.processResult());

    // NOTE: This below method is the case, when we do not want pagination at all, after fetching product list from Spring data REST
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )
  }

  // This method searches products using user provided keyword
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    if(this.thePreviousKeyword != theKeyword){
      this.thePageNumber = 1;
    }
    this.thePreviousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, pageNumber=${this.thePageNumber}`);
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyword).subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.thePageNumber = 1;
    this.thePageSize = +pageSize;
    this.listProducts();
  }

  processResult(){
    return(data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(product: Product){
    console.log(`Adding To Cart: ${product.name}, ${product.unitPrice}`);
  }
}


