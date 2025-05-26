export interface Student {
  id: number;
  name: string;
  grade: string;
  rollNumber: string;
  isPresent: boolean;
  avatar: string;
  gender: "male" | "female" | "other";
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  password?: string;
}

export const initialStudents: Student[] = [
  {
    id: 1,
    name: "Luu Duy Quang",
    grade: "5/1",
    rollNumber: "1001",
    isPresent: true,
    avatar: "https://i.pravatar.cc/150?img=1",
    gender: "male",
    email: "quang@school.edu",
    phoneNumber: "0901234567",
    dateOfBirth: "2010-05-15",
  },
  {
    id: 2,
    name: "Le Hai Khoa",
    grade: "5/1",
    rollNumber: "1002",
    isPresent: true,
    avatar: "https://i.pravatar.cc/150?img=2",
    gender: "male",
    email: "khoa@school.edu",
    phoneNumber: "0901234568",
    dateOfBirth: "2010-06-20",
  },
  {
    id: 3,
    name: "Le Ngoc Thanh",
    grade: "5/1",
    rollNumber: "1003",
    isPresent: true,
    avatar: "https://i.pravatar.cc/150?img=3",
    gender: "male",
    email: "thanh@school.edu",
    phoneNumber: "0901234569",
    dateOfBirth: "2010-07-10",
  },
  {
    id: 4,
    name: "Ngo Nguyen Tan Quan",
    grade: "5/1",
    rollNumber: "1101",
    isPresent: true,
    avatar: "https://i.pravatar.cc/150?img=4",
    gender: "male",
    email: "quan@school.edu",
    phoneNumber: "0901234570",
    dateOfBirth: "2010-08-05",
  },
  {
    id: 5,
    name: "Tran Van A",
    grade: "5/2",
    rollNumber: "2001",
    isPresent: true,
    avatar: "https://i.pravatar.cc/150?img=5",
    gender: "male",
    email: "a@school.edu",
    phoneNumber: "0901234571",
    dateOfBirth: "2010-09-12",
  },
  {
    id: 6,
    name: "Nguyen Van B",
    grade: "5/2",
    rollNumber: "2002",
    isPresent: true,
    avatar: "https://i.pravatar.cc/150?img=6",
    gender: "male",
    email: "b@school.edu",
    phoneNumber: "0901234572",
    dateOfBirth: "2010-10-25",
  },
  {
    id: 7,
    name: "Pham Thi C",
    grade: "6/1",
    rollNumber: "3001",
    isPresent: true,
    avatar: "https://i.pravatar.cc/150?img=7",
    gender: "female",
    email: "c@school.edu",
    phoneNumber: "0901234573",
    dateOfBirth: "2009-04-18",
  },
  {
    id: 8,
    name: "Hoang Van D",
    grade: "6/2",
    rollNumber: "4001",
    isPresent: true,
    avatar: "https://i.pravatar.cc/150?img=8",
    gender: "male",
    email: "d@school.edu",
    phoneNumber: "0901234574",
    dateOfBirth: "2009-03-22",
  },
];
