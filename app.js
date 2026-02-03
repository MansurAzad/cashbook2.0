// Important: DO NOT remove this `ErrorBoundary` component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-[Hind Siliguri]">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="icon-triangle-alert text-red-500 text-2xl"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">কিছু একটা ভুল হয়েছে</h1>
            <p className="text-gray-600 mb-6">আমরা দুঃখিত, একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে। দয়া করে পেজটি রিলোড করুন।</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              পেজ রিলোড করুন
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function PinLockScreen({ correctPin, onUnlock }) {
    const [pin, setPin] = React.useState('');
    const [error, setError] = React.useState('');
    const [isScanning, setIsScanning] = React.useState(false);

    // Simulated Face ID
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsScanning(true);
            setTimeout(() => {
                setIsScanning(false);
                // In a real app, we would verify here. 
                // For demo, we just show animation then let user enter PIN.
            }, 2000);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handlePin = (val) => {
        if(navigator.vibrate) navigator.vibrate(10);
        const newPin = pin + val;
        setPin(newPin);
        if (newPin.length === 4) {
            if (newPin === correctPin) {
                if(navigator.vibrate) navigator.vibrate([50, 50]);
                onUnlock();
            } else {
                if(navigator.vibrate) navigator.vibrate(200);
                setError('ভুল পিন');
                setPin('');
                setTimeout(() => setError(''), 1000);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-[100] text-white font-[Hind Siliguri]">
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xs relative">
                
                {/* Face ID Animation */}
                <div className="mb-10 relative">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-700 ${isScanning ? 'bg-transparent border-4 border-emerald-500 scale-110' : 'bg-gray-800 border-0'}`}>
                        {isScanning ? (
                            <div className="icon-scan-face text-4xl text-emerald-500 animate-pulse"></div>
                        ) : (
                            <div className="icon-lock text-3xl text-gray-400"></div>
                        )}
                    </div>
                    {isScanning && <p className="absolute -bottom-8 left-0 right-0 text-center text-emerald-500 text-xs font-bold tracking-widest uppercase">Scanning Face ID</p>}
                </div>

                <h2 className="text-xl font-medium mb-8 text-gray-300">পিন দিয়ে আনলক করুন</h2>
                
                <div className="flex justify-center gap-6 mb-12">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${i < pin.length ? 'bg-white border-white scale-110' : 'border-gray-600'}`}></div>
                    ))}
                </div>
                
                {error && <p className="text-red-500 mb-4 animate-shake font-bold">{error}</p>}
                
                <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full px-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <button key={n} onClick={() => handlePin(n.toString())} className="w-16 h-16 rounded-full bg-white/10 text-2xl font-bold active:bg-white/30 transition-all active:scale-95 flex items-center justify-center backdrop-blur-sm hover:bg-white/15">
                            {n}
                        </button>
                    ))}
                    <div></div>
                    <button onClick={() => handlePin('0')} className="w-16 h-16 rounded-full bg-white/10 text-2xl font-bold active:bg-white/30 transition-all active:scale-95 flex items-center justify-center backdrop-blur-sm hover:bg-white/15">0</button>
                    <button onClick={() => setPin(pin.slice(0, -1))} className="w-16 h-16 rounded-full flex items-center justify-center active:bg-transparent text-gray-400 active:text-white transition-colors">
                        <div className="icon-delete text-2xl"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}

