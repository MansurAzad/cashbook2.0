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
                    borderRadius: 12,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'right', 
                        display: chartType === 'doughnut',
                        labels: {
                            font: { size: 14, weight: '600' },
                            padding: 15,
                            usePointStyle: true
                        }
                    }
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
                {/* Financial Health Widget - Premium iOS Style */}
                <div 
                    className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white shadow-2xl active:scale-[0.98] transition-transform duration-200 transform-gpu cursor-pointer border border-gray-800"
                    {...GestureHooks.useLongPress(() => alert('সম্পূর্ণ স্বাস্থ্য প্রতিবেদন: \nনেট ওয়ার্থ: ' + formatCurrency(financialHealth.netWorth)))}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-gray-400 text-xs font-bold mb-2 tracking-widest uppercase">নেট ওয়ার্থ</p>
                            <h2 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 mb-6">
                                {formatCurrency(financialHealth.netWorth)}
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/15 transition-colors">
                                    <span className="text-xs text-gray-300 mr-2 font-semibold">সেভিংস রেট</span>
                                    <span className="font-bold text-emerald-400 text-base">{financialHealth.savingsRate.toFixed(1)}%</span>
                                </div>
                                <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/15 transition-colors">
                                    <span className="text-xs text-gray-300 mr-2 font-semibold">হেলথ স্কোর</span>
                                    <span className={`font-bold text-base ${financialHealth.score > 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                        {Math.round(financialHealth.score)}/100
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Stats with iOS style cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                        className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 active:scale-95 transition-all duration-200 cursor-pointer hover:shadow-xl"
                        onClick={() => onNavigate('transactions', { type: 'income' })}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shadow-md">
                                <div className="icon-trending-up text-emerald-600 text-2xl"></div>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">মোট আয়</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900">{formatCurrency(income)}</h3>
                    </div>

                    <div 
                        className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 active:scale-95 transition-all duration-200 cursor-pointer hover:shadow-xl"
                        onClick={() => onNavigate('transactions', { type: 'expense' })}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shadow-md">
                                <div className="icon-trending-down text-red-600 text-2xl"></div>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">মোট ব্যয়</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900">{formatCurrency(expense)}</h3>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shadow-md">
                                <div className="icon-wallet text-blue-600 text-2xl"></div>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">বর্তমান ক্যাশ</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900">{formatCurrency(balance)}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-2xl text-gray-900">সাম্প্রতিক</h3>
                            <button 
                                onClick={() => onNavigate('transactions')}
                                className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all active:scale-90 shadow-sm"
                            >
                                <div className="icon-arrow-right text-gray-700 text-lg"></div>
                            </button>
                        </div>
                        <div className="space-y-3">
                            {data.transactions.slice(0, 5).map(t => (
                                <div key={t.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer active:scale-[0.98] border border-transparent hover:border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
                                            t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                            <div className={t.type === 'income' ? 'icon-arrow-down-left' : 'icon-arrow-up-right'}></div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-base">{t.category}</p>
                                            <p className="text-xs text-gray-500 font-semibold">{t.date}</p>
                                        </div>
                                    </div>
                                    <span className={`font-black text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                                        {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                    </span>
                                </div>
                            ))}
                            {data.transactions.length === 0 && (
                                 <div className="text-center py-12 text-gray-400 font-semibold">কোন লেনদেন নেই</div>
                            )}
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div 
                        className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 relative overflow-hidden active:scale-[0.99] transition-transform" 
                        onDoubleClick={handleChartDoubleTap}
                    >
                        <h3 className="font-black text-2xl text-gray-900 mb-6 flex items-center justify-between">
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