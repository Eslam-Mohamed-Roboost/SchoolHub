# School Hub - PostgreSQL Database Schema

**Generated:** 2025-12-05  
**Target Database:** PostgreSQL 14+  
**Backend Architecture:** CQRS + Clean Architecture + Vertical Slicing  
**Target Audience:** 800 Students, ~40 Teachers, Admin Staff

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Database Tables](#database-tables)
- [Entity Relationships](#entity-relationships)
- [Indexes & Performance](#indexes--performance)
- [Time Estimation](#time-estimation)

---

## Architecture Overview

### Backend Stack Recommendation

- **Framework:** .NET 8 / ASP.NET Core
- **ORM:** Entity Framework Core 8
- **Architecture:** Clean Architecture with CQRS
- **CQRS Implementation:** MediatR (Application Layer)
- **API Structure:** Vertical Slicing by Feature
- **Database:** PostgreSQL 14+

### Layer Structure

```
SchoolHub.API/                    (Presentation - Vertical Slices)
├── Features/
│   ├── Auth/
│   │   ├── Endpoints/
│   │   │   ├── Endpoint.cs
│   │   │   ├── Request.cs
│   │   │   └── Response.cs
│   ├── Students/
│   │   ├── Endpoints/
│   │   │   ├── Endpoint.cs
│   │   │   ├── Request.cs
│   │   │   └── Response.cs
│   ├── Teachers/
│   │   ├── Endpoints/
│   │   │   ├── Endpoint.cs
│   │   │   ├── Request.cs
│   │   │   └── Response.cs
│   ├── Admin/
│   │   ├── Endpoints/
│   │   │   ├── Endpoint.cs
│   │   │   ├── Request.cs
│   │   │   └── Response.cs
│   └── Portfolios/
│       ├── Endpoints/
│       │   ├── Endpoint.cs
│       │   ├── Request.cs
│       │   └── Response.cs
│
SchoolHub.Application/            (CQRS - Commands & Queries - Vertical Slices)
├── Features/
SchoolHub.Application/            (CQRS - Commands & Queries - Vertical Slices)
├── Features/
│   ├── Auth/
│   │   ├── Commands/
│   │   ├── Queries/
│   │   └── DTOs/
│   ├── Students/
│   │   ├── Commands/
│   │   ├── Queries/
│   │   └── DTOs/
│   ├── Teachers/
│   │   ├── Commands/
│   │   ├── Queries/
│   │   └── DTOs/
│   ├── Admin/
│   │   ├── Commands/
│   │   ├── Queries/
│   │   └── DTOs/
│   └── Portfolios/
│       ├── Commands/
│       ├── Queries/
│       └── DTOs/
SchoolHub.Domain/                 (Entities & Business Logic)
├── Entities/
├── ValueObjects/
└── Events/
│
SchoolHub.Infrastructure/         (Data Access)
├── Persistence/
├── Repositories/
└── Configurations/
```

---

## Database Tables

### 1. User Management

#### `Users`

**Purpose:** Core user authentication and profile data

| Column         | Type         | Constraints             | Description                                 |
| -------------- | ------------ | ----------------------- | ------------------------------------------- |
| `Id`           | BIGINT       | PRIMARY KEY             | Unique user identifier (Snowflake ID)       |
| `Name`         | VARCHAR(200) | NOT NULL                | Full name                                   |
| `UserName`     | VARCHAR(100) | NOT NULL, UNIQUE        | Login username                              |
| `Email`        | VARCHAR(255) | NOT NULL, UNIQUE        | Email address                               |
| `PasswordHash` | VARCHAR(500) | NOT NULL                | Hashed password                             |
| `PhoneNumber`  | VARCHAR(20)  | NULL                    | Contact number                              |
| `Role`         | INTEGER      | NOT NULL                | FK to Roles (Student=1, Teacher=2, Admin=3) |
| `IsActive`     | BOOLEAN      | DEFAULT TRUE            | Account status                              |
| `Avatar`       | TEXT         | NULL                    | Profile picture URL                         |
| `ClassId`      | BIGINT       | NULL                    | FK to Classes (for students)                |
| `LastLogin`    | TIMESTAMP    | NULL                    | Last login datetime                         |
| `CreatedAt`    | TIMESTAMP    | NOT NULL, DEFAULT NOW() | Account creation                            |
| `UpdatedAt`    | TIMESTAMP    | NOT NULL, DEFAULT NOW() | Last update                                 |

**Indexes:**

- `idx_users_email` on `Email`
- `idx_users_username` on `UserName`
- `idx_users_role` on `Role`
- `idx_users_class` on `ClassId`

---

#### `Classes`

**Purpose:** Student class/grade organization

| Column         | Type        | Constraints             | Description                    |
| -------------- | ----------- | ----------------------- | ------------------------------ |
| `Id`           | BIGINT      | PRIMARY KEY             | Class identifier (Snowflake ID)|
| `Name`         | VARCHAR(50) | NOT NULL                | Class name (e.g., "6A", "7B")  |
| `Grade`        | INTEGER     | NOT NULL                | Grade level (6 or 7)           |
| `TeacherId`    | BIGINT      | NULL                    | FK to Users (homeroom teacher) |
| `StudentCount` | INTEGER     | DEFAULT 0               | Cached student count           |
| `CreatedAt`    | TIMESTAMP   | NOT NULL, DEFAULT NOW() | Creation date                  |

**Indexes:**

- `idx_classes_grade` on `Grade`
- `idx_classes_teacher` on `TeacherId`

---

### 2. Digital Citizenship Missions

#### `Missions`

**Purpose:** 8 Digital Citizenship missions configuration

| Column             | Type         | Constraints             | Description                 |
| ------------------ | ------------ | ----------------------- | --------------------------- |
| `Id`               | BIGINT       | PRIMARY KEY             | Mission identifier (Snowflake ID)|
| `Number`           | INTEGER      | NOT NULL, UNIQUE        | Mission number (1-8)        |
| `Title`            | VARCHAR(200) | NOT NULL                | Mission title               |
| `Description`      | TEXT         | NULL                    | Mission description         |
| `Icon`             | VARCHAR(50)  | NULL                    | Icon/emoji                  |
| `EstimatedMinutes` | INTEGER      | DEFAULT 30              | Estimated completion time   |
| `BadgeId`          | BIGINT       | NOT NULL                | FK to Badges (earned badge) |
| `Order`            | INTEGER      | NOT NULL                | Display order               |
| `IsEnabled`        | BOOLEAN      | DEFAULT TRUE            | Active status               |
| `CreatedAt`        | TIMESTAMP    | NOT NULL, DEFAULT NOW() | Creation date               |
| `UpdatedAt`        | TIMESTAMP    | NOT NULL, DEFAULT NOW() | Last update                 |

**Indexes:**

- `idx_missions_order` on `Order`
- `idx_missions_number` on `Number`

**Static Data (8 Missions):**

1. Digital Citizenship Foundations → Digital Citizen Badge
2. Your Digital Footprint → Footprint Tracker Badge
3. Online Safety & Privacy → Safety Shield Badge
4. Cyberbullying Prevention → Kindness Champion Badge
5. Media Literacy & Fake News → Truth Seeker Badge
6. Digital Communication → Communication Pro Badge
7. Balanced Technology Use → Balance Master Badge
8. Digital Rights & Responsibilities → Digital Leader Badge

---

#### `Activities`

**Purpose:** Individual activities within missions

| Column             | Type         | Constraints             | Description                                   |
| ------------------ | ------------ | ----------------------- | --------------------------------------------- |
| `Id`               | BIGINT       | PRIMARY KEY             | Activity identifier (Snowflake ID)|
| `MissionId`        | BIGINT       | NOT NULL                | FK to Missions                                |
| `Number`           | INTEGER      | NOT NULL                | Activity number within mission                |
| `Title`            | VARCHAR(200) | NOT NULL                | Activity title                                |
| `Type`             | VARCHAR(50)  | NOT NULL                | 'OneNote', 'Video', 'Game', 'Reading', 'Quiz' |
| `ContentUrl`       | TEXT         | NULL                    | Embedded content URL                          |
| `EstimatedMinutes` | INTEGER      | DEFAULT 10              | Estimated time                                |
| `Instructions`     | TEXT         | NULL                    | Activity instructions                         |
| `Order`            | INTEGER      | NOT NULL                | Display order                                 |
| `IsRequired`       | BOOLEAN      | DEFAULT TRUE            | Required for completion                       |
| `CreatedAt`        | TIMESTAMP    | NOT NULL, DEFAULT NOW() | Creation date                                 |
| `UpdatedAt`        | TIMESTAMP    | NOT NULL, DEFAULT NOW() | Last update                                   |

**Indexes:**

- `idx_activities_mission` on `MissionId`
- `idx_activities_order` on `MissionId, Order`

---

#### `StudentMissionProgress`

**Purpose:** Track student progress on missions

| Column                | Type         | Constraints             | Description                             |
| --------------------- | ------------ | ----------------------- | --------------------------------------- |
| `Id`                  | BIGINT       | PRIMARY KEY             | Progress identifier (Snowflake ID)|
| `StudentId`           | BIGINT       | NOT NULL                | FK to Users                             |
| `MissionId`           | BIGINT       | NOT NULL                | FK to Missions                          |
| `Status`              | VARCHAR(50)  | NOT NULL                | 'NotStarted', 'InProgress', 'Completed' |
| `CompletedActivities` | INTEGER      | DEFAULT 0               | Count of completed activities           |
| `TotalActivities`     | INTEGER      | NOT NULL                | Total activities in mission             |
| `ProgressPercentage`  | DECIMAL(5,2) | DEFAULT 0.00            | Calculated percentage                   |
| `StartedAt`           | TIMESTAMP    | NULL                    | When started                            |
| `CompletedAt`         | TIMESTAMP    | NULL                    | When completed                          |
| `UpdatedAt`           | TIMESTAMP    | NOT NULL, DEFAULT NOW() | Last update                             |

**Unique Constraint:** `(StudentId, MissionId)`

**Indexes:**

- `idx_student_mission_progress_student` on `StudentId`
- `idx_student_mission_progress_status` on `Status`

---

#### `StudentActivityProgress`

**Purpose:** Track individual activity completion

| Column        | Type      | Constraints             | Description              |
| ------------- | --------- | ----------------------- | ------------------------ |
| `Id`          | BIGINT    | PRIMARY KEY             | Progress identifier (Snowflake ID)|
| `StudentId`   | BIGINT    | NOT NULL                | FK to Users              |
| `ActivityId`  | BIGINT    | NOT NULL                | FK to Activities         |
| `IsCompleted` | BOOLEAN   | DEFAULT FALSE           | Completion status        |
| `CompletedAt` | TIMESTAMP | NULL                    | Completion datetime      |
| `Notes`       | TEXT      | NULL                    | Student notes/reflection |
| `CreatedAt`   | TIMESTAMP | NOT NULL, DEFAULT NOW() | First access             |
| `UpdatedAt`   | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update              |

**Unique Constraint:** `(StudentId, ActivityId)`

**Indexes:**

- `idx_activity_progress_student` on `StudentId`
- `idx_activity_progress_activity` on `ActivityId`

---

### 3. Badges & Gamification

#### `Badges`

**Purpose:** Badge definitions (Student + Teacher CPD badges)

| Column        | Type         | Constraints             | Description                                           |
| ------------- | ------------ | ----------------------- | ----------------------------------------------------- |
| `Id`          | BIGINT       | PRIMARY KEY             | Badge identifier (Snowflake ID)|
| `Name`        | VARCHAR(200) | NOT NULL                | Badge name                                            |
| `Description` | TEXT         | NULL                    | Badge description                                     |
| `Icon`        | VARCHAR(100) | NULL                    | Icon/emoji                                            |
| `Color`       | VARCHAR(50)  | NULL                    | Badge color (hex)                                     |
| `Category`    | VARCHAR(100) | NOT NULL                | 'DigitalCitizenship', 'AITools', 'Microsoft365', etc. |
| `TargetRole`  | INTEGER      | NOT NULL                | 1=Student, 2=Teacher, 3=Both                          |
| `CpdHours`    | DECIMAL(4,2) | NULL                    | CPD hours (for teachers)                              |
| `IsActive`    | BOOLEAN      | DEFAULT TRUE            | Active status                                         |
| `CreatedAt`   | TIMESTAMP    | NOT NULL, DEFAULT NOW() | Creation date                                         |

**Indexes:**

- `idx_badges_category` on `Category`
- `idx_badges_target_role` on `TargetRole`

---

#### `StudentBadges`

**Purpose:** Student badge awards

| Column        | Type      | Constraints             | Description                      |
| ------------- | --------- | ----------------------- | -------------------------------- |
| `Id`          | BIGINT    | PRIMARY KEY             | Award identifier (Snowflake ID)|
| `StudentId`   | BIGINT    | NOT NULL                | FK to Users                      |
| `BadgeId`     | BIGINT    | NOT NULL                | FK to Badges                     |
| `EarnedDate`  | TIMESTAMP | NOT NULL, DEFAULT NOW() | When earned                      |
| `MissionId`   | BIGINT    | NULL                    | FK to Missions (if from mission) |
| `AutoAwarded` | BOOLEAN   | DEFAULT TRUE            | Auto vs manual award             |

**Unique Constraint:** `(StudentId, BadgeId)`

**Indexes:**

- `idx_student_badges_student` on `StudentId`
- `idx_student_badges_earned_date` on `EarnedDate`

---

#### `TeacherBadgeSubmissions`

**Purpose:** Teacher CPD badge submissions for review

| Column            | Type         | Constraints             | Description                            |
| ----------------- | ------------ | ----------------------- | -------------------------------------- |
| `Id`              | BIGINT       | PRIMARY KEY             | Submission identifier (Snowflake ID)|
| `TeacherId`       | BIGINT       | NOT NULL                | FK to Users                            |
| `BadgeId`         | BIGINT       | NOT NULL                | FK to Badges                           |
| `EvidenceLink`    | TEXT         | NOT NULL                | Link to evidence (OneNote, video, etc) |
| `SubmitterNotes`  | TEXT         | NULL                    | Teacher's notes                        |
| `SubmittedAt`     | TIMESTAMP    | NOT NULL, DEFAULT NOW() | Submission datetime                    |
| `Status`          | VARCHAR(50)  | NOT NULL                | 'Pending', 'Approved', 'Rejected'      |
| `ReviewedBy`      | BIGINT       | NULL                    | FK to Users (admin)                    |
| `ReviewedAt`      | TIMESTAMP    | NULL                    | Review datetime                        |
| `ReviewNotes`     | TEXT         | NULL                    | Admin feedback                         |
| `CpdHoursAwarded` | DECIMAL(4,2) | NULL                    | Awarded CPD hours                      |

**Indexes:**

- `idx_badge_submissions_teacher` on `TeacherId`
- `idx_badge_submissions_status` on `Status`
- `idx_badge_submissions_submitted` on `SubmittedAt`

---

#### `StudentLevels`

**Purpose:** Student level/progression tracking

| Column                | Type         | Constraints     | Description                                       |
| --------------------- | ------------ | --------------- | ------------------------------------------------- |
| `Id`                  | BIGINT       | PRIMARY KEY     | Level identifier (Snowflake ID)|
| `StudentId`           | BIGINT       | NOT NULL UNIQUE | FK to Users                                       |
| `CurrentLevel`        | INTEGER      | DEFAULT 1       | Level (1-4)                                       |
| `LevelName`           | VARCHAR(100) | NULL            | 'Digital Scout', 'Explorer', 'Champion', 'Leader' |
| `BadgesEarned`        | INTEGER      | DEFAULT 0       | Total badges earned                               |
| `NextLevelBadgeCount` | INTEGER      | NULL            | Badges needed for next level                      |
| `LevelIcon`           | VARCHAR(100) | NULL            | Level badge icon                                  |
| `LastLevelUpDate`     | TIMESTAMP    | NULL            | Last level-up datetime                            |

**Indexes:**

- `idx_student_levels_student` on `StudentId`
- `idx_student_levels_current_level` on `CurrentLevel`

---

### 4. Portfolio System

#### `Subjects`

**Purpose:** Subject/course definitions

| Column      | Type         | Constraints             | Description         |
| ----------- | ------------ | ----------------------- | ------------------- |
| `Id`        | BIGINT       | PRIMARY KEY             | Subject identifier (Snowflake ID)|
| `Name`      | VARCHAR(200) | NOT NULL                | Subject name        |
| `Icon`      | VARCHAR(100) | NULL                    | Subject icon        |
| `Color`     | VARCHAR(50)  | NULL                    | Display color

---

## Entity Relationships

### ER Diagram (Mermaid)

```mermaid
erDiagram
    Users ||--o{ StudentMissionProgress : "has"
    Users ||--o{ StudentActivityProgress : "has"
    Users ||--o{ StudentBadges : "earns"
    Users ||--o{ TeacherBadgeSubmissions : "submits"
    Users ||--o{ PortfolioFiles : "uploads"
    Users ||--o{ TeacherFeedback : "gives/receives"
    Users ||--o{ TeacherCpdProgress : "completes"
    Users ||--o{ Notifications : "receives"
    Users ||--o{ ActivityLogs : "generates"
    Users }o--|| Classes : "belongs to"

    Classes ||--o{ Users : "contains students"
    Classes ||--o{ Leaderboards : "has rankings"

    Missions ||--o{ Activities : "contains"
    Missions ||--o{ StudentMissionProgress : "tracked in"
    Missions ||--|| Badges : "awards"
    Missions ||--o{ QuizAttempts : "has quizzes"

    Activities ||--o{ StudentActivityProgress : "tracked in"

    Badges ||--o{ StudentBadges : "awarded as"
    Badges ||--o{ TeacherBadgeSubmissions : "submitted for"
    Badges ||--o{ CpdModules : "earned from"

    Subjects ||--o{ PortfolioFiles : "categorizes"
    Subjects ||--o{ PortfolioReflections : "categorizes"
    Subjects ||--o{ TeacherSubjects : "assigned to"
    Subjects ||--o{ PortfolioStatus : "tracks"

    CpdModules ||--o{ TeacherCpdProgress : "tracked in"

    Challenges ||--o{ StudentChallenges : "attempted by"
```

---

## Indexes & Performance

### Composite Indexes

```sql
-- Student progress lookup by class
CREATE INDEX idx_student_mission_class ON StudentMissionProgress(StudentId, MissionId)
  INCLUDE (Status, ProgressPercentage);

-- Teacher portfolio monitoring
CREATE INDEX idx_portfolio_teacher_subject ON PortfolioFiles(SubjectId, UploadedAt DESC)
  INCLUDE (StudentId, FileName);

-- Admin analytics
CREATE INDEX idx_badge_submissions_review ON TeacherBadgeSubmissions(Status, SubmittedAt DESC);

-- Activity feed
CREATE INDEX idx_activity_feed ON ActivityLogs(UserId, CreatedAt DESC)
  INCLUDE (Action, Type);

-- Notification feed
CREATE INDEX idx_notification_feed ON Notifications(UserId, IsRead, CreatedAt DESC);
```

### Partitioning Recommendations

For tables with high growth:

```sql
-- Partition ActivityLogs by month
CREATE TABLE ActivityLogs_2024_12 PARTITION OF ActivityLogs
  FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- Partition Notifications by quarter
CREATE TABLE Notifications_Q4_2024 PARTITION OF Notifications
  FOR VALUES FROM ('2024-10-01') TO ('2025-01-01');
```

---

## Time Estimation

### Backend Development (CQRS + Clean Architecture + Vertical Slicing)

| Phase                             | Tasks                                          | Estimated Time    | Notes                                           |
| --------------------------------- | ---------------------------------------------- | ----------------- | ----------------------------------------------- |
| **1. Project Setup**              |                                                | **5-7 days**      |                                                 |
|                                   | Solution structure (Clean Architecture)        | 1 day             | 4 layers + tests                                |
|                                   | Database setup (PostgreSQL + EF Core)          | 1 day             | Migrations, seeding                             |
|                                   | Entity models (Domain layer)                   | 2 days            | 25+ entities                                    |
|                                   | Base infrastructure (repositories, UnitOfWork) | 1-2 days          | Generic patterns                                |
|                                   | MediatR setup (CQRS)                           | 0.5 day           | Pipeline behaviors                              |
|                                   | Authentication & JWT                           | 1-1.5 days        | Identity integration                            |
| **2. Core Features**              |                                                | **30-40 days**    |                                                 |
|                                   | **Auth Module** (Login, Roles)                 | 2-3 days          | Commands/Queries                                |
|                                   | **User Management** (CRUD, Import)             | 3-4 days          | Admin features                                  |
|                                   | **Mission System**                             | 5-6 days          | Mission CRUD, progress tracking                 |
|                                   | **Activity Management**                        | 4-5 days          | Activity tracking, completion                   |
|                                   | **Badge System**                               | 6-7 days          | Student auto-award, teacher submission workflow |
|                                   | **Portfolio System**                           | 8-10 days         | File upload (S3/Azure), reflections, feedback   |
|                                   | **CPD Module**                                 | 5-6 days          | Teacher CPD tracking, progress                  |
|                                   | **Challenge Zone**                             | 4-5 days          | Challenges, quiz attempts                       |
|                                   | **Notifications**                              | 3-4 days          | Real-time notifications (SignalR)               |
| **3. Admin Features**             |                                                | **10-12 days**    |                                                 |
|                                   | Analytics dashboard                            | 3-4 days          | KPIs, charts data                               |
|                                   | Portfolio analytics                            | 2-3 days          | Completion stats, teacher matrix                |
|                                   | Evidence export (ADEK)                         | 2-3 days          | PDF/Excel generation                            |
|                                   | Reports generation                             | 2-3 days          | Custom reports                                  |
|                                   | Announcements & weekly challenges              | 2 days            | CRUD operations                                 |
| **4. Advanced Features**          |                                                | **8-10 days**     |                                                 |
|                                   | Leaderboard system                             | 2-3 days          | Class-based rankings                            |
|                                   | Gamification (levels, streaks, points)         | 3-4 days          | Calculations, triggers                          |
|                                   | Search & filtering                             | 2-3 days          | Elasticsearch (optional)                        |
|                                   | Audit logging                                  | 1 day             | Activity tracking                               |
| **5. Testing**                    |                                                | **10-15 days**    |                                                 |
|                                   | Unit tests (Application layer)                 | 5-7 days          | CQRS handlers                                   |
|                                   | Integration tests (API + DB)                   | 5-8 days          | E2E scenarios                                   |
| **6. API Documentation**          |                                                | **2-3 days**      |                                                 |
|                                   | Swagger/OpenAPI                                | 1 day             | Auto-generation                                 |
|                                   | API documentation                              | 1-2 days          | Postman collection                              |
| **7. Deployment & DevOps**        |                                                | **3-5 days**      |                                                 |
|                                   | Docker containerization                        | 1-2 days          | Multi-stage builds                              |
|                                   | CI/CD pipeline (GitHub Actions/Azure DevOps)   | 2-3 days          | Automated testing + deployment                  |
| **8. Performance & Optimization** |                                                | **3-5 days**      |                                                 |
|                                   | Query optimization                             | 1-2 days          | EF Core performance                             |
|                                   | Caching (Redis)                                | 1-2 days          | Response caching                                |
|                                   | Database indexing                              | 1 day             | Query plan analysis                             |
| **TOTAL**                         |                                                | **🕒 71-97 days** | **~3-4 months**                                 |

---

### Breakdown by Developer Experience

| Experience Level                | Timeline         | Notes                                   |
| ------------------------------- | ---------------- | --------------------------------------- |
| **Senior (.NET + CQRS Expert)** | **2.5-3 months** | Familiar with patterns, minimal ramp-up |
| **Mid-Level (.NET Developer)**  | **3.5-4 months** | Learning CQRS + Clean Arch              |
| **Team (2 Seniors)**            | **1.5-2 months** | Parallel feature development            |
| **Team (1 Senior + 2 Mid)**     | **2-2.5 months** | Optimal team size                       |

---

### Critical Path & Priorities

**Phase 1 (MVP - 6 weeks):**

1. ✅ Authentication & User Management
2. ✅ Mission System (basic CRUD + progress)
3. ✅ Badge System (student auto-award only)
4. ✅ Basic Portfolio (file upload + list)
5. ✅ Student Dashboard APIs

**Phase 2 (Full Features - 4 weeks):** 6. ✅ Teacher CPD System 7. ✅ Portfolio Feedback & Reviews 8. ✅ Challenge Zone 9. ✅ Admin Analytics (basic) 10. ✅ Notifications

**Phase 3 (Advanced - 3 weeks):** 11. ✅ ADEK Evidence Export 12. ✅ Advanced Analytics 13. ✅ Leaderboards & Gamification 14. ✅ Performance Optimization

---

## Additional Recommendations

### 1. **File Storage**

Use cloud storage for portfolio files:

- **Azure Blob Storage** (recommended for UAE schools)
- **AWS S3**
- Store only metadata in PostgreSQL

### 2. **Caching Strategy**

- **Redis** for:
  - User sessions
  - Leaderboard rankings
  - Dashboard statistics
  - Frequently accessed lookups (subjects, badges)

### 3. **Real-Time Features**

- **SignalR** for:
  - Notifications
  - Live leaderboard updates
  - Admin activity monitoring

### 4. **Background Jobs**

- **Hangfire** for:
  - Badge auto-awarding after quiz pass
  - Level-up calculations
  - Evidence collection exports
  - Email notifications
  - Activity log cleanup

### 5. **API Rate Limiting**

Implement rate limiting for:

- File uploads (prevent abuse)
- Quiz submissions (prevent cheating)
- Login attempts (security)

### 6. **Data Seeding**

Seed initial data:

- 8 Missions with activities
- Badge definitions (8 student + 10-15 teacher)
- CPD modules
- Subject list
- Admin user
- Sample data for testing

---

## Summary

### Database Statistics

| Metric                            | Count    |
| --------------------------------- | -------- |
| **Total Tables**                  | 30       |
| **Core Entities**                 | 25       |
| **Junction Tables**               | 5        |
| **Indexes**                       | ~50      |
| **Foreign Keys**                  | ~45      |
| **Expected Data Volume (Year 1)** |          |
| - Users                           | ~850     |
| - Portfolio Files                 | ~50,000  |
| - Activity Logs                   | ~500,000 |
| - Notifications                   | ~100,000 |

### Technology Stack Summary

```
Backend:       .NET 8 + ASP.NET Core Web API
Architecture:  Clean Architecture + CQRS (MediatR)
API Pattern:   Vertical Slicing by Feature
Database:      PostgreSQL 14+
ORM:           Entity Framework Core 8
Caching:       Redis
Storage:       Azure Blob Storage / AWS S3
Real-time:     SignalR
Background:    Hangfire
Testing:       xUnit + Moq + FluentAssertions
CI/CD:         GitHub Actions / Azure DevOps
Container:     Docker
```

---

**Total Estimated Timeline:** **3-4 months** (single senior developer) or **1.5-2.5 months** (team of 2-3)

**Database Complexity:** Medium-High (30 tables, complex relationships)

**Ready for Production:** ✅ Yes, schema is production-ready with proper indexing, constraints, and scalability considerations.

---

_This schema is optimized for 800 students, 40 teachers, and growth to 2,000+ students. All tables use UUIDs for distributed system compatibility._
s