function Transactions({ data, onAdd, onUpdate, onDelete, loading, currencySymbol = '৳' }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [filter, setFilter] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(null);

    const [formData, setFormData] = React.useState({
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
        account_id: data.accounts?.[0]?.id || ''
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await onUpdate(editingId, formData);
        } else {
            await onAdd(formData);
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
            account_id: data.accounts?.[0]?.id || ''
        });
    };

    const handleEdit = (transaction) => {
        setFormData(transaction);
        setEditingId(transaction.id);
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        await onDelete(id);
        setShowDeleteConfirm(null);
    };

    // Filter transactions
    let filteredTransactions = data.transactions || [];
    
    if (filter !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === filter);
    }

    if (searchTerm) {
        filteredTransactions = filteredTransactions.filter(t => 
            t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.note?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Group by date
    const groupedTransactions = filteredTransactions.reduce((groups, t) => {
        const date = t.date;
        if (!groups[date]) groups[date] = [];
        groups[date].push(t);
        return groups;
    }, {});

    return (
        <div className="px-4 sm:px-6 pb-10 space-y-4 sm:space-y-6 animate-fade-in" data-name="transactions">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-gray-900">লেনদেন</h1>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-2xl hover:bg-emerald-600 shadow-lg"
                >
                    +
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    সব
                </button>
                <button 
                    onClick={() => setFilter('income')}
                    className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${filter === 'income' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    আয়
                </button>
                <button 
                    onClick={() => setFilter('expense')}
                    className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${filter === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    খরচ
                </button>
            </div>

            {/* Search Field */}
            <iOSTextField
                placeholder="খোঁজ করুন..."
                icon="🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Add/Edit Modal */}
            {isAdding && (
                <iOSSheet isOpen={true} title={editingId ? "লেনদেন সম্পাদন করুন" : "নতুন লেনদেন"} onClose={resetForm}>
                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        {/* Transaction Type */}
                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, type: 'income'})}
                                className={`flex-1 py-3 rounded-2xl font-bold transition-all ${formData.type === 'income' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                📈 আয়
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, type: 'expense'})}
                                className={`flex-1 py-3 rounded-2xl font-bold transition-all ${formData.type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                📉 খরচ
                            </button>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">পরিমান (টাকা)</label>
                            <input 
                                type="number"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:ring-0 font-medium text-lg"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={e => setFormData({...formData, amount: e.target.value})}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">ক্যাটাগরি</label>
                            <select 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:ring-0 font-medium"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                required
                            >
                                <option value="">নির্বাচন করুন</option>
                                {(formData.type === 'income' ? data.categories?.income : data.categories?.expense)?.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">তারিখ</label>
                            <input 
                                type="date"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:ring-0 font-medium"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                                required
                            />
                        </div>

                        {/* Note */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">নোট</label>
                            <textarea 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:ring-0 font-medium"
                                placeholder="বিবরণ লিখুন..."
                                rows="3"
                                value={formData.note}
                                onChange={e => setFormData({...formData, note: e.target.value})}
                            ></textarea>
                        </div>

                        {/* Account Selection */}
                        {data.accounts && data.accounts.length > 0 && (
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">অ্যাকাউন্ট</label>
                                <select 
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:ring-0 font-medium"
                                    value={formData.account_id}
                                    onChange={e => setFormData({...formData, account_id: e.target.value})}
                                >
                                    {data.accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <iOSFilledButton type="submit" color={formData.type === 'income' ? 'emerald' : 'red'}>
                                {editingId ? 'আপডেট করুন' : 'যোগ করুন'}
                            </iOSFilledButton>
                            <iOSOutlineButton type="button" onClick={resetForm}>
                                বাতিল
                            </iOSOutlineButton>
                        </div>
                    </form>
                </iOSSheet>
            )}

            {/* Transactions List */}
            {filteredTransactions.length === 0 ? (
                <iOSEmptyState 
                    icon="📋" 
                    title="কোন লেনদেন নেই" 
                    description={searchTerm ? "সার্চ ফলাফল পাওয়া যাচ্ছে না" : "আপনার প্রথম লেনদেন যোগ করুন"}
                    action={
                        <iOSFilledButton 
                            color="emerald"
                            onClick={() => setIsAdding(true)}
                        >
                            নতুন লেনদেন
                        </iOSFilledButton>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {Object.entries(groupedTransactions).sort(([dateA], [dateB]) => dateB.localeCompare(dateA)).map(([date, transactions]) => (
                        <div key={date}>
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 px-2">{new Date(date).toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                            <div className="space-y-2">
                                {transactions.map(t => (
                                    <iOSCard key={t.id} padded={false}>
                                        <div className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => handleEdit(t)}>
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 text-lg sm:text-xl ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                    {t.type === 'income' ? '↓' : '↑'}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{t.category}</p>
                                                    <p className="text-xs text-gray-500 truncate">{t.note || 'কোন নোট নেই'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-2">
                                                <span className={`font-bold text-sm sm:text-base ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                                </span>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(t.id); }}
                                                    className="p-1 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg text-sm"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </iOSCard>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <iOSSheet 
                    isOpen={true} 
                    title="লেনদেন মুছুন?" 
                    onClose={() => setShowDeleteConfirm(null)}
                >
                    <div className="p-4 space-y-4">
                        <p className="text-gray-600 text-center">এই লেনদেনটি মুছে দিতে চান?</p>
                        <div className="flex gap-3">
                            <iOSFilledButton 
                                color="red"
                                onClick={() => handleDelete(showDeleteConfirm)}
                            >
                                মুছুন
                            </iOSFilledButton>
                            <iOSOutlineButton 
                                onClick={() => setShowDeleteConfirm(null)}
                            >
                                বাতিল
                            </iOSOutlineButton>
                        </div>
                    </div>
                </iOSSheet>
            )}

            <div className="h-4"></div>
        </div>
    );
}
