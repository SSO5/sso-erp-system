import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, Folder, FolderOpen, FileText, Briefcase, 
  LogOut, Plus, Search, Lock, Menu, X,
  FileDigit, Clock, CheckCircle2, XCircle, AlertCircle,
  Download, File, ChevronRight, FileUp
} from 'lucide-react';

// Fungsi bantuan untuk memformat data agar lebih mudah dibaca
const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const getRomanMonth = (monthIndex) => ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][monthIndex];
const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Struktur 7 Pilar Perusahaan sesuai standar operasional SSO
const CORPORATE_FOLDERS = [
  {
    id: '01',
    name: '01_LEGAL_KORPORASI_DAN_PERIZINAN',
    label: 'Legal, Korporasi & Perizinan',
    subfolders: ['Akta & Legalitas Perusahaan', 'Perizinan (NIB, dll)', 'Kontrak Klien (PKS)', 'Kontrak Vendor & Mitra']
  },
  {
    id: '02',
    name: '02_KEUANGAN_AKUNTANSI_DAN_PAJAK_PUSAT',
    label: 'Keuangan, Akuntansi & Pajak',
    subfolders: ['Invoice Keluar (AR)', 'Tagihan Masuk (AP)', 'Faktur Pajak & SPT', 'Laporan Keuangan & Rekening Koran']
  },
  {
    id: '03',
    name: '03_HRD_GENERAL_AFFAIR_DAN_ASET',
    label: 'HRD, General Affair & Aset',
    subfolders: ['Data Karyawan & Kontrak', 'Payroll, Absensi & Cuti', 'SOP & Kebijakan Perusahaan', 'Manajemen Aset & Inventaris']
  },
  {
    id: '04',
    name: '04_MARKETING_SALES_DAN_TENDER',
    label: 'Marketing, Sales & Tender',
    subfolders: ['Company Profile & Legalitas Tender', 'Dokumen Tender & Kualifikasi', 'Proposal Penawaran (Quotation)', 'Materi Promosi & Brosur']
  },
  {
    id: '05',
    name: '05_OPERASIONAL_DAN_MANAJEMEN_PROYEK',
    label: 'Operasional & Manajemen Proyek',
    subfolders: ['Dashboard Job Order', 'Laporan Progress Proyek', 'Berita Acara (BAST & BAPP)', 'Timesheet & Laporan Harian']
  },
  {
    id: '06',
    name: '06_DATABASE_SUPPLY_CHAIN_DAN_VENDOR',
    label: 'Database, Supply Chain & Vendor',
    subfolders: ['Database Klien & Prospek', 'Database Vendor & Supplier', 'Katalog Harga & Pricelist', 'Purchase Order (PO)']
  },
  {
    id: '07',
    name: '07_MASTER_TEMPLATE_SISTEM',
    label: 'Master Template Sistem',
    subfolders: ['Sistem Penomoran Dokumen', 'Template Form Kosong', 'Aset Desain (Logo, Kop Surat)']
  }
];

// Data Dummy untuk inisialisasi awal sistem
const initialNumbers = [
  { id: '1', docNumber: '001/SSO-INV/VII/2026', category: 'INV', description: 'Invoice DP 50% Pengadaan Server', date: '2026-07-20', pic: 'Budi Santoso' },
  { id: '2', docNumber: '001/SSO-SPK/VII/2026', category: 'SPK', description: 'SPK Instalasi Jaringan Vendor A', date: '2026-07-21', pic: 'Siti Aminah' },
];

const initialJobOrders = [
  { id: '1', joNumber: 'JO-2607-001', client: 'PT Maju Bersama', projectName: 'Pengadaan & Instalasi Server', value: 150000000, status: 'On Progress', startDate: '2026-07-10', deadline: '2026-08-30', pic: 'Andi Pratama' },
];

