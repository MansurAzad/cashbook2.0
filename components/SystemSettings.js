// আপ্লিকেশন সিস্টেম সেটিংস এবং কনফিগারেশন

const SystemSettings = ({ data, setData }) => {
  const [activeTab, setActiveTab] = React.useState('general');
  const [settings, setSettings] = React.useState(data.systemSettings || {
    theme: 'light',
    language: 'bn',
    currency: '৳',
    dateFormat: 'dd/mm/yyyy',
    notifications: true,
    autoBackup: true,
    backupFrequency: 'weekly',
    lowBalanceAlert: 5000,
    showTutorials: true
  });

  const handleSettingChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    setData(prev => ({
      ...prev,
      systemSettings: updated
    }));
    localStorage.setItem('bk_system_settings', JSON.stringify(updated));
  };

  const handleExportAllData = () => {
    const allData = {
      exportDate: new Date().toLocaleDateString('bn-BD'),
      appVersion: '2.0',
      ...data
    };

    const json = JSON.stringify(allData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jamakhoroch-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        delete imported.exportDate;
        delete imported.appVersion;

        setData(prev => ({
          ...prev,
          ...imported
        }));

        localStorage.setItem('bk_app_data', JSON.stringify(imported));
        alert('✅ ডেটা সফলভাবে আমদানি করা হয়েছে!');
      } catch (error) {
        alert('❌ ফাইল আমদানিতে ত্রুটি: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (confirm('⚠️ সব ডেটা মুছে ফেলবেন? এটি ফিরিয়ে আনা যাবে না!')) {
      if (confirm('একবার আরও নিশ্চিত করুন - সব কিছু চলে যাবে')) {
        localStorage.clear();
        setData({
          transactions: [],
          budgets: {},
          bills: [],
          goals: [],
          accounts: [],
          loans: [],
          investments: [],
          recurringTransactions: [],
          mobilePayments: [],
          budgetPlans: [],
          assets: [],
          liabilities: []
        });
        alert('✅ সব ডেটা মুছে ফেলা হয়েছে');
      }
    }
  };

  return (
    <div className="space-y-6 font-[Hind Siliguri]">
      {/* ট্যাব নেভিগেশন */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'general', label: '⚙️ সাধারণ' },
          { id: 'appearance', label: '🎨 চেহারা' },
          { id: 'backup', label: '💾 ব্যাকআপ' },
          { id: 'info', label: 'ℹ️ তথ্য' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* সাধারণ সেটিংস */}
      {activeTab === 'general' && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-bold">⚙️ সাধারণ সেটিংস</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ভাষা</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="bn">বাংলা</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">মুদ্রা</label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="৳">টাকা (৳)</option>
                <option value="$">ডলার ($)</option>
                <option value="€">ইউরো (€)</option>
                <option value="₹">টাকা (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">তারিখের ফর্ম্যাট</label>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="dd/mm/yyyy">দিন/মাস/বছর (31/12/2025)</option>
                <option value="mm/dd/yyyy">মাস/দিন/বছর (12/31/2025)</option>
                <option value="yyyy-mm-dd">বছর-মাস-দিন (2025-12-31)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">কম ব্যালেন্স সতর্কতা (৳)</label>
              <input
                type="number"
                value={settings.lowBalanceAlert}
                onChange={(e) => handleSettingChange('lowBalanceAlert', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">এই পরিমাণের নিচে গেলে সতর্কতা পাবেন</p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="notifications"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="notifications" className="flex-1 font-medium cursor-pointer">
                📢 বিজ্ঞপ্তি সক্ষম করুন
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="tutorials"
                checked={settings.showTutorials}
                onChange={(e) => handleSettingChange('showTutorials', e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="tutorials" className="flex-1 font-medium cursor-pointer">
                📚 সাহায্য এবং টিউটোরিয়াল দেখান
              </label>
            </div>
          </div>
        </div>
      )}

      {/* চেহারা সেটিংস */}
      {activeTab === 'appearance' && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-bold">🎨 চেহারা এবং থিম</h3>

          <div>
            <label className="block text-sm font-medium mb-3">থিম নির্বাচন করুন</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: '☀️ হালকা', color: 'bg-gray-50 border-gray-300' },
                { id: 'dark', label: '🌙 গাঢ়', color: 'bg-gray-900 border-gray-700' },
                { id: 'auto', label: '🔄 স্বয়ংক্রিয়', color: 'bg-gradient-to-br from-gray-50 to-gray-900 border-gray-400' }
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => handleSettingChange('theme', theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === theme.id
                      ? 'border-emerald-500 ring-2 ring-emerald-200'
                      : 'border-gray-200'
                  } ${theme.color}`}
                >
                  <p className="font-bold">{theme.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-700">💡 আপনার পছন্দের থিম বেছে নিন। গাঢ় থিম রাত্রিতে চোখের জন্য ভালো।</p>
          </div>
        </div>
      )}

      {/* ব্যাকআপ সেটিংস */}
      {activeTab === 'backup' && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-bold">💾 ডেটা ব্যাকআপ এবং পুনরুদ্ধার</h3>

          <div className="space-y-4">
            {/* স্বয়ংক্রিয় ব্যাকআপ */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="autoBackup"
                  checked={settings.autoBackup}
                  onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="autoBackup" className="font-bold cursor-pointer flex-1">
                  🤖 স্বয়ংক্রিয় ব্যাকআপ
                </label>
              </div>
              {settings.autoBackup && (
                <div>
                  <label className="block text-sm mb-2">ফ্রিকোয়েন্সি:</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
                  >
                    <option value="daily">প্রতিদিন</option>
                    <option value="weekly">প্রতি সপ্তাহ</option>
                    <option value="monthly">প্রতি মাসে</option>
                  </select>
                </div>
              )}
            </div>

            {/* ম্যানুয়াল ব্যাকআপ */}
            <button
              onClick={handleExportAllData}
              className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors font-bold flex items-center justify-center gap-2"
            >
              📥 এখনই ব্যাকআপ করুন
            </button>

            {/* ডেটা পুনরুদ্ধার */}
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="importFile"
              />
              <label
                htmlFor="importFile"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                📤 ব্যাকআপ থেকে পুনরুদ্ধার করুন
              </label>
            </div>

            {/* সতর্কতা */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-700">
                ⚠️ <strong>গুরুত্বপূর্ণ:</strong> নিয়মিত ব্যাকআপ নিন। আমদানির সময় বর্তমান ডেটা প্রতিস্থাপিত হবে।
              </p>
            </div>

            {/* ডেটা মুছে ফেলা */}
            <button
              onClick={handleClearAllData}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-bold"
            >
              🗑️ সব ডেটা মুছে ফেলুন
            </button>
          </div>
        </div>
      )}

      {/* তথ্য */}
      {activeTab === 'info' && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-bold">ℹ️ অ্যাপ্লিকেশন তথ্য</h3>

          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">অ্যাপ নাম</p>
              <p className="font-bold">জমা-খরচ ৩৬০</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">সংস্করণ</p>
              <p className="font-bold">2.0</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">প্রকাশিত</p>
              <p className="font-bold">জানুয়ারি ২০২৫</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">লাইসেন্স</p>
              <p className="font-bold">মুক্ত ব্যবহারের জন্য</p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600 mb-2">🌟 বৈশিষ্ট্য:</p>
              <ul className="text-sm space-y-1 list-disc list-inside text-blue-700">
                <li>26+ আধুনিক আর্থিক সরঞ্জাম</li>
                <li>স্বয়ংক্রিয় লেনদেন ট্র্যাকিং</li>
                <li>বুদ্ধিমান পূর্বাভাস</li>
                <li>সম্পূর্ণ গোপনীয়তা (অফলাইন)</li>
                <li>মোবাইল-বান্ধব</li>
                <li>বিনা খরচে ব্যবহার</li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg">
              <p className="text-sm font-bold text-emerald-700 mb-2">✨ আপনার আর্থিক লক্ষ্য অর্জনে আমরা আপনার সাথে আছি।</p>
              <p className="text-xs text-emerald-600">প্রতিটি টাকা গুরুত্বপূর্ণ। প্রতিটি সিদ্ধান্ত গণনা করা হয়।</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
