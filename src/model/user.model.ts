import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
    },
    email: {
      type: Schema.Types.String,
      lowercase: true,
    },
  },
  { timestamps: true },
);
