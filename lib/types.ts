// TODO: Connect to database (Supabase/Prisma)
// TODO: Add authentication check

export interface PflegeDocument {
  id: string;
  userId: string;
  filename: string;
  type: 'bescheid' | 'verordnung' | 'ausweis' | 'sonstiges';
  uploadedAt: Date;
  fileUrl: string;
}

// TODO: Connect to database (Supabase/Prisma)
// TODO: Add authentication check

export interface PflegeCase {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  documents: PflegeDocument[];
  deadlines: Deadline[];
}

// TODO: Connect to database (Supabase/Prisma)
// TODO: Add authentication check

export interface Deadline {
  id: string;
  caseId: string;
  title: string;
  dueDate: Date;
  type: 'widerspruch' | 'ablauf' | 'verlängerung' | 'wiedervorlage';
  reminded: boolean;
  reminderDate: Date;
}

// TODO: Connect to database (Supabase/Prisma)
// TODO: Add authentication check

export interface Reminder {
  id: string;
  deadlineId: string;
  userId: string;
  email: string;
  scheduledFor: Date;
  sent: boolean;
}

export interface WaitlistEntry {
  email: string;
  createdAt: Date;
}
