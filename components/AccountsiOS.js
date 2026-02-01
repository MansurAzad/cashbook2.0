function Accounts({ data, onAdd, onUpdate, onDelete }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '', type: 'cash', balance: '0', currency: 'BDT'
    });

    const formatCurrency = (amount) => new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await onUpdate(editingId, { ...formData, balance: parseFloat(formData.balance) });
        } else {
            await onAdd({ ...formData, balance: parseFloat(formData.balance) });
        }
        resetForm();
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', type: 'cash', balance: '0', currency: 'BDT' });
    };

    const handleEdit = (account) => {
        setFormData(account);
        setEditingId(account.id);
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        await onDelete(id);
        setShowDeleteConfirm(null);
    };

    const accountTypes = [
        { id: 'cash', name: '💰 নগদ', color: 'emerald' },
        { id: 'savings', name: '🏦 সঞ্চয়', color: 'blue' },
        { id: 'checking', name: '💳 চেকিং', color: 'purple' },
        { id: 'credit', name: '💳 ক্রেডিট', color: 'orange' },
        { id: 'investment', name: '📈 বিনিয়োগ', color: 'pink' }
    ];

    const getTypeLabel = (type) => {
        const found = accountTypes.find(t => t.id === type);
        return found ? found.name : type;
    };

    const getTypeColor = (type) => {
        const found = accountTypes.find(t => t.id === type);
        return found ? found.color : 'gray';
    };

    const totalBalance = (data.accounts || []).reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);

    return (
        <div className="px-4 sm:px-6 pb-10 space-y-4 sm:space-y-6 animate-fade-in" data-name="accounts">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-gray-900">অ্যাকাউন্ট</h1>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-2xl hover:bg-blue-600 shadow-lg"
                >
                    +
                </button>
            </div>

            {/* Total Balance Card */}
            {data.accounts && data.accounts.length > 0 && (
                <iOSGradientCard gradientFrom="from-gray-900" gradientTo="to-black" interactive={false}>
                    <p className="text-gray-400 text-xs font-bold mb-2 uppercase">মোট ব্যালেন্স</p>
                    <h2 className="text-4xl font-black text-white">{formatCurrency(totalBalance)}</h2>
                    <p className="text-gray-500 text-xs mt-3">সকল অ্যাকাউন্ট</p>
                </iOSGradientCard>
            )}

            {/* Add/Edit Modal */}
            {isAdding && (
                <iOSSheet isOpen={true} title={editingId ? "অ্যাকাউন্ট সম্পাদন করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"} onClose={resetForm}>
                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">অ্যাকাউন্ট নাম</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-0 font-medium"
                                placeholder="যেমন: আমার মূল অ্যাকাউন্ট"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">অ্যাকাউন্ট টাইপ</label>
                            <select 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-0 font-medium"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                            >
                                {accountTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">প্রাথমিক ব্যালেন্স</label>
                            <input 
                                type="number"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-0 font-medium"
                                placeholder="0.00"
                                value={formData.balance}
                                onChange={e => setFormData({...formData, balance: e.target.value})}
                                required
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

            {/* Accounts List */}
            {!data.accounts || data.accounts.length === 0 ? (
                <iOSEmptyState 
                    icon="🏦" 
                    title="কোন অ্যাকাউন্ট নেই" 
                    description="আপনার প্রথম অ্যাকাউন্ট তৈরি করুন"
                    action={
                        <iOSFilledButton 
                            color="blue"
                            onClick={() => setIsAdding(true)}
                        >
                            প্রথম অ্যাকাউন্ট তৈরি করুন
                        </iOSFilledButton>
                    }
                />
            ) : (
                <div className="space-y-3">
                    {(data.accounts || []).map(account => {
                        const colorMap = {
                            'emerald': 'bg-emerald-50 border-emerald-200',
                            'blue': 'bg-blue-50 border-blue-200',
                            'purple': 'bg-purple-50 border-purple-200',
                            'orange': 'bg-orange-50 border-orange-200',
                            'pink': 'bg-pink-50 border-pink-200',
                            'gray': 'bg-gray-50 border-gray-200'
                        };

                        const textColorMap = {
                            'emerald': 'text-emerald-700',
                            'blue': 'text-blue-700',
                            'purple': 'text-purple-700',
                            'orange': 'text-orange-700',
                            'pink': 'text-pink-700',
                            'gray': 'text-gray-700'
                        };

                        const typeColor = getTypeColor(account.type);

                        return (
                            <iOSCard key={account.id} padded={false}>
                                <div className={`px-6 py-4 space-y-3 border-l-4 ${colorMap[typeColor]}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-lg">{account.name}</h4>
                                            <p className={`text-xs font-medium ${textColorMap[typeColor]}`}>{getTypeLabel(account.type)}</p>
                                        </div>
                                        <h3 className={`text-2xl font-black ${textColorMap[typeColor]}`}>{formatCurrency(account.balance)}</h3>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEdit(account)}
                                            className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-200"
                                        >
                                            ✏️ সম্পাদন
                                        </button>
                                        <button 
                                            onClick={() => setShowDeleteConfirm(account.id)}
                                            className="flex-1 py-2 bg-red-100 text-red-700 rounded-xl font-bold text-sm hover:bg-red-200"
                                        >
                                            🗑️ মুছুন
                                        </button>
                                    </div>
                                </div>
                            </iOSCard>
                        );
                    })}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <iOSSheet 
                    isOpen={true} 
                    title="অ্যাকাউন্ট মুছুন?" 
                    onClose={() => setShowDeleteConfirm(null)}
                >
                    <div className="p-4 space-y-4">
                        <p className="text-gray-600 text-center">এই অ্যাকাউন্টটি মুছে দিতে চান? এর সকল লেনদেন মুছে যাবে।</p>
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
