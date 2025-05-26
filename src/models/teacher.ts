export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  avatar?: string;
  classInCharge: string; // e.g. "5/1"
  dateOfBirth?: string;
  password?: string;
}

export const initialTeachers: Teacher[] = [
  {
    id: 1,
    name: "Dr. Robert Smith",
    email: "robert.smith@school.edu",
    phone: "123-456-7890",
    gender: "male",
    avatar: "https://i.pravatar.cc/150?img=50",
    classInCharge: "5/1",
    dateOfBirth: "1980-05-15",
    password: "",
  },
  {
    id: 2,
    name: "Prof. Sarah Johnson",
    email: "sarah.johnson@school.edu",
    phone: "123-456-7891",
    gender: "female",
    avatar: "https://i.pravatar.cc/150?img=32",
    classInCharge: "5/2",
    dateOfBirth: "1985-08-20",
    password: "",
  },
  {
    id: 3,
    name: "Mr. David Wilson",
    email: "david.wilson@school.edu",
    phone: "123-456-7892",
    gender: "male",
    avatar: "https://i.pravatar.cc/150?img=54",
    classInCharge: "6/1",
    dateOfBirth: "1990-03-12",
    password: "",
  },
  {
    id: 4,
    name: "Mrs. Emily Brown",
    email: "emily.brown@school.edu",
    phone: "123-456-7893",
    gender: "female",
    avatar: "https://i.pravatar.cc/150?img=33",
    classInCharge: "6/2",
    dateOfBirth: "1988-11-25",
    password: "",
  },
  {
    id: 5,
    name: "Ms. Jessica Davis",
    email: "jessica.davis@school.edu",
    phone: "123-456-7894",
    gender: "female",
    avatar: "https://i.pravatar.cc/150?img=34",
    classInCharge: "5/1",
    dateOfBirth: "1992-07-17",
    password: "",
  },
  {
    id: 6,
    name: "Mr. James Wilson",
    email: "james.wilson@school.edu",
    phone: "123-456-7895",
    gender: "male",
    avatar: "https://i.pravatar.cc/150?img=55",
    classInCharge: "5/2",
    dateOfBirth: "1987-02-08",
    password: "",
  },
  {
    id: 7,
    name: "Dr. Amanda Martinez",
    email: "amanda.martinez@school.edu",
    phone: "123-456-7896",
    gender: "female",
    avatar: "https://i.pravatar.cc/150?img=35",
    classInCharge: "6/1",
    dateOfBirth: "1983-09-30",
    password: "",
  },
  {
    id: 8,
    name: "Mr. Thomas Clark",
    email: "thomas.clark@school.edu",
    phone: "123-456-7897",
    gender: "male",
    avatar: "https://i.pravatar.cc/150?img=56",
    classInCharge: "6/2",
    dateOfBirth: "1986-04-14",
    password: "",
  },
];
