## Teacher API – Endpoints & Routes Needed for Teacher Role

This document describes the **backend endpoints** and **frontend routes** required to fully support the Teacher role in the School Hub app.

Base URL: taken from `environment.apiUrl`. All paths below are **relative** to that base.

---

### 1. Frontend Routes for Teacher

Defined in `teacher.routes.ts` as `TEACHER_ROUTES`:

- `/teacher/dashboard` → `TeacherDashboardComponent`
- `/teacher/hub` → `TeacherHubComponent`
- `/teacher/learning-vault` → `LearningVaultComponent`
- `/teacher/learning-vault/module/:id` → `CpdModuleDetailComponent`
- `/teacher/cpd` → `TeacherCpdComponent`
- `/teacher/student-portfolio-hub` → `SubjectPortalComponent`
- `/teacher/teachers-lounge` → `TeachersLoungeComponent`
- `/teacher/portfolio/:studentId/:subjectId` → `PortfolioDetailComponent`

All API endpoints below are designed to support these teacher pages.

---

### 2. Teacher Dashboard & Stats

Used by: `TeacherDashboardComponent`, `TeacherHubComponent`, `TeacherCpdComponent`  
Models: `CPDProgress`, `TeacherStats` (from `cpd.model.ts`)

- **GET `/Teacher/Dashboard`**
  - **Purpose**: Load high-level teacher stats and CPD progress for the dashboard.
  - **Response body**:

    ```json
    {
      "CpdProgress": {
        "HoursCompleted": 4.5,
        "TargetHours": 10,
        "CompletedModules": 3,
        "TotalModules": 8,
        "LastActivityDate": "2025-12-15T10:30:00Z",
        "Streak": 5
      },
      "Stats": {
        "CpdHours": 4.5,
        "BadgesEarned": 4,
        "ActiveStudents": 28,
        "CurrentStreak": 5
      }
    }
    ```

> The frontend can either call this single endpoint or fetch CPD and portfolio stats separately (see below).

---

### 3. CPD / Learning Vault (Teacher Professional Development)

Used by: `LearningVaultComponent`, `CpdModuleDetailComponent`, `TeacherCpdComponent`  
Models: `CPDModule`, `CPDProgress` (from `cpd.model.ts`)

- **GET `/Teacher/Cpd/Modules`**
  - **Purpose**: List all CPD/learning vault modules available to the teacher.
  - **Response body**: `CPDModule[]`

    ```json
    [
      {
        "Id": "eduaide-ai",
        "Title": "Eduaide AI",
        "Duration": 20,
        "Status": "completed",
        "Icon": "fas fa-robot",
        "Color": "#6366f1",
        "BgColor": "#e0e7ff",
        "VideoUrl": "https://www.youtube.com/embed/...",
        "VideoProvider": "youtube",
        "GuideContent": "<h3>...</h3>",
        "FormUrl": "https://forms.office.com/...",
        "EvidenceFiles": ["file1.pdf"],
        "CompletedAt": "2025-11-15T00:00:00Z",
        "StartedAt": "2025-11-15T00:00:00Z",
        "LastAccessedAt": "2025-11-15T00:00:00Z"
      }
    ]
    ```

- **GET `/Teacher/Cpd/Modules/{id}`**
  - **Purpose**: Load details for a single CPD module (used by `CpdModuleDetailComponent`).
  - **Route param**: `id: string`
  - **Response body**: single `CPDModule` object (same shape as above).

- **GET `/Teacher/Cpd/Progress`**
  - **Purpose**: Get overall CPD progress for the teacher (hours, completed modules, streak).
  - **Response body**: `CPDProgress`

    ```json
    {
      "HoursCompleted": 4.5,
      "TargetHours": 10,
      "CompletedModules": 3,
      "TotalModules": 8,
      "LastActivityDate": "2025-12-01T00:00:00Z",
      "Streak": 5
    }
    ```

- **POST `/Teacher/Cpd/Modules/{id}/Status`**
  - **Purpose**: Update module status (e.g., start or complete a module).
  - **Route param**: `id: string`
  - **Body (JSON)**:

    ```json
    {
      "Status": "not-started | in-progress | completed"
    }
    ```

  - **Response**: updated `CPDModule` or confirmation.

- **POST `/Teacher/Cpd/Modules/{id}/Evidence`**
  - **Purpose**: Upload evidence files for a CPD module.
  - **Route param**: `id: string`
  - **Body**: `multipart/form-data`
    - `Files[i]: File`
  - **Response**: updated `CPDModule` (with `EvidenceFiles` array updated).

---

### 4. Teacher View of Student Portfolios

Used by: `SubjectPortalComponent`, `PortfolioDetailComponent`  
Models: `Student`, `Portfolio`, `Submission`, `Comment`, `Badge` (from `portfolio.model.ts`)

#### 4.1 Student List for a Subject

