function Budget({ data, onSave, onDelete }) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date().toISOString().slice(0, 7));
    const [editingId, setEditingId] = React.useState(null);
    const [editAmount, setEditAmount] = React.useState('');
    const [isAdding, setIsAdding] = React.useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(null);
    const [newBudgetCategory, setNewBudgetCategory] = React.useState('');
    const [newBudgetAmount, setNewBudgetAmount] = React.useState('');

    // iOS Card Component
    const iOSCard = ({ children }) => <div className="ios-card">{children}</div>;

    const budgetStatus = DataManager.getMonthlyBudgetStatus(data.transactions, data.budgets, currentMonth);
    const availableCategories = data.categories.expense.filter(c => 
        !budgetStatus.items.find(b => b.category === c.name)
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
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
        setShowDeleteConfirm(null);
    };

    return (
        <div className="px-4 sm:px-6 pb-10 space-y-4 sm:space-y-6 animate-fade-in" data-name="budget">
            {/* Month Selector with iOS Style */}
            <iOSCard>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">📅</div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">মাস নির্বাচন করুন</p>
                            <input 
                                type="month" 
                                value={currentMonth}
                                onChange={(e) => setCurrentMonth(e.target.value)}
                                className="border-none bg-transparent font-bold text-gray-800 text-lg focus:ring-0 cursor-pointer"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsAdding(true)}
                        disabled={availableCategories.length === 0}
                        className={`btn btn-primary rounded-xl text-sm py-2 px-3 ${availableCategories.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        + যোগ করুন
                    </button>
                </div>
            </iOSCard>

            {/* Total Summary */}
            <div className="card bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold opacity-90">মাসিক মোট বাজেট</h3>
                    <div className="icon-chart-pie text-purple-400"></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div>
                        <p className="text-sm text-gray-400">মোট বরাদ্দ</p>
                        <p className="text-3xl font-bold">{formatCurrency(budgetStatus.total.amount)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">মোট খরচ</p>
                        <p className="text-3xl font-bold text-red-400">{formatCurrency(budgetStatus.total.spent)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">অবশিষ্ট</p>
                        <p className={`text-3xl font-bold ${budgetStatus.total.remaining < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                            {formatCurrency(budgetStatus.total.remaining)}
                        </p>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="flex justify-between text-xs mb-1">
                        <span>ব্যবহৃত {Math.round(budgetStatus.total.percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                            className={`h-2.5 rounded-full ${
                                budgetStatus.total.percentage > 100 ? 'bg-red-500' : 
                                budgetStatus.total.percentage > 80 ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, budgetStatus.total.percentage)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Add New Budget Form */}
            {isAdding && (
                <div className="card bg-blue-50 border border-blue-100 p-4 sm:p-6">
                    <h4 className="font-bold text-blue-900 mb-4">নতুন বাজেট যুক্ত করুন</h4>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
                        <div className="flex-1 w-full">
                            <label className="form-label">ক্যাটাগরি</label>
                            <select 
                                className="input-field"
                                value={newBudgetCategory}
                                onChange={e => setNewBudgetCategory(e.target.value)}
                            >
                                <option value="">নির্বাচন করুন</option>
                                {availableCategories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 w-full">
                            <label className="form-label">বাজেট পরিমাণ</label>
                            <input 
                                type="number" 
                                className="input-field"
                                placeholder="0.00"
                                value={newBudgetAmount}
                                onChange={e => setNewBudgetAmount(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button 
                                onClick={() => handleSave(null, newBudgetCategory, newBudgetAmount)}
                                disabled={!newBudgetCategory || !newBudgetAmount}
                                className="btn btn-primary"
                            >
                                সংরক্ষণ
                            </button>
                            <button 
                                onClick={() => setIsAdding(false)}
                                className="btn btn-ghost"
                            >
                                বাতিল
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Budget List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {budgetStatus.items.map(item => (
                    <div key={item.id} className="card hover:shadow-md transition-shadow group relative">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-gray-800">{item.category}</h4>
                                <p className="text-xs text-gray-500">মাসিক সীমা</p>
                            </div>
                        <div className="flex gap-2">
                                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => {
                                    setEditingId(item.id);
                                    setEditAmount(item.amount);
                                }}>
                                    <div className="icon-pencil text-gray-600 text-sm"></div>
                                </button>
                                <button className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" onClick={() => onDelete(item.id)}>
                                    <div className="icon-trash-2 text-red-600 text-sm"></div>
                                </button>
                            </div>
                        </div>

                        {editingId === item.id ? (
                            <div className="flex gap-2 mb-4">
                                <input 
                                    type="number" 
                                    className="input-field py-2 px-3 text-sm"
                                    value={editAmount}
                                    onChange={e => setEditAmount(e.target.value)}
                                    autoFocus
                                />
                                <button 
                                    onClick={() => handleSave(item.id, item.category, editAmount)}
                                    className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                >
                                    <div className="icon-check text-sm"></div>
                                </button>
                                <button 
                                    onClick={() => setEditingId(null)}
                                    className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    <div className="icon-x text-sm"></div>
                                </button>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">খরচ হয়েছে</span>
                                <span className="font-medium text-gray-900">{formatCurrency(item.spent)}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                        item.percentage > 100 ? 'bg-red-500' : 
                                        item.percentage > 90 ? 'bg-orange-500' : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${item.percentage}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{Math.round(item.percentage)}%</span>
                                <span className={item.remaining < 0 ? 'text-red-500 font-bold' : ''}>
                                    {item.remaining < 0 ? 'অতিরিক্ত ' : 'অবশিষ্ট '} 
                                    {formatCurrency(Math.abs(item.remaining))}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {budgetStatus.items.length === 0 && !isAdding && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="icon-piggy-bank text-4xl text-gray-300 mb-3 mx-auto"></div>
                    <p className="text-gray-500">এই মাসের জন্য কোন বাজেট সেট করা নেই</p>
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="mt-4 text-purple-600 font-medium hover:underline"
                    >
                        প্রথম বাজেট তৈরি করুন
                    </button>
                </div>
            )}
        </div>
    );
}