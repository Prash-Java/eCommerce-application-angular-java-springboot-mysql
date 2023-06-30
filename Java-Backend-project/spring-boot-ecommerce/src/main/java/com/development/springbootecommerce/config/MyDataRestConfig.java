package com.development.springbootecommerce.config;

import com.development.springbootecommerce.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${allowed.origins}") // Injected from application.properties file
    private String[] theAllowedOrigins;

    //Spring JPA Entity Manager to get Entity Id's which by default spring does not provide in json response, but it has Entity Id's
    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager){
        this.entityManager = entityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = {HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PUT, HttpMethod.PATCH};
        //Disable for Product Entity: POST, DELETE, PUT Http Methods on Entity.Product
        disableHttpMethods(Product.class, config, theUnsupportedActions);

        //Disable for Product Category Entity: POST, DELETE, PUT http methods on Entity.ProductCategory
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);

        //Disable for Country Entity: POST, DELETE, PUT http methods on Entity.Country
        disableHttpMethods(Country.class, config, theUnsupportedActions);

        //Disable for State Entity: POST, DELETE, PUT http methods on Entity.State
        disableHttpMethods(State.class, config, theUnsupportedActions);

        //Disable for Order Entity: POST, DELETE, PUT http methods on Entity.State
        disableHttpMethods(Order.class, config, theUnsupportedActions);

        // call helper method to expose Entity Id's
        exposeIds(config);

        // configure CORS for request source mapping => and now we can remove Annotation @CrossOrigins from DAO package/Interfaces
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);
    }

    private static void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    /* To expose all Entity Id's, and we need this as by default springboot Data REST did not provide ID's here in json
        response, though these ID's are available in Database
    */
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
