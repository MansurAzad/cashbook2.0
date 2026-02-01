function Header({ toggleSidebar, title }) {
    const [showQuickMenu, setShowQuickMenu] = React.useState(false);

    return (
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 shadow-sm">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="p-3 hover:bg-gray-100 rounded-full lg:hidden transition-colors active:scale-90"
                >
                    <div className="icon-menu text-gray-700 text-2xl"></div>
                </button>
                <h2 className="text-2xl font-black text-gray-900">{title}</h2>
            </div>
            
            <div className="flex items-center gap-3 relative">
                <button className="p-3 hover:bg-gray-100 rounded-full relative transition-colors active:scale-90">
                    <div className="icon-bell text-gray-700 text-xl"></div>
                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse"></span>
                </button>
                <div 
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-emerald-50 font-black border-3 border-white shadow-md cursor-pointer select-none hover:shadow-lg transition-all active:scale-90"
                    {...GestureHooks.useLongPress(() => setShowQuickMenu(true))}
                >
                    A
                </div>

                <ContextMenu 
                    isOpen={showQuickMenu}
                    x={window.innerWidth - 200}
                    y={60}
                    onClose={() => setShowQuickMenu(false)}
                    actions={[
                        { label: 'প্রোফাইল সেটিংস', icon: 'icon-user', onClick: () => {} },
                        { label: 'লগ আউট', icon: 'icon-log-out', className: 'text-red-600', onClick: () => {} }
                    ]}
                />
            </div>
        </header>
    );
}