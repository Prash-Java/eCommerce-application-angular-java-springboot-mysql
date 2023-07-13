package com.development.springbootecommerce.service;

import com.development.springbootecommerce.dto.PaymentInfo;
import com.development.springbootecommerce.dto.Purchase;
import com.development.springbootecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
