import { supabase } from './supabaseClient';
import { User, Student, Class, Subject, Grade, Payment, Staff, InventoryItem, News, Event, Homework, OnlineRegistration, Room, RoomSchedule, Attendance, Message, ParentNotification } from '../types';

// Helper function to convert database format to app format
const convertDatabaseUser = (dbUser: any): User => ({
  id: dbUser.id,
  username: dbUser.username,
  password: dbUser.password,
  role: dbUser.role,
  name: dbUser.name,
  email: dbUser.email,
  phone: dbUser.phone,
  profilePhoto: dbUser.profile_photo,
  assignedClasses: dbUser.assigned_classes || [],
  childrenIds: dbUser.children_ids || [],
  permissions: dbUser.permissions || [],
  isActive: dbUser.is_active,
  createdAt: dbUser.created_at
});

const convertDatabaseStudent = (dbStudent: any): Student => ({
  id: dbStudent.id,
  firstName: dbStudent.first_name,
  lastName: dbStudent.last_name,
  dateOfBirth: dbStudent.date_of_birth,
  gender: dbStudent.gender,
  classId: dbStudent.class_id,
  parentName: dbStudent.parent_name,
  parentPhone: dbStudent.parent_phone,
  parentEmail: dbStudent.parent_email,
  address: dbStudent.address,
  enrollmentDate: dbStudent.enrollment_date,
  profilePhoto: dbStudent.profile_photo,
  studentNumber: dbStudent.student_number,
  isActive: dbStudent.is_active,
  medicalInfo: dbStudent.medical_info
});

