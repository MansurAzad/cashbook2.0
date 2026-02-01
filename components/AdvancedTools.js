// Advanced Tools Component - সমস্ত নতুন সরঞ্জাম এক জায়গায়

const AdvancedTools = ({ data, setData }) => {
  const [activeTab, setActiveTab] = React.useState('analytics');
  const [filteredTransactions, setFilteredTransactions] = React.useState(data.transactions);

  return (
    <div className="space-y-6 font-[Hind Siliguri]">
      {/* iOS Tab Navigation */}
      <div className="bg-white rounded-3xl p-1 shadow-lg border border-gray-200 flex gap-1 overflow-x-auto">
        {[
          { id: 'analytics', icon: '📊', label: 'বিশ্লেষণ' },
          { id: 'search', icon: '🔍', label: 'অনুসন্ধান' },
          { id: 'calculator', icon: '🧮', label: 'ক্যালকুলেটর' },
          { id: 'export', icon: '📥', label: 'এক্সপোর্ট' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-5 py-3 rounded-2xl font-black transition-all whitespace-nowrap active:scale-90 flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{tab.icon}</span> <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* বিশ্লেষণ ট্যাব */}
      {activeTab === 'analytics' && (
        <AdvancedAnalyticsPanel 
          transactions={data.transactions}
          budgets={data.budgets}
          bills={data.bills}
          investments={data.investments}
        />
      )}

      {/* অনুসন্ধান ট্যাব */}
      {activeTab === 'search' && (
        <AdvancedSearchFilter 
          transactions={data.transactions}
          onFilter={setFilteredTransactions}
        />
      )}

      {/* ক্যালকুলেটর ট্যাব */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ঋণ পরিশোধ ক্যালকুলেটর */}
          <LoanPayoffCalculator />

          {/* বিনিয়োগ রিটার্ন ক্যালকুলেটর */}
          <InvestmentReturnsCalculator />

          {/* সঞ্চয় লক্ষ্য ক্যালকুলেটর */}
          <SavingsGoalCalculator />

          {/* বাজেট বিতরণ */}
          <BudgetAllocationCalculator />
        </div>
      )}

      {/* এক্সপোর্ট ট্যাব */}
      {activeTab === 'export' && (
        <DataExportPanel transactions={data.transactions} />
      )}
    </div>
  );
};

// ঋণ পরিশোধ ক্যালকুলেটর কম্পোনেন্ট
const LoanPayoffCalculator = () => {
  const [principal, setPrincipal] = React.useState(100000);
  const [rate, setRate] = React.useState(10);
  const [payment, setPayment] = React.useState(5000);
  const [result, setResult] = React.useState(null);

  const calculate = () => {
    let remaining = principal;
    let months = 0;
    let totalInterest = 0;

    while (remaining > 0 && months < 360) {
      months++;
      const interest = remaining * (rate / 100 / 12);
      totalInterest += interest;
      remaining -= (payment - interest);
    }

    setResult({
      months,
      years: (months / 12).toFixed(1),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: (principal + totalInterest).toFixed(2)
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
        <span className="text-4xl">🏦</span> ঋণ পরিশোধ ক্যালকুলেটর
      </h3>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">মূল টাকা</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(parseFloat(e.target.value))}
            className="input-field text-lg font-bold py-4 px-5 rounded-2xl w-full border border-gray-300"
          />
          <p className="text-xs text-gray-500 mt-2">৳{principal.toLocaleString('bn-BD')}</p>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">বার্ষিক সুদের হার (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="input-field text-lg font-bold py-4 px-5 rounded-2xl w-full border border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">মাসিক পরিশোধ</label>
          <input
            type="number"
            value={payment}
            onChange={(e) => setPayment(parseFloat(e.target.value))}
            className="input-field text-lg font-bold py-4 px-5 rounded-2xl w-full border border-gray-300"
          />
          <p className="text-xs text-gray-500 mt-2">৳{payment.toLocaleString('bn-BD')}</p>
        </div>

        <button
          onClick={calculate}
          className="w-full btn btn-primary py-4 px-6 rounded-2xl font-black text-lg active:scale-95"
        >
          হিসাব করুন
        </button>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-3xl p-8 border border-blue-200 space-y-4 mt-6">
          <p className="text-lg font-bold"><span className="text-blue-600">সময়কাল:</span> {result.months} মাস ({result.years} বছর)</p>
          <p className="text-lg font-bold"><span className="text-blue-600">মোট সুদ:</span> ৳{parseFloat(result.totalInterest).toLocaleString('bn-BD')}</p>
          <p className="text-2xl font-black text-blue-600">মোট পরিশোধ: ৳{parseFloat(result.totalPayment).toLocaleString('bn-BD')}</p>
        </div>
      )}
    </div>
  );
};

