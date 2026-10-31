import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Student, 
  StaffMember, 
  AdmissionApplication, 
  ObservationSlot, 
  TeacherTask, 
  StudentCase, 
  StudentDevelopmentRecord, 
  SPPInvoice, 
  GalleryItem, 
  NotificationItem,
  ProgramType,
  SchoolClass,
  JobPosition,
  SchoolProgramDetail,
  ConsultationRequest,
  StudentScheduleItem,
  StudentAttendanceItem
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_STAFF, 
  INITIAL_CLASSES,
  INITIAL_POSITIONS,
  INITIAL_PROGRAM_DETAILS,
  INITIAL_ADMISSIONS, 
  INITIAL_OBSERVATION_SLOTS, 
  INITIAL_TASKS, 
  INITIAL_CASES, 
  INITIAL_SDR, 
  INITIAL_INVOICES, 
  INITIAL_GALLERY, 
  INITIAL_NOTIFICATIONS,
  INITIAL_SCHEDULES,
  INITIAL_ATTENDANCE,
  INITIAL_CONSULTATIONS
} from '../lib/mockData';
import { 
  fetchStudentsFromSupabase, 
  saveStudentToSupabase, 
  deleteStudentFromSupabase,
  fetchStaffFromSupabase,
  saveStaffToSupabase,
  deleteStaffFromSupabase,
  fetchClassesFromSupabase,
  saveClassToSupabase,
  deleteClassFromSupabase,
  fetchPositionsFromSupabase,
  savePositionToSupabase,
  deletePositionFromSupabase,
  fetchProgramsFromSupabase,
  saveProgramToSupabase,
  deleteProgramFromSupabase,
  fetchAdmissionsFromSupabase,
  saveAdmissionToSupabase,
  deleteAdmissionFromSupabase,
  fetchObservationSlotsFromSupabase,
  saveObservationSlotToSupabase,
  fetchTasksFromSupabase,
  saveTaskToSupabase,
  deleteTaskFromSupabase,
  fetchCasesFromSupabase,
  saveCaseToSupabase,
  deleteCaseFromSupabase,
  fetchSDRFromSupabase,
  saveSDRToSupabase,
  fetchInvoicesFromSupabase,
  saveInvoiceToSupabase,
  deleteInvoiceFromSupabase,
  fetchGalleryFromSupabase,
  saveGalleryItemToSupabase,
  deleteGalleryItemFromSupabase,
  fetchConsultationsFromSupabase,
  saveConsultationToSupabase,
  subscribeToAllChanges,
  generateUUID,
  toDeterministicUUID
} from '../lib/supabaseSchoolService';

interface SchoolDataContextType {
  students: Student[];
  staff: StaffMember[];
  classes: SchoolClass[];
  positions: JobPosition[];
  detailedPrograms: SchoolProgramDetail[];
  admissions: AdmissionApplication[];
  observationSlots: ObservationSlot[];
  tasks: TeacherTask[];
  cases: StudentCase[];
  sdrRecords: Record<string, StudentDevelopmentRecord>;
  invoices: SPPInvoice[];
  gallery: GalleryItem[];
  notifications: NotificationItem[];
  schedules: StudentScheduleItem[];
  attendance: StudentAttendanceItem[];
  consultations: ConsultationRequest[];
  isSyncing: boolean;

