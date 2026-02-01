function Bills({ data, onAdd, onUpdate, onDelete, confirmAction }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '', amount: '', due_date: '', recurring: 'none', is_paid: false
    });

    const formatCurrency = (amount) => new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await onUpdate(editingId, { ...formData, amount: parseFloat(formData.amount) });
        } else {
            await onAdd({ ...formData, amount: parseFloat(formData.amount) });
        }
        resetForm();
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', amount: '', due_date: '', recurring: 'none', is_paid: false });
    };

    const handleEdit = (bill) => {
        setFormData(bill);
        setEditingId(bill.id);
        setIsAdding(true);
    };

    const togglePaid = async (bill) => {
        await onUpdate(bill.id, { is_paid: !bill.is_paid });
    };

    const handleRenew = (bill) => {
        const oldDate = new Date(bill.due_date);
        let newDate;
        if(bill.recurring === 'monthly') {
            newDate = new Date(oldDate.setMonth(oldDate.getMonth() + 1));
        } else if(bill.recurring === 'yearly') {
            newDate = new Date(oldDate.setFullYear(oldDate.getFullYear() + 1));
        } else {
            return;
        }
        
        const nextDateStr = newDate.toISOString().split('T')[0];
        
        confirmAction(
            'পরবর্তী বিল তৈরি', 
            `${bill.name} এর জন্য পরবর্তী তারিখ (${nextDateStr}) এ নতুন বিল তৈরি করতে চান?`,
            async () => {
                await onAdd({
                    name: bill.name,
                    amount: bill.amount,
                    due_date: nextDateStr,
                    recurring: bill.recurring,
                    is_paid: false
                });
            }
        );
    };

    const handleDelete = async (id) => {
        await onDelete(id);
        setShowDeleteConfirm(null);
    };

    const sortedBills = [...(data.bills || [])].sort((a, b) => {
        if (a.is_paid === b.is_paid) return new Date(a.due_date) - new Date(b.due_date);
        return a.is_paid ? 1 : -1;
    });

    // Calculate totals
    const totalBills = sortedBills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
    const paidBills = sortedBills.filter(b => b.is_paid).reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
    const unpaidBills = totalBills - paidBills;

    return (
        <div className="px-4 sm:px-6 pb-10 space-y-4 sm:space-y-6 animate-fade-in" data-name="bills">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-gray-900">বিল</h1>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-2xl hover:bg-orange-600 shadow-lg"
                >
                    +
                </button>
            </div>

            {/* Summary Cards */}
            {sortedBills.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <iOSCard>
                        <p className="text-xs text-gray-500 font-medium mb-1">মোট বিল</p>
                        <h3 className="text-2xl font-black text-gray-900">{formatCurrency(totalBills)}</h3>
                    </iOSCard>
                    <iOSCard>
                        <p className="text-xs text-gray-500 font-medium mb-1">পরিশোধিত</p>
                        <h3 className="text-2xl font-black text-emerald-600">{formatCurrency(paidBills)}</h3>
                    </iOSCard>
                    <iOSCard>
                        <p className="text-xs text-gray-500 font-medium mb-1">বকেয়া</p>
                        <h3 className="text-2xl font-black text-red-600">{formatCurrency(unpaidBills)}</h3>
                    </iOSCard>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isAdding && (
                <iOSSheet isOpen={true} title={editingId ? "বিল সম্পাদন করুন" : "নতুন বিল যোগ করুন"} onClose={resetForm}>
                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">বিলের নাম</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-orange-500 focus:ring-0 font-medium"
                                placeholder="যেমন: বিদ্যুৎ বিল"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">পরিমান (টাকা)</label>
                            <input 
                                type="number"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-orange-500 focus:ring-0 font-medium"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={e => setFormData({...formData, amount: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">পাওয়ার তারিখ</label>
                            <input 
                                type="date"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-orange-500 focus:ring-0 font-medium"
                                value={formData.due_date}
                                onChange={e => setFormData({...formData, due_date: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">পুনরাবৃত্তি</label>
                            <select 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-orange-500 focus:ring-0 font-medium"
                                value={formData.recurring}
                                onChange={e => setFormData({...formData, recurring: e.target.value})}
                            >
                                <option value="none">একবারই</option>
                                <option value="monthly">প্রতি মাসে</option>
                                <option value="yearly">প্রতি বছরে</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
                            <input 
                                type="checkbox"
                                id="isPaid"
                                checked={formData.is_paid}
                                onChange={e => setFormData({...formData, is_paid: e.target.checked})}
                                className="w-5 h-5"
                            />
                            <label htmlFor="isPaid" className="font-bold text-gray-900">পরিশোধ করা হয়েছে</label>
                        </div>

                        <div className="flex gap-3">
                            <iOSFilledButton type="submit" color="orange">
                                {editingId ? 'আপডেট করুন' : 'যোগ করুন'}
                            </iOSFilledButton>
                            <iOSOutlineButton type="button" onClick={resetForm}>
                                বাতিল
                            </iOSOutlineButton>
                        </div>
                    </form>
                </iOSSheet>
            )}

            {/* Bills List */}
            {sortedBills.length === 0 ? (
                <iOSEmptyState 
                    icon="📄" 
                    title="কোন বিল নেই" 
                    description="আপনার প্রথম বিল যোগ করুন"
                    action={
                        <iOSFilledButton 
                            color="orange"
                            onClick={() => setIsAdding(true)}
                        >
                            নতুন বিল যোগ করুন
                        </iOSFilledButton>
                    }
                />
            ) : (
                <div className="space-y-3">
                    {sortedBills.map(bill => (
                        <iOSCard key={bill.id} padded={false}>
                            <div className="px-6 py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-gray-900 text-lg">{bill.name}</h4>
                                            {bill.recurring !== 'none' && (
                                                <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                                    {bill.recurring === 'monthly' ? '📅 মাসিক' : '📅 বার্ষিক'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">পাবেন: {new Date(bill.due_date).toLocaleDateString('bn-BD')}</p>
                                    </div>
                                    <h3 className="text-2xl font-black text-orange-600">{formatCurrency(bill.amount)}</h3>
                                </div>

                                {/* Status and Progress */}
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => togglePaid(bill)}
                                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-sm transition-all ${bill.is_paid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                    >
                                        {bill.is_paid ? '✓ পরিশোধিত' : '⊙ অপেক্ষমাণ'}
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(bill)}
                                        className="p-2 bg-blue-50 rounded-xl hover:bg-blue-100"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => setShowDeleteConfirm(bill.id)}
                                        className="p-2 bg-red-50 rounded-xl hover:bg-red-100"
                                    >
                                        🗑️
                                    </button>
                                </div>

                                {/* Renew Button for Recurring */}
                                {bill.recurring !== 'none' && bill.is_paid && (
                                    <button 
                                        onClick={() => handleRenew(bill)}
                                        className="w-full py-2 bg-purple-100 text-purple-700 rounded-xl font-bold text-sm hover:bg-purple-200"
                                    >
                                        পরবর্তী বিল তৈরি করুন
                                    </button>
                                )}
                            </div>
                        </iOSCard>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <iOSSheet 
                    isOpen={true} 
                    title="বিল মুছুন?" 
                    onClose={() => setShowDeleteConfirm(null)}
                >
                    <div className="p-4 space-y-4">
                        <p className="text-gray-600 text-center">এই বিলটি মুছে দিতে চান?</p>
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
