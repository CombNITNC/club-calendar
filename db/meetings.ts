import mongoose, { Schema, Model, Document } from 'mongoose';
import { MeetingKind } from '../lib/meeting';

export interface MeetingDocument extends Document {
  _id: string;
  name: string;
  kind: MeetingKind;
  date: Date;
  expired: boolean;
}

const MeetingSchema = new Schema({
  _id: String,
  name: String,
  kind: { type: String, match: /Regular|Others/ },
  date: Date,
  expired: Boolean,
});

const uri = process.env.DB_HOST || 'mongodb://example.com';

const con = mongoose.createConnection(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
con.on('error', () => console.error('connection failure'));
con.once('open', () => {
  console.log('Connecting to DB ...');
});

export const Meetings: Model<MeetingDocument> = mongoose.model(
  'Meetings',
  MeetingSchema
);
