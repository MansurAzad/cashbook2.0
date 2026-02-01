/**
 * iOS-Optimized Page Cards & UI Components
 * Universal iOS design patterns for all pages
 */

// ============= BUDGET CARD iOS STYLE =============
function BudgetCardiOS({ budget, spent, remaining, onEdit, onDelete }) {
    const percentage = Math.min((spent / budget.limit) * 100, 100);
    const isOverBudget = spent > budget.limit;
    const color = isOverBudget ? 'red' : percentage > 80 ? 'orange' : 'emerald';
    
    const colorClasses = {
        red: { bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-500', text: 'text-red-600' },
        orange: { bg: 'bg-orange-50', border: 'border-orange-200', bar: 'bg-orange-500', text: 'text-orange-600' },
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500', text: 'text-emerald-600' }
    };
    
    const colors = colorClasses[color];

    return (
        <iOSCard backgroundColor="white" className={`${colors.bg} border-2 ${colors.border}`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{budget.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{budget.category}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={onEdit} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                        <div className="icon-pencil text-gray-600"></div>
                    </button>
                    <button onClick={onDelete} className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                        <div className="icon-trash-2 text-red-600"></div>
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">খরচ</span>
                    <span className={`text-sm font-bold ${colors.text}`}>{percentage.toFixed(0)}%</span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Amount Info */}
            <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-white/50 rounded-xl">
                    <p className="text-xs text-gray-600 font-bold mb-1">সীমা</p>
                    <p className="text-lg font-bold text-gray-900">৳{budget.limit}</p>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-xl">
                    <p className="text-xs text-gray-600 font-bold mb-1">খরচ</p>
                    <p className={`text-lg font-bold ${colors.text}`}>৳{spent}</p>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-xl">
                    <p className="text-xs text-gray-600 font-bold mb-1">বাকি</p>
                    <p className="text-lg font-bold text-emerald-600">৳{remaining}</p>
                </div>
            </div>

            {isOverBudget && (
                <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-bold text-red-700">⚠️ বাজেট অতিক্রম করেছেন!</p>
                </div>
            )}
        </iOSCard>
    );
}

// ============= GOAL CARD iOS STYLE =============
function GoalCardiOS({ goal, achieved, onEdit, onDelete, onContribute }) {
    const percentage = Math.min((achieved / goal.target) * 100, 100);
    const remaining = Math.max(goal.target - achieved, 0);
    
    return (
        <iOSGradientCard
            gradientFrom="from-purple-500"
            gradientTo="to-pink-500"
            onClick={onEdit}
            interactive={true}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{goal.name}</h3>
                    <p className="text-white/80 text-sm mt-1">{goal.description}</p>
                </div>
                <div className="text-3xl">{goal.icon || '🎯'}</div>
            </div>

            {/* Progress */}
            <div className="mb-4">
                <div className="h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-white">{percentage.toFixed(0)}%</span>
                    <span className="text-xs text-white/80">অবশেষ: ৳{remaining}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-xs text-white/80 font-bold">লক্ষ্য</p>
                    <p className="text-lg font-bold text-white">৳{goal.target}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-xs text-white/80 font-bold">সংগৃহীত</p>
                    <p className="text-lg font-bold text-white">৳{achieved}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onContribute?.();
                    }}
                    className="flex-1 bg-white text-purple-600 font-bold py-2.5 rounded-lg hover:bg-white/90 transition-all active:scale-95"
                >
                    যোগ করুন
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.();
                    }}
                    className="px-4 py-2.5 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-all active:scale-95"
                >
                    <div className="icon-trash-2"></div>
                </button>
            </div>
        </iOSGradientCard>
    );
}

