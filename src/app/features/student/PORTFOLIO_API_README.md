## Student Portfolio API – Endpoints for `/student/portfolio/{subjectId}`

This README documents the **backend endpoints required for the Portfolio Hub and Subject Portfolio pages**:

- Portfolio Hub route: `/student/portfolio-hub`
- Subject Portfolio route: `/student/portfolio/{subjectId}`

The Angular services using these endpoints live in `StudentPortfolioService`.

---

### 1. GET `/Student/Portfolio/Overview`

- **Used by**: `PortfolioHubComponent`, `StudentHomeComponent` (via `StudentPortfolioService`)
- **Purpose**: Load a summary of all subject portfolios for the current student.
- **Request**
  - Method: `GET`
  - Auth: must identify the current student (e.g. from JWT).
- **Response body**

  ```json
  {
    "TotalFiles": 12,
    "TotalFeedback": 4,
    "TotalBadges": 3,
    "SubjectPortfolios": [
      {
        "SubjectId": "math",
        "SubjectName": "Math Hub",
        "SubjectIcon": "fas fa-calculator",
        "Files": [ /* PortfolioFileDto[] */ ],
        "Feedback": [ /* TeacherFeedbackDto[] */ ],
        "Reflections": [ /* ReflectionDto[] */ ],
        "Badges": [ /* PortfolioBadgeDto[] */ ],
        "Stats": {
          "FilesCount": 3,
          "LatestUploadDate": "2025-12-15T10:30:00Z",
          "FeedbackCount": 2,
          "BadgesCount": 1
        }
      }
    ],
    "RecentUploads": [ /* PortfolioFileDto[] (latest files across subjects) */ ]
  }
  ```

- **Notes**
  - `SubjectId` **must match** the value used in the route parameter `/student/portfolio/{subjectId}` (e.g. `"1449418564485251081"`).
  - The frontend derives per-subject tiles and quick stats from this object.

---

### 2. GET `/Student/Portfolio/Subject/{subjectId}`

- **Used by**: `SubjectPortfolioComponent` (via `StudentPortfolioService.loadSubjectPortfolio`)
- **Purpose**: Load the full portfolio for a single subject.
- **Request**
  - Method: `GET`
  - Route parameter: `subjectId: string`
- **Response body (`SubjectPortfolioDto`)**

  ```json
  {
    "SubjectId": "1449418564485251081",
    "SubjectName": "Math Hub",
    "SubjectIcon": "fas fa-calculator",
    "Files": [
      {
        "Id": "file-1",
        "FileName": "Homework.pdf",
        "FileType": "pdf",
        "FileSize": 123456,
        "UploadDate": "2025-12-15T10:30:00Z",
        "SubjectId": "1449418564485251081",
        "ThumbnailUrl": "https://.../thumb.png",
        "PreviewUrl": "https://.../preview.pdf",
        "DownloadUrl": "https://.../download.pdf"
      }
    ],
    "Feedback": [
      {
        "Id": "fb-1",
        "TeacherName": "Ms. Smith",
        "Date": "2025-12-14T09:00:00Z",
        "Comment": "Great work!",
        "RelatedFileId": "file-1"
      }
    ],
    "Reflections": [
      {
        "Id": "refl-1",
        "Content": "<p>Today I learned...</p>",
        "Date": "2025-12-15T11:00:00Z",
        "Prompt": "Weekly reflection",
        "SubjectId": "1449418564485251081",
        "AutoSaved": false
      }
    ],
    "Badges": [
      {
        "Id": "first-upload",
        "Name": "First Upload",
        "Description": "Upload your first portfolio file",
        "Icon": "fas fa-upload",
        "Color": "#22c55e",
        "EarnedDate": "2025-12-15T10:30:00Z",
        "RelatedWorkId": "file-1",
        "Category": "portfolio"
      }
    ],
    "Stats": {
      "FilesCount": 3,
      "LatestUploadDate": "2025-12-15T10:30:00Z",
      "FeedbackCount": 2,
      "BadgesCount": 1
    }
  }
  ```

---

### 3. POST `/Student/Portfolio/Upload`

- **Used by**: `SubjectPortfolioComponent.uploadFile`
- **Purpose**: Upload a new file into a subject portfolio.
- **Request**
  - Method: `POST`
  - Body: `multipart/form-data`
    - `SubjectId: string`
    - `File: File`
  - Max size: frontend validates to **50MB**.
  - Allowed extensions: `.pdf,.docx,.pptx,.jpg,.jpeg,.png,.mp4`
- **Response body (`PortfolioFileDto`)**

  ```json
  {
    "Id": "file-1",
    "FileName": "Homework.pdf",
    "FileType": "pdf",
    "FileSize": 123456,
    "UploadDate": "2025-12-15T10:30:00Z",
    "SubjectId": "1449418564485251081",
    "ThumbnailUrl": "https://.../thumb.png",
    "PreviewUrl": "https://.../preview.pdf",
    "DownloadUrl": "https://.../download.pdf"
  }
  ```

---

### 4. DELETE `/Student/Portfolio/File/{fileId}`

- **Used by**: `SubjectPortfolioComponent.deleteFile`
- **Purpose**: Remove a file from the subject portfolio.
- **Request**
  - Method: `DELETE`
  - Route parameter: `fileId: string`
- **Response**
  - 200/204 on success (empty body is fine).

Frontend then removes the file from local state and updates `FilesCount`.

---

### 5. POST `/Student/Portfolio/Reflection`

- **Used by**: `SubjectPortfolioComponent.saveReflection`
- **Purpose**: Create or update a reflection for a subject.
- **Request**
  - Method: `POST`
  - Body (JSON):

    ```json
    {
      "SubjectId": "1449418564485251081",
      "Content": "<p>Today I learned...</p>",
      "Prompt": "Weekly reflection"
    }
    ```

- **Response body (`ReflectionDto`)**

  ```json
  {
    "Id": "refl-1",
    "Content": "<p>Today I learned...</p>",
    "Date": "2025-12-15T11:00:00Z",
    "Prompt": "Weekly reflection",
    "SubjectId": "1449418564485251081",
    "AutoSaved": false
  }
  ```

Frontend will either replace the existing reflection (same `Prompt`) or append a new one.

---

### 6. Optional: Feedback Endpoint

There is a configured but currently unused endpoint:

- **GET `/Student/Portfolio/Feedback/{subjectId}`**
  - Could be used to fetch feedback separately if needed.

Currently, feedback is expected inside `SubjectPortfolioDto.Feedback`.

---

### Response Wrapping

The Angular `BaseHttpService` already knows how to unwrap a standard API envelope:

```json
{
  "IsSuccess": true,
  "Data": { /* one of the DTOs above */ },
  "Message": null,
  "ErrorCode": null
}
```

You can return either:

- The **wrapped form** above, or
- The **plain DTO** directly (e.g. just `SubjectPortfolioDto`).

Both are supported on the frontend as long as `IsSuccess` is `true` for wrapped responses.


