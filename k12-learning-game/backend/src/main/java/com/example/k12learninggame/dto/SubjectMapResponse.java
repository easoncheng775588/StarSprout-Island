package com.example.k12learninggame.dto;

import java.util.List;

public record SubjectMapResponse(SubjectDto subject, List<ChapterDto> chapters) {
}
