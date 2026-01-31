function Tools({ data = {}, setData = () => {} }) {
    const [activeTool, setActiveTool] = React.useState('menu');
    const [localData, setLocalData] = React.useState(data || {
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

    // Update localData when data prop changes
    React.useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setLocalData(data);
        }
    }, [data]);

    const tools = [
        { id: 'emi', label: 'EMI ক্যালকুলেটর', icon: 'icon-calculator', color: 'bg-blue-500' },
        { id: 'shopping', label: 'শপিং লিস্ট', icon: 'icon-shopping-cart', color: 'bg-emerald-500' },
        { id: 'challenge', label: '৫২ সপ্তাহের সঞ্চয়', icon: 'icon-trophy', color: 'bg-purple-500' },
        { id: 'advanced', label: 'উন্নত সরঞ্জাম', icon: '🛠️', color: 'bg-orange-500' },
        { id: 'predictive', label: 'পূর্বাভাস', icon: '📊', color: 'bg-indigo-500' },
        { id: 'recurring', label: 'পুনরাবৃত্ত', icon: '🔄', color: 'bg-pink-500' },
        { id: 'mobile', label: 'ডিজিটাল পেমেন্ট', icon: '💳', color: 'bg-cyan-500' },
        { id: 'budget', label: 'বাজেট পরিকল্পনা', icon: '🎯', color: 'bg-lime-500' },
        { id: 'billing', label: 'বিল ম্যানেজমেন্ট', icon: '📋', color: 'bg-red-500' },
        { id: 'networth', label: 'নেট ওয়ার্থ', icon: '💰', color: 'bg-yellow-500' },
    ];

    if (activeTool === 'menu') {
        return (
            <div className="space-y-6 animate-fade-in" data-name="tools">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="icon-wrench text-gray-600"></div>
                    টুলস ও ইউটিলিটি
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {tools.map(tool => (
                        <div 
                            key={tool.id} 
                            onClick={() => setActiveTool(tool.id)}
                            className="card flex flex-col items-center justify-center gap-3 hover:shadow-md cursor-pointer transition-all active:scale-95"
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl ${tool.color}`}>
                                <div className={tool.icon}></div>
                            </div>
                            <span className="font-bold text-gray-700 text-center">{tool.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <button onClick={() => setActiveTool('menu')} className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
                <div className="icon-arrow-left"></div> ফিরে যান
            </button>
            {activeTool === 'emi' && <EMICalculator />}
            {activeTool === 'shopping' && <ShoppingList />}
            {activeTool === 'challenge' && <SavingsChallenge />}
            {activeTool === 'advanced' && <AdvancedTools data={localData} setData={(newData) => { setLocalData(newData); setData(newData); }} />}
            {activeTool === 'predictive' && <PredictiveAnalytics transactions={localData.transactions || []} budgets={localData.budgets || {}} />}
            {activeTool === 'recurring' && <RecurringTransactionManager data={localData} setData={(newData) => { setLocalData(newData); setData(newData); }} />}
            {activeTool === 'mobile' && <MobilePaymentIntegration data={localData} setData={(newData) => { setLocalData(newData); setData(newData); }} />}
            {activeTool === 'budget' && <SmartBudgetPlanning data={localData} setData={(newData) => { setLocalData(newData); setData(newData); }} />}
            {activeTool === 'billing' && <SmartBillingSystem data={localData} setData={(newData) => { setLocalData(newData); setData(newData); }} />}
            {activeTool === 'networth' && <NetWorthTracker data={localData} setData={(newData) => { setLocalData(newData); setData(newData); }} />}
        </div>
    );
}

function EMICalculator() {
    const [loanAmount, setLoanAmount] = React.useState('');
    const [interestRate, setInterestRate] = React.useState('');
    const [tenure, setTenure] = React.useState(''); // months
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
        <div className="card max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="icon-calculator text-blue-500"></div> EMI ক্যালকুলেটর
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ঋণের পরিমাণ</label>
                    <input type="number" className="input-field" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">সুদের হার (%)</label>
                    <input type="number" className="input-field" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">সময়সীমা (মাস)</label>
                    <input type="number" className="input-field" value={tenure} onChange={e => setTenure(e.target.value)} />
                </div>
                <button onClick={calculate} className="btn btn-primary w-full justify-center">হিসাব করুন</button>
                
                {result && (
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg space-y-2 border border-blue-100">
                        <div className="flex justify-between font-bold text-blue-900">
                            <span>মাসিক কিস্তি (EMI)</span>
                            <span>{result.emi}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>মোট সুদ</span>
                            <span>{result.interest}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 border-t border-blue-200 pt-2">
                            <span>মোট পরিশোধ</span>
                            <span>{result.total}</span>
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

    const convertToExpense = async (item) => {
        const amount = prompt(`'${item.text}' এর জন্য কত টাকা খরচ হয়েছে?`);
        if (amount) {
            const expenseData = {
                type: 'expense',
                amount: parseFloat(amount),
                category: 'শপিং',
                note: `Shopping List: ${item.text}`,
                date: new Date().toISOString().split('T')[0]
            };
            await DataManager.addTransaction(expenseData);
            alert('লেনদেনে যুক্ত হয়েছে!');
            toggleItem(item.id); // Check it off
        }
    };

    return (
        <div className="card max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="icon-shopping-cart text-emerald-500"></div> শপিং লিস্ট
            </h3>
            <form onSubmit={addItem} className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    className="input-field" 
                    placeholder="কি কিনতে চান..." 
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                />
                <button type="submit" className="btn btn-primary"><div className="icon-plus"></div></button>
            </form>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleItem(item.id)}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400 bg-white'}`}>
                                {item.checked && <div className="icon-check text-white text-xs"></div>}
                            </div>
                            <span className={item.checked ? 'line-through text-gray-400' : 'text-gray-800'}>{item.text}</span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => convertToExpense(item)}
                                className="text-gray-400 hover:text-emerald-600 p-1"
                                title="খরচ হিসেবে যুক্ত করুন"
                            >
                                <div className="icon-banknote text-sm"></div>
                            </button>
                            <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                                <div className="icon-x text-sm"></div>
                            </button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="text-center text-gray-400 py-4">লিস্ট খালি</p>}
            </div>
        </div>
    );
}

function SavingsChallenge() {
    return (
        <div className="card max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="icon-trophy text-purple-500"></div> ৫২ সপ্তাহের সঞ্চয়
            </h3>
            <div className="bg-purple-50 p-4 rounded-lg mb-4 text-purple-900 text-sm">
                প্রতি সপ্তাহে ১০ টাকা করে বাড়িয়ে জমালে ১ বছরে আপনার সঞ্চয় হবে <strong>১৩,৭৮০ টাকা!</strong>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {Array.from({ length: 52 }, (_, i) => {
                    const week = i + 1;
                    const amount = week * 10;
                    return (
                        <div key={week} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0">
                            <span className="text-gray-600">সপ্তাহ {week}</span>
                            <span className="font-bold text-purple-600">{amount} টাকা</span>
                            <input type="checkbox" className="w-5 h-5 accent-purple-600" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}