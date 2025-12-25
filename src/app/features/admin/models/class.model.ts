export interface Class {
  id: number;
  name: string;
  grade: number;
  teacherId?: number;
  teacherName?: string;
  studentCount: number;
  subjectIds: number[];
  createdAt: Date;
}

export interface CreateClassRequest {
  Name: string;
  Grade: number;
  TeacherId?: number;
}

export interface UpdateClassRequest {
  Name: string;
  Grade: number;
  TeacherId?: number;
}

export interface ClassApiResponse {
  Id: number;
  Name: string;
  Grade: number;
  TeacherId?: number;
  TeacherName?: string;
  StudentCount: number;
  SubjectIds: number[];
  CreatedAt: string;
}

