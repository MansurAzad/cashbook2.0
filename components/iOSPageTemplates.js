/**
 * Page Template Generator - iOS Optimized
 * সমস্ত পেজের জন্য সামঞ্জস্যপূর্ণ iOS টেমপ্লেট
 */

// ============= Dashboard Template =============
function DashboardiOS({ data, onNavigate, onRefresh }) {
    const { income, expense } = DataManager.calculateTotals(data.transactions);
    const balance = income - expense;
    const financialHealth = DataManager.getFinancialHealth(data);
    const [chartType, setChartType] = React.useState('doughnut');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
    };

    React.useEffect(() => {
        const ctx = document.getElementById('dashboardChart')?.getContext('2d');
        if (!ctx) return;
        
        const expenseByCategory = data.transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => {
                acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
                return acc;
            }, {});

        const chart = new ChartJS(ctx, {
            type: chartType,
            data: {
                labels: Object.keys(expenseByCategory),
                datasets: [{
                    label: 'খরচ',
                    data: Object.values(expenseByCategory),
                    backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'],
                    borderRadius: 12,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', display: chartType === 'doughnut', labels: { font: { size: 12, weight: '600' }, padding: 15, usePointStyle: true } } }
            }
        });

        return () => chart.destroy();
    }, [data, chartType]);

    return (
        <PullToRefresh onRefresh={onRefresh}>
            <div className="px-6 pb-10 space-y-6" data-name="dashboard">
                {/* নেট ওয়ার্থ গ্রেডিয়েন্ট কার্ড */}
                <iOSGradientCard gradientFrom="from-gray-900" gradientTo="to-black" interactive={true} onClick={() => alert('নেট ওয়ার্থ: ' + formatCurrency(financialHealth.netWorth))}>
                    <p className="text-gray-400 text-xs font-bold mb-2 uppercase">নেট ওয়ার্থ</p>
                    <h2 className="text-4xl font-black text-white mb-4">{formatCurrency(financialHealth.netWorth)}</h2>
                    <div className="flex gap-3">
                        <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                            <p className="text-emerald-400 font-bold">{financialHealth.savingsRate.toFixed(1)}% সেভিংস</p>
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                            <p className={financialHealth.score > 70 ? 'text-emerald-400 font-bold' : 'text-yellow-400 font-bold'}>{Math.round(financialHealth.score)}/100 স্কোর</p>
                        </div>
                    </div>
                </iOSGradientCard>

                {/* দ্রুত পরিসংখ্যান */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <QuickStatCardiOS title="আয়" value={formatCurrency(income)} icon="📈" color="emerald" onClick={() => onNavigate('transactions', { type: 'income' })} />
                    <QuickStatCardiOS title="খরচ" value={formatCurrency(expense)} icon="📉" color="red" onClick={() => onNavigate('transactions', { type: 'expense' })} />
                    <QuickStatCardiOS title="ব্যালেন্স" value={formatCurrency(balance)} icon="💰" color="blue" />
                </div>

                {/* সাম্প্রতিক লেনদেন */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">সাম্প্রতিক</h3>
                    {data.transactions.length === 0 ? (
                        <iOSEmptyState icon="📋" title="কোন লেনদেন নেই" action={<iOSFilledButton onClick={() => onNavigate('transactions', { action: 'add' })}>নতুন যোগ করুন</iOSFilledButton>} />
                    ) : (
                        <div className="space-y-2">
                            {data.transactions.slice(0, 5).map(t => (
                                <iOSCard key={t.id} padded={false}>
                                    <div className="px-6 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{t.type === 'income' ? '↓' : '↑'}</div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{t.category}</p>
                                                <p className="text-xs text-gray-500">{t.date}</p>
                                            </div>
                                        </div>
                                        <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}</span>
                                    </div>
                                </iOSCard>
                            ))}
                        </div>
                    )}
                </div>

                {/* চার্ট */}
                <iOSCard>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">খরচ বিশ্লেষণ</h3>
                    <div className="h-64"><canvas id="dashboardChart"></canvas></div>
                </iOSCard>

                <div className="h-4"></div>
            </div>
        </PullToRefresh>
    );
}

// ============= Goals Template =============
function GoalsiOS({ data, onAdd, onUpdate, onDelete }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [formData, setFormData] = React.useState({ name: '', target: '', description: '' });

    const handleAdd = async () => {
        if (!formData.name || !formData.target) return;
        await onAdd(formData);
        setFormData({ name: '', target: '', description: '' });
        setIsAdding(false);
    };

    return (
        <div className="px-6 pb-10 space-y-6" data-name="goals">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">লক্ষ্য</h1>
                <iOSFilledButton onClick={() => setIsAdding(true)} icon={<div className="icon-plus"></div>} color="emerald">নতুন</iOSFilledButton>
            </div>

            {/* Add Goal Modal */}
            {isAdding && (
                <iOSSheet isOpen={isAdding} onClose={() => setIsAdding(false)} title="নতুন লক্ষ্য যোগ করুন" actions={[<iOSFilledButton key="s" onClick={handleAdd} fullWidth>যোগ করুন</iOSFilledButton>]}>
                    <iOSTextField label="লক্ষ্যের নাম" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
                    <iOSTextField label="লক্ষ্য পরিমাণ" type="number" value={formData.target} onChange={(v) => setFormData({...formData, target: v})} />
                </iOSSheet>
            )}

            {/* Goals List */}
            {data.goals.length === 0 ? (
                <iOSEmptyState icon="🎯" title="কোন লক্ষ্য নেই" action={<iOSFilledButton onClick={() => setIsAdding(true)}>প্রথম লক্ষ্য তৈরি করুন</iOSFilledButton>} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.goals.map(goal => (
                        <GoalCardiOS key={goal.id} goal={goal} achieved={goal.amount || 0} onEdit={() => {}} onDelete={() => onDelete(goal.id)} onContribute={() => {}} />
                    ))}
                </div>
            )}

            <div className="h-4"></div>
        </div>
    );
}

