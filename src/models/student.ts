
export interface Student {
  id: number;
  name: string;
  grade: string;
  rollNumber: string;
  isPresent: boolean;
  avatar: string;
}

export const initialStudents: Student[] = [
  { id: 1, name: "Luu Duy Quang", grade: "5/1", rollNumber: "1001", isPresent: true, avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Le Hai Khoa", grade: "5/1", rollNumber: "1002", isPresent: true, avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Le Ngoc Thanh", grade: "5/1", rollNumber: "1003", isPresent: true, avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Ngo Nguyen Tan Quan", grade: "5/1", rollNumber: "1101", isPresent: true, avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Tran Van A", grade: "5/2", rollNumber: "2001", isPresent: true, avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 6, name: "Nguyen Van B", grade: "5/2", rollNumber: "2002", isPresent: true, avatar: "https://i.pravatar.cc/150?img=6" },
  { id: 7, name: "Pham Thi C", grade: "6/1", rollNumber: "3001", isPresent: true, avatar: "https://i.pravatar.cc/150?img=7" },
  { id: 8, name: "Hoang Van D", grade: "6/2", rollNumber: "4001", isPresent: true, avatar: "https://i.pravatar.cc/150?img=8" },
];
