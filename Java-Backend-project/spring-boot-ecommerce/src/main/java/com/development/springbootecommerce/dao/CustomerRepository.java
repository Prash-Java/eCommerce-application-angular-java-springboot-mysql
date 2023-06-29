package com.development.springbootecommerce.dao;

import com.development.springbootecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(String theEmail);
}
// Method is Query Method which Spring would implement out of box as below:
// select * from customer c where c.email = theEmail;