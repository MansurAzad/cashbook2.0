function Reports({ data, currencySymbol = '৳' }) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date().toISOString().slice(0, 7));

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 })
            .format(Math.floor(amount))
            .replace('৳', currencySymbol);
    };

    const monthlyData = data.transactions.filter(t => t.date.startsWith(currentMonth));
    
    const incomeByCategory = monthlyData
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

    const expenseByCategory = monthlyData
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

    const totalIncome = Object.values(incomeByCategory).reduce((a, b) => a + b, 0);
    const totalExpense = Object.values(expenseByCategory).reduce((a, b) => a + b, 0);
    const netAmount = totalIncome - totalExpense;

    React.useEffect(() => {
        // Income Chart
        const incomeCtx = document.getElementById('incomeReportChart');
        if (incomeCtx) {
            if (window.incomeChart) window.incomeChart.destroy();
            window.incomeChart = new ChartJS(incomeCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(incomeByCategory),
                    datasets: [{
                        data: Object.values(incomeByCategory),
                        backgroundColor: ['#10B981', '#06B6D4', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'],
                        borderColor: 'white',
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { font: { size: 12, weight: 'bold' }, padding: 16 }
                        }
                    }
                }
            });
        }

        // Expense Chart
        const expenseCtx = document.getElementById('expenseReportChart');
        if (expenseCtx) {
            if (window.expenseChart) window.expenseChart.destroy();
            window.expenseChart = new ChartJS(expenseCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(expenseByCategory),
                    datasets: [{
                        data: Object.values(expenseByCategory),
                        backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#D97706', '#DC2626', '#C2410C'],
                        borderColor: 'white',
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { font: { size: 12, weight: 'bold' }, padding: 16 }
                        }
                    }
                }
            });
        }
    }, [currentMonth, data]);

    return (
        <div className="space-y-6 animate-fade-in pb-10" data-name="reports">
            {/* মাস নির্বাচন এবং সারাংশ */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-8 flex-col sm:flex-row gap-6">
                    <div className="flex items-center gap-5 flex-1">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-bold shadow-lg flex-shrink-0">📊</div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">রিপোর্ট মাস</p>
                            <input 
                                type="month" 
                                value={currentMonth}
                                onChange={(e) => setCurrentMonth(e.target.value)}
                                className="border-none bg-transparent font-black text-3xl text-gray-900 focus:ring-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* মোট সারাংশ কার্ড - স্লেট গ্রেডিয়েন্ট */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h3 className="text-base sm:text-lg font-black opacity-90 uppercase tracking-wider">এই মাসের সারাংশ</h3>
                    <div className="icon-bar-chart-2 text-slate-300 text-2xl sm:text-3xl"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-slate-800/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                        <p className="text-xs sm:text-xs text-slate-200 font-bold uppercase tracking-wider mb-2">মোট আয়</p>
                        <p className="text-2xl sm:text-3xl font-black text-emerald-300 break-words line-clamp-2">{formatCurrency(totalIncome)}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                        <p className="text-xs sm:text-xs text-slate-200 font-bold uppercase tracking-wider mb-2">মোট ব্যয়</p>
                        <p className="text-2xl sm:text-3xl font-black text-red-300 break-words line-clamp-2">{formatCurrency(totalExpense)}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                        <p className="text-xs sm:text-xs text-slate-200 font-bold uppercase tracking-wider mb-2">নেট রাশি</p>
                        <p className={`text-2xl sm:text-3xl font-black break-words line-clamp-2 ${netAmount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {formatCurrency(netAmount)}
                        </p>
                    </div>
                </div>
            </div>

            {/* আয় চার্ট */}
            {Object.keys(incomeByCategory).length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl font-black text-emerald-600">📈</div>
                        <h3 className="text-2xl font-black text-gray-900">আয়ের বিশ্লেষণ</h3>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <canvas id="incomeReportChart" height="300"></canvas>
                    </div>
                </div>
            )}

            {/* ব্যয় চার্ট */}
            {Object.keys(expenseByCategory).length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-xl font-black text-red-600">📉</div>
                        <h3 className="text-2xl font-black text-gray-900">ব্যয়ের বিশ্লেষণ</h3>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <canvas id="expenseReportChart" height="300"></canvas>
                    </div>
                </div>
            )}

            {/* বিস্তারিত তালিকা */}
            {Object.keys(incomeByCategory).length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-black text-gray-900 mb-6">আয়ের বিস্তারিত</h3>
                    <div className="space-y-4">
                        {Object.entries(incomeByCategory).map(([category, amount]) => (
                            <div key={category} className="flex items-center justify-between p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-200 flex items-center justify-center font-bold text-emerald-700">💰</div>
                                    <div>
                                        <p className="font-black text-gray-900">{category}</p>
                                        <p className="text-xs text-gray-500 font-bold">আয়ের উৎস</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-emerald-600">{formatCurrency(amount)}</p>
                                    <p className="text-xs text-emerald-600 font-bold">
                                        {((amount / totalIncome) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* খরচের বিস্তারিত তালিকা */}
            {Object.keys(expenseByCategory).length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-black text-gray-900 mb-6">ব্যয়ের বিস্তারিত</h3>
                    <div className="space-y-4">
                        {Object.entries(expenseByCategory).map(([category, amount]) => (
                            <div key={category} className="flex items-center justify-between p-5 bg-red-50 rounded-2xl border border-red-200">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-xl bg-red-200 flex items-center justify-center font-bold text-red-700">💸</div>
                                    <div>
                                        <p className="font-black text-gray-900">{category}</p>
                                        <p className="text-xs text-gray-500 font-bold">খরচের বিভাগ</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-red-600">{formatCurrency(amount)}</p>
                                    <p className="text-xs text-red-600 font-bold">
                                        {((amount / totalExpense) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* খালি অবস্থা */}
            {monthlyData.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-3xl flex items-center justify-center">
                        <div className="icon-inbox text-4xl text-slate-600"></div>
                    </div>
                    <p className="text-gray-700 font-bold text-lg">এই মাসে কোন লেনদেন নেই</p>
                    <p className="text-gray-500 text-base mt-2">অন্য মাস নির্বাচন করুন</p>
                </div>
            )}
        </div>
    );
}
