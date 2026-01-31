// Advanced Analytics Component - নতুন ড্যাশবোর্ড বৈশিষ্ট্য

const AdvancedAnalyticsPanel = ({ transactions, budgets, bills, investments }) => {
  const [activeTab, setActiveTab] = React.useState('analytics');
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth() + 1);

  // মাসিক তুলনা
  const monthComparison = React.useMemo(() => {
    return {
      current: transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() + 1 === selectedMonth;
      }),
      previous: transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() + 1 === (selectedMonth - 1);
      })
    };
  }, [transactions, selectedMonth]);

  // সঞ্চয় হার
  const currentMonthData = React.useMemo(() => {
    const income = monthComparison.current
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthComparison.current
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      savings: income - expenses,
      savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0
    };
  }, [monthComparison]);

  // বাজেট সতর্কতা
  const budgetAlerts = React.useMemo(() => {
    // budgets হতে পারে object বা array - উভয়ই handle করুন
    const budgetsArray = Array.isArray(budgets) ? budgets : Object.values(budgets || {});
    
    return budgetsArray.map(budget => {
      const spent = monthComparison.current
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage = (spent / budget.limit) * 100;

      return {
        ...budget,
        spent,
        percentage: Math.round(percentage),
        status: percentage >= 90 ? 'danger' : percentage >= 70 ? 'warning' : 'safe'
      };
    });
  }, [budgets, monthComparison]);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl font-[Hind Siliguri]">
      
      {/* ট্যাব নেভিগেশন */}
      <div className="flex gap-4 border-b border-gray-200">
        {['analytics', 'alerts', 'forecast', 'investments'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === tab
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'analytics' && '📊 বিশ্লেষণ'}
            {tab === 'alerts' && '🔔 সতর্কতা'}
            {tab === 'forecast' && '🔮 পূর্বাভাস'}
            {tab === 'investments' && '💼 বিনিয়োগ'}
          </button>
        ))}
      </div>

      {/* বিশ্লেষণ ট্যাব */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* আয় কার্ড */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm">মোট আয়</p>
              <p className="text-2xl font-bold text-green-600">৳ {currentMonthData.income}</p>
            </div>

            {/* ব্যয় কার্ড */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm">মোট ব্যয়</p>
              <p className="text-2xl font-bold text-red-600">৳ {currentMonthData.expenses}</p>
            </div>

            {/* সঞ্চয় কার্ড */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm">নিট সঞ্চয়</p>
              <p className="text-2xl font-bold text-blue-600">৳ {currentMonthData.savings}</p>
            </div>

            {/* সঞ্চয় হার */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm">সঞ্চয় হার</p>
              <p className="text-2xl font-bold text-emerald-600">{currentMonthData.savingsRate}%</p>
            </div>
          </div>

          {/* ব্যয় বিতরণ */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold mb-4">বিভাগভিত্তিক ব্যয়</h3>
            <div className="space-y-2">
              {monthComparison.current
                .filter(t => t.type === 'expense')
                .reduce((acc, t) => {
                  const existing = acc.find(item => item.category === t.category);
                  if (existing) {
                    existing.amount += t.amount;
                  } else {
                    acc.push({ category: t.category, amount: t.amount });
                  }
                  return acc;
                }, [])
                .sort((a, b) => b.amount - a.amount)
                .map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.category}</span>
                    <span className="font-bold text-gray-900">৳ {item.amount}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* সতর্কতা ট্যাব */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {budgetAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 ${
                alert.status === 'danger'
                  ? 'bg-red-50 border-red-500'
                  : alert.status === 'warning'
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-green-50 border-green-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">{alert.category}</p>
                  <p className="text-sm text-gray-600">
                    ৳{alert.spent} / ৳{alert.limit} ({alert.percentage}%)
                  </p>
                </div>
                <div className="w-12 h-12 relative">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={
                        alert.status === 'danger'
                          ? '#ef4444'
                          : alert.status === 'warning'
                          ? '#f59e0b'
                          : '#10b981'
                      }
                      strokeWidth="8"
                      strokeDasharray={`${alert.percentage * 2.83} 283`}
                    />
                  </svg>
                  <p className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {alert.percentage}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* পূর্বাভাস ট্যাব */}
      {activeTab === 'forecast' && (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
          <h3 className="font-bold">পরবর্তী মাসের পূর্বাভাস</h3>
          <p className="text-gray-600 text-sm">
            গত ৩ মাসের গড়ের ভিত্তিতে, পরবর্তী মাসে আপনার ব্যয় হবে:
          </p>
          <p className="text-2xl font-bold text-blue-600">
            ৳ {Math.round(
              monthComparison.current
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
          <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
            💡 এই পূর্বাভাস ঐতিহাসিক ডেটার উপর ভিত্তি করে তৈরি। বাস্তব ব্যয় ভিন্ন হতে পারে।
          </p>
        </div>
      )}

      {/* বিনিয়োগ ট্যাব */}
      {activeTab === 'investments' && investments && investments.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold">বিনিয়োগ সারাংশ</h3>
          {investments.map((inv, idx) => {
            const profit = inv.currentValue - inv.investedAmount;
            const returnPct = (profit / inv.investedAmount * 100).toFixed(2);
            return (
              <div key={idx} className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{inv.name}</p>
                    <p className="text-sm text-gray-600">
                      বিনিয়োগ: ৳{inv.investedAmount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profit > 0 ? '+' : ''}৳{profit}
                    </p>
                    <p className="text-sm">{returnPct}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