// বিনিয়োগ রিটার্ন ক্যালকুলেটর
const InvestmentReturnsCalculator = () => {
  const [invested, setInvested] = React.useState(50000);
  const [current, setCurrent] = React.useState(65000);
  const [result, setResult] = React.useState(null);

  const calculate = () => {
    const profit = current - invested;
    const percentage = ((profit / invested) * 100).toFixed(2);

    setResult({
      profit,
      percentage,
      status: profit > 0 ? '📈 লাভজনক' : '📉 ক্ষতিকারক'
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
        <span className="text-4xl">💼</span> বিনিয়োগ রিটার্ন
      </h3>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">বিনিয়োগ করা টাকা</label>
          <input
            type="number"
            value={invested}
            onChange={(e) => setInvested(parseFloat(e.target.value))}
            className="input-field text-lg font-bold py-4 px-5 rounded-2xl w-full border border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">বর্তমান মূল্য</label>
          <input
            type="number"
            value={current}
            onChange={(e) => setCurrent(parseFloat(e.target.value))}
            className="input-field text-lg font-bold py-4 px-5 rounded-2xl w-full border border-gray-300"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full btn btn-primary py-4 px-6 rounded-2xl font-black text-lg active:scale-95"
        >
          হিসাব করুন
        </button>
      </div>

      {result && (
        <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200 space-y-4 mt-6">
          <p className="text-2xl font-black text-amber-600">{result.status}</p>
          <p className="text-lg font-bold"><span className="text-amber-600">লাভ/ক্ষতি:</span> ৳{result.profit.toLocaleString('bn-BD')}</p>
          <p className="text-2xl font-black text-amber-600">রিটার্ন: {result.percentage}%</p>
        </div>
      )}
    </div>
  );
};

// সঞ্চয় লক্ষ্য ক্যালকুলেটর
const SavingsGoalCalculator = () => {
  const [target, setTarget] = React.useState(100000);
  const [monthly, setMonthly] = React.useState(10000);
  const [result, setResult] = React.useState(null);

  const calculate = () => {
    const months = Math.ceil(target / monthly);
    const years = (months / 12).toFixed(1);

    setResult({
      months,
      years,
      totalSavings: target
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
        <span className="text-4xl">🎯</span> সঞ্চয় লক্ষ্য
      </h3>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">লক্ষ্য পরিমাণ</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseFloat(e.target.value))}
            className="input-field text-lg font-bold py-4 px-5 rounded-2xl w-full border border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">মাসিক সঞ্চয়</label>
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(parseFloat(e.target.value))}
            className="input-field text-lg font-bold py-4 px-5 rounded-2xl w-full border border-gray-300"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full btn btn-primary py-4 px-6 rounded-2xl font-black text-lg active:scale-95"
        >
          হিসাব করুন
        </button>
      </div>

      {result && (
        <div className="bg-green-50 rounded-3xl p-8 border border-green-200 space-y-4 mt-6">
          <p className="text-lg font-bold"><span className="text-green-600">প্রয়োজনীয় সময়:</span> {result.months} মাস ({result.years} বছর)</p>
          <p className="text-2xl font-black text-green-600">মাসিক সঞ্চয়: ৳{monthly.toLocaleString('bn-BD')}</p>
        </div>
      )}
    </div>
  );
};

// বাজেট বিতরণ ক্যালকুলেটর
const BudgetAllocationCalculator = () => {
  const [income, setIncome] = React.useState(50000);
  const [result, setResult] = React.useState(null);

  const calculate = () => {
    const budgets = {
      needs: (income * 0.5).toFixed(0),      // ৫০%
      wants: (income * 0.30).toFixed(0),     // ৩০%
      savings: (income * 0.20).toFixed(0)    // ২০%
    };

    setResult(budgets);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h3 className="font-bold text-lg">📊 বাজেট বিতরণ (৫০/৩০/২০)</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">মাসিক আয়</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value))}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-emerald-500 text-white py-3 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all font-medium"
        >
          বিতরণ করুন
        </button>
      </div>

      {result && (
        <div className="bg-blue-50 p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold">প্রয়োজন (৫০%):</span>
            <span>৳{parseInt(result.needs).toLocaleString('bn-BD')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">চাওয়া (৩০%):</span>
            <span>৳{parseInt(result.wants).toLocaleString('bn-BD')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">সঞ্চয় (২০%):</span>
            <span>৳{parseInt(result.savings).toLocaleString('bn-BD')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ডেটা এক্সপোর্ট প্যানেল
const DataExportPanel = ({ transactions }) => {
  const [exportFormat, setExportFormat] = React.useState('json');

  const handleExport = () => {
    const data = {
      exportDate: new Date().toLocaleDateString('bn-BD'),
      totalTransactions: transactions.length,
      transactions: transactions.map(t => ({
        ...t,
        formattedAmount: `৳${t.amount.toLocaleString('bn-BD')}`
      }))
    };

    if (exportFormat === 'json') {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${Date.now()}.json`;
      a.click();
    } else if (exportFormat === 'csv') {
      const csv = [
        'তারিখ,বর্ণনা,পরিমাণ,বিভাগ,ধরন',
        ...transactions.map(t => 
          `${t.date},"${t.description}",${t.amount},${t.category},${t.type}`
        )
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${Date.now()}.csv`;
      a.click();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h3 className="font-bold text-lg">📥 ডেটা এক্সপোর্ট করুন</h3>

      <div>
        <label className="block text-sm font-medium mb-2">ফর্ম্যাট নির্বাচন করুন</label>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
        >
          <option value="json">JSON (সব তথ্য সহ)</option>
          <option value="csv">CSV (স্প্রেডশীট এর জন্য)</option>
        </select>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl">
        <p className="text-sm">📊 মোট লেনদেন: {transactions.length}</p>
      </div>

      <button
        onClick={handleExport}
        className="w-full bg-emerald-500 text-white py-3 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all font-medium"
      >
        এখনই ডাউনলোড করুন
      </button>
    </div>
  );
};
