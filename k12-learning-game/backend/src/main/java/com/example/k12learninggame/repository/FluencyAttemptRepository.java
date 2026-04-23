package com.example.k12learninggame.repository;

import com.example.k12learninggame.domain.FluencyAttemptEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface FluencyAttemptRepository extends JpaRepository<FluencyAttemptEntity, Long> {
    long countByChildProfile_IdAndAttemptDate(Long childProfileId, LocalDate attemptDate);
}
