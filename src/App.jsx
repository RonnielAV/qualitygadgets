import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Form from './components/Form';
import PreviewQuote from './components/PreviewQuote';
import PreviewInvoice from './components/PreviewInvoice';
import PreviewMasterClass from './components/PreviewMasterClass';
import DocumentCanvasViewer from './components/DocumentCanvasViewer';
import HistoryModal from './components/HistoryModal';
import LoginScreen from './components/LoginScreen';
import LoginBackupPromptModal from './components/LoginBackupPromptModal';
import LogoutConfirmModal from './components/LogoutConfirmModal';
import UserManagementModal from './components/UserManagementModal';
import { 
  getStoredUsers, 
  saveStoredUsers, 
  STORAGE_USERS_KEY 
} from './utils/userUtils';
import { 
  downloadElementAsPdf, 
  downloadElementAsImage, 
  generateWhatsAppMessage 
} from './utils/exportUtils';
import { 
  getStoredCounters, 
  saveStoredCounters, 
  getNextConsecutiveNumber, 
  isNumberDuplicated, 
  STORAGE_COUNTERS_KEY 
} from './utils/numberingUtils';
import { DEFAULT_MASTER_CLASS } from './data/templates';
import { Eye, Edit3, CheckCircle, AlertCircle, Sparkles, Check, Share2 } from 'lucide-react';

