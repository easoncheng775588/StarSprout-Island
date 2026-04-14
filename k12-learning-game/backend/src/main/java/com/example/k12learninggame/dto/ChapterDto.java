package com.example.k12learninggame.dto;

import java.util.List;

public record ChapterDto(String code, String title, String subtitle, List<LevelSummaryDto> levels) {
}