- **GET `/Teacher/Portfolio/Students`**
  - **Purpose**: Get a list of students and their portfolio status for a given subject/class.
  - **Query params**:
    - `subjectId: string` (required)
  - **Response body**: `Student[]`

    ```json
    [
      {
        "Id": "student-1",
        "Name": "Ahmed Al-Mansouri",
        "Email": "ahmed.m@school.edu",
        "Avatar": "",
        "PortfolioStatus": "reviewed",
        "LatestSubmission": {
          "Id": "sub-1",
          "Title": "Algebra Problem Set Week 5",
          "Content": "",
          "SubmittedAt": "2025-12-01T10:30:00Z",
          "Type": "onenote"
        }
      }
    ]
    ```

#### 4.2 Single Student Portfolio (Detail View)

- **GET `/Teacher/Portfolio/{studentId}/{subjectId}`**
  - **Purpose**: Get the full portfolio for a specific student in a specific subject.
  - **Route params**:
    - `studentId: string`
    - `subjectId: string`
  - **Response body**: `Portfolio`

    ```json
    {
      "Id": "portfolio-1",
      "StudentId": "student-1",
      "StudentName": "Ahmed Al-Mansouri",
      "SubjectId": "math",
      "SubjectName": "Mathematics",
      "Submissions": [
        {
          "Id": "sub-1",
          "Title": "Algebra Problem Set Week 5",
          "Content": "<h3>...</h3>",
          "SubmittedAt": "2025-12-01T10:30:00Z",
          "Type": "onenote",
          "FileUrl": null,
          "FileName": null,
          "FileSize": null
        }
      ],
      "Feedback": [
        {
          "Id": "comment-1",
          "TeacherId": "teacher-1",
          "TeacherName": "Sarah Johnson",
          "Content": "Excellent work...",
          "CreatedAt": "2025-12-01T14:00:00Z",
          "Type": "comment"
        }
      ],
      "Badges": [
        {
          "Id": "problem-solver",
          "Name": "Problem Solver",
          "Icon": "fas fa-lightbulb",
          "Description": "...",
          "Color": "#f59e0b",
          "Category": "skill",
          "AwardedAt": "2025-11-15T00:00:00Z"
        }
      ],
      "Likes": 3,
      "IsLiked": true,
      "LastUpdated": "2025-12-01T00:00:00Z"
    }
    ```

#### 4.3 Feedback & Review Actions

- **POST `/Teacher/Portfolio/{portfolioId}/Comment`**
  - **Purpose**: Add a teacher comment or revision request to a portfolio.
  - **Route param**: `portfolioId: string`
  - **Body (JSON)**:

    ```json
    {
      "Content": "Great work on this assignment!",
      "Type": "comment" // or "revision-request"
    }
    ```

  - **Response**: updated `Portfolio` or confirmation.

- **POST `/Teacher/Portfolio/{portfolioId}/ToggleLike`**
  - **Purpose**: Like/unlike a student portfolio entry.
  - **Route param**: `portfolioId: string`
  - **Body**: empty or `{}`.
  - **Response**: updated `Portfolio` (with `Likes` and `IsLiked` updated).

- **POST `/Teacher/Portfolio/{portfolioId}/RequestRevision`**
  - **Purpose**: Request a revision from the student with feedback.
  - **Route param**: `portfolioId: string`
  - **Body (JSON)**:

    ```json
    {
      "Feedback": "Please add more explanation to your solution steps."
    }
    ```

  - **Response**:
    - Updated `Portfolio` (new `Comment` of type `revision-request`)
    - Student’s `PortfolioStatus` set to `"needs-revision"`.

#### 4.4 Awarding Badges

- **GET `/Teacher/Portfolio/Badges`**
  - **Purpose**: List all available badges a teacher can award.
  - **Response body**: `Badge[]`

    ```json
    [
      {
        "Id": "critical-thinker",
        "Name": "Critical Thinker",
        "Icon": "fas fa-brain",
        "Description": "Demonstrates exceptional critical thinking skills",
        "Color": "#6366f1",
        "Category": "skill"
      }
    ]
    ```

- **POST `/Teacher/Portfolio/{portfolioId}/AwardBadge`**
  - **Purpose**: Award a badge to a student’s portfolio.
  - **Route param**: `portfolioId: string`
  - **Body (JSON)**:

    ```json
    {
      "BadgeId": "critical-thinker"
    }
    ```

  - **Response**: updated `Portfolio` with new `Badge` (including `AwardedAt`).

---

### 5. Notes on Response Wrapping

The Angular `BaseHttpService` in this project supports both:

- Wrapped responses:

  ```json
  {
    "IsSuccess": true,
    "Data": { /* DTO from above */ },
    "Message": "",
    "ErrorCode": "none",
    "IsAuthorized": true
  }
  ```

- Plain DTO responses:

  ```json
  { /* DTO from above */ }
  ```

For teacher endpoints, you can use either pattern, as long as:

- When using the wrapped form, set `IsSuccess = true` for successful calls.
- Error cases set `IsSuccess = false` and return a meaningful `Message`.


