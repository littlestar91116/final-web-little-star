import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Film, 
  ShieldCheck, 
  Star, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Play, 
  X, 
  Upload, 
  CheckCircle2, 
  Crown, 
  ExternalLink, 
  MessageCircle, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { GalleryItem, ProgramType } from '../../types';

interface GalleryModuleProps {
  onOpenLanding?: () => void;
}

export const GalleryModule: React.FC<GalleryModuleProps> = ({ onOpenLanding }) => {
  const { currentUser } = useAuth();
  const { gallery, addGalleryItem, deleteGalleryItem, toggleTakeDownGalleryItem } = useSchoolData();
  const { getWhatsAppUrl } = useSiteSettings();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'public' | 'internal' | 'video' | 'image'>('all');
  const [selectedMediaItem, setSelectedMediaItem] = useState<GalleryItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Media Form State
  const [newTitle, setNewTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newProgram, setNewProgram] = useState<ProgramType>('sekolah_pagi');
  const [newCategory, setNewCategory] = useState<'kegiatan' | 'prestasi' | 'terapi' | 'outing' | 'projek'>('kegiatan');
  const [newDescription, setNewDescription] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(true);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMediaUrl.trim()) return;

    addGalleryItem({
      title: newTitle.trim(),
      mediaType: newMediaType,
      mediaUrl: newMediaUrl.trim(),
      program: newProgram,
      category: newCategory,
      description: newDescription.trim(),
      isPublic: newIsPublic,
      hasParentConsent: true
    });

    setNewTitle('');
    setNewMediaUrl('');
    setNewDescription('');
    setShowUploadModal(false);
    showNotification('Dokumentasi foto/video baru berhasil disimpan!');
  };

  const handleToggleTakeDown = (item: GalleryItem) => {
    toggleTakeDownGalleryItem(item.id);
    showNotification(
      item.isPublic 
        ? `"${item.title}" berhasil di-take down dari tampilan publik.` 
        : `"${item.title}" berhasil dipublikasikan ke website.`
    );
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) {
      deleteGalleryItem(id);
      showNotification(`"${title}" berhasil dihapus.`);
    }
  };

  const testimonials = [
    {
      id: 't-1',
      name: 'Ibu Ratna Dewi Kusuma',
      role: 'Bunda Dylan (Siswa Kelas A & Terapi Wicara)',
      content: 'Progres Dylan di Little Star luar biasa. Dalam 3 bulan terapi dan sekolah pagi, Dylan yang tadinya hanya menunjuk benda kini sudah bisa berbicara 2-3 kata dengan jelas dan percaya diri!',
      rating: 5,
      date: 'Oktober 2026'
    },
    {
      id: 't-2',
      name: 'Bapak Ferry Syarif',
      role: 'Ayah Keenan (Siswa Pendampingan Shadow)',
      content: 'Shadow Teacher Kak Dita sangat sabar dan mengerti kebutuhan sensori Keenan. Komunikasi lewat SDR harian sangat transparan sehingga kami orang tua tenang saat bekerja.',
      rating: 5,
      date: 'September 2026'
    },
    {
      id: 't-3',
      name: 'Ibu Larasati Kurnia',
      role: 'Bunda Mikha (Siswa Toddler DayCare)',
      content: 'DayCare Little Star benar-benar rumah kedua bagi Mikha. Pengasuhan edukatif, toilet training sukses, dan makannya selalu lahap. Terima kasih Bunda Fitri dan tim!',
      rating: 5,
      date: 'Oktober 2026'
    }
  ];

  const filteredGallery = gallery.filter(item => {
    if (selectedFilter === 'public') return item.isPublic;
    if (selectedFilter === 'internal') return !item.isPublic;
    if (selectedFilter === 'video') return item.mediaType === 'video';
    if (selectedFilter === 'image') return item.mediaType === 'image';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Module Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 uppercase tracking-wider shimmer-badge">
              Dokumentasi & Media Center
            </span>
            <span className="text-xs text-slate-500 font-medium">Privasi & Consent Terpadu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Galeri Foto & Video Pembelajaran
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            Koleksi dokumentasi aktivitas harian, capaian terapi sensori, serta testimoni wali murid. Super Admin memiliki hak penuh untuk mengunggah dan men-take down media.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onOpenLanding && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenLanding}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold shadow-md inline-flex items-center gap-2 border border-amber-400/30 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Lihat Web Galeri (Publik)</span>
            </motion.button>
          )}

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Sekolah</span>
          </a>

          {isSuperAdmin && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 inline-flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Unggah Media Baru</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `Semua Media (${gallery.length})` },
          { id: 'public', label: 'Galeri Publik' },
          { id: 'internal', label: 'Galeri Internal SDR' },
          { id: 'video', label: 'Khusus Video' },
          { id: 'image', label: 'Khusus Foto' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-black'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map(item => {
          const isVideo = item.mediaType === 'video';

          return (
            <div 
              key={item.id} 
              className={`bg-white rounded-3xl border overflow-hidden shadow-xs flex flex-col justify-between transition-all hover:shadow-xl ${
                item.isPublic ? 'border-slate-200/90' : 'border-rose-200 bg-rose-50/20'
              }`}
            >
              <div>
                {/* Media Thumbnail Container */}
                <div 
                  onClick={() => setSelectedMediaItem(item)}
                  className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer group"
                >
                  {isVideo ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                      {item.mediaUrl.endsWith('.mp4') ? (
                        <video 
                          src={item.mediaUrl} 
                          muted 
                          loop 
                          playsInline 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                          <Film className="w-12 h-12 text-slate-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      loading="lazy"
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md bg-slate-950/70 text-amber-300 border border-amber-300/30">
                    {isVideo ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    <span>{isVideo ? 'Video' : 'Foto'}</span>
                  </div>

                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs ${
                    item.isPublic
                      ? 'bg-emerald-600/90 text-white'
                      : 'bg-rose-600/90 text-white'
                  }`}>
                    {item.isPublic ? 'Tayang Publik' : 'Di-Take Down'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-blue-700 uppercase font-display">
                      {item.program.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <h3 
                    onClick={() => setSelectedMediaItem(item)}
                    className="text-sm font-bold text-slate-900 leading-snug hover:text-amber-600 transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Media Consent Disetujui
                </span>

                {isSuperAdmin && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleTakeDown(item)}
                      title={item.isPublic ? 'Take Down dari publik' : 'Publikasikan ke website'}
                      className={`p-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        item.isPublic 
                          ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      {item.isPublic ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{item.isPublic ? 'Take Down' : 'Tayang'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      title="Hapus file permanen"
                      className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Testimonials Section */}
      <div className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-7 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-black text-slate-900 font-display">Testimoni Sahabat Little Star</h3>
          </div>
          <p className="text-xs text-slate-500">Apresiasi dan pengalaman nyata orang tua wali murid yang bersekolah di Little Star</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <div key={t.id} className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">"{t.content}"</p>
              </div>

              <div className="pt-2.5 border-t border-amber-200/60">
                <div className="text-xs font-bold text-slate-900">{t.name}</div>
                <div className="text-[10px] text-slate-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Fullscreen Media Lightbox / Video Player */}
      <AnimatePresence>
        {selectedMediaItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMediaItem(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider font-display">
                    ★ {selectedMediaItem.program.replace('_', ' ')}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-400">{selectedMediaItem.date}</span>
                </div>
                <button
                  onClick={() => setSelectedMediaItem(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
                {selectedMediaItem.mediaType === 'video' ? (
                  selectedMediaItem.mediaUrl.endsWith('.mp4') ? (
                    <video 
                      src={selectedMediaItem.mediaUrl}
                      controls
                      autoPlay
                      playsInline
                      className="max-h-[60vh] w-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={selectedMediaItem.mediaUrl}
                      title={selectedMediaItem.title}
                      className="w-full aspect-video max-h-[60vh]"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                ) : (
                  <img
                    src={selectedMediaItem.mediaUrl}
                    alt={selectedMediaItem.title}
                    className="max-h-[60vh] w-full object-contain"
                  />
                )}
              </div>

              <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
                <h2 className="text-base sm:text-lg font-black text-white font-display">
                  {selectedMediaItem.title}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedMediaItem.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Super Admin Upload Media */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg bg-slate-900 rounded-3xl border border-amber-400/40 p-6 sm:p-7 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black text-white font-display">Unggah Foto / Video Baru</h3>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-display">
                    Judul Dokumentasi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sesi Terapi Wicara & Motorik Halus..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 font-display">
                      Jenis Media
                    </label>
                    <select
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="image">Foto (Gambar)</option>
                      <option value="video">Video (MP4 / Stream)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 font-display">
                      Program Sekolah
                    </label>
                    <select
                      value={newProgram}
                      onChange={(e) => setNewProgram(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="sekolah_pagi">Sekolah Pagi</option>
                      <option value="terapi">Layanan Terapi</option>
                      <option value="daycare">DayCare</option>
                      <option value="shadow">Shadow Teacher</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-display">
                    URL File / Tautan Media
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/... atau https://...mp4"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-display">
                    Deskripsi Dokumentasi
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan keterangan aktivitas stimulasi atau momen belajar ananda..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isPublicCheckModal"
                    checked={newIsPublic}
                    onChange={(e) => setNewIsPublic(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                  <label htmlFor="isPublicCheckModal" className="text-xs text-slate-300 cursor-pointer select-none">
                    Tayangkan langsung di Galeri Publik Little Star
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 shadow-lg shadow-amber-500/20 cursor-pointer uppercase tracking-wider"
                  >
                    Simpan & Unggah
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
