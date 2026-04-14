package com.example.k12learninggame.repository;

import com.example.k12learninggame.domain.LevelCompletionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LevelCompletionRepository extends JpaRepository<LevelCompletionEntity, Long> {
}
