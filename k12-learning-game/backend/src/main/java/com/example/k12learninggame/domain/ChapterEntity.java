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
@Table(name = "chapters")
public class ChapterEntity {

    @Id
    private String code;

    private String title;

    private String subtitle;

    private int displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_code", nullable = false)
    private SubjectEntity subject;

    @OneToMany(mappedBy = "chapter")
    @OrderBy("displayOrder asc")
    private List<LevelEntity> levels = new ArrayList<>();

    protected ChapterEntity() {
    }

    public String getCode() {
        return code;
    }

    public String getTitle() {
        return title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public SubjectEntity getSubject() {
        return subject;
    }

    public List<LevelEntity> getLevels() {
        return levels;
    }
}
