import { Schema } from 'mongoose';

export const DomainSchema = new Schema(
  {
    domainName: {
      type: Schema.Types.String,
      lowercase: true,
      required: true,
      index: true,
    },
    ownerName: {
      type: Schema.Types.String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true, autoIndex: true },
);