const initialDocuments = [
  { id: 'doc1', name: 'Akta_Pendirian_SSO.pdf', folderId: '01', subfolder: 'Akta & Legalitas Perusahaan', size: 2500000, date: '2026-01-15', uploader: 'Admin Legal', type: 'application/pdf' },
  { id: 'doc2', name: 'SOP_Rekrutmen_Karyawan.docx', folderId: '03', subfolder: 'SOP & Kebijakan Perusahaan', size: 1024000, date: '2026-02-20', uploader: 'HRD Manager', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { id: 'doc3', name: 'Company_Profile_SSO_2026.pdf', folderId: '04', subfolder: 'Company Profile & Legalitas Tender', size: 5500000, date: '2026-05-10', uploader: 'Marketing Team', type: 'application/pdf' },
];

// Komponen UI Dasar yang dapat digunakan ulang (Reusable UI Components)
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'On Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Canceled': 'bg-red-100 text-red-700 border-red-200',
  };
  
  const StatusIcon = () => {
    if(status === 'Completed') return <CheckCircle2 className="w-3 h-3 mr-1" />;
    if(status === 'On Progress') return <Clock className="w-3 h-3 mr-1" />;
    if(status === 'Canceled') return <XCircle className="w-3 h-3 mr-1" />;
    return <AlertCircle className="w-3 h-3 mr-1" />;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      <StatusIcon />{status}
    </span>
  );
};

// Modal Konfirmasi Kustom untuk menghindari penggunaan window.confirm (Anti-Error Vercel)
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 transform scale-100 transition-transform">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

