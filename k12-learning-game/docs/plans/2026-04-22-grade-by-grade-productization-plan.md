# Grade-by-Grade Productization Implementation Plan

> **For Codex:** Implement this plan phase-by-phase, verifying and committing each stage before moving on.

**Goal:** Turn the current MVP curriculum into a more mature grade-by-grade product, improving content depth, reusable frontend components, backend configuration quality, and parent-facing learning reports.

**Architecture:** Keep the existing normalized curriculum tables (`subjects`, `chapters`, `levels`, `level_steps`) as the source of truth. Avoid adding tables unless the feature needs independent lifecycle or durable user-generated records; use stable string codes for curriculum entities and only use generated IDs for event/log entities that are already append-only. Frontend work should reduce page-level branching by extracting reusable learning interaction components before expanding content.

**Tech Stack:** React + Vite + TypeScript frontend, Spring Boot + JPA backend, H2 for local/test seed data, MySQL profile target, Vitest and Spring MockMvc tests.

---

## Engineering Guardrails

- Do not create new database tables for curriculum content until the current `chapters -> levels -> level_steps` model is exhausted.
- Do not introduce business meaning through auto-increment IDs. Curriculum references must use stable codes such as `math-preschool-subitizing-001`.
- Add user-event tables only for durable behavior that cannot be derived from existing completion/review/claim records.
- Prefer backend-driven `activityConfigJson` for new polished content. Keep frontend local fallback only for compatibility.
- Extract reusable React components when a UI pattern appears three or more times.
- Each phase must include targeted frontend tests, targeted backend tests, full frontend test/build, full backend tests, then commit and push.

## Phase 1: Preschool Mature Product Pass

**Goal:** Make 幼小衔接 feel like a complete starter product and clean up duplicated interaction UI.

**Tasks:**

1. Extract reusable audio practice UI components from `LevelPlayer.tsx`.
2. Keep existing language interaction tests green while refactoring.
3. Add more preschool math content for subitizing, part-whole, and 20以内加减图片化.
4. Add more preschool Chinese content for 拼音韵母、整体认读、常用词语和笔画巩固.
5. Add remaining preschool English content for G-Z letter sounds, more daily words, and short dialogue/story shadowing.
6. Update backend `data.sql` and `ApiSmokeTest` for all new preschool nodes.
7. Update parent stage report copy so preschool readiness feels productized instead of generic.

## Phase 2: Grade 1 Product Pass

**Goal:** Turn 一年级 from MVP into a coherent “校园冒险” path.

**Tasks:**

1. Add grade 1 math chapters for 100以内数、进退位、人民币/时间初步、图形应用.
2. Add grade 1 Chinese chapters for 拼音巩固、常见字、词语搭配、看图说话.
3. Add grade 1 English chapters for school objects, numbers/colors, actions, greetings, and phonics.
4. Add grade-specific parent insight labels: 计算准确率、识字积累、跟读次数.
5. Add tests for stage switching, locked path status, and representative interactions.

## Phase 3: Grade 2 Product Pass

**Goal:** Make 二年级 focus on structured thinking and review loops.

**Tasks:**

1. Enrich multiplication/division, measurement, time, and statistics levels.
2. Add Chinese sentence ordering, punctuation, paragraph reading, and picture expression.
3. Add English phonics families, food/animals/home themes, and short dialogue comprehension.
4. Strengthen mistake review recommendations using knowledge point codes already stored on `level_steps`.
5. Add parent weak-point guidance based on subject and knowledge point clusters.

## Phase 4: Grade 3 Product Pass

**Goal:** Move 三年级 from single-step play into multi-step reasoning.

**Tasks:**

1. Add division, perimeter/area, fractions, and multi-step application problem levels.
2. Add Chinese paragraph comprehension, central sentence, rhetorical basics, and writing prompts.
3. Add English sentence transformation, short passage reading, topic expression, and listening choice.
4. Add step-by-step explanation UI for `story-choice` and math model based levels.
5. Add backend config coverage tests for all new multi-step levels.

## Phase 5: Grade 4 Product Pass

**Goal:** Make 四年级 feel like a strategy and abstraction training stage.

**Tasks:**

1. Add decimal, angles, parallel/perpendicular, operation law, and speed-distance-time levels.
2. Add Chinese passage reading, ancient poem accumulation, grammar, and writing structure.
3. Add English tense basics, passage comprehension, scene expression, and listening judgment.
4. Add reusable “thinking model card” display for number line, bar model, fraction bar, and area model.
5. Connect thinking model completion to parent reports and achievements.

## Phase 6: Cross-Grade Maturity

**Goal:** Raise the whole product toward commercial polish.

**Tasks:**

1. Add question variant metadata and render variant count consistently.
2. Add stage-level achievement families rather than only global badges.
3. Improve audio quality abstraction so later real TTS or recorded assets can replace browser speech.
4. Add content config health checks to highlight missing backend configs.
5. Add parent weekly report export-ready layout.
6. Add visual polish pass for mobile responsiveness, larger 1440 layout consistency, and page-to-page navigation.
