function Reports({ data }) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    
    React.useEffect(() => {
        const incomeCtx = document.getElementById('incomeReportChart').getContext('2d');
        const expenseCtx = document.getElementById('expenseReportChart').getContext('2d');

        const processData = (type) => {
            const grouped = data.transactions
                .filter(t => t.type === type && t.date.startsWith(currentMonth))
                .reduce((acc, curr) => {
                    acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
                    return acc;
                }, {});
            return {
                labels: Object.keys(grouped),
                data: Object.values(grouped)
            };
        };

        const incomeData = processData('income');
        const expenseData = processData('expense');

        const incomeChart = new ChartJS(incomeCtx, {
            type: 'bar',
            data: {
                labels: incomeData.labels,
                datasets: [{
                    label: 'আয় (টাকা)',
                    data: incomeData.data,
                    backgroundColor: '#10B981',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        const expenseChart = new ChartJS(expenseCtx, {
            type: 'bar',
            data: {
                labels: expenseData.labels,
                datasets: [{
                    label: 'ব্যয় (টাকা)',
                    data: expenseData.data,
                    backgroundColor: '#EF4444',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        return () => {
            incomeChart.destroy();
            expenseChart.destroy();
        };
    }, [data, currentMonth]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
    };

    const monthTotal = data.transactions
        .filter(t => t.date.startsWith(currentMonth))
        .reduce((acc, curr) => {
            if (curr.type === 'income') acc.income += parseFloat(curr.amount);
            else acc.expense += parseFloat(curr.amount);
            return acc;
        }, { income: 0, expense: 0 });

    return (
        <div className="space-y-6" data-name="reports">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <div className="icon-calendar"></div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">মাসিক রিপোর্ট</h2>
                </div>
                <input 
                    type="month" 
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(e.target.value)}
                    className="border-gray-300 rounded-lg text-gray-800 font-medium focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">আয়ের উৎসসমূহ</h3>
                        <span className="text-emerald-600 font-bold">{formatCurrency(monthTotal.income)}</span>
                    </div>
                    <div className="h-64 relative">
                        <canvas id="incomeReportChart"></canvas>
                    </div>
                </div>
                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">খরচের খাতসমূহ</h3>
                        <span className="text-red-600 font-bold">{formatCurrency(monthTotal.expense)}</span>
                    </div>
                    <div className="h-64 relative">
                        <canvas id="expenseReportChart"></canvas>
                    </div>
                </div>
            </div>
            
            <div className="card bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">সারসংক্ষেপ</h2>
                        <p className="opacity-90">
                            এই মাসে আপনার মোট সঞ্চয় {formatCurrency(monthTotal.income - monthTotal.expense)} 
                            ({monthTotal.income > 0 ? Math.round(((monthTotal.income - monthTotal.expense)/monthTotal.income)*100) : 0}%)
                        </p>
                    </div>
                    <button 
                        className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-gray-50 transition-colors"
                        onClick={() => window.print()}
                    >
                        রিপোর্ট প্রিন্ট করুন
                    </button>
                </div>
            </div>
        </div>
    );
}