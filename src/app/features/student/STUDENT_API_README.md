## Student API – Endpoints Used by Frontend Features

This document lists the **backend endpoints required by the Student Portal features** and how the Angular services use them.  
Base URL: taken from `environment.apiUrl`. All paths below are **relative** to that base.

---

### 1. Portfolio Management

Used by: `StudentPortfolioService`

- **GET `/Student/Portfolio/Overview`**
  - **Purpose**: Load high-level portfolio overview for all subjects (files, feedback, badges).
  - **Response model**:  
    - `TotalFiles: number`  
    - `TotalFeedback: number`  
    - `TotalBadges: number`  
    - `SubjectPortfolios: SubjectPortfolioDto[]`  
    - `RecentUploads: PortfolioFileDto[]`

- **GET `/Student/Portfolio/Subject/{subjectId}`**
  - **Purpose**: Load full portfolio data for a single subject.
  - **Route param**: `subjectId: string`
  - **Response model**: `SubjectPortfolioDto`

- **POST `/Student/Portfolio/Upload`**
  - **Purpose**: Upload a new portfolio file.
  - **Body**: `multipart/form-data`
    - `SubjectId: string`
    - `File: File`
  - **Response model**: `PortfolioFileDto`

- **DELETE `/Student/Portfolio/File/{fileId}`**
  - **Purpose**: Delete a portfolio file.
  - **Route param**: `fileId: string`
  - **Response model**: typically empty body (success status only).

- **POST `/Student/Portfolio/Reflection`**
  - **Purpose**: Save / update a reflection for a subject.
  - **Body (JSON)**:
    - `SubjectId: string`
    - `Content: string`
    - `Prompt?: string`
  - **Response model**: `ReflectionDto`

> Note: There is also a configured but unused endpoint  
> **GET `/Student/Portfolio/Feedback/{subjectId}`** for fetching feedback by subject.

---

### 2. Missions

Used by: `StudentMissionsService`

- **GET `/Student/Missions`**
  - **Purpose**: Get all missions for the student.
  - **Response model**: `MissionDto[]`

- **GET `/Student/Missions/{missionId}`**
  - **Purpose**: Get detailed info for a single mission.
  - **Route param**: `missionId: number`
  - **Response model**: `MissionDetailDto`

- **POST `/Student/Missions/{missionId}/Progress`**
  - **Purpose**: Update progress for a mission (when an activity is completed).
  - **Route param**: `missionId: number`
  - **Body (JSON)**: `UpdateMissionProgressRequest`
  - **Response model**: `MissionProgressResponse`

---

### 3. Badges

Used by: `StudentBadgesService`

- **GET `/Student/Badges`**
  - **Purpose**: Get full badges summary for the student.
  - **Response model**: `StudentBadgesSummaryDto`

- **POST `/Student/Badges/Award`**
  - **Purpose**: Award a badge to a student (admin/teacher–driven action).
  - **Body (JSON)**: `AwardBadgeRequest`
  - **Response model**: empty / confirmation only.

---

### 4. Challenge Zone

Used by: `StudentChallengesService`

- **GET `/Student/Challenges/Active`**
  - **Purpose**: Get all active challenges.
  - **Response model**: `ChallengeDto[]`

- **POST `/Student/Challenges/{challengeId}/Join`**
  - **Purpose**: Enroll the student in a challenge.
  - **Route param**: `challengeId: number`
  - **Body**: empty (or minimal JSON)
  - **Response model**: empty / confirmation only.

- **POST `/Student/Challenges/{challengeId}/Submit`**
  - **Purpose**: Submit an answer for a challenge.
  - **Route param**: `challengeId: number`
  - **Body**: `multipart/form-data`
    - `ChallengeId: number`
    - `Answer: string`
    - `Attachments[i]: File` (optional, repeated)
  - **Response model**: `ChallengeSubmissionResponse`

---

### 5. Progress Tracking

Used by: `StudentProgressService`

- **GET `/Student/Progress`**
  - **Purpose**: Load overall progress view for the student.
  - **Response model**: `StudentProgressDto`

---

### 6. Digital Notebook

Used by: `StudentNotebookService`

- **GET `/Student/Notebook`**
  - **Purpose**: Get notebook entries, optionally filtered.
  - **Query params** (all optional):
    - `subjectId: string`
    - `dateFrom: string` (ISO date)
    - `dateTo: string` (ISO date)
  - **Response model**: `NotebookEntryDto[]`

- **POST `/Student/Notebook`**
  - **Purpose**: Create or update a notebook entry.
  - **Body (JSON)**: `SaveNotebookEntryRequest`
  - **Response model**: `NotebookEntryDto`

- **DELETE `/Student/Notebook/{entryId}`**
  - **Purpose**: Delete an entry from the notebook.
  - **Route param**: `entryId: string`

---

### 7. Dashboard & Notifications

Used by: `StudentDashboardService`

- **GET `/Student/Dashboard`**
  - **Purpose**: Load data for the main student dashboard.
  - **Response model**: `StudentDashboardDto`

- **GET `/Student/Notifications`**
  - **Purpose**: Get all notifications (optionally filtered as unread only by query param).
  - **Supported query**: `unreadOnly=true`
  - **Response model**: `NotificationDto[]`

- **PUT `/Student/Notifications/{notificationId}/Read`**
  - **Purpose**: Mark a notification as read.
  - **Route param**: `notificationId: number`
  - **Body**: typically `null` / empty

---

### 8. Goal Management

Used by: `StudentGoalsService`

- **GET `/Student/Goals`**
  - **Purpose**: Get all goals for the student.
  - **Response model**: `StudentGoalDto[]`

- **POST `/Student/Goals`**
  - **Purpose**: Create a new goal.
  - **Body (JSON)**: `CreateGoalRequest`
  - **Response model**: `StudentGoalDto`

- **PUT `/Student/Goals/{goalId}/Progress`**
  - **Purpose**: Update the progress of a goal.
  - **Route param**: `goalId: number`
  - **Body (JSON)**:
    - `progress: number`

---

### 9. Activity & Points

Used by: `StudentActivityService`

- **GET `/Student/Activity/Streak`**
  - **Purpose**: Get the student’s activity streak (for gamification/progress UI).
  - **Response model**: `ActivityStreakDto`

- **GET `/Student/Points`**
  - **Purpose**: Get a summary of the student’s points.
  - **Response model**: `PointsSummaryDto`

- **POST `/Student/Points/Award`**
  - **Purpose**: Award points to a student (typically teacher/admin action).
  - **Body (JSON)**: `AwardPointsRequest`
  - **Response model**: empty / confirmation only.

---

### Notes for Backend Implementation

- The Angular `BaseHttpService` expects the backend to return either:
  - a wrapped object: `{ IsSuccess: boolean; Data: T; Message?: string; ErrorCode?: string; }`, or  
  - a plain DTO `T`.
- On wrapped responses, **when `IsSuccess` is false, the client will throw**, so failed requests should set `IsSuccess = false` and an appropriate `Message`.
- For all endpoints above, ensure **CORS**, **authentication**, and **authorization** are configured so that the student role can access only their own resources.


