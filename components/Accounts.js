function Accounts({ data, onAdd, onUpdate, onDelete }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '', type: 'cash', balance: '', icon: 'icon-wallet'
    });

    const formatCurrency = (amount) => new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onAdd({ ...formData, balance: parseFloat(formData.balance) });
        resetForm();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await onUpdate(editingId, { ...formData, balance: parseFloat(formData.balance) });
        resetForm();
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', type: 'cash', balance: '', icon: 'icon-wallet' });
    };

    const handleEdit = (acc) => {
        setFormData({
            name: acc.name,
            type: acc.type,
            balance: acc.balance,
            icon: acc.icon || 'icon-wallet'
        });
        setEditingId(acc.id);
        setIsAdding(true);
    };

    const accountTypes = [
        { id: 'cash', label: 'নগদ', icon: 'icon-banknote' },
        { id: 'bank', label: 'ব্যাংক', icon: 'icon-landmark' },
        { id: 'mobile', label: 'মোবাইল ব্যাংকিং', icon: 'icon-smartphone' },
        { id: 'card', label: 'ক্রেডিট কার্ড', icon: 'icon-credit-card' },
    ];

    const totalBalance = data.accounts.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0);

    return (
        <div className="space-y-6 animate-fade-in" data-name="accounts">
            <div className="card bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <p className="text-blue-100 text-sm">সর্বমোট ব্যালেন্স</p>
                <h2 className="text-4xl font-bold mt-1">{formatCurrency(totalBalance)}</h2>
                <p className="text-xs text-blue-100 mt-2">সকল অ্যাকাউন্টের যোগফল</p>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="icon-wallet text-blue-600"></div>
                    অ্যাকাউন্ট তালিকা
                </h2>
                <button onClick={() => setIsAdding(true)} className="btn btn-primary bg-blue-600 hover:bg-blue-700">
                    <div className="icon-plus"></div> যুক্ত করুন
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 sm:p-8 animate-scale-in">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'অ্যাকাউন্ট আপডেট' : 'নতুন অ্যাকাউন্ট'}</h3>
                        <form onSubmit={editingId ? handleUpdate : handleSubmit} className="space-y-4">
                            <input type="text" placeholder="অ্যাকাউন্টের নাম (যেমন: বিকাশ, মানিব্যাগ)" className="input-field" required 
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {accountTypes.map(type => (
                                    <div 
                                        key={type.id}
                                        onClick={() => setFormData({...formData, type: type.id, icon: type.icon})}
                                        className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2 ${formData.type === type.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}
                                    >
                                        <div className={type.icon}></div>
                                        <span className="text-sm font-medium">{type.label}</span>
                                    </div>
                                ))}
                            </div>

                            <input type="number" placeholder="বর্তমান ব্যালেন্স" className="input-field" required 
                                value={formData.balance} onChange={e => setFormData({...formData, balance: e.target.value})} />
                            
                            <div className="flex gap-2 mt-6">
                                <button type="submit" className="flex-1 btn btn-primary bg-blue-600 hover:bg-blue-700 justify-center">সংরক্ষণ</button>
                                <button type="button" onClick={resetForm} className="flex-1 btn btn-ghost justify-center bg-gray-100">বাতিল</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
                {data.accounts.map(acc => (
                    <SwipeableItem
                        key={acc.id}
                        onSwipeLeft={() => onDelete(acc.id)}
                        onSwipeRight={() => handleEdit(acc)}
                        className="rounded-3xl border border-gray-100 shadow-sm"
                    >
                        <div className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                                    acc.type === 'cash' ? 'bg-green-100 text-green-600' :
                                    acc.type === 'mobile' ? 'bg-pink-100 text-pink-600' :
                                    acc.type === 'card' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                    <div className={acc.icon}></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{acc.name}</h4>
                                    <span className="text-xs text-gray-500 uppercase">{acc.type}</span>
                                </div>
                            </div>
                            <div className="font-bold text-lg text-gray-800">
                                {formatCurrency(acc.balance)}
                            </div>
                        </div>
                    </SwipeableItem>
                ))}
            </div>
        </div>
    );
}