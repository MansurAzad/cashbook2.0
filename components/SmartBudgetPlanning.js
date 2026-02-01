// স্মার্ট বাজেট প্ল্যানিং এবং আর্থিক লক্ষ্য ট্র্যাকিং

const SmartBudgetPlanning = ({ data, setData }) => {
  const [budgetPlans, setBudgetPlans] = React.useState(data.budgetPlans || []);
  const [activeTab, setActiveTab] = React.useState('create');
  const [formData, setFormData] = React.useState({
    name: '',
    targetAmount: '',
    deadline: '',
    category: 'সাঁচয়',
    priority: 'medium'
  });

  const categories = [
    { name: 'সাঁচয়', icon: '💰', color: 'bg-green-100' },
    { name: 'ছুটির খরচ', icon: '🏖️', color: 'bg-blue-100' },
    { name: 'জরুরি তহবিল', icon: '🚨', color: 'bg-red-100' },
    { name: 'বিনিয়োগ', icon: '📈', color: 'bg-purple-100' },
    { name: 'শিক্ষা', icon: '📚', color: 'bg-yellow-100' },
    { name: 'বাড়ি', icon: '🏠', color: 'bg-orange-100' }
  ];

  const handleCreateBudget = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      alert('সব ফিল্ড পূরণ করুন');
      return;
    }

    const newPlan = {
      id: Date.now().toString(),
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    const updated = [...budgetPlans, newPlan];
    setBudgetPlans(updated);
    setData(prev => ({
      ...prev,
      budgetPlans: updated
    }));

    setFormData({
      name: '',
      targetAmount: '',
      deadline: '',
      category: 'সাঁচয়',
      priority: 'medium'
    });
  };

  const handleUpdateProgress = (id, amount) => {
    const updated = budgetPlans.map(plan => {
      if (plan.id === id) {
        const newAmount = plan.currentAmount + parseFloat(amount);
        return { ...plan, currentAmount: Math.max(0, newAmount) };
      }
      return plan;
    });

    setBudgetPlans(updated);
    setData(prev => ({
      ...prev,
      budgetPlans: updated
    }));
  };

  const handleDeletePlan = (id) => {
    if (confirm('এই পরিকল্পনা মুছতে চান?')) {
      const updated = budgetPlans.filter(p => p.id !== id);
      setBudgetPlans(updated);
      setData(prev => ({
        ...prev,
        budgetPlans: updated
      }));
    }
  };

  return (
    <div className="space-y-6 font-[Hind Siliguri]">
      {/* ট্যাব নেভিগেশন */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'create', label: '➕ নতুন পরিকল্পনা' },
          { id: 'track', label: '📊 ট্র্যাক করুন' },
          { id: 'analysis', label: '📈 বিশ্লেষণ' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-2xl px-5 py-3 font-bold transition-all border-b-2 active:scale-90 ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* নতুন পরিকল্পনা তৈরি ট্যাব */}
      {activeTab === 'create' && (
        <div className="rounded-3xl p-8 shadow-lg bg-gradient-to-br from-emerald-50 to-blue-50 border border-gray-200 space-y-6">
          <h3 className="text-3xl font-black">🎯 নতুন আর্থিক লক্ষ্য তৈরি করুন</h3>

          {/* বিভাগ নির্বাচন */}
          <div>
            <label className="block font-black text-xl mb-3">বিভাগ নির্বাচন করুন</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setFormData({ ...formData, category: cat.name })}
                  className={`rounded-3xl p-6 transition-all font-black text-lg active:scale-90 ${
                    formData.category === cat.name
                      ? `${cat.color} border-4 border-gray-800 shadow-lg`
                      : `${cat.color} border-4 border-transparent hover:border-gray-400`
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="text-sm">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ফর্ম */}
          <form onSubmit={handleCreateBudget} className="space-y-4">
            <div>
              <label className="block text-sm font-black mb-2">লক্ষ্যের নাম</label>
              <input
                type="text"
                placeholder="যেমন: বার্ষিক ছুটির ট্রিপ"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl py-4 px-5 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black mb-2">লক্ষ্য পরিমাণ (৳)</label>
                <input
                  type="number"
                  placeholder="100000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full rounded-2xl py-4 px-5 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black mb-2">সময়সীমা</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full rounded-2xl py-4 px-5 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black mb-3">অগ্রাধিকার</label>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map(priority => (
                  <label key={priority} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-bold">
                      {{
                        low: '🟢 কম',
                        medium: '🟡 মাঝারি',
                        high: '🔴 উচ্চ'
                      }[priority]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary rounded-2xl py-4 px-6 font-black transition-all active:scale-90"
            >
              লক্ষ্য তৈরি করুন
            </button>
          </form>
        </div>
      )}

      {/* ট্র্যাকিং ট্যাব */}
      {activeTab === 'track' && (
        <div className="space-y-4">
          {budgetPlans.length === 0 ? (
            <div className="rounded-3xl p-8 shadow-lg bg-gray-50 text-center">
              <p className="text-gray-500 font-bold text-lg">এখনও কোনো পরিকল্পনা নেই</p>
            </div>
          ) : (
            budgetPlans.map(plan => (
              <BudgetPlanCard
                key={plan.id}
                plan={plan}
                category={categories.find(c => c.name === plan.category)}
                onUpdate={handleUpdateProgress}
                onDelete={handleDeletePlan}
              />
            ))
          )}
        </div>
      )}

      {/* বিশ্লেষণ ট্যাব */}
      {activeTab === 'analysis' && (
        <BudgetAnalysisPanel budgetPlans={budgetPlans} categories={categories} />
      )}
    </div>
  );
};

// বাজেট পরিকল্পনা কার্ড
const BudgetPlanCard = ({ plan, category, onUpdate, onDelete }) => {
  const [addAmount, setAddAmount] = React.useState('');
  const progress = (plan.currentAmount / plan.targetAmount) * 100;
  const daysLeft = Math.ceil((new Date(plan.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const isCompleted = plan.currentAmount >= plan.targetAmount;

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-50 border-green-200';
    if (daysLeft < 0) return 'bg-red-50 border-red-200';
    if (progress > 75) return 'bg-blue-50 border-blue-200';
    return 'bg-white border-gray-200';
  };

  return (
    <div className={`rounded-3xl p-8 shadow-lg border-2 ${getStatusColor()}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <span className="text-4xl">{category?.icon}</span>
          <div>
            <h4 className="font-black text-2xl">{plan.name}</h4>
            <p className="text-sm text-gray-500">{plan.category}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(plan.id)}
          className="text-red-500 hover:text-red-700 text-3xl font-black active:scale-90 transition-all"
        >
          🗑️
        </button>
      </div>

      {/* অগ্রগতি বার */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="font-black text-2xl">৳{plan.currentAmount.toLocaleString('bn-BD')}</span>
            <span className="text-gray-500 font-bold"> / ৳{plan.targetAmount.toLocaleString('bn-BD')}</span>
          </div>
          <span className={`text-lg font-black ${isCompleted ? 'text-green-600' : progress > 75 ? 'text-blue-600' : 'text-gray-600'}`}>
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full rounded-full h-3 bg-opacity-20">
          <div
            className={`h-full rounded-full transition-all ${
              isCompleted
                ? 'bg-green-500'
                : progress > 75
                ? 'bg-blue-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* তথ্য */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600 font-bold">সময়সীমা</p>
          <p className="font-black text-lg">{new Date(plan.deadline).toLocaleDateString('bn-BD')}</p>
        </div>
        <div>
          <p className="text-gray-600 font-bold">অবশিষ্ট সময়</p>
          <p className={`font-black text-lg ${daysLeft < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {daysLeft < 0 ? '❌ শেষ' : `${daysLeft} দিন`}
          </p>
        </div>
        <div>
          <p className="text-gray-600 font-bold">প্রয়োজনীয় পরিমাণ</p>
          <p className="font-black text-lg">৳{(plan.targetAmount - plan.currentAmount).toLocaleString('bn-BD')}</p>
        </div>
        <div>
          <p className="text-gray-600 font-bold">অগ্রাধিকার</p>
          <p className="font-black text-lg">
            {{
              low: '🟢 কম',
              medium: '🟡 মাঝারি',
              high: '🔴 উচ্চ'
            }[plan.priority]}
          </p>
        </div>
      </div>

      {!isCompleted && (
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="পরিমাণ যোগ করুন"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            className="flex-1 rounded-2xl py-4 px-5 border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => {
              if (addAmount) {
                onUpdate(plan.id, addAmount);
                setAddAmount('');
              }
            }}
            className="btn btn-primary rounded-2xl py-4 px-6 font-black transition-all active:scale-90"
          >
            যোগ করুন
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="rounded-2xl bg-green-100 text-green-700 p-4 text-center font-black text-lg">
          ✅ লক্ষ্য অর্জিত!
        </div>
      )}
    </div>
  );
};

// বাজেট বিশ্লেষণ প্যানেল
const BudgetAnalysisPanel = ({ budgetPlans, categories }) => {
  const totalTarget = budgetPlans.reduce((sum, p) => sum + p.targetAmount, 0);
  const totalSaved = budgetPlans.reduce((sum, p) => sum + p.currentAmount, 0);
  const completedPlans = budgetPlans.filter(p => p.currentAmount >= p.targetAmount).length;
  const avgProgress = budgetPlans.length > 0 ? (totalSaved / totalTarget * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* সারাংশ কার্ড */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="rounded-3xl p-8 shadow-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-gray-600 font-bold">মোট লক্ষ্য</p>
          <p className="text-3xl font-black text-blue-600">৳{totalTarget.toLocaleString('bn-BD')}</p>
        </div>
        <div className="rounded-3xl p-8 shadow-lg bg-green-50 border border-green-200">
          <p className="text-sm text-gray-600 font-bold">সংগৃহীত</p>
          <p className="text-3xl font-black text-green-600">৳{totalSaved.toLocaleString('bn-BD')}</p>
        </div>
        <div className="rounded-3xl p-8 shadow-lg bg-purple-50 border border-purple-200">
          <p className="text-sm text-gray-600 font-bold">সামগ্রিক অগ্রগতি</p>
          <p className="text-3xl font-black text-purple-600">{avgProgress}%</p>
        </div>
        <div className="rounded-3xl p-8 shadow-lg bg-orange-50 border border-orange-200">
          <p className="text-sm text-gray-600 font-bold">সম্পন্ন লক্ষ্য</p>
          <p className="text-3xl font-black text-orange-600">{completedPlans}/{budgetPlans.length}</p>
        </div>
      </div>

      {/* বিভাগ-ভিত্তিক বিশ্লেষণ */}
      {budgetPlans.length > 0 && (
        <div className="rounded-3xl p-8 shadow-lg border border-gray-200">
          <h3 className="font-black text-3xl mb-4">বিভাগ-ভিত্তিক তথ্য</h3>
          <div className="space-y-3">
            {categories.map(cat => {
              const categoryPlans = budgetPlans.filter(p => p.category === cat.name);
              const categoryTarget = categoryPlans.reduce((sum, p) => sum + p.targetAmount, 0);
              const categorySaved = categoryPlans.reduce((sum, p) => sum + p.currentAmount, 0);

              if (categoryTarget === 0) return null;

              return (
                <div key={cat.name} className={`${cat.color} rounded-3xl p-8`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <p className="font-black text-lg">{cat.name}</p>
                        <p className="text-xs opacity-75 font-bold">{categoryPlans.length} লক্ষ্য</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg">৳{categorySaved.toLocaleString('bn-BD')}</p>
                      <p className="text-xs opacity-75 font-bold">/ ৳{categoryTarget.toLocaleString('bn-BD')}</p>
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
