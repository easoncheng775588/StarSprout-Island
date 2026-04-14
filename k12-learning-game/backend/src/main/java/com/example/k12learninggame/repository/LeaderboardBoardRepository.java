package com.example.k12learninggame.repository;

import com.example.k12learninggame.domain.LeaderboardBoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaderboardBoardRepository extends JpaRepository<LeaderboardBoardEntity, String> {
}
