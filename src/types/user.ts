export interface UserInterface {
  id: string;
  username?: string;
  avatar?: string;
  email?: string;

  [key: string]: unknown;
}
