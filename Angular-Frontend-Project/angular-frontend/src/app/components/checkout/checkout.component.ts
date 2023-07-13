import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  totalPrice: number = 0;
  totalQuantity: number = 0;
  checkoutFormGroup!: FormGroup;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  billingAddressStates: State[] = [];
  shippingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  // Initialise Stripe API
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  constructor(private formBuilder: FormBuilder, private utilitiesService: UtilitiesService, private cartService: CartService,
              private checkoutService: CheckoutService, private router: Router) { }

  ngOnInit(): void {
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail,[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), CustomValidators.notOnlyWhitespace])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(4), CustomValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(4), CustomValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({

        // cardType: new FormControl('', [Validators.required]),
        // nameOnCard: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        // cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}'), CustomValidators.notOnlyWhitespace]),
        // securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{4}'), CustomValidators.notOnlyWhitespace]),
        // expirationMonth: new FormControl('', [Validators.required]),
        // expirationYear: new FormControl('', [Validators.required])
      })
    });

    // let startMonth: number = new Date().getMonth() + 1;
    // this.utilitiesService.getCreditCardMonths(startMonth).subscribe(
    //   data => {
    //     this.creditCardMonths = data;
    //   }
    // );

    // this.utilitiesService.getCreditCardYears().subscribe(
    //   data => {
    //     this.creditCardYears = data;
    //   }
    // );

    this.utilitiesService.getCountries().subscribe (
      data => {
        this.countries = data;
      }
    );
  }

  setupStripePaymentForm() {
    var elements = this.stripe.elements();
    this.cardElement = elements.Create('card', {hidePostalCode: true});
    this.cardElement.mount('#card-element');
    this.cardElement.on('change', (event : any) => {
      this.displayError = document.getElementById('card-errors');
      if(event.complete){
        this.displayError.textContent = "";
      } else if(event.error){
        this.displayError.textContent = event.error.message;
      }
    });
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  // Getters for Customer Details
  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

  // Getters For Shipping Address
  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get shippingAddressCountry(){
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  // Getters for Billing Address
  get billingAddressStreet(){
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity(){
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressZipCode(){
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get billingAddressState(){
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressCountry(){
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  // Getters For Credit Card Info
  get cardType(){
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get nameOnCard(){
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get cardNumber(){
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get securityCode(){
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  
  get expirationMonth(){
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }

  get expirationYear(){
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }

  onSubmit(){
    console.log(`Handling Form Submit Event`);
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    
    // Set up Order
    let order = new Order();
    order.totalQuantity = this.totalQuantity;
    order.totalPrice = this.totalPrice;

    // Get Cart Items
    const cartItems = this.cartService.cartItems;

    // Create Order Items From Cart Items
    let orderItems: OrderItem[] = [];
    for(let i=0;i<cartItems.length;i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    // Set Up Purchase
    let purchase = new Purchase();

    // Populate Purchase - Customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // Populate Purchase - Shipping Address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // Populate Purchase - Billing Address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // Populate Purchase - Order and Order Items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // Stripe Payment Info
    this.paymentInfo.amount = this.totalPrice * 100;
    this.paymentInfo.currency = "USD";
    
    // Call REST API via checkout service
    // this.checkoutService.placeOrder(purchase).subscribe(
    //   {
    //     next: response => {
    //       alert(`Order Tracking Number: ${response.orderTrackingNumber}`);
    //       // Reset Cart
    //       this.resetCart();
    //     },
    //     error: err => {
    //       alert(`${err.message}`);
    //     }
    //   }
    // );

    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === ""){
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement
              }
            }
          )
        }
      )
    }
  }

  resetCart() {
    // reset the cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the checkout form
    this.checkoutFormGroup.reset();

    // navigate to /products page
    this.router.navigateByUrl('/products');
  }

  copyShippingAddressToBillingAddress(event:any){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup!.value.expirationYear);

    let startMonth!: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.utilitiesService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    this.utilitiesService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data; 
        }
        formGroup!.get('state')!.setValue(data[0]);
      }
    );
  }

}
