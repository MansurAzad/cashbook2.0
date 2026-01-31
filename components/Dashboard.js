function Dashboard({ data, onNavigate, onRefresh }) {
    const { income, expense } = DataManager.calculateTotals(data.transactions);
    const balance = income - expense;
    const financialHealth = DataManager.getFinancialHealth(data);
    const [chartType, setChartType] = React.useState('doughnut'); // doughnut or bar

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
    };

    React.useEffect(() => {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        const expenseByCategory = data.transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => {
                acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
                return acc;
            }, {});

        const chart = new ChartJS(ctx, {
            type: chartType,
            data: {
                labels: Object.keys(expenseByCategory),
                datasets: [{
                    label: 'খরচ',
                    data: Object.values(expenseByCategory),
                    backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'],
                    borderRadius: 4,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', display: chartType === 'doughnut' }
                }
            }
        });

        return () => chart.destroy();
    }, [data, chartType]);

    const handleChartDoubleTap = () => {
        if(navigator.vibrate) navigator.vibrate(50);
        setChartType(prev => prev === 'doughnut' ? 'bar' : 'doughnut');
    };

    return (
        <PullToRefresh onRefresh={onRefresh}>
            <div className="space-y-6 animate-fade-in pb-10" data-name="dashboard">
                {/* Financial Health Widget */}
                <div 
                    className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl active:scale-[0.98] transition-transform duration-200 transform-gpu cursor-pointer"
                    {...GestureHooks.useLongPress(() => alert('Full Health Report: \nNet Worth: ' + financialHealth.netWorth))}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-1 tracking-wider uppercase">নেট ওয়ার্থ</p>
                            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                                {formatCurrency(financialHealth.netWorth)}
                            </h2>
                            <div className="flex gap-4 mt-4">
                                <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <span className="text-xs text-gray-300 mr-2">সেভিংস রেট</span>
                                    <span className="font-bold text-emerald-400">{financialHealth.savingsRate.toFixed(1)}%</span>
                                </div>
                                <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <span className="text-xs text-gray-300 mr-2">হেলথ স্কোর</span>
                                    <span className={`font-bold ${financialHealth.score > 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                        {Math.round(financialHealth.score)}/100
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Stats with iOS style cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div 
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 active:scale-95 transition-transform duration-200 cursor-pointer"
                        onClick={() => onNavigate('transactions', { type: 'income' })}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                <div className="icon-trending-up text-emerald-600"></div>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">মোট আয়</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(income)}</h3>
                    </div>

                    <div 
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 active:scale-95 transition-transform duration-200 cursor-pointer"
                        onClick={() => onNavigate('transactions', { type: 'expense' })}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                <div className="icon-trending-down text-red-600"></div>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">মোট ব্যয়</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(expense)}</h3>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <div className="icon-wallet text-blue-600"></div>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">বর্তমান ক্যাশ</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(balance)}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-gray-800">সাম্প্রতিক</h3>
                            <button 
                                onClick={() => onNavigate('transactions')}
                                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                <div className="icon-arrow-right text-gray-600"></div>
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.transactions.slice(0, 5).map(t => (
                                <div key={t.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer active:scale-[0.98]">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                            t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                            <div className={t.type === 'income' ? 'icon-arrow-down-left' : 'icon-arrow-up-right'}></div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{t.category}</p>
                                            <p className="text-xs text-gray-500 font-medium">{t.date}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                                        {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                    </span>
                                </div>
                            ))}
                            {data.transactions.length === 0 && (
                                 <div className="text-center py-8 text-gray-400">কোন লেনদেন নেই</div>
                            )}
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div 
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden active:scale-[0.99] transition-transform" 
                        onDoubleClick={handleChartDoubleTap}
                    >
                        <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center justify-between">
                            খরচের খাত
                            <div className="icon-ellipsis text-gray-400"></div>
                        </h3>
                        <div className="h-64 relative">
                            <canvas id="expenseChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </PullToRefresh>
    );
}