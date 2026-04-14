package com.example.k12learninggame;

import com.example.k12learninggame.domain.LevelCompletionEntity;
import com.example.k12learninggame.dto.CompleteLevelRequest;
import com.example.k12learninggame.dto.HomeOverviewResponse;
import com.example.k12learninggame.dto.SubjectCardDto;
import com.example.k12learninggame.repository.ChildProfileRepository;
import com.example.k12learninggame.repository.LevelCompletionRepository;
import com.example.k12learninggame.repository.SubjectRepository;
import com.example.k12learninggame.service.GameContentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class PersistenceBackedGameContentServiceTest {

    @Autowired
    private GameContentService gameContentService;

    @Autowired
    private ChildProfileRepository childProfileRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private LevelCompletionRepository levelCompletionRepository;

    @Test
    void shouldReadHomeOverviewFromDatabaseState() {
        var child = childProfileRepository.findById(1L).orElseThrow();
        child.setNickname("小勇士");
        childProfileRepository.save(child);

        var mathSubject = subjectRepository.findById("math").orElseThrow();
        mathSubject.setTitle("数学冒险岛");
        subjectRepository.save(mathSubject);

        HomeOverviewResponse response = gameContentService.getHomeOverview();

        assertThat(response.child().nickname()).isEqualTo("小勇士");
        assertThat(response.subjects())
                .extracting(SubjectCardDto::title)
                .contains("数学冒险岛");
    }

    @Test
    void shouldPersistLevelCompletionRecords() {
        gameContentService.completeLevel("math-numbers-001", new CompleteLevelRequest(1L, 2, 0, 74));

        assertThat(levelCompletionRepository.count()).isEqualTo(1);

        LevelCompletionEntity completion = levelCompletionRepository.findAll().get(0);
        assertThat(completion.getLevel().getCode()).isEqualTo("math-numbers-001");
        assertThat(completion.getChildProfile().getId()).isEqualTo(1L);
        assertThat(completion.getCorrectCount()).isEqualTo(2);
        assertThat(completion.getWrongCount()).isEqualTo(0);
        assertThat(completion.getDurationSeconds()).isEqualTo(74);
        assertThat(completion.getResultMessage()).isEqualTo("perfect");
    }
}
