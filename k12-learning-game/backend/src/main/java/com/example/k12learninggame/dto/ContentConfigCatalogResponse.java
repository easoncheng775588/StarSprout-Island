package com.example.k12learninggame.dto;

import java.util.List;

public record ContentConfigCatalogResponse(
        int totalLevelCount,
        int configuredLevelCount,
        int healthyLevelCount,
        int warningLevelCount,
        int configCoveragePercent,
        int totalVariantCount,
        List<ContentConfigItemDto> items
) {
}
