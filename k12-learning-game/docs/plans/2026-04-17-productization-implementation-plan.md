# K12 Learning Game V1.1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the V1.1 productization foundation for the current幼小衔接学习游戏, prioritizing formal parent account/session flow, child profile management, persistent progress logic, parent settings, leaderboard participation, and automated tests.

**Architecture:** Keep the current React + Spring Boot + MySQL/H2 single-project structure. Use backend persistence as the single source of truth for account, profile, progress, leaderboard, and parent-facing data; keep frontend focused on session state, routing, display, and form interactions.

**Tech Stack:** React, React Router, Vitest, Spring Boot, Spring MVC, Spring Data JPA, H2/MySQL, SQL seed data.

---

### Task 1: Add parent-account domain model and auth session response

**Files:**
- Create: `backend/src/main/java/com/example/k12learninggame/domain/ParentAccountEntity.java`
- Create: `backend/src/main/java/com/example/k12learninggame/repository/ParentAccountRepository.java`
- Create: `backend/src/main/java/com/example/k12learninggame/dto/AuthLoginRequest.java`
- Create: `backend/src/main/java/com/example/k12learninggame/dto/AuthSessionResponse.java`
- Modify: `backend/src/main/java/com/example/k12learninggame/domain/ChildProfileEntity.java`
- Modify: `backend/src/main/resources/data.sql`
- Test: `backend/src/test/java/com/example/k12learninggame/ApiSmokeTest.java`

**Step 1: Write the failing test**
- Add API smoke assertions for:
  - `POST /api/auth/login`
  - response contains parent account info
  - response contains scoped child profiles
  - response contains active child profile id

**Step 2: Run test to verify it fails**
- Run: `mvn -q -Dmaven.repo.local='/Users/easoncheng/Documents/New project/.cache/m2' -Dtest=ApiSmokeTest test`
- Expected: FAIL because auth endpoint and DTOs do not exist yet

**Step 3: Write minimal implementation**
- Add parent account entity/repository
- Link child profiles to parent account
- Seed one parent account and attach existing children
- Add login DTOs and service method returning scoped children
- Add controller route for login

**Step 4: Run test to verify it passes**
- Run the same Maven command

### Task 2: Expand session model and protected routing on frontend

**Files:**
- Modify: `frontend/src/session.tsx`
- Modify: `frontend/src/api.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/pages/LoginPage.tsx`
- Test: `frontend/src/__tests__/app-shell.test.tsx`

**Step 1: Write the failing test**
- Add a test proving:
  - parent login requires account credentials
  - successful login stores parent + child session
  - app redirects into home world after login

**Step 2: Run test to verify it fails**
- Run: `npm test -- --run src/__tests__/app-shell.test.tsx`

**Step 3: Write minimal implementation**
- Store richer session shape:
  - parentAccountId
  - parentDisplayName
  - childProfileId
  - childNickname
- Replace child-only login screen with parent login + child selection
- Keep current protected route semantics

**Step 4: Run test to verify it passes**
- Run the same frontend test command

### Task 3: Add child profile management endpoints and UI

**Files:**
- Create: `backend/src/main/java/com/example/k12learninggame/dto/ChildProfileUpsertRequest.java`
- Modify: `backend/src/main/java/com/example/k12learninggame/api/GameController.java`
- Modify: `backend/src/main/java/com/example/k12learninggame/service/GameContentService.java`
- Modify: `frontend/src/pages/LoginPage.tsx`
- Modify: `frontend/src/components/PageTopBar.tsx`
- Modify: `frontend/src/styles.css`
- Test: `backend/src/test/java/com/example/k12learninggame/ApiSmokeTest.java`
- Test: `frontend/src/__tests__/app-shell.test.tsx`

**Step 1: Write the failing tests**
- Backend:
  - parent can create child profile
  - parent can update child profile nickname/avatar/stage
- Frontend:
  - login area shows child cards from parent-scoped data
  - top-bar child switcher still works with updated session shape

**Step 2: Run tests to verify they fail**
- Run targeted backend and frontend tests

**Step 3: Write minimal implementation**
- Add create/update child APIs
- Persist avatar/stage metadata
- Expose them to frontend
- Show profile card enhancements in login and switcher

**Step 4: Run tests to verify they pass**

### Task 4: Persist parent settings and make leaderboard participation effective

