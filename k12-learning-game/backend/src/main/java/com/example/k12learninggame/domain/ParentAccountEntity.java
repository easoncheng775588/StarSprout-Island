package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "parent_accounts")
public class ParentAccountEntity {

    @Id
    private Long id;

    private String displayName;

    private String phone;

    private String password;

    private Long defaultChildProfileId;

    @OneToMany(mappedBy = "parentAccount")
    @OrderBy("id asc")
    private List<ChildProfileEntity> childProfiles = new ArrayList<>();

    protected ParentAccountEntity() {
    }

    public ParentAccountEntity(
            Long id,
            String displayName,
            String phone,
            String password,
            Long defaultChildProfileId
    ) {
        this.id = id;
        this.displayName = displayName;
        this.phone = phone;
        this.password = password;
        this.defaultChildProfileId = defaultChildProfileId;
    }

    public Long getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getPhone() {
        return phone;
    }

    public String getPassword() {
        return password;
    }

    public Long getDefaultChildProfileId() {
        return defaultChildProfileId;
    }

    public List<ChildProfileEntity> getChildProfiles() {
        return childProfiles;
    }

    public void setDefaultChildProfileId(Long defaultChildProfileId) {
        this.defaultChildProfileId = defaultChildProfileId;
    }
}
