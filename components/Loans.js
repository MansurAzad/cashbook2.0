function Loans({ data, onAdd, onUpdate, onDelete, loading, currencySymbol = '৳' }) {
    const [filterActive, setFilterActive] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [newLoan, setNewLoan] = React.useState({
        name: '',
        amount: '',
        type: 'given',
        dueDate: '',
        status: 'unpaid',
        notes: ''
    });

    const filteredLoans = data.loans.filter(loan => {
        const matchesSearch = loan.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterActive === 'all' || 
            (filterActive === 'given' && loan.type === 'given') ||
            (filterActive === 'taken' && loan.type === 'taken');
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' })
            .format(amount)
            .replace('৳', currencySymbol);
    };

    const givenTotal = data.loans
        .filter(l => l.type === 'given')
        .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);
    
    const takenTotal = data.loans
        .filter(l => l.type === 'taken')
        .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);
    
    const netAmount = givenTotal - takenTotal;

    const handleSave = async (id, loanData) => {
        try {
            if (!loanData.name || loanData.name.trim() === '') {
                alert('দয়া করে ঋণকারীর নাম দিন');
                return;
            }
            if (!loanData.amount || parseFloat(loanData.amount) <= 0) {
                alert('দয়া করে সঠিক পরিমাণ দিন');
                return;
            }
            
            const payload = {
                ...loanData,
                amount: parseFloat(loanData.amount) || 0
            };
            
            if (editingId) {
                await onUpdate(editingId, payload);
            } else {
                await onAdd(payload);
            }
            setIsAdding(false);
            setEditingId(null);
            setNewLoan({ name: '', amount: '', type: 'given', dueDate: '', status: 'unpaid', notes: '' });
        } catch (err) {
            console.error('ঋণ সংরক্ষণ ত্রুটি:', err);
            alert('ঋণ সংরক্ষণে ব্যর্থ হয়েছে');
        }
    };

    const getDaysRemaining = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diff = deadlineDate - today;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10" data-name="loans">
            {/* ঋণের সারাংশ - গোলাপি গ্রেডিয়েন্ট */}
            <div className="bg-gradient-to-br from-pink-900 via-rose-800 to-red-900 rounded-3xl p-8 text-white shadow-2xl border border-pink-700">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black opacity-90 uppercase tracking-wider">ঋণের হিসাব</h3>
                    <div className="icon-credit-card text-pink-300 text-3xl"></div>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div>
                        <p className="text-xs text-pink-200 font-bold uppercase tracking-wider mb-2">প্রদত্ত ঋণ</p>
                        <p className="text-4xl font-black text-red-300">{formatCurrency(givenTotal)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-pink-200 font-bold uppercase tracking-wider mb-2">গৃহীত ঋণ</p>
                        <p className="text-4xl font-black text-pink-200">{formatCurrency(takenTotal)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-pink-200 font-bold uppercase tracking-wider mb-2">নেট পার্থক্য</p>
                        <p className={`text-3xl font-black ${netAmount >= 0 ? 'text-emerald-300' : 'text-orange-300'}`}>
                            {netAmount >= 0 ? '+' : ''}{formatCurrency(netAmount)}
                        </p>
                    </div>
                </div>
                <div>
                    <div className="text-sm mb-3 font-bold">
                        <span className="text-pink-200">{data.loans.length} মোট ঋণের লেনদেন</span>
                    </div>
                </div>
            </div>

            {/* সার্চ এবং ফিল্টার */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 space-y-4">
                <div className="relative">
                    <div className="icon-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></div>
                    <input 
                        type="text"
                        placeholder="ঋণ খুঁজুন..."
                        className="input-field w-full pl-12 py-4 text-base font-bold rounded-2xl border border-gray-300"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {[
                        { id: 'all', label: 'সব', icon: 'icon-layout' },
                        { id: 'given', label: 'প্রদত্ত', icon: 'icon-send' },
                        { id: 'taken', label: 'গৃহীত', icon: 'icon-download' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterActive(tab.id)}
                            className={`px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all active:scale-90 flex items-center gap-2 ${
                                filterActive === tab.id 
                                    ? 'bg-pink-600 text-white shadow-lg' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <div className={tab.icon}></div> {tab.label}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => setIsAdding(true)}
                    disabled={loading}
                    className="w-full btn btn-primary rounded-2xl py-4 px-6 font-black text-lg flex items-center justify-center gap-2"
                >
                    <div className="icon-plus text-2xl"></div> নতুন ঋণ যোগ করুন
                </button>
            </div>

            {/* নতুন ঋণ ফর্ম - iOS শীট */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in border border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black text-gray-900">{editingId ? 'ঋণ সম্পাদন করুন' : 'নতুন ঋণ যোগ করুন'}</h3>
                            <button 
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingId(null);
                                }}
                                className="p-3 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
                            >
                                <div className="icon-x text-2xl text-gray-600"></div>
                            </button>
                        </div>
                        
                        <form onSubmit={(e) => { 
                            e.preventDefault(); 
                            handleSave(editingId, newLoan);
                        }} className="space-y-6">
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">ঋণকারীর নাম</label>
                                <input 
                                    type="text"
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    placeholder="যেমন: আবুল"
                                    value={newLoan.name}
                                    onChange={e => setNewLoan({...newLoan, name: e.target.value})}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">ঋণের ধরন</label>
                                <select 
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    value={newLoan.type}
                                    onChange={e => setNewLoan({...newLoan, type: e.target.value})}
                                >
                                    <option value="given">আমি প্রদান করেছি</option>
                                    <option value="taken">আমি গ্রহণ করেছি</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">ঋণের পরিমাণ ({currencySymbol})</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-4 text-2xl font-black text-gray-900">{currencySymbol}</span>
                                    <input 
                                        type="number" 
                                        className="input-field text-3xl font-black py-5 pl-12 rounded-2xl w-full"
                                        placeholder="0"
                                        value={newLoan.amount}
                                        onChange={e => setNewLoan({...newLoan, amount: parseFloat(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">পরিশোধের তারিখ</label>
                                <input 
                                    type="date"
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    value={newLoan.dueDate}
                                    onChange={e => setNewLoan({...newLoan, dueDate: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">মন্তব্য (ঐচ্ছিক)</label>
                                <input 
                                    type="text"
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    placeholder="যেমন: সাপ্তাহিক কিস্তিতে ফেরত দেওয়া হবে"
                                    value={newLoan.notes}
                                    onChange={e => setNewLoan({...newLoan, notes: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200">
                                <button 
                                    type="submit"
                                    className="flex-1 btn btn-primary justify-center py-4 px-6 rounded-2xl font-black text-lg active:scale-95"
                                    disabled={!newLoan.name || !newLoan.amount || loading}
                                >
                                    {loading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsAdding(false);
                                        setEditingId(null);
                                    }}
                                    className="flex-1 btn btn-ghost bg-gray-100 rounded-2xl py-4 px-6 font-black text-lg active:scale-95"
                                >
                                    বাতিল
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ঋণ আইটেম গ্রিড */}
            {filteredLoans.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-3xl flex items-center justify-center">
                        <div className="icon-inbox text-4xl text-pink-600"></div>
                    </div>
                    <p className="text-gray-700 font-bold text-lg">কোন ঋণ নেই</p>
                    <p className="text-gray-500 text-base mt-2">প্রথম ঋণ লেনদেন যোগ করতে শুরু করুন</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredLoans.map(loan => {
                        const daysRemaining = loan.dueDate ? getDaysRemaining(loan.dueDate) : null;
                        const isOverdue = daysRemaining && daysRemaining < 0;
                        const cardColor = loan.type === 'given' 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-blue-50 border-blue-200';

                        return (
                            <div 
                                key={loan.id}
                                className={`rounded-3xl p-8 shadow-lg border transition-all active:scale-95 ${cardColor}`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h4 className="font-black text-lg text-gray-900">{loan.name}</h4>
                                        <p className={`text-xs font-bold mt-2 uppercase tracking-wider ${
                                            loan.type === 'given' ? 'text-red-700' : 'text-blue-700'
                                        }`}>
                                            {loan.type === 'given' ? '💸 প্রদত্ত' : '💰 গৃহীত'}
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${
                                        loan.type === 'given'
                                            ? 'bg-red-200 text-red-700'
                                            : 'bg-blue-200 text-blue-700'
                                    }`}>
                                        {loan.type === 'given' ? '↗' : '↙'}
                                    </div>
                                </div>

                                <div className="mb-6 space-y-2">
                                    <span className="text-4xl font-black text-gray-900">{formatCurrency(loan.amount)}</span>
                                    {loan.dueDate && (
                                        <p className="text-sm text-gray-500 font-bold">
                                            পরিশোধ: {new Date(loan.dueDate).toLocaleDateString('bn-BD')}
                                        </p>
                                    )}
                                    {daysRemaining && (
                                        <p className={`text-sm font-bold ${
                                            isOverdue ? 'text-red-700' : 'text-green-700'
                                        }`}>
                                            {isOverdue ? '❌ মেয়াদোত্তীর্ণ ' : '⏰ '}{Math.abs(daysRemaining)} দিন
                                        </p>
                                    )}
                                    {loan.notes && (
                                        <p className="text-sm text-gray-600 italic">"{loan.notes}"</p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => {
                                            setNewLoan(loan);
                                            setEditingId(loan.id);
                                            setIsAdding(true);
                                        }}
                                        className="flex-1 py-3 px-4 rounded-2xl font-black transition-all active:scale-90 bg-white/60 hover:bg-white"
                                    >
                                        সম্পাদন করুন
                                    </button>
                                    <button 
                                        onClick={() => onDelete(loan.id)}
                                        className="p-3 bg-white/60 rounded-xl hover:bg-white transition-colors active:scale-90"
                                    >
                                        <div className="icon-trash-2 text-lg opacity-75"></div>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
