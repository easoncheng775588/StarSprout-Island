package com.example.k12learninggame.repository;

import com.example.k12learninggame.domain.DailyTaskClaimEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyTaskClaimRepository extends JpaRepository<DailyTaskClaimEntity, Long> {
}
