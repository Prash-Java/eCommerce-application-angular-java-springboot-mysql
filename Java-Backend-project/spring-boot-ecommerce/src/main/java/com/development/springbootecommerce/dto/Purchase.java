package com.development.springbootecommerce.dto;

import com.development.springbootecommerce.entity.Address;
import com.development.springbootecommerce.entity.Customer;
import com.development.springbootecommerce.entity.Order;
import com.development.springbootecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
