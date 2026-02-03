function TransactionItem({ t, onDelete, handleEdit, handleContextMenu, setContextMenu, formatCurrency }) {
    const longPressEvents = GestureHooks.useLongPress(() => setContextMenu({ isOpen: true, x: window.innerWidth/2, y: window.innerHeight/2, item: t }));

    return (
        <SwipeableItem 
            onSwipeLeft={() => onDelete(t.id)}
            onSwipeRight={() => handleEdit(t)}
            className="hover:bg-gray-50/50 transition-colors"
        >
            <div 
                className="px-8 py-5 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
                onContextMenu={(e) => handleContextMenu(e, t)}
                {...longPressEvents}
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md flex-shrink-0 ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        <div className={t.type === 'income' ? 'icon-arrow-down-left' : 'icon-arrow-up-right'}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-black text-gray-900 text-lg">{t.category}</span>
                            <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2.5 py-1 rounded-full">{t.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                            {t.account_name && <span className="bg-blue-100 px-3 py-1 rounded-full text-xs font-bold text-blue-700">{t.account_name}</span>}
                            <span className="text-gray-500 truncate">{t.note ? `"${t.note}"` : '—'}</span>
                        </div>
                    </div>
                </div>
                <div className={`font-black text-xl whitespace-nowrap ml-4 ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '−'} {formatCurrency(t.amount)}
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
        
        // ভ্যালিডেশন
        if(!formData.amount || !formData.category || parseFloat(formData.amount) <= 0) {
            alert('দয়া করে সব তথ্য সঠিকভাবে পূরণ করুন');
            return;
        }
        
        const account = data.accounts.find(a => a.id === formData.account_id);
        const payload = { 
            ...formData, 
            amount: parseFloat(formData.amount),
            account_name: account ? account.name : ''
        };
        
        // ইডি যোগ করবেন না যদি নতুন লেনদেন হয়
        if (!editingId) {
            delete payload.id;
        }

        try {
            if (editingId) {
                payload.id = editingId;
                await onUpdate(editingId, payload);
            } else {
                await onAdd(payload);
            }
            resetForm();
        } catch (err) {
            console.error('ফর্ম সাবমিট ত্রুটি:', err);
            alert('ফর্ম সাবমিট করতে সমস্যা হয়েছে');
        }
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

    // Calculate summary stats
    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    return (
        <div className="space-y-6 animate-fade-in pb-10" data-name="transactions">
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

            {/* সারাংশ কার্ড - তিনটি প্রধান সংখ্যা */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all active:scale-95">
                    <p className="text-emerald-600 text-xs font-black mb-2 uppercase tracking-wider">মোট আয়</p>
                    <h3 className="text-4xl font-black text-emerald-700">{formatCurrency(totalIncome)}</h3>
                    <p className="text-xs text-gray-500 mt-2 font-semibold">{filteredTransactions.filter(t => t.type === 'income').length} লেনদেন</p>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all active:scale-95">
                    <p className="text-red-600 text-xs font-black mb-2 uppercase tracking-wider">মোট ব্যয়</p>
                    <h3 className="text-4xl font-black text-red-700">{formatCurrency(totalExpense)}</h3>
                    <p className="text-xs text-gray-500 mt-2 font-semibold">{filteredTransactions.filter(t => t.type === 'expense').length} লেনদেন</p>
                </div>
                <div className={`bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all active:scale-95`}>
                    <p className={`text-xs font-black mb-2 uppercase tracking-wider ${totalIncome - totalExpense >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>নেট ব্যালেন্স</p>
                    <h3 className={`text-4xl font-black ${totalIncome - totalExpense >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{formatCurrency(totalIncome - totalExpense)}</h3>
                    <p className="text-xs text-gray-500 mt-2 font-semibold">{filteredTransactions.length} মোট লেনদেন</p>
                </div>
            </div>

            {/* ফিল্টার বাটন এবং নতুন বাটন */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="bg-white rounded-2xl p-1.5 shadow-md border border-gray-200 flex w-fit">
                    <button 
                        onClick={() => setFilter('all')} 
                        className={`px-6 py-2.5 rounded-xl text-base font-black transition-all ${filter === 'all' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        সব
                    </button>
                    <button 
                        onClick={() => setFilter('income')} 
                        className={`px-6 py-2.5 rounded-xl text-base font-black transition-all ${filter === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        আয়
                    </button>
                    <button 
                        onClick={() => setFilter('expense')} 
                        className={`px-6 py-2.5 rounded-xl text-base font-black transition-all ${filter === 'expense' ? 'bg-red-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        ব্যয়
                    </button>
                </div>
                <button 
                    onClick={() => setIsAdding(true)} 
                    className="btn btn-primary rounded-2xl py-3 px-8 font-black text-lg flex items-center justify-center gap-2 active:scale-95"
                    disabled={loading}
                >
                    <div className="icon-plus text-2xl"></div> নতুন লেনদেন
                </button>
            </div>

            {/* সার্চ এবং ডেট রেঞ্জ ফিল্টার */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 space-y-4">
                <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-400 icon-search text-xl"></div>
                    <input 
                        type="text" 
                        placeholder="ক্যাটাগরি বা নোট খুঁজুন..." 
                        className="pl-12 text-base font-medium w-full py-3 rounded-2xl border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-all bg-white" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">শুরু করুন</label>
                        <input 
                            type="date" 
                            className="text-base font-medium w-full py-3 rounded-2xl border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-all bg-white" 
                            value={dateRange.start} 
                            onChange={(e) => setDateRange({...dateRange, start: e.target.value})} 
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">শেষ করুন</label>
                        <input 
                            type="date" 
                            className="text-base font-medium w-full py-3 rounded-2xl border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-all bg-white" 
                            value={dateRange.end} 
                            onChange={(e) => setDateRange({...dateRange, end: e.target.value})} 
                        />
                    </div>
                </div>
            </div>

            {/* নতুন লেনদেন মডাল - iOS স্টাইল বটম শীট */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 animate-scale-in border border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black text-gray-900">{editingId ? 'লেনদেন সম্পাদনা' : 'নতুন লেনদেন যুক্ত করুন'}</h3>
                            <button 
                                onClick={resetForm} 
                                className="p-3 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
                            >
                                <div className="icon-x text-2xl text-gray-600"></div>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-7">
                            {/* আয়/ব্যয় নির্বাচন - প্রিমিয়াম কার্ড বাটন */}
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-4 uppercase tracking-wider">লেনদেনের ধরন</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({...formData, type: 'income', category: ''})} 
                                        className={`p-8 rounded-2xl border-2 text-center font-black text-lg transition-all flex flex-col items-center justify-center gap-3 ${formData.type === 'income' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                                    >
                                        <div className="icon-arrow-down-left text-4xl"></div>
                                        <div>আয়</div>
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({...formData, type: 'expense', category: ''})} 
                                        className={`p-8 rounded-2xl border-2 text-center font-black text-lg transition-all flex flex-col items-center justify-center gap-3 ${formData.type === 'expense' ? 'border-red-500 bg-red-50 text-red-700 shadow-lg' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                                    >
                                        <div className="icon-arrow-up-right text-4xl"></div>
                                        <div>ব্যয়</div>
                                    </button>
                                </div>
                            </div>
                            
                            {/* পরিমাণ - বড় এবং প্রধান ফোকাস */}
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3 uppercase tracking-wider">পরিমাণ ({currencySymbol})</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-4 text-2xl font-black text-gray-900">{currencySymbol}</span>
                                    <input 
                                        type="number" 
                                        required 
                                        autoFocus
                                        step="0.01"
                                        min="0"
                                        className="text-4xl font-black py-5 pl-12 rounded-2xl w-full border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-all bg-white" 
                                        placeholder="0" 
                                        value={formData.amount} 
                                        onChange={e => setFormData({...formData, amount: e.target.value})} 
                                    />
                                </div>
                            </div>

                            {/* ক্যাটাগরি */}
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3 uppercase tracking-wider">ক্যাটাগরি</label>
                                <select 
                                    className="text-base font-bold py-4 px-5 rounded-2xl w-full border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-all bg-white" 
                                    required 
                                    value={formData.category} 
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="">— নির্বাচন করুন —</option>
                                    {(activeCategories || []).map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* অ্যাকাউন্ট */}
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3 uppercase tracking-wider">অ্যাকাউন্ট</label>
                                <select 
                                    className="text-base font-bold py-4 px-5 rounded-2xl w-full border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-all bg-white" 
                                    value={formData.account_id} 
                                    onChange={e => setFormData({...formData, account_id: e.target.value})}
                                >
                                    <option value="">— কোনোটি না (শুধু রেকর্ড) —</option>
                                    {(data.accounts || []).map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name} ({acc.type})</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-600 mt-3 font-semibold bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    💡 অ্যাকাউন্ট সিলেক্ট করলে এর ব্যালেন্স স্বয়ংক্রিয়ভাবে আপডেট হবে
                                </p>
                            </div>

                            {/* তারিখ */}
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3 uppercase tracking-wider">তারিখ</label>
                                <input 
                                    type="date" 
                                    className="text-base font-bold py-4 px-5 rounded-2xl w-full border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-all bg-white" 
                                    value={formData.date} 
                                    onChange={e => setFormData({...formData, date: e.target.value})} 
                                />
                            </div>
                            
                            {/* নোট এবং ভয়েস ইনপুট */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-base font-black text-gray-900 uppercase tracking-wider">নোট</label>
                                    <button 
                                        type="button" 
                                        onClick={startVoiceInput} 
                                        className={`text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-xl transition-all active:scale-90 ${isListening ? 'text-white bg-red-500 animate-pulse' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300'}`}
                                    >
                                        <div className="icon-mic text-xl"></div> {isListening ? 'শুনছি...' : 'ভয়েস টাইপ'}
                                    </button>
                                </div>
                                <textarea 
                                    className="text-base font-medium py-4 px-5 rounded-2xl w-full border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-all resize-none" 
                                    rows="4" 
                                    placeholder="আরও বিবরণ যুক্ত করুন..." 
                                    value={formData.note} 
                                    onChange={e => setFormData({...formData, note: e.target.value})}
                                ></textarea>
                            </div>

                            {/* সাবমিট এবং বাতিল বাটন */}
                            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200">
                                <button 
                                    type="submit" 
                                    className="flex-1 btn btn-primary justify-center py-4 px-6 rounded-2xl font-black text-lg active:scale-95" 
                                    disabled={loading}
                                >
                                    {loading ? 'সংরক্ষণ হচ্ছে...' : editingId ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={resetForm} 
                                    className="flex-1 btn btn-ghost bg-gray-100 rounded-2xl py-4 px-6 font-black text-lg active:scale-95"
                                >
                                    বাতিল
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* লেনদেন তালিকা - আইওএস স্টাইল কার্ড */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 divide-y divide-gray-100">
                {filteredTransactions.length === 0 ? (
                    <div className="px-8 py-16 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-3xl flex items-center justify-center">
                            <div className="icon-inbox text-4xl text-gray-400"></div>
                        </div>
                        <p className="text-gray-700 font-bold text-lg">কোন লেনদেন পাওয়া যায়নি</p>
                        <p className="text-gray-500 text-base mt-2">নতুন লেনদেন যুক্ত করতে উপরের বাটন দিয়ে শুরু করুন</p>
                    </div>
                ) : (
                    <div>
                        {filteredTransactions.map(t => (
                            <TransactionItem 
                                key={t.id}
                                t={t}
                                onDelete={onDelete}
                                handleEdit={handleEdit}
                                handleContextMenu={handleContextMenu}
                                setContextMenu={setContextMenu}
                                formatCurrency={formatCurrency}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            <div className="text-center text-xs text-gray-500 font-bold pb-4 space-y-1">
                <div>💡 টিপস: বামে সোয়াইপ করে মুছুন, ডানে সোয়াইপ করে সম্পাদনা করুন</div>
                <div>👆 আইটেমে চেপে ধরে আরও অপশন দেখুন</div>
            </div>
        </div>
    );
}
