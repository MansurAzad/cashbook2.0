function BottomNav({ currentView, onNavigate, onOpenMenu }) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const navItems = [
        { id: 'dashboard', label: 'হোম', icon: 'icon-layout-dashboard' },
        { id: 'transactions', label: 'লেনদেন', icon: 'icon-arrow-right-left' },
        { id: 'add', label: 'যুক্ত করুন', icon: 'icon-plus', isFab: true },
        { id: 'reports', label: 'রিপোর্ট', icon: 'icon-chart-pie' },
        { id: 'menu', label: 'মেনু', icon: 'icon-menu', isAction: true },
    ];

    const handleClick = (item) => {
        if (item.isAction && item.id === 'menu') {
            onOpenMenu();
        } else if (item.isFab) {
            setIsMenuOpen(!isMenuOpen);
        } else {
            onNavigate(item.id);
            setIsMenuOpen(false);
        }
    };

    return (
        <>
            {/* Expanded FAB Menu */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-30" 
                    onClick={() => setIsMenuOpen(false)}
                >
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-3 items-center">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onNavigate('transactions', { action: 'add', type: 'income' }); setIsMenuOpen(false); }}
                            className="flex items-center gap-3 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg animate-slide-up-ios hover:scale-105 transition-transform"
                        >
                            <div className="icon-arrow-down-left"></div> আয় যুক্ত করুন
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onNavigate('transactions', { action: 'add', type: 'expense' }); setIsMenuOpen(false); }}
                            className="flex items-center gap-3 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg animate-slide-up-ios hover:scale-105 transition-transform"
                            style={{ animationDelay: '0.05s' }}
                        >
                            <div className="icon-arrow-up-right"></div> ব্যয় যুক্ত করুন
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onNavigate('goals'); setIsMenuOpen(false); }}
                            className="flex items-center gap-3 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg animate-slide-up-ios hover:scale-105 transition-transform"
                            style={{ animationDelay: '0.1s' }}
                        >
                            <div className="icon-target"></div> গোল ডিপোজিট
                        </button>
                    </div>
                </div>
            )}

            <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 lg:hidden z-40 pb-safe-area shadow-lg-up">
                <div className="flex justify-around items-center h-16">
                    {navItems.map(item => {
                        if (item.isFab) {
                            return (
                                <button 
                                    key={item.id}
                                    onClick={() => handleClick(item)}
                                    className={`relative -top-5 bg-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all border-4 border-white ${isMenuOpen ? 'rotate-45 bg-red-700' : 'rotate-0'}`}
                                >
                                    <div className={`${item.icon} text-2xl`}></div>
                                </button>
                            );
                        }
                        
                        const isActive = currentView === item.id;
                        return (
                            <button 
                                key={item.id}
                                onClick={() => handleClick(item)}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-90 transition-transform ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}
                            >
                                <div className={`${item.icon} text-xl transition-all ${isActive ? 'scale-110 drop-shadow-sm' : ''}`}></div>
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}