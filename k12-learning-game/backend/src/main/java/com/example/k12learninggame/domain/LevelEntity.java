package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "levels")
public class LevelEntity {

    @Id
    private String code;

    private String summaryTitle;

    private String detailTitle;

    private String status;

    private String description;

    private int rewardStars;

    private String rewardBadgeName;

    private int displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_code", nullable = false)
    private ChapterEntity chapter;

    @OneToMany(mappedBy = "level")
    @OrderBy("displayOrder asc")
    private List<LevelStepEntity> steps = new ArrayList<>();

    protected LevelEntity() {
    }

    public String getCode() {
        return code;
    }

    public String getSummaryTitle() {
        return summaryTitle;
    }

    public String getDetailTitle() {
        return detailTitle;
    }

    public String getStatus() {
        return status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getRewardStars() {
        return rewardStars;
    }

    public String getRewardBadgeName() {
        return rewardBadgeName;
    }

    public ChapterEntity getChapter() {
        return chapter;
    }

    public List<LevelStepEntity> getSteps() {
        return steps;
    }
}
