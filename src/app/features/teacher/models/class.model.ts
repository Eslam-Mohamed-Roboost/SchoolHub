export interface TeacherClass {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
  subjects: ClassSubjectInfo[];
}

export interface ClassSubjectInfo {
  subjectId: string;
  subjectName: string;
}

export interface ClassStudent {
  id: string;
  name: string;
  email: string;
  classId: string;
  className: string;
  isActive: boolean;
  lastLogin?: Date;
}

