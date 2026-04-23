package com.example.k12learninggame.repository;

import com.example.k12learninggame.domain.FluencyAttemptEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FluencyAttemptRepository extends JpaRepository<FluencyAttemptEntity, Long> {
    long countByChildProfile_IdAndAttemptDate(Long childProfileId, LocalDate attemptDate);

    List<FluencyAttemptEntity> findByChildProfile_IdOrderByRecordedAtDesc(Long childProfileId);
}