// Database class for Supabase operations
export class SupabaseDatabase {
  // Users
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(convertDatabaseUser) || [];
  }

  async addUser(user: User): Promise<void> {
    const { error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profile_photo: user.profilePhoto,
        assigned_classes: user.assignedClasses,
        children_ids: user.childrenIds,
        permissions: user.permissions,
        is_active: user.isActive
      });
    
    if (error) throw error;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<void> {
    const updateData: any = {};
    
    if (userData.username) updateData.username = userData.username;
    if (userData.password) updateData.password = userData.password;
    if (userData.role) updateData.role = userData.role;
    if (userData.name) updateData.name = userData.name;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.phone !== undefined) updateData.phone = userData.phone;
    if (userData.profilePhoto !== undefined) updateData.profile_photo = userData.profilePhoto;
    if (userData.assignedClasses) updateData.assigned_classes = userData.assignedClasses;
    if (userData.childrenIds) updateData.children_ids = userData.childrenIds;
    if (userData.permissions) updateData.permissions = userData.permissions;
    if (userData.isActive !== undefined) updateData.is_active = userData.isActive;

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Students
  async getStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(convertDatabaseStudent) || [];
  }

  async addStudent(student: Student): Promise<void> {
    const { error } = await supabase
      .from('students')
      .insert({
        id: student.id,
        first_name: student.firstName,
        last_name: student.lastName,
        date_of_birth: student.dateOfBirth,
        gender: student.gender,
        class_id: student.classId,
        parent_name: student.parentName,
        parent_phone: student.parentPhone,
        parent_email: student.parentEmail,
        address: student.address,
        enrollment_date: student.enrollmentDate,
        profile_photo: student.profilePhoto,
        student_number: student.studentNumber,
        is_active: student.isActive,
        medical_info: student.medicalInfo
      });
    
    if (error) throw error;
  }

  async updateStudent(id: string, studentData: Partial<Student>): Promise<void> {
    const updateData: any = {};
    
    if (studentData.firstName) updateData.first_name = studentData.firstName;
    if (studentData.lastName) updateData.last_name = studentData.lastName;
    if (studentData.dateOfBirth) updateData.date_of_birth = studentData.dateOfBirth;
    if (studentData.gender) updateData.gender = studentData.gender;
    if (studentData.classId) updateData.class_id = studentData.classId;
    if (studentData.parentName) updateData.parent_name = studentData.parentName;
    if (studentData.parentPhone) updateData.parent_phone = studentData.parentPhone;
    if (studentData.parentEmail !== undefined) updateData.parent_email = studentData.parentEmail;
    if (studentData.address) updateData.address = studentData.address;
    if (studentData.enrollmentDate) updateData.enrollment_date = studentData.enrollmentDate;
    if (studentData.profilePhoto !== undefined) updateData.profile_photo = studentData.profilePhoto;
    if (studentData.studentNumber) updateData.student_number = studentData.studentNumber;
    if (studentData.isActive !== undefined) updateData.is_active = studentData.isActive;
    if (studentData.medicalInfo !== undefined) updateData.medical_info = studentData.medicalInfo;

    const { error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  }

  async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Classes
  async getClasses(): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map((dbClass: any) => ({
      id: dbClass.id,
      name: dbClass.name,
      level: dbClass.level,
      teacherId: dbClass.teacher_id,
      academicYear: dbClass.academic_year,
      subjects: dbClass.subjects || [],
      maxStudents: dbClass.max_students
    })) || [];
  }

  async addClass(classData: Class): Promise<void> {
    const { error } = await supabase
      .from('classes')
      .insert({
        id: classData.id,
        name: classData.name,
        level: classData.level,
        teacher_id: classData.teacherId,
        academic_year: classData.academicYear,
        subjects: classData.subjects,
        max_students: classData.maxStudents
      });
    
    if (error) throw error;
  }

  async updateClass(id: string, classData: Partial<Class>): Promise<void> {
    const updateData: any = {};
    
    if (classData.name) updateData.name = classData.name;
    if (classData.level) updateData.level = classData.level;
    if (classData.teacherId) updateData.teacher_id = classData.teacherId;
    if (classData.academicYear) updateData.academic_year = classData.academicYear;
    if (classData.subjects) updateData.subjects = classData.subjects;
    if (classData.maxStudents) updateData.max_students = classData.maxStudents;

    const { error } = await supabase
      .from('classes')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  }

  async deleteClass(id: string): Promise<void> {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data?.map((dbSubject: any) => ({
      id: dbSubject.id,
      name: dbSubject.name,
      code: dbSubject.code,
      coefficient: dbSubject.coefficient,
      description: dbSubject.description
    })) || [];
  }

  async addSubject(subject: Subject): Promise<void> {
    const { error } = await supabase
      .from('subjects')
      .insert({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        coefficient: subject.coefficient,
        description: subject.description
      });
    
    if (error) throw error;
  }

  async updateSubject(id: string, subjectData: Partial<Subject>): Promise<void> {
    const updateData: any = {};
    
    if (subjectData.name) updateData.name = subjectData.name;
    if (subjectData.code) updateData.code = subjectData.code;
    if (subjectData.coefficient) updateData.coefficient = subjectData.coefficient;
    if (subjectData.description !== undefined) updateData.description = subjectData.description;

    const { error } = await supabase
      .from('subjects')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  }

  async deleteSubject(id: string): Promise<void> {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Grades
  async getGrades(): Promise<Grade[]> {
    const { data, error } = await supabase
      .from('grades')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data?.map((dbGrade: any) => ({
      id: dbGrade.id,
      studentId: dbGrade.student_id,
      subjectId: dbGrade.subject_id,
      classId: dbGrade.class_id,
      value: dbGrade.value,
      maxValue: dbGrade.max_value,
      type: dbGrade.type,
      date: dbGrade.date,
      term: dbGrade.term,
      teacherId: dbGrade.teacher_id,
      comment: dbGrade.comment
    })) || [];
  }

  async addGrade(grade: Grade): Promise<void> {
    const { error } = await supabase
      .from('grades')
      .insert({
        id: grade.id,
        student_id: grade.studentId,
        subject_id: grade.subjectId,
        class_id: grade.classId,
        value: grade.value,
        max_value: grade.maxValue,
        type: grade.type,
        date: grade.date,
        term: grade.term,
        teacher_id: grade.teacherId,
        comment: grade.comment
      });
    
    if (error) throw error;
  }

  async updateGrade(id: string, gradeData: Partial<Grade>): Promise<void> {
    const updateData: any = {};
    
    if (gradeData.studentId) updateData.student_id = gradeData.studentId;
    if (gradeData.subjectId) updateData.subject_id = gradeData.subjectId;
    if (gradeData.classId) updateData.class_id = gradeData.classId;
    if (gradeData.value !== undefined) updateData.value = gradeData.value;
    if (gradeData.maxValue !== undefined) updateData.max_value = gradeData.maxValue;
    if (gradeData.type) updateData.type = gradeData.type;
    if (gradeData.date) updateData.date = gradeData.date;
    if (gradeData.term) updateData.term = gradeData.term;
    if (gradeData.teacherId) updateData.teacher_id = gradeData.teacherId;
    if (gradeData.comment !== undefined) updateData.comment = gradeData.comment;

    const { error } = await supabase
      .from('grades')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  }

  async deleteGrade(id: string): Promise<void> {
    const { error } = await supabase
      .from('grades')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Initialize with default data (for first setup)
  async initializeDefaultData(): Promise<void> {
    // Check if data already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('Database already initialized');
      return;
    }

    console.log('Initializing database with default data...');
    
    // The default data will be inserted via the migration SQL files
    // This method can be used for additional setup if needed
  }

  // Add placeholder methods for other entities
  async getPayments(): Promise<Payment[]> { return []; }
  async addPayment(payment: Payment): Promise<void> {}
  async updatePayment(id: string, paymentData: Partial<Payment>): Promise<void> {}
  async deletePayment(id: string): Promise<void> {}

  async getStaff(): Promise<Staff[]> { return []; }
  async addStaff(staff: Staff): Promise<void> {}
  async updateStaff(id: string, staffData: Partial<Staff>): Promise<void> {}
  async deleteStaff(id: string): Promise<void> {}

  async getInventory(): Promise<InventoryItem[]> { return []; }
  async addInventoryItem(item: InventoryItem): Promise<void> {}
  async updateInventoryItem(id: string, itemData: Partial<InventoryItem>): Promise<void> {}
  async deleteInventoryItem(id: string): Promise<void> {}

  async getNews(): Promise<News[]> { return []; }
  async addNews(news: News): Promise<void> {}
  async updateNews(id: string, newsData: Partial<News>): Promise<void> {}
  async deleteNews(id: string): Promise<void> {}

  async getEvents(): Promise<Event[]> { return []; }
  async addEvent(event: Event): Promise<void> {}
  async updateEvent(id: string, eventData: Partial<Event>): Promise<void> {}
  async deleteEvent(id: string): Promise<void> {}

  async getHomework(): Promise<Homework[]> { return []; }
  async addHomework(homework: Homework): Promise<void> {}
  async updateHomework(id: string, homeworkData: Partial<Homework>): Promise<void> {}
  async deleteHomework(id: string): Promise<void> {}

  async getOnlineRegistrations(): Promise<OnlineRegistration[]> { return []; }
  async addOnlineRegistration(registration: OnlineRegistration): Promise<void> {}
  async updateOnlineRegistration(id: string, registrationData: Partial<OnlineRegistration>): Promise<void> {}
  async deleteOnlineRegistration(id: string): Promise<void> {}

  async getRooms(): Promise<Room[]> { return []; }
  async addRoom(room: Room): Promise<void> {}
  async updateRoom(id: string, roomData: Partial<Room>): Promise<void> {}
  async deleteRoom(id: string): Promise<void> {}
  
  async getRoomSchedules(): Promise<RoomSchedule[]> {
    const { data, error } = await supabase
      .from('room_schedules')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map((dbSchedule: any) => ({
      id: dbSchedule.id,
      roomId: dbSchedule.room_id,
      classId: dbSchedule.class_id,
      subjectId: dbSchedule.subject_id,
      teacherId: dbSchedule.teacher_id,
      day: dbSchedule.day,
      startTime: dbSchedule.start_time,
      endTime: dbSchedule.end_time,
      academicYear: dbSchedule.academic_year,
      documents: dbSchedule.documents || [],
      notes: dbSchedule.notes
    })) || [];
  }
  
  async addRoomSchedule(schedule: RoomSchedule): Promise<void> {
    const { error } = await supabase
      .from('room_schedules')
      .insert({
        id: schedule.id,
        room_id: schedule.roomId,
        class_id: schedule.classId,
        subject_id: schedule.subjectId,
        teacher_id: schedule.teacherId,
        day: schedule.day,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        academic_year: schedule.academicYear,
        documents: schedule.documents,
        notes: schedule.notes
      });
    
    if (error) throw error;
  }
  
  async updateRoomSchedule(id: string, scheduleData: Partial<RoomSchedule>): Promise<void> {
    const updateData: any = {};
    
    if (scheduleData.roomId) updateData.room_id = scheduleData.roomId;
    if (scheduleData.classId) updateData.class_id = scheduleData.classId;
    if (scheduleData.subjectId) updateData.subject_id = scheduleData.subjectId;
    if (scheduleData.teacherId) updateData.teacher_id = scheduleData.teacherId;
    if (scheduleData.day) updateData.day = scheduleData.day;
    if (scheduleData.startTime) updateData.start_time = scheduleData.startTime;
    if (scheduleData.endTime) updateData.end_time = scheduleData.endTime;
    if (scheduleData.academicYear) updateData.academic_year = scheduleData.academicYear;
    if (scheduleData.documents !== undefined) updateData.documents = scheduleData.documents;
    if (scheduleData.notes !== undefined) updateData.notes = scheduleData.notes;

    const { error } = await supabase
      .from('room_schedules')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  }
  
  async deleteRoomSchedule(id: string): Promise<void> {
    const { error } = await supabase
      .from('room_schedules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
  async getAttendance(): Promise<Attendance[]> { return []; }
  async addAttendance(attendance: Attendance): Promise<void> {}
  async updateAttendance(id: string, attendanceData: Partial<Attendance>): Promise<void> {}
  async deleteAttendance(id: string): Promise<void> {}

  async getMessages(): Promise<Message[]> { return []; }
  async addMessage(message: Message): Promise<void> {}
  async updateMessage(id: string, messageData: Partial<Message>): Promise<void> {}
  async deleteMessage(id: string): Promise<void> {}

  async getParentNotifications(): Promise<ParentNotification[]> { return []; }
  async addParentNotification(notification: ParentNotification): Promise<void> {}
  async updateParentNotification(id: string, notificationData: Partial<ParentNotification>): Promise<void> {}
  async deleteParentNotification(id: string): Promise<void> {}

  async getMessagesForParent(parentId: string): Promise<Message[]> { return []; }
  async getNotificationsForParent(parentId: string): Promise<ParentNotification[]> { return []; }
  async sendReplyToParent(originalMessageId: string, replyText: string, adminId: string): Promise<void> {}
}