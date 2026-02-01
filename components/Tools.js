function Tools() {
    const [activeTool, setActiveTool] = React.useState('menu');
    const [data, setData] = React.useState(JSON.parse(localStorage.getItem('bk_app_data')) || {
        transactions: [],
        budgets: {},
        bills: [],
        goals: [],
        accounts: [],
        loans: [],
        investments: [],
        recurringTransactions: [],
        mobilePayments: [],
        budgetPlans: []
    });

    const tools = [
        { id: 'emi', label: 'EMI ক্যালকুলেটর', icon: 'icon-calculator', color: 'from-blue-900 to-blue-700' },
        { id: 'shopping', label: 'শপিং লিস্ট', icon: 'icon-shopping-cart', color: 'from-emerald-900 to-emerald-700' },
        { id: 'challenge', label: '৫২ সপ্তাহ সঞ্চয়', icon: 'icon-trophy', color: 'from-purple-900 to-purple-700' },
        { id: 'advanced', label: 'উন্নত সরঞ্জাম', icon: 'icon-settings', color: 'from-orange-900 to-orange-700' },
        { id: 'predictive', label: 'পূর্বাভাস', icon: 'icon-bar-chart-2', color: 'from-indigo-900 to-indigo-700' },
        { id: 'recurring', label: 'পুনরাবৃত্ত', icon: 'icon-repeat', color: 'from-pink-900 to-pink-700' },
        { id: 'mobile', label: 'ডিজিটাল পেমেন্ট', icon: 'icon-smartphone', color: 'from-cyan-900 to-cyan-700' },
        { id: 'budget', label: 'বাজেট পরিকল্পনা', icon: 'icon-target', color: 'from-lime-900 to-lime-700' },
    ];

    if (activeTool === 'menu') {
        return (
            <div className="space-y-6 animate-fade-in pb-10" data-name="tools">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-6">
                    <h2 className="text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
                        <div className="icon-wrench text-3xl text-emerald-600"></div>
                        টুলস ও ইউটিলিটি
                    </h2>
                    <p className="text-base text-gray-600 font-bold">আপনার আর্থিক ব্যবস্থাপনা সহজ করার জন্য শক্তিশালী সরঞ্জাম</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            onClick={() => setActiveTool(tool.id)}
                            className={`bg-gradient-to-br ${tool.color} rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-all active:scale-95 border border-opacity-20 border-white group`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-5xl font-black opacity-80 group-hover:opacity-100 transition-opacity">
                                    <div className={tool.icon}></div>
                                </div>
                                <div className="text-3xl opacity-20">→</div>
                            </div>
                            <h3 className="font-black text-xl text-left mb-2 group-hover:text-white transition-colors">{tool.label}</h3>
                            <p className="text-sm opacity-90 text-left">ট্যাপ করুন শুরু করতে</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-10">
            <button 
                onClick={() => setActiveTool('menu')} 
                className="mb-6 flex items-center gap-3 text-emerald-600 hover:text-emerald-700 font-black text-lg p-4 bg-white rounded-2xl shadow-sm border border-gray-200 active:scale-95 transition-all"
            >
                <div className="icon-arrow-left text-xl"></div> ফিরে যান
            </button>
            {activeTool === 'emi' && <EMICalculator />}
            {activeTool === 'shopping' && <ShoppingList />}
            {activeTool === 'challenge' && <SavingsChallenge />}
            {activeTool === 'advanced' && <AdvancedTools data={data} setData={setData} />}
            {activeTool === 'predictive' && <PredictiveAnalytics transactions={data.transactions || []} budgets={data.budgets || {}} />}
            {activeTool === 'recurring' && <RecurringTransactionManager data={data} setData={setData} />}
            {activeTool === 'mobile' && <MobilePaymentIntegration data={data} setData={setData} />}
            {activeTool === 'budget' && <SmartBudgetPlanning data={data} setData={setData} />}
        </div>
    );
}

function EMICalculator() {
    const [loanAmount, setLoanAmount] = React.useState('');
    const [interestRate, setInterestRate] = React.useState('');
    const [tenure, setTenure] = React.useState('');
    const [result, setResult] = React.useState(null);

    const calculate = () => {
        const principal = parseFloat(loanAmount);
        const rate = parseFloat(interestRate) / 12 / 100;
        const time = parseFloat(tenure);
        
        if (principal && rate && time) {
            const emi = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
            const totalPayment = emi * time;
            setResult({
                emi: emi.toFixed(2),
                total: totalPayment.toFixed(2),
                interest: (totalPayment - principal).toFixed(2)
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl p-8 text-white shadow-2xl border border-blue-700">
                <h3 className="text-3xl font-black mb-3 flex items-center gap-3">
                    <div className="icon-calculator text-4xl"></div> EMI ক্যালকুলেটর
                </h3>
                <p className="text-base opacity-90">আপনার ঋণের মাসিক কিস্তি হিসাব করুন</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 space-y-6">
                <div>
                    <label className="block text-base font-black text-gray-900 mb-3">ঋণের পরিমাণ (৳)</label>
                    <div className="relative">
                        <span className="absolute left-5 top-4 text-2xl font-black text-gray-900">৳</span>
                        <input 
                            type="number" 
                            className="input-field text-3xl font-black py-5 pl-12 rounded-2xl w-full border border-gray-300"
                            placeholder="০"
                            value={loanAmount}
                            onChange={e => setLoanAmount(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-base font-black text-gray-900 mb-3">সুদের হার (% বার্ষিক)</label>
                    <input 
                        type="number" 
                        className="input-field text-2xl font-bold py-4 px-5 rounded-2xl w-full border border-gray-300"
                        placeholder="০"
                        value={interestRate}
                        onChange={e => setInterestRate(e.target.value)}
                        step="0.1"
                    />
                </div>

                <div>
                    <label className="block text-base font-black text-gray-900 mb-3">সময়সীমা (মাস)</label>
                    <input 
                        type="number" 
                        className="input-field text-2xl font-bold py-4 px-5 rounded-2xl w-full border border-gray-300"
                        placeholder="০"
                        value={tenure}
                        onChange={e => setTenure(e.target.value)}
                    />
                </div>

                <button 
                    onClick={calculate} 
                    className="btn btn-primary w-full rounded-2xl py-4 px-6 font-black text-lg active:scale-95"
                >
                    <div className="icon-calculator mr-2"></div> হিসাব করুন
                </button>
                
                {result && (
                    <div className="bg-blue-50 rounded-3xl p-8 border border-blue-200 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 text-lg">মাসিক কিস্তি (EMI)</span>
                            <span className="text-3xl font-black text-blue-600">৳{result.emi}</span>
                        </div>
                        <div className="border-t border-blue-100 pt-4 flex justify-between items-center">
                            <span className="font-bold text-gray-700">মোট সুদ</span>
                            <span className="text-xl font-black text-gray-900">৳{result.interest}</span>
                        </div>
                        <div className="border-t border-blue-100 pt-4 flex justify-between items-center">
                            <span className="font-bold text-gray-700">মোট পরিশোধ</span>
                            <span className="text-2xl font-black text-blue-600">৳{result.total}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ShoppingList() {
    const [items, setItems] = React.useState(DataManager.getShoppingList());
    const [newItem, setNewItem] = React.useState('');

    const addItem = (e) => {
        e.preventDefault();
        if(!newItem) return;
        const updated = [...items, { id: Date.now(), text: newItem, checked: false }];
        setItems(updated);
        DataManager.saveShoppingList(updated);
        setNewItem('');
    };

    const toggleItem = (id) => {
        const updated = items.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
        setItems(updated);
        DataManager.saveShoppingList(updated);
    };

    const deleteItem = (id) => {
        const updated = items.filter(i => i.id !== id);
        setItems(updated);
        DataManager.saveShoppingList(updated);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-3xl p-8 text-white shadow-2xl border border-emerald-700">
                <h3 className="text-3xl font-black mb-3 flex items-center gap-3">
                    <div className="icon-shopping-cart text-4xl"></div> শপিং লিস্ট
                </h3>
                <p className="text-base opacity-90">{items.length} টি আইটেম আপনার লিস্টে</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                <form onSubmit={addItem} className="flex gap-3 mb-6">
                    <input 
                        type="text" 
                        className="input-field flex-1 py-4 px-5 text-base font-bold rounded-2xl border border-gray-300"
                        placeholder="কি কিনতে চান..." 
                        value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="btn btn-primary px-6 rounded-2xl font-black text-lg">
                        <div className="icon-plus"></div>
                    </button>
                </form>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-5xl mb-4">🛒</div>
                            <p className="text-gray-500 font-bold text-lg">লিস্ট খালি</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-200 hover:border-emerald-200 transition-all">
                                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                        item.checked 
                                            ? 'bg-emerald-500 border-emerald-500' 
                                            : 'border-gray-300 bg-white'
                                    }`}>
                                        {item.checked && <div className="icon-check text-white text-sm font-bold"></div>}
                                    </div>
                                    <span className={`text-lg font-bold transition-all ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                        {item.text}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => deleteItem(item.id)}
                                    className="p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors active:scale-90"
                                >
                                    <div className="icon-trash-2 text-red-600 text-lg"></div>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function SavingsChallenge() {
    const challenge = Array.from({ length: 52 }, (_, i) => {
        const week = i + 1;
        const amount = week * 10;
        const totalSaved = (week * (week + 1) / 2) * 10;
        return { week, amount, totalSaved };
    });

    const totalAmount = challenge[51].totalSaved;

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-3xl p-8 text-white shadow-2xl border border-purple-700">
                <h3 className="text-3xl font-black mb-4 flex items-center gap-3">
                    <div className="icon-trophy text-4xl"></div> ৫২ সপ্তাহের সঞ্চয়
                </h3>
                <div className="bg-purple-800/50 rounded-2xl p-6 backdrop-blur-sm">
                    <p className="text-lg opacity-90 mb-4 font-bold">প্রতি সপ্তাহে ১০ টাকা করে বৃদ্ধি পেলে আপনি পাবেন</p>
                    <p className="text-5xl font-black text-yellow-300">৳{totalAmount.toLocaleString('bn-BD')}</p>
                    <p className="text-sm opacity-75 mt-2">১ বছরের শেষে</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                    {challenge.map(({ week, amount, totalSaved }) => (
                        <div key={week} className="p-5 bg-purple-50 rounded-2xl border border-purple-200 hover:border-purple-300 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-black text-gray-900 text-lg">সপ্তাহ {week}</span>
                                <div className="text-2xl">📅</div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-600 font-bold">এই সপ্তাহের সঞ্চয়</p>
                                <p className="text-2xl font-black text-purple-600">৳{amount}</p>
                            </div>
                            <div className="border-t border-purple-200 mt-3 pt-3">
                                <p className="text-xs text-gray-500 font-bold mb-1">মোট সঞ্চিত</p>
                                <p className="font-black text-gray-900">৳{totalSaved.toLocaleString('bn-BD')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
