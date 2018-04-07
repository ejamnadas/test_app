import { Role } from './Role';

export class User{
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    username: string;
    roles: Role[];

    constructor(){}
  }
  