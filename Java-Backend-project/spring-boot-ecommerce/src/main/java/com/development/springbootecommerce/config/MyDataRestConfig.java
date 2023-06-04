package com.development.springbootecommerce.config;

import com.development.springbootecommerce.entity.Product;
import com.development.springbootecommerce.entity.ProductCategory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.mapping.HttpMethods;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    //Spring JPA Entity Manager to get Entity Id's which by default spring does not provide in json response, but it has Entity Id's
    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager){
        this.entityManager = entityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = {HttpMethod.POST,HttpMethod.DELETE,HttpMethod.PUT};
        //Disable for Product Entity: POST, DELETE, PUT Http Methods
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));

        //Disable for Product Category Entity: POST, DELETE, PUT http methods
        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));

        // call helper method to expose Entity Id's
        exposeIds(config);
    }

    // To expose all Entity Id's
    private void exposeIds(RepositoryRestConfiguration config) {
        // Get a list of all Entity Classes using JPA Entity Manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // Create array list to get entity types
        List<Class> entityClasses = new ArrayList<>();

        // Get Entity types from entities
        for(EntityType entity : entities){
            entityClasses.add(entity.getJavaType());
        }

        // Expose Entity Id's from Entity classes
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
