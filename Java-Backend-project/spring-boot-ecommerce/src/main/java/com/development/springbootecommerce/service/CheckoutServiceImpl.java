package com.development.springbootecommerce.service;

import com.development.springbootecommerce.dao.CustomerRepository;
import com.development.springbootecommerce.dto.PaymentInfo;
import com.development.springbootecommerce.dto.Purchase;
import com.development.springbootecommerce.dto.PurchaseResponse;
import com.development.springbootecommerce.entity.Customer;
import com.development.springbootecommerce.entity.Order;
import com.development.springbootecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String secretKey){
        this.customerRepository = customerRepository;
        // Initialize Stripe Api Key
        Stripe.apiKey = secretKey;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        // Step 1:- Retrieve oder info from dto
        Order order = purchase.getOrder();

        // Step 2:- Generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // Step 3:- Populate order with order items
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // Step 4:- Populate order with shipping and billing address
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        // Step 5:- Populate Customer with order
        Customer customer = purchase.getCustomer();

        // Step 5a:- Checks if customer already exists? assign it : null
        String theEmail = customer.getEmail();
        Customer customerFromDB = customerRepository.findByEmail(theEmail);
        if(customerFromDB != null){
            customer = customerFromDB;
        }
        customer.add(order);

        // Step 6:- Save to database
        customerRepository.save(customer);

        // Step 7:- Return a Response
        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");
        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment-method-types", paymentMethodTypes);
        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
