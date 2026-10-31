import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchSiteSettingsFromSupabase, saveSiteSettingsToSupabase } from '../lib/supabaseSchoolService';

export interface SiteSettings {
  // 1. Branding & Identitas Sekolah
  schoolName: string;
  schoolUnit: string;
  tagline: string;
  schoolDescription: string;
  logoUrl: string;
  accentTheme: 'royal_gold' | 'sapphire_blue' | 'emerald_luxury' | 'ruby_rose';

  // 2. Kontak & WhatsApp Konsultasi
  contactPhone: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  schoolEmail: string;
  schoolAddress: string;
  schoolOperatingHours: string;

  // 3. Tampilan Layar Awal (Landing Page & Hero Showcase)
  heroBadgeText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  showHeroAdmissionBtn: boolean;
  showHeroWhatsAppBtn: boolean;
  showFloatingWhatsApp: boolean;
  showTestimonialsSection: boolean;
  announcementBarEnabled: boolean;
  announcementBarText: string;

  // 4. Biaya & Rekening PSB
  admissionFee: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  admissionIsOpen: boolean;

  // 5. Pengaturan Program Sekolah
  programNames: {
    sekolah_pagi: string;
    terapi: string;
    daycare: string;
    shadow: string;
  };
  programFees: {
    sekolah_pagi: string;
    terapi: string;
    daycare: string;
    shadow: string;
  };

  // 6. Mode Sistem & Keamanan
  maintenanceMode: boolean;
  maintenanceMessage: string;
  requireMediaConsent: boolean;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  // 1. Branding
  schoolName: 'LITTLE STAR',
  schoolUnit: 'LEARNING CENTER',
  tagline: 'Membimbing Setiap Bintang Kecil Bersinar Sepenuh Hatinya',
  schoolDescription: 'Pusat Pembelajaran Inklusif & Layanan Terapi Terpadu Anak Berkebutuhan Khusus dan Reguler dengan Pendekatan Holistik.',
  logoUrl: '/assets/aistudio/Desain_tanpa_judul_20250712_130635_0000__1__c8a27306.png',
  accentTheme: 'royal_gold',

  // 2. Kontak
  contactPhone: '0821-9998-8769',
  whatsappNumber: '6282199988769',
  whatsappDefaultMessage: 'Assalamu’alaikum warahmatullahi wabarakatuh. Selamat pagi, Mr/Mrs. Mohon izin menghubungi. Perkenalkan, saya [Nama]. Saya ingin menanyakan informasi terkait [keperluan yang ingin ditanyakan] di sekolah. Mohon informasi dan arahannya. Terima kasih atas waktu dan bantuannya. Wassalamu’alaikum warahmatullahi wabarakatuh.',
  schoolEmail: 'info@littlestar.sch.id',
  schoolAddress: 'Jl. Melati Raya No. 18, Kebayoran Baru, Jakarta Selatan',
  schoolOperatingHours: 'Senin - Jumat: 07.30 - 16.30 WIB | Sabtu: 08.00 - 12.00 WIB',

  // 3. Layar Awal
  heroBadgeText: 'Dokumentasi Resmi Little Star Learning Center',
  heroTitle: 'Galeri Foto & Video Pembelajaran Inklusif',
  heroSubtitle: 'Membimbing Setiap Bintang Kecil Bersinar Sepenuh Hatinya. Potret kehangatan stimulasi motorik, terapi sensori integrasi, dan kemandirian ananda.',
  heroCtaText: 'Daftar Siswa Baru (PSB Online)',
  showHeroAdmissionBtn: true,
  showHeroWhatsAppBtn: true,
  showFloatingWhatsApp: true,
  showTestimonialsSection: true,
  announcementBarEnabled: true,
  announcementBarText: '🌟 Pendaftaran Siswa Baru (PSB) Tahun Ajaran 2026/2027 Telah Dibuka! Hubungi WhatsApp untuk Jadwal Observasi.',

  // 4. Biaya & Rekening
  admissionFee: 500000,
  bankName: 'BCA',
  bankAccountNumber: '8271-9982-10',
  bankAccountHolder: 'LITTLE STAR LEARNING CENTER',
  admissionIsOpen: true,

  // 5. Program
  programNames: {
    sekolah_pagi: 'Sekolah Pagi (Inklusif)',
    terapi: 'Layanan Terapi Terpadu',
    daycare: 'DayCare Edukatif',
    shadow: 'Shadow Teacher Pendamping'
  },
  programFees: {
    sekolah_pagi: 'Rp 1.500.000 / bulan',
    terapi: 'Rp 250.000 / sesi',
    daycare: 'Rp 2.000.000 / bulan',
    shadow: 'Rp 3.500.000 / bulan'
  },

  // 6. Mode Sistem
  maintenanceMode: false,
  maintenanceMessage: 'Website Little Star Learning Center sedang dalam pemeliharaan berkala untuk peningkatan layanan. Silakan hubungi WhatsApp kami.',
  requireMediaConsent: true
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  resetSettings: () => void;
  getWhatsAppUrl: (customMessage?: string) => string;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('ls_site_settings');
      if (saved) {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load site settings from localStorage', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  // Load from Supabase on mount
  useEffect(() => {
    async function loadRemoteSettings() {
      try {
        const remoteSettings = await fetchSiteSettingsFromSupabase();
        if (remoteSettings && typeof remoteSettings === 'object') {
          setSettings(prev => ({ ...prev, ...remoteSettings }));
        }
      } catch (err) {
        console.warn('Failed to load remote site settings:', err);
      }
    }
    loadRemoteSettings();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ls_site_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save site settings to localStorage', e);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSiteSettingsToSupabase(updated);
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    saveSiteSettingsToSupabase(DEFAULT_SITE_SETTINGS);
  };

  const getWhatsAppUrl = (customMessage?: string): string => {
    const rawNumber = settings.whatsappNumber.replace(/[^0-9]/g, '') || '6282199988769';
    const message = customMessage || settings.whatsappDefaultMessage;
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, resetSettings, getWhatsAppUrl }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
