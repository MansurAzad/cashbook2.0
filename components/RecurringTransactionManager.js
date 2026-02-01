// পুনরাবৃত্ত লেনদেন ম্যানেজার - স্বয়ংক্রিয় বিল এবং আয়

const RecurringTransactionManager = ({ data, setData }) => {
  const [recurring, setRecurring] = React.useState(data.recurringTransactions || []);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    description: '',
    amount: '',
    category: 'অন্যান্য',
    type: 'expense',
    frequency: 'monthly', // daily, weekly, monthly, yearly
    nextDate: new Date().toISOString().split('T')[0],
    active: true
  });

  // প্রতিটি লোডে স্বয়ংক্রিয় লেনদেন প্রক্রিয়া করুন
  React.useEffect(() => {
    processRecurringTransactions();
  }, []);

  const processRecurringTransactions = () => {
    const today = new Date().toISOString().split('T')[0];
    let updated = false;

    const processed = recurring.map(r => {
      if (!r.active) return r;

      const nextDate = new Date(r.nextDate);
      const todayDate = new Date(today);

      if (nextDate <= todayDate) {
        // এই লেনদেন যোগ করুন
        const newTransaction = {
          id: Date.now().toString(),
          description: r.description + ' (স্বয়ংক্রিয়)',
          amount: r.amount,
          category: r.category,
          type: r.type,
          date: today,
          recurringId: r.id
        };

        // ডেটা আপডেট করুন
        setData(prev => ({
          ...prev,
          transactions: [...(prev.transactions || []), newTransaction]
        }));

        // পরবর্তী তারিখ নির্ধারণ করুন
        const newNextDate = calculateNextDate(today, r.frequency);
        updated = true;

        return { ...r, nextDate: newNextDate, lastProcessed: today };
      }

      return r;
    });

    if (updated) {
      setRecurring(processed);
      setData(prev => ({
        ...prev,
        recurringTransactions: processed
      }));
    }
  };

  const calculateNextDate = (currentDate, frequency) => {
    const date = new Date(currentDate);

    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }

    return date.toISOString().split('T')[0];
  };

  const handleAddRecurring = (e) => {
    e.preventDefault();

    if (!formData.description || !formData.amount) {
      alert('সব ফিল্ড পূরণ করুন');
      return;
    }

    const newRecurring = {
      id: Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount),
      createdDate: new Date().toISOString().split('T')[0]
    };

    const updated = [...recurring, newRecurring];
    setRecurring(updated);
    setData(prev => ({
      ...prev,
      recurringTransactions: updated
    }));

    // ফর্ম রিসেট করুন
    setFormData({
      description: '',
      amount: '',
      category: 'অন্যান্য',
      type: 'expense',
      frequency: 'monthly',
      nextDate: new Date().toISOString().split('T')[0],
      active: true
    });
    setShowForm(false);
  };

  const handleToggle = (id) => {
    const updated = recurring.map(r => 
      r.id === id ? { ...r, active: !r.active } : r
    );
    setRecurring(updated);
    setData(prev => ({
      ...prev,
      recurringTransactions: updated
    }));
  };

  const handleDelete = (id) => {
    const updated = recurring.filter(r => r.id !== id);
    setRecurring(updated);
    setData(prev => ({
      ...prev,
      recurringTransactions: updated
    }));
  };

  return (
    <div className="space-y-6 font-[Hind Siliguri]">
      {/* শিরোনাম এবং বোতাম */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🔄 পুনরাবৃত্ত লেনদেন</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-500 text-white px-4 py-3 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all"
        >
          {showForm ? '❌ বাতিল' : '➕ নতুন'}
        </button>
      </div>

      {/* ফর্ম */}
      {showForm && (
        <form onSubmit={handleAddRecurring} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="বর্ণনা (যেমন: মোবাইল বিল)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              required
            />

            <input
              type="number"
              placeholder="পরিমাণ"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              required
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="খাওয়া-দাওয়া">খাওয়া-দাওয়া</option>
              <option value="পরিবহন">পরিবহন</option>
              <option value="ইউটিলিটি">ইউটিলিটি</option>
              <option value="বিনোদন">বিনোদন</option>
              <option value="স্বাস্থ্য">স্বাস্থ্য</option>
              <option value="শিক্ষা">শিক্ষা</option>
              <option value="অন্যান্য">অন্যান্য</option>
            </select>

            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="expense">খরচ</option>
              <option value="income">আয়</option>
            </select>

            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="daily">প্রতিদিন</option>
              <option value="weekly">প্রতি সপ্তাহ</option>
              <option value="monthly">প্রতি মাসে</option>
              <option value="yearly">প্রতি বছর</option>
            </select>

            <input
              type="date"
              value={formData.nextDate}
              onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all font-medium"
          >
            যোগ করুন
          </button>
        </form>
      )}

      {/* পুনরাবৃত্ত লেনদেনের তালিকা */}
      <div className="space-y-3">
        {recurring.length === 0 ? (
          <p className="text-gray-500 text-center py-8">কোনো পুনরাবৃত্ত লেনদেন নেই</p>
        ) : (
          recurring.map(r => (
            <RecurringTransactionCard
              key={r.id}
              recurring={r}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* পরিসংখ্যান */}
      {recurring.length > 0 && (
        <RecurringTransactionStats recurring={recurring} />
      )}
    </div>
  );
};

// পুনরাবৃত্ত লেনদেন কার্ড
const RecurringTransactionCard = ({ recurring, onToggle, onDelete }) => {
  const frequencyLabels = {
    daily: '🔴 প্রতিদিন',
    weekly: '📅 প্রতি সপ্তাহ',
    monthly: '📆 প্রতি মাসে',
    yearly: '📅 প্রতি বছর'
  };

  const typeIcon = recurring.type === 'expense' ? '📤' : '📥';

  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      recurring.active 
        ? 'bg-white border-emerald-300' 
        : 'bg-gray-50 border-gray-300 opacity-60'
    }`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{typeIcon}</span>
            <h3 className="font-bold text-lg">{recurring.description}</h3>
            {!recurring.active && <span className="text-xs bg-gray-300 text-white px-2 py-1 rounded">অক্ষম</span>}
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <p>💰 পরিমাণ: ৳{recurring.amount.toLocaleString('bn-BD')}</p>
            <p>📂 বিভাগ: {recurring.category}</p>
            <p>{frequencyLabels[recurring.frequency]}</p>
            <p>📌 পরবর্তী: {new Date(recurring.nextDate).toLocaleDateString('bn-BD')}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onToggle(recurring.id)}
            title={recurring.active ? 'বিচ্ছিন্ন করুন' : 'সক্ষম করুন'}
            className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition-colors"
          >
            {recurring.active ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={() => {
              if (confirm('নিশ্চিত?')) {
                onDelete(recurring.id);
              }
            }}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

// পুনরাবৃত্ত লেনদেন পরিসংখ্যান
const RecurringTransactionStats = ({ recurring }) => {
  const activeRecurring = recurring.filter(r => r.active);
  const monthlyExpense = activeRecurring
    .filter(r => r.type === 'expense' && r.frequency === 'monthly')
    .reduce((sum, r) => sum + r.amount, 0);
  const monthlyIncome = activeRecurring
    .filter(r => r.type === 'income' && r.frequency === 'monthly')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
      <h3 className="font-bold text-lg mb-4">📊 মাসিক প্রভাব</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">মাসিক খরচ</p>
          <p className="text-2xl font-bold text-red-500">৳{monthlyExpense.toLocaleString('bn-BD')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">মাসিক আয়</p>
          <p className="text-2xl font-bold text-green-500">৳{monthlyIncome.toLocaleString('bn-BD')}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-sm text-gray-600">সক্রিয় লেনদেন</p>
        <p className="text-xl font-bold">{activeRecurring.length} টি</p>
      </div>
    </div>
  );
};
