import { Record } from "ra-core";

export interface User extends Record {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  website?: string;
}
