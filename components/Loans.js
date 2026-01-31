function Loans({ data, onAdd, onUpdate, onDelete }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '', amount: '', type: 'given', due_date: '', status: 'unpaid'
    });

    const formatCurrency = (amount) => new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onAdd({ ...formData, amount: parseFloat(formData.amount) });
        resetForm();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await onUpdate(editingId, { ...formData, amount: parseFloat(formData.amount) });
        resetForm();
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', amount: '', type: 'given', due_date: '', status: 'unpaid' });
    };

    const handleEdit = (loan) => {
        setFormData({
            name: loan.name,
            amount: loan.amount,
            type: loan.type,
            due_date: loan.due_date,
            status: loan.status
        });
        setEditingId(loan.id);
        setIsAdding(true);
    };

    const toggleStatus = async (loan) => {
        await onUpdate(loan.id, { status: loan.status === 'paid' ? 'unpaid' : 'paid' });
    };

    const givenTotal = data.loans.filter(l => l.type === 'given' && l.status === 'unpaid').reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
    const takenTotal = data.loans.filter(l => l.type === 'taken' && l.status === 'unpaid').reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);

    return (
        <div className="space-y-6 animate-fade-in" data-name="loans">
            <div className="grid grid-cols-2 gap-4">
                <div className="card bg-red-50 border-red-100 text-center">
                    <p className="text-red-600 text-sm font-medium">পাওনা (Given)</p>
                    <h3 className="text-2xl font-bold text-red-700">{formatCurrency(givenTotal)}</h3>
                    <p className="text-xs text-red-400 mt-1">মানুষ আপনার কাছে পাবে</p>
                </div>
                <div className="card bg-emerald-50 border-emerald-100 text-center">
                    <p className="text-emerald-600 text-sm font-medium">দেনা (Taken)</p>
                    <h3 className="text-2xl font-bold text-emerald-700">{formatCurrency(takenTotal)}</h3>
                    <p className="text-xs text-emerald-400 mt-1">আপনি মানুষের কাছে পাবেন</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="icon-hand-coins text-purple-600"></div>
                    ঋণ ব্যবস্থাপনা
                </h2>
                <button onClick={() => setIsAdding(true)} className="btn btn-primary bg-purple-600 hover:bg-purple-700">
                    <div className="icon-plus"></div> নতুন ঋণ
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'ঋণ আপডেট' : 'নতুন ঋণ যুক্ত করুন'}</h3>
                        <form onSubmit={editingId ? handleUpdate : handleSubmit} className="space-y-4">
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button type="button" onClick={() => setFormData({...formData, type: 'given'})} className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${formData.type === 'given' ? 'bg-red-500 text-white shadow' : 'text-gray-500'}`}>কাউকে দিয়েছি</button>
                                <button type="button" onClick={() => setFormData({...formData, type: 'taken'})} className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${formData.type === 'taken' ? 'bg-emerald-500 text-white shadow' : 'text-gray-500'}`}>কারো থেকে নিয়েছি</button>
                            </div>
                            
                            <input type="text" placeholder="ব্যক্তির নাম" className="input-field" required 
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            
                            <input type="number" placeholder="টাকার পরিমাণ" className="input-field" required 
                                value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                            
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">ফেরত দেওয়ার তারিখ</label>
                                <input type="date" className="input-field" required 
                                    value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
                            </div>

                            <div className="flex gap-2 mt-6">
                                <button type="submit" className="flex-1 btn btn-primary bg-purple-600 hover:bg-purple-700 justify-center">সংরক্ষণ</button>
                                <button type="button" onClick={resetForm} className="flex-1 btn btn-ghost justify-center bg-gray-100">বাতিল</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {data.loans.map(loan => (
                    <SwipeableItem
                        key={loan.id}
                        onSwipeLeft={() => onDelete(loan.id)}
                        onSwipeRight={() => toggleStatus(loan)}
                        rightAction={<div className="icon-check"></div>}
                        className={`rounded-xl border border-gray-100 shadow-sm ${loan.status === 'paid' ? 'opacity-60 bg-gray-50' : ''}`}
                    >
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                    loan.type === 'given' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                    <div className={loan.type === 'given' ? 'icon-arrow-up-right' : 'icon-arrow-down-left'}></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{loan.name}</h4>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <div className="icon-calendar text-[10px]"></div> {loan.due_date}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`font-bold ${loan.type === 'given' ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {formatCurrency(loan.amount)}
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                    loan.status === 'paid' ? 'bg-gray-200 text-gray-600' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {loan.status === 'paid' ? 'পরিশোধিত' : 'অপরিশোধিত'}
                                </span>
                            </div>
                        </div>
                    </SwipeableItem>
                ))}
                {data.loans.length === 0 && (
                    <div className="text-center py-12 text-gray-500">কোন ঋণের তথ্য নেই</div>
                )}
            </div>
        </div>
    );
}