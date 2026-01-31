function CalendarView({ data }) {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const monthNames = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getDayData = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayTrans = data.transactions.filter(t => t.date === dateStr);
        const income = dayTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const expense = dayTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        return { income, expense, count: dayTrans.length };
    };

    const renderCalendarDays = () => {
        const days = [];
        // Empty slots for days before start of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 border border-gray-100"></div>);
        }
        
        // Days of month
        for (let i = 1; i <= daysInMonth; i++) {
            const { income, expense, count } = getDayData(i);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString();
            
            days.push(
                <div key={i} className={`h-24 border border-gray-100 p-2 relative group hover:bg-gray-50 transition-colors ${isToday ? 'bg-emerald-50/30' : 'bg-white'}`}>
                    <span className={`text-sm font-medium ${isToday ? 'bg-emerald-500 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700'}`}>
                        {i}
                    </span>
                    
                    {(income > 0 || expense > 0) && (
                        <div className="mt-1 space-y-1">
                            {income > 0 && (
                                <div className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded truncate">
                                    + {income}
                                </div>
                            )}
                            {expense > 0 && (
                                <div className="text-[10px] text-red-600 bg-red-50 px-1 rounded truncate">
                                    - {expense}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="space-y-6 animate-fade-in" data-name="calendar-view">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="icon-calendar-days text-emerald-600"></div>
                    ক্যালেন্ডার ভিউ
                </h2>
                <div className="flex items-center gap-4">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">
                        <div className="icon-chevron-left text-gray-600"></div>
                    </button>
                    <span className="text-lg font-semibold text-gray-800 w-32 text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
                        <div className="icon-chevron-right text-gray-600"></div>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'].map(day => (
                        <div key={day} className="py-2 text-center text-sm font-semibold text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {renderCalendarDays()}
                </div>
            </div>

            <div className="flex gap-4 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span>আজকের তারিখ</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-100 rounded border border-emerald-200"></div>
                    <span>আয়</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-100 rounded border border-red-200"></div>
                    <span>ব্যয়</span>
                </div>
            </div>
        </div>
    );
}