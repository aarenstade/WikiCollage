import { User } from "firebase/auth";

export enum GlobalRoles {
  "view",
  "edit",
  "admin",
}

export interface FirebaseAuth {
  user: User | null;
  token: string | null;
}
