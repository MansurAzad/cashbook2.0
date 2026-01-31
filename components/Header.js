function Header({ toggleSidebar, title }) {
    const [showQuickMenu, setShowQuickMenu] = React.useState(false);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                >
                    <div className="icon-menu text-gray-600"></div>
                </button>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            </div>
            
            <div className="flex items-center gap-4 relative">
                <button className="p-2 hover:bg-gray-100 rounded-full relative">
                    <div className="icon-bell text-gray-600"></div>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div 
                    className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm cursor-pointer select-none"
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