const STORAGE_AUTOSAVE_KEY = 'eliotte_mua_autosave_state_v3';
const STORAGE_HISTORY_KEY = 'eliotte_mua_saved_history_v3';
const STORAGE_AUTH_KEY = 'eliotte_mua_auth_v3';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!localStorage.getItem(STORAGE_AUTH_KEY);
    } catch (e) {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      return saved ? JSON.parse(saved) : { name: 'Eliotte Casimiro', role: 'Makeup Artist' };
    } catch (e) {
      return { name: 'Eliotte Casimiro', role: 'Makeup Artist' };
    }
  });

  const [showLoginBackupModal, setShowLoginBackupModal] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [users, setUsers] = useState(() => getStoredUsers());
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const [docType, setDocType] = useState('quote'); // 'quote' | 'invoice' | 'masterclass'
  const [mobileView, setMobileView] = useState('form'); // 'form' | 'preview'
  const [activeMasterClassPage, setActiveMasterClassPage] = useState('proposal'); // 'cover' | 'page1' | 'page2' | 'page3' | 'proposal'
  const [isExporting, setIsExporting] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState(null);

  const quoteRef = useRef(null);
  const invoiceRef = useRef(null);
  const masterClassRef = useRef(null);

  // Default initial states using the clean official photos matching Canva
  const initialQuote = {
    templateId: 'boda',
    quoteNumber: 'COT-2026-001',
    title: 'Wedding',
    subtitle: '',
    sectionSubtitle: 'Price List Santiago',
    headerTitleColor: '#1a1a1a',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    company: '',
    rnc: '',
    eventDate: '27 de septiembre 2024',
    currency: 'US$',
    bgImage: './assets/cotizacion-1.jpg', // Clean photo strictly from Eliotte MUA Cotizaciones
    customBgUrl: '',
    bgOpacity: 0.85,
    fontTheme: 'canva_caveat',
    logoVariant: 'white',
    showQr: true,
    items: [
      { id: '1', description: 'Bride makeup (Airbrush)', price: 200, qty: 1, optional: false, note: '' },
      { id: '2', description: '2 Guest Makeup $80.00us', price: 160, qty: 1, optional: false, note: '' }
    ],
    notes: 'To book your date 50% of the total amount of the services .\nAt the Current Account (pesos)\nBPD 814-307880\nced 031-0422823-8\nEliotte Casimiro',
  };

  const initialInvoice = {
    invoiceNumber: 'FAC-2026-001',
    invoiceDate: '31 de julio del 2,026',
    clientName: 'Eugenia Perez',
    company: 'Persio Abreu SRL',
    rnc: '102-32053-5',
    clientEmail: 'persioabreu@gmail.com',
    clientPhone: '(849) 220-9464',
    projectDescription: 'Servicio de maquillaje profesional y retoque para modelos',
    currency: 'RD$',
    fontTheme: 'modern_montserrat',
    logoVariant: 'black',
    items: [
      { id: '1', description: 'Servicio de maquillaje y retoque para 4 modelos', price: 40000, qty: 1, note: 'Campaña temporada' },
      { id: '2', description: 'Servicio de asistencia y retoque full day', price: 5000, qty: 1, note: '' }
    ],
    discount: 10000,
    notes: 'El pago puede ser efectuado a la cuenta corriente en pesos del BPD 814-307880\nced 031-0422823-8 a nombre de Eliotte Casimiro.',
  };

  const [quoteDoc, setQuoteDoc] = useState(initialQuote);
  const [invoiceDoc, setInvoiceDoc] = useState(initialInvoice);
  const [masterClassDoc, setMasterClassDoc] = useState(DEFAULT_MASTER_CLASS);
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false);

  // 1. Initial Load from localStorage
  useEffect(() => {
    try {
      const savedAuto = localStorage.getItem(STORAGE_AUTOSAVE_KEY);
      if (savedAuto) {
        const parsed = JSON.parse(savedAuto);
        if (parsed.docType) setDocType(parsed.docType);
        if (parsed.quoteDoc) setQuoteDoc(parsed.quoteDoc);
        if (parsed.invoiceDoc) setInvoiceDoc(parsed.invoiceDoc);
        if (parsed.masterClassDoc) setMasterClassDoc(parsed.masterClassDoc);
        if (parsed.activeMasterClassPage) setActiveMasterClassPage(parsed.activeMasterClassPage);
      }

      const savedHist = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (savedHist) {
        setHistory(JSON.parse(savedHist));
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    } finally {
      setIsLoadedFromStorage(true);
    }
  }, []);

  // 2. Real-time Auto-save to localStorage on every change
  useEffect(() => {
    if (!isLoadedFromStorage) return;

    const timeout = setTimeout(() => {
      try {
        const payload = {
          docType,
          quoteDoc,
          invoiceDoc,
          masterClassDoc,
          activeMasterClassPage,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_AUTOSAVE_KEY, JSON.stringify(payload));
        setLastAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.error('Auto-save error', err);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [docType, quoteDoc, invoiceDoc, masterClassDoc, activeMasterClassPage, isLoadedFromStorage]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ================= PWA INSTALLATION HOOK =================
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      showToast('¡Eliotte MUA App instalada en tu dispositivo!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        showToast('¡Instalando Eliotte MUA en tu celular!');
      }
      setDeferredPrompt(null);
    } else {
      alert('Para instalar en tu celular:\n\n1. En Android (Chrome): Toca el menú de 3 puntos arriba a la derecha y selecciona "Instalar aplicación" o "Agregar a la pantalla principal".\n\n2. En iPhone (Safari): Toca el botón Compartir (icono con flecha) y selecciona "Agregar al inicio".');
    }
  };

  // ================= AUTHENTICATION HANDLERS =================
  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    if (user.rememberMe) {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
    }
    // Prompt to load backup or continue with local data upon login
    setShowLoginBackupModal(true);
    showToast(`¡Bienvenida, ${user.name}!`);
  };

  const handleDirectRestoreBackup = (file) => {
    handleImportBackup(file);
    const defaultUser = { name: 'Eliotte Casimiro', username: 'eliotte', role: 'Makeup Artist', rememberMe: true };
    setIsAuthenticated(true);
    setCurrentUser(defaultUser);
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(defaultUser));
  };

  const handleOpenLogoutModal = () => {
    setShowLogoutConfirmModal(true);
  };

  const handleDownloadAndLogout = () => {
    handleExportBackup();
    setTimeout(() => {
      setIsAuthenticated(false);
      localStorage.removeItem(STORAGE_AUTH_KEY);
      setShowLogoutConfirmModal(false);
      showToast('Sesión cerrada. ¡Hasta pronto!');
    }, 400);
  };

  const handleDirectLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_AUTH_KEY);
    setShowLogoutConfirmModal(false);
    showToast('Sesión cerrada');
  };

  const handleSaveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    saveStoredUsers(updatedUsers);
  };

  // ================= CONSECUTIVE NUMBER GENERATION =================
  const handleNextQuoteNumber = () => {
    const nextNum = getNextConsecutiveNumber('quote', history, quoteDoc.quoteNumber);
    setQuoteDoc(prev => ({ ...prev, quoteNumber: nextNum }));
    showToast(`N° de Cotización avanzado a: ${nextNum}`);
  };

  const handleNextInvoiceNumber = () => {
    const nextNum = getNextConsecutiveNumber('invoice', history, invoiceDoc.invoiceNumber);
    setInvoiceDoc(prev => ({ ...prev, invoiceNumber: nextNum }));
    showToast(`N° de Factura avanzado a: ${nextNum}`);
  };

  const handleNewDocument = () => {
    if (docType === 'quote') {
      const nextNum = getNextConsecutiveNumber('quote', history, quoteDoc.quoteNumber);
      setQuoteDoc(prev => ({
        ...prev,
        quoteNumber: nextNum,
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        company: '',
        rnc: '',
        eventDate: '',
      }));
      showToast(`¡Nueva Cotización iniciada con N°: ${nextNum}!`);
    } else if (docType === 'invoice') {
      const nextNum = getNextConsecutiveNumber('invoice', history, invoiceDoc.invoiceNumber);
      setInvoiceDoc(prev => ({
        ...prev,
        invoiceNumber: nextNum,
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        company: '',
        rnc: '',
        projectDescription: '',
        items: [],
        discount: 0,
      }));
      showToast(`¡Nueva Factura iniciada con N°: ${nextNum}!`);
    } else {
      setMasterClassDoc(DEFAULT_MASTER_CLASS);
      showToast('Propuesta de Master Class reiniciada');
    }
  };

  // ================= DATABASE BACKUP & RESTORE (.JSON) =================
  const handleExportBackup = () => {
    try {
      const backupData = {
        app: "Eliotte MUA - Cotizaciones y Facturas",
        version: 3,
        exportedAt: new Date().toISOString(),
        counters: getStoredCounters(),
        users: users,
        currentDocs: {
          docType,
          quoteDoc,
          invoiceDoc,
          masterClassDoc,
          activeMasterClassPage,
        },
        history: history,
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `Eliotte_MUA_Backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('¡Copia de seguridad (.json) descargada exitosamente!');
    } catch (e) {
      console.error('Error exporting backup', e);
      showToast('Error al descargar copia de seguridad: ' + e.message);
    }
  };

  const handleImportBackup = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const parsed = JSON.parse(content);

        // Validation
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Archivo JSON no válido');
        }

        if (parsed.counters) {
          saveStoredCounters(parsed.counters);
        }

        if (Array.isArray(parsed.users) && parsed.users.length > 0) {
          setUsers(parsed.users);
          saveStoredUsers(parsed.users);
        }

        if (Array.isArray(parsed.history)) {
          setHistory(parsed.history);
          localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(parsed.history));
        }

        if (parsed.currentDocs) {
          if (parsed.currentDocs.quoteDoc) setQuoteDoc(parsed.currentDocs.quoteDoc);
          if (parsed.currentDocs.invoiceDoc) setInvoiceDoc(parsed.currentDocs.invoiceDoc);
          if (parsed.currentDocs.masterClassDoc) setMasterClassDoc(parsed.currentDocs.masterClassDoc);
          if (parsed.currentDocs.docType) setDocType(parsed.currentDocs.docType);
          if (parsed.currentDocs.activeMasterClassPage) setActiveMasterClassPage(parsed.currentDocs.activeMasterClassPage);
        }

        showToast(`¡Copia de seguridad restaurada con éxito! (${parsed.history?.length || 0} docs en historial)`);
      } catch (err) {
        console.error('Error importing backup JSON', err);
        showToast('Error al importar archivo: Formato JSON no compatible');
      }
    };
    reader.readAsText(file);
  };

  // Manual snapshot save to History
  const handleSaveToHistory = () => {
    let docData;
    let label;
    if (docType === 'quote') {
      docData = quoteDoc;
      label = `Cotización ${quoteDoc.quoteNumber || ''}`;
    } else if (docType === 'invoice') {
      docData = invoiceDoc;
      label = `Factura ${invoiceDoc.invoiceNumber || ''}`;
    } else {
      docData = masterClassDoc;
      label = 'Master Class';
    }

    const newEntry = {
      id: Date.now().toString(),
      type: docType,
      savedAt: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(docData)),
    };
    const updated = [newEntry, ...history];
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
      showToast(`¡${label} guardada en el historial con éxito!`);
    } catch (e) {
      console.error(e);
      showToast('Error al guardar en historial');
    }
  };

  const handleLoadItem = (item) => {
    if (item.type === 'quote') {
      setDocType('quote');
      setQuoteDoc(item.data);
    } else if (item.type === 'invoice') {
      setDocType('invoice');
      setInvoiceDoc(item.data);
    } else {
      setDocType('masterclass');
      setMasterClassDoc(item.data);
    }
    showToast(`Documento cargado desde el historial`);
  };

  const handleDeleteHistoryItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Estás segura de que deseas vaciar todo el historial guardado?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_HISTORY_KEY);
      showToast('Historial vaciado');
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas reiniciar los campos con los valores predeterminados?')) {
      if (docType === 'quote') {
        setQuoteDoc(initialQuote);
      } else if (docType === 'invoice') {
        setInvoiceDoc(initialInvoice);
      } else {
        setMasterClassDoc(DEFAULT_MASTER_CLASS);
      }
      showToast('Formulario restablecido a valores iniciales');
    }
  };

  // Active element for PDF / Image export
  const getActiveElement = () => {
    if (docType === 'quote') return quoteRef.current;
    if (docType === 'invoice') return invoiceRef.current;
    return masterClassRef.current;
  };

  // PDF Export
  const handleDownloadPdf = async () => {
    const el = getActiveElement();
    if (!el) return;
    setIsExporting(true);
    showToast('Generando PDF en alta resolución con tipografía nativa...');
    try {
      let name;
      if (docType === 'quote') {
        name = `${quoteDoc.quoteNumber || 'Cotizacion'}-Eliotte-MUA-${quoteDoc.clientName || 'Cliente'}`.replace(/\s+/g, '_');
      } else if (docType === 'invoice') {
        name = `${invoiceDoc.invoiceNumber || 'Factura'}-Eliotte-MUA-${invoiceDoc.clientName || 'Cliente'}`.replace(/\s+/g, '_');
      } else {
        name = `MasterClass-${activeMasterClassPage}-Eliotte-MUA-${masterClassDoc.clientName || 'Cliente'}`.replace(/\s+/g, '_');
      }
      await downloadElementAsPdf(el, name);
      showToast('¡PDF descargado con éxito!');
    } catch (e) {
      console.error(e);
      showToast('Error al generar el PDF: ' + (e.message || ''));
    } finally {
      setIsExporting(false);
    }
  };

  // Image Export (JPG/PNG)
  const handleDownloadImage = async (format = 'jpg') => {
    const el = getActiveElement();
    if (!el) return;
    setIsExporting(true);
    showToast('Generando foto para WhatsApp...');
    try {
      let name;
      if (docType === 'quote') {
        name = `${quoteDoc.quoteNumber || 'Cotizacion'}-Eliotte-MUA-${quoteDoc.clientName || 'Cliente'}`.replace(/\s+/g, '_');
      } else if (docType === 'invoice') {
        name = `${invoiceDoc.invoiceNumber || 'Factura'}-Eliotte-MUA-${invoiceDoc.clientName || 'Cliente'}`.replace(/\s+/g, '_');
      } else {
        name = `MasterClass-${activeMasterClassPage}-Eliotte-MUA-${masterClassDoc.clientName || 'Cliente'}`.replace(/\s+/g, '_');
      }
      await downloadElementAsImage(el, name, format);
      showToast('¡Foto descargada lista para WhatsApp!');
    } catch (e) {
      console.error(e);
      showToast('Error al generar la imagen: ' + (e.message || ''));
    } finally {
      setIsExporting(false);
    }
  };

  // WhatsApp text summary
  const handleCopyWhatsApp = () => {
    let targetDoc;
    if (docType === 'quote') targetDoc = quoteDoc;
    else if (docType === 'invoice') targetDoc = invoiceDoc;
    else targetDoc = masterClassDoc;

    const text = generateWhatsAppMessage(targetDoc, docType);
    navigator.clipboard.writeText(text);
    setCopiedFeedback(true);
    showToast('¡Texto copiado al portapapeles para WhatsApp!');
    setTimeout(() => setCopiedFeedback(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // If user is not authenticated, show the Luxury Mobile-Friendly Login Screen
  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        onDirectRestoreBackup={handleDirectRestoreBackup} 
        onInstallApp={handleInstallApp}
        isInstallable={isInstallable}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans pb-16 lg:pb-0">
      {/* Top Navbar */}
      <div className="no-print">
        <Navbar
          docType={docType}
          onDownloadPdf={handleDownloadPdf}
          onDownloadImage={handleDownloadImage}
          onCopyWhatsApp={handleCopyWhatsApp}
          onPrint={handlePrint}
          onSave={handleSaveToHistory}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onReset={handleReset}
          onNewDocument={handleNewDocument}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
          onOpenLogoutModal={handleOpenLogoutModal}
          onOpenUsersModal={() => setIsUsersModalOpen(true)}
          onInstallApp={handleInstallApp}
          isInstallable={isInstallable}
          currentUser={currentUser}
          historyCount={history.length}
          isExporting={isExporting}
          copiedFeedback={copiedFeedback}
        />
      </div>

      {/* Auto-save status bar */}
      <div className="no-print bg-stone-200/70 border-b border-stone-300 px-3 sm:px-4 py-1 flex items-center justify-between text-[11px] text-stone-600">
        <div className="flex items-center space-x-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="truncate">Auto-guardado activo:</span>
          <span className="font-semibold text-stone-800 truncate">Cotizaciones y facturas seguras.</span>
        </div>
        {lastAutoSavedTime && (
          <div className="text-stone-500 hidden sm:block shrink-0">
            Último guardado: <strong>{lastAutoSavedTime}</strong>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 text-xs sm:text-sm animate-in slide-in-from-bottom duration-200 border border-stone-700 max-w-[90vw]">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="break-words">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Switcher (Form vs Preview) */}
      <div className="lg:hidden no-print bg-white border-b border-stone-200 px-3 py-1.5 flex space-x-2 justify-center sticky top-14 z-30 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileView('form')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
            mobileView === 'form'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Formulario</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
            mobileView === 'preview'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Vista Previa</span>
        </button>
      </div>

      {/* Main Split-View Workspace */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-2 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Left Column: Interactive Form Controls */}
        <div className={`lg:col-span-5 xl:col-span-5 lg:h-[calc(100vh-140px)] lg:sticky lg:top-20 ${mobileView === 'form' ? 'block' : 'hidden lg:block'}`}>
          <Form
            docType={docType}
            setDocType={setDocType}
            quoteDoc={quoteDoc}
            setQuoteDoc={setQuoteDoc}
            invoiceDoc={invoiceDoc}
            setInvoiceDoc={setInvoiceDoc}
            masterClassDoc={masterClassDoc}
            setMasterClassDoc={setMasterClassDoc}
            activeMasterClassPage={activeMasterClassPage}
            setActiveMasterClassPage={setActiveMasterClassPage}
            history={history}
            onNewQuote={handleNewDocument}
            onNewInvoice={handleNewDocument}
            onNextQuoteNumber={handleNextQuoteNumber}
            onNextInvoiceNumber={handleNextInvoiceNumber}
          />
        </div>

        {/* Right Column: Live High-Fidelity Canvas Preview */}
        <div className={`lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-start overflow-x-auto w-full ${mobileView === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <div className="w-full flex flex-col items-center">
            <DocumentCanvasViewer docType={docType}>
              {docType === 'quote' && (
                <PreviewQuote doc={quoteDoc} quoteRef={quoteRef} />
              )}

              {docType === 'invoice' && (
                <PreviewInvoice doc={invoiceDoc} invoiceRef={invoiceRef} />
              )}

              {docType === 'masterclass' && (
                <PreviewMasterClass
                  doc={masterClassDoc}
                  masterClassRef={masterClassRef}
                  activePage={activeMasterClassPage}
                  setActivePage={setActiveMasterClassPage}
                />
              )}
            </DocumentCanvasViewer>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar for Mobile Devices (< 1024px) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 p-2 z-40 flex items-center justify-around shadow-2xl no-print">
        <button
          type="button"
          onClick={() => setMobileView('form')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            mobileView === 'form' 
              ? 'bg-rose-600 text-white shadow-md' 
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Editar</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            mobileView === 'preview' 
              ? 'bg-white text-stone-900 shadow-md font-bold' 
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Ver Canvas</span>
        </button>

        <button
          type="button"
          onClick={handleCopyWhatsApp}
          className="flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          title="Copiar texto para WhatsApp"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Login Backup Prompt Modal */}
      <LoginBackupPromptModal
        isOpen={showLoginBackupModal}
        onClose={() => setShowLoginBackupModal(false)}
        onImportBackup={handleImportBackup}
        userName={currentUser?.name}
      />

      {/* Logout Confirmation & Backup Download Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirmModal}
        onClose={() => setShowLogoutConfirmModal(false)}
        onDownloadAndLogout={handleDownloadAndLogout}
        onDirectLogout={handleDirectLogout}
      />

      {/* History & Backups Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={handleLoadItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearHistory}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Team / Users Management Modal */}
      <UserManagementModal
        isOpen={isUsersModalOpen}
        onClose={() => setIsUsersModalOpen(false)}
        users={users}
        onSaveUsers={handleSaveUsers}
        currentUser={currentUser}
        showToast={showToast}
      />
    </div>
  );
}
