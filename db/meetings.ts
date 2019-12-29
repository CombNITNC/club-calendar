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

console.log('connecting to DB ' + process.env.DB_HOST);
const con = mongoose.createConnection(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'meetings',
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
});
con.on('error', () => console.error('DB connection failure'));
con.once('open', () => {
  console.log('connected to DB ' + process.env.DB_HOST);
});
let Meetings: Model<MeetingDocument> | null = null;

export const GetMeetings = (): Model<MeetingDocument> => {
  if (Meetings == null) {
    Meetings = con.model('Meetings', MeetingSchema);
  }
  return Meetings;
};
