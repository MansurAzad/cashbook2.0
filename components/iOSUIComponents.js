/**
 * iOS-Style UI Components
 * Fully optimized for iPhone & iOS design standards
 */

// ============= iOS TEXT INPUT FIELD =============
const iOSTextField = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    type = 'text',
    icon,
    error,
    required = false,
    onFocus,
    onBlur,
    disabled = false,
    maxLength,
    inputMode = 'text'
}) => {
    const [focused, setFocused] = React.useState(false);

    const handleFocus = (e) => {
        setFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setFocused(false);
        onBlur?.(e);
    };

    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className={`relative transition-all duration-200 ${
                focused ? 'transform scale-[1.02]' : ''
            }`}>
                <div className={`
                    flex items-center gap-3 px-5 py-4 rounded-2xl
                    border-2 transition-all duration-200
                    ${focused 
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-200/50' 
                        : 'border-gray-200 bg-gray-50'
                    }
                    ${error ? 'border-red-500 bg-red-50' : ''}
                    ${disabled ? 'bg-gray-100 opacity-50 cursor-not-allowed' : ''}
                `}>
                    {icon && (
                        <div className={`text-xl ${
                            focused ? 'text-emerald-500' : 'text-gray-400'
                        }`}>
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        maxLength={maxLength}
                        inputMode={inputMode}
                        className={`
                            flex-1 bg-transparent outline-none text-base font-medium
                            placeholder-gray-400 text-gray-900
                            disabled:cursor-not-allowed
                        `}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1">
                        <span className="text-sm">⚠️</span> {error}
                    </p>
                )}
            </div>
        </div>
    );
};

