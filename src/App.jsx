import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, Folder, FolderOpen, FileText, Briefcase, 
  LogOut, Plus, Search, Lock, Menu, X,
  FileDigit, Clock, CheckCircle2, XCircle, AlertCircle,
  Download, File, ChevronRight, FileUp, Copy, Check
} from 'lucide-react';

// ==========================================
// FUNGSI BANTUAN (HELPERS)
// ==========================================
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

// ==========================================
// DATA & KONSTANTA AWAL
// ==========================================
const CORPORATE_FOLDERS = [
  { id: '01', name: '01_LEGAL_KORPORASI_DAN_PERIZINAN', label: 'Legal, Korporasi & Perizinan', subfolders: ['Akta & Legalitas Perusahaan', 'Perizinan (NIB, dll)', 'Kontrak Klien (PKS)', 'Kontrak Vendor & Mitra'] },
  { id: '02', name: '02_KEUANGAN_AKUNTANSI_DAN_PAJAK_PUSAT', label: 'Keuangan, Akuntansi & Pajak', subfolders: ['Invoice Keluar (AR)', 'Tagihan Masuk (AP)', 'Faktur Pajak & SPT', 'Laporan Keuangan & Rekening Koran'] },
  { id: '03', name: '03_HRD_GENERAL_AFFAIR_DAN_ASET', label: 'HRD, General Affair & Aset', subfolders: ['Data Karyawan & Kontrak', 'Payroll, Absensi & Cuti', 'SOP & Kebijakan Perusahaan', 'Manajemen Aset & Inventaris'] },
  { id: '04', name: '04_MARKETING_SALES_DAN_TENDER', label: 'Marketing, Sales & Tender', subfolders: ['Company Profile & Legalitas Tender', 'Dokumen Tender & Kualifikasi', 'Proposal Penawaran (Quotation)', 'Materi Promosi & Brosur'] },
  { id: '05', name: '05_OPERASIONAL_DAN_MANAJEMEN_PROYEK', label: 'Operasional & Manajemen Proyek', subfolders: ['Dashboard Job Order', 'Laporan Progress Proyek', 'Berita Acara (BAST & BAPP)', 'Timesheet & Laporan Harian'] },
  { id: '06', name: '06_DATABASE_SUPPLY_CHAIN_DAN_VENDOR', label: 'Database, Supply Chain & Vendor', subfolders: ['Database Klien & Prospek', 'Database Vendor & Supplier', 'Katalog Harga & Pricelist', 'Purchase Order (PO)'] },
  { id: '07', name: '07_MASTER_TEMPLATE_SISTEM', label: 'Master Template Sistem', subfolders: ['Sistem Penomoran Dokumen', 'Template Form Kosong', 'Aset Desain (Logo, Kop Surat)'] }
];

const initialNumbers = [];

const initialJobOrders = [];

const initialDocuments = [];

