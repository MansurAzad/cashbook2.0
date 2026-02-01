function Goals({ data, onAdd, onUpdate, onDelete }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '', target_amount: '', saved_amount: '0', deadline: '', icon: 'icon-target'
    });

    // Deposit Modal State
    const [depositModal, setDepositModal] = React.useState({ isOpen: false, goal: null, amount: '', account_id: '' });

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

    const handleDepositSubmit = async (e) => {
        e.preventDefault();
        const { goal, amount, account_id } = depositModal;
        if (!goal || !amount) return;
        
        const depositAmount = parseFloat(amount);
        
        // 1. Update Goal
        await onUpdate(goal.id, { saved_amount: parseFloat(goal.saved_amount || 0) + depositAmount });

        // 2. Create Transaction (if account selected, it will auto deduct)
        const account = data.accounts.find(a => a.id === account_id);
        const transactionData = {
            type: 'expense', // Money leaving the wallet/account towards savings
            amount: depositAmount,
            category: 'সেভিংস',
            note: `Goal Deposit: ${goal.name}`,
            date: new Date().toISOString().split('T')[0],
            account_id: account_id,
            account_name: account ? account.name : ''
        };
        
        await DataManager.addTransaction(transactionData);

        setDepositModal({ isOpen: false, goal: null, amount: '', account_id: '' });
    };

    return (
        <div className="space-y-6 animate-fade-in" data-name="goals">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="icon-target text-emerald-600"></div>
                    সেভিংস গোল
                </h2>
                <button onClick={() => setIsAdding(true)} className="btn btn-primary">
                    <div className="icon-plus"></div> নতুন গোল
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 sm:p-8 animate-scale-in">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'গোল আপডেট করুন' : 'নতুন গোল'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="গোলের নাম" className="input-field" required 
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input type="number" placeholder="টার্গেট পরিমাণ" className="input-field" required 
                                value={formData.target_amount} onChange={e => setFormData({...formData, target_amount: e.target.value})} />
                            <input type="number" placeholder="বর্তমানে জমা আছে" className="input-field" 
                                value={formData.saved_amount} onChange={e => setFormData({...formData, saved_amount: e.target.value})} />
                            <input type="date" className="input-field" required 
                                value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                            
                            <div className="flex gap-2 mt-6">
                                <button type="submit" className="flex-1 btn btn-primary justify-center">সংরক্ষণ</button>
                                <button type="button" onClick={resetForm} className="flex-1 btn btn-ghost justify-center bg-gray-100">বাতিল</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Deposit Modal */}
            {depositModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 sm:p-8 animate-scale-in">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">জমা দিন: {depositModal.goal?.name}</h3>
                        <form onSubmit={handleDepositSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">পরিমাণ</label>
                                <input 
                                    type="number" 
                                    className="input-field" 
                                    required 
                                    value={depositModal.amount} 
                                    onChange={e => setDepositModal({...depositModal, amount: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">অ্যাকাউন্ট থেকে কাটুন</label>
                                <select 
                                    className="input-field" 
                                    value={depositModal.account_id} 
                                    onChange={e => setDepositModal({...depositModal, account_id: e.target.value})}
                                >
                                    <option value="">সিলেক্ট করুন (অপশনাল)</option>
                                    {data.accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name} (৳ {acc.balance})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 btn btn-primary justify-center">জমা দিন</button>
                                <button type="button" onClick={() => setDepositModal({ isOpen: false, goal: null, amount: '', account_id: '' })} className="flex-1 btn btn-ghost bg-gray-100 justify-center">বাতিল</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {data.goals.map(goal => {
                    const progress = Math.min(100, (goal.saved_amount / goal.target_amount) * 100);
                    return (
                        <div key={goal.id} className="card relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <div className={goal.icon || 'icon-target'}></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{goal.name}</h4>
                                        <p className="text-xs text-gray-500">{goal.deadline} এর মধ্যে</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(goal)} className="p-1.5 hover:bg-gray-100 rounded text-blue-500"><div className="icon-pencil text-sm"></div></button>
                                    <button onClick={() => onDelete(goal.id)} className="p-1.5 hover:bg-gray-100 rounded text-red-500"><div className="icon-trash-2 text-sm"></div></button>
                                </div>
                            </div>
                            
                            <div className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">{formatCurrency(goal.saved_amount)}</span>
                                    <span className="font-bold text-gray-900">{formatCurrency(goal.target_amount)}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3">
                                    <div className="h-3 rounded-full bg-indigo-500 transition-all duration-1000" style={{width: `${progress}%`}}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                <span className="text-xs font-semibold text-indigo-600">{Math.round(progress)}% সম্পন্ন</span>
                                <button 
                                    onClick={() => setDepositModal({ isOpen: true, goal: goal, amount: '', account_id: '' })}
                                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-medium hover:bg-indigo-100 transition-colors"
                                >
                                    + জমা দিন
                                </button>
                            </div>
                        </div>
                    );
                })}
                {data.goals.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="icon-target text-4xl text-gray-300 mb-3 mx-auto"></div>
                        <p className="text-gray-500">কোন সেভিংস গোল নেই</p>
                    </div>
                )}
            </div>
        </div>
    );
}