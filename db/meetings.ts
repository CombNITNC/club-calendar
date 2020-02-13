import mongoose, { Schema, Model, Document, Connection } from 'mongoose';
import { MeetingKind } from '../lib';

export interface MeetingDocument extends Document {
  _id: string;
  name: string;
  kind: MeetingKind;
  date: number;
  expired: boolean;
}

const MeetingSchema = new Schema(
  {
    _id: String,
    name: String,
    kind: { type: String, match: /Regular|Others/ },
    date: Number,
    expired: Boolean,
  },
  { versionKey: false }
);

const uri = process.env.DB_HOST || 'mongodb://example.com';

let con: Connection | null = null;
let Meetings: Model<MeetingDocument> | null = null;

export const GetMeetings = (): Model<MeetingDocument> => {
  if (con == null) {
    console.log('connecting to DB ' + process.env.DB_HOST);
    con = mongoose.createConnection(uri, {
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
  }
  if (Meetings == null) {
    Meetings = con.model('Meetings', MeetingSchema);
  }
  return Meetings;
};