  // Student Actions
  addStudent: (student: Omit<Student, 'id'> & { id?: string }) => string;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  // Staff Actions
  addStaff: (member: Omit<StaffMember, 'id'> & { id?: string }) => string;
  updateStaff: (id: string, data: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  // Class Actions
  addClass: (cls: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, data: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;

  // Position Actions
  addPosition: (pos: Omit<JobPosition, 'id'>) => void;
  updatePosition: (id: string, data: Partial<JobPosition>) => void;
  deletePosition: (id: string) => void;

  // Program Actions
  addProgram: (prog: Omit<SchoolProgramDetail, 'id'>) => void;
  updateProgram: (id: string, data: Partial<SchoolProgramDetail>) => void;
  deleteProgram: (id: string) => void;

  // Admission Actions
  addAdmission: (admission: Omit<AdmissionApplication, 'id' | 'applicationNumber' | 'createdAt'>) => string;
  verifyAdmissionPayment: (id: string, isApproved: boolean) => void;
  bookObservationSlot: (admissionId: string, slotId: string) => void;
  createObservationSlot: (slot: Omit<ObservationSlot, 'id' | 'bookedCount'>) => void;
  admitStudentFromAdmission: (admissionId: string, className: string) => void;
  deleteAdmission?: (id: string) => void;

  // Task Actions
  addTask: (task: Omit<TeacherTask, 'id'>) => void;
  updateTask: (id: string, data: Partial<TeacherTask>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TeacherTask['status'], reviewerNotes?: string) => void;

  // Case Actions
  addCase: (newCase: Omit<StudentCase, 'id' | 'caseNumber' | 'dateTime'>) => void;
  updateCaseStatus: (id: string, status: StudentCase['status'], followUpNotes?: string) => void;

  // SDR Actions
  updateSDR: (studentId: string, record: Partial<StudentDevelopmentRecord>) => void;
  setProgramDecision: (studentId: string, decision: 'CONTINUE' | 'MODIFY' | 'REPLACE', rationale: string) => void;

  // Finance Actions
  verifyInvoicePayment: (invoiceId: string, isApproved: boolean) => void;
  uploadPaymentProof: (invoiceId: string, proofUrl: string) => void;
  createInvoice: (invoice: Omit<SPPInvoice, 'id' | 'invoiceNumber'>) => void;

  // Consultation Actions
  addConsultationRequest: (data: Omit<ConsultationRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateConsultationStatus: (id: string, status: ConsultationRequest['status'], feedbackNotes?: string, confirmedDate?: string, confirmedTime?: string) => void;

  // Gallery Management
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'date'>) => void;
  deleteGalleryItem: (id: string) => void;
  toggleTakeDownGalleryItem: (id: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;

  // Manual Refresh
  refreshAllData: () => Promise<void>;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ls_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('ls_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('ls_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [positions, setPositions] = useState<JobPosition[]>(() => {
    const saved = localStorage.getItem('ls_positions');
    return saved ? JSON.parse(saved) : INITIAL_POSITIONS;
  });

  const [detailedPrograms, setDetailedPrograms] = useState<SchoolProgramDetail[]>(() => {
    const saved = localStorage.getItem('ls_programs');
    return saved ? JSON.parse(saved) : INITIAL_PROGRAM_DETAILS;
  });

  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() => {
    const saved = localStorage.getItem('ls_admissions');
    return saved ? JSON.parse(saved) : INITIAL_ADMISSIONS;
  });

  const [observationSlots, setObservationSlots] = useState<ObservationSlot[]>(() => {
    const saved = localStorage.getItem('ls_obs_slots');
    return saved ? JSON.parse(saved) : INITIAL_OBSERVATION_SLOTS;
  });

  const [tasks, setTasks] = useState<TeacherTask[]>(() => {
    const saved = localStorage.getItem('ls_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [cases, setCases] = useState<StudentCase[]>(() => {
    const saved = localStorage.getItem('ls_cases');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [sdrRecords, setSdrRecords] = useState<Record<string, StudentDevelopmentRecord>>(() => {
    const saved = localStorage.getItem('ls_sdr');
    return saved ? JSON.parse(saved) : INITIAL_SDR;
  });

  const [invoices, setInvoices] = useState<SPPInvoice[]>(() => {
    const saved = localStorage.getItem('ls_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('ls_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [schedules, setSchedules] = useState<StudentScheduleItem[]>(() => {
    const saved = localStorage.getItem('ls_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [attendance, setAttendance] = useState<StudentAttendanceItem[]>(() => {
    const saved = localStorage.getItem('ls_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [consultations, setConsultations] = useState<ConsultationRequest[]>(() => {
    const saved = localStorage.getItem('ls_consultations');
    return saved ? JSON.parse(saved) : INITIAL_CONSULTATIONS;
  });

  // Synchronize initial data from Supabase if connected
  const loadSupabaseData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [
        dbStudents, 
        dbStaff, 
        dbClasses, 
        dbPositions,
        dbPrograms,
        dbAdmissions, 
        dbObsSlots,
        dbTasks,
        dbCases,
        dbSdr,
        dbInvoices, 
        dbGallery, 
        dbConsultations
      ] = await Promise.all([
        fetchStudentsFromSupabase(),
        fetchStaffFromSupabase(),
        fetchClassesFromSupabase(),
        fetchPositionsFromSupabase(),
        fetchProgramsFromSupabase(),
        fetchAdmissionsFromSupabase(),
        fetchObservationSlotsFromSupabase(),
        fetchTasksFromSupabase(),
        fetchCasesFromSupabase(),
        fetchSDRFromSupabase(),
        fetchInvoicesFromSupabase(),
        fetchGalleryFromSupabase(),
        fetchConsultationsFromSupabase()
      ]);

      if (dbStudents && dbStudents.length > 0) setStudents(dbStudents);
      if (dbStaff && dbStaff.length > 0) setStaff(dbStaff);
      if (dbClasses && dbClasses.length > 0) setClasses(dbClasses);
      if (dbPositions && dbPositions.length > 0) setPositions(dbPositions);
      if (dbPrograms && dbPrograms.length > 0) setDetailedPrograms(dbPrograms);
      if (dbAdmissions && dbAdmissions.length > 0) setAdmissions(dbAdmissions);
      if (dbObsSlots && dbObsSlots.length > 0) setObservationSlots(dbObsSlots);
      if (dbTasks && dbTasks.length > 0) setTasks(dbTasks);
      if (dbCases && dbCases.length > 0) setCases(dbCases);
      if (dbSdr && Object.keys(dbSdr).length > 0) setSdrRecords(dbSdr);
      if (dbInvoices && dbInvoices.length > 0) setInvoices(dbInvoices);
      if (dbGallery && dbGallery.length > 0) setGallery(dbGallery);
      if (dbConsultations && dbConsultations.length > 0) setConsultations(dbConsultations);
    } catch (err) {
      console.warn('Initial load from Supabase failed, using local cache:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadSupabaseData();

    // Setup Realtime Subscription so all tabs/users stay synchronized automatically
    const unsubscribe = subscribeToAllChanges((table) => {
      const managedTables = [
        'students', 'staff', 'classes', 'positions', 'programs',
        'admissions', 'observation_slots', 'tasks', 'student_cases',
        'student_development_records', 'invoices', 'gallery', 'consultation_requests'
      ];
      if (managedTables.includes(table)) {
        loadSupabaseData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loadSupabaseData]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ls_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ls_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('ls_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('ls_positions', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem('ls_programs', JSON.stringify(detailedPrograms));
  }, [detailedPrograms]);

  useEffect(() => {
    localStorage.setItem('ls_admissions', JSON.stringify(admissions));
  }, [admissions]);

  useEffect(() => {
    localStorage.setItem('ls_obs_slots', JSON.stringify(observationSlots));
  }, [observationSlots]);

  useEffect(() => {
    localStorage.setItem('ls_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ls_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('ls_sdr', JSON.stringify(sdrRecords));
  }, [sdrRecords]);

  useEffect(() => {
    localStorage.setItem('ls_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('ls_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('ls_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('ls_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('ls_consultations', JSON.stringify(consultations));
  }, [consultations]);

  // Student Actions
  const addStudent = (newStd: Omit<Student, 'id'> & { id?: string }): string => {
    const id = newStd.id || generateUUID();
    const student: Student = { ...newStd, id };
    setStudents(prev => [student, ...prev]);
    saveStudentToSupabase(student);
    return id;
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === id) {
          const item = { ...s, ...data };
          saveStudentToSupabase(item);
          return item;
        }
        return s;
      });
      return updated;
    });
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    deleteStudentFromSupabase(id);
  };

  // Staff Actions
  const addStaff = (member: Omit<StaffMember, 'id'> & { id?: string }): string => {
    const id = member.id || generateUUID();
    const newMember: StaffMember = { ...member, id };
    setStaff(prev => [newMember, ...prev]);
    saveStaffToSupabase(newMember);
    return id;
  };

  const updateStaff = (id: string, data: Partial<StaffMember>) => {
    setStaff(prev => {
      const updated = prev.map(s => {
        if (s.id === id) {
          const item = { ...s, ...data };
          saveStaffToSupabase(item);
          return item;
        }
        return s;
      });
      return updated;
    });
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    deleteStaffFromSupabase(id);
  };

  // Class Actions
  const addClass = (cls: Omit<SchoolClass, 'id'>) => {
    const id = generateUUID();
    const newClass: SchoolClass = { ...cls, id };
    setClasses(prev => [...prev, newClass]);
    saveClassToSupabase(newClass);
  };

  const updateClass = (id: string, data: Partial<SchoolClass>) => {
    setClasses(prev => {
      const updated = prev.map(c => {
        if (c.id === id) {
          const item = { ...c, ...data };
          saveClassToSupabase(item);
          return item;
        }
        return c;
      });
      return updated;
    });
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    deleteClassFromSupabase(id);
  };

  // Position Actions
  const addPosition = (pos: Omit<JobPosition, 'id'>) => {
    const id = `pos-${Date.now().toString().slice(-4)}`;
    const newPos: JobPosition = { ...pos, id };
    setPositions(prev => [...prev, newPos]);
    savePositionToSupabase(newPos);
  };

  const updatePosition = (id: string, data: Partial<JobPosition>) => {
    setPositions(prev => prev.map(p => {
      if (p.id === id) {
        const item = { ...p, ...data };
        savePositionToSupabase(item);
        return item;
      }
      return p;
    }));
  };

  const deletePosition = (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
    deletePositionFromSupabase(id);
  };

  // Program Actions
  const addProgram = (prog: Omit<SchoolProgramDetail, 'id'>) => {
    const id = `prog-${Date.now().toString().slice(-4)}`;
    const newProg: SchoolProgramDetail = { ...prog, id };
    setDetailedPrograms(prev => [...prev, newProg]);
    saveProgramToSupabase(newProg);
  };

  const updateProgram = (id: string, data: Partial<SchoolProgramDetail>) => {
    setDetailedPrograms(prev => prev.map(p => {
      if (p.id === id) {
        const item = { ...p, ...data };
        saveProgramToSupabase(item);
        return item;
      }
      return p;
    }));
  };

  const deleteProgram = (id: string) => {
    setDetailedPrograms(prev => prev.filter(p => p.id !== id));
    deleteProgramFromSupabase(id);
  };

  // Admission Actions
  const addAdmission = (data: Omit<AdmissionApplication, 'id' | 'applicationNumber' | 'createdAt'>): string => {
    const id = generateUUID();
    const appNum = `PSB-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newAdm: AdmissionApplication = {
      ...data,
      id,
      applicationNumber: appNum,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAdmissions(prev => [newAdm, ...prev]);
    saveAdmissionToSupabase(newAdm);

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Pendaftaran Siswa Baru Masuk',
        message: `${newAdm.childName} mendaftar program: ${newAdm.selectedPrograms.join(', ')}`,
        type: 'admission',
        priority: 'high',
        createdAt: 'Baru saja',
        isRead: false
      },
      ...prev
    ]);
    return id;
  };

  const verifyAdmissionPayment = (id: string, isApproved: boolean) => {
    setAdmissions(prev => prev.map(a => {
      if (a.id === id) {
        const item: AdmissionApplication = {
          ...a,
          paymentStatus: isApproved ? 'terverifikasi' : 'ditolak'
        };
        saveAdmissionToSupabase(item);
        return item;
      }
      return a;
    }));
  };

  const createObservationSlot = (slotData: Omit<ObservationSlot, 'id' | 'bookedCount'>) => {
    const newSlot: ObservationSlot = {
      ...slotData,
      id: generateUUID(),
      bookedCount: 0
    };
    setObservationSlots(prev => [...prev, newSlot]);
    saveObservationSlotToSupabase(newSlot);
  };

  const bookObservationSlot = (admissionId: string, slotId: string) => {
    const slot = observationSlots.find(s => s.id === slotId);
    if (!slot || slot.bookedCount >= slot.capacity) return;

    const updatedSlot = { ...slot, bookedCount: slot.bookedCount + 1 };
    setObservationSlots(prev => prev.map(s => s.id === slotId ? updatedSlot : s));
    saveObservationSlotToSupabase(updatedSlot);

    setAdmissions(prev => prev.map(a => {
      if (a.id === admissionId) {
        const item: AdmissionApplication = {
          ...a,
          observationStatus: 'terjadwal',
          observationSlot: {
            date: slot.date,
            time: slot.timeSlot,
            assessorName: slot.assessorName,
            room: slot.room
          }
        };
        saveAdmissionToSupabase(item);
        return item;
      }
      return a;
    }));
  };

  const admitStudentFromAdmission = (admissionId: string, className: string) => {
    const adm = admissions.find(a => a.id === admissionId);
    if (!adm) return;

    const newStudentId = generateUUID();
    const newStudent: Student = {
      id: newStudentId,
      nis: `LS-2026-${String(students.length + 1).padStart(3, '0')}`,
      fullName: adm.childName,
      nickname: adm.childNickname || adm.childName.split(' ')[0],
      gender: adm.gender,
      birthPlace: adm.birthPlace,
      birthDate: adm.birthDate,
      address: adm.address,
      photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
      joinDate: new Date().toISOString().split('T')[0],
      academicYear: '2026/2027',
      status: 'aktif',
      className: className || 'Bintang Kejora (Kelas A)',
      enrolledPrograms: adm.selectedPrograms,
      specialNeedsNotes: adm.notes,
      parent: {
        fatherName: adm.parentName.split('&')[0]?.trim() || adm.parentName,
        motherName: adm.parentName.split('&')[1]?.trim() || '',
        relationship: 'Orang Tua',
        whatsapp: adm.parentPhone,
        email: adm.parentEmail,
        address: adm.address,
        emergencyContact: `${adm.parentPhone} (${adm.parentName})`
      }
    };

    setStudents(prev => [newStudent, ...prev]);
    saveStudentToSupabase(newStudent);

    setAdmissions(prev => prev.map(a => {
      if (a.id === admissionId) {
        const updatedAdm: AdmissionApplication = { ...a, admissionDecision: 'diterima' };
        saveAdmissionToSupabase(updatedAdm);
        return updatedAdm;
      }
      return a;
    }));
  };

  const deleteAdmission = (id: string) => {
    setAdmissions(prev => prev.filter(a => a.id !== id));
    deleteAdmissionFromSupabase(id);
  };

  // Task Actions
  const addTask = (task: Omit<TeacherTask, 'id'>) => {
    const id = generateUUID();
    const newTask: TeacherTask = { ...task, id };
    setTasks(prev => [newTask, ...prev]);
    saveTaskToSupabase(newTask);
  };

  const updateTask = (id: string, data: Partial<TeacherTask>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const item = { ...t, ...data };
        saveTaskToSupabase(item);
        return item;
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    deleteTaskFromSupabase(id);
  };

  const updateTaskStatus = (id: string, status: TeacherTask['status'], reviewerNotes?: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const item: TeacherTask = {
          ...t,
          status,
          reviewerNotes: reviewerNotes !== undefined ? reviewerNotes : t.reviewerNotes,
          submissionDate: status === 'dikirim' ? new Date().toISOString().split('T')[0] : t.submissionDate
        };
        saveTaskToSupabase(item);
        return item;
      }
      return t;
    }));
  };

  // Case Actions
  const addCase = (data: Omit<StudentCase, 'id' | 'caseNumber' | 'dateTime'>) => {
    const id = generateUUID();
    const caseNumber = `CS-2026-${String(cases.length + 1).padStart(3, '0')}`;
    const newCase: StudentCase = {
      ...data,
      id,
      caseNumber,
      dateTime: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'
    };
    setCases(prev => [newCase, ...prev]);
    saveCaseToSupabase(newCase);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Laporan Kasus: ${newCase.studentName}`,
        message: `Prioritas: ${newCase.priority.toUpperCase()} - ${newCase.description.slice(0, 50)}...`,
        type: 'case',
        priority: newCase.priority === 'tinggi' || newCase.priority === 'darurat' ? 'high' : 'normal',
        createdAt: 'Baru saja',
        isRead: false
      },
      ...prev
    ]);
  };

  const updateCaseStatus = (id: string, status: StudentCase['status'], followUpNotes?: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === id) {
        const item: StudentCase = {
          ...c,
          status,
          resolutionNotes: followUpNotes || c.resolutionNotes,
          resolvedAt: status === 'selesai' ? new Date().toISOString().split('T')[0] : c.resolvedAt
        };
        saveCaseToSupabase(item);
        return item;
      }
      return c;
    }));
  };

  // SDR Actions
  const updateSDR = (studentId: string, record: Partial<StudentDevelopmentRecord>) => {
    setSdrRecords(prev => {
      const existing = prev[studentId] || {
        studentId,
        academicYear: '2026/2027',
        lastUpdated: new Date().toISOString().split('T')[0],
        summaryNotes: '',
        scores: [],
        programDecision: 'CONTINUE',
        decisionRationale: '',
        planningMatrix: []
      };
      const updated: StudentDevelopmentRecord = {
        ...existing,
        ...record,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      saveSDRToSupabase(studentId, updated);
      return {
        ...prev,
        [studentId]: updated
      };
    });
  };

  const setProgramDecision = (studentId: string, decision: 'CONTINUE' | 'MODIFY' | 'REPLACE', rationale: string) => {
    updateSDR(studentId, {
      programDecision: decision,
      decisionRationale: rationale,
      principalApprovalDate: new Date().toISOString().split('T')[0]
    });
  };

  // Finance Actions
  const verifyInvoicePayment = (invoiceId: string, isApproved: boolean) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const item: SPPInvoice = {
          ...inv,
          status: isApproved ? 'lunas' : 'ditolak',
          paidAmount: isApproved ? inv.amount : inv.paidAmount,
          verifiedBy: isApproved ? 'Bapak Ilham Pratama, S.E.' : undefined
        };
        saveInvoiceToSupabase(item);
        return item;
      }
      return inv;
    }));
  };

