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
                    className="fixed inset-0 bg-black/20 z-30 backdrop-blur-sm" 
                    onClick={() => setIsMenuOpen(false)}
                >
                    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col gap-4 items-center">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onNavigate('transactions', { action: 'add', type: 'income' }); setIsMenuOpen(false); }}
                            className="flex items-center gap-4 bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-xl hover:bg-emerald-600 active:scale-95 transition-all font-bold text-base"
                        >
                            <div className="icon-arrow-down-left text-2xl"></div> আয় যুক্ত করুন
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onNavigate('transactions', { action: 'add', type: 'expense' }); setIsMenuOpen(false); }}
                            className="flex items-center gap-4 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-xl hover:bg-red-600 active:scale-95 transition-all font-bold text-base"
                            style={{ animationDelay: '0.05s' }}
                        >
                            <div className="icon-arrow-up-right text-2xl"></div> ব্যয় যুক্ত করুন
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onNavigate('goals'); setIsMenuOpen(false); }}
                            className="flex items-center gap-4 bg-blue-500 text-white px-8 py-4 rounded-2xl shadow-xl hover:bg-blue-600 active:scale-95 transition-all font-bold text-base"
                            style={{ animationDelay: '0.1s' }}
                        >
                            <div className="icon-target text-2xl"></div> গোল ডিপোজিট
                        </button>
                    </div>
                </div>
            )}

            <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 lg:hidden z-40 pb-safe-area shadow-2xl">
                <div className="flex justify-around items-center h-20">
                    {navItems.map(item => {
                        if (item.isFab) {
                            return (
                                <button 
                                    key={item.id}
                                    onClick={() => handleClick(item)}
                                    className={`relative -top-6 bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-red-300 hover:bg-red-700 active:scale-90 transition-all border-4 border-white font-bold text-3xl ${isMenuOpen ? 'rotate-45 bg-red-700 scale-105' : 'rotate-0'}`}
                                >
                                    <div className={`${item.icon} text-3xl`}></div>
                                </button>
                            );
                        }
                        
                        const isActive = currentView === item.id;
                        return (
                            <button 
                                key={item.id}
                                onClick={() => handleClick(item)}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1.5 active:scale-85 transition-transform font-bold ${isActive ? 'text-emerald-600' : 'text-gray-600'}`}
                            >
                                <div className={`${item.icon} text-2xl transition-all ${isActive ? 'scale-110 drop-shadow-lg' : 'scale-100'}`}></div>
                                <span className="text-[11px] font-black">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}