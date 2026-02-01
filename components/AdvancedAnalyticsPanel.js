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
    return budgets.map(budget => {
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
    <div className="space-y-6 p-8 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl font-[Hind Siliguri]">
      
      {/* ট্যাব নেভিগেশন */}
      <div className="flex gap-1 p-1 bg-white rounded-3xl shadow-lg border border-gray-200 overflow-x-auto">
        {['analytics', 'alerts', 'forecast', 'investments'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-black transition-all whitespace-nowrap rounded-2xl active:scale-90 ${
              activeTab === tab
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
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
        <div className="space-y-6">
          <h2 className="text-4xl font-black text-gray-900">📊 মাসিক বিশ্লেষণ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* আয় কার্ড */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
              <p className="text-base font-bold text-gray-600 mb-2">মোট আয়</p>
              <p className="text-4xl font-black text-green-600">৳ {currentMonthData.income}</p>
            </div>

            {/* ব্যয় কার্ড */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
              <p className="text-base font-bold text-gray-600 mb-2">মোট ব্যয়</p>
              <p className="text-4xl font-black text-red-600">৳ {currentMonthData.expenses}</p>
            </div>

            {/* সঞ্চয় কার্ড */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
              <p className="text-base font-bold text-gray-600 mb-2">নিট সঞ্চয়</p>
              <p className="text-4xl font-black text-blue-600">৳ {currentMonthData.savings}</p>
            </div>

            {/* সঞ্চয় হার */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
              <p className="text-base font-bold text-gray-600 mb-2">সঞ্চয় হার</p>
              <p className="text-4xl font-black text-emerald-600">{currentMonthData.savingsRate}%</p>
            </div>
          </div>

          {/* ব্যয় বিতরণ */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
            <h3 className="text-3xl font-black mb-6">বিভাগভিত্তিক ব্যয়</h3>
            <div className="space-y-3">
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
                  <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                    <span className="text-lg font-bold text-gray-700">{item.category}</span>
                    <span className="text-2xl font-black text-gray-900">৳ {item.amount}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* সতর্কতা ট্যাব */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <h2 className="text-4xl font-black text-gray-900">🔔 বাজেট সতর্কতা</h2>
          <div className="space-y-4">
            {budgetAlerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl border-4 shadow-lg ${
                  alert.status === 'danger'
                    ? 'bg-red-50 border-red-400'
                    : alert.status === 'warning'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-black text-gray-900">{alert.category}</p>
                    <p className="text-lg font-bold text-gray-600 mt-2">
                      ৳{alert.spent} / ৳{alert.limit} ({alert.percentage}%)
                    </p>
                  </div>
                  <div className="w-20 h-20 relative">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
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
                    <p className="absolute inset-0 flex items-center justify-center text-base font-black">
                      {alert.percentage}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* পূর্বাভাস ট্যাব */}
      {activeTab === 'forecast' && (
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 space-y-6">
          <h3 className="text-4xl font-black">🔮 পরবর্তী মাসের পূর্বাভাস</h3>
          <p className="text-xl font-bold text-gray-600">
            গত ৩ মাসের গড়ের ভিত্তিতে, পরবর্তী মাসে আপনার ব্যয় হবে:
          </p>
          <p className="text-4xl font-black text-blue-600">
            ৳ {Math.round(
              monthComparison.current
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
          <p className="text-lg font-bold text-gray-700 bg-blue-50 p-6 rounded-3xl border border-blue-200">
            💡 এই পূর্বাভাস ঐতিহাসিক ডেটার উপর ভিত্তি করে তৈরি। বাস্তব ব্যয় ভিন্ন হতে পারে।
          </p>
        </div>
      )}

      {/* বিনিয়োগ ট্যাব */}
      {activeTab === 'investments' && investments && investments.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-4xl font-black">💼 বিনিয়োগ সারাংশ</h2>
          <div className="space-y-4">
            {investments.map((inv, idx) => {
              const profit = inv.currentValue - inv.investedAmount;
              const returnPct = (profit / inv.investedAmount * 100).toFixed(2);
              return (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-black text-gray-900">{inv.name}</p>
                      <p className="text-lg font-bold text-gray-600 mt-2">
                        বিনিয়োগ: ৳{inv.investedAmount}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-black ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit > 0 ? '+' : ''}৳{profit}
                      </p>
                      <p className="text-xl font-bold mt-1">{returnPct}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
