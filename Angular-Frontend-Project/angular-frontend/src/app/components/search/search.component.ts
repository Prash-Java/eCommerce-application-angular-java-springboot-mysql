import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // Dependency Injection feature of Angular Frameworks
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onSearch(value:string){
    console.log(`value=${value}`);
    this.router.navigateByUrl('/search/${value}');
  }

}
