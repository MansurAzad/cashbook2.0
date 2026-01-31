function Investments({ data, onAdd, onUpdate, onDelete }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '', type: 'Stock', invested_amount: '', current_value: ''
    });

    const formatCurrency = (amount) => new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData, 
            invested_amount: parseFloat(formData.invested_amount),
            current_value: parseFloat(formData.current_value)
        };

        if (editingId) {
            await onUpdate(editingId, payload);
        } else {
            await onAdd(payload);
        }
        resetForm();
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', type: 'Stock', invested_amount: '', current_value: '' });
    };

    const handleEdit = (inv) => {
        setFormData({
            name: inv.name,
            type: inv.type,
            invested_amount: inv.invested_amount,
            current_value: inv.current_value
        });
        setEditingId(inv.id);
        setIsAdding(true);
    };

    const totalInvested = data.investments.reduce((sum, i) => sum + parseFloat(i.invested_amount || 0), 0);
    const totalCurrent = data.investments.reduce((sum, i) => sum + parseFloat(i.current_value || 0), 0);
    const totalProfit = totalCurrent - totalInvested;
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    React.useEffect(() => {
        if(data.investments.length === 0) return;
        
        const ctx = document.getElementById('allocationChart')?.getContext('2d');
        if(!ctx) return;

        const grouped = data.investments.reduce((acc, curr) => {
            acc[curr.type] = (acc[curr.type] || 0) + parseFloat(curr.current_value);
            return acc;
        }, {});

        const chart = new ChartJS(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(grouped),
                datasets: [{
                    data: Object.values(grouped),
                    backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#3B82F6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });

        return () => chart.destroy();
    }, [data.investments]);

    return (
        <div className="space-y-6 animate-fade-in" data-name="investments">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-gray-900 text-white">
                    <p className="text-gray-400 text-sm">পোর্টফোলিও ভ্যালু</p>
                    <h3 className="text-3xl font-bold mt-1">{formatCurrency(totalCurrent)}</h3>
                    <div className={`mt-3 text-sm flex items-center gap-1 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        <div className={totalProfit >= 0 ? 'icon-trending-up' : 'icon-trending-down'}></div>
                        <span>{totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)} ({profitPercentage.toFixed(2)}%)</span>
                    </div>
                </div>
                <div className="card">
                    <p className="text-gray-500 text-sm">মোট বিনিয়োগ</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(totalInvested)}</h3>
                </div>
                <div className="card relative">
                    <h4 className="text-sm font-bold text-gray-500 absolute top-4 left-4">অ্যাসেট অ্যালোকেশন</h4>
                    <div className="h-24 mt-4">
                        <canvas id="allocationChart"></canvas>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="icon-briefcase text-blue-600"></div>
                    ইনভেস্টমেন্ট পোর্টফোলিও
                </h2>
                <button onClick={() => setIsAdding(true)} className="btn btn-primary bg-blue-600 hover:bg-blue-700">
                    <div className="icon-plus"></div> ইনভেস্টমেন্ট যুক্ত করুন
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'ইনভেস্টমেন্ট আপডেট করুন' : 'নতুন ইনভেস্টমেন্ট'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="নাম (যেমন: গ্রামীণফোন শেয়ার)" className="input-field" required 
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                <option value="Stock">শেয়ার বাজার</option>
                                <option value="FDR">ফিক্সড ডিপোজিট (FDR)</option>
                                <option value="Savings Certificate">সঞ্চয়পত্র</option>
                                <option value="Gold">স্বর্ণ</option>
                                <option value="Real Estate">জমি/ফ্ল্যাট</option>
                                <option value="Other">অন্যান্য</option>
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">বিনিয়োগকৃত টাকা</label>
                                    <input type="number" placeholder="0.00" className="input-field" required 
                                        value={formData.invested_amount} onChange={e => setFormData({...formData, invested_amount: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">বর্তমান বাজার দর</label>
                                    <input type="number" placeholder="0.00" className="input-field" required 
                                        value={formData.current_value} onChange={e => setFormData({...formData, current_value: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="flex gap-2 mt-6">
                                <button type="submit" className="flex-1 btn btn-primary bg-blue-600 hover:bg-blue-700 justify-center">সংরক্ষণ</button>
                                <button type="button" onClick={resetForm} className="flex-1 btn btn-ghost justify-center bg-gray-100">বাতিল</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.investments.map(inv => {
                    const diff = parseFloat(inv.current_value) - parseFloat(inv.invested_amount);
                    const diffPercent = (diff / parseFloat(inv.invested_amount)) * 100;
                    return (
                        <div key={inv.id} className="card hover:shadow-md transition-shadow group relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-800">{inv.name}</h4>
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{inv.type}</span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        কেনা: {formatCurrency(inv.invested_amount)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">{formatCurrency(inv.current_value)}</p>
                                    <p className={`text-xs font-semibold ${diff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {diff >= 0 ? '+' : ''}{formatCurrency(diff)} ({diffPercent.toFixed(1)}%)
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(inv)} className="text-gray-400 hover:text-blue-500 text-sm flex items-center gap-1">
                                    <div className="icon-pencil text-xs"></div> এডিট
                                </button>
                                <button onClick={() => onDelete(inv.id)} className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1">
                                    <div className="icon-trash-2 text-xs"></div> মুছে ফেলুন
                                </button>
                            </div>
                        </div>
                    );
                })}
                {data.investments.length === 0 && (
                     <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="icon-trending-up text-4xl text-gray-300 mb-3 mx-auto"></div>
                        <p className="text-gray-500">পোর্টফোলিওতে কোন ইনভেস্টমেন্ট নেই</p>
                    </div>
                )}
            </div>
        </div>
    );
}