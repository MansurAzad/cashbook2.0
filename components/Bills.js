function Bills({ data, onAdd, onUpdate, onDelete, confirmAction }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: '', amount: '', due_date: '', recurring: 'none', is_paid: false
    });

    const formatCurrency = (amount) => new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onAdd({ ...formData, amount: parseFloat(formData.amount) });
        setIsAdding(false);
        setFormData({ name: '', amount: '', due_date: '', recurring: 'none', is_paid: false });
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

    // Sort bills: Unpaid first, then by date
    const sortedBills = [...data.bills].sort((a, b) => {
        if (a.is_paid === b.is_paid) return new Date(a.due_date) - new Date(b.due_date);
        return a.is_paid ? 1 : -1;
    });

    const totalBills = data.bills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
    const paidBills = data.bills.filter(b => b.is_paid).reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
    const pendingBills = totalBills - paidBills;

    return (
        <div className="space-y-6 animate-fade-in" data-name="bills">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                    <p className="text-orange-600 text-xs font-black mb-2 uppercase tracking-wider">বাকি বিল</p>
                    <h3 className="text-4xl font-black text-orange-700">{formatCurrency(pendingBills)}</h3>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                    <p className="text-emerald-600 text-xs font-black mb-2 uppercase tracking-wider">পরিশোধিত</p>
                    <h3 className="text-4xl font-black text-emerald-700">{formatCurrency(paidBills)}</h3>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                    <p className="text-blue-600 text-xs font-black mb-2 uppercase tracking-wider">মোট বিল</p>
                    <h3 className="text-4xl font-black text-blue-700">{formatCurrency(totalBills)}</h3>
                </div>
            </div>

            <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <div className="icon-receipt text-orange-500 text-3xl"></div>
                    বিল ট্র্যাকার
                </h2>
                <button onClick={() => setIsAdding(true)} className="btn btn-primary bg-orange-500 hover:bg-orange-600 rounded-2xl py-3 px-8 font-bold text-base">
                    <div className="icon-plus"></div> বিল যুক্ত করুন
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 sm:p-8 animate-scale-in">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">নতুন বিল</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="বিলের নাম (যেমন: বিদ্যুৎ বিল)" className="input-field" required 
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input type="number" placeholder="টাকার পরিমাণ" className="input-field" required 
                                value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                            <input type="date" className="input-field" required 
                                value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
                            <select className="input-field" value={formData.recurring} onChange={e => setFormData({...formData, recurring: e.target.value})}>
                                <option value="none">একবার</option>
                                <option value="monthly">প্রতি মাসে</option>
                                <option value="yearly">প্রতি বছর</option>
                            </select>
                            
                            <div className="flex gap-2 mt-6">
                                <button type="submit" className="flex-1 btn btn-primary bg-orange-500 hover:bg-orange-600 justify-center">সংরক্ষণ</button>
                                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 btn btn-ghost justify-center bg-gray-100">বাতিল</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card p-0 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {sortedBills.map(bill => (
                        <SwipeableItem
                            key={bill.id}
                            onSwipeLeft={() => onDelete(bill.id)}
                            onSwipeRight={() => togglePaid(bill)}
                            leftAction={<div className="icon-trash"></div>}
                            rightAction={<div className="icon-check"></div>}
                            className={`hover:bg-gray-50/50 transition-colors ${bill.is_paid ? 'opacity-60 bg-gray-50' : ''}`}
                        >
                            <div className="px-6 py-4 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-800 flex items-center gap-2">
                                        <div className="icon-file-text text-gray-400"></div>
                                        <div>
                                            <div>{bill.name}</div>
                                            {bill.recurring !== 'none' && (
                                                <div className="text-[10px] text-blue-600 mt-0.5 font-bold uppercase tracking-wider">{bill.recurring === 'monthly' ? 'Monthly' : 'Yearly'}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {bill.due_date}
                                        {!bill.is_paid && new Date(bill.due_date) < new Date() && (
                                            <span className="ml-2 text-xs text-red-500 font-bold">মেয়াদোত্তীর্ণ</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="font-bold text-gray-800">{formatCurrency(bill.amount)}</div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); togglePaid(bill); }}
                                        className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                                            bill.is_paid 
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                            : 'bg-white text-gray-600 border-gray-300'
                                        }`}
                                    >
                                        {bill.is_paid ? 'পরিশোধিত' : 'অপরিশোধিত'}
                                    </button>
                                </div>
                            </div>
                        </SwipeableItem>
                    ))}
                    {sortedBills.length === 0 && (
                        <div className="px-6 py-12 text-center text-gray-500">কোন বিল যুক্ত করা হয়নি</div>
                    )}
                </div>
            </div>
            <div className="text-center text-xs text-gray-400 mt-4">
                টিপস: ডানে সোয়াইপ করে পেমেন্ট স্ট্যাটাস টগল করুন
            </div>
        </div>
    );
}