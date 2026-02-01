function Goals({ data, onAdd, onUpdate, onDelete }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(null);
    const [depositMode, setDepositMode] = React.useState(null);
    const [depositAmount, setDepositAmount] = React.useState('');
    const [formData, setFormData] = React.useState({
        name: '', target_amount: '', saved_amount: '0', deadline: '', icon: 'icon-target'
    });

    const formatCurrency = (amount) => new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await onUpdate(editingId, { ...formData, target_amount: parseFloat(formData.target_amount), saved_amount: parseFloat(formData.saved_amount) });
        } else {
            await onAdd({ ...formData, target_amount: parseFloat(formData.target_amount), saved_amount: parseFloat(formData.saved_amount) });
        }
        resetForm();
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', target_amount: '', saved_amount: '0', deadline: '', icon: 'icon-target' });
    };

    const handleEdit = (goal) => {
        setFormData({
            name: goal.name,
            target_amount: goal.target_amount,
            saved_amount: goal.saved_amount,
            deadline: goal.deadline,
            icon: goal.icon || 'icon-target'
        });
        setEditingId(goal.id);
        setIsAdding(true);
    };

    const handleDeposit = async (goal) => {
        if (!depositAmount || parseFloat(depositAmount) <= 0) return;
        
        const newSavedAmount = parseFloat(goal.saved_amount || 0) + parseFloat(depositAmount);
        await onUpdate(goal.id, { saved_amount: newSavedAmount });
        
        setDepositMode(null);
        setDepositAmount('');
    };

    return (
        <div className="px-4 sm:px-6 pb-10 space-y-4 sm:space-y-6 animate-fade-in" data-name="goals">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-gray-900">লক্ষ্য সমূহ</h1>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-2xl hover:bg-blue-600 shadow-lg"
                >
                    +
                </button>
            </div>

            {/* Add/Edit Goal Modal */}
            {isAdding && (
                <iOSSheet isOpen={true} title={editingId ? "লক্ষ্য সম্পাদন করুন" : "নতুন লক্ষ্য তৈরি করুন"} onClose={resetForm}>
                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">লক্ষ্যের নাম</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-0 font-medium"
                                placeholder="যেমন: গাড়ি কিনতে হবে"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">লক্ষ্যমান</label>
                                <input 
                                    type="number"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-0 font-medium"
                                    placeholder="0"
                                    value={formData.target_amount}
                                    onChange={e => setFormData({...formData, target_amount: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">সংরক্ষিত পরিমান</label>
                                <input 
                                    type="number"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-0 font-medium"
                                    placeholder="0"
                                    value={formData.saved_amount}
                                    onChange={e => setFormData({...formData, saved_amount: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">সময়সীমা</label>
                            <input 
                                type="date"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-0 font-medium"
                                value={formData.deadline}
                                onChange={e => setFormData({...formData, deadline: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-3">
                            <iOSFilledButton type="submit" color="blue">
                                {editingId ? 'আপডেট করুন' : 'তৈরি করুন'}
                            </iOSFilledButton>
                            <iOSOutlineButton type="button" onClick={resetForm}>
                                বাতিল
                            </iOSOutlineButton>
                        </div>
                    </form>
                </iOSSheet>
            )}

            {/* Summary Card */}
            {data.goals && data.goals.length > 0 && (
                <iOSCard>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">মোট লক্ষ্য</p>
                            <h3 className="text-2xl font-black text-gray-900">{formatCurrency(data.goals.reduce((sum, g) => sum + parseFloat(g.target_amount || 0), 0))}</h3>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">সংরক্ষিত মোট</p>
                            <h3 className="text-2xl font-black text-emerald-600">{formatCurrency(data.goals.reduce((sum, g) => sum + parseFloat(g.saved_amount || 0), 0))}</h3>
                        </div>
                    </div>
                </iOSCard>
            )}

            {/* Goals List */}
            {!data.goals || data.goals.length === 0 ? (
                <iOSEmptyState 
                    icon="🎯" 
                    title="কোন লক্ষ্য নেই" 
                    description="আপনার প্রথম আর্থিক লক্ষ্য তৈরি করুন"
                    action={
                        <iOSFilledButton 
                            color="blue"
                            onClick={() => setIsAdding(true)}
                        >
                            প্রথম লক্ষ্য তৈরি করুন
                        </iOSFilledButton>
                    }
                />
            ) : (
                <div className="space-y-3">
                    {data.goals.map(goal => {
                        const percentage = (goal.saved_amount / goal.target_amount) * 100;
                        const remaining = goal.target_amount - goal.saved_amount;

                        return (
                            <GoalCardiOS
                                key={goal.id}
                                goal={goal}
                                percentage={percentage}
                                remaining={remaining}
                                onDeposit={() => setDepositMode(goal.id)}
                                onEdit={() => handleEdit(goal)}
                                onDelete={() => setShowDeleteConfirm(goal.id)}
                            />
                        );
                    })}
                </div>
            )}

            {/* Deposit Modal */}
            {depositMode && (
                <iOSSheet 
                    isOpen={true} 
                    title="টাকা যোগ করুন" 
                    onClose={() => { setDepositMode(null); setDepositAmount(''); }}
                >
                    <div className="space-y-4 p-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">পরিমান (টাকা)</label>
                            <input 
                                type="number"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:ring-0 font-medium text-lg"
                                placeholder="0"
                                value={depositAmount}
                                onChange={e => setDepositAmount(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3">
                            <iOSFilledButton 
                                color="emerald"
                                onClick={() => handleDeposit(data.goals.find(g => g.id === depositMode))}
                            >
                                যোগ করুন
                            </iOSFilledButton>
                            <iOSOutlineButton 
                                onClick={() => { setDepositMode(null); setDepositAmount(''); }}
                            >
                                বাতিল
                            </iOSOutlineButton>
                        </div>
                    </div>
                </iOSSheet>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <iOSSheet 
                    isOpen={true} 
                    title="লক্ষ্য মুছুন?" 
                    onClose={() => setShowDeleteConfirm(null)}
                >
                    <div className="p-4 space-y-4">
                        <p className="text-gray-600 text-center">এই লক্ষ্যটি মুছে দিতে চান?</p>
                        <div className="flex gap-3">
                            <iOSFilledButton 
                                color="red"
                                onClick={() => { onDelete(showDeleteConfirm); setShowDeleteConfirm(null); }}
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
