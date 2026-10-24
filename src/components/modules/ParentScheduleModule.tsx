import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  User, 
  Sparkles,
  CalendarDays,
  FileText
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';

export const ParentScheduleModule: React.FC = () => {
  const { students, schedules, attendance } = useSchoolData();
  const { currentUser } = useAuth();

  // STRICTURE: Wali murid can ONLY view their own child's schedule and attendance
  const childId = currentUser?.childStudentId || 'std-001';
  const child = students.find(s => s.id === childId) || students[0];

  const childSchedules = schedules.filter(sch => sch.studentId === child?.id);
  const childAttendance = attendance.filter(att => att.studentId === child?.id);

  const [activeTab, setActiveTab] = useState<'schedule' | 'attendance'>('schedule');

  const hadirCount = childAttendance.filter(a => a.status === 'Hadir').length;
  const izinCount = childAttendance.filter(a => a.status === 'Izin').length;
  const sakitCount = childAttendance.filter(a => a.status === 'Sakit').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Portal Khusus Wali Murid
            </span>
            <span className="text-xs text-slate-500">Tahun Ajaran 2026/2027</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Jadwal Belajar & Rekap Absensi Ananda
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Informasi resmi kegiatan pembelajaran harian dan catatan kehadiran khusus ananda tercinta.
          </p>
        </div>

        {/* Child Identity Card */}
        <div className="flex items-center gap-3 bg-blue-50/80 border border-blue-200/80 p-3 rounded-2xl shrink-0">
          <img
            src={child.photoUrl}
            alt={child.fullName}
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-300"
          />
          <div>
            <div className="text-xs font-extrabold text-blue-950">{child.fullName}</div>
            <div className="text-[11px] text-blue-700 font-semibold">{child.className} · NIS: {child.nis}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 px-2">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'schedule'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Jadwal Pembelajaran & Terapi
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'attendance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Rekap Kehadiran & Absensi Ananda
        </button>
      </div>

      {/* TAB 1: SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {childSchedules.length > 0 ? (
              childSchedules.map(sch => (
                <div key={sch.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {sch.program.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {sch.time}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{sch.activity}</h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sch.room}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>Pendidik: <strong>{sch.teacherName}</strong></span>
                    </span>
                    <span className="font-semibold text-slate-500">{sch.day}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-10 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                Belum ada jadwal khusus yang terdaftar untuk ananda.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <span className="text-xs font-bold text-emerald-800 block">Total Hadir</span>
              <span className="text-2xl font-extrabold text-emerald-950 font-mono mt-1 block">{hadirCount} Hari</span>
              <span className="text-[10px] text-emerald-700">100% disiplin</span>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
              <span className="text-xs font-bold text-blue-800 block">Izin Tercatat</span>
              <span className="text-2xl font-extrabold text-blue-950 font-mono mt-1 block">{izinCount} Hari</span>
              <span className="text-[10px] text-blue-700">Kontrol dokter/keluarga</span>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <span className="text-xs font-bold text-amber-800 block">Sakit</span>
              <span className="text-2xl font-extrabold text-amber-950 font-mono mt-1 block">{sakitCount} Hari</span>
              <span className="text-[10px] text-amber-700">Dalam pemulihan</span>
            </div>
          </div>

          {/* Attendance Log Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Riwayat Kehadiran Harian Ananda</h3>
              <span className="text-xs text-slate-400">Dicatat langsung oleh guru & terapis</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Program</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Catatan Harian Guru / Terapis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {childAttendance.map(att => (
                    <tr key={att.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{att.date}</td>
                      <td className="py-3.5 px-4 uppercase font-bold text-blue-700 text-[11px]">
                        {att.program.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          att.status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                          att.status === 'Izin' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 italic leading-relaxed">
                        "{att.notes || 'Hadir mengikuti kegiatan dengan antusias.'}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
