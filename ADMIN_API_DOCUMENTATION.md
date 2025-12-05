# School Hub - Admin API Documentation

**Version:** 1.0  
**Last Updated:** 2025-12-05  
**Base URL:** `/api/v1`  
**Authentication:** JWT Bearer Token (Role: Admin)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Dashboard](#1-dashboard)
  - [User Management](#2-user-management)
  - [Badge Management](#3-badge-management)
  - [Activity Logs](#4-activity-logs)
  - [Portfolio Analytics](#5-portfolio-analytics)
  - [Teacher-Subject Analytics](#6-teacher-subject-analytics)
  - [CPD Management](#7-cpd-management)
  - [Reports](#8-reports)
  - [Evidence Collection](#9-evidence-collection)
  - [Announcements](#10-announcements)
  - [Weekly Challenges](#11-weekly-challenges)
  - [System Settings](#12-system-settings)
- [Common Response Formats](#common-response-formats)
- [Error Codes](#error-codes)

---

## Overview

This document specifies all API endpoints required for the **Admin Module** of the School Hub application. The frontend expects these endpoints to be implemented following RESTful conventions with JSON request/response bodies.

### Headers Required

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

### Pagination Standard

All list endpoints support pagination:

```json
{
  "PageIndex": 1,
  "PageSize": 50,
  "Records": 856,
  "Pages": 18,
  "Items": [...]
}
```

---

## Authentication

All admin endpoints require:

- Valid JWT token
- User role = `Admin` (RoleID = 3)

---

## API Endpoints

---

## 1. Dashboard

### GET `/Admin/AdminKpi`

**Description:** Get admin dashboard KPI statistics

**Frontend Route:** `/admin/dashboard`

**Response:**

```json
{
  "TotalUsers": 856,
  "BadgesEarned": 245,
  "ThisWeekActivity": 1250
}
```

**Response Type:**

```typescript
interface AdminKpiResponse {
  TotalUsers: number;
  BadgesEarned: number;
  ThisWeekActivity: number;
}
```

---

### GET `/Admin/Dashboard/Stats`

**Description:** Get detailed dashboard statistics

**Response:**

```json
{
  "stats": [
    {
      "title": "Total Users",
      "value": 856,
      "breakdown": "40 Teachers • 800 Students",
      "icon": "👥",
      "trend": "neutral"
    },
    {
      "title": "Badges Earned",
      "value": 245,
      "breakdown": "245 Total Badges",
      "comparison": "↑ 12 from last week",
      "icon": "🏆",
      "trend": "up"
    },
    {
      "title": "This Week Activity",
      "value": 1250,
      "breakdown": "Logins, Submissions, Completions",
      "icon": "📊",
      "trend": "up"
    }
  ],
  "pendingApprovals": 15
}
```

**Response Type:**

```typescript
interface StatsCard {
  title: string;
  value: string | number;
  breakdown?: string;
  comparison?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface DashboardStatsResponse {
  stats: StatsCard[];
  pendingApprovals: number;
}
```

---

## 2. User Management

### GET `/User/GetUsers`

**Description:** Get all users with pagination, filtering, and search

**Frontend Route:** `/admin/users`

**Query Parameters:**

| Parameter   | Type   | Required | Description                                    |
| ----------- | ------ | -------- | ---------------------------------------------- |
| `PageIndex` | int    | No       | Page number (default: 1)                       |
| `PageSize`  | int    | No       | Items per page (default: 50)                   |
| `Search`    | string | No       | Search by name or email                        |
| `Role`      | int    | No       | Filter by role (1=Student, 2=Teacher, 3=Admin) |
| `Status`    | string | No       | Filter by status ('Active', 'Inactive')        |

**Request Example:**

```http
GET /User/GetUsers?PageIndex=1&PageSize=50&Search=ahmed&Role=1
```

**Response:**

```json
{
  "PageSize": 50,
  "PageIndex": 1,
  "Records": 856,
  "Pages": 18,
  "Items": [
    {
      "ID": 1,
      "Name": "Ahmed Hassan",
      "Email": "ahmed.hassan@school.ae",
      "Role": 1,
      "IsActive": true,
      "CreatedAt": "2024-09-01T08:00:00Z",
      "PhoneNumber": "+971501234567"
    }
  ]
}
```

**Response Type:**

```typescript
interface UserApiResponse {
  ID: number;
  Name: string;
  Email: string;
  Role: number; // 1=Student, 2=Teacher, 3=Admin
  IsActive: boolean;
  CreatedAt: string; // ISO 8601 format
  PhoneNumber: string;
}

interface PaginatedResponse<T> {
  PageSize: number;
  PageIndex: number;
  Records: number;
  Pages: number;
  Items: T[];
}
```

---

### GET `/User/{id}`

**Description:** Get user by ID

**Response:**

```json
{
  "ID": 1,
  "Name": "Ahmed Hassan",
  "Email": "ahmed.hassan@school.ae",
  "Role": 1,
  "IsActive": true,
  "CreatedAt": "2024-09-01T08:00:00Z",
  "PhoneNumber": "+971501234567",
  "ClassId": 123,
  "ClassName": "6A",
  "BadgeCount": 5,
  "LastLogin": "2024-12-05T09:30:00Z"
}
```

---

### POST `/User/Register`

**Description:** Create new user

**Request Body:**

```json
{
  "Name": "Ahmed Hassan",
  "UserName": "ahmed.hassan@school.ae",
  "Email": "ahmed.hassan@school.ae",
  "Password": "SecurePass123!",
  "PhoneNumber": "+971501234567",
  "RoleID": 1
}
```

**Request Type:**

```typescript
interface CreateUserRequest {
  Name: string;
  UserName: string;
  Email: string;
  Password: string;
  PhoneNumber: string;
  RoleID: number; // 1=Student, 2=Teacher, 3=Admin
}
```

**Response:** (201 Created)

```json
{
  "ID": 857,
  "Name": "Ahmed Hassan",
  "Email": "ahmed.hassan@school.ae",
  "Role": 1,
  "IsActive": true,
  "CreatedAt": "2024-12-05T14:00:00Z",
  "PhoneNumber": "+971501234567"
}
```

---

### PUT `/User/{id}`

**Description:** Update existing user

**Request Body:**

```json
{
  "Name": "Ahmed Hassan Updated",
  "Email": "ahmed.new@school.ae",
  "RoleID": 1,
  "IsActive": true,
  "PhoneNumber": "+971501234568",
  "ClassId": 124
}
```

**Response:**

```json
{
  "ID": 1,
  "Name": "Ahmed Hassan Updated",
  "Email": "ahmed.new@school.ae",
  "Role": 1,
  "IsActive": true,
  "CreatedAt": "2024-09-01T08:00:00Z",
  "PhoneNumber": "+971501234568"
}
```

---

### DELETE `/User/{id}`

**Description:** Delete user

**Response:** (200 OK)

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### POST `/User/BulkImport`

**Description:** Bulk import users from CSV

**Request Body:**

```json
{
  "Users": [
    {
      "Name": "Student One",
      "Email": "student1@school.ae",
      "RoleID": 1,
      "ClassName": "6A"
    },
    {
      "Name": "Student Two",
      "Email": "student2@school.ae",
      "RoleID": 1,
      "ClassName": "6B"
    }
  ]
}
```

**Response:**

```json
{
  "success": 45,
  "failed": [
    {
      "row": 12,
      "name": "John Doe",
      "email": "john@school.ae",
      "error": "Email already exists"
    }
  ]
}
```

---

### GET `/User/Export`

**Description:** Export users to CSV

**Query Parameters:**

| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| `Role`    | int    | Filter by role   |
| `Status`  | string | Filter by status |

**Response:** CSV file download

---

## 3. Badge Management

### GET `/Admin/Badges`

**Description:** Get all badge definitions

**Response:**

```json
{
  "Items": [
    {
      "id": "badge-1",
      "name": "Eduaide Explorer",
      "category": "AI Tools",
      "icon": "🤖",
      "cpdHours": 2,
      "description": "Master Eduaide AI tool"
    }
  ]
}
```

**Response Type:**

```typescript
interface Badge {
  id: string;
  name: string;
  category: string;
  icon: string;
  cpdHours?: number;
  description: string;
}
```

---

### GET `/Admin/BadgeSubmissions`

**Description:** Get all badge submissions with filters

**Query Parameters:**

| Parameter   | Type   | Description                       |
| ----------- | ------ | --------------------------------- |
| `Status`    | string | 'Pending', 'Approved', 'Rejected' |
| `UserRole`  | int    | 1=Student, 2=Teacher              |
| `Category`  | string | Badge category                    |
| `DateFrom`  | date   | Start date (ISO 8601)             |
| `DateTo`    | date   | End date (ISO 8601)               |
| `PageIndex` | int    | Page number                       |
| `PageSize`  | int    | Items per page                    |

**Response:**

```json
{
  "PageIndex": 1,
  "PageSize": 50,
  "Records": 127,
  "Pages": 3,
  "Items": [
    {
      "id": "submission-1",
      "userId": "teacher-1",
      "userName": "Sarah Johnson",
      "userRole": 2,
      "userAvatar": "https://ui-avatars.com/api/?name=Sarah+Johnson",
      "badgeId": "badge-1",
      "badgeName": "Eduaide Explorer",
      "badgeIcon": "🤖",
      "badgeCategory": "AI Tools",
      "cpdHours": 2,
      "evidenceLink": "https://example.com/evidence/1",
      "submitterNotes": "Completed with excellent results",
      "submissionDate": "2024-12-01T10:30:00Z",
      "status": "Pending",
      "reviewedBy": null,
      "reviewDate": null,
      "reviewNotes": null
    }
  ]
}
```

**Response Type:**

```typescript
interface BadgeSubmission {
  id: string;
  userId: string;
  userName: string;
  userRole: number; // 1=Student, 2=Teacher
  userAvatar?: string;
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  badgeCategory: string;
  cpdHours?: number; // Only for teachers
  evidenceLink: string;
  submitterNotes?: string;
  submissionDate: string; // ISO 8601
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewDate?: string;
  reviewNotes?: string;
}
```

---

### GET `/Admin/BadgeSubmissions/Pending`

**Description:** Get only pending submissions

**Response:**

```json
{
  "Items": [...]
}
```

---

### POST `/Admin/BadgeSubmissions/{id}/Approve`

**Description:** Approve a badge submission

**Request Body:**

```json
{
  "reviewedBy": "admin-user-id",
  "reviewNotes": "Great work! Evidence is comprehensive."
}
```

**Response:**

```json
{
  "id": "submission-1",
  "status": "Approved",
  "reviewedBy": "admin-user-id",
  "reviewDate": "2024-12-05T14:30:00Z",
  "reviewNotes": "Great work! Evidence is comprehensive."
}
```

---

### POST `/Admin/BadgeSubmissions/{id}/Reject`

**Description:** Reject a badge submission

**Request Body:**

```json
{
  "reviewedBy": "admin-user-id",
  "reviewNotes": "Please provide more detailed evidence of completion."
}
```

**Response:**

```json
{
  "id": "submission-1",
  "status": "Rejected",
  "reviewedBy": "admin-user-id",
  "reviewDate": "2024-12-05T14:30:00Z",
  "reviewNotes": "Please provide more detailed evidence of completion."
}
```

---

### GET `/Admin/BadgeStatistics`

**Description:** Get badge statistics

**Response:**

```json
{
  "total": 127,
  "approved": 95,
  "rejected": 17,
  "pending": 15,
  "approvalRate": 75,
  "rejectionRate": 13,
  "byCategory": [
    { "category": "AI Tools", "count": 45 },
    { "category": "Microsoft 365", "count": 32 },
    { "category": "Digital Citizenship", "count": 28 }
  ]
}
```

---

## 4. Activity Logs

### GET `/Admin/ActivityLogs`

**Description:** Get recent activity logs

**Query Parameters:**

| Parameter   | Type   | Description                                        |
| ----------- | ------ | -------------------------------------------------- |
| `Type`      | string | 'Login', 'Badge', 'Upload', 'Completion', 'Update' |
| `UserId`    | string | Filter by user                                     |
| `DateFrom`  | date   | Start date                                         |
| `DateTo`    | date   | End date                                           |
| `PageIndex` | int    | Page number                                        |
| `PageSize`  | int    | Items per page (default: 10)                       |

**Response:**

```json
{
  "PageIndex": 1,
  "PageSize": 10,
  "Records": 500,
  "Pages": 50,
  "Items": [
    {
      "id": "activity-1",
      "timestamp": "2024-12-05T10:30:00Z",
      "userId": "teacher-5",
      "userName": "Teacher 5",
      "userAvatar": "https://ui-avatars.com/api/?name=Teacher+5",
      "action": "submitted badge",
      "type": "Badge",
      "details": "Submitted Eduaide Explorer badge"
    }
  ]
}
```

**Response Type:**

```typescript
interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  type: 'Login' | 'Badge' | 'Upload' | 'Completion' | 'Update';
  details?: string;
}
```

---

### GET `/Admin/ActivityLogs/TodayCount`

**Description:** Get today's activity count

**Response:**

```json
{
  "count": 125
}
```

---

### GET `/Admin/ActivityLogs/WeekCount`

**Description:** Get this week's activity count

**Response:**

```json
{
  "count": 1250
}
```

---

## 5. Portfolio Analytics

### GET `/Admin/Portfolio/CompletionStats`

**Description:** Get portfolio completion statistics

**Response:**

```json
{
  "totalStudents": 99,
  "activePortfolios": 78,
  "completionRate": 79,
  "byClass": [
    {
      "className": "Grade 6A",
      "grade": 6,
      "totalStudents": 25,
      "activePortfolios": 20,
      "completionRate": 80
    },
    {
      "className": "Grade 6B",
      "grade": 6,
      "totalStudents": 25,
      "activePortfolios": 15,
      "completionRate": 60
    }
  ],
  "bySubject": [
    {
      "subjectName": "English Language Arts",
      "totalSubmissions": 156,
      "activeStudents": 78,
      "recentActivity": 23
    },
    {
      "subjectName": "ICT",
      "totalSubmissions": 142,
      "activeStudents": 71,
      "recentActivity": 19
    }
  ],
  "recentUpdates": [
    {
      "studentId": "s001",
      "studentName": "Ahmed Hassan",
      "className": "Grade 7A",
      "subject": "English Language Arts",
      "updateType": "upload",
      "timestamp": "2024-12-05T08:30:00Z",
      "itemCount": 3
    }
  ]
}
```

**Response Types:**

```typescript
interface PortfolioCompletionStats {
  totalStudents: number;
  activePortfolios: number;
  completionRate: number;
  byClass: ClassPortfolioStats[];
  bySubject: SubjectPortfolioStats[];
  recentUpdates: PortfolioUpdate[];
}

interface ClassPortfolioStats {
  className: string;
  totalStudents: number;
  activePortfolios: number;
  completionRate: number;
  grade: number;
}

interface SubjectPortfolioStats {
  subjectName: string;
  totalSubmissions: number;
  activeStudents: number;
  recentActivity: number; // Activity in last 7 days
}

interface PortfolioUpdate {
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  updateType: 'upload' | 'reflection' | 'feedback';
  timestamp: string;
  itemCount: number;
}
```

---

### GET `/Admin/Portfolio/StatsByClass`

**Description:** Get portfolio statistics filtered by class

**Query Parameters:**

| Parameter   | Type   | Description                  |
| ----------- | ------ | ---------------------------- |
| `ClassName` | string | Class name filter (optional) |

**Response:**

```json
{
  "Items": [
    {
      "className": "Grade 6A",
      "grade": 6,
      "totalStudents": 25,
      "activePortfolios": 20,
      "completionRate": 80
    }
  ]
}
```

---

### GET `/Admin/Portfolio/StatsBySubject`

**Description:** Get portfolio statistics filtered by subject

**Query Parameters:**

| Parameter     | Type   | Description                    |
| ------------- | ------ | ------------------------------ |
| `SubjectName` | string | Subject name filter (optional) |

**Response:**

```json
{
  "Items": [
    {
      "subjectName": "English Language Arts",
      "totalSubmissions": 156,
      "activeStudents": 78,
      "recentActivity": 23
    }
  ]
}
```

---

### GET `/Admin/Portfolio/RecentUpdates`

**Description:** Get recent portfolio updates

**Query Parameters:**

| Parameter  | Type | Description                  |
| ---------- | ---- | ---------------------------- |
| `Limit`    | int  | Number of items (default: 5) |
| `DateFrom` | date | Start date filter            |
| `DateTo`   | date | End date filter              |

**Response:**

```json
{
  "Items": [
    {
      "studentId": "s001",
      "studentName": "Ahmed Hassan",
      "className": "Grade 7A",
      "subject": "English Language Arts",
      "updateType": "upload",
      "timestamp": "2024-12-05T08:30:00Z",
      "itemCount": 3
    }
  ]
}
```

---

## 6. Teacher-Subject Analytics

### GET `/Admin/TeacherSubjects/Matrix`

**Description:** Get teacher-subject assignment matrix

**Response:**

```json
{
  "Items": [
    {
      "teacherId": "t001",
      "teacherName": "Sarah Johnson",
      "email": "sarah.johnson@school.ae",
      "subjects": ["English Language Arts"],
      "grades": ["6", "7"],
      "cpdBadgesEarned": 8,
      "portfolioActivity": 45,
      "lastActive": "2024-12-05T12:30:00Z"
    }
  ]
}
```

**Response Type:**

```typescript
interface TeacherSubjectMatrix {
  teacherId: string;
  teacherName: string;
  email: string;
  subjects: string[];
  grades: string[];
  cpdBadgesEarned: number;
  portfolioActivity: number; // Portfolio items reviewed
  lastActive: string;
}
```

---

### GET `/Admin/TeacherSubjects/Analytics`

**Description:** Get analytics filtered by subject

**Query Parameters:**

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `Subject` | string | Subject name or 'All Subjects' |

**Response:**

```json
{
  "subject": "English Language Arts",
  "teacherCount": 2,
  "studentCount": 78,
  "portfolioCompletionRate": 85,
  "cpdBadgeCompletionRate": 53,
  "resourceUsage": {
    "totalResources": 45,
    "downloadsThisMonth": 128,
    "uploadsThisMonth": 23,
    "mostPopularResource": "Essay Writing Guide.pdf"
  },
  "topTeachers": [
    {
      "teacherName": "Sarah Johnson",
      "subject": "English Language Arts",
      "cpdBadges": 8,
      "studentEngagement": 67,
      "portfolioReviews": 45
    }
  ]
}
```

**Response Type:**

```typescript
interface SubjectAnalytics {
  subject: string;
  teacherCount: number;
  studentCount: number;
  portfolioCompletionRate: number;
  cpdBadgeCompletionRate: number;
  resourceUsage: ResourceUsageStats;
  topTeachers: TeacherPerformance[];
}

interface ResourceUsageStats {
  totalResources: number;
  downloadsThisMonth: number;
  uploadsThisMonth: number;
  mostPopularResource: string;
}

interface TeacherPerformance {
  teacherName: string;
  subject: string;
  cpdBadges: number;
  studentEngagement: number; // Percentage
  portfolioReviews: number;
}
```

---

### GET `/Admin/TeacherSubjects/BySubject`

**Description:** Get teachers filtered by subject

**Query Parameters:**

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `Subject` | string | Subject name or 'All Subjects' |

**Response:**

```json
{
  "Items": [
    {
      "teacherId": "t001",
      "teacherName": "Sarah Johnson",
      "email": "sarah.johnson@school.ae",
      "subjects": ["English Language Arts"],
      "grades": ["6", "7"],
      "cpdBadgesEarned": 8,
      "portfolioActivity": 45,
      "lastActive": "2024-12-05T12:30:00Z"
    }
  ]
}
```

---

## 7. CPD Management

### GET `/Admin/CPD/Statistics`

**Description:** Get CPD statistics for all teachers

**Response:**

```json
{
  "totalTeachers": 40,
  "activeTeachers": 32,
  "totalCPDHours": 245,
  "averageHoursPerTeacher": 6,
  "topPerformer": "Mohammed Al-Farsi",
  "topPerformerHours": 24
}
```

---

### GET `/Admin/CPD/TeacherProgress`

**Description:** Get CPD progress for all teachers

**Query Parameters:**

| Parameter       | Type   | Description                      |
| --------------- | ------ | -------------------------------- |
| `SortBy`        | string | 'cpdHours', 'badgeCount', 'name' |
| `SortDirection` | string | 'asc', 'desc'                    |
| `DateFrom`      | date   | Start date filter                |
| `DateTo`        | date   | End date filter                  |

**Response:**

```json
{
  "Items": [
    {
      "id": "t001",
      "name": "Sarah Johnson",
      "email": "sarah.johnson@school.ae",
      "badgeCount": 8,
      "cpdHours": 16,
      "lastBadgeDate": "2024-12-01T10:00:00Z",
      "categories": ["AI Tools", "Microsoft 365"]
    }
  ]
}
```

---

### GET `/Admin/CPD/ByMonth`

**Description:** Get CPD hours aggregated by month

**Response:**

```json
{
  "Items": [
    { "month": "Dec 2024", "hours": 24 },
    { "month": "Nov 2024", "hours": 32 },
    { "month": "Oct 2024", "hours": 28 }
  ]
}
```

---

### GET `/Admin/CPD/Categories`

**Description:** Get badge count by category

**Response:**

```json
{
  "Items": [
    { "category": "AI Tools", "count": 45 },
    { "category": "Microsoft 365", "count": 32 }
  ]
}
```

---

### GET `/Admin/CPD/Export`

**Description:** Export CPD data

**Query Parameters:**

| Parameter  | Type   | Description           |
| ---------- | ------ | --------------------- |
| `Format`   | string | 'csv', 'excel', 'pdf' |
| `DateFrom` | date   | Start date            |
| `DateTo`   | date   | End date              |

**Response:** File download

---

## 8. Reports

### GET `/Admin/Reports/Generate`

**Description:** Generate a report

**Query Parameters:**

| Parameter       | Type    | Description                                                                        |
| --------------- | ------- | ---------------------------------------------------------------------------------- |
| `ReportType`    | string  | 'cpd', 'student-engagement', 'resource-usage', 'badge-analytics', 'login-activity' |
| `DateFrom`      | date    | Start date                                                                         |
| `DateTo`        | date    | End date                                                                           |
| `UserType`      | string  | 'All', 'Teachers', 'Students'                                                      |
| `IncludeCharts` | boolean | Include chart data                                                                 |

**Response:**

```json
{
  "reportId": "report-12345",
  "reportType": "cpd",
  "generatedAt": "2024-12-05T14:00:00Z",
  "parameters": {
    "dateFrom": "2024-11-01",
    "dateTo": "2024-12-01",
    "userType": "Teachers",
    "includeCharts": true
  },
  "data": {
    // Report-specific data
  }
}
```

---

### GET `/Admin/Reports/Export`

**Description:** Export report to file

**Query Parameters:**

| Parameter    | Type   | Description    |
| ------------ | ------ | -------------- |
| `ReportType` | string | Report type    |
| `Format`     | string | 'excel', 'pdf' |

**Response:** File download

---

### POST `/Admin/Reports/Schedule`

**Description:** Schedule recurring report

**Request Body:**

```json
{
  "reportType": "cpd",
  "frequency": "weekly",
  "recipients": ["admin@school.ae"],
  "format": "pdf"
}
```

---

## 9. Evidence Collection

### GET `/Admin/Evidence/Stats`

**Description:** Get evidence collection statistics

**Response:**

```json
{
  "totalEvidenceItems": 1111,
  "thisMonth": 150,
  "byType": {
    "portfolios": 866,
    "cpd": 89,
    "badges": 156
  },
  "pendingReview": 12
}
```

**Response Type:**

```typescript
interface EvidenceCollectionStats {
  totalEvidenceItems: number;
  thisMonth: number;
  byType: {
    portfolios: number;
    cpd: number;
    badges: number;
  };
  pendingReview: number;
}
```

---

### POST `/Admin/Evidence/Export`

**Description:** Export evidence for ADEK compliance

**Request Body:**

```json
{
  "dateRange": {
    "start": "2024-11-01T00:00:00Z",
    "end": "2024-12-01T00:00:00Z"
  },
  "subjects": ["English Language Arts", "ICT"],
  "evidenceTypes": ["portfolios", "cpd", "badges"],
  "format": "zip"
}
```

**Request Type:**

```typescript
interface EvidenceExportRequest {
  dateRange: {
    start: string; // ISO 8601
    end: string; // ISO 8601
  };
  subjects: string[];
  evidenceTypes: ('portfolios' | 'cpd' | 'badges')[];
  format: 'zip' | 'pdf' | 'excel';
}
```

**Response:**

```json
{
  "exportId": "export-12345",
  "status": "processing",
  "downloadUrl": null,
  "estimatedCompletionTime": "2024-12-05T14:05:00Z"
}
```

---

### GET `/Admin/Evidence/Export/{exportId}`

**Description:** Get export status and download URL

**Response:**

```json
{
  "exportId": "export-12345",
  "status": "completed",
  "downloadUrl": "https://storage.school.ae/exports/export-12345.zip",
  "expiresAt": "2024-12-12T14:00:00Z"
}
```

---

## 10. Announcements

### GET `/Admin/Announcements`

**Description:** Get all announcements

**Response:**

```json
{
  "Items": [
    {
      "id": "ann-1",
      "title": "Welcome to New Semester",
      "content": "<p>Welcome back to school!</p>",
      "publishDate": "2024-09-01T08:00:00Z",
      "targetAudience": ["Student", "Teacher"],
      "priority": "Important",
      "viewCount": 850,
      "isPinned": true,
      "showAsPopup": false,
      "sendEmail": true
    }
  ]
}
```

---

### POST `/Admin/Announcements`

**Description:** Create new announcement

**Request Body:**

```json
{
  "title": "System Maintenance",
  "content": "<p>Scheduled maintenance on Saturday.</p>",
  "targetAudience": ["Student", "Teacher"],
  "priority": "Urgent",
  "isPinned": false,
  "showAsPopup": true,
  "sendEmail": true
}
```

---

### PUT `/Admin/Announcements/{id}`

**Description:** Update announcement

---

### DELETE `/Admin/Announcements/{id}`

**Description:** Delete announcement

---

## 11. Weekly Challenges

### GET `/Admin/WeeklyChallenges`

**Description:** Get all weekly challenges

**Response:**

```json
{
  "Items": [
    {
      "id": "wc-1",
      "weekNumber": 15,
      "title": "AI Tools Exploration",
      "description": "Explore Curipod and create an interactive lesson",
      "resourceLinks": ["https://curipod.com"],
      "tutorialVideo": "https://youtube.com/...",
      "submissionFormLink": "https://forms.office.com/...",
      "publishDate": "2024-12-02T00:00:00Z",
      "status": "Published",
      "autoNotify": true
    }
  ]
}
```

---

### POST `/Admin/WeeklyChallenges`

**Description:** Create new weekly challenge

**Request Body:**

```json
{
  "weekNumber": 16,
  "title": "Digital Citizenship Focus",
  "description": "Complete online safety training",
  "resourceLinks": ["https://example.com/safety"],
  "tutorialVideo": "https://youtube.com/...",
  "submissionFormLink": "https://forms.office.com/...",
  "status": "Draft",
  "autoNotify": true
}
```

---

### PUT `/Admin/WeeklyChallenges/{id}`

**Description:** Update weekly challenge

---

### POST `/Admin/WeeklyChallenges/{id}/Publish`

**Description:** Publish weekly challenge

---

## 12. System Settings

### GET `/Admin/Settings`

**Description:** Get all system settings

**Response:**

```json
{
  "schoolName": "Abu Dhabi School",
  "schoolLogo": "https://storage.school.ae/logo.png",
  "academicYear": "2024-2025",
  "adminEmail": "admin@school.ae",
  "supportEmail": "support@school.ae",
  "itSupport": "it@school.ae",
  "timezone": "Asia/Dubai",
  "badgeCategories": [
    { "id": "cat-1", "name": "AI Tools", "badgeCount": 8 },
    { "id": "cat-2", "name": "Microsoft 365", "badgeCount": 6 }
  ],
  "cpdTiers": [
    { "tier": 1, "name": "Bronze", "badgeRange": "1-5" },
    { "tier": 2, "name": "Silver", "badgeRange": "6-10" },
    { "tier": 3, "name": "Gold", "badgeRange": "11-15" }
  ],
  "missions": [
    { "id": "m-1", "name": "Digital Citizenship Foundations", "order": 1, "enabled": true }
  ],
  "notificationFrequency": {
    "badgeSubmissions": "Immediate",
    "activitySummary": "Daily"
  },
  "backupSettings": {
    "enabled": true,
    "frequency": "Daily",
    "time": "02:00",
    "lastBackup": "2024-12-05T02:00:00Z",
    "storageLocation": "Azure Blob Storage"
  }
}
```

---

### PUT `/Admin/Settings`

**Description:** Update system settings

**Request Body:** (partial update)

```json
{
  "schoolName": "Abu Dhabi School Updated",
  "academicYear": "2024-2025"
}
```

---

### GET `/Admin/SystemLogs`

**Description:** Get system logs

**Query Parameters:**

| Parameter   | Type   | Description                |
| ----------- | ------ | -------------------------- |
| `Level`     | string | 'Info', 'Warning', 'Error' |
| `DateFrom`  | date   | Start date                 |
| `DateTo`    | date   | End date                   |
| `PageIndex` | int    | Page number                |
| `PageSize`  | int    | Items per page             |

**Response:**

```json
{
  "Items": [
    {
      "id": "log-1",
      "timestamp": "2024-12-05T10:30:00Z",
      "level": "Error",
      "user": "system",
      "action": "Failed login attempt",
      "details": "Invalid credentials for user@school.ae",
      "ipAddress": "192.168.1.100",
      "stackTrace": null
    }
  ]
}
```

---

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 not found",
    "details": null
  }
}
```

### Paginated Response

```json
{
  "PageSize": 50,
  "PageIndex": 1,
  "Records": 856,
  "Pages": 18,
  "Items": [...]
}
```

---

## Error Codes

| Code                   | HTTP Status | Description                  |
| ---------------------- | ----------- | ---------------------------- |
| `UNAUTHORIZED`         | 401         | Missing or invalid JWT token |
| `FORBIDDEN`            | 403         | Admin role required          |
| `USER_NOT_FOUND`       | 404         | User not found               |
| `BADGE_NOT_FOUND`      | 404         | Badge not found              |
| `SUBMISSION_NOT_FOUND` | 404         | Badge submission not found   |
| `VALIDATION_ERROR`     | 400         | Invalid request data         |
| `DUPLICATE_EMAIL`      | 409         | Email already exists         |
| `DUPLICATE_USERNAME`   | 409         | Username already exists      |
| `INTERNAL_ERROR`       | 500         | Server error                 |

---

## Summary

### Endpoints Count by Category

| Category                  | Endpoints        |
| ------------------------- | ---------------- |
| Dashboard                 | 2                |
| User Management           | 6                |
| Badge Management          | 6                |
| Activity Logs             | 3                |
| Portfolio Analytics       | 4                |
| Teacher-Subject Analytics | 3                |
| CPD Management            | 5                |
| Reports                   | 3                |
| Evidence Collection       | 3                |
| Announcements             | 4                |
| Weekly Challenges         | 4                |
| System Settings           | 3                |
| **Total**                 | **46 endpoints** |

---

## Frontend Routes → API Mapping

| Frontend Route     | Primary API Endpoints                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `/admin/dashboard` | `GET /Admin/AdminKpi`, `GET /Admin/Portfolio/CompletionStats`, `GET /Admin/ActivityLogs` |
| `/admin/users`     | `GET /User/GetUsers`, `POST /User/Register`, `PUT /User/{id}`, `DELETE /User/{id}`       |
| `/admin/analytics` | `GET /Admin/Portfolio/CompletionStats`, `GET /Admin/TeacherSubjects/Analytics`           |
| `/admin/evidence`  | `GET /Admin/BadgeSubmissions`, `POST /Admin/Evidence/Export`                             |
| `/admin/cpd`       | `GET /Admin/CPD/Statistics`, `GET /Admin/CPD/TeacherProgress`                            |
| `/admin/reports`   | `GET /Admin/Reports/Generate`, `GET /Admin/Reports/Export`                               |

---

_This documentation is for the School Hub Admin API v1.0. For questions, contact the frontend team._
