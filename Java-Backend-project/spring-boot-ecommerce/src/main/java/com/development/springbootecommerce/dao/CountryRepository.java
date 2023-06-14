package com.development.springbootecommerce.dao;

import com.development.springbootecommerce.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "countries", path = "countries")
// path = "countries says that this REST API would be exposed at endpoints /countries ,
// something like this => http://localhost:8080/api/countries
public interface CountryRepository extends JpaRepository<Country, Integer> {
}