  const uploadPaymentProof = (invoiceId: string, proofUrl: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const item: SPPInvoice = {
          ...inv,
          paymentProofUrl: proofUrl,
          paymentDate: new Date().toISOString().split('T')[0],
          status: 'menunggu_verifikasi'
        };
        saveInvoiceToSupabase(item);
        return item;
      }
      return inv;
    }));
  };

  const createInvoice = (data: Omit<SPPInvoice, 'id' | 'invoiceNumber'>) => {
    const id = generateUUID();
    const invNum = `INV/2026/10/${String(invoices.length + 1).padStart(3, '0')}`;
    const newInvoice: SPPInvoice = { ...data, id, invoiceNumber: invNum };
    setInvoices(prev => [newInvoice, ...prev]);
    saveInvoiceToSupabase(newInvoice);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Consultation Actions
  const addConsultationRequest = (data: Omit<ConsultationRequest, 'id' | 'createdAt' | 'status'>) => {
    const id = generateUUID();
    const newReq: ConsultationRequest = {
      ...data,
      id,
      status: 'menunggu_konfirmasi',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setConsultations(prev => [newReq, ...prev]);
    saveConsultationToSupabase(newReq);

    // Send high priority notification to principal & staff
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Pengajuan Konsultasi: ${newReq.parentName}`,
        message: `Topik: ${newReq.topic} untuk ananda ${newReq.studentName}`,
        type: 'supervision',
        priority: 'high',
        createdAt: 'Baru saja',
        isRead: false
      },
      ...prev
    ]);
  };

  const updateConsultationStatus = (
    id: string, 
    status: ConsultationRequest['status'], 
    feedbackNotes?: string, 
    confirmedDate?: string, 
    confirmedTime?: string
  ) => {
    setConsultations(prev => prev.map(c => {
      if (c.id === id) {
        const item: ConsultationRequest = {
          ...c,
          status,
          feedbackNotes: feedbackNotes !== undefined ? feedbackNotes : c.feedbackNotes,
          confirmedDate: confirmedDate || c.confirmedDate,
          confirmedTime: confirmedTime || c.confirmedTime
        };
        saveConsultationToSupabase(item);
        return item;
      }
      return c;
    }));
  };

  // Gallery Management
  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'date'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: generateUUID(),
      date: new Date().toISOString().split('T')[0]
    };
    setGallery(prev => [newItem, ...prev]);
    saveGalleryItemToSupabase(newItem);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    deleteGalleryItemFromSupabase(id);
  };

  const toggleTakeDownGalleryItem = (id: string) => {
    setGallery(prev => prev.map(g => {
      if (g.id === id) {
        const item = { ...g, isPublic: !g.isPublic };
        saveGalleryItemToSupabase(item);
        return item;
      }
      return g;
    }));
  };

  return (
    <SchoolDataContext.Provider value={{
      students,
      staff,
      classes,
      positions,
      detailedPrograms,
      admissions,
      observationSlots,
      tasks,
      cases,
      sdrRecords,
      invoices,
      gallery,
      notifications,
      schedules,
      attendance,
      consultations,
      isSyncing,
      addStudent,
      updateStudent,
      deleteStudent,
      addStaff,
      updateStaff,
      deleteStaff,
      addClass,
      updateClass,
      deleteClass,
      addPosition,
      updatePosition,
      deletePosition,
      addProgram,
      updateProgram,
      deleteProgram,
      addAdmission,
      verifyAdmissionPayment,
      bookObservationSlot,
      createObservationSlot,
      admitStudentFromAdmission,
      deleteAdmission,
      addTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      addCase,
      updateCaseStatus,
      updateSDR,
      setProgramDecision,
      verifyInvoicePayment,
      uploadPaymentProof,
      createInvoice,
      addConsultationRequest,
      updateConsultationStatus,
      addGalleryItem,
      deleteGalleryItem,
      toggleTakeDownGalleryItem,
      markNotificationAsRead,
      refreshAllData: loadSupabaseData
    }}>
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => {
  const ctx = useContext(SchoolDataContext);
  if (!ctx) throw new Error('useSchoolData must be used within SchoolDataProvider');
  return ctx;
};