// ==========================================
// KOMPONEN UI GLOBAL
// ==========================================
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>{children}</div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'Draft': 'bg-slate-100 text-slate-700 border-slate-200',
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
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status] || styles['Draft']}`}>
      <StatusIcon />{status}
    </span>
  );
};

// ==========================================
// LOGIN SCREEN
// ==========================================
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); if (username && password) onLogin(); };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(circle at top right, #e0f2fe, #f8fafc)' }}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 text-center bg-white border-b border-slate-100 flex flex-col items-center">
          <img src="image_d6feb7.png" alt="SS Optima" className="h-16 object-contain mb-2" onError={(e) => { e.target.style.display='none'; }} />
          <h1 className="text-xl font-bold tracking-tight text-slate-800">ERP & Document Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Masuk untuk mengakses portal operasional SSO</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ID Karyawan / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                <input type="text" required className="pl-10 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Masukkan ID" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
              <input type="password" required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-[#004aad] hover:bg-[#003b8a] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mt-4 shadow-md">Masuk ke Sistem</button>
            <p className="text-xs text-center text-slate-400 mt-4">Demo Version. Ketik sembarang untuk masuk.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MODUL: SISTEM PENOMORAN (CENTRAL NUMBERING)
// ==========================================
const NumberingSystem = ({ numbers, setNumbers, jobOrders, setJobOrders }) => {
  const [activeTab, setActiveTab] = useState('quotation'); 
  const [search, setSearch] = useState('');
  const [copiedText, setCopiedText] = useState('');
  
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], category: 'SURAT', description: '', pic: '', clientName: '', projectValue: '' });

  const KATEGORI_DOKUMEN = [{ code: 'SURAT', name: 'Surat Keluar Biasa' }, { code: 'INV', name: 'Invoice / Tagihan' }, { code: 'PO', name: 'Purchase Order' }, { code: 'BAST', name: 'Berita Acara' }];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 3000); // Pesan sukses hilang setelah 3 detik
  };

  // Format Quotation: 001/QUO/MKT/I/2026
  const generateQuotationNumber = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth();
    const filtered = numbers.filter(n => n.category === 'QUO' && new Date(n.date).getFullYear() === year);
    const nextSeq = filtered.length + 1;
    return `${String(nextSeq).padStart(3, '0')}/QUO/MKT/${getRomanMonth(month)}/${year}`;
  };

  // Format JO: JO-YYMM-XXX (Contoh: JO-2607-001)
  const generateJONumber = (dateStr) => {
    const date = new Date(dateStr);
    const yearYY = date.getFullYear().toString().slice(-2);
    const monthMM = (date.getMonth() + 1).toString().padStart(2, '0');
    const prefix = `JO-${yearYY}${monthMM}`;
    
    // Hitung urutan JO pada bulan & tahun tersebut
    const filtered = jobOrders.filter(j => j.joNumber.startsWith(prefix));
    const nextSeq = filtered.length + 1;
    return `${prefix}-${String(nextSeq).padStart(3, '0')}`;
  };

  // Format Dokumen Umum Lainnya
  const generateDocNumber = (category, dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth();
    const filtered = numbers.filter(n => n.category === category && new Date(n.date).getFullYear() === year);
    const nextSeq = filtered.length + 1;
    return `${String(nextSeq).padStart(3, '0')}/SSO-${category}/${getRomanMonth(month)}/${year}`;
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    
    if (activeTab === 'jo') {
      const generatedNumber = generateJONumber(formData.date);
      const newJO = {
        id: Date.now().toString(),
        joNumber: generatedNumber,
        client: formData.clientName || 'TBA',
        projectName: formData.description || 'Draft Job Order Baru',
        value: Number(formData.projectValue || 0),
        startDate: formData.date,
        deadline: formData.date,
        pic: formData.pic,
        status: 'Draft' // Otomatis berstatus Draft masuk ke tabel JO
      };
      setJobOrders([newJO, ...jobOrders]);
      copyToClipboard(generatedNumber); // Copy Pintar
      
    } else if (activeTab === 'quotation') {
      const generatedNumber = generateQuotationNumber(formData.date);
      const newRecord = { 
        id: Date.now().toString(), 
        docNumber: generatedNumber, 
        category: 'QUO', 
        description: formData.description, 
        date: formData.date, 
        pic: formData.pic,
        client: formData.clientName 
      };
      setNumbers([newRecord, ...numbers]);
      copyToClipboard(generatedNumber); // Copy Pintar
      
    } else {
      // Dokumen Umum
      const generatedNumber = generateDocNumber(formData.category, formData.date);
      const newRecord = { 
        id: Date.now().toString(), 
        docNumber: generatedNumber, 
        category: formData.category, 
        description: formData.description, 
        date: formData.date, 
        pic: formData.pic,
        client: formData.clientName || '-'
      };
      setNumbers([newRecord, ...numbers]);
      copyToClipboard(generatedNumber); // Copy Pintar
    }
    
    // Reset Form
    setFormData({ date: new Date().toISOString().split('T')[0], category: 'SURAT', description: '', pic: '', clientName: '', projectValue: '' });
  };

  const filteredNumbers = numbers.filter(n => n.docNumber.toLowerCase().includes(search.toLowerCase()) || n.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Sistem Penomoran Sentral</h2>
        <p className="text-sm text-slate-500 mb-4">Pengambilan & pelacakan nomor urut resmi untuk menghindari duplikasi.</p>
        
        <div className="flex space-x-2 border-b border-slate-200">
          <button onClick={() => setActiveTab('quotation')} className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'quotation' ? 'border-[#004aad] text-[#004aad]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Quotation (Penawaran)</button>
          <button onClick={() => setActiveTab('jo')} className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'jo' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Job Order (JO)</button>
          <button onClick={() => setActiveTab('umum')} className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'umum' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Dokumen Umum</button>
        </div>
      </div>

      <Card className={`p-6 border-l-4 ${activeTab === 'jo' ? 'border-l-emerald-500' : activeTab === 'quotation' ? 'border-l-[#004aad]' : 'border-l-slate-700'}`}>
        <div className="mb-4">
            <h3 className="text-md font-bold flex items-center text-slate-800">
            <Plus className={`w-4 h-4 mr-2 ${activeTab === 'jo' ? 'text-emerald-600' : 'text-[#004aad]'}`} /> 
            Ambil Nomor {activeTab === 'quotation' ? 'Quotation' : activeTab === 'jo' ? 'Job Order' : 'Dokumen'} Baru
            </h3>
            {activeTab === 'jo' && <p className="text-xs text-emerald-600 font-medium ml-6">JO yang di-generate akan otomatis tersimpan sebagai DRAFT di tabel Job Order.</p>}
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#004aad]" />
            </div>
            
            {activeTab === 'umum' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Dokumen</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#004aad] bg-white">
                  {KATEGORI_DOKUMEN.map(cat => (<option key={cat.code} value={cat.code}>{cat.name} (SSO-{cat.code})</option>))}
                </select>
              </div>
            )}
            
            {(activeTab === 'quotation' || activeTab === 'jo') && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Klien / Instansi</label>
                <input type="text" required placeholder="Contoh: PT Maju Bersama" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#004aad]" />
              </div>
            )}

            {activeTab === 'jo' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nilai Project (Rp)</label>
                <input type="number" min="0" step="100000" placeholder="Contoh: 150000000" value={formData.projectValue} onChange={e => setFormData({...formData, projectValue: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Perihal / Nama Proyek (Untuk Tracking)</label>
              <input type="text" required placeholder={activeTab === 'jo' ? "Contoh: Pengadaan Server Klien A" : "Contoh: Penawaran Harga Termin 1"} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#004aad]" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Peminta (PIC)</label>
              <input type="text" required placeholder="Nama Lengkap Anda" value={formData.pic} onChange={e => setFormData({...formData, pic: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#004aad]" />
            </div>
            
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className={`${activeTab === 'jo' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#004aad] hover:bg-[#003b8a]'} text-white px-6 py-2 rounded-md font-medium text-sm flex items-center transition-colors shadow-sm`}>
                Generate Nomor {activeTab === 'quotation' ? 'Quotation' : activeTab === 'jo' ? 'JO' : 'Dokumen'}
              </button>
            </div>
        </form>

        {/* FEEDBACK VISUAL SUCCESS & COPY TO CLIPBOARD */}
        {copiedText && (
           <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <p className="text-xs text-emerald-700 font-bold mb-1">Sukses! Nomor di-generate & otomatis tersalin ke Clipboard.</p>
                <p className="text-xl font-mono font-bold text-emerald-900 bg-white inline-block px-2 py-1 rounded border border-emerald-100">{copiedText}</p>
                {copiedText.startsWith('JO') && <p className="text-xs text-emerald-600 mt-1">Data JO Draft telah ditambahkan ke database Manajemen Job Order.</p>}
              </div>
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                 <Check className="w-5 h-5 text-emerald-600" />
              </div>
           </div>
        )}
      </Card>

      {/* TABEL HANYA MUNCUL JIKA BUKAN JO, KARENA JO PUNYA MENU SENDIRI */}
      {activeTab !== 'jo' && (
        <Card>
          <div className="p-3 border-b border-slate-100 flex justify-between bg-slate-50 items-center">
            <h3 className="font-semibold text-slate-700 text-sm">Riwayat Registrasi Nomor Dokumen Khusus</h3>
            <div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Cari nomor atau perihal..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#004aad]"/></div>
          </div>
          <div className="overflow-x-auto h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white shadow-sm"><tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider"><th className="p-3">Nomor Registrasi</th><th className="p-3">Tanggal</th><th className="p-3">Perihal / Klien</th><th className="p-3">Kategori</th><th className="p-3 text-right">Salin</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNumbers.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50"><td className="p-3 text-sm font-bold text-[#004aad] whitespace-nowrap">{doc.docNumber}</td><td className="p-3 text-sm text-slate-600 whitespace-nowrap">{formatDate(doc.date)}</td><td className="p-3 text-sm font-medium text-slate-800">{doc.description}<br/><span className="text-xs text-slate-500 font-normal">{doc.client}</span></td><td className="p-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold border border-slate-200">{doc.category}</span></td>
                  <td className="p-3 text-right">
                    <button onClick={() => copyToClipboard(doc.docNumber)} className="text-slate-400 hover:text-[#004aad] p-2 bg-white border border-slate-200 shadow-sm rounded transition-colors" title="Salin Nomor">
                      <Copy className="w-4 h-4" />
                    </button>
                  </td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

// ==========================================
// MODUL: MANAJEMEN JOB ORDER
// ==========================================
const JobOrderManagement = ({ jobOrders, setJobOrders }) => {
  const [search, setSearch] = useState('');
  const filteredJOs = jobOrders.filter(jo => jo.client.toLowerCase().includes(search.toLowerCase()) || jo.projectName.toLowerCase().includes(search.toLowerCase()) || jo.joNumber.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Manajemen Job Order (JO)</h2>
        <p className="text-sm text-slate-500">Database & Pelacakan Proyek Operasional.</p>
        <div className="mt-2 text-xs bg-emerald-50 text-emerald-700 p-2 rounded flex items-center"><AlertCircle className="w-4 h-4 mr-2" />Pembuatan Nomor JO Baru akan otomatis tersimpan sebagai <b>Draft</b> di tabel ini. Silakan atur nilainya saat status sudah Fix.</div>
      </div>

      <Card>
        <div className="p-3 border-b border-slate-100 flex justify-between bg-slate-50"><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Cari JO, Klien, atau Proyek..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-emerald-500"/></div></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-white border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider"><th className="p-3">Nomor JO</th><th className="p-3">Proyek & Klien</th><th className="p-3">Nilai Kontrak</th><th className="p-3">Timeline & PIC</th><th className="p-3">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJOs.map((jo) => (
                <tr key={jo.id} className="hover:bg-slate-50"><td className="p-3 text-sm font-bold text-emerald-600 whitespace-nowrap">{jo.joNumber}</td><td className="p-3"><p className="font-semibold text-slate-800 text-sm">{jo.projectName}</p><p className="text-xs text-slate-500">{jo.client}</p></td><td className="p-3 text-sm font-medium text-slate-800 whitespace-nowrap">{formatRupiah(jo.value)}</td><td className="p-3 text-xs text-slate-600 whitespace-nowrap"><p>{formatDate(jo.startDate)} - {formatDate(jo.deadline)}</p><p className="font-semibold mt-0.5">PIC: {jo.pic}</p></td><td className="p-3 whitespace-nowrap"><select value={jo.status} onChange={(e) => setJobOrders(jobOrders.map(j => j.id === jo.id ? { ...j, status: e.target.value } : j))} className="text-xs font-semibold rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-emerald-500 mb-1 block w-full"><option value="Draft">Draft</option><option value="Pending">Pending</option><option value="On Progress">On Progress</option><option value="Completed">Completed</option><option value="Canceled">Canceled</option></select><StatusBadge status={jo.status} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ==========================================
// MODUL: FILE MANAGER DOKUMEN DIGITAL
// ==========================================
const FileManager = ({ folderData, documents, setDocuments }) => {
  const [activeSubfolder, setActiveSubfolder] = useState(folderData.subfolders[0]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const currentDocs = documents.filter(d => d.folderId === folderData.id && d.subfolder === activeSubfolder);
  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newDoc = { id: Date.now().toString(), name: file.name, folderId: folderData.id, subfolder: activeSubfolder, size: file.size, date: new Date().toISOString().split('T')[0], uploader: 'User (Login Saat Ini)', type: file.type };
      setIsUploading(true);
      setTimeout(() => {
        setDocuments([newDoc, ...documents]);
        setIsUploading(false);
        e.target.value = null;
      }, 800);
    }
  };

  const handleDelete = (id) => {
    if(window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center"><FolderOpen className="w-6 h-6 mr-2 text-[#004aad]" /> {folderData.label}</h2>
          <p className="text-sm text-slate-500 mt-1">Sistem Repositori Data & Dokumen Digital SSO.</p>
        </div>
        <button onClick={handleUploadClick} disabled={isUploading} className={`bg-[#004aad] hover:bg-[#003b8a] text-white px-4 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-colors text-sm ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {isUploading ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <FileUp className="w-4 h-4 mr-2" />}
          {isUploading ? 'Mengunggah...' : 'Unggah Dokumen'}
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Sub-Kategori Folder</h3>
          {folderData.subfolders.map(sub => (
            <button key={sub} onClick={() => setActiveSubfolder(sub)} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${activeSubfolder === sub ? 'bg-blue-50 text-[#004aad] border border-blue-200 shadow-sm' : 'text-slate-600 hover:bg-slate-100 border border-transparent'}`}>
              <span className="truncate pr-2 flex items-center"><Folder className={`w-4 h-4 mr-2 flex-shrink-0 ${activeSubfolder===sub ? 'text-[#004aad] fill-blue-100' : 'text-slate-400'}`} /> {sub}</span>
              {activeSubfolder === sub && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
            </button>
          ))}
        </div>

        <Card className="md:col-span-3 flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center"><FolderOpen className="w-4 h-4 mr-2 text-slate-500"/> {activeSubfolder}</h3>
            <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-full">{currentDocs.length} Dokumen</span>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            {currentDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><FileText className="w-8 h-8 text-slate-300" /></div>
                <p className="text-slate-500 font-medium">Belum ada dokumen di folder ini.</p>
                <p className="text-sm text-slate-400 mt-1">Klik tombol "Unggah Dokumen" di atas untuk menambahkan file evidence.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white shadow-sm z-10"><tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider"><th className="p-4">Nama Dokumen</th><th className="p-4">Tanggal Upload</th><th className="p-4">Ukuran</th><th className="p-4">Diunggah Oleh</th><th className="p-4 text-right">Aksi</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {currentDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50 group">
                      <td className="p-4 flex items-center"><File className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" /><span className="text-sm font-medium text-slate-800 truncate max-w-[250px]" title={doc.name}>{doc.name}</span></td>
                      <td className="p-4 text-sm text-slate-600">{formatDate(doc.date)}</td>
                      <td className="p-4 text-sm text-slate-500">{formatBytes(doc.size)}</td>
                      <td className="p-4 text-sm text-slate-600">{doc.uploader}</td>
                      <td className="p-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-[#004aad] hover:bg-blue-50 rounded" title="Unduh"><Download className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded ml-1" title="Hapus"><X className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ==========================================
// MODUL: DASHBOARD UTAMA
// ==========================================
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
        <p className="text-slate-500">Ringkasan Sistem Informasi & Manajemen Dokumen PT Sarana Sinergi Optima.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#004aad] to-[#002f6c] text-white border-none shadow-lg">
          <div className="flex justify-between items-start"><div><p className="text-blue-200 text-sm font-medium mb-1">Total Dokumen Tersimpan</p><h3 className="text-4xl font-bold">{stats.totalDocs}</h3></div><FileText className="w-12 h-12 text-blue-300 opacity-50" /></div>
        </Card>
        <Card className="p-6 border border-slate-200 shadow-sm bg-white">
           <div className="flex justify-between items-start"><div><p className="text-slate-500 text-sm font-medium mb-1">Job Order (JO) Aktif</p><h3 className="text-3xl font-bold text-slate-800">{stats.activeJOs}</h3><p className="text-xs font-semibold text-emerald-600 mt-2 cursor-pointer" onClick={()=>onNavigate('05_jo')}>Lihat Detail JO &rarr;</p></div><Briefcase className="w-12 h-12 text-amber-500 opacity-20" /></div>
        </Card>
        <Card className="p-6 border border-slate-200 shadow-sm bg-white">
           <div className="flex justify-between items-start"><div><p className="text-slate-500 text-sm font-medium mb-1">Nilai Proyek Selesai</p><h3 className="text-2xl font-bold text-slate-800">{formatRupiah(stats.revenue)}</h3></div><CheckCircle2 className="w-12 h-12 text-emerald-500 opacity-20" /></div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Direktori Departemen (Pilar Operasional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CORPORATE_FOLDERS.map((folder) => (
             <div key={folder.id} onClick={() => onNavigate(folder.id)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#004aad] cursor-pointer transition-all group flex flex-col justify-between h-full">
               <div>
                  <div className="flex items-center justify-between mb-3"><Folder className="w-8 h-8 text-[#004aad] group-hover:fill-blue-100 transition-colors" /><span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{folder.id}</span></div>
                  <h4 className="font-semibold text-slate-800 text-sm leading-snug">{folder.name.replace(/_/g, ' ')}</h4>
               </div>
               <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"><span>{folder.subfolders.length} Sub-folder</span><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#004aad] transform translate-x-[-10px] group-hover:translate-x-0 transition-all" /></div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// ROOT APP (MAIN LAYOUT)
// ==========================================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [numbers, setNumbers] = useState(initialNumbers);
  const [jobOrders, setJobOrders] = useState(initialJobOrders);
  const [documents, setDocuments] = useState(initialDocuments);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const navigateTo = (menuId) => { setActiveMenu(menuId); setIsMobileMenuOpen(false); };

  const NavItem = ({ id, icon: Icon, label, customColor }) => (
    <button onClick={() => navigateTo(id)} className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors mb-1 text-left text-sm ${activeMenu === id ? `bg-[#004aad]/10 text-[#004aad] font-semibold border-r-4 border-[#004aad]` : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-r-4 border-transparent'}`}>
      <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${activeMenu === id ? 'text-[#004aad]' : (customColor || 'text-slate-400')}`} />
      <span className="truncate">{label}</span>
    </button>
  );

  const renderContent = () => {
    if (activeMenu === 'home') return <DashboardHome documents={documents} jobOrders={jobOrders} onNavigate={navigateTo} />;
    if (activeMenu === '05_jo') return <JobOrderManagement jobOrders={jobOrders} setJobOrders={setJobOrders} />;
    if (activeMenu === '07_num') return <NumberingSystem numbers={numbers} setNumbers={setNumbers} jobOrders={jobOrders} setJobOrders={setJobOrders} />;

    const folderData = CORPORATE_FOLDERS.find(f => f.id === activeMenu);
    if (folderData) return <FileManager folderData={folderData} documents={documents} setDocuments={setDocuments} />;

    return <div>Modul tidak ditemukan</div>;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-30 relative">
        <div className="flex items-center"><img src="image_d6feb7.png" alt="SSO" className="h-8 object-contain" onError={(e) => { e.target.style.display='none'; }} /></div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-1">{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
      </div>

      <aside className={`md:translate-x-0 transition-transform duration-300 fixed md:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-20 flex flex-col h-[100dvh] md:h-screen shadow-lg md:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-slate-100 hidden md:flex flex-col items-center justify-center bg-white">
           <img src="image_d6feb7.png" alt="SS Optima" className="h-10 object-contain mb-1" onError={(e) => { e.target.style.display='none'; }} />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sistem ERP Internal</p>
        </div>
        <nav className="flex-1 overflow-y-auto mt-16 md:mt-0 py-4 custom-scrollbar">
          <div className="px-3 mb-4"><NavItem id="home" icon={LayoutDashboard} label="Dashboard Utama" /></div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-6">Modul Khusus</div>
          <div className="px-3 mb-4">
             <NavItem id="05_jo" icon={Briefcase} label="Manajemen Job Order" customColor="text-emerald-500" />
             <NavItem id="07_num" icon={FileDigit} label="Sistem Penomoran" customColor="text-blue-500" />
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-6">Direktori Dokumen</div>
          <div className="px-3">
            {CORPORATE_FOLDERS.map(folder => (<NavItem key={folder.id} id={folder.id} icon={Folder} label={folder.label} />))}
          </div>
        </nav>
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center justify-center px-4 py-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-semibold text-sm">
            <LogOut className="w-4 h-4 mr-2" /> Keluar Sistem
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto h-[calc(100dvh-64px)] md:h-screen w-full relative">
        <div className="absolute top-0 left-0 right-0 h-48 bg-slate-100 z-0"></div>
        <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">{renderContent()}</div>
      </main>

      {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/50 z-10 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
      `}} />
    </div>
  );
}