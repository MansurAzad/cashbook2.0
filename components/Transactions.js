function TransactionItem({ t, onDelete, handleEdit, handleContextMenu, setContextMenu, formatCurrency }) {
    const longPressEvents = GestureHooks.useLongPress(() => setContextMenu({ isOpen: true, x: window.innerWidth/2, y: window.innerHeight/2, item: t }));

    return (
        <SwipeableItem 
            onSwipeLeft={() => onDelete(t.id)}
            onSwipeRight={() => handleEdit(t)}
            className="hover:bg-gray-50/50"
        >
            <div 
                className="px-8 py-5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
                onContextMenu={(e) => handleContextMenu(e, t)}
                {...longPressEvents}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-md ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        <div className={t.type === 'income' ? 'icon-arrow-down-left' : 'icon-arrow-up-right'}></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="font-black text-gray-900 text-base">{t.category}</span>
                            <span className="text-xs text-gray-500 font-semibold">{t.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1 font-medium">
                            {t.account_name && <span className="bg-gray-200 px-2.5 py-1 rounded-full text-[11px] uppercase font-bold text-gray-700">{t.account_name}</span>}
                            <span className="truncate max-w-[140px]">{t.note || 'কোন নোট নেই'}</span>
                        </div>
                    </div>
                </div>
                <div className={`font-black text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </div>
            </div>
        </SwipeableItem>
    );
}

function Transactions({ data, onAdd, onUpdate, onDelete, loading, currencySymbol = '৳', initialParams }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [filter, setFilter] = React.useState('all'); // all, income, expense
    const [searchTerm, setSearchTerm] = React.useState('');
    const [dateRange, setDateRange] = React.useState({ start: '', end: '' });
    const [contextMenu, setContextMenu] = React.useState({ isOpen: false, x: 0, y: 0, item: null });
    const [showSearch, setShowSearch] = React.useState(false);
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
        
        // Find account name for display purposes if needed
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
        e.preventDefault(); // Prevent native context menu
        setContextMenu({
            isOpen: true,
            x: e.clientX,
            y: e.clientY,
            item: item
        });
    };

    const startVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('আপনার ব্রাউজারে ভয়েস ইনপুট সাপোর্ট নেই।');
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

    // Pull down logic for search reveal
    const { onTouchStart, onTouchMove, onTouchEnd } = GestureHooks.useSwipe({
        onSwipeDown: () => setShowSearch(true),
        threshold: 60
    });

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
        <div 
            className="space-y-6" 
            data-name="transactions"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
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

            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 w-fit">
                        <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>সব</button>
                        <button onClick={() => setFilter('income')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'income' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}>আয়</button>
                        <button onClick={() => setFilter('expense')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'expense' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}>ব্যয়</button>
                    </div>
                    <button onClick={() => setIsAdding(true)} className="btn btn-primary" disabled={loading}>
                        <div className="icon-plus"></div> নতুন লেনদেন
                    </button>
                </div>

                <div className={`flex flex-col md:flex-row gap-4 transition-all duration-300 overflow-hidden ${showSearch ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 md:max-h-20 md:opacity-100'}`}>
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-2.5 text-gray-400 icon-search"></div>
                        <input type="text" placeholder="ক্যাটাগরি বা নোট খুঁজুন..." className="input-field pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        <input type="date" className="input-field w-auto" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
                        <span className="self-center text-gray-400">-</span>
                        <input type="date" className="input-field w-auto" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
                    </div>
                </div>
            </div>

            {isAdding && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">{editingId ? 'লেনদেন আপডেট করুন' : 'নতুন লেনদেন যোগ করুন'}</h3>
                            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700"><div className="icon-x"></div></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={() => setFormData({...formData, type: 'income', category: ''})} className={`p-3 rounded-lg border text-center font-medium transition-all ${formData.type === 'income' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600'}`}>আয়</button>
                                <button type="button" onClick={() => setFormData({...formData, type: 'expense', category: ''})} className={`p-3 rounded-lg border text-center font-medium transition-all ${formData.type === 'expense' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'}`}>ব্যয়</button>
                            </div>
                            
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">পরিমাণ ({currencySymbol})</label>
                                <input type="number" required className="input-field" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ক্যাটাগরি</label>
                                <select className="input-field" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option value="">নির্বাচন করুন</option>
                                    {(formData.type === 'income' ? data.categories.income : data.categories.expense).map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">অ্যাকাউন্ট</label>
                                <select className="input-field" value={formData.account_id} onChange={e => setFormData({...formData, account_id: e.target.value})}>
                                    <option value="">কোনোটি না (শুধুমাত্র রেকর্ড)</option>
                                    {data.accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name} ({acc.type})</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-gray-500 mt-1">অ্যাকাউন্ট সিলেক্ট করলে ব্যালেন্স অটো আপডেট হবে</p>
                            </div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1">তারিখ</label><input type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                                    নোট (ঐচ্ছিক)
                                    <button type="button" onClick={startVoiceInput} className={`text-xs flex items-center gap-1 ${isListening ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                                        <div className="icon-mic"></div> {isListening ? 'শুনছি...' : 'ভয়েস টাইপিং'}
                                    </button>
                                </label>
                                <textarea className="input-field" rows="2" placeholder="বিবরণ লিখুন..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}></textarea>
                            </div>

                            <button type="submit" className="w-full btn btn-primary justify-center py-3" disabled={loading}>{loading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <div className="w-full text-left">
                        <div className="bg-gray-50 border-b border-gray-100 flex font-semibold text-gray-500 uppercase text-xs">
                            <div className="px-6 py-4 flex-1">বিবরণ</div>
                            <div className="px-6 py-4 text-right w-32">পরিমাণ</div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {filteredTransactions.length === 0 ? (
                                <div className="px-6 py-12 text-center text-gray-500">কোন তথ্য পাওয়া যায়নি</div>
                            ) : (
                                filteredTransactions.map(t => (
                                    <TransactionItem 
                                        key={t.id}
                                        t={t}
                                        onDelete={onDelete}
                                        handleEdit={handleEdit}
                                        handleContextMenu={handleContextMenu}
                                        setContextMenu={setContextMenu}
                                        formatCurrency={formatCurrency}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-center text-xs text-gray-400 mt-4">
                টিপস: বামে সোয়াইপ করে ডিলিট, ডানে সোয়াইপ করে এডিট, এবং চেপে ধরে আরও অপশন দেখুন
            </div>
        </div>
    );
}