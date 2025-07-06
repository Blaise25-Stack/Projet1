import { User, Student, Class, Subject, Grade, Payment, Staff, InventoryItem, News, Event, Homework, OnlineRegistration, Room, RoomSchedule, Attendance, Message, ParentNotification } from '../types';
import { SupabaseDatabase } from './databaseSupabase';

// Configuration pour PostgreSQL (en production) ou localStorage (en développement)
const USE_POSTGRESQL = import.meta.env.VITE_USE_SUPABASE === 'true';

// Interface pour la configuration PostgreSQL
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Simulation d'une base de données avec localStorage pour le développement
// et Supabase pour la production
class Database {
  private config: DatabaseConfig | null = null;
  private supabaseDb: SupabaseDatabase | null = null;

  constructor() {
    if (USE_POSTGRESQL) {
      this.supabaseDb = new SupabaseDatabase();
      console.log('Using Supabase database');
    } else {
      console.log('Using localStorage database');
    }
  }

  // Méthodes génériques pour localStorage
  private getItem<T>(key: string): T[] {
    if (this.supabaseDb) {
      throw new Error('Use async methods when using Supabase');
    }
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key}:`, error);
      return [];
    }
  }

  private setItem<T>(key: string, data: T[]): void {
    if (this.supabaseDb) {
      throw new Error('Use async methods when using Supabase');
    }
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Erreur lors de l'écriture de ${key}:`, error);
    }
  }

  // Users
  getUsers(): User[] {
    if (this.supabaseDb) {
      // For sync compatibility, return empty array and use async version
      return [];
    }
    return this.getItem<User>('users');
  }

  async getUsersAsync(): Promise<User[]> {
    if (this.supabaseDb) {
      return await this.supabaseDb.getUsers();
    }
    return this.getUsers();
  }

  addUser(user: User): void {
    if (this.supabaseDb) {
      // Use async version
      this.addUserAsync(user);
      return;
    }
    
    const users = this.getUsers();
    users.push(user);
    this.setItem('users', users);
  }

  async addUserAsync(user: User): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.addUser(user);
    }
    this.addUser(user);
  }

  updateUser(id: string, userData: Partial<User>): void {
    if (this.supabaseDb) {
      this.updateUserAsync(id, userData);
      return;
    }
    
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      this.setItem('users', users);
    }
  }

  async updateUserAsync(id: string, userData: Partial<User>): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.updateUser(id, userData);
    }
    this.updateUser(id, userData);
  }

  deleteUser(id: string): void {
    if (this.supabaseDb) {
      this.deleteUserAsync(id);
      return;
    }
    
    const users = this.getUsers().filter(u => u.id !== id);
    this.setItem('users', users);
  }

  async deleteUserAsync(id: string): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.deleteUser(id);
    }
    this.deleteUser(id);
  }

  // Students
  getStudents(): Student[] {
    if (this.supabaseDb) {
      return [];
    }
    return this.getItem<Student>('students');
  }

  async getStudentsAsync(): Promise<Student[]> {
    if (this.supabaseDb) {
      return await this.supabaseDb.getStudents();
    }
    return this.getStudents();
  }

  addStudent(student: Student): void {
    if (this.supabaseDb) {
      this.addStudentAsync(student);
      return;
    }
    
    const students = this.getStudents();
    students.push(student);
    this.setItem('students', students);
  }

  async addStudentAsync(student: Student): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.addStudent(student);
    }
    this.addStudent(student);
  }

  updateStudent(id: string, studentData: Partial<Student>): void {
    if (this.supabaseDb) {
      this.updateStudentAsync(id, studentData);
      return;
    }
    
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...studentData };
      this.setItem('students', students);
    }
  }

  async updateStudentAsync(id: string, studentData: Partial<Student>): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.updateStudent(id, studentData);
    }
    this.updateStudent(id, studentData);
  }

  deleteStudent(id: string): void {
    if (this.supabaseDb) {
      this.deleteStudentAsync(id);
      return;
    }
    
    const students = this.getStudents().filter(s => s.id !== id);
    this.setItem('students', students);
  }

  async deleteStudentAsync(id: string): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.deleteStudent(id);
    }
    this.deleteStudent(id);
  }

  // Classes
  getClasses(): Class[] {
    if (this.supabaseDb) {
      return [];
    }
    return this.getItem<Class>('classes');
  }

  async getClassesAsync(): Promise<Class[]> {
    if (this.supabaseDb) {
      return await this.supabaseDb.getClasses();
    }
    return this.getClasses();
  }

  addClass(classData: Class): void {
    if (this.supabaseDb) {
      this.addClassAsync(classData);
      return;
    }
    
    const classes = this.getClasses();
    classes.push(classData);
    this.setItem('classes', classes);
  }

  async addClassAsync(classData: Class): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.addClass(classData);
    }
    this.addClass(classData);
  }

  updateClass(id: string, classData: Partial<Class>): void {
    if (this.supabaseDb) {
      this.updateClassAsync(id, classData);
      return;
    }
    
    const classes = this.getClasses();
    const index = classes.findIndex(c => c.id === id);
    if (index !== -1) {
      classes[index] = { ...classes[index], ...classData };
      this.setItem('classes', classes);
    }
  }

  async updateClassAsync(id: string, classData: Partial<Class>): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.updateClass(id, classData);
    }
    this.updateClass(id, classData);
  }

  deleteClass(id: string): void {
    if (this.supabaseDb) {
      this.deleteClassAsync(id);
      return;
    }
    
    const classes = this.getClasses().filter(c => c.id !== id);
    this.setItem('classes', classes);
  }

  async deleteClassAsync(id: string): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.deleteClass(id);
    }
    this.deleteClass(id);
  }

  // Subjects
  getSubjects(): Subject[] {
    if (this.supabaseDb) {
      return [];
    }
    return this.getItem<Subject>('subjects');
  }

  async getSubjectsAsync(): Promise<Subject[]> {
    if (this.supabaseDb) {
      return await this.supabaseDb.getSubjects();
    }
    return this.getSubjects();
  }

  addSubject(subject: Subject): void {
    if (this.supabaseDb) {
      this.addSubjectAsync(subject);
      return;
    }
    
    const subjects = this.getSubjects();
    subjects.push(subject);
    this.setItem('subjects', subjects);
  }

  async addSubjectAsync(subject: Subject): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.addSubject(subject);
    }
    this.addSubject(subject);
  }

  updateSubject(id: string, subjectData: Partial<Subject>): void {
    if (this.supabaseDb) {
      this.updateSubjectAsync(id, subjectData);
      return;
    }
    
    const subjects = this.getSubjects();
    const index = subjects.findIndex(s => s.id === id);
    if (index !== -1) {
      subjects[index] = { ...subjects[index], ...subjectData };
      this.setItem('subjects', subjects);
    }
  }

  async updateSubjectAsync(id: string, subjectData: Partial<Subject>): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.updateSubject(id, subjectData);
    }
    this.updateSubject(id, subjectData);
  }

  deleteSubject(id: string): void {
    if (this.supabaseDb) {
      this.deleteSubjectAsync(id);
      return;
    }
    
    const subjects = this.getSubjects().filter(s => s.id !== id);
    this.setItem('subjects', subjects);
  }

  async deleteSubjectAsync(id: string): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.deleteSubject(id);
    }
    this.deleteSubject(id);
  }

  // Grades
  getGrades(): Grade[] {
    if (this.supabaseDb) {
      return [];
    }
    return this.getItem<Grade>('grades');
  }

  async getGradesAsync(): Promise<Grade[]> {
    if (this.supabaseDb) {
      return await this.supabaseDb.getGrades();
    }
    return this.getGrades();
  }

  addGrade(grade: Grade): void {
    if (this.supabaseDb) {
      this.addGradeAsync(grade);
      return;
    }
    
    const grades = this.getGrades();
    grades.push(grade);
    this.setItem('grades', grades);
  }

  async addGradeAsync(grade: Grade): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.addGrade(grade);
    }
    this.addGrade(grade);
  }

  updateGrade(id: string, gradeData: Partial<Grade>): void {
    if (this.supabaseDb) {
      this.updateGradeAsync(id, gradeData);
      return;
    }
    
    const grades = this.getGrades();
    const index = grades.findIndex(g => g.id === id);
    if (index !== -1) {
      grades[index] = { ...grades[index], ...gradeData };
      this.setItem('grades', grades);
    }
  }

  async updateGradeAsync(id: string, gradeData: Partial<Grade>): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.updateGrade(id, gradeData);
    }
    this.updateGrade(id, gradeData);
  }

  deleteGrade(id: string): void {
    if (this.supabaseDb) {
      this.deleteGradeAsync(id);
      return;
    }
    
    const grades = this.getGrades().filter(g => g.id !== id);
    this.setItem('grades', grades);
  }

  async deleteGradeAsync(id: string): Promise<void> {
    if (this.supabaseDb) {
      return await this.supabaseDb.deleteGrade(id);
    }
    this.deleteGrade(id);
  }

  // Keep all other methods as they were for localStorage compatibility
  getPayments(): Payment[] { return this.getItem<Payment>('payments'); }
  addPayment(payment: Payment): void { const payments = this.getPayments(); payments.push(payment); this.setItem('payments', payments); }
  updatePayment(id: string, paymentData: Partial<Payment>): void { const payments = this.getPayments(); const index = payments.findIndex(p => p.id === id); if (index !== -1) { payments[index] = { ...payments[index], ...paymentData }; this.setItem('payments', payments); } }
  deletePayment(id: string): void { const payments = this.getPayments().filter(p => p.id !== id); this.setItem('payments', payments); }

  getStaff(): Staff[] { return this.getItem<Staff>('staff'); }
  addStaff(staff: Staff): void { const staffList = this.getStaff(); staffList.push(staff); this.setItem('staff', staffList); }
  updateStaff(id: string, staffData: Partial<Staff>): void { const staffList = this.getStaff(); const index = staffList.findIndex(s => s.id === id); if (index !== -1) { staffList[index] = { ...staffList[index], ...staffData }; this.setItem('staff', staffList); } }
  deleteStaff(id: string): void { const staffList = this.getStaff().filter(s => s.id !== id); this.setItem('staff', staffList); }

  getInventory(): InventoryItem[] { return this.getItem<InventoryItem>('inventory'); }
  addInventoryItem(item: InventoryItem): void { const inventory = this.getInventory(); inventory.push(item); this.setItem('inventory', inventory); }
  updateInventoryItem(id: string, itemData: Partial<InventoryItem>): void { const inventory = this.getInventory(); const index = inventory.findIndex(i => i.id === id); if (index !== -1) { inventory[index] = { ...inventory[index], ...itemData }; this.setItem('inventory', inventory); } }
  deleteInventoryItem(id: string): void { const inventory = this.getInventory().filter(i => i.id !== id); this.setItem('inventory', inventory); }

  getNews(): News[] { return this.getItem<News>('news'); }
  addNews(news: News): void { const newsList = this.getNews(); newsList.push(news); this.setItem('news', newsList); }
  updateNews(id: string, newsData: Partial<News>): void { const newsList = this.getNews(); const index = newsList.findIndex(n => n.id === id); if (index !== -1) { newsList[index] = { ...newsList[index], ...newsData }; this.setItem('news', newsList); } }
  deleteNews(id: string): void { const newsList = this.getNews().filter(n => n.id !== id); this.setItem('news', newsList); }

  getEvents(): Event[] { return this.getItem<Event>('events'); }
  addEvent(event: Event): void { const events = this.getEvents(); events.push(event); this.setItem('events', events); }
  updateEvent(id: string, eventData: Partial<Event>): void { const events = this.getEvents(); const index = events.findIndex(e => e.id === id); if (index !== -1) { events[index] = { ...events[index], ...eventData }; this.setItem('events', events); } }
  deleteEvent(id: string): void { const events = this.getEvents().filter(e => e.id !== id); this.setItem('events', events); }

  getHomework(): Homework[] { return this.getItem<Homework>('homework'); }
  addHomework(homework: Homework): void { const homeworkList = this.getHomework(); homeworkList.push(homework); this.setItem('homework', homeworkList); }
  updateHomework(id: string, homeworkData: Partial<Homework>): void { const homeworkList = this.getHomework(); const index = homeworkList.findIndex(h => h.id === id); if (index !== -1) { homeworkList[index] = { ...homeworkList[index], ...homeworkData }; this.setItem('homework', homeworkList); } }
  deleteHomework(id: string): void { const homeworkList = this.getHomework().filter(h => h.id !== id); this.setItem('homework', homeworkList); }

  getOnlineRegistrations(): OnlineRegistration[] { return this.getItem<OnlineRegistration>('onlineRegistrations'); }
  addOnlineRegistration(registration: OnlineRegistration): void { const registrations = this.getOnlineRegistrations(); registrations.push(registration); this.setItem('onlineRegistrations', registrations); }
  updateOnlineRegistration(id: string, registrationData: Partial<OnlineRegistration>): void { const registrations = this.getOnlineRegistrations(); const index = registrations.findIndex(r => r.id === id); if (index !== -1) { registrations[index] = { ...registrations[index], ...registrationData }; this.setItem('onlineRegistrations', registrations); } }
  deleteOnlineRegistration(id: string): void { const registrations = this.getOnlineRegistrations().filter(r => r.id !== id); this.setItem('onlineRegistrations', registrations); }

  getRooms(): Room[] { return this.getItem<Room>('rooms'); }
  addRoom(room: Room): void { const rooms = this.getRooms(); rooms.push(room); this.setItem('rooms', rooms); }
  updateRoom(id: string, roomData: Partial<Room>): void { const rooms = this.getRooms(); const index = rooms.findIndex(r => r.id === id); if (index !== -1) { rooms[index] = { ...rooms[index], ...roomData }; this.setItem('rooms', rooms); } }
  deleteRoom(id: string): void { const rooms = this.getRooms().filter(r => r.id !== id); this.setItem('rooms', rooms); }

  getRoomSchedules(): RoomSchedule[] { return this.getItem<RoomSchedule>('roomSchedules'); }
  addRoomSchedule(schedule: RoomSchedule): void { const schedules = this.getRoomSchedules(); schedules.push(schedule); this.setItem('roomSchedules', schedules); }
  updateRoomSchedule(id: string, scheduleData: Partial<RoomSchedule>): void { const schedules = this.getRoomSchedules(); const index = schedules.findIndex(s => s.id === id); if (index !== -1) { schedules[index] = { ...schedules[index], ...scheduleData }; this.setItem('roomSchedules', schedules); } }
  deleteRoomSchedule(id: string): void { const schedules = this.getRoomSchedules().filter(s => s.id !== id); this.setItem('roomSchedules', schedules); }

  getAttendance(): Attendance[] { return this.getItem<Attendance>('attendance'); }
  addAttendance(attendance: Attendance): void { const attendanceList = this.getAttendance(); attendanceList.push(attendance); this.setItem('attendance', attendanceList); }
  updateAttendance(id: string, attendanceData: Partial<Attendance>): void { const attendanceList = this.getAttendance(); const index = attendanceList.findIndex(a => a.id === id); if (index !== -1) { attendanceList[index] = { ...attendanceList[index], ...attendanceData }; this.setItem('attendance', attendanceList); } }
  deleteAttendance(id: string): void { const attendanceList = this.getAttendance().filter(a => a.id !== id); this.setItem('attendance', attendanceList); }

  getMessages(): Message[] { return this.getItem<Message>('messages'); }
  addMessage(message: Message): void { const messages = this.getMessages(); messages.push(message); this.setItem('messages', messages); }
  updateMessage(id: string, messageData: Partial<Message>): void { const messages = this.getMessages(); const index = messages.findIndex(m => m.id === id); if (index !== -1) { messages[index] = { ...messages[index], ...messageData }; this.setItem('messages', messages); } }
  deleteMessage(id: string): void { const messages = this.getMessages().filter(m => m.id !== id); this.setItem('messages', messages); }

  getParentNotifications(): ParentNotification[] { return this.getItem<ParentNotification>('parentNotifications'); }
  addParentNotification(notification: ParentNotification): void { const notifications = this.getParentNotifications(); notifications.push(notification); this.setItem('parentNotifications', notifications); }
  updateParentNotification(id: string, notificationData: Partial<ParentNotification>): void { const notifications = this.getParentNotifications(); const index = notifications.findIndex(n => n.id === id); if (index !== -1) { notifications[index] = { ...notifications[index], ...notificationData }; this.setItem('parentNotifications', notifications); } }
  deleteParentNotification(id: string): void { const notifications = this.getParentNotifications().filter(n => n.id !== id); this.setItem('parentNotifications', notifications); }

  sendReplyToParent(originalMessageId: string, replyText: string, adminId: string): void {
    const originalMessage = this.getMessages().find(m => m.id === originalMessageId);
    if (!originalMessage) return;

    const parentUser = this.getUsers().find(u => 
      u.role === 'parent' && u.email === originalMessage.senderEmail
    );

    if (parentUser) {
      const replyMessage: Message = {
        id: Date.now().toString() + '_reply',
        senderName: 'Administration École Numérique',
        senderEmail: 'admin@ecole-numerique.ci',
        subject: `Re: ${originalMessage.subject}`,
        message: replyText,
        type: 'general',
        status: 'unread',
        createdAt: new Date().toISOString(),
        priority: 'medium',
        recipientId: parentUser.id,
        parentMessageId: originalMessageId,
        isFromAdmin: true
      };

      this.addMessage(replyMessage);

      const notification: ParentNotification = {
        id: Date.now().toString() + '_notif',
        parentId: parentUser.id,
        messageId: replyMessage.id,
        title: 'Nouvelle réponse de l\'administration',
        content: `Vous avez reçu une réponse à votre message "${originalMessage.subject}".`,
        type: 'message_reply',
        isRead: false,
        createdAt: new Date().toISOString()
      };

      this.addParentNotification(notification);
    }
  }

  getMessagesForParent(parentId: string): Message[] {
    return this.getMessages().filter(m => 
      m.recipientId === parentId || 
      (m.senderEmail && this.getUsers().find(u => u.id === parentId)?.email === m.senderEmail)
    );
  }

  getNotificationsForParent(parentId: string): ParentNotification[] {
    return this.getParentNotifications().filter(n => n.parentId === parentId);
  }

  // Initialize with default data
  initializeDefaultData(): void {
    if (this.supabaseDb) {
      // For Supabase, initialization is handled by migrations
      this.supabaseDb.initializeDefaultData();
      return;
    }

    // Check if data is already initialized
    const isInitialized = localStorage.getItem('dataInitialized');
    
    if (!isInitialized) {
      console.log('Initialisation des données par défaut...');
      
      // Clear existing data to ensure fresh start
      localStorage.clear();
      localStorage.setItem('dataInitialized', 'true');
      
      this.createDefaultUsers();
      this.createDefaultSubjects();
      this.createDefaultClasses();
      this.createDefaultStudents();
      this.createDefaultGrades();
      this.createDefaultPayments();
      this.createDefaultStaff();
      this.createDefaultInventory();
      this.createDefaultNews();
      this.createDefaultEvents();
      this.createDefaultRooms();
      this.createDefaultHomework();
      this.createDefaultAttendance();
      this.createDefaultMessages();
      
      console.log('Données par défaut initialisées avec succès !');
    }
  }

  // Keep all the createDefault methods as they were...
  private createDefaultUsers(): void {
    const defaultUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Administrateur Principal',
        email: 'admin@ecole-numerique.ci',
        phone: '+225 01 23 45 67 89',
        isActive: true,
        createdAt: new Date().toISOString(),
        profilePhoto: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '2',
        username: 'prof1',
        password: 'prof123',
        role: 'teacher',
        name: 'Marie Dupont',
        email: 'marie.dupont@ecole-numerique.ci',
        phone: '+225 07 89 12 34 56',
        assignedClasses: ['1'],
        isActive: true,
        createdAt: new Date().toISOString(),
        profilePhoto: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '3',
        username: 'parent1',
        password: 'parent123',
        role: 'parent',
        name: 'Pierre Martin',
        email: 'pierre.martin@email.com',
        phone: '+225 05 98 76 54 32',
        childrenIds: ['1'],
        isActive: true,
        createdAt: new Date().toISOString(),
        profilePhoto: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      }
    ];
    
    defaultUsers.forEach(user => this.addUser(user));
  }

  private createDefaultSubjects(): void {
    const defaultSubjects: Subject[] = [
      { id: '1', name: 'Français', code: 'FR', coefficient: 4 },
      { id: '2', name: 'Mathématiques', code: 'MATH', coefficient: 4 },
      { id: '3', name: 'Sciences', code: 'SCI', coefficient: 3 },
      { id: '4', name: 'Histoire-Géographie', code: 'HG', coefficient: 3 },
      { id: '5', name: 'Anglais', code: 'ANG', coefficient: 2 },
      { id: '6', name: 'Éducation Physique', code: 'EPS', coefficient: 1 }
    ];
    
    defaultSubjects.forEach(subject => this.addSubject(subject));
  }

  private createDefaultClasses(): void {
    const defaultClasses: Class[] = [
      {
        id: '1',
        name: 'CM2 A',
        level: 'CM2',
        teacherId: '2',
        academicYear: '2024-2025',
        subjects: ['1', '2', '3', '4', '5', '6'],
        maxStudents: 30
      },
      {
        id: '2',
        name: 'CM1 B',
        level: 'CM1',
        teacherId: '2',
        academicYear: '2024-2025',
        subjects: ['1', '2', '3', '4', '5', '6'],
        maxStudents: 28
      }
    ];
    
    defaultClasses.forEach(cls => this.addClass(cls));
  }

  private createDefaultStudents(): void {
    const defaultStudents: Student[] = [
      {
        id: '1',
        firstName: 'Jean',
        lastName: 'Martin',
        dateOfBirth: '2012-05-15',
        gender: 'M',
        classId: '1',
        parentName: 'Pierre Martin',
        parentPhone: '+225 05 98 76 54 32',
        parentEmail: 'pierre.martin@email.com',
        address: 'Village de Kourou, Abidjan',
        enrollmentDate: '2024-09-01',
        studentNumber: 'STU2024001',
        isActive: true,
        profilePhoto: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '2',
        firstName: 'Fatou',
        lastName: 'Diallo',
        dateOfBirth: '2012-08-22',
        gender: 'F',
        classId: '1',
        parentName: 'Amadou Diallo',
        parentPhone: '+225 07 12 34 56 78',
        parentEmail: 'amadou.diallo@email.com',
        address: 'Quartier Centre, Abidjan',
        enrollmentDate: '2024-09-01',
        studentNumber: 'STU2024002',
        isActive: true,
        profilePhoto: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '3',
        firstName: 'Kouadio',
        lastName: 'Yao',
        dateOfBirth: '2013-03-10',
        gender: 'M',
        classId: '2',
        parentName: 'Marie Yao',
        parentPhone: '+225 01 98 76 54 32',
        parentEmail: 'marie.yao@email.com',
        address: 'Plateau, Abidjan',
        enrollmentDate: '2024-09-01',
        studentNumber: 'STU2024003',
        isActive: true
      }
    ];
    
    defaultStudents.forEach(student => this.addStudent(student));
  }

  private createDefaultGrades(): void {
    const sampleGrades: Grade[] = [
      {
        id: '1',
        studentId: '1',
        subjectId: '1',
        classId: '1',
        value: 16,
        maxValue: 20,
        type: 'devoir',
        date: '2024-10-15',
        term: 'trimestre1',
        teacherId: '2'
      },
      {
        id: '2',
        studentId: '1',
        subjectId: '2',
        classId: '1',
        value: 14,
        maxValue: 20,
        type: 'composition',
        date: '2024-10-20',
        term: 'trimestre1',
        teacherId: '2'
      },
      {
        id: '3',
        studentId: '2',
        subjectId: '1',
        classId: '1',
        value: 18,
        maxValue: 20,
        type: 'devoir',
        date: '2024-10-15',
        term: 'trimestre1',
        teacherId: '2'
      },
      {
        id: '4',
        studentId: '2',
        subjectId: '2',
        classId: '1',
        value: 15,
        maxValue: 20,
        type: 'devoir',
        date: '2024-10-18',
        term: 'trimestre1',
        teacherId: '2'
      }
    ];
    
    sampleGrades.forEach(grade => this.addGrade(grade));
  }

  private createDefaultPayments(): void {
    const samplePayments: Payment[] = [
      {
        id: '1',
        studentId: '1',
        amount: 50000,
        type: 'inscription',
        description: 'Frais d\'inscription 2024-2025',
        date: '2024-09-01',
        method: 'especes',
        status: 'completed',
        receiptNumber: 'REC001',
        academicYear: '2024-2025',
        paidBy: 'Pierre Martin'
      },
      {
        id: '2',
        studentId: '2',
        amount: 75000,
        type: 'scolarite',
        description: 'Frais de scolarité - 1er trimestre',
        date: '2024-10-01',
        method: 'mobile',
        status: 'completed',
        receiptNumber: 'REC002',
        academicYear: '2024-2025',
        paidBy: 'Amadou Diallo'
      },
      {
        id: '3',
        studentId: '3',
        amount: 25000,
        type: 'cantine',
        description: 'Frais de cantine - Octobre 2024',
        date: '2024-10-05',
        method: 'cheque',
        status: 'completed',
        receiptNumber: 'REC003',
        academicYear: '2024-2025',
        paidBy: 'Marie Yao'
      }
    ];
    
    samplePayments.forEach(payment => this.addPayment(payment));
  }

  private createDefaultStaff(): void {
    const sampleStaff: Staff[] = [
      {
        id: '1',
        firstName: 'Marie',
        lastName: 'Dupont',
        position: 'Professeur de Mathématiques',
        department: 'Sciences',
        education: 'Master en Mathématiques, Université de Paris',
        experience: '8 ans d\'enseignement au niveau primaire et secondaire',
        hireDate: '2020-09-01',
        phone: '+225 07 89 12 34 56',
        email: 'marie.dupont@ecole-numerique.ci',
        address: 'Quartier Résidentiel, Abidjan',
        isActive: true,
        profilePhoto: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '2',
        firstName: 'Jean',
        lastName: 'Kouassi',
        position: 'Directeur',
        department: 'Administration',
        education: 'Master en Sciences de l\'Éducation',
        experience: '15 ans dans l\'administration scolaire',
        hireDate: '2018-01-15',
        phone: '+225 01 23 45 67 89',
        email: 'jean.kouassi@ecole-numerique.ci',
        address: 'Centre-ville, Abidjan',
        isActive: true,
        observations: 'Excellent leadership, très apprécié par le personnel',
        profilePhoto: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      }
    ];
    
    sampleStaff.forEach(staff => this.addStaff(staff));
  }

  private createDefaultInventory(): void {
    const sampleInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Bureau professeur',
        category: 'Mobilier',
        quantity: 15,
        condition: 'bon',
        location: 'Salles de classe',
        purchaseDate: '2023-08-15',
        value: 75000,
        lastUpdated: new Date().toISOString(),
        observations: 'Bureaux en bois massif, très résistants'
      },
      {
        id: '2',
        name: 'Ordinateur portable',
        category: 'Informatique',
        quantity: 5,
        condition: 'excellent',
        location: 'Salle informatique',
        purchaseDate: '2024-01-10',
        value: 450000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Tableau blanc',
        category: 'Matériel pédagogique',
        quantity: 12,
        condition: 'bon',
        location: 'Toutes les salles',
        purchaseDate: '2023-07-20',
        value: 25000,
        lastUpdated: new Date().toISOString()
      }
    ];
    
    sampleInventory.forEach(item => this.addInventoryItem(item));
  }

  private createDefaultNews(): void {
    const sampleNews: News[] = [
      {
        id: '1',
        title: 'Rentrée scolaire 2024-2025',
        content: 'Nous sommes heureux d\'accueillir tous nos élèves pour cette nouvelle année scolaire. Les cours commencent le 2 septembre 2024. Nous avons préparé de nombreuses activités et améliorations pour offrir la meilleure expérience éducative possible.',
        type: 'announcement',
        date: new Date().toISOString(),
        publishDate: '2024-08-25',
        authorId: '1',
        isPublished: true,
        priority: 'high',
        imageUrl: 'https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: '2',
        title: 'Journée portes ouvertes',
        content: 'Venez découvrir notre école lors de notre journée portes ouvertes le samedi 15 juin. Rencontrez nos enseignants, visitez nos installations modernes et découvrez notre approche pédagogique innovante.',
        type: 'event',
        date: new Date().toISOString(),
        publishDate: '2024-06-01',
        authorId: '1',
        isPublished: true,
        priority: 'medium',
        imageUrl: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ];
    
    sampleNews.forEach(news => this.addNews(news));
  }

  private createDefaultEvents(): void {
    const sampleEvents: Event[] = [
      {
        id: '1',
        title: 'Examens du 1er trimestre',
        description: 'Période d\'examens pour toutes les classes. Les élèves doivent se présenter avec leur matériel complet.',
        date: '2024-12-10',
        startTime: '08:00',
        endTime: '12:00',
        location: 'Toutes les salles',
        type: 'exam',
        isPublic: true,
        createdBy: '1'
      },
      {
        id: '2',
        title: 'Vacances de Noël',
        description: 'Vacances scolaires de fin d\'année. Reprise des cours le 8 janvier 2025.',
        date: '2024-12-20',
        startTime: '00:00',
        endTime: '23:59',
        location: 'École fermée',
        type: 'holiday',
        isPublic: true,
        createdBy: '1'
      }
    ];
    
    sampleEvents.forEach(event => this.addEvent(event));
  }

  private createDefaultRooms(): void {
    const sampleRooms: Room[] = [
      {
        id: '1',
        name: 'Salle A1',
        capacity: 30,
        type: 'classroom',
        equipment: ['Tableau blanc', 'Projecteur', 'Ordinateur'],
        isAvailable: true
      },
      {
        id: '2',
        name: 'Laboratoire Sciences',
        capacity: 20,
        type: 'lab',
        equipment: ['Microscopes', 'Matériel chimie', 'Paillasses'],
        isAvailable: true
      },
      {
        id: '3',
        name: 'Bibliothèque',
        capacity: 50,
        type: 'library',
        equipment: ['Livres', 'Ordinateurs', 'Tables de lecture'],
        isAvailable: true
      }
    ];
    
    sampleRooms.forEach(room => this.addRoom(room));
  }

  private createDefaultHomework(): void {
    const sampleHomework: Homework[] = [
      {
        id: '1',
        title: 'Exercices de mathématiques',
        description: 'Résoudre les exercices 1 à 10 page 45 du manuel de mathématiques. Montrer tous les calculs et justifier les réponses.',
        subjectId: '2',
        classId: '1',
        teacherId: '2',
        dueDate: '2024-11-15',
        isPublished: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Rédaction en français',
        description: 'Écrire une rédaction de 200 mots sur le thème "Mon animal préféré". Attention à l\'orthographe, à la grammaire et à la structure du texte.',
        subjectId: '1',
        classId: '1',
        teacherId: '2',
        dueDate: '2024-11-20',
        isPublished: true,
        createdAt: new Date().toISOString()
      }
    ];
    
    sampleHomework.forEach(homework => this.addHomework(homework));
  }

  private createDefaultAttendance(): void {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const sampleAttendance: Attendance[] = [
      {
        id: '1',
        studentId: '1',
        classId: '1',
        date: today,
        status: 'present',
        recordedBy: '2'
      },
      {
        id: '2',
        studentId: '2',
        classId: '1',
        date: today,
        status: 'present',
        recordedBy: '2'
      },
      {
        id: '3',
        studentId: '1',
        classId: '1',
        date: yesterday,
        status: 'late',
        reason: 'Transport en retard',
        recordedBy: '2'
      },
      {
        id: '4',
        studentId: '3',
        classId: '2',
        date: today,
        status: 'present',
        recordedBy: '2'
      }
    ];
    
    sampleAttendance.forEach(attendance => this.addAttendance(attendance));
  }

  private createDefaultMessages(): void {
    const sampleMessages: Message[] = [
      {
        id: '1',
        senderName: 'Marie Kouadio',
        senderEmail: 'marie.kouadio@email.com',
        senderPhone: '+225 07 12 34 56 78',
        subject: 'Demande d\'information sur les inscriptions',
        message: 'Bonjour,\n\nJe souhaiterais avoir des informations sur les modalités d\'inscription pour ma fille de 8 ans. Quels sont les documents requis et les frais de scolarité ?\n\nMerci pour votre réponse.\n\nCordialement,\nMarie Kouadio',
        type: 'contact',
        status: 'unread',
        priority: 'medium',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        senderName: 'Pierre Martin',
        senderEmail: 'pierre.martin@email.com',
        senderPhone: '+225 05 98 76 54 32',
        subject: 'Création de compte parent',
        message: 'Bonjour,\n\nJe viens de créer mon compte parent sur votre plateforme. J\'aimerais savoir comment procéder pour inscrire mon fils et accéder à ses informations scolaires.\n\nMerci de me guider dans les prochaines étapes.\n\nCordialement,\nPierre Martin',
        type: 'account_creation',
        status: 'unread',
        priority: 'high',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    sampleMessages.forEach(message => this.addMessage(message));
  }
}

export const db = new Database();