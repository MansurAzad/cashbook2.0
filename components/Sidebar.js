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
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-md">
                            <div className="icon-wallet text-emerald-600 text-2xl"></div>
                        </div>
                        <span className="text-2xl font-black text-gray-900">জমা-খরচ ৩৬০</span>
                    </div>
                    <button className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors active:scale-90" onClick={closeMobileSidebar}>
                        <div className="icon-x text-2xl"></div>
                    </button>
                </div>

                <nav className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-2">
                    {menuItems.map(item => (
                        <div 
                            key={item.id}
                            className={`sidebar-item text-base font-bold py-4 px-5 ${currentView === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <div className={item.icon + " text-2xl"}></div>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>

                <div className="p-5 border-t border-gray-100">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="icon-shield-check text-emerald-600 text-2xl"></div>
                            <p className="text-xs text-emerald-700 font-black uppercase tracking-wider">নিরাপদ</p>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-semibold">পিন লক ও প্রাইভেসি মোড দ্বারা সুরক্ষিত</p>
                    </div>
                </div>
            </aside>
        </>
    );
}