package com.development.springbootecommerce.dao;

import com.development.springbootecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200") // origin = protocol + hostname + portNumber
public interface ProductRepository extends JpaRepository<Product, Long> {

}
