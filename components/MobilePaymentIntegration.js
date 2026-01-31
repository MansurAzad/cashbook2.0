// মোবাইল পেমেন্ট ইন্টিগ্রেশন এবং ক্যাশলেস লেনদেন

const MobilePaymentIntegration = ({ data, setData }) => {
  const [payments, setPayments] = React.useState(data.mobilePayments || []);
  const [showForm, setShowForm] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('bkash');
  const [formData, setFormData] = React.useState({
    amount: '',
    recipient: '',
    description: '',
    reference: ''
  });

  const paymentMethods = [
    { id: 'bkash', name: 'bKash', icon: '📱', color: 'bg-pink-500', percentage: 0.5 },
    { id: 'nagad', name: 'Nagad', icon: '📲', color: 'bg-orange-500', percentage: 0.3 },
    { id: 'rocket', name: 'Rocket', icon: '🚀', color: 'bg-purple-500', percentage: 0.15 },
    { id: 'upay', name: 'Upay', icon: '💳', color: 'bg-blue-500', percentage: 0.05 }
  ];

  const handleAddPayment = (e) => {
    e.preventDefault();

    if (!formData.amount) {
      alert('পরিমাণ প্রয়োজন');
      return;
    }

    const newPayment = {
      id: Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount),
      method: selectedPaymentMethod,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('bn-BD'),
      status: 'completed'
    };

    const updated = [...payments, newPayment];
    setPayments(updated);
    
    // স্বয়ংক্রিয় লেনদেন তৈরি করুন
    const transaction = {
      id: Date.now().toString(),
      description: `${formData.description} (${paymentMethods.find(p => p.id === selectedPaymentMethod)?.name})`,
      amount: parseFloat(formData.amount),
      category: 'ডিজিটাল পেমেন্ট',
      type: 'expense',
      date: newPayment.date,
      paymentMethod: selectedPaymentMethod
    };

    setData(prev => ({
      ...prev,
      mobilePayments: updated,
      transactions: [...(prev.transactions || []), transaction]
    }));

    // ফর্ম রিসেট
    setFormData({
      amount: '',
      recipient: '',
      description: '',
      reference: ''
    });
    setShowForm(false);
  };

  const getMethodStats = () => {
    const stats = {};
    paymentMethods.forEach(m => {
      stats[m.id] = {
        count: payments.filter(p => p.method === m.id).length,
        total: payments.filter(p => p.method === m.id).reduce((sum, p) => sum + p.amount, 0)
      };
    });
    return stats;
  };

  const methodStats = getMethodStats();

  return (
    <div className="space-y-6 font-[Hind Siliguri]">
      {/* শিরোনাম */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">💳 ডিজিটাল পেমেন্ট হাব</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          {showForm ? '❌ বাতিল' : '➕ নতুন পেমেন্ট'}
        </button>
      </div>

      {/* পেমেন্ট পদ্ধতি নির্বাচন */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {paymentMethods.map(method => (
          <button
            key={method.id}
            onClick={() => setSelectedPaymentMethod(method.id)}
            className={`p-4 rounded-lg transition-all font-bold ${
              selectedPaymentMethod === method.id
                ? `${method.color} text-white scale-105 shadow-lg`
                : 'bg-white border-2 border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-2xl mb-1">{method.icon}</div>
            <div className="text-sm">{method.name}</div>
          </button>
        ))}
      </div>

      {/* পেমেন্ট ফর্ম */}
      {showForm && (
        <form onSubmit={handleAddPayment} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="পরিমাণ (৳)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />

            <input
              type="text"
              placeholder="প্রাপক (নাম বা নম্বর)"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              placeholder="উদ্দেশ্য"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              placeholder="রেফারেন্স নম্বর (ঐচ্ছিক)"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
          >
            পেমেন্ট সম্পন্ন করুন
          </button>
        </form>
      )}

      {/* পদ্ধতি-ভিত্তিক পরিসংখ্যান */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {paymentMethods.map(method => (
          <div key={method.id} className={`${method.color} text-white p-4 rounded-lg`}>
            <p className="text-sm opacity-90">{method.name}</p>
            <p className="text-2xl font-bold">{methodStats[method.id].count}</p>
            <p className="text-xs opacity-75">৳{methodStats[method.id].total.toLocaleString('bn-BD')}</p>
          </div>
        ))}
      </div>

      {/* সাম্প্রতিক পেমেন্ট */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg">📋 সাম্প্রতিক পেমেন্ট</h3>
        {payments.length === 0 ? (
          <p className="text-gray-500">কোনো পেমেন্ট নেই</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {payments.slice().reverse().map(payment => {
              const method = paymentMethods.find(m => m.id === payment.method);
              return (
                <div key={payment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <span className="text-2xl">{method?.icon}</span>
                      <div>
                        <p className="font-bold">{payment.description}</p>
                        <p className="text-sm text-gray-500">{payment.recipient}</p>
                        <p className="text-xs text-gray-400">{payment.date} {payment.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-500">-৳{payment.amount.toLocaleString('bn-BD')}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ {payment.status}</span>
                    </div>
                  </div>
                  {payment.reference && (
                    <p className="text-xs text-gray-400 mt-2">রেফ: {payment.reference}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* মোবাইল পেমেন্ট টিপস */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg space-y-2">
        <h4 className="font-bold">💡 নিরাপদ পেমেন্টের টিপস</h4>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>সর্বদা ৪ ডিজিটের পিন ব্যবহার করুন</li>
          <li>জনসম্মুখে PIN প্রবেশ করবেন না</li>
          <li>নিয়মিত লেনদেনের রেকর্ড পরীক্ষা করুন</li>
          <li>অজানা লিঙ্কে ক্লিক করবেন না</li>
          <li>সর্বদা অফিসিয়াল অ্যাপ ব্যবহার করুন</li>
        </ul>
      </div>
    </div>
  );
};
