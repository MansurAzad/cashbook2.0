/**
 * iOS-Optimized Transactions Component
 * Full iPhone UI/UX with modern design patterns
 */

function TransactionItemiOS({ t, onDelete, handleEdit, handleContextMenu, setContextMenu, formatCurrency }) {
    const [swiped, setSwiped] = React.useState(false);
    const longPressEvents = GestureHooks.useLongPress(() => 
        setContextMenu({ isOpen: true, x: window.innerWidth/2, y: window.innerHeight/2, item: t })
    );

    return (
        <SwipeableItem 
            onSwipeLeft={() => {
                setSwiped(true);
                setTimeout(() => onDelete(t.id), 200);
            }}
            onSwipeRight={() => handleEdit(t)}
            className="bg-white hover:bg-gray-50/50 transition-all duration-200"
        >
            <div 
                className="px-6 py-5 flex items-center justify-between cursor-pointer active:bg-gray-100 transition-colors"
                onContextMenu={(e) => handleContextMenu(e, t)}
                {...longPressEvents}
            >
                <div className="flex items-center gap-4 flex-1">
                    {/* Category Icon Circle */}
                    <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                        text-lg font-bold
                        ${t.type === 'income' 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-red-100 text-red-600'
                        }
                    `}>
                        {t.type === 'income' ? (
                            <div className='icon-arrow-down-left'></div>
                        ) : (
                            <div className='icon-arrow-up-right'></div>
                        )}
                    </div>

                    {/* Transaction Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-gray-900">{t.category}</span>
                            <span className="text-xs text-gray-400 flex-shrink-0">{t.date}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {t.account_name && (
                                <span className="bg-gray-100 px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-600 flex-shrink-0">
                                    {t.account_name}
                                </span>
                            )}
                            {t.note && (
                                <span className="text-xs text-gray-500 truncate max-w-[180px]">
                                    {t.note}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Amount */}
                <div className={`
                    text-right font-bold flex-shrink-0 ml-3
                    text-lg
                    ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}
                `}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
            </div>
        </SwipeableItem>
    );
}

function TransactionsiOS({ data, onAdd, onUpdate, onDelete, loading, currencySymbol = '৳', initialParams }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [filter, setFilter] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [dateRange, setDateRange] = React.useState({ start: '', end: '' });
    const [contextMenu, setContextMenu] = React.useState({ isOpen: false, x: 0, y: 0, item: null });
    const [showFilters, setShowFilters] = React.useState(false);
    const [isListening, setIsListening] = React.useState(false);

    const [formData, setFormData] = React.useState({
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
        account_id: ''
    });

    React.useEffect(() => {
        if (initialParams && initialParams.action === 'add') {
            setIsAdding(true);
            setFormData(prev => ({ 
                ...prev, 
                type: initialParams.type || 'expense',
                category: initialParams.category || '',
                amount: initialParams.amount || '',
                note: initialParams.note || '',
                account_id: ''
            }));
        }
    }, [initialParams]);

    const activeCategories = filter === 'income' || formData.type === 'income' 
        ? data.categories.income 
        : data.categories.expense;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.amount || !formData.category) return;
        
        const account = data.accounts.find(a => a.id === formData.account_id);
        const payload = { ...formData, account_name: account ? account.name : '' };

        if (editingId) {
            await onUpdate(editingId, payload);
        } else {
            await onAdd(payload);
        }
        
        resetForm();
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({
            type: 'expense',
            amount: '',
            category: '',
            date: new Date().toISOString().split('T')[0],
            note: '',
            account_id: ''
        });
    };

    const handleEdit = (t) => {
        setFormData({
            type: t.type,
            amount: t.amount,
            category: t.category,
            date: t.date,
            note: t.note || '',
            account_id: t.account_id || ''
        });
        setEditingId(t.id);
        setIsAdding(true);
    };

    const handleDuplicate = (t) => {
        setFormData({
            type: t.type,
            amount: t.amount,
            category: t.category,
            date: new Date().toISOString().split('T')[0],
            note: t.note || '',
            account_id: t.account_id || ''
        });
        setIsAdding(true);
    };

    const handleContextMenu = (e, item) => {
        e.preventDefault();
        setContextMenu({
            isOpen: true,
            x: e.clientX,
            y: e.clientY,
            item: item
        });
    };

    const startVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('আপনার ব্রাউজারে ভয়েস ইনপুট সাপোর্ট নেই।');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'bn-BD';
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const numbers = transcript.match(/\d+/g);
            if (numbers) {
                setFormData(prev => ({ ...prev, amount: numbers[0], note: transcript }));
            } else {
                setFormData(prev => ({ ...prev, note: transcript }));
            }
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
    };

    const filteredTransactions = data.transactions.filter(t => {
        const matchesType = filter === 'all' || t.type === filter;
        const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()));
        
        let matchesDate = true;
        if (dateRange.start) matchesDate = matchesDate && t.date >= dateRange.start;
        if (dateRange.end) matchesDate = matchesDate && t.date <= dateRange.end;

        return matchesType && matchesSearch && matchesDate;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' })
            .format(amount)
            .replace('৳', currencySymbol); 
    };

    return (
        <div className="space-y-6" data-name="transactions">
            {/* Header Section */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md -mx-6 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">লেনদেন</h1>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200/50 active:scale-95 transition-transform"
                    >
                        <div className="icon-plus text-xl"></div>
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto -mx-6 px-6 pb-0">
                    <button
                        onClick={() => setFilter('all')}
                        className={`
                            px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all text-sm
                            ${filter === 'all'
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                        `}
                    >
                        সব
                    </button>
                    <button
                        onClick={() => setFilter('income')}
                        className={`
                            px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all text-sm
                            ${filter === 'income'
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200/50'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                        `}
                    >
                        <span className="mr-2">↓</span> আয়
                    </button>
                    <button
                        onClick={() => setFilter('expense')}
                        className={`
                            px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all text-sm
                            ${filter === 'expense'
                                ? 'bg-red-500 text-white shadow-lg shadow-red-200/50'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                        `}
                    >
                        <span className="mr-2">↑</span> ব্যয়
                    </button>
                </div>
            </div>

            {/* Search & Filter Button */}
            <div className="flex gap-3 px-6">
                <div className="flex-1 relative">
                    <div className="icon-search absolute left-4 top-4 text-gray-400 text-lg"></div>
                    <input
                        type="text"
                        placeholder="খুঁজুন..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`
                            w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-gray-50
                            transition-all duration-200
                            border-gray-200 focus:border-emerald-500 focus:bg-emerald-50 focus:outline-none
                            font-medium
                        `}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`
                        px-4 py-3.5 rounded-xl border-2 transition-all duration-200
                        ${showFilters
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                        }
                    `}
                >
                    <div className="icon-sliders text-lg"></div>
                </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="px-6 space-y-4 pb-4 bg-gray-50/50 -mx-6 px-6 py-4 rounded-2xl">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">শুরু</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:bg-white outline-none font-medium"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">শেষ</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:bg-white outline-none font-medium"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setDateRange({ start: '', end: '' });
                            setSearchTerm('');
                        }}
                        className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                    >
                        রিসেট করুন
                    </button>
                </div>
            )}

            {/* Transaction List */}
            <div className="px-6 space-y-3">
                {filteredTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-2xl">
                        <div className="text-5xl mb-3 opacity-30">📋</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">কোন লেনদেন নেই</h3>
                        <p className="text-gray-600 text-sm">আপনার প্রথম লেনদেন যোগ করুন শুরু করতে</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredTransactions.map((t, index) => (
                            <iOSCard key={t.id} padded={false}>
                                <TransactionItemiOS
                                    t={t}
                                    onDelete={onDelete}
                                    handleEdit={handleEdit}
                                    handleContextMenu={handleContextMenu}
                                    setContextMenu={setContextMenu}
                                    formatCurrency={formatCurrency}
                                />
                            </iOSCard>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal - iOS Sheet Style */}
            {isAdding && (
                <iOSSheet
                    isOpen={isAdding}
                    onClose={resetForm}
                    title={editingId ? 'লেনদেন আপডেট করুন' : 'নতুন লেনদেন'}
                    actions={[
                        <iOSFilledButton
                            key="submit"
                            color="emerald"
                            onClick={handleSubmit}
                            loading={loading}
                            fullWidth={true}
                        >
                            {editingId ? 'আপডেট করুন' : 'যোগ করুন'}
                        </iOSFilledButton>,
                        <iOSSoftButton
                            key="cancel"
                            color="gray"
                            onClick={resetForm}
                            fullWidth={true}
                        >
                            বাতিল করুন
                        </iOSSoftButton>
                    ]}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Type Selection */}
                        <iOSSegmentedControl
                            segments={[
                                { label: '↓ আয়', value: 'income' },
                                { label: '↑ ব্যয়', value: 'expense' }
                            ]}
                            value={formData.type}
                            onChange={(val) => setFormData({...formData, type: val, category: ''})}
                            fullWidth={true}
                        />

                        {/* Amount Input */}
                        <iOSTextField
                            label="পরিমাণ"
                            type="number"
                            inputMode="decimal"
                            value={formData.amount}
                            onChange={(val) => setFormData({...formData, amount: val})}
                            placeholder="0.00"
                            icon={<span>৳</span>}
                            required={true}
                        />

                        {/* Category Select */}
                        <iOSPicker
                            label="ক্যাটাগরি"
                            value={formData.category}
                            onChange={(val) => setFormData({...formData, category: val})}
                            options={activeCategories.map(cat => ({ label: cat.name, value: cat.name }))}
                            placeholder="নির্বাচন করুন"
                            required={true}
                        />

                        {/* Account Select */}
                        <iOSPicker
                            label="অ্যাকাউন্ট"
                            value={formData.account_id}
                            onChange={(val) => setFormData({...formData, account_id: val})}
                            options={data.accounts.map(acc => ({ label: `${acc.name} (${acc.type})`, value: acc.id }))}
                            placeholder="কোনোটি না (শুধুমাত্র রেকর্ড)"
                        />

                        {/* Date Input */}
                        <iOSTextField
                            label="তারিখ"
                            type="date"
                            value={formData.date}
                            onChange={(val) => setFormData({...formData, date: val})}
                            required={true}
                        />

                        {/* Note Input with Voice */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">নোট (ঐচ্ছিক)</label>
                                <button
                                    type="button"
                                    onClick={startVoiceInput}
                                    className={`
                                        text-xs font-bold px-3 py-1.5 rounded-full transition-all
                                        flex items-center gap-1.5
                                        ${isListening
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                        }
                                    `}
                                >
                                    <div className="icon-mic"></div>
                                    {isListening ? 'শুনছি...' : 'ভয়েস'}
                                </button>
                            </div>
                            <textarea
                                value={formData.note}
                                onChange={(e) => setFormData({...formData, note: e.target.value})}
                                placeholder="বিবরণ লিখুন..."
                                rows="3"
                                className={`
                                    w-full px-5 py-4 rounded-2xl border-2 bg-gray-50
                                    focus:border-emerald-500 focus:bg-emerald-50 focus:outline-none
                                    border-gray-200 font-medium resize-none
                                `}
                            />
                        </div>
                    </form>
                </iOSSheet>
            )}

            {/* Context Menu */}
            <ContextMenu 
                isOpen={contextMenu.isOpen}
                x={contextMenu.x}
                y={contextMenu.y}
                onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
                actions={[
                    { label: 'এডিট করুন', icon: 'icon-pencil', onClick: () => handleEdit(contextMenu.item) },
                    { label: 'ডুপ্লিকেট', icon: 'icon-copy', onClick: () => handleDuplicate(contextMenu.item) },
                    { label: 'মুছে ফেলুন', icon: 'icon-trash-2', className: 'text-red-600', onClick: () => onDelete(contextMenu.item.id) }
                ]}
            />

            {/* Tips */}
            <div className="px-6 py-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-sm text-blue-700 font-medium">
                <span className="font-bold">💡 টিপস:</span> বামে সোয়াইপ করুন ডিলিট করতে, ডানে করুন এডিট করতে
            </div>
        </div>
    );
}
