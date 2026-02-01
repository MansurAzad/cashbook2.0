// স্মার্ট পূর্বাভাস এবং অন্তর্দৃষ্টি বিশ্লেষণ

const PredictiveAnalytics = ({ transactions, budgets }) => {
  const [predictions, setPredictions] = React.useState(null);
  const [insights, setInsights] = React.useState([]);

  React.useEffect(() => {
    generatePredictions();
    generateInsights();
  }, [transactions]);

  const generatePredictions = () => {
    if (transactions.length === 0) return;

    // গত ৩ মাসের খরচ বিশ্লেষণ
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    
    const recentTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= threeMonthsAgo && t.type === 'expense';
    });

    if (recentTransactions.length === 0) return;

    // গড় মাসিক খরচ
    const monthlyAverages = {};
    recentTransactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyAverages[monthKey] = (monthlyAverages[monthKey] || 0) + t.amount;
    });

    const avgMonthly = Object.values(monthlyAverages).reduce((a, b) => a + b, 0) / Object.keys(monthlyAverages).length;

    // পরবর্তী মাসের পূর্বাভাস
    const nextMonthExpected = avgMonthly * 1.05; // ৫% বৃদ্ধি ধরে

    // বিভাগ-ভিত্তিক পূর্বাভাস
    const categoryForecasts = {};
    recentTransactions.forEach(t => {
      if (!categoryForecasts[t.category]) {
        categoryForecasts[t.category] = [];
      }
      categoryForecasts[t.category].push(t.amount);
    });

    const categoryPredictions = {};
    Object.keys(categoryForecasts).forEach(cat => {
      const amounts = categoryForecasts[cat];
      const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const trend = amounts.length > 1 ? amounts[amounts.length - 1] / amounts[0] : 1;
      categoryPredictions[cat] = {
        predicted: Math.round(avg * 1.05),
        trend: (((trend - 1) * 100).toFixed(1))
      };
    });

    setPredictions({
      nextMonthExpected: Math.round(nextMonthExpected),
      avgMonthly: Math.round(avgMonthly),
      categoryPredictions,
      growthRate: ((((nextMonthExpected / avgMonthly) - 1) * 100).toFixed(1))
    });
  };

  const generateInsights = () => {
    const newInsights = [];
    
    // ইনসাইট ১: সর্বোচ্চ খরচের বিভাগ
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length > 0) {
      const categories = {};
      expenses.forEach(e => {
        categories[e.category] = (categories[e.category] || 0) + e.amount;
      });
      
      const topCategory = Object.entries(categories).reduce((a, b) => a[1] > b[1] ? a : b);
      newInsights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'সর্বোচ্চ খরচ বিভাগ',
        message: `${topCategory[0]} বিভাগে সবচেয়ে বেশি খরচ হচ্ছে (৳${topCategory[1].toLocaleString('bn-BD')})`
      });
    }

    // ইনসাইট ২: বাজেট অতিক্রম
    Object.keys(budgets).forEach(category => {
      const budget = budgets[category];
      const spent = transactions
        .filter(t => t.category === category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      if (spent > budget.amount) {
        newInsights.push({
          type: 'error',
          icon: '🚨',
          title: 'বাজেট অতিক্রম',
          message: `${category}: ৳${(spent - budget.amount).toLocaleString('bn-BD')} অতিরিক্ত খরচ`
        });
      } else if (spent > budget.amount * 0.8) {
        newInsights.push({
          type: 'info',
          icon: '💡',
          title: 'বাজেত সতর্কতা',
          message: `${category}: বাজেটের ৮০% ব্যবহার হয়েছে`
        });
      }
    });

    // ইনসাইট ৩: সঞ্চয়ের হার
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (totalIncome > 0) {
      const savingsRate = ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1);
      if (savingsRate < 20) {
        newInsights.push({
          type: 'warning',
          icon: '📉',
          title: 'কম সঞ্চয়',
          message: `আপনার সঞ্চয়ের হার ${savingsRate}% (লক্ষ্য: ২০%)`
        });
      } else {
        newInsights.push({
          type: 'success',
          icon: '📈',
          title: 'ভালো সঞ্চয়',
          message: `আপনার সঞ্চয়ের হার ${savingsRate}%`
        });
      }
    }

    setInsights(newInsights);
  };

  return (
    <div className="space-y-6 font-[Hind Siliguri]">
      {/* পূর্বাভাস কার্ড */}
      {predictions && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8 rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-black mb-4">📊 পরবর্তী মাসের পূর্বাভাস</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white bg-opacity-20 p-6 rounded-2xl">
              <p className="text-sm opacity-90">গড় মাসিক খরচ</p>
              <p className="text-3xl font-black">৳{predictions.avgMonthly.toLocaleString('bn-BD')}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-6 rounded-2xl">
              <p className="text-sm opacity-90">পূর্বাভাসিত খরচ</p>
              <p className="text-3xl font-black">৳{predictions.nextMonthExpected.toLocaleString('bn-BD')}</p>
            </div>
            <div className="col-span-2 bg-white bg-opacity-20 p-6 rounded-2xl">
              <p className="text-sm opacity-90">প্রত্যাশিত বৃদ্ধি</p>
              <p className="text-2xl font-black">{predictions.growthRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* অন্তর্দৃষ্টি তালিকা */}
      <div className="space-y-3">
        <h3 className="font-bold text-xl">💡 গুরুত্বপূর্ণ অন্তর্দৃষ্টি</h3>
        {insights.length === 0 ? (
          <p className="text-gray-500">কোনো বিশেষ অন্তর্দৃষ্টি নেই</p>
        ) : (
          insights.map((insight, idx) => (
            <InsightCard key={idx} {...insight} />
          ))
        )}
      </div>

      {/* বিভাগ-ভিত্তিক পূর্বাভাস */}
      {predictions && Object.keys(predictions.categoryPredictions).length > 0 && (
        <div className="bg-blue-50 p-8 rounded-3xl shadow-lg border border-blue-200">
          <h3 className="font-bold text-lg mb-4">📈 বিভাগ-ভিত্তিক প্রবণতা</h3>
          <div className="space-y-3">
            {Object.entries(predictions.categoryPredictions).map(([cat, pred]) => (
              <div key={cat} className="flex justify-between items-center p-6 bg-white rounded-2xl">
                <div>
                  <p className="font-medium">{cat}</p>
                  <p className="text-sm text-gray-500">পূর্বাভাস: ৳{pred.predicted.toLocaleString('bn-BD')}</p>
                </div>
                <div className={`text-lg font-black ${parseFloat(pred.trend) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {parseFloat(pred.trend) > 0 ? '↑' : '↓'} {Math.abs(pred.trend)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ইনসাইট কার্ড কম্পোনেন্ট
const InsightCard = ({ type, icon, title, message }) => {
  const bgColors = {
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`border-l-4 p-6 rounded-2xl ${bgColors[type]}`}>
      <div className="flex gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-sm text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
};
