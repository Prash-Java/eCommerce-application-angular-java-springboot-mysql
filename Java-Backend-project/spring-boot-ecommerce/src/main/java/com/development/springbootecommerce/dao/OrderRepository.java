package com.development.springbootecommerce.dao;

import com.development.springbootecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByCustomerEmailOrderByDateCreatedDesc(@Param("email") String email, Pageable pageable);
    // The query executed here will be:
    /*
        select * from order left outer join customer
        ON order.customer_Id = customer.id
        where customer.email = email
        ORDER BY orders.date_created DESC;
    */

    /*
        url = "http://localhost:8080/api/orders/search/findCustomerByEmail?email=${email}"
     */
}
