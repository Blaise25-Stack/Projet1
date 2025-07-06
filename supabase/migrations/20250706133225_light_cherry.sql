/*
  # Création du schéma complet pour l'école numérique

  1. Nouvelles tables
    - `users` - Utilisateurs du système (admin, professeurs, parents)
    - `students` - Élèves
    - `classes` - Classes scolaires
    - `subjects` - Matières
    - `grades` - Notes des élèves
    - `payments` - Paiements
    - `staff` - Personnel enseignant
    - `inventory` - Inventaire de l'école
    - `news` - Actualités
    - `events` - Événements
    - `homework` - Devoirs
    - `online_registrations` - Inscriptions en ligne
    - `rooms` - Salles de classe
    - `room_schedules` - Planning des salles
    - `attendance` - Présences
    - `messages` - Messages
    - `parent_notifications` - Notifications pour parents

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques d'accès par rôle
    - Contraintes d'intégrité

  3. Performance
    - Index sur les colonnes fréquemment utilisées
    - Contraintes de validation
*/

-- Enable RLS
ALTER DATABASE postgres SET row_security = on;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'parent')),
  name text NOT NULL,
  email text,
  phone text,
  profile_photo text,
  assigned_classes text[],
  children_ids text[],
  permissions text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('M', 'F')),
  class_id uuid REFERENCES classes(id),
  parent_name text NOT NULL,
  parent_phone text NOT NULL,
  parent_email text,
  address text NOT NULL,
  enrollment_date date DEFAULT CURRENT_DATE,
  profile_photo text,
  student_number text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  medical_info text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level text NOT NULL,
  teacher_id uuid REFERENCES users(id),
  academic_year text NOT NULL DEFAULT '2024-2025',
  subjects text[],
  max_students integer DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  coefficient integer DEFAULT 1,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id),
  class_id uuid NOT NULL REFERENCES classes(id),
  value numeric NOT NULL,
  max_value numeric NOT NULL DEFAULT 20,
  type text NOT NULL CHECK (type IN ('devoir', 'composition', 'examen')),
  date date NOT NULL,
  term text NOT NULL CHECK (term IN ('trimestre1', 'trimestre2', 'trimestre3')),
  teacher_id uuid NOT NULL REFERENCES users(id),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('inscription', 'scolarite', 'cantine', 'transport', 'autre')),
  description text NOT NULL,
  date date NOT NULL,
  method text NOT NULL CHECK (method IN ('especes', 'cheque', 'virement', 'mobile')),
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  receipt_number text UNIQUE NOT NULL,
  academic_year text NOT NULL,
  due_date date,
  paid_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  profile_photo text,
  position text NOT NULL,
  department text NOT NULL,
  education text NOT NULL,
  experience text NOT NULL,
  hire_date date NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  observations text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  condition text NOT NULL CHECK (condition IN ('excellent', 'bon', 'moyen', 'mauvais')),
  location text NOT NULL,
  purchase_date date,
  value numeric,
  observations text,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('news', 'event', 'announcement')),
  date timestamptz DEFAULT now(),
  publish_date date NOT NULL,
  author_id uuid NOT NULL REFERENCES users(id),
  is_published boolean DEFAULT true,
  image_url text,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  location text NOT NULL,
  type text NOT NULL CHECK (type IN ('exam', 'holiday', 'cultural', 'meeting', 'other')),
  is_public boolean DEFAULT true,
  created_by uuid NOT NULL REFERENCES users(id),
  participants text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Homework table
CREATE TABLE IF NOT EXISTS homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  subject_id uuid NOT NULL REFERENCES subjects(id),
  class_id uuid NOT NULL REFERENCES classes(id),
  teacher_id uuid NOT NULL REFERENCES users(id),
  due_date date NOT NULL,
  attachments text[],
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Online registrations table
CREATE TABLE IF NOT EXISTS online_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('M', 'F')),
  parent_name text NOT NULL,
  parent_phone text NOT NULL,
  parent_email text NOT NULL,
  address text NOT NULL,
  desired_class uuid REFERENCES classes(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submission_date timestamptz DEFAULT now(),
  documents text[],
  notes text,
  profile_photo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity integer NOT NULL,
  type text NOT NULL CHECK (type IN ('classroom', 'lab', 'library', 'gym', 'office')),
  equipment text[],
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Room schedules table
CREATE TABLE IF NOT EXISTS room_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id),
  subject_id uuid NOT NULL REFERENCES subjects(id),
  teacher_id uuid NOT NULL REFERENCES users(id),
  day text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  academic_year text NOT NULL DEFAULT '2024-2025',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id),
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  reason text,
  recorded_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  sender_phone text,
  subject text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('contact', 'account_creation', 'general')),
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  replied_at timestamptz,
  reply text,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  recipient_id uuid REFERENCES users(id),
  parent_message_id uuid REFERENCES messages(id),
  is_from_admin boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Parent notifications table
CREATE TABLE IF NOT EXISTS parent_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('message_reply', 'general', 'urgent')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_notifications ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_student_number ON students(student_number);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_subject_id ON grades(subject_id);
CREATE INDEX IF NOT EXISTS idx_grades_date ON grades(date);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Admins can manage users" ON users
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Students policies
CREATE POLICY "Students viewable by authorized users" ON students
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin') OR
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'teacher') OR
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'parent' AND id::text = ANY(children_ids))
  );

CREATE POLICY "Admins can manage students" ON students
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Classes policies
CREATE POLICY "Classes viewable by all authenticated users" ON classes
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage classes" ON classes
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Subjects policies
CREATE POLICY "Subjects viewable by all authenticated users" ON subjects
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage subjects" ON subjects
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Grades policies
CREATE POLICY "Grades viewable by authorized users" ON grades
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin') OR
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'teacher') OR
    EXISTS (
      SELECT 1 FROM users u 
      JOIN students s ON s.id = student_id 
      WHERE u.id::text = auth.uid()::text AND u.role = 'parent' AND s.id::text = ANY(u.children_ids)
    )
  );

CREATE POLICY "Teachers and admins can manage grades" ON grades
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('admin', 'teacher'))
  );

-- Add similar policies for other tables...

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homework_updated_at BEFORE UPDATE ON homework FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_online_registrations_updated_at BEFORE UPDATE ON online_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_schedules_updated_at BEFORE UPDATE ON room_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parent_notifications_updated_at BEFORE UPDATE ON parent_notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();