package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;
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

    @Column(length = 4000)
    private String activityConfigJson;

    private String knowledgePointCode;

    private String knowledgePointTitle;

    private Integer variantCount;

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

    public int getDisplayOrder() {
        return displayOrder;
    }

    public String getActivityConfigJson() {
        return activityConfigJson;
    }

    public String getKnowledgePointCode() {
        return knowledgePointCode;
    }

    public String getKnowledgePointTitle() {
        return knowledgePointTitle;
    }

    public Integer getVariantCount() {
        return variantCount;
    }

    public void updateContentConfig(
            String knowledgePointCode,
            String knowledgePointTitle,
            Integer variantCount,
            String activityConfigJson
    ) {
        this.knowledgePointCode = knowledgePointCode;
        this.knowledgePointTitle = knowledgePointTitle;
        this.variantCount = variantCount;
        this.activityConfigJson = activityConfigJson;
    }
}
