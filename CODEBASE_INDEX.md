# School Hub Codebase Index

**Generated:** 2025-12-05  
**Project:** School Hub - Digital Citizenship Learning Platform  
**Framework:** Angular v21  
**Language:** TypeScript

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Architecture](#core-architecture)
- [Features](#features)
- [Shared Components](#shared-components)
- [Routing](#routing)
- [Key Files](#key-files)

---

## Project Overview

School Hub is a comprehensive digital citizenship learning platform designed for 800 Grade 6-7 students. The platform provides:

- **8 Digital Citizenship Missions** with badge rewards
- **Interactive learning activities** (videos, quizzes, games, OneNote integration)
- **Gamification elements** (levels, badges, challenges, streaks)
- **Multi-role system** (Students, Teachers, Admins)
- **Portfolio management** for tracking student progress
- **CPD (Continuous Professional Development)** for teachers

---

## Tech Stack

### Core Dependencies

- **Angular:** v21.0.0 (latest standalone components)
- **TypeScript:** v5.9.2
- **RxJS:** v7.8.0
- **TailwindCSS:** v4.1.12
- **Quill:** v2.0.3 (Rich text editor)

### Dev Tools

- **Angular CLI:** v21.0.1
- **Vitest:** v4.0.8 (Testing)
- **Prettier:** Code formatting
- **PostCSS:** CSS processing

---

## Project Structure

```
School_Hub/
├── src/
│   ├── app/
│   │   ├── core/               # Core application functionality
│   │   ├── features/           # Feature modules (admin, auth, student, teacher)
│   │   ├── shared/             # Shared components and utilities
│   │   ├── config/             # Configuration files
│   │   ├── app.component.ts    # Root component
│   │   ├── app.routes.ts       # Route configuration
│   │   └── app.html            # Main template
│   ├── index.html              # Entry HTML
│   ├── main.ts                 # Bootstrap file
│   └── styles.css              # Global styles (4917 bytes)
├── public/                     # Static assets
├── .angular/                   # Angular build cache
├── dist/                       # Build output
├── README.md                   # Detailed student features documentation
├── AGENTS.md                   # AI agent instructions
├── package.json                # Dependencies
├── angular.json                # Angular workspace config
├── tailwind.config.js          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Core Architecture

### `/src/app/core/` (8 files)

The core module contains application-wide functionality that is used across all features.

#### Configuration

- [`core.config.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/core/core.config.ts) - Core application configuration

#### Enums

- [`enums/application-role.enum.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/core/enums/application-role.enum.ts) - User role definitions (Student, Teacher, Admin)

#### Guards

- [`guards/auth.guard.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/core/guards/auth.guard.ts) - Authentication protection
- [`guards/role.guard.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/core/guards/role.guard.ts) - Role-based access control

#### Interceptors

- [`interceptors/auth.interceptor.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/core/interceptors/auth.interceptor.ts) - HTTP authentication
- [`interceptors/error.interceptor.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/core/interceptors/error.interceptor.ts) - Global error handling

#### Layouts

- [`layouts/main-layout.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/core/layouts/main-layout.component.ts) - Main application layout wrapper

#### Services

- [`services/base-http.service.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/core/services/base-http.service.ts) - Base HTTP client service

---

## Features

### 1. Authentication (`/features/auth/`)

**Purpose:** User authentication and login management

#### Pages (1)

- [`pages/login/login-page.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/auth/pages/login/login-page.component.ts) - Login page

#### Services (1)

- [`services/auth.service.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/auth/services/auth.service.ts) - Authentication logic

#### Models (1)

- [`models/login.model.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/auth/models/login.model.ts) - Login data types

#### Store

- `store/` - Authentication state management

---

### 2. Student Portal (`/features/student/`)

**Purpose:** Student learning interface with missions, badges, and portfolio

#### Pages (12)

- [`student-home.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/student-home/student-home.component.ts) - Student home page
- [`student-dashboard.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/student-dashboard/student-dashboard.component.ts) - Main dashboard
- [`student-missions.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/student-missions/student-missions.component.ts) - Mission overview
- [`mission-detail.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/mission-detail/mission-detail.component.ts) - Individual mission view
- [`student-badges.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/student-badges/student-badges.component.ts) - Badge collection
- [`student-progress.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/student-progress/student-progress.component.ts) - Progress tracking
- [`challenge-zone.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/challenge-zone/challenge-zone.component.ts) - Challenges and games
- [`student-notebook.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/student-notebook/student-notebook.component.ts) - OneNote integration
- [`student-help.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/student-help/student-help.component.ts) - Help center
- [`student-digital-citizenship.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/student-digital-citizenship/student-digital-citizenship.component.ts) - Digital citizenship content
- [`portfolio-hub.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/portfolio-hub/portfolio-hub.component.ts) - Portfolio overview
- [`subject-portfolio.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/pages/subject-portfolio/subject-portfolio.component.ts) - Subject-specific portfolio

#### Services (1)

- [`services/student-portfolio.service.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/services/student-portfolio.service.ts) - Student portfolio data

#### Models (1)

- [`models/student-portfolio.model.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/models/student-portfolio.model.ts) - Portfolio types

#### Layouts (2)

- `layouts/student-layout/` - Student-specific layout
- [`layouts/student-layout.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/student/layouts/student-layout.component.ts) - Layout component

#### Components

- `components/` - Student-specific reusable components

---

### 3. Teacher Portal (`/features/teacher/`)

**Purpose:** Teacher dashboard, portfolio monitoring, CPD tracking

#### Pages (8)

- [`teacher-home.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/pages/teacher-home/teacher-home.component.ts) - Teacher home
- [`teacher-dashboard.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/pages/teacher-dashboard/teacher-dashboard.component.ts) - Main dashboard
- [`teacher-hub.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/pages/teacher-hub/teacher-hub.component.ts) - Teacher hub
- [`portfolio-detail.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/pages/portfolio-detail/portfolio-detail.component.ts) - Student portfolio details
- [`subject-portal.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/pages/subject-portal/subject-portal.component.ts) - Subject-specific portal
- [`teacher-cpd.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/pages/teacher-cpd/teacher-cpd.component.ts) - CPD tracking
- [`learning-vault.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/pages/learning-vault/learning-vault.component.ts) - Learning resources
- [`teachers-lounge.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/pages/teachers-lounge/teachers-lounge.component.ts) - Teacher collaboration

#### Services (2)

- [`services/portfolio.service.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/services/portfolio.service.ts) - Portfolio management
- [`services/cpd.service.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/services/cpd.service.ts) - CPD data

#### Models (2)

- [`models/portfolio.model.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/models/portfolio.model.ts) - Portfolio types
- [`models/cpd.model.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/models/cpd.model.ts) - CPD types

#### Layouts (1)

- [`layouts/teacher-layout.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/teacher/layouts/teacher-layout.component.ts) - Teacher layout

---

### 4. Admin Portal (`/features/admin/`)

**Purpose:** System administration, analytics, user management, ADEK reporting

#### Pages (6)

- [`admin-dashboard.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/pages/admin-dashboard/admin-dashboard.component.ts) - Admin dashboard
- [`admin-analytics.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/pages/admin-analytics/admin-analytics.component.ts) - Analytics and reporting
- [`admin-users.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/pages/admin-users/admin-users.component.ts) - User management
- [`admin-reports.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/pages/admin-reports/admin-reports.component.ts) - Report generation
- [`admin-evidence.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/pages/admin-evidence/admin-evidence.component.ts) - Evidence collection
- [`admin-cpd.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/pages/admin-cpd/admin-cpd.component.ts) - CPD overview

#### Services (6)

- [`services/dashboard.service.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/services/dashboard.service.ts) - Dashboard data
- [`services/user.service.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/services/user.service.ts) - User management
- [`services/activity.service.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/services/activity.service.ts) - Activity tracking
- [`services/badge.service.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/services/badge.service.ts) - Badge management
- [`services/admin-portfolio-analytics.service.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/services/admin-portfolio-analytics.service.ts) - Portfolio analytics
- [`services/teacher-subject-analytics.service.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/services/teacher-subject-analytics.service.ts) - Teacher analytics

#### Models (1)

- [`models/admin-analytics.model.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/models/admin-analytics.model.ts) - Analytics types

#### Layouts (1)

- [`layouts/admin-layout.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/features/admin/layouts/admin-layout.component.ts) - Admin layout

#### Components

- `components/` - Admin-specific components

---

## Shared Components

### `/src/app/shared/`

Reusable components, UI elements, and utilities used across all features.

#### Components (3)

- [`components/app-header/app-header.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/shared/components/app-header/app-header.component.ts) - Application header
- [`components/profile-view/profile-view.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/shared/components/profile-view/profile-view.component.ts) - User profile display
- [`components/role-switcher/role-switcher.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/shared/components/role-switcher/role-switcher.component.ts) - Role switching UI

#### UI Components (8)

- [`ui/button/button.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/shared/ui/button/button.component.ts) - Reusable button
- [`ui/card/card.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/shared/ui/card/card.component.ts) - Card container
- [`ui/input/input.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/shared/ui/input/input.component.ts) - Form input
- [`ui/modal/modal.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/shared/ui/modal/modal.component.ts) - Modal dialog
- [`ui/progress-card/progress-card.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/shared/ui/progress-card/progress-card.component.ts) - Progress display
- [`ui/stat-card/stat-card.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/shared/ui/stat-card/stat-card.component.ts) - Statistics card
- [`ui/leaderboard/leaderboard.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/shared/ui/leaderboard/leaderboard.component.ts) - Leaderboard display
- [`ui/rich-text-editor/rich-text-editor.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/shared/ui/rich-text-editor/rich-text-editor.component.ts) - Quill editor wrapper

---

## Routing

### [`app.routes.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/app.routes.ts)

Main routing configuration with role-based guards and lazy loading.

**Route Structure:**

```
/
├── login           → AuthGuard
├── student/        → RoleGuard (Student)
│   ├── home
│   ├── dashboard
│   ├── missions
│   ├── badges
│   ├── progress
│   ├── challenge-zone
│   ├── notebook
│   └── help
├── teacher/        → RoleGuard (Teacher)
│   ├── home
│   ├── dashboard
│   ├── hub
│   ├── portfolio/:id
│   └── cpd
└── admin/          → RoleGuard (Admin)
    ├── dashboard
    ├── analytics
    ├── users
    ├── reports
    └── evidence
```

---

## Configuration

### `/src/app/config/`

Application-specific configuration modules.

- `AdminConfig/` - Admin portal settings
- `AuthConfig/` - Authentication configuration
- `UserConfig/` - User-related settings

---

## Key Files

### Root Files

- [`app.component.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/app.component.ts) - Root application component
- [`app.html`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/app.html) - Main application template (20KB)
- [`app.routes.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/app/app.routes.ts) - Route definitions

### Entry Points

- [`main.ts`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/main.ts) - Application bootstrap
- [`index.html`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/index.html) - HTML entry point

### Styles

- [`styles.css`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/src/styles.css) - Global styles (4.9KB)
- [`tailwind.config.js`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/tailwind.config.js) - Tailwind customization

### Configuration

- [`package.json`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/package.json) - Dependencies and scripts
- [`angular.json`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/angular.json) - Angular workspace config
- [`tsconfig.json`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/tsconfig.json) - TypeScript configuration

### Documentation

- [`README.md`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/README.md) - Student features specification (14KB)
- [`AGENTS.md`](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/AGENTS.md) - AI agent instructions

---

## Statistics

- **Total Components:** 44
- **Total Services:** 11
- **Total Models:** 5
- **Total Guards:** 2
- **Total Interceptors:** 2
- **Total Layouts:** 4 (Main, Student, Teacher, Admin)

---

## 8 Digital Citizenship Missions

1. **Digital Citizenship Foundations** → Digital Citizen Badge
2. **Your Digital Footprint** → Footprint Tracker Badge
3. **Online Safety & Privacy** → Safety Shield Badge
4. **Cyberbullying Prevention** → Kindness Champion Badge
5. **Media Literacy & Fake News** → Truth Seeker Badge
6. **Digital Communication** → Communication Pro Badge
7. **Balanced Technology Use** → Balance Master Badge
8. **Digital Rights & Responsibilities** → Digital Leader Badge

---

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Watch mode
npm run watch
```

---

## Notes

- **Angular Version:** v21 (uses standalone components by default)
- **No NgModules:** All components are standalone
- **State Management:** Signals for reactive state
- **Routing:** Lazy-loaded feature modules with guards
- **Styling:** TailwindCSS v4 + custom CSS
- **Testing:** Vitest (modern alternative to Karma/Jasmine)
- **Target Users:** 800 Grade 6-7 students

---

_This index was automatically generated. For detailed feature specifications, see [README.md](file:///home/eslam/Downloads/School-Hub-v2/School_Hub/README.md)._
