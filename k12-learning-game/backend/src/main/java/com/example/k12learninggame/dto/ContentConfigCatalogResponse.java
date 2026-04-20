package com.example.k12learninggame.dto;

import java.util.List;

public record ContentConfigCatalogResponse(
        int configuredLevelCount,
        int totalVariantCount,
        List<ContentConfigItemDto> items
) {
}
