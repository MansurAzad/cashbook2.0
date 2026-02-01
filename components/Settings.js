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
        notify('CSV ফাইল ডাউনলোড শুরু হয়েছে');
    };
    
    const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "transaction_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        notify('ব্যাকআপ ডাউনলোড শুরু হয়েছে');
    };

    const handleSetPin = () => {
        if(pinInput.length !== 4) return notify('৪ ডিজিটের পিন দিন', 'error');
        updateSettings({ ...settings, pinLock: pinInput });
        setPinInput('');
        notify('পিন সেট করা হয়েছে');
    };

    const handleRemovePin = () => {
        updateSettings({ ...settings, pinLock: null });
        notify('পিন রিমুভ করা হয়েছে');
    };

    const handleReset = () => {
        if(confirm('সতর্কতা: এটি আপনার লোকাল স্টোরেজের সমস্ত ডাটা মুছে ফেলবে! আপনি কি নিশ্চিত?')) {
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
        <div className="space-y-6 animate-fade-in" data-name="settings">
            <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                {['general', 'categories', 'data', 'security'].map(tab => (
                    <button 
                        key={tab}
                        className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap capitalize ${
                            activeTab === tab 
                            ? 'border-emerald-500 text-emerald-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'general' ? 'সাধারণ' : tab === 'categories' ? 'ক্যাটাগরি' : tab === 'data' ? 'ডাটা' : 'সুরক্ষা'}
                    </button>
                ))}
            </div>

            {activeTab === 'general' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="card">
                        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                            <div className="icon-eye-off text-emerald-600"></div>
                            প্রাইভেসি মোড
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">টাকার পরিমাণ লুকান</p>
                                <p className="text-xs text-gray-500">অন করলে ড্যাশবোর্ডের সব এমাউন্ট ব্লার হয়ে যাবে</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={settings.privacyMode}
                                    onChange={(e) => updateSettings({ ...settings, privacyMode: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                            <div className="icon-coins text-emerald-600"></div>
                            কারেন্সি সেটিংস
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ডিফল্ট কারেন্সি</label>
                            <select 
                                className="input-field"
                                value={settings.currency}
                                onChange={(e) => updateSettings({ ...settings, currency: e.target.value })}
                            >
                                {currencies.map(c => (
                                    <option key={c.code} value={c.code}>{c.symbol} - {c.name} ({c.code})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                            <div className="icon-smartphone text-emerald-600"></div>
                            হ্যাপটিক ফিডব্যাক
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">ভাইব্রেশন অন/অফ</p>
                                <p className="text-xs text-gray-500">বাটনে ক্লিক করলে ভাইব্রেট হবে</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={settings.enableHaptic}
                                    onChange={(e) => updateSettings({ ...settings, enableHaptic: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                            <div className="icon-palette text-emerald-600"></div>
                            থিম কালার
                        </h3>
                        <div className="flex gap-3">
                            {['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => updateSettings({ ...settings, themeColor: color })}
                                    className={`w-8 h-8 rounded-full border-2 ${settings.themeColor === color ? 'border-gray-600 scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="card max-w-md">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                        <div className="icon-lock text-red-500"></div>
                        অ্যাপ লক (পিন)
                    </h3>
                    
                    {settings.pinLock ? (
                        <div className="space-y-4">
                            <p className="text-green-600 font-medium flex items-center gap-2">
                                <div className="icon-circle-check"></div> পিন লক সক্রিয় আছে
                            </p>
                            <button onClick={handleRemovePin} className="btn bg-red-100 text-red-600 w-full justify-center">
                                পিন রিমুভ করুন
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-600 text-sm">অ্যাপ ওপেন করার জন্য ৪ সংখ্যার পিন সেট করুন।</p>
                            <input 
                                type="number" 
                                placeholder="১২৩৪" 
                                className="input-field text-center text-xl tracking-widest" 
                                maxLength="4"
                                value={pinInput}
                                onChange={e => setPinInput(e.target.value.slice(0, 4))}
                            />
                            <button onClick={handleSetPin} className="btn btn-primary w-full justify-center">
                                পিন সেট করুন
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {/* Add New Category */}
                    <div className="sm:col-span-1 lg:col-span-1">
                        <div className="card sticky top-6">
                            <h3 className="font-bold text-lg text-gray-800 mb-4">নতুন ক্যাটাগরি</h3>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        placeholder="উদাঃ জিম, ইন্টারনেট"
                                        value={newCatName}
                                        onChange={e => setNewCatName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ধরন</label>
                                    <div className="flex gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setNewCatType('income')}
                                            className={`flex-1 py-2 px-3 rounded-lg border text-sm ${
                                                newCatType === 'income' 
                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                                                : 'border-gray-200'
                                            }`}
                                        >
                                            আয়
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setNewCatType('expense')}
                                            className={`flex-1 py-2 px-3 rounded-lg border text-sm ${
                                                newCatType === 'expense' 
                                                ? 'bg-red-50 border-red-500 text-red-700' 
                                                : 'border-gray-200'
                                            }`}
                                        >
                                            ব্যয়
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">আইকন</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {icons.map(icon => (
                                            <div 
                                                key={icon}
                                                onClick={() => setNewCatIcon(icon)}
                                                className={`p-2 rounded-lg cursor-pointer flex items-center justify-center transition-all ${
                                                    newCatIcon === icon 
                                                    ? 'bg-gray-800 text-white shadow-md scale-110' 
                                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                }`}
                                            >
                                                <div className={`${icon} text-lg`}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-full justify-center">
                                    যোগ করুন
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Category List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h4 className="font-bold text-emerald-600 mb-3 flex items-center gap-2">
                                <div className="icon-arrow-down-left"></div> আয়ের ক্যাটাগরি
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                {data.categories.income.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                <div className={cat.icon || 'icon-circle'}></div>
                                            </div>
                                            <span className="font-medium text-gray-700">{cat.name}</span>
                                        </div>
                                        {!cat.id.startsWith('default') && (
                                            <button 
                                                onClick={() => onDeleteCategory(cat.id)}
                                                className="text-gray-400 hover:text-red-500 p-2"
                                            >
                                                <div className="icon-trash-2 text-sm"></div>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-red-600 mb-3 flex items-center gap-2">
                                <div className="icon-arrow-up-right"></div> ব্যয়ের ক্যাটাগরি
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                {data.categories.expense.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                                                <div className={cat.icon || 'icon-circle'}></div>
                                            </div>
                                            <span className="font-medium text-gray-700">{cat.name}</span>
                                        </div>
                                        {!cat.id.startsWith('default') && (
                                            <button 
                                                onClick={() => onDeleteCategory(cat.id)}
                                                className="text-gray-400 hover:text-red-500 p-2"
                                            >
                                                <div className="icon-trash-2 text-sm"></div>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'data' && (
                <div className="space-y-4">
                    <div className="card">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">ব্যাকআপ (JSON)</h3>
                        <p className="text-gray-600 mb-6">আপনার সকল ডাটা JSON ফরমেটে ডাউনলোড করুন। পরবর্তীতে এটি রিস্টোর করা যাবে।</p>
                        <button 
                            onClick={downloadJSON}
                            className="btn btn-ghost border border-gray-300"
                        >
                            <div className="icon-download"></div>
                            ব্যাকআপ ডাউনলোড করুন
                        </button>
                    </div>

                    <div className="card">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">এক্সপোর্ট (CSV/Excel)</h3>
                        <p className="text-gray-600 mb-6">অন্যান্য স্প্রেডশিট সফটওয়্যারে ব্যবহারের জন্য CSV ফরমেটে লেনদেনের তালিকা ডাউনলোড করুন।</p>
                        <button 
                            onClick={downloadCSV}
                            className="btn btn-ghost border border-gray-300 text-emerald-700 hover:bg-emerald-50"
                        >
                            <div className="icon-file-spreadsheet"></div>
                            CSV এক্সপোর্ট করুন
                        </button>
                    </div>

                    <div className="card border-red-100 bg-red-50">
                        <h3 className="font-bold text-lg text-red-600 mb-4">ডেঞ্জার জোন</h3>
                        <p className="text-red-500 mb-4">সমস্ত ডাটা মুছে ফেলে অ্যাপ রিসেট করুন। এই কাজটি আর ফিরিয়ে আনা যাবে না।</p>
                        <button 
                            onClick={handleReset}
                            className="btn bg-red-600 text-white hover:bg-red-700 w-full justify-center"
                        >
                            <div className="icon-triangle-alert"></div>
                            অ্যাপ রিসেট করুন
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}