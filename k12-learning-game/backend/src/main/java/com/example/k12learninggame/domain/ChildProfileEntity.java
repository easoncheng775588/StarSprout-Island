package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "child_profiles")
public class ChildProfileEntity {

    @Id
    private Long id;

    private String nickname;

    private int streakDays;

    private int totalStars;

    private String title;

    @OneToOne(mappedBy = "childProfile")
    private ParentTodaySummaryEntity todaySummary;

    @OneToOne(mappedBy = "childProfile")
    private ParentSettingsEntity parentSettings;

    @OneToMany(mappedBy = "childProfile")
    @OrderBy("displayOrder asc")
    private List<SubjectProgressEntity> subjectProgressRecords = new ArrayList<>();

    @OneToMany(mappedBy = "childProfile")
    @OrderBy("displayOrder asc")
    private List<WeeklyTrendPointEntity> weeklyTrendPoints = new ArrayList<>();

    @OneToMany(mappedBy = "childProfile")
    @OrderBy("displayOrder asc")
    private List<WeakPointEntity> weakPoints = new ArrayList<>();

    protected ChildProfileEntity() {
    }

    public Long getId() {
        return id;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public int getStreakDays() {
        return streakDays;
    }

    public int getTotalStars() {
        return totalStars;
    }

    public String getTitle() {
        return title;
    }

    public ParentTodaySummaryEntity getTodaySummary() {
        return todaySummary;
    }

    public ParentSettingsEntity getParentSettings() {
        return parentSettings;
    }

    public List<SubjectProgressEntity> getSubjectProgressRecords() {
        return subjectProgressRecords;
    }

    public List<WeeklyTrendPointEntity> getWeeklyTrendPoints() {
        return weeklyTrendPoints;
    }

    public List<WeakPointEntity> getWeakPoints() {
        return weakPoints;
    }
}
