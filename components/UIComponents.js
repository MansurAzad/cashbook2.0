const Toast = ({ message, type, onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-emerald-500/90',
        error: 'bg-red-500/90',
        info: 'bg-blue-500/90',
        warning: 'bg-orange-500/90'
    };

    const icons = {
        success: 'icon-check',
        error: 'icon-triangle-alert',
        info: 'icon-info',
        warning: 'icon-circle-alert'
    };

    const { onTouchStart, onTouchMove, onTouchEnd } = GestureHooks.useSwipe({
        onSwipeLeft: onClose,
        onSwipeRight: onClose,
        threshold: 30
    });

    return (
        <div 
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md text-white animate-fade-in-down ${bgColors[type] || bgColors.info} touch-none border border-white/20`}
        >
            <div className={icons[type] || icons.info}></div>
            <p className="font-medium text-sm whitespace-nowrap">{message}</p>
        </div>
    );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    const { onTouchStart, onTouchMove, onTouchEnd } = GestureHooks.useSwipe({
        onSwipeDown: onCancel,
        threshold: 50
    });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center sm:p-4 animate-fade-in">
            <div 
                className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-slide-up-ios relative"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 opacity-50"></div>
                
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 leading-relaxed">{message}</p>
                </div>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={onConfirm}
                        className="w-full py-3.5 bg-red-500 text-white rounded-xl font-semibold text-lg active:scale-95 transition-transform shadow-lg shadow-red-200"
                    >
                        হ্যাঁ, নিশ্চিত
                    </button>
                    <button 
                        onClick={onCancel}
                        className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg active:scale-95 transition-transform"
                    >
                        বাতিল
                    </button>
                </div>
            </div>
        </div>
    );
};

const SkeletonLoader = ({ type = 'text', count = 1 }) => {
    return (
        <div className="space-y-3 animate-pulse">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                    {type === 'card' && <div className="rounded-full bg-gray-200 h-12 w-12"></div>}
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Confetti = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-confetti-drop"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 20}px`,
                        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                    }}
                ></div>
            ))}
        </div>
    );
};

const ScrollProgress = () => {
    const [width, setWidth] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const el = document.getElementById('main-content');
            if (el) {
                const totalHeight = el.scrollHeight - el.clientHeight;
                const progress = (el.scrollTop / totalHeight) * 100;
                setWidth(progress);
            }
        };
        const el = document.getElementById('main-content');
        if (el) el.addEventListener('scroll', handleScroll);
        return () => {
            if (el) el.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="fixed top-[64px] left-0 h-1 bg-gray-100 w-full z-20">
            <div className="h-full bg-emerald-500 transition-all duration-100 ease-out" style={{ width: `${width}%` }}></div>
        </div>
    );
};

const UndoToast = ({ onUndo, onClose }) => {
    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-slide-up-ios">
            <span>মুছে ফেলা হয়েছে</span>
            <button 
                onClick={onUndo} 
                className="text-emerald-400 font-bold uppercase text-sm tracking-wider"
            >
                UNDO
            </button>
            <button onClick={onClose} className="opacity-50 hover:opacity-100">
                <div className="icon-x"></div>
            </button>
        </div>
    );
};

const InstallPWA = ({ deferredPrompt, onClose }) => {
    if (!deferredPrompt) return null;

    const handleInstall = async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }
        onClose();
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-slide-up-ios bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] lg:w-96 lg:right-4 lg:left-auto lg:bottom-4 lg:rounded-xl lg:border">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <div className="icon-wallet text-white text-2xl"></div>
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-800">অ্যাপ ইনস্টল করুন</h4>
                    <p className="text-xs text-gray-500">সেরা অভিজ্ঞতার জন্য অ্যাপটি ইনস্টল করুন</p>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600"
                >
                    <div className="icon-x"></div>
                </button>
            </div>
            <button 
                onClick={handleInstall}
                className="w-full mt-4 bg-gray-900 text-white font-bold py-3 rounded-lg shadow-lg active:scale-95 transition-transform"
            >
                ইনস্টল করুন
            </button>
        </div>
    );
};