// ============= iOS CARD COMPONENT =============
const iOSCard = ({ 
    children, 
    className = '',
    interactive = true,
    onClick,
    backgroundColor = 'white',
    elevation = true,
    padded = true
}) => {
    const [isPressed, setIsPressed] = React.useState(false);

    const bgClasses = {
        white: 'bg-white',
        gray: 'bg-gray-50',
        light: 'bg-gray-100',
        emerald: 'bg-emerald-50',
        blue: 'bg-blue-50'
    };

    return (
        <div
            onClick={onClick}
            onMouseDown={() => interactive && setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onTouchStart={() => interactive && setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            className={`
                rounded-2xl border border-gray-200/70 transition-all duration-200
                ${bgClasses[backgroundColor] || 'bg-white'}
                ${padded ? 'p-6' : ''}
                ${elevation ? 'shadow-lg' : 'shadow-sm'}
                ${interactive && 'cursor-pointer hover:shadow-xl'}
                ${isPressed && interactive ? 'scale-[0.97]' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
};

// ============= iOS BUTTON COMPONENTS =============
const iOSButton = ({
    children,
    onClick,
    variant = 'primary', // primary, secondary, tertiary, danger
    size = 'medium', // small, medium, large
    disabled = false,
    loading = false,
    icon,
    fullWidth = false,
    className = ''
}) => {
    const [isPressed, setIsPressed] = React.useState(false);

    const sizeClasses = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg font-bold'
    };

    const variantClasses = {
        primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200/50 hover:from-emerald-600 hover:to-emerald-700',
        secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300',
        tertiary: 'bg-transparent text-emerald-600 hover:bg-emerald-50',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200/50 hover:from-red-600 hover:to-red-700'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            className={`
                flex items-center justify-center gap-2 rounded-2xl font-bold
                transition-all duration-200 active:scale-95
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${fullWidth ? 'w-full' : ''}
                ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isPressed ? 'scale-95' : ''}
                ${className}
            `}
        >
            {loading ? (
                <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    লোডিং...
                </>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

// ============= iOS FILLED BUTTON =============
const iOSFilledButton = ({
    children,
    onClick,
    color = 'emerald', // emerald, red, blue, gray
    size = 'large',
    fullWidth = true,
    disabled = false,
    loading = false,
    icon
}) => {
    const colorClasses = {
        emerald: 'bg-emerald-500 text-white shadow-lg shadow-emerald-200/50',
        red: 'bg-red-500 text-white shadow-lg shadow-red-200/50',
        blue: 'bg-blue-500 text-white shadow-lg shadow-blue-200/50',
        gray: 'bg-gray-900 text-white shadow-lg shadow-gray-900/30'
    };

    return (
        <iOSButton
            variant="primary"
            size={size}
            fullWidth={fullWidth}
            disabled={disabled}
            loading={loading}
            icon={icon}
            className={`${colorClasses[color]} rounded-xl`}
            onClick={onClick}
        >
            {children}
        </iOSButton>
    );
};

// ============= iOS SOFT BUTTON =============
const iOSSoftButton = ({
    children,
    onClick,
    color = 'gray', // gray, emerald, red, blue
    disabled = false,
    icon,
    fullWidth = false
}) => {
    const colorClasses = {
        gray: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        emerald: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
        red: 'bg-red-100 text-red-600 hover:bg-red-200',
        blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    };

    return (
        <iOSButton
            variant="secondary"
            size="medium"
            disabled={disabled}
            icon={icon}
            fullWidth={fullWidth}
            className={`${colorClasses[color]} rounded-xl`}
            onClick={onClick}
        >
            {children}
        </iOSButton>
    );
};

// ============= iOS SEGMENTED CONTROL =============
const iOSSegmentedControl = ({
    segments,
    value,
    onChange,
    fullWidth = true
}) => {
    return (
        <div className={`
            flex items-center gap-1 p-1 bg-gray-100 rounded-xl
            ${fullWidth ? 'w-full' : 'w-fit'}
        `}>
            {segments.map((segment) => (
                <button
                    key={segment.value}
                    onClick={() => onChange(segment.value)}
                    className={`
                        flex-1 py-3 px-4 rounded-lg font-bold text-sm
                        transition-all duration-200
                        ${value === segment.value
                            ? 'bg-white text-gray-900 shadow-lg'
                            : 'text-gray-600 hover:text-gray-900'
                        }
                    `}
                >
                    {segment.label}
                </button>
            ))}
        </div>
    );
};

// ============= iOS MODAL / SHEET =============
const iOSSheet = ({
    isOpen,
    onClose,
    title,
    children,
    actions,
    scrollable = true
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center animate-fade-in">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-w-2xl w-full md:max-h-[90vh] flex flex-col animate-scale-in-up"
            >
                {/* Handle bar */}
                <div className="flex justify-center py-3">
                    <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                </div>

                {/* Header */}
                {title && (
                    <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    </div>
                )}

                {/* Content */}
                <div className={`flex-1 ${scrollable ? 'overflow-y-auto' : ''} px-6 py-6`}>
                    {children}
                </div>

                {/* Actions */}
                {actions && (
                    <div className="flex flex-col gap-3 p-6 border-t border-gray-200 bg-gray-50">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

// ============= iOS TOAST/NOTIFICATION =============
const iOSToast = ({
    message,
    type = 'success', // success, error, warning, info
    duration = 3000,
    onClose
}) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeClasses = {
        success: 'bg-emerald-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-orange-500 text-white',
        info: 'bg-blue-500 text-white'
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ⓘ'
    };

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-down">
            <div className={`
                flex items-center gap-4 px-6 py-4 rounded-full shadow-2xl backdrop-blur-xl
                border border-white/30
                ${typeClasses[type]}
            `}>
                <span className="text-lg font-bold">{icons[type]}</span>
                <p className="font-semibold">{message}</p>
            </div>
        </div>
    );
};

// ============= iOS BADGE =============
const iOSBadge = ({
    text,
    variant = 'primary', // primary, secondary, success, danger, warning
    size = 'medium' // small, medium, large
}) => {
    const variantClasses = {
        primary: 'bg-emerald-100 text-emerald-700',
        secondary: 'bg-gray-200 text-gray-700',
        success: 'bg-emerald-100 text-emerald-700',
        danger: 'bg-red-100 text-red-700',
        warning: 'bg-orange-100 text-orange-700'
    };

    const sizeClasses = {
        small: 'px-3 py-1 text-xs',
        medium: 'px-4 py-2 text-sm',
        large: 'px-6 py-3 text-base'
    };

    return (
        <span className={`
            rounded-full font-bold inline-block
            ${variantClasses[variant]}
            ${sizeClasses[size]}
        `}>
            {text}
        </span>
    );
};

// ============= iOS SWITCH =============
const iOSSwitch = ({
    value,
    onChange,
    label,
    disabled = false
}) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200">
            {label && <span className="font-medium text-gray-700">{label}</span>}
            <button
                onClick={() => !disabled && onChange(!value)}
                className={`
                    relative w-16 h-10 rounded-full transition-colors duration-200
                    ${value ? 'bg-emerald-500' : 'bg-gray-300'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
            >
                <div
                    className={`
                        absolute top-1 left-1 w-8 h-8 bg-white rounded-full
                        transition-transform duration-200 shadow-lg
                        ${value ? 'translate-x-6' : 'translate-x-0'}
                    `}
                />
            </button>
        </div>
    );
};

// ============= iOS PICKER / SELECT =============
const iOSPicker = ({
    label,
    value,
    onChange,
    options,
    placeholder = 'নির্বাচন করুন',
    error,
    required = false
}) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`
                    w-full px-5 py-4 rounded-2xl border-2 transition-all duration-200
                    font-medium bg-gray-50 outline-none
                    ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-emerald-500 focus:bg-emerald-50'}
                `}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-xs font-bold text-red-500">⚠️ {error}</p>
            )}
        </div>
    );
};