function App() {
  try {
    const [view, setView] = React.useState('dashboard');
    const [viewParams, setViewParams] = React.useState(null); 
    const [isLoading, setIsLoading] = React.useState(true);
    const [isOnline, setIsOnline] = React.useState(navigator.onLine);
    const [isLocked, setIsLocked] = React.useState(false);
    const [data, setData] = React.useState({
        transactions: [],
        categories: { all: [], income: [], expense: [] },
        budgets: [],
        goals: [],
        bills: [],
        investments: [],
        accounts: [],
        loans: []
    });
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
    const [settings, setSettings] = React.useState({ 
        darkMode: false,
        privacyMode: false,
        currency: 'BDT',
        themeColor: '#10B981',
        enableHaptic: true,
        pinLock: null
    });

    // PWA Install Prompt State
    const [deferredPrompt, setDeferredPrompt] = React.useState(null);
    const [showInstallPrompt, setShowInstallPrompt] = React.useState(false);

    // Global Notification State
    const [toast, setToast] = React.useState(null); 
    const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, title: '', message: '', onConfirm: null });
    const [showConfetti, setShowConfetti] = React.useState(false);
    
    // Undo State
    const [lastAction, setLastAction] = React.useState(null); // { type: 'delete_transaction', payload: data }
    const [undoToast, setUndoToast] = React.useState(false);

    // Listen for PWA Install Event
    React.useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Show the install button
            setTimeout(() => setShowInstallPrompt(true), 5000); // Show after 5s
        });

        window.addEventListener('appinstalled', () => {
            setDeferredPrompt(null);
            setShowInstallPrompt(false);
            notify('অ্যাপ ইনস্টল সফল হয়েছে!', 'success');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4000);
        });

        // Check if query params has action
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        if (action === 'add_transaction') {
             // Will be handled after loading data
             setViewParams({ action: 'add' });
             setView('transactions');
        }
    }, []);

    // Shake to Undo
    GestureHooks.useShake(() => {
        if (lastAction) {
            if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
            handleUndo();
        }
    });

    // Privacy Blur on background
    React.useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden && settings.privacyMode) {
                document.body.classList.add('app-blurred');
            } else {
                document.body.classList.remove('app-blurred');
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [settings.privacyMode]);

    const notify = (message, type = 'success') => {
        setToast({ message, type });
        if(settings.enableHaptic && navigator.vibrate) navigator.vibrate(50);
    };

    const confirmAction = (title, message, action) => {
        if(settings.enableHaptic && navigator.vibrate) navigator.vibrate(50);
        setConfirmDialog({
            isOpen: true,
            title,
            message,
            onConfirm: async () => {
                await action();
                setConfirmDialog({ ...confirmDialog, isOpen: false });
            }
        });
    };

    const handleNavigate = (viewName, params = null) => {
        if(settings.enableHaptic && navigator.vibrate) navigator.vibrate(10);
        setView(viewName);
        setViewParams(params);
        if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
        // Scroll to top
        const mainContent = document.getElementById('main-content');
        if(mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Initial Data Fetch
    const loadData = async () => {
        setIsLoading(true);
        try {
            const fetchedData = await DataManager.fetchData();
            const savedSettings = DataManager.getSettings();
            setData(fetchedData);
            setSettings(savedSettings);
            if(savedSettings.pinLock) setIsLocked(true);
        } catch (error) {
            console.error('Failed to load initial data:', error);
            notify('ডাটা লোড করতে সমস্যা হয়েছে', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        loadData();
        const handleOnline = () => {
            setIsOnline(true);
            notify('ইন্টারনেট সংযোগ ফিরে এসেছে', 'info');
            DataManager.processSyncQueue();
            loadData();
        };
        const handleOffline = () => {
            setIsOnline(false);
            notify('ইন্টারনেট সংযোগ বিচ্ছিন্ন', 'warning');
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    React.useEffect(() => {
        if (settings.darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        
        if (settings.privacyMode) document.body.classList.add('privacy-mode-active');
        else document.body.classList.remove('privacy-mode-active');

        if (settings.themeColor) document.documentElement.style.setProperty('--primary-color', settings.themeColor);
    }, [settings]);

    const handleUpdateSettings = (newSettings) => {
        setSettings(newSettings);
        DataManager.saveSettings(newSettings);
        notify('সেটিংস আপডেট করা হয়েছে');
    };

    // Undo Handler
    const handleUndo = async () => {
        if (!lastAction) return;
        setUndoToast(false);
        
        try {
            if (lastAction.type === 'delete_transaction') {
                await DataManager.addTransaction(lastAction.payload);
                notify('লেনদেন পুনরুদ্ধার করা হয়েছে');
            } else if (lastAction.type === 'delete_category') {
                await DataManager.addCategory(lastAction.payload);
                notify('ক্যাটাগরি পুনরুদ্ধার করা হয়েছে');
            }
            // Add more undo cases as needed
            
            const newData = await DataManager.fetchData();
            setData(newData);
            setLastAction(null);
        } catch (e) {
            console.error('Undo failed', e);
            notify('আনডু ব্যর্থ হয়েছে', 'error');
        }
    };

    const registerUndo = (type, payload) => {
        setLastAction({ type, payload });
        setUndoToast(true);
        setTimeout(() => setUndoToast(false), 5000);
    };

    // Handlers
    const handleTransaction = async (action, payload) => {
        try {
            let newData;
            if (action === 'add') {
                newData = await DataManager.addTransaction(payload);
                notify('লেনদেন সফলভাবে যুক্ত হয়েছে');
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            } else if (action === 'update') {
                newData = await DataManager.updateTransaction(payload.id, payload);
                notify('লেনদেন আপডেট করা হয়েছে');
            } else if (action === 'delete') {
                // Find data before delete for Undo
                const item = data.transactions.find(t => t.id === payload);
                if (item) registerUndo('delete_transaction', item);

                newData = await DataManager.deleteTransaction(payload);
                notify('লেনদেন মুছে ফেলা হয়েছে', 'error');
            }
            setData(newData);
        } catch (e) { 
            console.error(e);
            notify('কিছু একটা সমস্যা হয়েছে', 'error');
        }
    };

    // Other handlers... (Simplified for brevity, assuming same pattern)
    // ... [Copy previous handlers and adapt similarly if needed] ...
    const handleBudget = async (action, payload) => {
        try {
            let newData;
            if (action === 'save') { newData = await DataManager.saveBudget(payload.budget, payload.id); notify('বাজেট সংরক্ষণ করা হয়েছে'); }
            else if (action === 'delete') { newData = await DataManager.deleteBudget(payload); notify('বাজেট মুছে ফেলা হয়েছে', 'error'); }
            setData(newData);
        } catch (e) { console.error(e); notify('ত্রুটি', 'error'); }
    };
    const handleCategory = async (action, payload) => {
        try {
            let newData;
            if (action === 'add') { newData = await DataManager.addCategory(payload); notify('ক্যাটাগরি যুক্ত হয়েছে'); }
            else { 
                const item = data.categories.all.find(c => c.id === payload);
                if(item) registerUndo('delete_category', item);
                newData = await DataManager.deleteCategory(payload); 
                notify('ক্যাটাগরি মুছে ফেলা হয়েছে', 'error'); 
            }
            setData(newData);
        } catch (e) { console.error(e); notify('ত্রুটি', 'error'); }
    };
    const handleGoal = async (action, id, payload) => {
        try {
            let newData;
            if(action === 'add') { newData = await DataManager.addGoal(payload); notify('গোল যুক্ত হয়েছে'); }
            else if(action === 'update') { newData = await DataManager.updateGoal(id, payload); notify('গোল আপডেট করা হয়েছে'); }
            else if(action === 'delete') { newData = await DataManager.deleteGoal(id); notify('গোল মুছে ফেলা হয়েছে', 'error'); }
            setData(newData);
        } catch (e) { console.error(e); notify('ত্রুটি', 'error'); }
    };
    const handleBill = async (action, id, payload) => {
        try {
            let newData;
            if(action === 'add') { newData = await DataManager.addBill(payload); notify(id?'বিল রিনিউ হয়েছে':'বিল যুক্ত হয়েছে'); }
            else if(action === 'update') { newData = await DataManager.updateBill(id, payload); }
            else if(action === 'delete') { newData = await DataManager.deleteBill(id); notify('বিল মুছে ফেলা হয়েছে', 'error'); }
            setData(newData);
        } catch (e) { console.error(e); notify('ত্রুটি', 'error'); }
    };
    const handleInvestment = async (action, id, payload) => {
        try {
            let newData;
            if(action === 'add') { newData = await DataManager.addInvestment(payload); notify('ইনভেস্টমেন্ট যুক্ত হয়েছে'); }
            else if(action === 'update') { newData = await DataManager.updateInvestment(id, payload); notify('ইনভেস্টমেন্ট আপডেট হয়েছে'); }
            else if(action === 'delete') { newData = await DataManager.deleteInvestment(id); notify('ইনভেস্টমেন্ট মুছে ফেলা হয়েছে', 'error'); }
            setData(newData);
        } catch (e) { console.error(e); notify('ত্রুটি', 'error'); }
    };
    const handleAccount = async (action, id, payload) => {
        try {
            let newData;
            if(action === 'add') { newData = await DataManager.addAccount(payload); notify('অ্যাকাউন্ট যুক্ত হয়েছে'); }
            else if(action === 'update') { newData = await DataManager.updateAccount(id, payload); notify('অ্যাকাউন্ট আপডেট হয়েছে'); }
            else if(action === 'delete') { newData = await DataManager.deleteAccount(id); notify('অ্যাকাউন্ট মুছে ফেলা হয়েছে', 'error'); }
            setData(newData);
        } catch (e) { console.error(e); notify('ত্রুটি', 'error'); }
    };
    const handleLoan = async (action, id, payload) => {
        try {
            let newData;
            if(action === 'add') { newData = await DataManager.addLoan(payload); notify('ঋণ যুক্ত হয়েছে'); }
            else if(action === 'update') { newData = await DataManager.updateLoan(id, payload); notify('ঋণ আপডেট হয়েছে'); }
            else if(action === 'delete') { newData = await DataManager.deleteLoan(id); notify('ঋণ মুছে ফেলা হয়েছে', 'error'); }
            setData(newData);
        } catch (e) { console.error(e); notify('ত্রুটি', 'error'); }
    };

    const getTitle = () => {
        // ... (Keep existing title logic)
        const titles = {
            dashboard: 'ড্যাশবোর্ড', transactions: 'লেনদেন সমূহ', calendar: 'ক্যালেন্ডার ভিউ', goals: 'সেভিংস গোল',
            bills: 'বিল রিমাইন্ডার', investments: 'ইনভেস্টমেন্ট', reports: 'রিপোর্ট', budget: 'বাজেট প্ল্যানিং',
            settings: 'সেটিংস', accounts: 'অ্যাকাউন্টস', loans: 'ঋণ ব্যবস্থাপনা', tools: 'টুলস'
        };
        return titles[view] || 'ড্যাশবোর্ড';
    };

    const getCurrencySymbol = () => {
        const map = { 'BDT': '৳', 'USD': '$', 'EUR': '€', 'INR': '₹' };
        return map[settings.currency] || '৳';
    };

    if (isLocked) return <PinLockScreen correctPin={settings.pinLock} onUnlock={() => setIsLocked(false)} />;

    return (
      <div className={`flex h-screen bg-[var(--bg-color)] overflow-hidden transition-colors duration-300 ${settings.darkMode ? 'dark:bg-gray-900 dark:text-white' : ''}`} data-name="app">
        
        {/* Global Styles */}
        <style dangerouslySetInnerHTML={{__html: `
            .privacy-mode-active .text-2xl.font-bold, 
            .privacy-mode-active .text-3xl.font-bold,
            .privacy-mode-active .text-4xl.font-bold,
            .privacy-mode-active .font-bold.text-right {
                filter: blur(5px);
                user-select: none;
                transition: filter 0.3s;
            }
            .privacy-mode-active .text-2xl.font-bold:hover, 
            .privacy-mode-active .text-3xl.font-bold:hover,
            .privacy-mode-active .text-4xl.font-bold:hover,
            .privacy-mode-active .font-bold.text-right:hover {
                filter: none;
            }
            .app-blurred #main-content, .app-blurred aside {
                filter: blur(10px);
                transition: filter 0.2s;
            }
            @keyframes confetti-drop {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            .animate-confetti-drop { animation: confetti-drop 3s linear forwards; }
            @keyframes slide-up-ios {
                0% { transform: translateY(100%); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            .animate-slide-up-ios { animation: slide-up-ios 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            @keyframes fade-in-down {
                0% { transform: translate(-50%, -20px); opacity: 0; }
                100% { transform: translate(-50%, 0); opacity: 1; }
            }
            .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            .animate-shake { animation: shake 0.3s ease-in-out; }
        `}} />

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        {undoToast && <UndoToast onUndo={handleUndo} onClose={() => setUndoToast(false)} />}
        {showConfetti && <Confetti />}
        {showInstallPrompt && <InstallPWA deferredPrompt={deferredPrompt} onClose={() => setShowInstallPrompt(false)} />}
        
        <ConfirmModal 
            isOpen={confirmDialog.isOpen} 
            title={confirmDialog.title} 
            message={confirmDialog.message} 
            onConfirm={confirmDialog.onConfirm} 
            onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} 
        />

        <Sidebar 
            currentView={view} 
            onNavigate={handleNavigate}
            isMobileOpen={isMobileSidebarOpen}
            closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col min-w-0 relative">
            <Header 
                toggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
                title={getTitle()}
            />
            
            <ScrollProgress />

            {!isOnline && (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-1 text-xs text-center font-medium no-print">
                    অফলাইন মোড
                </div>
            )}
            
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8 scroll-smooth relative" id="main-content">
                {isLoading && !data.categories.all.length ? (
                     <div className="p-8">
                        <SkeletonLoader count={3} type="card" />
                     </div>
                ) : (
                    <div className="max-w-6xl mx-auto">
                        {/* Views */}
                        {view === 'dashboard' && <Dashboard data={data} onNavigate={handleNavigate} onRefresh={async () => { await loadData(); notify('রিফ্রেশ সম্পূর্ণ'); }} />}
                        {view === 'transactions' && <Transactions data={data} onAdd={(d)=>handleTransaction('add',d)} onUpdate={(id,d)=>handleTransaction('update',{id,...d})} onDelete={(id)=>confirmAction('লেনদেন মুছুন', 'এটি মুছে ফেলতে চান?', ()=>handleTransaction('delete',id))} loading={false} currencySymbol={getCurrencySymbol()} initialParams={viewParams} />}
                        {view === 'accounts' && <Accounts data={data} onAdd={(d)=>handleAccount('add',null,d)} onUpdate={(id,d)=>handleAccount('update',id,d)} onDelete={(id)=>confirmAction('অ্যাকাউন্ট মুছুন', 'নিশ্চিত?', ()=>handleAccount('delete',id))} loading={isLoading} currencySymbol={getCurrencySymbol()} />}
                        {view === 'loans' && <Loans data={data} onAdd={(d)=>handleLoan('add',null,d)} onUpdate={(id,d)=>handleLoan('update',id,d)} onDelete={(id)=>confirmAction('ঋণ মুছুন', 'নিশ্চিত?', ()=>handleLoan('delete',id))} loading={isLoading} currencySymbol={getCurrencySymbol()} />}
                        {view === 'tools' && <Tools />}
                        {view === 'calendar' && <CalendarView data={data} />}
                        {view === 'goals' && <Goals data={data} onAdd={(d)=>handleGoal('add',null,d)} onUpdate={(id,d)=>handleGoal('update',id,d)} onDelete={(id)=>confirmAction('গোল মুছুন', 'নিশ্চিত?', ()=>handleGoal('delete',id))} loading={isLoading} currencySymbol={getCurrencySymbol()} />}
                        {view === 'bills' && <Bills data={data} onAdd={(d)=>handleBill('add',null,d)} onUpdate={(id,d)=>handleBill('update',id,d)} onDelete={(id)=>confirmAction('বিল মুছুন', 'নিশ্চিত?', ()=>handleBill('delete',id))} loading={isLoading} currencySymbol={getCurrencySymbol()} confirmAction={confirmAction} />}
                        {view === 'investments' && <Investments data={data} onAdd={(d)=>handleInvestment('add',null,d)} onUpdate={(id,d)=>handleInvestment('update',id,d)} onDelete={(id)=>confirmAction('ইনভেস্টমেন্ট মুছুন', 'নিশ্চিত?', ()=>handleInvestment('delete',id))} loading={isLoading} currencySymbol={getCurrencySymbol()} />}
                        {view === 'reports' && <Reports data={data} />}
                        {view === 'budget' && <Budget data={data} onAdd={(d)=>handleBudget('add',null,d)} onUpdate={(id,d)=>handleBudget('update',id,d)} onDelete={(id)=>confirmAction('বাজেট মুছুন', 'নিশ্চিত?', ()=>handleBudget('delete',id))} loading={isLoading} currencySymbol={getCurrencySymbol()} />}
                        {view === 'settings' && <Settings data={data} onAddCategory={(d)=>handleCategory('add',d)} onDeleteCategory={(id)=>confirmAction('ক্যাটাগরি মুছুন', 'নিশ্চিত?', ()=>handleCategory('delete',id))} settings={settings} updateSettings={handleUpdateSettings} notify={notify} />}
                    </div>
                )}
            </main>

            <BottomNav 
                currentView={view} 
                onNavigate={handleNavigate} 
                onOpenMenu={() => setIsMobileSidebarOpen(true)}
            />
        </div>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);