**Files:**
- Create: `backend/src/main/java/com/example/k12learninggame/dto/ParentSettingsUpdateRequest.java`
- Modify: `backend/src/main/java/com/example/k12learninggame/service/GameContentService.java`
- Modify: `backend/src/main/java/com/example/k12learninggame/api/GameController.java`
- Modify: `frontend/src/api.ts`
- Modify: `frontend/src/pages/ParentDashboard.tsx`
- Test: `backend/src/test/java/com/example/k12learninggame/ApiSmokeTest.java`
- Test: `frontend/src/__tests__/parent-dashboard.test.tsx`
- Test: `frontend/src/__tests__/leaderboard.test.tsx`

**Step 1: Write the failing tests**
- parent settings update persists
- leaderboard excludes opted-out child
- parent dashboard reflects saved settings after refresh

**Step 2: Run tests to verify they fail**

**Step 3: Write minimal implementation**
- Add settings patch endpoint
- Recalculate leaderboard after participation toggle
- Update parent dashboard UI to edit and save settings

**Step 4: Run tests to verify they pass**

### Task 5: Strengthen completion persistence for first-pass vs repeat-practice

**Files:**
- Modify: `backend/src/main/java/com/example/k12learninggame/domain/LevelCompletionEntity.java`
- Modify: `backend/src/main/java/com/example/k12learninggame/service/GameContentService.java`
- Modify: `backend/src/main/resources/data.sql`
- Modify: `frontend/src/api.ts`
- Modify: `frontend/src/pages/LevelPlayer.tsx`
- Test: `backend/src/test/java/com/example/k12learninggame/PersistenceBackedGameContentServiceTest.java`
- Test: `frontend/src/__tests__/progress-flow.test.tsx`

**Step 1: Write the failing tests**
- first completion is flagged as first pass
- repeat completion does not re-trigger first-unlock style rewards
- completion response carries enough metadata for UI refresh

**Step 2: Run tests to verify they fail**

**Step 3: Write minimal implementation**
- Add `isFirstCompletion` and `isEffective` handling
- Update reward/achievement/leaderboard aggregation logic
- Update level-complete response to reflect new settlement state

**Step 4: Run tests to verify they pass**

### Task 6: Refresh dependent pages after completion

**Files:**
- Modify: `frontend/src/api.ts`
- Modify: `frontend/src/session.tsx`
- Modify: `frontend/src/pages/HomeWorld.tsx`
- Modify: `frontend/src/pages/AchievementsPage.tsx`
- Modify: `frontend/src/pages/Leaderboard.tsx`
- Modify: `frontend/src/pages/ParentDashboard.tsx`
- Modify: `frontend/src/pages/SubjectMap.tsx`
- Test: `frontend/src/__tests__/progress-flow.test.tsx`

**Step 1: Write the failing test**
- after completing a level and navigating back, dependent views show updated backend data

**Step 2: Run test to verify it fails**

**Step 3: Write minimal implementation**
- add a lightweight invalidation/refresh trigger in session/app state
- consume refreshed data in dependent pages

**Step 4: Run test to verify it passes**

### Task 7: Add achievement unlock feedback and closer product-grade polish

**Files:**
- Modify: `backend/src/main/java/com/example/k12learninggame/dto/CompleteLevelResponse.java`
- Modify: `backend/src/main/java/com/example/k12learninggame/service/GameContentService.java`
- Modify: `frontend/src/pages/LevelPlayer.tsx`
- Modify: `frontend/src/styles.css`
- Test: `backend/src/test/java/com/example/k12learninggame/ApiSmokeTest.java`
- Test: `frontend/src/__tests__/progress-flow.test.tsx`

**Step 1: Write the failing tests**
- completion response includes newly unlocked achievements
- level-complete UI celebrates unlocks separately from normal reward state

**Step 2: Run tests to verify they fail**

**Step 3: Write minimal implementation**
- compute newly unlocked badges on completion
- render unlock cards / animation / CTA in level completion state

**Step 4: Run tests to verify they pass**

### Task 8: Final regression and cleanup

**Files:**
- Modify as needed across touched backend/frontend files
- Test: full backend suite
- Test: full frontend suite

**Step 1: Run full frontend tests**
- Run: `npm test -- --run`

**Step 2: Run frontend production build**
- Run: `npm run build`

**Step 3: Run full backend tests**
- Run: `mvn -q -Dmaven.repo.local='/Users/easoncheng/Documents/New project/.cache/m2' test`

**Step 4: Fix any regressions**

**Step 5: Re-run all checks until green**

