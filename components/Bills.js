function Bills({ data, onAdd, onUpdate, onDelete, loading, confirmAction, currencySymbol = '৳' }) {
    const [filterActive, setFilterActive] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isAdding, setIsAdding] = React.useState(false);
    const [newBill, setNewBill] = React.useState({
        name: '',
        amount: '',
        dueDate: '',
        frequency: 'monthly',
        isPaid: false
    });

    const filteredBills = data.bills.filter(bill => {
        const matchesSearch = bill.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterActive === 'all' || 
            (filterActive === 'paid' && bill.isPaid) || 
            (filterActive === 'unpaid' && !bill.isPaid);
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' })
            .format(amount)
            .replace('৳', currencySymbol);
    };

    const totalBills = data.bills.reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
    const paidBills = data.bills.filter(b => b.isPaid).reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
    const upcomingBills = data.bills.filter(b => !b.isPaid).reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);

    const handleSave = async (id, billData) => {
        try {
            if (!billData.name || billData.name.trim() === '') {
                alert('দয়া করে বিলের নাম দিন');
                return;
            }
            if (!billData.amount || parseFloat(billData.amount) <= 0) {
                alert('দয়া করে সঠিক পরিমাণ দিন');
                return;
            }
            
            const payload = {
                ...billData,
                amount: parseFloat(billData.amount) || 0
            };
            
            if (id) {
                await onUpdate(id, payload);
            } else {
                await onAdd(payload);
            }
            setIsAdding(false);
            setNewBill({ name: '', amount: '', dueDate: '', frequency: 'monthly', isPaid: false });
        } catch (err) {
            console.error('বিল সংরক্ষণ ত্রুটি:', err);
            alert('বিল সংরক্ষণে ব্যর্থ হয়েছে');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10" data-name="bills">
            {/* প্রিমিয়াম মোট কার্ড - নীল গ্রেডিয়েন্ট */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 rounded-3xl p-8 text-white shadow-2xl border border-blue-700">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black opacity-90 uppercase tracking-wider">মাসিক বিল সারাংশ</h3>
                    <div className="icon-file-text text-blue-300 text-3xl"></div>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div>
                        <p className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-2">মোট বিল</p>
                        <p className="text-4xl font-black">{formatCurrency(totalBills)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-2">পরিশোধিত</p>
                        <p className="text-4xl font-black text-emerald-300">{formatCurrency(paidBills)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-2">বকেয়া</p>
                        <p className="text-4xl font-black text-orange-300">{formatCurrency(upcomingBills)}</p>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-3 font-bold">
                        <span>পরিশোধিত {Math.round((paidBills / totalBills) * 100 || 0)}%</span>
                        <span className="text-blue-200">{Math.round(((totalBills - paidBills) / totalBills) * 100 || 0)}% বকেয়া</span>
                    </div>
                    <div className="w-full bg-blue-700 rounded-full h-4 shadow-lg overflow-hidden">
                        <div 
                            className="h-4 rounded-full bg-emerald-400 transition-all duration-500"
                            style={{ width: `${Math.round((paidBills / totalBills) * 100 || 0)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* সার্চ এবং ফিল্টার */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 space-y-4">
                <div className="relative">
                    <div className="icon-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></div>
                    <input 
                        type="text"
                        placeholder="বিল খুঁজুন..."
                        className="input-field w-full pl-12 py-4 text-base font-bold rounded-2xl border border-gray-300"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {[
                        { id: 'all', label: 'সব', icon: 'icon-layout' },
                        { id: 'paid', label: 'পরিশোধিত', icon: 'icon-check-circle' },
                        { id: 'unpaid', label: 'বকেয়া', icon: 'icon-alert-circle' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterActive(tab.id)}
                            className={`px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all active:scale-90 flex items-center gap-2 ${
                                filterActive === tab.id 
                                    ? 'bg-blue-600 text-white shadow-lg' 
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
                    <div className="icon-plus text-2xl"></div> নতুন বিল যোগ করুন
                </button>
            </div>

            {/* নতুন বিল ফর্ম - iOS শীট */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in border border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black text-gray-900">নতুন বিল যোগ করুন</h3>
                            <button 
                                onClick={() => setIsAdding(false)}
                                className="p-3 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
                            >
                                <div className="icon-x text-2xl text-gray-600"></div>
                            </button>
                        </div>
                        
                        <form onSubmit={(e) => { 
                            e.preventDefault(); 
                            handleSave(null, newBill);
                        }} className="space-y-6">
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">বিলের নাম</label>
                                <input 
                                    type="text"
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    placeholder="যেমন: বিদ্যুৎ বিল"
                                    value={newBill.name}
                                    onChange={e => setNewBill({...newBill, name: e.target.value})}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">পরিমাণ ({currencySymbol})</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-4 text-2xl font-black text-gray-900">{currencySymbol}</span>
                                    <input 
                                        type="number" 
                                        className="input-field text-3xl font-black py-5 pl-12 rounded-2xl w-full"
                                        placeholder="0"
                                        value={newBill.amount}
                                        onChange={e => setNewBill({...newBill, amount: parseFloat(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">বিল দিবস</label>
                                <input 
                                    type="date"
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    value={newBill.dueDate}
                                    onChange={e => setNewBill({...newBill, dueDate: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">ফ্রিকোয়েন্সি</label>
                                <select 
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    value={newBill.frequency}
                                    onChange={e => setNewBill({...newBill, frequency: e.target.value})}
                                >
                                    <option value="monthly">মাসিক</option>
                                    <option value="quarterly">ত্রৈমাসিক</option>
                                    <option value="annually">বার্ষিক</option>
                                    <option value="bi-monthly">দ্বি-মাসিক</option>
                                </select>
                            </div>

                            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200">
                                <button 
                                    type="submit"
                                    className="flex-1 btn btn-primary justify-center py-4 px-6 rounded-2xl font-black text-lg active:scale-95"
                                    disabled={!newBill.name || !newBill.amount || !newBill.dueDate || loading}
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

            {/* বিল আইটেম গ্রিড */}
            {filteredBills.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-3xl flex items-center justify-center">
                        <div className="icon-inbox text-4xl text-blue-600"></div>
                    </div>
                    <p className="text-gray-700 font-bold text-lg">কোন বিল নেই</p>
                    <p className="text-gray-500 text-base mt-2">প্রথম বিল যোগ করতে শুরু করুন</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredBills.map(bill => (
                        <div 
                            key={bill.id}
                            className={`rounded-3xl p-8 shadow-lg border transition-all active:scale-95 cursor-pointer ${
                                bill.isPaid 
                                    ? 'bg-emerald-50 border-emerald-200' 
                                    : 'bg-white border-gray-200'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h4 className="font-black text-lg text-gray-900">{bill.name}</h4>
                                    <p className={`text-xs font-bold mt-2 uppercase tracking-wider ${
                                        bill.isPaid ? 'text-emerald-700' : 'text-orange-700'
                                    }`}>
                                        {bill.isPaid ? '✓ পরিশোধিত' : '⚠ বকেয়া'}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${
                                    bill.isPaid 
                                        ? 'bg-emerald-200 text-emerald-700' 
                                        : 'bg-orange-200 text-orange-700'
                                }`}>
                                    {bill.isPaid ? '✓' : '!'}
                                </div>
                            </div>

                            <div className="mb-6 space-y-2">
                                <span className="text-4xl font-black text-gray-900">{formatCurrency(bill.amount)}</span>
                                <p className="text-sm text-gray-500 font-bold">বিল দিবস: {new Date(bill.dueDate).toLocaleDateString('bn-BD')}</p>
                                <p className="text-sm text-gray-500 font-bold">পুনরাবৃত্তি: {
                                    bill.frequency === 'monthly' ? 'মাসিক' :
                                    bill.frequency === 'quarterly' ? 'ত্রৈমাসিক' :
                                    bill.frequency === 'annually' ? 'বার্ষিক' : 'দ্বি-মাসিক'
                                }</p>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => onSave({...bill, isPaid: !bill.isPaid}, bill.id)}
                                    className={`flex-1 py-3 px-4 rounded-2xl font-black transition-all active:scale-90 ${
                                        bill.isPaid 
                                            ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                                            : 'bg-orange-500 text-white hover:bg-orange-600'
                                    }`}
                                >
                                    {bill.isPaid ? 'অপরিশোধিত করুন' : 'পরিশোধ করুন'}
                                </button>
                                <button 
                                    onClick={() => onDelete(bill.id)}
                                    className="p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors active:scale-90"
                                >
                                    <div className="icon-trash-2 text-red-600 text-lg"></div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
