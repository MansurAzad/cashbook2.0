function Budget({ data, onSave, onDelete, loading, currencySymbol = '৳' }) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date().toISOString().slice(0, 7));
    const [editingId, setEditingId] = React.useState(null);
    const [editAmount, setEditAmount] = React.useState('');
    const [isAdding, setIsAdding] = React.useState(false);
    const [newBudgetCategory, setNewBudgetCategory] = React.useState('');
    const [newBudgetAmount, setNewBudgetAmount] = React.useState('');

    const budgetStatus = DataManager.getMonthlyBudgetStatus(data.transactions, data.budgets, currentMonth);
    const availableCategories = data.categories.expense.filter(c => 
        !budgetStatus.items.find(b => b.category === c.name)
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' })
            .format(amount)
            .replace('৳', currencySymbol);
    };

    const handleSave = async (id, category, amount) => {
        await onSave({
            category: category,
            amount: parseFloat(amount),
            month: currentMonth
        }, id);
        setEditingId(null);
        setIsAdding(false);
        setNewBudgetCategory('');
        setNewBudgetAmount('');
    };

    const handleDelete = async (id) => {
        await onDelete(id);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10" data-name="budget">
            {/* মাস নির্বাচন কার্ড */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between flex-col sm:flex-row gap-6">
                    <div className="flex items-center gap-5 flex-1">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-4xl font-bold shadow-lg flex-shrink-0">📅</div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">বর্তমান মাস</p>
                            <input 
                                type="month" 
                                value={currentMonth}
                                onChange={(e) => setCurrentMonth(e.target.value)}
                                className="border-none bg-transparent font-black text-3xl text-gray-900 focus:ring-0 cursor-pointer"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsAdding(true)}
                        disabled={availableCategories.length === 0 || loading}
                        className={`btn btn-primary rounded-2xl text-lg py-4 px-8 font-black flex items-center justify-center gap-2 ${availableCategories.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="icon-plus text-2xl"></div> বাজেট যোগ করুন
                    </button>
                </div>
            </div>

            {/* মোট সারাংশ - প্রিমিয়াম কার্ড */}
            <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl border border-purple-700">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black opacity-90 uppercase tracking-wider">মাসিক মোট বাজেট</h3>
                    <div className="icon-chart-pie text-purple-300 text-3xl"></div>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div>
                        <p className="text-xs text-purple-200 font-bold uppercase tracking-wider mb-2">মোট বরাদ্দ</p>
                        <p className="text-4xl font-black">{formatCurrency(budgetStatus.total.amount)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-purple-200 font-bold uppercase tracking-wider mb-2">মোট ব্যয়</p>
                        <p className="text-4xl font-black text-red-300">{formatCurrency(budgetStatus.total.spent)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-purple-200 font-bold uppercase tracking-wider mb-2">অবশিষ্ট</p>
                        <p className={`text-4xl font-black ${budgetStatus.total.remaining < 0 ? 'text-red-400' : 'text-emerald-300'}`}>
                            {formatCurrency(budgetStatus.total.remaining)}
                        </p>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-3 font-bold">
                        <span>ব্যবহৃত {Math.round(budgetStatus.total.percentage)}%</span>
                        <span className="text-purple-200">{Math.max(0, 100 - Math.round(budgetStatus.total.percentage))}% অবশিষ্ট</span>
                    </div>
                    <div className="w-full bg-purple-700 rounded-full h-4 shadow-lg overflow-hidden">
                        <div 
                            className={`h-4 rounded-full transition-all duration-500 ${
                                budgetStatus.total.percentage > 100 ? 'bg-red-500' : 
                                budgetStatus.total.percentage > 80 ? 'bg-orange-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${Math.min(100, budgetStatus.total.percentage)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* নতুন বাজেট ফর্ম - iOS শীট স্টাইল */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in border border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black text-gray-900">নতুন বাজেট যোগ করুন</h3>
                            <button 
                                onClick={() => setIsAdding(false)}
                                className="p-3 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
                            >
                                <div className="icon-x text-2xl text-gray-600"></div>
                            </button>
                        </div>
                        
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(null, newBudgetCategory, newBudgetAmount); }} className="space-y-6">
                            {/* ক্যাটাগরি সিলেক্ট */}
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3 uppercase tracking-wider">খরচের ক্যাটাগরি</label>
                                <select 
                                    className="input-field text-base font-bold py-4 px-5 rounded-2xl w-full border border-gray-300 bg-white"
                                    value={newBudgetCategory}
                                    onChange={e => setNewBudgetCategory(e.target.value)}
                                    required
                                >
                                    <option value="">— নির্বাচন করুন —</option>
                                    {availableCategories.map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* বাজেট পরিমাণ */}
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3 uppercase tracking-wider">বাজেট পরিমাণ ({currencySymbol})</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-4 text-2xl font-black text-gray-900">{currencySymbol}</span>
                                    <input 
                                        type="number" 
                                        className="input-field text-3xl font-black py-5 pl-12 rounded-2xl w-full"
                                        placeholder="0"
                                        value={newBudgetAmount}
                                        onChange={e => setNewBudgetAmount(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* বাটন */}
                            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200">
                                <button 
                                    type="submit"
                                    className="flex-1 btn btn-primary justify-center py-4 px-6 rounded-2xl font-black text-lg active:scale-95"
                                    disabled={!newBudgetCategory || !newBudgetAmount || loading}
                                >
                                    {loading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 btn btn-ghost bg-gray-100 rounded-2xl py-4 px-6 font-black text-lg active:scale-95"
                                >
                                    বাতিল
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* বাজেট তালিকা - গ্রিড লেআউট */}
            {budgetStatus.items.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-3xl flex items-center justify-center">
                        <div className="icon-inbox text-4xl text-purple-600"></div>
                    </div>
                    <p className="text-gray-700 font-bold text-lg">এই মাসের জন্য কোন বাজেট নেই</p>
                    <p className="text-gray-500 text-base mt-2">প্রথম বাজেট তৈরি করতে উপরের বাটন ব্যবহার করুন</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {budgetStatus.items.map(item => (
                        <div 
                            key={item.id} 
                            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all active:scale-95"
                        >
                            {/* হেডার */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h4 className="font-black text-gray-900 text-lg">{item.category}</h4>
                                    <p className="text-xs text-gray-500 font-bold mt-1">মাসিক সীমা</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => {
                                            setEditingId(item.id);
                                            setEditAmount(item.amount);
                                        }}
                                        className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors active:scale-90"
                                    >
                                        <div className="icon-pencil text-blue-600 text-lg"></div>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors active:scale-90"
                                    >
                                        <div className="icon-trash-2 text-red-600 text-lg"></div>
                                    </button>
                                </div>
                            </div>

                            {/* এডিট মোড */}
                            {editingId === item.id ? (
                                <div className="flex gap-2 mb-6">
                                    <input 
                                        type="number" 
                                        className="input-field flex-1 py-3 px-4 text-base font-bold rounded-xl"
                                        value={editAmount}
                                        onChange={e => setEditAmount(e.target.value)}
                                        autoFocus
                                    />
                                    <button 
                                        onClick={() => handleSave(item.id, item.category, editAmount)}
                                        className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors active:scale-90"
                                    >
                                        <div className="icon-check text-lg"></div>
                                    </button>
                                    <button 
                                        onClick={() => setEditingId(null)}
                                        className="p-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors active:scale-90"
                                    >
                                        <div className="icon-x text-lg"></div>
                                    </button>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <span className="text-4xl font-black text-gray-900">{formatCurrency(item.amount)}</span>
                                </div>
                            )}

                            {/* প্রগতি এবং পরিসংখ্যান */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-600">খরচ হয়েছে</span>
                                    <span className="text-lg font-black text-gray-900">{formatCurrency(item.spent)}</span>
                                </div>
                                
                                <div className="w-full bg-gray-100 rounded-full h-4 shadow-sm overflow-hidden">
                                    <div 
                                        className={`h-4 rounded-full transition-all duration-500 ${
                                            item.percentage > 100 ? 'bg-red-500' : 
                                            item.percentage > 90 ? 'bg-orange-500' : 'bg-emerald-500'
                                        }`}
                                        style={{ width: `${Math.min(100, item.percentage)}%` }}
                                    ></div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500">{Math.round(item.percentage)}% ব্যবহৃত</span>
                                    <span className={`text-sm font-black ${item.remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {item.remaining < 0 ? '⚠ ' : '✓ '} 
                                        {formatCurrency(Math.abs(item.remaining))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
