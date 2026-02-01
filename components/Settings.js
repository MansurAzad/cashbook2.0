function Settings({ data, onAddCategory, onDeleteCategory, settings, updateSettings, notify }) {
    const [activeTab, setActiveTab] = React.useState('general');
    const [newCatName, setNewCatName] = React.useState('');
    const [newCatType, setNewCatType] = React.useState('expense');
    const [newCatIcon, setNewCatIcon] = React.useState('icon-circle');
    const [pinInput, setPinInput] = React.useState('');

    const handleAdd = async (e) => {
        e.preventDefault();
        if(!newCatName) return;
        await onAddCategory({
            name: newCatName,
            type: newCatType,
            icon: newCatIcon,
            color: '#6366F1'
        });
        setNewCatName('');
    };

    const downloadCSV = () => {
        const headers = ["Date", "Type", "Category", "Amount", "Note"];
        const rows = data.transactions.map(t => [
            t.date,
            t.type,
            t.category,
            t.amount,
            `"${t.note || ''}"`
        ]);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions_export.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        notify('CSV ফাইল ডাউনলোড শুরু হয়েছে');
    };
    
    const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "transaction_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        notify('ব্যাকআপ ডাউনলোড শুরু হয়েছে');
    };

    const handleSetPin = () => {
        if(pinInput.length !== 4) return notify('৪ ডিজিটের পিন দিন', 'error');
        updateSettings({ ...settings, pinLock: pinInput });
        setPinInput('');
        notify('পিন সেট করা হয়েছে');
    };

    const handleRemovePin = () => {
        updateSettings({ ...settings, pinLock: null });
        notify('পিন রিমুভ করা হয়েছে');
    };

    const handleReset = () => {
        if(confirm('সতর্কতা: এটি আপনার সমস্ত ডাটা মুছে ফেলবে! আপনি কি নিশ্চিত?')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const icons = [
        'icon-home', 'icon-utensils', 'icon-bus', 'icon-shopping-bag', 
        'icon-heart-pulse', 'icon-graduation-cap', 'icon-zap', 'icon-wifi',
        'icon-gamepad-2', 'icon-briefcase', 'icon-banknote', 'icon-gift',
        'icon-monitor', 'icon-smartphone', 'icon-plane', 'icon-music'
    ];

    const currencies = [
        { code: 'BDT', symbol: '৳', name: 'বাংলাদেশী টাকা' },
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-10" data-name="settings">
            {/* ট্যাব নেভিগেশন */}
            <div className="bg-white rounded-3xl p-1 shadow-lg border border-gray-200 flex gap-1 overflow-x-auto">
                {[
                    { id: 'general', label: 'সাধারণ', icon: 'icon-settings' },
                    { id: 'categories', label: 'ক্যাটাগরি', icon: 'icon-tag' },
                    { id: 'data', label: 'ডাটা', icon: 'icon-database' },
                    { id: 'security', label: 'সুরক্ষা', icon: 'icon-lock' }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-5 py-3 rounded-2xl font-black transition-all active:scale-90 whitespace-nowrap flex items-center justify-center gap-2 ${
                            activeTab === tab.id 
                                ? 'bg-emerald-500 text-white shadow-lg' 
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <div className={tab.icon}></div>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* সাধারণ সেটিংস */}
            {activeTab === 'general' && (
                <div className="space-y-5">
                    {/* প্রাইভেসি মোড */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
                                    <div className="icon-eye-off"></div>
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-gray-900">প্রাইভেসি মোড</h3>
                                    <p className="text-sm text-gray-600 font-bold">টাকার পরিমাণ লুকান</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={settings.privacyMode}
                                    onChange={(e) => updateSettings({ ...settings, privacyMode: e.target.checked })}
                                />
                                <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* কারেন্সি সেটিংস */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                                <div className="icon-coins"></div>
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-gray-900">কারেন্সি সেটিংস</h3>
                                <p className="text-sm text-gray-600 font-bold">ডিফল্ট মুদ্রা নির্বাচন করুন</p>
                            </div>
                        </div>
                        <select 
                            className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                            value={settings.currency}
                            onChange={(e) => updateSettings({ ...settings, currency: e.target.value })}
                        >
                            {currencies.map(c => (
                                <option key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* হ্যাপটিক ফিডব্যাক */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">
                                    <div className="icon-zap"></div>
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-gray-900">হ্যাপটিক ফিডব্যাক</h3>
                                    <p className="text-sm text-gray-600 font-bold">কর্ম সম্পাদনে কম্পন</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={settings.enableHaptic}
                                    onChange={(e) => updateSettings({ ...settings, enableHaptic: e.target.checked })}
                                />
                                <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* থিম কালার */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-2xl">
                                <div className="icon-palette"></div>
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-gray-900">থিম কালার</h3>
                                <p className="text-sm text-gray-600 font-bold">আপনার পছন্দের রঙ নির্বাচন করুন</p>
                            </div>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            {[
                                { color: '#10B981', name: 'Emerald' },
                                { color: '#3B82F6', name: 'Blue' },
                                { color: '#8B5CF6', name: 'Purple' },
                                { color: '#EC4899', name: 'Pink' },
                                { color: '#F59E0B', name: 'Amber' }
                            ].map(({ color, name }) => (
                                <button
                                    key={color}
                                    onClick={() => updateSettings({ ...settings, themeColor: color })}
                                    className={`w-14 h-14 rounded-2xl border-4 transition-all active:scale-90 flex items-center justify-center font-black text-white ${
                                        settings.themeColor === color 
                                            ? 'border-gray-900 scale-110' 
                                            : 'border-transparent'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={name}
                                >
                                    {settings.themeColor === color && <div className="icon-check"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* সিকিউরিটি ট্যাব */}
            {activeTab === 'security' && (
                <div className="max-w-md mx-auto animate-fade-in">
                    <div className={`rounded-3xl p-8 shadow-lg border ${
                        settings.pinLock 
                            ? 'bg-emerald-50 border-emerald-200' 
                            : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                                settings.pinLock
                                    ? 'bg-emerald-200 text-emerald-700'
                                    : 'bg-red-100 text-red-600'
                            }`}>
                                <div className="icon-lock"></div>
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-gray-900">অ্যাপ লক (পিন)</h3>
                                <p className="text-sm text-gray-600 font-bold">আপনার অ্যাপ সুরক্ষিত করুন</p>
                            </div>
                        </div>
                        
                        {settings.pinLock ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-emerald-700 font-black bg-emerald-100 p-4 rounded-2xl">
                                    <div className="icon-circle-check text-xl"></div>
                                    <span>পিন লক সক্রিয়</span>
                                </div>
                                <button 
                                    onClick={handleRemovePin} 
                                    className="w-full btn bg-red-500 text-white hover:bg-red-600 rounded-2xl py-4 px-6 font-black text-lg active:scale-95"
                                >
                                    <div className="icon-trash-2"></div> পিন রিমুভ করুন
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-gray-700 font-bold">অ্যাপ খোলার জন্য ৪ সংখ্যার পিন সেট করুন</p>
                                <input 
                                    type="password" 
                                    inputMode="numeric"
                                    placeholder="• • • •" 
                                    className="input-field text-center text-3xl tracking-[1.5em] py-4 rounded-2xl border border-gray-300 font-black"
                                    maxLength="4"
                                    value={pinInput}
                                    onChange={e => setPinInput(e.target.value.slice(0, 4))}
                                />
                                <button 
                                    onClick={handleSetPin} 
                                    className="w-full btn btn-primary rounded-2xl py-4 px-6 font-black text-lg active:scale-95"
                                    disabled={pinInput.length !== 4}
                                >
                                    <div className="icon-lock-open"></div> পিন সেট করুন
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ক্যাটাগরি ট্যাব */}
            {activeTab === 'categories' && (
                <div className="space-y-6 animate-fade-in">
                    {/* নতুন ক্যাটাগরি ফর্ম */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <div className="icon-plus text-emerald-600"></div> নতুন ক্যাটাগরি যোগ করুন
                        </h3>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">নাম</label>
                                <input 
                                    type="text" 
                                    className="input-field w-full py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                                    placeholder="যেমন: জিম, ইন্টারনেট"
                                    value={newCatName}
                                    onChange={e => setNewCatName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">ধরন</label>
                                <div className="flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setNewCatType('income')}
                                        className={`flex-1 py-4 px-5 rounded-2xl font-black transition-all active:scale-90 ${
                                            newCatType === 'income' 
                                                ? 'bg-emerald-500 text-white shadow-lg' 
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        <div className="icon-arrow-down-left mr-2 inline"></div> আয়
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setNewCatType('expense')}
                                        className={`flex-1 py-4 px-5 rounded-2xl font-black transition-all active:scale-90 ${
                                            newCatType === 'expense' 
                                                ? 'bg-red-500 text-white shadow-lg' 
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        <div className="icon-arrow-up-right mr-2 inline"></div> ব্যয়
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-4">আইকন নির্বাচন করুন</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {icons.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setNewCatIcon(icon)}
                                            className={`p-4 rounded-2xl text-2xl transition-all active:scale-90 ${
                                                newCatIcon === icon 
                                                    ? 'bg-gray-900 text-white shadow-lg scale-110' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <div className={icon}></div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full btn btn-primary rounded-2xl py-4 px-6 font-black text-lg active:scale-95">
                                <div className="icon-plus mr-2 inline"></div> ক্যাটাগরি যোগ করুন
                            </button>
                        </form>
                    </div>

                    {/* আয়ের ক্যাটাগরি */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                        <h3 className="text-xl font-black text-emerald-600 mb-6 flex items-center gap-3">
                            <div className="icon-arrow-down-left"></div> আয়ের ক্যাটাগরি
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.categories.income.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center text-xl text-emerald-700 font-black">
                                            <div className={cat.icon || 'icon-circle'}></div>
                                        </div>
                                        <span className="font-black text-gray-900">{cat.name}</span>
                                    </div>
                                    {!cat.id.startsWith('default') && (
                                        <button 
                                            onClick={() => onDeleteCategory(cat.id)}
                                            className="p-3 hover:bg-red-100 rounded-xl transition-colors active:scale-90"
                                        >
                                            <div className="icon-trash-2 text-red-600 text-lg"></div>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ব্যয়ের ক্যাটাগরি */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                        <h3 className="text-xl font-black text-red-600 mb-6 flex items-center gap-3">
                            <div className="icon-arrow-up-right"></div> ব্যয়ের ক্যাটাগরি
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.categories.expense.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-5 bg-red-50 rounded-2xl border border-red-200">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center text-xl text-red-700 font-black">
                                            <div className={cat.icon || 'icon-circle'}></div>
                                        </div>
                                        <span className="font-black text-gray-900">{cat.name}</span>
                                    </div>
                                    {!cat.id.startsWith('default') && (
                                        <button 
                                            onClick={() => onDeleteCategory(cat.id)}
                                            className="p-3 hover:bg-red-100 rounded-xl transition-colors active:scale-90"
                                        >
                                            <div className="icon-trash-2 text-red-600 text-lg"></div>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ডাটা ট্যাব */}
            {activeTab === 'data' && (
                <div className="space-y-5 animate-fade-in">
                    {/* ব্যাকআপ */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                                <div className="icon-download"></div>
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-gray-900">ব্যাকআপ (JSON)</h3>
                                <p className="text-sm text-gray-600 font-bold">সম্পূর্ণ ডাটা সংরক্ষণ করুন</p>
                            </div>
                        </div>
                        <p className="text-gray-700 font-bold mb-6">আপনার সমস্ত ডাটা JSON ফরমেটে ডাউনলোড করুন এবং পরবর্তীতে রিস্টোর করুন।</p>
                        <button 
                            onClick={downloadJSON}
                            className="w-full btn btn-primary rounded-2xl py-4 px-6 font-black text-lg active:scale-95"
                        >
                            <div className="icon-download mr-2 inline"></div> ব্যাকআপ ডাউনলোড করুন
                        </button>
                    </div>

                    {/* এক্সপোর্ট */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                                <div className="icon-file-spreadsheet"></div>
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-gray-900">এক্সপোর্ট (CSV)</h3>
                                <p className="text-sm text-gray-600 font-bold">Excel বা স্প্রেডশিটে ব্যবহার করুন</p>
                            </div>
                        </div>
                        <p className="text-gray-700 font-bold mb-6">সমস্ত লেনদেনের তালিকা CSV ফরমেটে এক্সপোর্ট করুন যা Excel-এ খুলতে পারবেন।</p>
                        <button 
                            onClick={downloadCSV}
                            className="w-full btn bg-green-500 text-white hover:bg-green-600 rounded-2xl py-4 px-6 font-black text-lg active:scale-95"
                        >
                            <div className="icon-file-spreadsheet mr-2 inline"></div> CSV এক্সপোর্ট করুন
                        </button>
                    </div>

                    {/* ডেঞ্জার জোন */}
                    <div className="bg-red-50 rounded-3xl p-8 shadow-lg border border-red-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-red-200 flex items-center justify-center text-2xl">
                                <div className="icon-triangle-alert"></div>
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-red-700">ডেঞ্জার জোন</h3>
                                <p className="text-sm text-red-600 font-bold">বিপদজনক অ্যাকশন</p>
                            </div>
                        </div>
                        <p className="text-red-700 font-bold mb-6">⚠️ সমস্ত ডাটা চিরতরে মুছে ফেলবে। এটি উল্টানো যাবে না।</p>
                        <button 
                            onClick={handleReset}
                            className="w-full btn bg-red-600 text-white hover:bg-red-700 rounded-2xl py-4 px-6 font-black text-lg active:scale-95"
                        >
                            <div className="icon-triangle-alert mr-2 inline"></div> অ্যাপ সম্পূর্ণ রিসেট করুন
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
