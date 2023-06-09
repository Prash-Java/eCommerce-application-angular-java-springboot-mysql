# AngularFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


Steps done in sequence:
-> Created Project: ng new <custom-project-name>
-> Add bootstrap support to our Angular project:
--> Navigate http://www.getbootstrap.com
--> Then click on "read the docs" button
--> From CSS section copy Metadata tag and link tag and paste in index.html of this angular project
--> Remove everything from ~/src/app/app.component.html and just to start, provide basic html with container
--> Use cd angular-frontend command from CLI
--> ng serve (to launch server) from CLI
-> Create components for product-list:
--> ng generate component components/product-list from CLI
-> From product-list.component.ts we copy value from "selector" attribute and paste in ~/src/app/app.component.html
-> Now we generate the Product class, that is actually Java Entity using command:
--> ng generate class common/product and this class would be typescript class to hold constructor with Java entity parameters
-> Now we generate the product service:
--> ng generate service services/product

-> Installing Bootstrap and Fontawesome using npm, which would reflect in both node_modules and package.json files
--> ng install bootstrap@5.2.0
--> ng install @fortawesome/fontawesome-free

-> Pagination logic we employ at backend and frontend both, required steps are:
--> ng add @angular/localize from the CLI
--> npm install @ng-bootstrap/ng-bootstrap@13.0.0















