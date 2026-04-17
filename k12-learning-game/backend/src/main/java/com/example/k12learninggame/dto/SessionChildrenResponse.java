package com.example.k12learninggame.dto;

import java.util.List;

public record SessionChildrenResponse(
        long defaultChildId,
        List<ChildProfileDto> children
) {
}
