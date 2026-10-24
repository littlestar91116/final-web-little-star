import React, { createContext, useContext, useState, useEffect } from 'react';
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
  ConsultationRequest,
  StudentScheduleItem,
  StudentAttendanceItem
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_STAFF, 
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

interface SchoolDataContextType {
  students: Student[];
  staff: StaffMember[];
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

  // Student Actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  
  // Admission Actions
  addAdmission: (admission: Omit<AdmissionApplication, 'id' | 'applicationNumber' | 'createdAt'>) => string;
  verifyAdmissionPayment: (id: string, isApproved: boolean) => void;
  bookObservationSlot: (admissionId: string, slotId: string) => void;
  createObservationSlot: (slot: Omit<ObservationSlot, 'id' | 'bookedCount'>) => void;
  admitStudentFromAdmission: (admissionId: string, className: string) => void;

  // Task Actions
  addTask: (task: Omit<TeacherTask, 'id'>) => void;
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
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ls_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);

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

  useEffect(() => {
    localStorage.setItem('ls_gallery', JSON.stringify(gallery));
  }, [gallery]);

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

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ls_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('ls_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('ls_consultations', JSON.stringify(consultations));
  }, [consultations]);
  useEffect(() => {
    localStorage.setItem('ls_students', JSON.stringify(students));
  }, [students]);

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

  // Student Actions
  const addStudent = (newStd: Omit<Student, 'id'>) => {
    const id = `std-${Date.now().toString().slice(-4)}`;
    setStudents(prev => [{ ...newStd, id }, ...prev]);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  // Admission Actions
  const addAdmission = (data: Omit<AdmissionApplication, 'id' | 'applicationNumber' | 'createdAt'>): string => {
    const id = `adm-${Date.now().toString().slice(-4)}`;
    const appNum = `PSB-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newAdm: AdmissionApplication = {
      ...data,
      id,
      applicationNumber: appNum,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAdmissions(prev => [newAdm, ...prev]);

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
        return {
          ...a,
          paymentStatus: isApproved ? 'terverifikasi' : 'ditolak'
        };
      }
      return a;
    }));
  };

  const createObservationSlot = (slotData: Omit<ObservationSlot, 'id' | 'bookedCount'>) => {
    const newSlot: ObservationSlot = {
      ...slotData,
      id: `obs-${Date.now().toString().slice(-4)}`,
      bookedCount: 0
    };
    setObservationSlots(prev => [...prev, newSlot]);
  };

  const bookObservationSlot = (admissionId: string, slotId: string) => {
    const slot = observationSlots.find(s => s.id === slotId);
    if (!slot || slot.bookedCount >= slot.capacity) return;

    setObservationSlots(prev => prev.map(s => s.id === slotId ? { ...s, bookedCount: s.bookedCount + 1 } : s));
    setAdmissions(prev => prev.map(a => {
      if (a.id === admissionId) {
        return {
          ...a,
          observationStatus: 'terjadwal',
          observationSlot: {
            date: slot.date,
            time: slot.timeSlot,
            assessorName: slot.assessorName,
            room: slot.room
          }
        };
      }
      return a;
    }));
  };

  const admitStudentFromAdmission = (admissionId: string, className: string) => {
    const adm = admissions.find(a => a.id === admissionId);
    if (!adm) return;

    const newStudent: Student = {
      id: `std-${Date.now().toString().slice(-4)}`,
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
    setAdmissions(prev => prev.map(a => a.id === admissionId ? { ...a, admissionDecision: 'diterima' } : a));
  };

  // Task Actions
  const addTask = (task: Omit<TeacherTask, 'id'>) => {
    const id = `tsk-${Date.now().toString().slice(-4)}`;
    setTasks(prev => [{ ...task, id }, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TeacherTask['status'], reviewerNotes?: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status,
          reviewerNotes: reviewerNotes !== undefined ? reviewerNotes : t.reviewerNotes,
          submissionDate: status === 'dikirim' ? new Date().toISOString().split('T')[0] : t.submissionDate
        };
      }
      return t;
    }));
  };

  // Case Actions
  const addCase = (data: Omit<StudentCase, 'id' | 'caseNumber' | 'dateTime'>) => {
    const id = `cas-${Date.now().toString().slice(-4)}`;
    const caseNumber = `CS-2026-${String(cases.length + 1).padStart(3, '0')}`;
    const newCase: StudentCase = {
      ...data,
      id,
      caseNumber,
      dateTime: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'
    };
    setCases(prev => [newCase, ...prev]);

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
        return {
          ...c,
          status,
          resolutionNotes: followUpNotes || c.resolutionNotes,
          resolvedAt: status === 'selesai' ? new Date().toISOString().split('T')[0] : c.resolvedAt
        };
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
      return {
        ...prev,
        [studentId]: {
          ...existing,
          ...record,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
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
        return {
          ...inv,
          status: isApproved ? 'lunas' : 'ditolak',
          paidAmount: isApproved ? inv.amount : inv.paidAmount,
          verifiedBy: isApproved ? 'Bapak Ilham Pratama, S.E.' : undefined
        };
      }
      return inv;
    }));
  };

  const uploadPaymentProof = (invoiceId: string, proofUrl: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          paymentProofUrl: proofUrl,
          paymentDate: new Date().toISOString().split('T')[0],
          status: 'menunggu_verifikasi'
        };
      }
      return inv;
    }));
  };

  const createInvoice = (data: Omit<SPPInvoice, 'id' | 'invoiceNumber'>) => {
    const id = `inv-${Date.now().toString().slice(-4)}`;
    const invNum = `INV/2026/10/${String(invoices.length + 1).padStart(3, '0')}`;
    setInvoices(prev => [{ ...data, id, invoiceNumber: invNum }, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const addConsultationRequest = (data: Omit<ConsultationRequest, 'id' | 'createdAt' | 'status'>) => {
    const id = `cst-${Date.now().toString().slice(-4)}`;
    const newReq: ConsultationRequest = {
      ...data,
      id,
      status: 'menunggu_konfirmasi',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setConsultations(prev => [newReq, ...prev]);

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
        return {
          ...c,
          status,
          feedbackNotes: feedbackNotes !== undefined ? feedbackNotes : c.feedbackNotes,
          confirmedDate: confirmedDate || c.confirmedDate,
          confirmedTime: confirmedTime || c.confirmedTime
        };
      }
      return c;
    }));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'date'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setGallery(prev => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  const toggleTakeDownGalleryItem = (id: string) => {
    setGallery(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, isPublic: !g.isPublic };
      }
      return g;
    }));
  };

  return (
    <SchoolDataContext.Provider value={{
      students,
      staff,
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
      addStudent,
      updateStudent,
      addAdmission,
      verifyAdmissionPayment,
      bookObservationSlot,
      createObservationSlot,
      admitStudentFromAdmission,
      addTask,
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
      markNotificationAsRead
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
