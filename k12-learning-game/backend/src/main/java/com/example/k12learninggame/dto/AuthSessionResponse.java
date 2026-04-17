package com.example.k12learninggame.dto;

import java.util.List;

public record AuthSessionResponse(
        long parentAccountId,
        String parentDisplayName,
        long defaultChildId,
        List<ChildProfileDto> children
) {
}
