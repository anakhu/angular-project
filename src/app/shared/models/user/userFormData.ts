import { User } from './user';

export interface UserFormData {
  email: string;
  password: string;
  userData: Partial<User>;
}
