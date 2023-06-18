package com.development.springbootecommerce.service;

import com.development.springbootecommerce.dto.Purchase;
import com.development.springbootecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
