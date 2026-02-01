function Accounts({ data, onSave, onDelete, loading, currencySymbol = '৳' }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [newAccount, setNewAccount] = React.useState({
        name: '',
        type: 'cash',
        balance: '0'
    });

    const filteredAccounts = data.accounts.filter(acc =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' })
            .format(amount)
            .replace('৳', currencySymbol);
    };

    const accountTypes = [
        { id: 'cash', label: 'নগদ', icon: 'icon-banknote', color: 'orange' },
        { id: 'bank', label: 'ব্যাংক', icon: 'icon-landmark', color: 'blue' },
        { id: 'mobile', label: 'মোবাইল ব্যাংকিং', icon: 'icon-smartphone', color: 'green' },
        { id: 'card', label: 'ক্রেডিট কার্ড', icon: 'icon-credit-card', color: 'purple' },
    ];

    const totalBalance = data.accounts.reduce((sum, a) => sum + a.balance, 0);
    const activeAccounts = data.accounts.length;

    const handleSave = async (id, accountData) => {
        await onSave(accountData, id);
        setIsAdding(false);
        setEditingId(null);
        setNewAccount({ name: '', type: 'cash', balance: '0' });
    };

    const getAccountColor = (type) => {
        const typeObj = accountTypes.find(t => t.id === type);
        return typeObj ? typeObj.color : 'gray';
    };

    const getAccountIcon = (type) => {
        const typeObj = accountTypes.find(t => t.id === type);
        return typeObj ? typeObj.icon : 'icon-wallet';
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10" data-name="accounts">
            {/* প্রিমিয়াম মোট কার্ড - ইন্ডিগো গ্রেডিয়েন্ট */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-8 text-white shadow-2xl border border-indigo-700">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black opacity-90 uppercase tracking-wider">মোট ভারসাম্য</h3>
                    <div className="icon-wallet text-indigo-300 text-3xl"></div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider mb-2">মোট টাকা</p>
                        <p className="text-4xl font-black">{formatCurrency(totalBalance)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider mb-2">অ্যাকাউন্ট</p>
                        <p className="text-4xl font-black text-indigo-200">{activeAccounts}</p>
                    </div>
                    <div>
                        <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider mb-2">গড় ব্যালেন্স</p>
                        <p className="text-3xl font-black text-blue-300">{formatCurrency(activeAccounts > 0 ? totalBalance / activeAccounts : 0)}</p>
                    </div>
                </div>
            </div>

            {/* সার্চ এবং অ্যাকশন */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 space-y-4">
                <div className="relative">
                    <div className="icon-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></div>
                    <input 
                        type="text"
                        placeholder="অ্যাকাউন্ট খুঁজুন..."
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
                    <div className="icon-plus text-2xl"></div> নতুন অ্যাকাউন্ট যোগ করুন
                </button>
            </div>

            {/* নতুন অ্যাকাউন্ট ফর্ম - iOS শীট */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in border border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black text-gray-900">{editingId ? 'অ্যাকাউন্ট সম্পাদন করুন' : 'নতুন অ্যাকাউন্ট যোগ করুন'}</h3>
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
                            handleSave(editingId, newAccount);
                        }} className="space-y-6">
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">অ্যাকাউন্টের নাম</label>
                                <input 
                                    type="text"
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    placeholder="যেমন: আমার সঞ্চয় অ্যাকাউন্ট"
                                    value={newAccount.name}
                                    onChange={e => setNewAccount({...newAccount, name: e.target.value})}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">অ্যাকাউন্টের ধরন</label>
                                <select 
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    value={newAccount.type}
                                    onChange={e => setNewAccount({...newAccount, type: e.target.value})}
                                >
                                    {accountTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">শুরুর ব্যালেন্স ({currencySymbol})</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-4 text-2xl font-black text-gray-900">{currencySymbol}</span>
                                    <input 
                                        type="number" 
                                        className="input-field text-3xl font-black py-5 pl-12 rounded-2xl w-full"
                                        placeholder="0"
                                        value={newAccount.balance}
                                        onChange={e => setNewAccount({...newAccount, balance: parseFloat(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200">
                                <button 
                                    type="submit"
                                    className="flex-1 btn btn-primary justify-center py-4 px-6 rounded-2xl font-black text-lg active:scale-95"
                                    disabled={!newAccount.name || loading}
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

            {/* অ্যাকাউন্ট আইটেম গ্রিড */}
            {filteredAccounts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-3xl flex items-center justify-center">
                        <div className="icon-inbox text-4xl text-indigo-600"></div>
                    </div>
                    <p className="text-gray-700 font-bold text-lg">কোন অ্যাকাউন্ট নেই</p>
                    <p className="text-gray-500 text-base mt-2">প্রথম অ্যাকাউন্ট তৈরি করতে শুরু করুন</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAccounts.map(account => {
                        const colorMap = {
                            orange: 'bg-orange-100 text-orange-700 border-orange-200',
                            blue: 'bg-blue-100 text-blue-700 border-blue-200',
                            green: 'bg-green-100 text-green-700 border-green-200',
                            purple: 'bg-purple-100 text-purple-700 border-purple-200',
                        };

                        const colorClass = colorMap[getAccountColor(account.type)] || colorMap.gray;

                        return (
                            <div 
                                key={account.id}
                                className={`rounded-3xl p-8 shadow-lg border transition-all active:scale-95 ${colorClass}`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h4 className="font-black text-lg">{account.name}</h4>
                                        <p className="text-xs font-bold mt-2 uppercase tracking-wider opacity-75">
                                            {accountTypes.find(t => t.id === account.type)?.label || 'অ্যাকাউন্ট'}
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black opacity-80`}>
                                        <div className={getAccountIcon(account.type)}></div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-2">ব্যালেন্স</p>
                                    <span className="text-4xl font-black">{formatCurrency(account.balance)}</span>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => {
                                            setNewAccount(account);
                                            setEditingId(account.id);
                                            setIsAdding(true);
                                        }}
                                        className="flex-1 py-3 px-4 rounded-2xl font-black transition-all active:scale-90 bg-white/70 hover:bg-white/100"
                                    >
                                        সম্পাদন করুন
                                    </button>
                                    <button 
                                        onClick={() => onDelete(account.id)}
                                        className="p-3 bg-white/70 rounded-xl hover:bg-white/100 transition-colors active:scale-90"
                                    >
                                        <div className="icon-trash-2 text-lg opacity-75"></div>
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
