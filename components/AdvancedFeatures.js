// 🚀 Advanced Features Module - জমা-খরচ ৩৬০ v2.5

// ==========================================
// ১. Advanced Analytics & Reporting
// ==========================================

const AdvancedAnalytics = {
  // মাসিক/বার্ষিক তুলনা
  compareMonthOnMonth: (transactions, month, year) => {
    const currentMonth = transactions.filter(txn => {
      const date = new Date(txn.date);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });
    
    const previousMonth = transactions.filter(txn => {
      const date = new Date(txn.date);
      return date.getMonth() === month - 2 && date.getFullYear() === year;
    });

    const currentSpending = currentMonth
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousSpending = previousMonth
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const percentChange = previousSpending > 0 
      ? ((currentSpending - previousSpending) / previousSpending * 100).toFixed(2)
      : 0;

    return {
      currentMonth: currentSpending,
      previousMonth: previousSpending,
      percentChange: percentChange,
      increased: currentSpending > previousSpending
    };
  },

  // ব্যয় প্রবণতা বিশ্লেষণ
  analyzeSpendingTrends: (transactions, days = 30) => {
    const trends = {};
    const now = new Date();
    const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    transactions
      .filter(t => new Date(t.date) >= pastDate && t.type === 'expense')
      .forEach(txn => {
        const category = txn.category;
        trends[category] = (trends[category] || 0) + txn.amount;
      });

    return Object.entries(trends)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({ category, amount, trend: 'up' }));
  },

  // সঞ্চয় হার গণনা
  calculateSavingsRate: (transactions, month) => {
    const monthTransactions = transactions.filter(txn => {
      const date = new Date(txn.date);
      return date.getMonth() + 1 === month;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = income - expenses;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(2) : 0;

    return {
      income,
      expenses,
      savings,
      savingsRate: parseFloat(savingsRate),
      status: savingsRate >= 20 ? 'চমৎকার' : savingsRate >= 10 ? 'ভালো' : 'প্রয়োজন উন্নতি'
    };
  },

  // বাজেট পূর্বাভাস
  forecastNextMonth: (transactions, budgets) => {
    const last3Months = transactions.slice(-90).filter(t => t.type === 'expense');
    const avgByCategory = {};

    last3Months.forEach(txn => {
      avgByCategory[txn.category] = (avgByCategory[txn.category] || 0) + txn.amount;
    });

    Object.keys(avgByCategory).forEach(cat => {
      avgByCategory[cat] = Math.round(avgByCategory[cat] / 3);
    });

    return {
      forecast: avgByCategory,
      warnings: budgets
        .filter(b => (avgByCategory[b.category] || 0) > b.limit * 0.8)
        .map(b => `${b.category}: প্রত্যাশিত অতিক্রম!`)
    };
  }
};

// ==========================================
// ২. স্মার্ট নোটিফিকেশন সিস্টেম
// ==========================================

const SmartNotifications = {
  // বাজেট সতর্কতা
  checkBudgetAlerts: (transactions, budgets) => {
    const currentMonth = new Date().getMonth() + 1;
    const alerts = [];

    budgets.forEach(budget => {
      const spent = transactions
        .filter(t => {
          const date = new Date(t.date);
          return t.type === 'expense' && 
                 t.category === budget.category && 
                 date.getMonth() + 1 === currentMonth;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage = (spent / budget.limit) * 100;

      if (percentage >= 90) {
        alerts.push({
          type: 'danger',
          title: `⚠️ বাজেট অতিক্রম`,
          message: `${budget.category}: ${spent}/${budget.limit} (${Math.round(percentage)}%)`,
          action: 'বাজেট পরিবর্তন করুন'
        });
      } else if (percentage >= 70) {
        alerts.push({
          type: 'warning',
          title: `⏰ বাজেট সতর্কতা`,
          message: `${budget.category}: ${percentage.toFixed(0)}% খরচ হয়েছে`,
          action: 'ব্যয় কমানোর চিন্তা করুন'
        });
      }
    });

    return alerts;
  },

  // আসন্ন বিল অনুস্মারক
  getBillReminders: (bills) => {
    const reminders = [];
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    bills
      .filter(bill => {
        const billDate = new Date(bill.dueDate);
        return billDate >= today && billDate <= nextWeek;
      })
      .forEach(bill => {
        reminders.push({
          type: 'info',
          title: `📅 আসন্ন বিল`,
          message: `${bill.name}: ৳${bill.amount} পরিশোধ করতে হবে`,
          dueDate: bill.dueDate
        });
      });

    return reminders;
  },

  // মাসিক সারাংশ
  generateMonthlySummary: (transactions, month) => {
    const monthData = transactions.filter(txn => {
      const date = new Date(txn.date);
      return date.getMonth() + 1 === month;
    });

    const income = monthData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const topCategories = {};
    monthData
      .filter(t => t.type === 'expense')
      .forEach(t => {
        topCategories[t.category] = (topCategories[t.category] || 0) + t.amount;
      });

    const sorted = Object.entries(topCategories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      month: month,
      income: income,
      expenses: expenses,
      savings: income - expenses,
      topSpendingCategories: sorted,
      summary: `এই মাসে ${income} টাকা আয় এবং ${expenses} টাকা খরচ হয়েছে। নিট সঞ্চয়: ${income - expenses} টাকা।`
    };
  }
};

// ==========================================
// ৩. উন্নত অনুসন্ধান এবং ফিল্টার
// ==========================================

const AdvancedSearch = {
  // সম্পূর্ণ অনুসন্ধান
  searchTransactions: (transactions, query) => {
    const lowerQuery = query.toLowerCase();
    
    return transactions.filter(t => 
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery) ||
      t.amount.toString().includes(query) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  },

  // পরিসর ফিল্টার
  filterByRange: (transactions, minAmount, maxAmount, startDate, endDate) => {
    return transactions.filter(t => {
      const txnDate = new Date(t.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return t.amount >= minAmount && 
             t.amount <= maxAmount &&
             txnDate >= start && 
             txnDate <= end;
    });
  },

  // স্মার্ট ক্যাটাগরি পরামর্শ
  suggestCategory: (description) => {
    const keywords = {
      'খাদ্য': ['খাদ্য', 'রেস্তোরাঁ', 'খাবার', 'দোকান'],
      'পরিবহন': ['গাড়ি', 'বাস', 'ট্যাক্সি', 'রিকশা', 'পেট্রোল'],
      'বিদ্যুৎ': ['বিদ্যুৎ', 'গ্যাস', 'পানি'],
      'বিনোদন': ['সিনেমা', 'গেমস', 'বই', 'খেলা'],
      'স্বাস্থ্য': ['ডাক্তার', 'ওষুধ', 'হাসপাতাল'],
      'শিক্ষা': ['স্কুল', 'কোর্স', 'বই', 'টিউশন']
    };

    for (const [category, keys] of Object.entries(keywords)) {
      if (keys.some(key => description.toLowerCase().includes(key))) {
        return category;
      }
    }
    
    return 'অন্যান্য';
  }
};

// ==========================================
// ৪. বিনিয়োগ ট্র্যাকিং
// ==========================================

const InvestmentTracker = {
  // বিনিয়োগ রিটার্ন গণনা
  calculateReturns: (investments) => {
    return investments.map(inv => {
      const profit = inv.currentValue - inv.investedAmount;
      const returnPercentage = (profit / inv.investedAmount) * 100;
      
      return {
        ...inv,
        profit: profit,
        returnPercentage: returnPercentage.toFixed(2),
        status: profit > 0 ? '📈 লাভজনক' : '📉 ক্ষতিকারক'
      };
    });
  },

  // পোর্টফোলিও সারাংশ
  getPortfolioSummary: (investments) => {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalReturn = totalCurrent - totalInvested;
    const returnPercentage = (totalReturn / totalInvested * 100).toFixed(2);

    return {
      totalInvested: totalInvested,
      totalCurrent: totalCurrent,
      totalReturn: totalReturn,
      returnPercentage: returnPercentage,
      profitStatus: totalReturn > 0 ? 'লাভজনক' : 'ক্ষতিকারক'
    };
  }
};

// ==========================================
// ৫. ঋণ পরিশোধ ক্যালকুলেটর
// ==========================================

const DebtCalculator = {
  // পরিশোধ সময়রেখা
  calculatePayoffSchedule: (principal, interestRate, monthlyPayment) => {
    let remaining = principal;
    const schedule = [];
    let month = 0;

    while (remaining > 0 && month < 360) { // ৩০ বছর সর্বোচ্চ
      month++;
      const interest = remaining * (interestRate / 100 / 12);
      const principal_payment = monthlyPayment - interest;
      remaining -= principal_payment;

      schedule.push({
        month: month,
        payment: monthlyPayment,
        interest: interest.toFixed(2),
        principal: principal_payment.toFixed(2),
        remaining: Math.max(0, remaining).toFixed(2)
      });
    }

    return {
      totalPayments: schedule.length,
      totalMonths: schedule.length,
      totalYears: (schedule.length / 12).toFixed(1),
      totalInterestPaid: schedule.reduce((sum, s) => sum + parseFloat(s.interest), 0).toFixed(2),
      schedule: schedule.slice(0, 12) // প্রথম ১২ মাস দেখান
    };
  },

  // দ্রুত পরিশোধ পরামর্শ
  suggestAcceleratedPayoff: (principal, interestRate, monthlyPayment) => {
    const standardSchedule = DebtCalculator.calculatePayoffSchedule(principal, interestRate, monthlyPayment);
    const acceleratedPayment = monthlyPayment * 1.5; // ৫০% বেশি পরিশোধ

    const acceleratedSchedule = DebtCalculator.calculatePayoffSchedule(principal, interestRate, acceleratedPayment);

    return {
      standard: {
        months: standardSchedule.totalMonths,
        totalInterest: standardSchedule.totalInterestPaid,
        monthlyPayment: monthlyPayment
      },
      accelerated: {
        months: acceleratedSchedule.totalMonths,
        totalInterest: acceleratedSchedule.totalInterestPaid,
        monthlyPayment: acceleratedPayment,
        savings: (parseFloat(standardSchedule.totalInterestPaid) - parseFloat(acceleratedSchedule.totalInterestPaid)).toFixed(2),
        monthsSaved: standardSchedule.totalMonths - acceleratedSchedule.totalMonths
      }
    };
  }
};

// ==========================================
// ৬. কাস্টম ডেটা ফরম্যাট এবং এক্সপোর্ট
// ==========================================

const DataExport = {
  // CSV এ রূপান্তর করুন
  toCSV: (data, filename) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(val => 
        `"${val}"`
      ).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'export.csv';
    a.click();
  },

  // JSON এ রূপান্তর করুন
  toJSON: (data, filename) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'export.json';
    a.click();
  }
};

// ==========================================
// ৭. ব্যবহারকারী পছন্দ এবং সেটিংস
// ==========================================

const UserPreferences = {
  // থিম সেটিংস
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('userTheme', theme);
  },

  // ভাষা সেটিংস
  setLanguage: (language) => {
    localStorage.setItem('userLanguage', language);
  },

  // নোটিফিকেশন পছন্দ
  setNotificationPreferences: (preferences) => {
    localStorage.setItem('notificationPrefs', JSON.stringify(preferences));
  },

  // ডিফল্ট মুদ্রা
  setDefaultCurrency: (currency) => {
    localStorage.setItem('defaultCurrency', currency);
  }
};

// ==========================================
// ৮. পারফরম্যান্স অপটিমাইজেশন
// ==========================================

const PerformanceOptimization = {
  // ডেটা ক্যাশিং
  cacheData: (key, data, expiresIn = 3600000) => {
    const item = {
      data: data,
      expiry: Date.now() + expiresIn
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  },

  // ক্যাশ পুনরুদ্ধার করুন
  getCachedData: (key) => {
    const item = localStorage.getItem(`cache_${key}`);
    if (!item) return null;

    const { data, expiry } = JSON.parse(item);
    if (Date.now() > expiry) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }

    return data;
  },

  // ডেটা সংকুচিত করুন
  compressData: (data) => {
    return btoa(JSON.stringify(data)); // Base64 এনকোডিং
  },

  // ডেটা বিস্তৃত করুন
  decompressData: (compressedData) => {
    return JSON.parse(atob(compressedData));
  }
};

// ওয়েবওয়ার্কার জন্য রপ্তানি করুন
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AdvancedAnalytics,
    SmartNotifications,
    AdvancedSearch,
    InvestmentTracker,
    DebtCalculator,
    DataExport,
    UserPreferences,
    PerformanceOptimization
  };
}
