export interface UserType {
  user: {
    _id: string;
    name: string;
    email: string;
    gender: string;
    dob: string;
    role: { name: string; id: string };
    createdAt: string;
    updatedAt: string;
    location: string;
    age: string;
    preference: string;
  };
}