// ============= iOS INPUT GROUP =============
const iOSInputGroup = ({
    children,
    title,
    description
}) => {
    return (
        <div className="space-y-4">
            {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

// ============= iOS GRADIENT CARD =============
const iOSGradientCard = ({
    children,
    gradientFrom = 'from-emerald-500',
    gradientTo = 'to-blue-500',
    onClick,
    interactive = true
}) => {
    const [isPressed, setIsPressed] = React.useState(false);

    return (
        <div
            onClick={onClick}
            onMouseDown={() => interactive && setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onTouchStart={() => interactive && setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            className={`
                bg-gradient-to-br ${gradientFrom} ${gradientTo}
                rounded-3xl p-8 text-white shadow-2xl
                border border-white/20 backdrop-blur-md
                transition-all duration-200
                ${interactive && 'cursor-pointer hover:shadow-xl'}
                ${isPressed && interactive ? 'scale-[0.98]' : ''}
            `}
        >
            {children}
        </div>
    );
};

// ============= iOS LIST ITEM =============
const iOSListItem = ({
    icon,
    title,
    subtitle,
    rightContent,
    onClick,
    divider = true,
    interactive = true
}) => {
    const [isPressed, setIsPressed] = React.useState(false);

    return (
        <div className={`${divider ? 'border-b border-gray-200' : ''}`}>
            <button
                onClick={onClick}
                onMouseDown={() => interactive && setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onTouchStart={() => interactive && setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
                className={`
                    w-full px-6 py-4 flex items-center gap-4 transition-all duration-200
                    ${interactive && 'hover:bg-gray-50 cursor-pointer'}
                    ${isPressed && interactive ? 'bg-gray-100 scale-95' : ''}
                `}
            >
                {icon && <div className="text-2xl flex-shrink-0">{icon}</div>}
                <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900">{title}</p>
                    {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
                </div>
                {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
            </button>
        </div>
    );
};

// ============= iOS BOTTOM SHEET =============
const iOSBottomSheet = ({
    isOpen,
    onClose,
    children,
    snapPoints = ['50%', '90%']
}) => {
    const [currentSnap, setCurrentSnap] = React.useState(0);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/40 animate-fade-in"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-screen flex flex-col animate-slide-up"
                style={{ height: snapPoints[currentSnap] }}
            >
                <div className="flex justify-center py-3 px-6 border-b border-gray-200">
                    <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// ============= iOS ACTIVITY INDICATOR =============
const iOSActivityIndicator = ({
    size = 'medium',
    color = 'emerald'
}) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-10 h-10',
        large: 'w-16 h-16'
    };

    const colorClasses = {
        emerald: 'border-emerald-500',
        gray: 'border-gray-400',
        white: 'border-white'
    };

    return (
        <div className={`
            rounded-full border-4 border-transparent animate-spin
            ${sizeClasses[size]}
            ${colorClasses[color]}
        `}
        style={{
            borderTopColor: color === 'emerald' ? '#10B981' : color === 'white' ? '#FFFFFF' : '#9CA3AF'
        }}
        />
    );
};

// ============= iOS EMPTY STATE =============
const iOSEmptyState = ({
    icon,
    title,
    description,
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            {icon && <div className="text-6xl mb-4 opacity-60">{icon}</div>}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            {description && <p className="text-gray-600 mb-6">{description}</p>}
            {action && <div>{action}</div>}
        </div>
    );
};
