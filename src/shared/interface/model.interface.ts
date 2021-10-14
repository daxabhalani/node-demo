import { Document } from 'mongoose';

//User Model
export interface User extends Document {
  _doc: any;
  _id: string;
  name: string;
  email: string;
}

//Domain Model
export interface Domain extends Document {
  _doc: any;
  _id: string;
  domainName: string;
  ownerName: string;
  ownerId: string;
}
