// নেট ওয়ার্থ ট্র্যাকার - সম্পদ এবং দায়বদ্ধতা ব্যবস্থাপনা

const NetWorthTracker = ({ data, setData }) => {
  const [assets, setAssets] = React.useState(data.assets || []);
  const [liabilities, setLiabilities] = React.useState(data.liabilities || []);
  const [showAssetForm, setShowAssetForm] = React.useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = React.useState(false);
  const [historyTab, setHistoryTab] = React.useState('assets');

  const [assetForm, setAssetForm] = React.useState({
    name: '',
    value: '',
    category: 'নগদ',
    date: new Date().toISOString().split('T')[0]
  });

  const [liabilityForm, setLiabilityForm] = React.useState({
    name: '',
    amount: '',
    category: 'ঋণ',
    interestRate: '',
    date: new Date().toISOString().split('T')[0]
  });

  const assetCategories = [
    { name: 'নগদ', icon: '💵', color: 'bg-green-100' },
    { name: 'ব্যাংক সঞ্চয়', icon: '🏦', color: 'bg-blue-100' },
    { name: 'বিনিয়োগ', icon: '📈', color: 'bg-purple-100' },
    { name: 'রিয়েল এস্টেট', icon: '🏠', color: 'bg-orange-100' },
    { name: 'যানবাহন', icon: '🚗', color: 'bg-red-100' },
    { name: 'গহনা/মূল্যবান', icon: '💎', color: 'bg-pink-100' },
    { name: 'অন্যান্য', icon: '📦', color: 'bg-gray-100' }
  ];

  const liabilityCategories = [
    { name: 'বাড়ির ঋণ', icon: '🏠', color: 'bg-red-100' },
    { name: 'গাড়ির ঋণ', icon: '🚗', color: 'bg-orange-100' },
    { name: 'ব্যক্তিগত ঋণ', icon: '👤', color: 'bg-yellow-100' },
    { name: 'ক্রেডিট কার্ড', icon: '💳', color: 'bg-pink-100' },
    { name: 'ব্যবসায়িক ঋণ', icon: '🏢', color: 'bg-blue-100' },
    { name: 'অন্যান্য', icon: '📋', color: 'bg-gray-100' }
  ];

  const handleAddAsset = (e) => {
    e.preventDefault();

    if (!assetForm.name || !assetForm.value) {
      alert('নাম এবং মূল্য প্রয়োজন');
      return;
    }

    const newAsset = {
      id: Date.now().toString(),
      ...assetForm,
      value: parseFloat(assetForm.value)
    };

    const updated = [...assets, newAsset];
    setAssets(updated);
    setData(prev => ({
      ...prev,
      assets: updated
    }));

    setAssetForm({
      name: '',
      value: '',
      category: 'নগদ',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAssetForm(false);
  };

  const handleAddLiability = (e) => {
    e.preventDefault();

    if (!liabilityForm.name || !liabilityForm.amount) {
      alert('নাম এবং পরিমাণ প্রয়োজন');
      return;
    }

    const newLiability = {
      id: Date.now().toString(),
      ...liabilityForm,
      amount: parseFloat(liabilityForm.amount),
      interestRate: liabilityForm.interestRate ? parseFloat(liabilityForm.interestRate) : 0
    };

    const updated = [...liabilities, newLiability];
    setLiabilities(updated);
    setData(prev => ({
      ...prev,
      liabilities: updated
    }));

    setLiabilityForm({
      name: '',
      amount: '',
      category: 'ঋণ',
      interestRate: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowLiabilityForm(false);
  };

  const handleDeleteAsset = (id) => {
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    setData(prev => ({
      ...prev,
      assets: updated
    }));
  };

  const handleDeleteLiability = (id) => {
    const updated = liabilities.filter(l => l.id !== id);
    setLiabilities(updated);
    setData(prev => ({
      ...prev,
      liabilities: updated
    }));
  };

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  // বার্ষিক সুদ হিসাব
  const annualInterest = liabilities.reduce((sum, l) => {
    return sum + (l.amount * (l.interestRate || 0) / 100);
  }, 0);

  return (
    <div className="space-y-6 font-[Hind Siliguri]">
      {/* নেট ওয়ার্থ সংক্ষিপ্ত */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-black mb-6">💰 আপনার নেট ওয়ার্থ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white bg-opacity-20 p-6 rounded-2xl">
            <p className="text-sm opacity-90">মোট সম্পদ</p>
            <p className="text-3xl font-black">৳{totalAssets.toLocaleString('bn-BD')}</p>
          </div>
          <div className="bg-white bg-opacity-20 p-6 rounded-2xl">
            <p className="text-sm opacity-90">মোট দায়বদ্ধতা</p>
            <p className="text-3xl font-black">৳{totalLiabilities.toLocaleString('bn-BD')}</p>
          </div>
          <div className={`${netWorth >= 0 ? 'bg-white bg-opacity-30' : 'bg-red-500 bg-opacity-30'} p-6 rounded-2xl`}>
            <p className="text-sm opacity-90">নেট ওয়ার্থ</p>
            <p className="text-3xl font-black">৳{netWorth.toLocaleString('bn-BD')}</p>
            <p className={`text-xs mt-1 ${netWorth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {netWorth >= 0 ? '📈 ইতিবাচক' : '📉 নেতিবাচক'}
            </p>
          </div>
        </div>
      </div>

      {/* ট্যাব সিস্টেম */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'assets', label: '💎 সম্পদ' },
          { id: 'liabilities', label: '📉 দায়বদ্ধতা' },
          { id: 'analysis', label: '📊 বিশ্লেষণ' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setHistoryTab(tab.id)}
            className={`px-4 py-2 font-medium transition-all border-b-2 ${
              historyTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* সম্পদ ট্যাব */}
      {historyTab === 'assets' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">💎 আপনার সম্পদ</h3>
            <button
              onClick={() => setShowAssetForm(!showAssetForm)}
              className="bg-emerald-500 text-white px-4 py-3 rounded-2xl hover:bg-emerald-600 active:scale-95 transition-all font-black text-lg"
            >
              {showAssetForm ? '❌' : '➕'} যোগ করুন
            </button>
          </div>

          {showAssetForm && (
            <form onSubmit={handleAddAsset} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="সম্পদের নাম"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                  className="px-5 py-4 border border-gray-300 rounded-2xl"
                  required
                />

                <input
                  type="number"
                  placeholder="মূল্য (৳)"
                  value={assetForm.value}
                  onChange={(e) => setAssetForm({ ...assetForm, value: e.target.value })}
                  className="px-5 py-4 border border-gray-300 rounded-2xl"
                  required
                />

                <select
                  value={assetForm.category}
                  onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}
                  className="col-span-2 px-5 py-4 border border-gray-300 rounded-2xl"
                >
                  {assetCategories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={assetForm.date}
                  onChange={(e) => setAssetForm({ ...assetForm, date: e.target.value })}
                  className="col-span-2 px-5 py-4 border border-gray-300 rounded-2xl"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-4 px-6 rounded-2xl hover:bg-emerald-600 active:scale-95 transition-all font-black text-lg"
              >
                সম্পদ যোগ করুন
              </button>
            </form>
          )}

          {/* সম্পদ তালিকা */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {assets.map(asset => {
              const category = assetCategories.find(c => c.name === asset.category);
              return (
                <div key={asset.id} className={`border rounded-3xl p-8 shadow-lg ${category?.color}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{category?.icon}</span>
                        <h4 className="font-bold">{asset.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{asset.category}</p>
                      <p className="text-xs text-gray-500 mt-1">{asset.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-emerald-600">৳{asset.value.toLocaleString('bn-BD')}</p>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="text-red-500 hover:text-red-700 text-lg mt-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {assets.length === 0 && (
            <p className="text-gray-500 text-center py-8">কোনো সম্পদ নেই</p>
          )}
        </div>
      )}

      {/* দায়বদ্ধতা ট্যাব */}
      {historyTab === 'liabilities' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">📉 আপনার দায়বদ্ধতা</h3>
            <button
              onClick={() => setShowLiabilityForm(!showLiabilityForm)}
              className="bg-red-500 text-white px-4 py-3 rounded-2xl hover:bg-red-600 transition-colors font-black text-lg"
            >
              {showLiabilityForm ? '❌' : '➕'} যোগ করুন
            </button>
          </div>

          {showLiabilityForm && (
            <form onSubmit={handleAddLiability} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="দায়বদ্ধতার নাম"
                  value={liabilityForm.name}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, name: e.target.value })}
                  className="px-5 py-4 border border-gray-300 rounded-2xl"
                  required
                />

                <input
                  type="number"
                  placeholder="পরিমাণ (৳)"
                  value={liabilityForm.amount}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, amount: e.target.value })}
                  className="px-5 py-4 border border-gray-300 rounded-2xl"
                  required
                />

                <select
                  value={liabilityForm.category}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, category: e.target.value })}
                  className="px-5 py-4 border border-gray-300 rounded-2xl"
                >
                  {liabilityCategories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="সুদের হার (%)"
                  value={liabilityForm.interestRate}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, interestRate: e.target.value })}
                  className="px-5 py-4 border border-gray-300 rounded-2xl"
                />

                <input
                  type="date"
                  value={liabilityForm.date}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, date: e.target.value })}
                  className="col-span-2 px-5 py-4 border border-gray-300 rounded-2xl"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 text-white py-4 px-6 rounded-2xl hover:bg-red-600 font-black text-lg"
              >
                দায়বদ্ধতা যোগ করুন
              </button>
            </form>
          )}

          {/* দায়বদ্ধতা তালিকা */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {liabilities.map(liability => {
              const category = liabilityCategories.find(c => c.name === liability.category);
              const annualCost = liability.amount * (liability.interestRate || 0) / 100;
              return (
                <div key={liability.id} className={`border rounded-3xl p-8 shadow-lg ${category?.color}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{category?.icon}</span>
                        <h4 className="font-bold">{liability.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{liability.category}</p>
                      {liability.interestRate > 0 && (
                        <p className="text-xs text-gray-500 mt-1">সুদ: {liability.interestRate}% (~৳{annualCost.toLocaleString('bn-BD')}/বছর)</p>
                      )}
                      <p className="text-xs text-gray-500">{liability.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-red-600">৳{liability.amount.toLocaleString('bn-BD')}</p>
                      <button
                        onClick={() => handleDeleteLiability(liability.id)}
                        className="text-red-500 hover:text-red-700 text-lg mt-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {liabilities.length === 0 && (
            <p className="text-gray-500 text-center py-8">কোনো দায়বদ্ধতা নেই</p>
          )}
        </div>
      )}

      {/* বিশ্লেষণ ট্যাব */}
      {historyTab === 'analysis' && (
        <div className="space-y-6">
          {/* নেট ওয়ার্থ বৃদ্ধি */}
          <div className="bg-blue-50 border border-blue-200 p-8 rounded-3xl shadow-lg">
            <h3 className="font-bold text-lg mb-4">📈 নেট ওয়ার্থ বিশ্লেষণ</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-6 bg-white rounded-2xl">
                <span className="font-medium">মোট সম্পদ</span>
                <span className="font-black text-green-600 text-2xl">৳{totalAssets.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between items-center p-6 bg-white rounded-2xl">
                <span className="font-medium">মোট দায়বদ্ধতা</span>
                <span className="font-black text-red-600 text-2xl">-৳{totalLiabilities.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between items-center p-6 bg-emerald-100 rounded-2xl">
                <span className="font-bold">নেট ওয়ার্থ</span>
                <span className="font-black text-emerald-600 text-3xl">৳{netWorth.toLocaleString('bn-BD')}</span>
              </div>
            </div>
          </div>

          {/* সুদ বিশ্লেষণ */}
          {annualInterest > 0 && (
            <div className="bg-orange-50 border border-orange-200 p-8 rounded-3xl shadow-lg">
              <h3 className="font-bold text-lg mb-4">📊 বার্ষিক সুদ খরচ</h3>
              <p className="text-4xl font-black text-orange-600">৳{annualInterest.toLocaleString('bn-BD')}</p>
              <p className="text-sm text-gray-600 mt-2">প্রতি মাসে: ৳{(annualInterest / 12).toLocaleString('bn-BD')}</p>
            </div>
          )}

          {/* ঋণ-থেকে-সম্পদ অনুপাত */}
          <div className="bg-purple-50 border border-purple-200 p-8 rounded-3xl shadow-lg">
            <h3 className="font-bold text-lg mb-4">📐 আর্থিক অনুপাত</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">দায়বদ্ধতা থেকে সম্পদ অনুপাত</p>
                <p className="text-3xl font-black">
                  {totalAssets > 0 ? (totalLiabilities / totalAssets * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalAssets > 0 && totalLiabilities / totalAssets <= 0.5 ? '✅ ভালো' : '⚠️ উচ্চ'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">নেট ওয়ার্থ মার্জিন</p>
                <p className="text-3xl font-black">
                  {totalAssets > 0 ? (netWorth / totalAssets * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