// ============= BILL CARD iOS STYLE =============
function BillCardiOS({ bill, onPay, onEdit, onDelete }) {
    const isUpcoming = new Date(bill.dueDate) > new Date();
    const daysLeft = Math.ceil((new Date(bill.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    return (
        <iOSCard className={`border-l-4 ${isUpcoming ? 'border-l-orange-500 bg-orange-50' : 'border-l-emerald-500 bg-emerald-50'}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                    <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-lg
                        ${isUpcoming ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}
                    `}>
                        <div className="icon-file-text"></div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{bill.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{bill.category}</p>
                    </div>
                </div>
                <span className={`
                    text-lg font-bold px-3 py-1.5 rounded-full text-sm
                    ${isUpcoming ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}
                `}>
                    ৳{bill.amount}
                </span>
            </div>

            {/* Due Date */}
            <div className="p-3 bg-white/50 rounded-lg mb-4">
                <p className="text-xs text-gray-600 font-bold mb-1">ঋণের তারিখ</p>
                <p className="text-sm font-bold text-gray-900">{new Date(bill.dueDate).toLocaleDateString('bn-BD')}</p>
                <p className={`text-xs font-bold mt-1 ${daysLeft <= 3 ? 'text-red-600' : 'text-orange-600'}`}>
                    {daysLeft <= 0 ? '⚠️ অতিদেয়' : `${daysLeft} দিন বাকি`}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={onPay}
                    className={`
                        flex-1 py-2.5 rounded-lg font-bold transition-all active:scale-95
                        ${isUpcoming
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        }
                    `}
                >
                    পেমেন্ট করুন
                </button>
                <button onClick={onEdit} className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all">
                    <div className="icon-pencil"></div>
                </button>
                <button onClick={onDelete} className="px-4 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all">
                    <div className="icon-trash-2"></div>
                </button>
            </div>
        </iOSCard>
    );
}

// ============= INVESTMENT CARD iOS STYLE =============
function InvestmentCardiOS({ investment, currentValue, onEdit, onDelete }) {
    const gain = currentValue - investment.amount;
    const gainPercentage = (gain / investment.amount) * 100;
    const isPositive = gain >= 0;
    
    return (
        <iOSCard className={`border-2 ${isPositive ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{investment.type}</h3>
                    <p className="text-sm text-gray-600 mt-1">{investment.description}</p>
                </div>
                <div className="text-right">
                    <p className={`text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{gainPercentage.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* Value Comparison */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-white/50 rounded-xl">
                    <p className="text-xs text-gray-600 font-bold mb-1">বিনিয়োগ</p>
                    <p className="text-lg font-bold text-gray-900">৳{investment.amount}</p>
                </div>
                <div className={`p-3 rounded-xl ${isPositive ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    <p className="text-xs font-bold mb-1">বর্তমান মূল্য</p>
                    <p className={`text-lg font-bold ${isPositive ? 'text-emerald-700' : 'text-red-700'}`}>৳{currentValue}</p>
                </div>
            </div>

            {/* Gain */}
            <div className={`p-3 rounded-xl mb-4 border-l-4 ${isPositive ? 'bg-emerald-100 border-l-emerald-500' : 'bg-red-100 border-l-red-500'}`}>
                <p className="text-xs font-bold text-gray-700">লাভ/ক্ষতি</p>
                <p className={`text-lg font-bold mt-1 ${isPositive ? 'text-emerald-700' : 'text-red-700'}`}>
                    {isPositive ? '+' : ''}৳{gain.toFixed(2)}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button onClick={onEdit} className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all">
                    এডিট
                </button>
                <button onClick={onDelete} className="flex-1 py-2.5 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-all">
                    মুছুন
                </button>
            </div>
        </iOSCard>
    );
}

// ============= LOAN CARD iOS STYLE =============
function LoanCardiOS({ loan, remainingBalance, onPay, onEdit, onDelete }) {
    const totalPaid = loan.amount - remainingBalance;
    const paymentPercentage = (totalPaid / loan.amount) * 100;
    
    return (
        <iOSCard className="border-2 border-blue-200 bg-blue-50">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{loan.lenderName}</h3>
                    <p className="text-sm text-gray-600 mt-1">সুদের হার: {loan.interestRate}%</p>
                </div>
                <div className="text-right text-blue-600 font-bold">
                    <p className="text-2xl">{paymentPercentage.toFixed(0)}%</p>
                    <p className="text-xs text-gray-600">পরিশোধিত</p>
                </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
                <div className="h-2.5 bg-blue-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${paymentPercentage}%` }}
                    />
                </div>
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-white/50 rounded-xl">
                    <p className="text-xs text-gray-600 font-bold mb-1">মূল পরিমাণ</p>
                    <p className="text-lg font-bold text-gray-900">৳{loan.amount}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                    <p className="text-xs text-blue-700 font-bold mb-1">অবশিষ্ট</p>
                    <p className="text-lg font-bold text-blue-700">৳{remainingBalance}</p>
                </div>
            </div>

            {/* Next Payment */}
            {loan.nextPaymentDate && (
                <div className="p-3 bg-white/50 rounded-xl mb-4">
                    <p className="text-xs text-gray-600 font-bold mb-1">পরবর্তী পেমেন্ট</p>
                    <p className="text-sm font-bold text-gray-900">{new Date(loan.nextPaymentDate).toLocaleDateString('bn-BD')}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={onPay}
                    className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all"
                >
                    পেমেন্ট করুন
                </button>
                <button onClick={onEdit} className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all">
                    <div className="icon-pencil"></div>
                </button>
                <button onClick={onDelete} className="px-4 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all">
                    <div className="icon-trash-2"></div>
                </button>
            </div>
        </iOSCard>
    );
}

// ============= ACCOUNT CARD iOS STYLE =============
function AccountCardiOS({ account, balance, onSelect, onEdit, onDelete }) {
    const accountTypeIcon = {
        'বাংক': '🏦',
        'নগদ': '💵',
        'সেভিংস': '🏧',
        'ক্রেডিট': '💳',
        'মোবাইল ব্যাংক': '📱'
    };
    
    return (
        <iOSCard
            onClick={onSelect}
            interactive={true}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 text-white"
        >
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-sm text-gray-400 font-bold mb-2 uppercase tracking-wider">অ্যাকাউন্ট</p>
                    <h3 className="text-2xl font-bold text-white">{account.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{account.type}</p>
                </div>
                <span className="text-4xl">{accountTypeIcon[account.type] || '💰'}</span>
            </div>

            {/* Balance */}
            <div className="mb-6 pb-6 border-b border-gray-700">
                <p className="text-sm text-gray-400 font-bold mb-2">ব্যালেন্স</p>
                <p className="text-3xl font-black text-white">৳{balance.toLocaleString('bn-BD')}</p>
            </div>

            {/* Card Details */}
            <div className="text-xs text-gray-400 mb-6 space-y-1">
                <p>আপডেট: {account.lastUpdated || 'আজ'}</p>
                {account.accountNumber && <p>অ্যাকাউন্ট: ****{account.accountNumber.slice(-4)}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.();
                    }}
                    className="flex-1 py-2.5 bg-white/20 text-white rounded-lg font-bold hover:bg-white/30 transition-all active:scale-95"
                >
                    এডিট
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.();
                    }}
                    className="px-4 py-2.5 bg-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500/30 transition-all active:scale-95"
                >
                    <div className="icon-trash-2"></div>
                </button>
            </div>
        </iOSCard>
    );
}

// ============= QUICK STAT CARD iOS STYLE =============
function QuickStatCardiOS({ title, value, subtitle, icon, color = 'emerald', onClick }) {
    const colorClasses = {
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        red: 'bg-red-50 text-red-600 border-red-200',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        orange: 'bg-orange-50 text-orange-600 border-orange-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200'
    };

    return (
        <iOSCard
            onClick={onClick}
            interactive={!!onClick}
            className={`border-2 ${colorClasses[color]}`}
        >
            <div className="flex items-start gap-4">
                <div className="text-3xl">{icon}</div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-gray-900">{value}</h3>
                    {subtitle && <p className="text-xs text-gray-600 mt-2">{subtitle}</p>}
                </div>
            </div>
        </iOSCard>
    );
}
