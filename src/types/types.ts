import { Gender, SubjectCategory, SubjectType, UserRole } from "@prisma/client";
import { Request, Response } from "express";
export interface TypedRequestBody<T> extends Request {
  body: T;
}

export type ContactProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  schoolName: string;
  country: string;
  schoolPage: string;
  numberOfStudents: number;
  role: string;
  media: string;
  pointsToSolve: string;
};

export type UserCreateProps = {  
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phone?: string;
  image?: string;
  schoolId?: string;
  schoolName?: string;
};

export type UserLoginProps = {
  email: string;
  password: string;
};

export type ClassCreateProps = {
  title: string;
  slug: string;
};

export type DepartmentCreateProps = {
  name: string;
  slug: string;
};

export type SubjectCreateProps = {
  name: string;
  slug: string;
  code: string;
  shortName: string;
  category: SubjectCategory;
  type: SubjectType;
  departmentId: string;
  departmentName: string;
  passingMarks: number;
  totalMarks: number;
};

export type StreamCreateProps = {
  title: string;
  slug: string;
  classId: string;
};

export interface ParentCreateProps {
  title: string;
  firstName: string;
  lastName: string;
  relationship: string;
  email: string;
  nationalId: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  nationality: string;
  whatsappNumber?: string;
  contactMethod: string;
  occupation: string;
  address: string;
  password: string;
  imageUrl?: string;
};

export type StudentCreateProps = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  parentId: string;
  classId: string;
  parentName?: string;
  classTitle?: string;
  streamId: string;
  streamTitle?: string;
  password: string;
  imageUrl: string;
  phone: string;
  state: string;
  birthCertificateNumber: string;
  nationality: string;
  religion: string;
  gender: string;
  dateOfBirth: string;
  rollNumber: string;
  sponsorshipType: "PS" | "SS";
  regNo: string;
  admissionDate: string;
  address: string;
};

export type TeacherCreateProps = {
  title: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  nationality: string;
  nationalId: string;
  gender: Gender;
  dateOfBirth: string;
  contactMethod: string;
  password: string;
  dateOfJoining: string;
  designation: string;
  departmentId: string;
  departmentName: string;
  qualification: string;
  mainSubject: string;
  mainSubjectId: string;
  subjects: string[];
  subjectIds: string[];
  classIds: string[];
  classes: string[];
  experience: number;
  occupation: string;
  address: string;
  imageUrl: string;
};