// Layar Login Aplikasi
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50" style={{ backgroundImage: 'radial-gradient(circle at top right, #e0f2fe, #f8fafc)' }}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 text-center bg-white border-b border-slate-100 flex flex-col items-center">
          {/* Menggunakan Logo dari public/ */}
          <img src="image_d6feb7.png" alt="SS Optima" className="h-16 object-contain mb-2" onError={(e) => { e.target.style.display='none'; }} />
          <img src="image_d6fe97.png" alt="Sinergi" className="h-8 object-contain mb-4" onError={(e) => { e.target.style.display='none'; }} />
          
          <h1 className="text-xl font-bold tracking-tight text-slate-800">ERP & Document System</h1>
          <p className="text-slate-500 mt-1 text-sm">Masuk untuk mengakses portal operasional</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ID Karyawan / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input type="text" required className="pl-11 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-[#004aad] focus:border-[#004aad] outline-none transition-all" placeholder="Masukkan ID" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kata Sandi</label>
              <input type="password" required className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-[#004aad] focus:border-[#004aad] outline-none transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-[#004aad] hover:bg-[#003b8a] text-white font-semibold py-3.5 px-4 rounded-xl transition-colors duration-200 mt-6 shadow-md shadow-blue-500/30">
              Masuk ke Sistem
            </button>
            <p className="text-xs text-center text-slate-400 mt-5 font-medium">Demo Version. Ketik sembarang untuk masuk.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

// Modul: Sistem Penomoran Surat & Dokumen
const NumberingSystem = ({ numbers, setNumbers }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], category: 'SURAT', description: '', pic: '' });
  
  const KATEGORI_DOKUMEN = [
    { code: 'SURAT', name: 'Surat Keluar Biasa' }, 
    { code: 'INV', name: 'Invoice / Tagihan' }, 
    { code: 'PO', name: 'Purchase Order' }, 
    { code: 'SPK', name: 'Surat Perintah Kerja' }, 
    { code: 'PNW', name: 'Surat Penawaran' }, 
    { code: 'BAST', name: 'Berita Acara' }
  ];

  const generateNewNumber = (category, dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth();
    const filtered = numbers.filter(n => n.category === category && new Date(n.date).getFullYear() === year);
    const nextSeq = filtered.length + 1;
    return `${String(nextSeq).padStart(3, '0')}/SSO-${category}/${getRomanMonth(month)}/${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecord = { 
      id: Date.now().toString(), 
      docNumber: generateNewNumber(formData.category, formData.date), 
      category: formData.category, 
      description: formData.description, 
      date: formData.date, 
      pic: formData.pic 
    };
    setNumbers([newRecord, ...numbers]);
    setIsFormOpen(false);
    setFormData({ date: new Date().toISOString().split('T')[0], category: 'SURAT', description: '', pic: '' });
  };

  const filteredNumbers = numbers.filter(n => 
    n.docNumber.toLowerCase().includes(search.toLowerCase()) || 
    n.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Sistem Penomoran Sentral (Central Numbering)</h2>
          <p className="text-sm text-slate-500">Pembuatan & pelacakan nomor dokumen resmi PT SSO.</p>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-[#004aad] hover:bg-[#003b8a] w-full sm:w-auto justify-center text-white px-5 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-colors text-sm">
          {isFormOpen ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />} 
          {isFormOpen ? 'Batal' : 'Ambil Nomor Baru'}
        </button>
      </div>

      {isFormOpen && (
        <Card className="p-6 border-l-4 border-l-[#004aad]">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div>
               <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tanggal Dokumen</label>
               <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad]" />
             </div>
             <div>
               <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kategori Dokumen</label>
               <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad] bg-white">
                 {KATEGORI_DOKUMEN.map(cat => (<option key={cat.code} value={cat.code}>{cat.name} (SSO-{cat.code})</option>))}
               </select>
             </div>
             <div className="md:col-span-2">
               <label className="block text-xs font-semibold text-slate-600 mb-1.5">Perihal / Keterangan (Untuk Tracking)</label>
               <input type="text" required placeholder="Contoh: Invoice Termin 1 Proyek XYZ" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad]" />
             </div>
             <div className="md:col-span-2">
               <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Peminta (PIC)</label>
               <input type="text" required placeholder="Nama Anda" value={formData.pic} onChange={e => setFormData({...formData, pic: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad]" />
             </div>
             <div className="md:col-span-2 flex justify-end mt-2">
               <button type="submit" className="bg-[#004aad] text-white px-6 py-2.5 rounded-lg font-medium text-sm w-full md:w-auto shadow-sm">
                 Generate Nomor Dokumen
               </button>
             </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between bg-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Cari nomor urut atau perihal..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad]"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Nomor Registrasi</th>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold">Perihal</th>
                <th className="p-4 font-semibold">Kategori</th>
                <th className="p-4 font-semibold">PIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNumbers.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-sm font-bold text-[#004aad] whitespace-nowrap">{doc.docNumber}</td>
                  <td className="p-4 text-sm text-slate-600">{formatDate(doc.date)}</td>
                  <td className="p-4 text-sm font-medium text-slate-800">{doc.description}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold border border-slate-200">
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{doc.pic}</td>
                </tr>
              ))}
              {filteredNumbers.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 text-sm">Tidak ada data penomoran yang ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// Modul: Manajemen Job Order
const JobOrderManagement = ({ jobOrders, setJobOrders }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ client: '', projectName: '', value: '', startDate: '', deadline: '', pic: '', status: 'Pending' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateObj = new Date();
    const prefix = `JO-${dateObj.getFullYear().toString().slice(-2)}${(dateObj.getMonth()+1).toString().padStart(2,'0')}`;
    const joNum = `${prefix}-${String(jobOrders.length + 1).padStart(3, '0')}`;
    
    setJobOrders([{ 
      id: Date.now().toString(), 
      joNumber: joNum, 
      client: formData.client, 
      projectName: formData.projectName, 
      value: Number(formData.value), 
      startDate: formData.startDate, 
      deadline: formData.deadline, 
      pic: formData.pic, 
      status: formData.status 
    }, ...jobOrders]);
    
    setIsFormOpen(false);
    setFormData({ client: '', projectName: '', value: '', startDate: '', deadline: '', pic: '', status: 'Pending' });
  };
  
  const filteredJOs = jobOrders.filter(jo => 
    jo.client.toLowerCase().includes(search.toLowerCase()) || 
    jo.projectName.toLowerCase().includes(search.toLowerCase()) || 
    jo.joNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Job Order (JO)</h2>
          <p className="text-sm text-slate-500">Database & Pelacakan Proyek Operasional.</p>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto justify-center text-white px-5 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-colors text-sm">
          {isFormOpen ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />} 
          {isFormOpen ? 'Tutup Form' : 'Buat JO Baru'}
        </button>
      </div>

      {isFormOpen && (
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Klien / Instansi</label>
              <input type="text" required value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Proyek / Pekerjaan</label>
              <input type="text" required value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nilai Kontrak (Rp)</label>
              <input type="number" required min="0" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Timeline (Mulai - Selesai)</label>
              <div className="flex gap-2">
                <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-1/2 rounded-lg border border-slate-300 px-2.5 py-2.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                <input type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-1/2 rounded-lg border border-slate-300 px-2.5 py-2.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">PIC & Status Awal</label>
              <div className="flex gap-2">
                <input type="text" required placeholder="Nama PIC" value={formData.pic} onChange={e => setFormData({...formData, pic: e.target.value})} className="w-1/2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-1/2 rounded-lg border border-slate-300 px-2 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white">
                  <option value="Pending">Pending</option>
                  <option value="On Progress">On Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-3 flex justify-end mt-2">
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm w-full md:w-auto shadow-sm">
                Terbitkan JO
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between bg-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Cari JO, Klien, atau Proyek..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Nomor JO</th>
                <th className="p-4 font-semibold">Proyek & Klien</th>
                <th className="p-4 font-semibold">Nilai Kontrak</th>
                <th className="p-4 font-semibold">Timeline & PIC</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJOs.map((jo) => (
                <tr key={jo.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-sm font-bold text-emerald-600 whitespace-nowrap">{jo.joNumber}</td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800 text-sm">{jo.projectName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{jo.client}</p>
                  </td>
                  <td className="p-4 text-sm font-semibold text-slate-700 whitespace-nowrap">{formatRupiah(jo.value)}</td>
                  <td className="p-4 text-xs text-slate-600 whitespace-nowrap">
                    <p className="flex items-center"><Clock className="w-3 h-3 mr-1 text-slate-400"/> {formatDate(jo.startDate)} - {formatDate(jo.deadline)}</p>
                    <p className="font-medium mt-1 text-slate-700">PIC: {jo.pic}</p>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-2">
                      <select 
                        value={jo.status} 
                        onChange={(e) => setJobOrders(jobOrders.map(j => j.id === jo.id ? { ...j, status: e.target.value } : j))} 
                        className="text-xs font-semibold rounded-md border border-slate-300 bg-white px-2 py-1 outline-none focus:border-emerald-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="On Progress">On Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                      <StatusBadge status={jo.status} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJOs.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 text-sm">Tidak ada Job Order yang ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// Modul: File Manager & Repositori Dokumen
const FileManager = ({ folderData, documents, setDocuments }) => {
  const [activeSubfolder, setActiveSubfolder] = useState(folderData.subfolders[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null); // State untuk konfirmasi hapus
  const fileInputRef = useRef(null);

  // Filter dokumen sesuai pilar/folder & subfolder yang aktif
  const currentDocs = documents.filter(d => d.folderId === folderData.id && d.subfolder === activeSubfolder);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulasi proses upload file (Frontend only)
      const newDoc = {
        id: Date.now().toString(),
        name: file.name,
        folderId: folderData.id,
        subfolder: activeSubfolder,
        size: file.size,
        date: new Date().toISOString().split('T')[0],
        uploader: 'Tim Internal (Admin)',
        type: file.type
      };
      
      setIsUploading(true);
      setTimeout(() => {
        setDocuments([newDoc, ...documents]);
        setIsUploading(false);
        e.target.value = null; // Reset input setelah berhasil
      }, 1000); 
    }
  };

  const confirmDelete = () => {
    if (docToDelete) {
      setDocuments(documents.filter(d => d.id !== docToDelete));
      setDocToDelete(null);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Komponen Modal Konfirmasi Hapus */}
      <ConfirmModal 
        isOpen={!!docToDelete}
        title="Hapus Dokumen"
        message="Apakah Anda yakin ingin menghapus dokumen ini? File yang dihapus tidak dapat dikembalikan."
        onConfirm={confirmDelete}
        onCancel={() => setDocToDelete(null)}
      />

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <FolderOpen className="w-6 h-6 mr-2 text-[#004aad]" />
            {folderData.label}
          </h2>
          <p className="text-sm text-slate-500 mt-1">Sistem Repositori Data & Dokumen Digital SSO.</p>
        </div>
        <button onClick={handleUploadClick} disabled={isUploading} className={`bg-[#004aad] hover:bg-[#003b8a] text-white px-5 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-colors text-sm w-full sm:w-auto justify-center ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {isUploading ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <FileUp className="w-4 h-4 mr-2" />}
          {isUploading ? 'Mengunggah...' : 'Unggah Dokumen (Evidence)'}
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Kiri: Sub-Kategori Folder */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Sub-Kategori Folder</h3>
          {folderData.subfolders.map(sub => (
            <button key={sub} onClick={() => setActiveSubfolder(sub)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${activeSubfolder === sub ? 'bg-blue-50 text-[#004aad] border border-blue-200 shadow-sm' : 'text-slate-600 hover:bg-slate-100 border border-transparent'}`}>
              <span className="truncate pr-2 flex items-center">
                <Folder className={`w-4 h-4 mr-2.5 flex-shrink-0 ${activeSubfolder===sub ? 'text-[#004aad] fill-blue-100' : 'text-slate-400'}`} /> 
                {sub}
              </span>
              {activeSubfolder === sub && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
            </button>
          ))}
        </div>

        {/* Area Utama Kanan: List File Document */}
        <Card className="lg:col-span-3 flex flex-col h-[500px] md:h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700 flex items-center text-sm md:text-base">
              <FolderOpen className="w-4 h-4 mr-2 text-slate-500"/> {activeSubfolder}
            </h3>
            <span className="text-xs font-medium bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full shadow-sm">
              {currentDocs.length} Dokumen
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0">
            {currentDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                  <FileText className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-600 font-semibold text-lg">Belum ada dokumen di folder ini.</p>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">Klik tombol "Unggah Dokumen" di atas untuk menambahkan file evidence ke dalam sistem.</p>
                <button onClick={handleUploadClick} className="mt-5 text-[#004aad] text-sm font-semibold hover:underline bg-blue-50 px-4 py-2 rounded-lg">
                  Mulai Unggah Dokumen
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider bg-slate-50/50">
                      <th className="p-4 font-semibold">Nama Dokumen</th>
                      <th className="p-4 font-semibold">Tanggal Upload</th>
                      <th className="p-4 font-semibold">Ukuran</th>
                      <th className="p-4 font-semibold">Diunggah Oleh</th>
                      <th className="p-4 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentDocs.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50/80 group transition-colors">
                        <td className="p-4 flex items-center">
                          <File className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-sm font-semibold text-slate-800 truncate max-w-[200px] md:max-w-[300px]" title={doc.name}>{doc.name}</span>
                        </td>
                        <td className="p-4 text-sm text-slate-600">{formatDate(doc.date)}</td>
                        <td className="p-4 text-sm text-slate-500">{formatBytes(doc.size)}</td>
                        <td className="p-4 text-sm text-slate-600">{doc.uploader}</td>
                        <td className="p-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-[#004aad] hover:bg-blue-50 rounded-lg transition-colors" title="Unduh File">
                            <Download className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDocToDelete(doc.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg ml-1 transition-colors" title="Hapus File">
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Modul: Dashboard Utama Ringkasan Perusahaan
const DashboardHome = ({ documents, jobOrders, onNavigate }) => {
  const stats = {
    totalDocs: documents.length,
    activeJOs: jobOrders.filter(jo => jo.status === 'On Progress' || jo.status === 'Pending').length,
    revenue: jobOrders.filter(jo => jo.status === 'Completed').reduce((s, jo) => s + jo.value, 0)
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Operasional Terpusat</h2>
        <p className="text-slate-500 mt-1">Ringkasan Sistem Informasi & Manajemen Dokumen PT Sarana Sinergi Optima.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#004aad] to-[#002f6c] text-white border-none shadow-lg shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Dokumen Tersimpan</p>
              <h3 className="text-4xl font-bold">{stats.totalDocs}</h3>
            </div>
            <FileText className="w-12 h-12 text-blue-300 opacity-50" />
          </div>
        </Card>
        
        <Card className="p-6 border border-slate-200 shadow-sm bg-white hover:border-amber-300 transition-colors">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-slate-500 text-sm font-medium mb-1">Job Order (JO) Aktif</p>
               <h3 className="text-3xl font-bold text-slate-800">{stats.activeJOs}</h3>
               <button onClick={()=>onNavigate('05_jo')} className="text-xs font-semibold text-emerald-600 mt-3 flex items-center hover:text-emerald-700">
                 Kelola Job Order <ChevronRight className="w-3 h-3 ml-1" />
               </button>
             </div>
             <Briefcase className="w-12 h-12 text-amber-500 opacity-20" />
           </div>
        </Card>
        
        <Card className="p-6 border border-slate-200 shadow-sm bg-white hover:border-emerald-300 transition-colors">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-slate-500 text-sm font-medium mb-1">Nilai Proyek Selesai</p>
               <h3 className="text-2xl font-bold text-slate-800">{formatRupiah(stats.revenue)}</h3>
             </div>
             <CheckCircle2 className="w-12 h-12 text-emerald-500 opacity-20" />
           </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5 border-b border-slate-200 pb-3">
          <h3 className="text-lg font-bold text-slate-800">Direktori Departemen (Pilar Operasional)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {CORPORATE_FOLDERS.map((folder) => (
             <div 
               key={folder.id} 
               onClick={() => onNavigate(folder.id)}
               className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#004aad] cursor-pointer transition-all group flex flex-col justify-between h-full"
             >
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-[#004aad] transition-colors duration-300">
                       <Folder className="w-5 h-5 text-[#004aad] group-hover:text-white transition-colors" />
                     </div>
                     <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                       {folder.id}
                     </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-[#004aad] transition-colors">
                    {folder.name.replace(/_/g, ' ')}
                  </h4>
               </div>
               <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>{folder.subfolders.length} Sub-folder</span>
                  <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-[#004aad]" />
                  </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Komponen App Utama - Mengelola State Global dan Navigasi
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home'); // 'home', '05_jo', '07_num', atau ID folder
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global State untuk simulasi Database
  const [numbers, setNumbers] = useState(initialNumbers);
  const [jobOrders, setJobOrders] = useState(initialJobOrders);
  const [documents, setDocuments] = useState(initialDocuments);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const navigateTo = (menuId) => {
    setActiveMenu(menuId);
    setIsMobileMenuOpen(false); // Tutup menu mobile jika navigasi di-klik
  };

  const NavItem = ({ id, icon: Icon, label, customColor }) => (
    <button
      onClick={() => navigateTo(id)}
      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 mb-1.5 text-left text-sm font-medium ${
        activeMenu === id 
          ? `bg-[#004aad] text-white shadow-md shadow-blue-500/20` 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${activeMenu === id ? 'text-white' : (customColor || 'text-slate-400')}`} />
      <span className="truncate">{label}</span>
    </button>
  );

  // Router sederhana untuk menampilkan komponen sesuai menu yang aktif
  const renderContent = () => {
    if (activeMenu === 'home') {
      return <DashboardHome documents={documents} jobOrders={jobOrders} onNavigate={navigateTo} />;
    }
    
    if (activeMenu === '05_jo') {
      return <JobOrderManagement jobOrders={jobOrders} setJobOrders={setJobOrders} />;
    }
    if (activeMenu === '07_num') {
      return <NumberingSystem numbers={numbers} setNumbers={setNumbers} />;
    }

    const folderData = CORPORATE_FOLDERS.find(f => f.id === activeMenu);
    if (folderData) {
      return <FileManager folderData={folderData} documents={documents} setDocuments={setDocuments} />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
        <p>Modul tidak ditemukan.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Header Mobile (Hanya tampil di layar kecil) */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-30 relative">
        <div className="flex items-center">
           <img src="image_d6feb7.png" alt="SSO" className="h-8 object-contain" onError={(e) => { e.target.style.display='none'; }} />
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigasi Kiri */}
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 fixed md:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-40 flex flex-col h-[100dvh] md:h-screen shadow-2xl md:shadow-none
      `}>
        <div className="p-6 border-b border-slate-100 hidden md:flex flex-col items-center justify-center bg-white h-24">
           <img src="image_d6feb7.png" alt="SS Optima" className="h-10 object-contain mb-1" onError={(e) => { e.target.style.display='none'; }} />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sistem ERP Internal</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-5 custom-scrollbar px-3 mt-16 md:mt-0">
          <div className="mb-6">
             <NavItem id="home" icon={LayoutDashboard} label="Dashboard Utama" />
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Modul Operasional</div>
          <div className="mb-6">
             <NavItem id="05_jo" icon={Briefcase} label="Manajemen Job Order" customColor="text-emerald-500" />
             <NavItem id="07_num" icon={FileDigit} label="Sistem Penomoran" customColor="text-blue-500" />
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Direktori Dokumen (7 Pilar)</div>
          <div>
            {CORPORATE_FOLDERS.map(folder => (
               <NavItem key={folder.id} id={folder.id} icon={Folder} label={folder.label} />
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-white">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold text-sm border border-transparent hover:border-red-100">
            <LogOut className="w-4 h-4 mr-2" /> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 overflow-y-auto h-[calc(100dvh-73px)] md:h-screen w-full relative bg-[#f8fafc] custom-scrollbar">
        {/* Latar Belakang Gradien Halus di Atas */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-100 to-transparent z-0"></div>
        
        <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10 pb-20">
          {renderContent()}
        </div>
      </main>
      
      {/* Overlay Gelap untuk Mobile saat Menu Terbuka */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
      
      {/* CSS Kustom untuk Scrollbar yang Elegan */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
      `}} />
    </div>
  );
}