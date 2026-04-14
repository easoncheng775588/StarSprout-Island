package com.example.k12learninggame.repository;

import com.example.k12learninggame.domain.ChildProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChildProfileRepository extends JpaRepository<ChildProfileEntity, Long> {

    Optional<ChildProfileEntity> findFirstByOrderByIdAsc();
}
