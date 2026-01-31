const SwipeableItem = ({ children, onSwipeLeft, onSwipeRight, leftAction, rightAction, className }) => {
    const [offset, setOffset] = React.useState(0);
    const startX = React.useRef(null);
    const currentX = React.useRef(null);
    const threshold = 80;

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        if (startX.current === null) return;
        currentX.current = e.touches[0].clientX;
        const diff = currentX.current - startX.current;
        
        // Limit swipe distance
        if (diff > 100) setOffset(100);
        else if (diff < -100) setOffset(-100);
        else setOffset(diff);
    };

    const handleTouchEnd = () => {
        if (offset > threshold) {
            // Swiped Right
            if (onSwipeRight) {
                onSwipeRight();
                setOffset(0); // Reset or keep open depending on UX, usually reset after action
            } else {
                setOffset(0);
            }
        } else if (offset < -threshold) {
            // Swiped Left
            if (onSwipeLeft) {
                onSwipeLeft();
                setOffset(0);
            } else {
                setOffset(0);
            }
        } else {
            setOffset(0);
        }
        startX.current = null;
        currentX.current = null;
    };

    // For desktop visualization (optional, mainly mobile feature)
    const style = {
        transform: `translateX(${offset}px)`,
        transition: startX.current ? 'none' : 'transform 0.3s ease-out'
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Background Actions */}
            <div className="absolute inset-y-0 left-0 w-full flex justify-between items-center px-4">
                <div className={`flex items-center text-white font-bold transition-opacity duration-300 ${offset > 20 ? 'opacity-100' : 'opacity-0'}`}>
                    {rightAction || <div className="icon-pencil"></div>}
                </div>
                <div className={`flex items-center text-white font-bold transition-opacity duration-300 ${offset < -20 ? 'opacity-100' : 'opacity-0'}`}>
                    {leftAction || <div className="icon-trash"></div>}
                </div>
            </div>
            
            {/* Background Colors Layer */}
            <div className={`absolute inset-y-0 left-0 h-full bg-blue-500 transition-all duration-300`} style={{ width: offset > 0 ? `${offset}px` : '0px' }}></div>
            <div className={`absolute inset-y-0 right-0 h-full bg-red-500 transition-all duration-300`} style={{ width: offset < 0 ? `${Math.abs(offset)}px` : '0px' }}></div>

            {/* Foreground Content */}
            <div 
                className="relative bg-white z-10"
                style={style}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {children}
            </div>
        </div>
    );
};

const ContextMenu = ({ isOpen, x, y, onClose, actions }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose}></div>
            <div 
                className="fixed z-50 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 w-48 py-2 animate-fade-in origin-top-left"
                style={{ top: y, left: Math.min(x, window.innerWidth - 200) }}
            >
                {actions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => { action.onClick(); onClose(); }}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors ${action.className || 'text-gray-700'}`}
                    >
                        {action.icon && <div className={`${action.icon} text-lg`}></div>}
                        <span className="font-medium text-sm">{action.label}</span>
                    </button>
                ))}
            </div>
        </>
    );
};

const PullToRefresh = ({ onRefresh, children }) => {
    const [pullY, setPullY] = React.useState(0);
    const [refreshing, setRefreshing] = React.useState(false);
    const startY = React.useRef(null);
    const threshold = 100;

    const handleTouchStart = (e) => {
        if (window.scrollY === 0) {
            startY.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e) => {
        if (startY.current === null) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;
        
        if (diff > 0) {
            setPullY(diff * 0.5); // Resistance
            // e.preventDefault(); // Prevent native scroll if needed, but be careful
        }
    };

    const handleTouchEnd = async () => {
        if (pullY > threshold) {
            setRefreshing(true);
            setPullY(60); // Hold position
            await onRefresh();
            setRefreshing(false);
        }
        setPullY(0);
        startY.current = null;
    };

    return (
        <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative"
        >
            {/* Loading Indicator */}
            <div 
                className="absolute left-0 w-full flex justify-center items-center pointer-events-none transition-all duration-300 overflow-hidden"
                style={{ top: refreshing ? '20px' : (pullY > 0 ? `${pullY/2}px` : '-40px'), height: '40px' }}
            >
                <div className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center ${refreshing ? 'animate-spin' : ''} ${pullY > 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="icon-loader text-emerald-600"></div>
                </div>
            </div>

            <div 
                style={{ transform: `translateY(${refreshing ? 60 : (pullY > 0 ? pullY : 0)}px)`, transition: refreshing ? 'transform 0.3s' : 'none' }}
            >
                {children}
            </div>
        </div>
    );
};