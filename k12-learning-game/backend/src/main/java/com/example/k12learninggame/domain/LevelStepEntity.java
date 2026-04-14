package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "level_steps")
public class LevelStepEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stepCode;

    private String stepType;

    private String prompt;

    private int displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_code", nullable = false)
    private LevelEntity level;

    protected LevelStepEntity() {
    }

    public String getStepCode() {
        return stepCode;
    }

    public String getStepType() {
        return stepType;
    }

    public String getPrompt() {
        return prompt;
    }
}
