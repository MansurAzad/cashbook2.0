function Investments({ data, onAdd, onUpdate, onDelete, loading, currencySymbol = '৳' }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [newInvestment, setNewInvestment] = React.useState({
        name: '',
        type: 'stock',
        investedAmount: '',
        currentValue: ''
    });

    const investmentTypes = [
        { id: 'stock', label: 'স্টক', icon: 'icon-trending-up', color: 'blue' },
        { id: 'bond', label: 'বন্ড', icon: 'icon-certificate', color: 'purple' },
        { id: 'mutual', label: 'মিউচুয়াল ফান্ড', icon: 'icon-pie-chart', color: 'amber' },
        { id: 'real-estate', label: 'রিয়েল এস্টেট', icon: 'icon-home', color: 'orange' },
    ];

    const filteredInvestments = data.investments.filter(inv =>
        inv.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 })
            .format(Math.floor(amount))
            .replace('৳', currencySymbol);
    };

    const totalInvested = data.investments.reduce((sum, i) => sum + (parseFloat(i.investedAmount) || 0), 0);
    const totalCurrent = data.investments.reduce((sum, i) => sum + (parseFloat(i.currentValue) || 0), 0);
    const totalProfit = totalCurrent - totalInvested;
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    const handleSave = async (id, investmentData) => {
        try {
            if (!investmentData.name || investmentData.name.trim() === '') {
                alert('দয়া করে বিনিয়োগের নাম দিন');
                return;
            }
            if (!investmentData.investedAmount || parseFloat(investmentData.investedAmount) <= 0) {
                alert('দয়া করে বিনিয়োগের পরিমাণ দিন');
                return;
            }
            
            const payload = {
                ...investmentData,
                investedAmount: parseFloat(investmentData.investedAmount) || 0,
                currentValue: parseFloat(investmentData.currentValue) || parseFloat(investmentData.investedAmount) || 0
            };
            
            if (editingId) {
                await onUpdate(editingId, payload);
            } else {
                await onAdd(payload);
            }
            setIsAdding(false);
            setEditingId(null);
            setNewInvestment({ name: '', type: 'stock', investedAmount: '', currentValue: '' });
        } catch (err) {
            console.error('বিনিয়োগ সংরক্ষণ ত্রুটি:', err);
            alert('বিনিয়োগ সংরক্ষণে ব্যর্থ হয়েছে');
        }
    };

    const getTypeColor = (type) => {
        const typeObj = investmentTypes.find(t => t.id === type);
        return typeObj ? typeObj.color : 'gray';
    };

    const getTypeIcon = (type) => {
        const typeObj = investmentTypes.find(t => t.id === type);
        return typeObj ? typeObj.icon : 'icon-trending-up';
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10" data-name="investments">
            {/* পোর্টফোলিও সারাংশ - সোনা গ্রেডিয়েন্ট */}
            <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 rounded-3xl p-8 text-white shadow-2xl border border-amber-700">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black opacity-90 uppercase tracking-wider">বিনিয়োগ পোর্টফোলিও</h3>
                    <div className="icon-trending-up text-amber-300 text-3xl"></div>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div>
                        <p className="text-xs text-amber-200 font-bold uppercase tracking-wider mb-2">বিনিয়োগ করেছি</p>
                        <p className="text-4xl font-black">{formatCurrency(totalInvested)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-amber-200 font-bold uppercase tracking-wider mb-2">বর্তমান মূল্য</p>
                        <p className="text-4xl font-black text-amber-200">{formatCurrency(totalCurrent)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-amber-200 font-bold uppercase tracking-wider mb-2">মুনাফা</p>
                        <p className={`text-3xl font-black ${totalProfit >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                            {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
                        </p>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-3 font-bold">
                        <span>রিটার্ন {profitPercentage.toFixed(2)}%</span>
                        <span className="text-amber-200">{totalProfit >= 0 ? '📈 লাভ' : '📉 লস'}</span>
                    </div>
                    <div className="w-full bg-amber-700 rounded-full h-4 shadow-lg overflow-hidden">
                        <div 
                            className={`h-4 rounded-full transition-all duration-500 ${
                                profitPercentage >= 10 ? 'bg-emerald-400' :
                                profitPercentage >= 0 ? 'bg-yellow-300' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.abs(profitPercentage) / 10 * 100)}%` }}
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
                        placeholder="বিনিয়োগ খুঁজুন..."
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
                    <div className="icon-plus text-2xl"></div> নতুন বিনিয়োগ যোগ করুন
                </button>
            </div>

            {/* নতুন বিনিয়োগ ফর্ম - iOS শীট */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in border border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black text-gray-900">{editingId ? 'বিনিয়োগ সম্পাদন করুন' : 'নতুন বিনিয়োগ যোগ করুন'}</h3>
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
                            handleSave(editingId, newInvestment);
                        }} className="space-y-6">
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">বিনিয়োগের নাম</label>
                                <input 
                                    type="text"
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    placeholder="যেমন: আইসিআই স্টক"
                                    value={newInvestment.name}
                                    onChange={e => setNewInvestment({...newInvestment, name: e.target.value})}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">ধরনের</label>
                                <select 
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    value={newInvestment.type}
                                    onChange={e => setNewInvestment({...newInvestment, type: e.target.value})}
                                >
                                    {investmentTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">বিনিয়োগের পরিমাণ ({currencySymbol})</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-4 text-2xl font-black text-gray-900">{currencySymbol}</span>
                                    <input 
                                        type="number" 
                                        className="input-field text-3xl font-black py-5 pl-12 rounded-2xl w-full"
                                        placeholder="0"
                                        value={newInvestment.investedAmount}
                                        onChange={e => setNewInvestment({...newInvestment, investedAmount: parseFloat(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">বর্তমান মূল্য ({currencySymbol})</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-4 text-2xl font-black text-gray-900">{currencySymbol}</span>
                                    <input 
                                        type="number" 
                                        className="input-field text-3xl font-black py-5 pl-12 rounded-2xl w-full"
                                        placeholder="0"
                                        value={newInvestment.currentValue}
                                        onChange={e => setNewInvestment({...newInvestment, currentValue: parseFloat(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200">
                                <button 
                                    type="submit"
                                    className="flex-1 btn btn-primary justify-center py-4 px-6 rounded-2xl font-black text-lg active:scale-95"
                                    disabled={!newInvestment.name || !newInvestment.investedAmount || !newInvestment.currentValue || loading}
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

            {/* বিনিয়োগ আইটেম গ্রিড */}
            {filteredInvestments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-3xl flex items-center justify-center">
                        <div className="icon-inbox text-4xl text-amber-600"></div>
                    </div>
                    <p className="text-gray-700 font-bold text-lg">কোন বিনিয়োগ নেই</p>
                    <p className="text-gray-500 text-base mt-2">প্রথম বিনিয়োগ যোগ করতে শুরু করুন</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredInvestments.map(inv => {
                        const profit = inv.currentValue - inv.investedAmount;
                        const profitPct = inv.investedAmount > 0 ? (profit / inv.investedAmount) * 100 : 0;
                        const isProfit = profit >= 0;

                        const colorMap = {
                            blue: 'bg-blue-50 border-blue-200',
                            purple: 'bg-purple-50 border-purple-200',
                            amber: 'bg-amber-50 border-amber-200',
                            orange: 'bg-orange-50 border-orange-200',
                        };

                        const colorClass = colorMap[getTypeColor(inv.type)] || colorMap.blue;

                        return (
                            <div 
                                key={inv.id}
                                className={`rounded-3xl p-8 shadow-lg border transition-all active:scale-95 ${colorClass}`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h4 className="font-black text-lg text-gray-900">{inv.name}</h4>
                                        <p className="text-xs font-bold mt-2 uppercase tracking-wider opacity-75">
                                            {investmentTypes.find(t => t.id === inv.type)?.label || 'বিনিয়োগ'}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black opacity-80">
                                        <div className={getTypeIcon(inv.type)}></div>
                                    </div>
                                </div>

                                <div className="mb-6 space-y-3">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">বিনিয়োগ করেছি</p>
                                        <span className="text-3xl font-black text-gray-900">{formatCurrency(inv.investedAmount)}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">বর্তমান মূল্য</p>
                                        <span className="text-3xl font-black text-gray-900">{formatCurrency(inv.currentValue)}</span>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-2xl ${isProfit ? 'bg-emerald-100' : 'bg-red-100'} mb-6`}>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-lg font-black ${isProfit ? 'text-emerald-700' : 'text-red-700'}`}>
                                            {isProfit ? '+' : ''}{formatCurrency(profit)}
                                        </span>
                                        <span className={`text-lg font-black ${isProfit ? 'text-emerald-700' : 'text-red-700'}`}>
                                            {isProfit ? '📈' : '📉'} {profitPct.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => {
                                            setNewInvestment(inv);
                                            setEditingId(inv.id);
                                            setIsAdding(true);
                                        }}
                                        className="flex-1 py-3 px-4 rounded-2xl font-black transition-all active:scale-90 bg-white/60 hover:bg-white"
                                    >
                                        সম্পাদন করুন
                                    </button>
                                    <button 
                                        onClick={() => onDelete(inv.id)}
                                        className="p-3 bg-white/60 rounded-xl hover:bg-white transition-colors active:scale-90"
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
