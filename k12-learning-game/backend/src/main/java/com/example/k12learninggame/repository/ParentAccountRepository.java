package com.example.k12learninggame.repository;

import com.example.k12learninggame.domain.ParentAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParentAccountRepository extends JpaRepository<ParentAccountEntity, Long> {

    Optional<ParentAccountEntity> findByPhone(String phone);
}
