// Advanced Search & Filter Component

const AdvancedSearchFilter = ({ transactions, onFilter }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('সব');
  const [minAmount, setMinAmount] = React.useState('');
  const [maxAmount, setMaxAmount] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState([]);

  // ফিল্টার করা ফলাফল
  const filteredResults = React.useMemo(() => {
    return transactions.filter(t => {
      // অনুসন্ধান প্রশ্ন
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.category.toLowerCase().includes(searchQuery.toLowerCase());

      // ক্যাটাগরি ফিল্টার
      const matchesCategory = selectedCategory === 'সব' || t.category === selectedCategory;

      // পরিমাণ পরিসর
      const amount = t.amount;
      const matchesAmount = (!minAmount || amount >= parseFloat(minAmount)) &&
                           (!maxAmount || amount <= parseFloat(maxAmount));

      // তারিখ পরিসর
      const txnDate = new Date(t.date);
      const matchesDate = (!startDate || txnDate >= new Date(startDate)) &&
                         (!endDate || txnDate <= new Date(endDate));

      // ট্যাগ ফিল্টার
      const matchesTags = selectedTags.length === 0 || 
                         (t.tags && t.tags.some(tag => selectedTags.includes(tag)));

      return matchesSearch && matchesCategory && matchesAmount && matchesDate && matchesTags;
    });
  }, [transactions, searchQuery, selectedCategory, minAmount, maxAmount, startDate, endDate, selectedTags]);

  React.useEffect(() => {
    onFilter(filteredResults);
  }, [filteredResults]);

  // সমস্ত অনন্য ট্যাগ পান
  const allTags = React.useMemo(() => {
    const tags = new Set();
    transactions.forEach(t => {
      if (t.tags) {
        t.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [transactions]);

  // ক্যাটাগরি সংগ্রহ করুন
  const categories = React.useMemo(() => {
    const cats = new Set(['সব']);
    transactions.forEach(t => cats.add(t.category));
    return Array.from(cats);
  }, [transactions]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4 font-[Hind Siliguri]">
      <h2 className="text-xl font-bold">🔍 উন্নত অনুসন্ধান এবং ফিল্টার</h2>

      {/* অনুসন্ধান বক্স */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">অনুসন্ধান করুন</label>
        <input
          type="text"
          placeholder="বর্ণনা, ক্যাটাগরি বা পরিমাণ দিয়ে অনুসন্ধান করুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
        />
      </div>

      {/* ক্যাটাগরি নির্বাচন */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">বিভাগ</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* পরিমাণ পরিসর */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ন্যূনতম পরিমাণ</label>
          <input
            type="number"
            placeholder="০"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-base"
          />
        </div>
      </div>

      {/* তারিখ পরিসর */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">শুরু তারিখ</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">শেষ তারিখ</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* ট্যাগ নির্বাচন */}
      {allTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ট্যাগ নির্বাচন করুন</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ফলাফল সংখ্যা */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm font-medium">
          📊 {filteredResults.length} টি লেনদেন পাওয়া গেছে
        </p>
      </div>

      {/* রিসেট বোতাম */}
      <button
        onClick={() => {
          setSearchQuery('');
          setSelectedCategory('সব');
          setMinAmount('');
          setMaxAmount('');
          setStartDate('');
          setEndDate('');
          setSelectedTags([]);
        }}
        className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
      >
        রিসেট করুন
      </button>
    </div>
  );
};
