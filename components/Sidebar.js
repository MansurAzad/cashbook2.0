function Sidebar({ currentView, onNavigate, isMobileOpen, closeMobileSidebar }) {
    const menuItems = [
        { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: 'icon-layout-dashboard' },
        { id: 'transactions', label: 'লেনদেন', icon: 'icon-arrow-right-left' },
        { id: 'accounts', label: 'অ্যাকাউন্টস', icon: 'icon-wallet' },
        { id: 'loans', label: 'ঋণ / ধার', icon: 'icon-hand-coins' },
        { id: 'calendar', label: 'ক্যালেন্ডার', icon: 'icon-calendar-days' },
        { id: 'budget', label: 'বাজেট', icon: 'icon-piggy-bank' },
        { id: 'goals', label: 'সেভিংস', icon: 'icon-target' },
        { id: 'bills', label: 'বিল', icon: 'icon-receipt' },
        { id: 'investments', label: 'বিনিয়োগ', icon: 'icon-trending-up' },
        { id: 'tools', label: 'টুলস', icon: 'icon-wrench' },
        { id: 'reports', label: 'রিপোর্ট', icon: 'icon-chart-pie' },
        { id: 'settings', label: 'সেটিংস', icon: 'icon-settings' },
    ];

    // Swipe left to close sidebar on mobile
    const { onTouchStart, onTouchMove, onTouchEnd } = GestureHooks.useSwipe({
        onSwipeLeft: closeMobileSidebar,
        threshold: 50
    });

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={closeMobileSidebar}
                ></div>
            )}

            <aside 
                className={`
                    fixed lg:static inset-y-0 left-0 z-30 no-print
                    w-[var(--sidebar-width)] bg-white border-r border-gray-200 
                    transform transition-transform duration-300 ease-in-out
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    flex flex-col h-full
                `}
                onTouchStart={isMobileOpen ? onTouchStart : undefined}
                onTouchMove={isMobileOpen ? onTouchMove : undefined}
                onTouchEnd={isMobileOpen ? onTouchEnd : undefined}
            >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <div className="icon-wallet text-emerald-600"></div>
                        </div>
                        <span className="text-xl font-bold text-gray-800">জমা-খরচ ৩৬০</span>
                    </div>
                    <button className="lg:hidden text-gray-500" onClick={closeMobileSidebar}>
                        <div className="icon-x"></div>
                    </button>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    {menuItems.map(item => (
                        <div 
                            key={item.id}
                            className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <div className={item.icon + " text-lg"}></div>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="icon-shield-check text-emerald-600"></div>
                            <p className="text-xs text-emerald-600 font-bold uppercase">নিরাপদ</p>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">পিন লক ও প্রাইভেসি মোড দ্বারা সুরক্ষিত</p>
                    </div>
                </div>
            </aside>
        </>
    );
}