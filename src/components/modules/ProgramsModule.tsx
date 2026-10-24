import React from 'react';
import { 
  Sun, 
  HeartHandshake, 
  Sparkles, 
  UserCheck, 
  Clock, 
  Users, 
  Calendar,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { SCHOOL_PROGRAMS } from '../../lib/mockData';

export const ProgramsModule: React.FC = () => {
  const iconMap = {
    Sun: Sun,
    HeartHandshake: HeartHandshake,
    Sparkles: Sparkles,
    UserCheck: UserCheck
  };

  const programDetails = [
    {
      id: 'sekolah_pagi',
      title: 'Program Sekolah Pagi (Early Childhood Education)',
      shortDesc: 'Kurikulum bermain & belajar holistik untuk mengasah sensorik, kognitif, motorik, dan sosialisasi anak usia dini.',
      schedule: 'Senin - Jumat | 08.00 - 11.30 WIB',
      age: '2 - 6 Tahun',
      points: [
        'Sensory Play & Eksplorasi Kreatif Harian',
        'Pra-Literasi & Pra-Matematika Menyenangkan',
        'Pembiasaan Adab, Kemandirian & Sosialisasi',
        'Rasio Guru-Anak Kecil (1 Guru : 5 Anak)',
        'Ruang Kelas Luas, Ber-AC & Ramah Anak'
      ],
      spesial: 'Pendekatan Inklusif ramah neurodiversitas'
    },
    {
      id: 'terapi',
      title: 'Layanan Terapi Terpadu',
      shortDesc: 'Terapi Wicara (Speech Therapy), Okupasi, Sensori Integrasi, dan Perilaku (ABA) bersama terapis berpengalaman.',
      schedule: 'Sesi Khusus (Senin - Sabtu | 08.00 - 17.00 WIB)',
      age: '1.5 - 12 Tahun',
      points: [
        'Terapi Wicara & Artikulasi Oral Motor',
        'Sensori Integrasi (Vestibular & Proprioseptif)',
        'Terapi Okupasi & Kemandirian Aktivitas Keseharian (ADL)',
        'Terapi Perilaku (Applied Behavior Analysis / ABA)',
        'Ruangan Sensori Gym Khusus & Trampolin'
      ],
      spesial: 'Evaluasi berkala setiap bulan & laporan 3 bulanan'
    },
    {
      id: 'daycare',
      title: 'DayCare & Pengasuhan Edukatif',
      shortDesc: 'Pengasuhan penuh kasih sayang, stimulasi nutrisi, jadwal tidur teratur, toilet training, serta pembiasaan karakter baik.',
      schedule: 'Senin - Jumat | 07.30 - 17.30 WIB (Full Day)',
      age: '1 - 6 Tahun',
      points: [
        'Makanan & Snack Sehat Bergizi Terjadwal',
        'Tidur Siang Nyaman di Tempat Tidur Bersih Individual',
        'Stimulasi Tumbuh Kembang Setiap Pagi & Sore',
        'Toilet Training Terbimbing dan Sabar',
        'Laporan Harian (Daily Log) Makan, Tidur & BAB/BAK'
      ],
      spesial: 'Didampingi tenaga bidan & pengasuh bersertifikat'
    },
    {
      id: 'shadow',
      title: 'Pendampingan Khusus (Shadow Teacher)',
      shortDesc: 'Pendampingan 1-on-1 di kelas untuk membantu anak dengan kebutuhan khusus beradaptasi, fokus, dan mandiri.',
      schedule: 'Menyesuaikan Jam Sekolah Anak',
      age: '3 - 10 Tahun',
      points: [
        'Pendampingan 1 Guru untuk 1 Anak di Dalam Kelas',
        'Membantu Regulasi Emosi & Fokus Belajar',
        'Menjembatani Interaksi Sosial dengan Teman Sebaya',
        'Penyusunan Individualized Education Program (IEP)',
        'Laporan Perkembangan Harian & Evaluasi Semesteran'
      ],
      spesial: 'Lulusan Pendidikan Luar Biasa (PLB) & Psikologi'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            Kurikulum & Layanan
          </span>
          <span className="text-xs text-slate-500">Little Star Learning Center</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mt-1">
          Empat Program Pendidikan Sekolah
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Sesuai Bagian 10 PRD: Seluruh program terintegrasi dan saling melengkapi tumbuh kembang anak secara optimal.
        </p>
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programDetails.map(prog => (
          <div
            key={prog.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {prog.age}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> {prog.schedule}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-2">{prog.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{prog.shortDesc}</p>

              <div className="space-y-2 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                  Fasilitas & Keunggulan Program:
                </div>
                {prog.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-1 rounded">
                ⭐ {prog.spesial}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
