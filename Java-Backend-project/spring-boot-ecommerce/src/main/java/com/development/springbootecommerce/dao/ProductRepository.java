package com.development.springbootecommerce.dao;

import com.development.springbootecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = true)
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Any method name starts with "findBy" is classified as query method by Spring frameworks and it implements the query in background
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);
    // The above method actually makes spring framework to perform this Get/Fetch query
    // select * from Product where category_id=?
    // Page represents sublist of list of products
    // Pageable is useful for pagination, number of pages etc
    // Spring Data REST would automatically expose the endpoint "http://localhost:8080/api/products/search/findByCategoryId?id=k" where,
    // value of k comes from user actions via Angular Product.service.ts class
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
    // The above abstract method is similar to the following query in DB:
    // select * from Product p where p.name like concat('%',':name','%');
    // Spring Data REST would automatically expose the endpoint: "http://localhost:8080/api/products/search/findByNameContaining?name=python"
}
