package com.development.springbootecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "country")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;

    // One Country <=> Many States (and this is bidirectional implications, where reverse hypothesis holds true)..
    @OneToMany(mappedBy = "country")
    @JsonIgnore // this annotation would ignore states in response json at http://localhost:8080/api/countries
    private List<State> states;
}
