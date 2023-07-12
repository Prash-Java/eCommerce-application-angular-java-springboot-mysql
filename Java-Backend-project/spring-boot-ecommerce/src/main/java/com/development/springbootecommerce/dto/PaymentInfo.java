package com.development.springbootecommerce.dto;

import lombok.Data;

@Data
public class PaymentInfo {
    private int amount;
    private String currency;
}
