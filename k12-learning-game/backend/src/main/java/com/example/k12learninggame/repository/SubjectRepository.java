package com.example.k12learninggame.repository;

import com.example.k12learninggame.domain.SubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<SubjectEntity, String> {

    List<SubjectEntity> findAllByOrderByDisplayOrderAsc();
}
