// স্মার্ট বিলিং সিস্টেম - বিল পরিচালনা এবং রিমাইন্ডার

const SmartBillingSystem = ({ data, setData }) => {
  const [bills, setBills] = React.useState(data.bills || []);
  const [showForm, setShowForm] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState('all'); // all, pending, paid, overdue
  const [formData, setFormData] = React.useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'ইউটিলিটি',
    status: 'pending',
    notes: ''
  });

  const categories = [
    { name: 'বিদ্যুৎ', icon: '⚡', color: 'bg-yellow-100' },
    { name: 'জল', icon: '💧', color: 'bg-blue-100' },
    { name: 'গ্যাস', icon: '🔥', color: 'bg-orange-100' },
    { name: 'ইন্টারনেট', icon: '📡', color: 'bg-purple-100' },
    { name: 'ফোন', icon: '📱', color: 'bg-pink-100' },
    { name: 'বীমা', icon: '🛡️', color: 'bg-red-100' },
    { name: 'ঋণ', icon: '🏦', color: 'bg-green-100' },
    { name: 'অন্যান্য', icon: '📋', color: 'bg-gray-100' }
  ];

  const handleAddBill = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.amount || !formData.dueDate) {
      alert('সব বাধ্যতামূলক ফিল্ড পূরণ করুন');
      return;
    }

    const newBill = {
      id: Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount),
      createdDate: new Date().toISOString().split('T')[0],
      paidDate: null,
      remindersSent: 0
    };

    const updated = [...bills, newBill];
    setBills(updated);
    setData(prev => ({
      ...prev,
      bills: updated
    }));

    setFormData({
      name: '',
      amount: '',
      dueDate: '',
      category: 'ইউটিলিটি',
      status: 'pending',
      notes: ''
    });
    setShowForm(false);
  };

  const handlePayBill = (id) => {
    const updated = bills.map(bill => 
      bill.id === id 
        ? { ...bill, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
        : bill
    );

    setBills(updated);
    
    // স্বয়ংক্রিয় লেনদেন তৈরি করুন
    const bill = bills.find(b => b.id === id);
    if (bill) {
      const transaction = {
        id: Date.now().toString(),
        description: `বিল পরিশোধ: ${bill.name}`,
        amount: bill.amount,
        category: bill.category,
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      };

      setData(prev => ({
        ...prev,
        bills: updated,
        transactions: [...(prev.transactions || []), transaction]
      }));
    }
  };

  const handleDeleteBill = (id) => {
    if (confirm('এই বিল মুছতে চান?')) {
      const updated = bills.filter(b => b.id !== id);
      setBills(updated);
      setData(prev => ({
        ...prev,
        bills: updated
      }));
    }
  };

  const getFilteredBills = () => {
    const today = new Date().toISOString().split('T')[0];
    
    return bills.filter(bill => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'pending') {
        return bill.status === 'pending' && bill.dueDate >= today;
      }
      if (filterStatus === 'overdue') {
        return bill.status === 'pending' && bill.dueDate < today;
      }
      return bill.status === filterStatus;
    });
  };

  const getBillStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const stats = {
      pending: 0,
      overdue: 0,
      paid: 0,
      totalDue: 0,
      upcoming: 0
    };

    bills.forEach(bill => {
      if (bill.status === 'paid') {
        stats.paid += 1;
      } else if (bill.dueDate < today) {
        stats.overdue += 1;
        stats.totalDue += bill.amount;
      } else {
        stats.pending += 1;
        stats.totalDue += bill.amount;
        if (bill.dueDate >= today) {
          stats.upcoming += 1;
        }
      }
    });

    return stats;
  };

  const filteredBills = getFilteredBills();
  const stats = getBillStats();

  return (
    <div className="space-y-6 font-[Hind Siliguri]">
      {/* শিরোনাম এবং বোতাম */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📋 স্মার্ট বিলিং সিস্টেম</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          {showForm ? '❌ বাতিল' : '➕ নতুন বিল'}
        </button>
      </div>

      {/* পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600">মোট বিল</p>
          <p className="text-2xl font-bold text-blue-600">{bills.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-xs text-gray-600">অপেক্ষমান</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-xs text-gray-600">মেয়াদোত্তীর্ণ</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-xs text-gray-600">প্রদত্ত</p>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-xs text-gray-600">মোট বকেয়া</p>
          <p className="text-xl font-bold text-purple-600">৳{stats.totalDue.toLocaleString('bn-BD')}</p>
        </div>
      </div>

      {/* বিল যোগ করার ফর্ম */}
      {showForm && (
        <form onSubmit={handleAddBill} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="বিলের নাম"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />

            <input
              type="number"
              placeholder="পরিমাণ (৳)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />

            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <textarea
              placeholder="নোট (ঐচ্ছিক)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg resize-none"
              rows="2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
          >
            বিল যোগ করুন
          </button>
        </form>
      )}

      {/* ফিল্টার ট্যাব */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'সব', icon: '📋' },
          { id: 'pending', label: 'অপেক্ষমান', icon: '⏳' },
          { id: 'overdue', label: 'মেয়াদোত্তীর্ণ', icon: '🚨' },
          { id: 'paid', label: 'প্রদত্ত', icon: '✅' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setFilterStatus(filter.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              filterStatus === filter.id
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>

      {/* বিলের তালিকা */}
      <div className="space-y-3">
        {filteredBills.length === 0 ? (
          <p className="text-gray-500 text-center py-8">কোনো বিল নেই</p>
        ) : (
          filteredBills.map(bill => {
            const category = categories.find(c => c.name === bill.category);
            const today = new Date().toISOString().split('T')[0];
            const daysLeft = Math.ceil((new Date(bill.dueDate) - new Date(today)) / (1000 * 60 * 60 * 24));
            const isOverdue = bill.status === 'pending' && bill.dueDate < today;

            return (
              <BillCard
                key={bill.id}
                bill={bill}
                category={category}
                daysLeft={daysLeft}
                isOverdue={isOverdue}
                onPay={handlePayBill}
                onDelete={handleDeleteBill}
              />
            );
          })
        )}
      </div>

      {/* আসন্ন বিল সম্পর্কিত সতর্কতা */}
      {stats.overdue > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="font-bold text-red-700">🚨 মনোযোগ প্রয়োজন</p>
          <p className="text-red-600">{stats.overdue}টি বিল মেয়াদোত্তীর্ণ হয়েছে। অবিলম্বে পরিশোধ করুন।</p>
        </div>
      )}
    </div>
  );
};

// বিল কার্ড কম্পোনেন্ট
const BillCard = ({ bill, category, daysLeft, isOverdue, onPay, onDelete }) => {
  const bgColor = bill.status === 'paid' 
    ? 'bg-green-50 border-green-200' 
    : isOverdue 
    ? 'bg-red-50 border-red-200'
    : daysLeft <= 3
    ? 'bg-yellow-50 border-yellow-200'
    : 'bg-white border-gray-200';

  return (
    <div className={`border rounded-lg p-4 ${bgColor}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3 flex-1">
          <div className={`text-2xl p-2 rounded-lg ${category?.color}`}>
            {category?.icon}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg">{bill.name}</h4>
            <p className="text-sm text-gray-600">{bill.category}</p>
            {bill.notes && <p className="text-xs text-gray-500 mt-1">📝 {bill.notes}</p>}
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-600">৳{bill.amount.toLocaleString('bn-BD')}</p>
          {bill.status === 'paid' ? (
            <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded inline-block mt-1">✅ প্রদত্ত</span>
          ) : isOverdue ? (
            <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded inline-block mt-1">🚨 মেয়াদোত্তীর্ণ</span>
          ) : daysLeft <= 3 ? (
            <span className="text-xs bg-yellow-200 text-yellow-700 px-2 py-1 rounded inline-block mt-1">⏰ {daysLeft} দিন বাকি</span>
          ) : (
            <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded inline-block mt-1">📅 {daysLeft} দিন</span>
          )}
        </div>
      </div>

      {/* তারিখ তথ্য */}
      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm text-gray-600">
        <div>
          <p>নির্ধারিত: {new Date(bill.dueDate).toLocaleDateString('bn-BD')}</p>
        </div>
        {bill.status === 'paid' && (
          <div>
            <p>প্রদত্ত: {new Date(bill.paidDate).toLocaleDateString('bn-BD')}</p>
          </div>
        )}
      </div>

      {/* অ্যাকশন বোতাম */}
      <div className="mt-3 flex gap-2">
        {bill.status !== 'paid' && (
          <button
            onClick={() => onPay(bill.id)}
            className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium text-sm"
          >
            প্রদত্ত করুন
          </button>
        )}
        <button
          onClick={() => onDelete(bill.id)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
