function Goals({ data, onAdd, onUpdate, onDelete, loading, currencySymbol = '৳' }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [newGoal, setNewGoal] = React.useState({
        name: '',
        targetAmount: '',
        savedAmount: '0',
        deadline: ''
    });

    const filteredGoals = data.goals.filter(goal => 
        goal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 })
            .format(Math.floor(amount))
            .replace('৳', currencySymbol);
    };

    const totalTarget = data.goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = data.goals.reduce((sum, g) => sum + g.savedAmount, 0);
    const totalRemaining = totalTarget - totalSaved;
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    const handleSave = async (id, goalData) => {
        try {
            if (!goalData.name || goalData.name.trim() === '') {
                alert('দয়া করে লক্ষ্যের নাম দিন');
                return;
            }
            if (!goalData.targetAmount || parseFloat(goalData.targetAmount) <= 0) {
                alert('দয়া করে সঠিক লক্ষ্য পরিমাণ দিন');
                return;
            }
            if (!goalData.deadline || goalData.deadline.trim() === '') {
                alert('দয়া করে লক্ষ্যের তারিখ নির্ধারণ করুন');
                return;
            }

            const payload = {
                name: goalData.name,
                targetAmount: parseFloat(goalData.targetAmount),
                savedAmount: parseFloat(goalData.savedAmount) || 0,
                deadline: goalData.deadline
            };

            if (editingId) {
                await onUpdate(editingId, payload);
            } else {
                await onAdd(payload);
            }

            setIsAdding(false);
            setEditingId(null);
            setNewGoal({ name: '', targetAmount: '', savedAmount: '0', deadline: '' });
        } catch (err) {
            console.error('লক্ষ্য সংরক্ষণ ত্রুটি:', err);
            alert('লক্ষ্য সংরক্ষণে ব্যর্থ হয়েছে');
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
        <div className="space-y-6 animate-fade-in pb-10" data-name="goals">
            {/* সামগ্রিক লক্ষ্য সারাংশ - সবুজ গ্রেডিয়েন্ট */}
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-700">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h3 className="text-base sm:text-lg font-black opacity-90 uppercase tracking-wider">সঞ্চয়ের লক্ষ্য</h3>
                    <div className="icon-target text-emerald-300 text-2xl sm:text-3xl"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-emerald-800/40 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                        <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-2">মোট লক্ষ্য</p>
                        <p className="text-2xl sm:text-4xl font-black break-words line-clamp-2">{formatCurrency(totalTarget)}</p>
                    </div>
                    <div className="bg-emerald-800/40 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                        <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-2">সংরক্ষিত</p>
                        <p className="text-2xl sm:text-4xl font-black text-emerald-200 break-words line-clamp-2">{formatCurrency(totalSaved)}</p>
                    </div>
                    <div className="bg-emerald-800/40 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                        <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-2">অবশিষ্ট</p>
                        <p className="text-2xl sm:text-4xl font-black text-orange-300 break-words line-clamp-2">{formatCurrency(totalRemaining)}</p>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-3 font-bold flex-wrap gap-1">
                        <span>সামগ্রিক অগ্রগতি {Math.round(overallProgress)}%</span>
                        <span className="text-emerald-200">{Math.round(100 - overallProgress)}% অবশিষ্ট</span>
                    </div>
                    <div className="w-full bg-emerald-700 rounded-full h-4 shadow-lg overflow-hidden">
                        <div 
                            className="h-4 rounded-full bg-yellow-300 transition-all duration-500"
                            style={{ width: `${Math.min(100, overallProgress)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* সার্চ এবং অ্যাকশন */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 space-y-4">
                <div className="relative">
                    <div className="icon-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></div>
                    <input 
                        type="text"
                        placeholder="লক্ষ্য খুঁজুন..."
                        className="input-field w-full pl-12 py-4 text-base font-bold rounded-2xl border border-gray-300"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <button 
                    onClick={() => setIsAdding(true)}
                    disabled={loading}
                    className="w-full btn btn-primary rounded-2xl py-4 px-6 font-black text-lg flex items-center justify-center gap-2"
                >
                    <div className="icon-plus text-2xl"></div> নতুন লক্ষ্য যোগ করুন
                </button>
            </div>

            {/* নতুন লক্ষ্য ফর্ম - iOS শীট */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in border border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black text-gray-900">{editingId ? 'লক্ষ্য সম্পাদন করুন' : 'নতুন লক্ষ্য যোগ করুন'}</h3>
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
                            handleSave(editingId, newGoal);
                        }} className="space-y-6">
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">লক্ষ্যের নাম</label>
                                <input 
                                    type="text"
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    placeholder="যেমন: গাড়ি কেনা"
                                    value={newGoal.name}
                                    onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">লক্ষ্য পরিমাণ ({currencySymbol})</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-4 text-2xl font-black text-gray-900">{currencySymbol}</span>
                                    <input 
                                        type="number" 
                                        className="input-field text-3xl font-black py-5 pl-12 rounded-2xl w-full"
                                        placeholder="0"
                                        value={newGoal.targetAmount}
                                        onChange={e => setNewGoal({...newGoal, targetAmount: parseFloat(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">এখন পর্যন্ত সংরক্ষিত ({currencySymbol})</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-4 text-2xl font-black text-gray-900">{currencySymbol}</span>
                                    <input 
                                        type="number" 
                                        className="input-field text-3xl font-black py-5 pl-12 rounded-2xl w-full"
                                        placeholder="0"
                                        value={newGoal.savedAmount}
                                        onChange={e => setNewGoal({...newGoal, savedAmount: parseFloat(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">লক্ষ্যের তারিখ</label>
                                <input 
                                    type="date"
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    value={newGoal.deadline}
                                    onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200">
                                <button 
                                    type="submit"
                                    className="flex-1 btn btn-primary justify-center py-4 px-6 rounded-2xl font-black text-lg active:scale-95"
                                    disabled={!newGoal.name || !newGoal.targetAmount || !newGoal.deadline || loading}
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

            {/* লক্ষ্য আইটেম গ্রিড */}
            {filteredGoals.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-3xl flex items-center justify-center">
                        <div className="icon-target text-4xl text-emerald-600"></div>
                    </div>
                    <p className="text-gray-700 font-bold text-lg">কোন লক্ষ্য নেই</p>
                    <p className="text-gray-500 text-base mt-2">প্রথম লক্ষ্য তৈরি করতে শুরু করুন</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredGoals.map(goal => {
                        const progress = (goal.savedAmount / goal.targetAmount) * 100;
                        const daysRemaining = getDaysRemaining(goal.deadline);
                        const isCompleted = goal.savedAmount >= goal.targetAmount;

                        return (
                            <div 
                                key={goal.id}
                                className={`rounded-3xl p-8 shadow-lg border transition-all active:scale-95 ${
                                    isCompleted
                                        ? 'bg-emerald-50 border-emerald-200'
                                        : 'bg-white border-gray-200'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h4 className="font-black text-lg text-gray-900">{goal.name}</h4>
                                        <p className={`text-xs font-bold mt-2 uppercase tracking-wider ${
                                            isCompleted ? 'text-emerald-700' : 'text-gray-700'
                                        }`}>
                                            {isCompleted ? '✓ সম্পন্ন' : `📅 ${Math.max(0, daysRemaining)} দিন বাকি`}
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${
                                        isCompleted
                                            ? 'bg-emerald-200 text-emerald-700'
                                            : 'bg-yellow-200 text-yellow-700'
                                    }`}>
                                        {isCompleted ? '✓' : '🎯'}
                                    </div>
                                </div>

                                <div className="mb-6 space-y-2">
                                    <div>
                                        <span className="text-4xl font-black text-gray-900">{formatCurrency(goal.savedAmount)}</span>
                                        <span className="text-sm text-gray-500 font-bold ml-2">/{formatCurrency(goal.targetAmount)}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-bold">লক্ষ্য: {new Date(goal.deadline).toLocaleDateString('bn-BD')}</p>
                                </div>

                                <div className="w-full bg-gray-100 rounded-full h-4 shadow-sm overflow-hidden mb-4">
                                    <div 
                                        className={`h-4 rounded-full transition-all duration-500 ${
                                            isCompleted ? 'bg-emerald-500' : 'bg-yellow-400'
                                        }`}
                                        style={{ width: `${Math.min(100, progress)}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xs font-bold text-gray-500">{Math.round(progress)}% সম্পন্ন</span>
                                    <span className="text-sm font-black text-gray-900">
                                        {formatCurrency(goal.targetAmount - goal.savedAmount)} বাকি
                                    </span>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => {
                                            setNewGoal(goal);
                                            setEditingId(goal.id);
                                            setIsAdding(true);
                                        }}
                                        className="flex-1 py-3 px-4 rounded-2xl font-black transition-all active:scale-90 bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        সংরক্ষণ যোগ করুন
                                    </button>
                                    <button 
                                        onClick={() => onDelete(goal.id)}
                                        className="p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors active:scale-90"
                                    >
                                        <div className="icon-trash-2 text-red-600 text-lg"></div>
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
