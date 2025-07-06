/*
  # Insertion des données par défaut

  1. Données de base
    - Utilisateurs par défaut (admin, professeur, parent)
    - Matières standard
    - Classes de base
    - Élèves d'exemple
    - Données de démonstration

  2. Configuration
    - Permissions par défaut
    - Paramètres système
*/

-- Insert default users
INSERT INTO users (id, username, password, role, name, email, phone, is_active, permissions) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin', 'admin123', 'admin', 'Administrateur Principal', 'admin@ecole-numerique.ci', '+225 01 23 45 67 89', true, ARRAY['*']),
  ('550e8400-e29b-41d4-a716-446655440002', 'prof1', 'prof123', 'teacher', 'Marie Dupont', 'marie.dupont@ecole-numerique.ci', '+225 07 89 12 34 56', true, ARRAY['students.view', 'grades.manage', 'attendance.manage']),
  ('550e8400-e29b-41d4-a716-446655440003', 'parent1', 'parent123', 'parent', 'Pierre Martin', 'pierre.martin@email.com', '+225 05 98 76 54 32', true, ARRAY['students.view', 'grades.view', 'attendance.view'])
ON CONFLICT (id) DO NOTHING;

-- Insert default subjects
INSERT INTO subjects (id, name, code, coefficient) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'Français', 'FR', 4),
  ('550e8400-e29b-41d4-a716-446655440012', 'Mathématiques', 'MATH', 4),
  ('550e8400-e29b-41d4-a716-446655440013', 'Sciences', 'SCI', 3),
  ('550e8400-e29b-41d4-a716-446655440014', 'Histoire-Géographie', 'HG', 3),
  ('550e8400-e29b-41d4-a716-446655440015', 'Anglais', 'ANG', 2),
  ('550e8400-e29b-41d4-a716-446655440016', 'Éducation Physique', 'EPS', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert default classes
INSERT INTO classes (id, name, level, teacher_id, academic_year, subjects, max_students) VALUES
  ('550e8400-e29b-41d4-a716-446655440021', 'CM2 A', 'CM2', '550e8400-e29b-41d4-a716-446655440002', '2024-2025', ARRAY['550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440013'], 30),
  ('550e8400-e29b-41d4-a716-446655440022', 'CM1 B', 'CM1', '550e8400-e29b-41d4-a716-446655440002', '2024-2025', ARRAY['550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440013'], 28)
ON CONFLICT (id) DO NOTHING;

-- Update teacher assigned classes
UPDATE users SET assigned_classes = ARRAY['550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440022'] 
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- Insert default students
INSERT INTO students (id, first_name, last_name, date_of_birth, gender, class_id, parent_name, parent_phone, parent_email, address, student_number, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440031', 'Jean', 'Martin', '2012-05-15', 'M', '550e8400-e29b-41d4-a716-446655440021', 'Pierre Martin', '+225 05 98 76 54 32', 'pierre.martin@email.com', 'Village de Kourou, Abidjan', 'STU2024001', true),
  ('550e8400-e29b-41d4-a716-446655440032', 'Fatou', 'Diallo', '2012-08-22', 'F', '550e8400-e29b-41d4-a716-446655440021', 'Amadou Diallo', '+225 07 12 34 56 78', 'amadou.diallo@email.com', 'Quartier Centre, Abidjan', 'STU2024002', true),
  ('550e8400-e29b-41d4-a716-446655440033', 'Kouadio', 'Yao', '2013-03-10', 'M', '550e8400-e29b-41d4-a716-446655440022', 'Marie Yao', '+225 01 98 76 54 32', 'marie.yao@email.com', 'Plateau, Abidjan', 'STU2024003', true)
ON CONFLICT (id) DO NOTHING;

-- Update parent children_ids
UPDATE users SET children_ids = ARRAY['550e8400-e29b-41d4-a716-446655440031'] 
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

-- Insert sample grades
INSERT INTO grades (id, student_id, subject_id, class_id, value, max_value, type, date, term, teacher_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440021', 16, 20, 'devoir', '2024-10-15', 'trimestre1', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440021', 14, 20, 'composition', '2024-10-20', 'trimestre1', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440021', 18, 20, 'devoir', '2024-10-15', 'trimestre1', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample payments
INSERT INTO payments (id, student_id, amount, type, description, date, method, status, receipt_number, academic_year, paid_by) VALUES
  ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440031', 50000, 'inscription', 'Frais d''inscription 2024-2025', '2024-09-01', 'especes', 'completed', 'REC001', '2024-2025', 'Pierre Martin'),
  ('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440032', 75000, 'scolarite', 'Frais de scolarité - 1er trimestre', '2024-10-01', 'mobile', 'completed', 'REC002', '2024-2025', 'Amadou Diallo')
ON CONFLICT (id) DO NOTHING;

-- Insert sample staff
INSERT INTO staff (id, first_name, last_name, position, department, education, experience, hire_date, phone, email, address, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440061', 'Marie', 'Dupont', 'Professeur de Mathématiques', 'Sciences', 'Master en Mathématiques, Université de Paris', '8 ans d''enseignement au niveau primaire et secondaire', '2020-09-01', '+225 07 89 12 34 56', 'marie.dupont@ecole-numerique.ci', 'Quartier Résidentiel, Abidjan', true),
  ('550e8400-e29b-41d4-a716-446655440062', 'Jean', 'Kouassi', 'Directeur', 'Administration', 'Master en Sciences de l''Éducation', '15 ans dans l''administration scolaire', '2018-01-15', '+225 01 23 45 67 89', 'jean.kouassi@ecole-numerique.ci', 'Centre-ville, Abidjan', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample rooms
INSERT INTO rooms (id, name, capacity, type, equipment, is_available) VALUES
  ('550e8400-e29b-41d4-a716-446655440071', 'Salle A1', 30, 'classroom', ARRAY['Tableau blanc', 'Projecteur', 'Ordinateur'], true),
  ('550e8400-e29b-41d4-a716-446655440072', 'Laboratoire Sciences', 20, 'lab', ARRAY['Microscopes', 'Matériel chimie', 'Paillasses'], true),
  ('550e8400-e29b-41d4-a716-446655440073', 'Bibliothèque', 50, 'library', ARRAY['Livres', 'Ordinateurs', 'Tables de lecture'], true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample news
INSERT INTO news (id, title, content, type, publish_date, author_id, is_published, priority) VALUES
  ('550e8400-e29b-41d4-a716-446655440081', 'Rentrée scolaire 2024-2025', 'Nous sommes heureux d''accueillir tous nos élèves pour cette nouvelle année scolaire. Les cours commencent le 2 septembre 2024.', 'announcement', '2024-08-25', '550e8400-e29b-41d4-a716-446655440001', true, 'high'),
  ('550e8400-e29b-41d4-a716-446655440082', 'Journée portes ouvertes', 'Venez découvrir notre école lors de notre journée portes ouvertes le samedi 15 juin.', 'event', '2024-06-01', '550e8400-e29b-41d4-a716-446655440001', true, 'medium')
ON CONFLICT (id) DO NOTHING;