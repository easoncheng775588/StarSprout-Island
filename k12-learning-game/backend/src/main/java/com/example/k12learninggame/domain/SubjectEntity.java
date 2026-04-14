package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subjects")
public class SubjectEntity {

    @Id
    private String code;

    private String title;

    private String subtitle;

    private String accentColor;

    private int displayOrder;

    @OneToMany(mappedBy = "subject")
    @OrderBy("displayOrder asc")
    private List<ChapterEntity> chapters = new ArrayList<>();

    protected SubjectEntity() {
    }

    public String getCode() {
        return code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public String getAccentColor() {
        return accentColor;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public List<ChapterEntity> getChapters() {
        return chapters;
    }
}