// ============= Bills Template =============
function BillsiOS({ data, onAdd, onDelete, onPayment }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [formData, setFormData] = React.useState({ name: '', amount: '', dueDate: '', category: '' });

    const handleAdd = async () => {
        if (!formData.name || !formData.amount) return;
        await onAdd(formData);
        setFormData({ name: '', amount: '', dueDate: '', category: '' });
        setIsAdding(false);
    };

    return (
        <div className="px-6 pb-10 space-y-6" data-name="bills">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">বিল</h1>
                <iOSFilledButton onClick={() => setIsAdding(true)} icon={<div className="icon-plus"></div>} color="emerald">নতুন</iOSFilledButton>
            </div>

            {/* Add Bill Modal */}
            {isAdding && (
                <iOSSheet isOpen={isAdding} onClose={() => setIsAdding(false)} title="নতুন বিল যোগ করুন" actions={[<iOSFilledButton key="s" onClick={handleAdd} fullWidth>যোগ করুন</iOSFilledButton>]}>
                    <iOSTextField label="বিলের নাম" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
                    <iOSTextField label="পরিমাণ" type="number" value={formData.amount} onChange={(v) => setFormData({...formData, amount: v})} />
                    <iOSTextField label="ঋণের তারিখ" type="date" value={formData.dueDate} onChange={(v) => setFormData({...formData, dueDate: v})} />
                </iOSSheet>
            )}

            {/* Bills List */}
            {data.bills.length === 0 ? (
                <iOSEmptyState icon="📄" title="কোন বিল নেই" action={<iOSFilledButton onClick={() => setIsAdding(true)}>প্রথম বিল যোগ করুন</iOSFilledButton>} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.bills.map(bill => (
                        <BillCardiOS key={bill.id} bill={bill} onPay={() => onPayment(bill.id)} onEdit={() => {}} onDelete={() => onDelete(bill.id)} />
                    ))}
                </div>
            )}

            <div className="h-4"></div>
        </div>
    );
}

// ============= Accounts Template =============
function AccountsiOS({ data, onAdd, onDelete }) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [formData, setFormData] = React.useState({ name: '', type: 'বাংক', balance: '' });

    const handleAdd = async () => {
        if (!formData.name || !formData.balance) return;
        await onAdd(formData);
        setFormData({ name: '', type: 'বাংক', balance: '' });
        setIsAdding(false);
    };

    return (
        <div className="px-6 pb-10 space-y-6" data-name="accounts">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">অ্যাকাউন্ট</h1>
                <iOSFilledButton onClick={() => setIsAdding(true)} icon={<div className="icon-plus"></div>} color="emerald">নতুন</iOSFilledButton>
            </div>

            {/* Add Account Modal */}
            {isAdding && (
                <iOSSheet isOpen={isAdding} onClose={() => setIsAdding(false)} title="নতুন অ্যাকাউন্ট" actions={[<iOSFilledButton key="s" onClick={handleAdd} fullWidth>যোগ করুন</iOSFilledButton>]}>
                    <iOSTextField label="অ্যাকাউন্টের নাম" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
                    <iOSPicker label="প্রকার" value={formData.type} onChange={(v) => setFormData({...formData, type: v})} options={[{label: 'বাংক', value: 'বাংক'}, {label: 'নগদ', value: 'নগদ'}]} />
                    <iOSTextField label="প্রাথমিক ব্যালেন্স" type="number" value={formData.balance} onChange={(v) => setFormData({...formData, balance: v})} />
                </iOSSheet>
            )}

            {/* Accounts List */}
            {data.accounts.length === 0 ? (
                <iOSEmptyState icon="🏦" title="কোন অ্যাকাউন্ট নেই" action={<iOSFilledButton onClick={() => setIsAdding(true)}>প্রথম অ্যাকাউন্ট যোগ করুন</iOSFilledButton>} />
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {data.accounts.map(account => (
                        <AccountCardiOS key={account.id} account={account} balance={account.balance} onSelect={() => {}} onEdit={() => {}} onDelete={() => onDelete(account.id)} />
                    ))}
                </div>
            )}

            <div className="h-4"></div>
        </div>
    );
}

// Export সব টেমপ্লেট
window.iOSPageTemplates = {
    DashboardiOS,
    GoalsiOS,
    BillsiOS,
    AccountsiOS
};
