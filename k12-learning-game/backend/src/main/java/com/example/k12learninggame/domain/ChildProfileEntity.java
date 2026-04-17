package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    private String stageLabel;

    private String avatarColor;

    @ManyToOne
    @JoinColumn(name = "parent_account_id", nullable = false)
    private ParentAccountEntity parentAccount;

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

    public ChildProfileEntity(
            Long id,
            String nickname,
            int streakDays,
            int totalStars,
            String title,
            String stageLabel,
            String avatarColor,
            ParentAccountEntity parentAccount
    ) {
        this.id = id;
        this.nickname = nickname;
        this.streakDays = streakDays;
        this.totalStars = totalStars;
        this.title = title;
        this.stageLabel = stageLabel;
        this.avatarColor = avatarColor;
        this.parentAccount = parentAccount;
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

    public void addStars(int stars) {
        this.totalStars += stars;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStageLabel() {
        return stageLabel;
    }

    public void setStageLabel(String stageLabel) {
        this.stageLabel = stageLabel;
    }

    public String getAvatarColor() {
        return avatarColor;
    }

    public void setAvatarColor(String avatarColor) {
        this.avatarColor = avatarColor;
    }

    public ParentAccountEntity getParentAccount() {
        return parentAccount;
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
