package com.example.k12learninggame.repository;

import com.example.k12learninggame.domain.LevelEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LevelRepository extends JpaRepository<LevelEntity, String> {
}
