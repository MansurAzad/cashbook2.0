// ডেটা ভ্যালিডেশন এবং এরর হ্যান্ডলিং ইউটিলিটি

const DataValidator = {
  // লেনদেন ভ্যালিডেশন
  validateTransaction(transaction) {
    const errors = [];

    if (!transaction.date) errors.push('তারিখ প্রয়োজন');
    if (!transaction.amount || transaction.amount <= 0) errors.push('পরিমাণ ০ এর চেয়ে বেশি হতে হবে');
    if (!transaction.category) errors.push('বিভাগ প্রয়োজন');
    if (!transaction.type || !['income', 'expense'].includes(transaction.type)) errors.push('ধরন ভুল আছে');
    if (!transaction.description) errors.push('বর্ণনা প্রয়োজন');

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // বিল ভ্যালিডেশন
  validateBill(bill) {
    const errors = [];

    if (!bill.name) errors.push('বিলের নাম প্রয়োজন');
    if (!bill.amount || bill.amount <= 0) errors.push('পরিমাণ ০ এর চেয়ে বেশি হতে হবে');
    if (!bill.dueDate) errors.push('নির্ধারিত তারিখ প্রয়োজন');
    if (new Date(bill.dueDate) < new Date()) {
      // সতর্কতা, কিন্তু ত্রুটি নয়
      console.warn('⚠️ অতীতের তারিখ সেট করা হয়েছে');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // লক্ষ্য ভ্যালিডেশন
  validateGoal(goal) {
    const errors = [];

    if (!goal.name) errors.push('লক্ষ্যের নাম প্রয়োজন');
    if (!goal.targetAmount || goal.targetAmount <= 0) errors.push('লক্ষ্য পরিমাণ ০ এর চেয়ে বেশি হতে হবে');
    if (!goal.deadline) errors.push('সময়সীমা প্রয়োজন');
    if (new Date(goal.deadline) <= new Date()) errors.push('সময়সীমা ভবিষ্যতের হতে হবে');

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // পুনরাবৃত্ত লেনদেন ভ্যালিডেশন
  validateRecurring(recurring) {
    const errors = [];

    if (!recurring.description) errors.push('বর্ণনা প্রয়োজন');
    if (!recurring.amount || recurring.amount <= 0) errors.push('পরিমাণ ০ এর চেয়ে বেশি হতে হবে');
    if (!recurring.frequency) errors.push('ফ্রিকোয়েন্সি প্রয়োজন');
    if (!recurring.nextDate) errors.push('পরবর্তী তারিখ প্রয়োজন');

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // ডেটা সামঞ্জস্য চেক
  validateDataConsistency(data) {
    const issues = [];

    // লেনদেনের সংখ্যা চেক
    if (!Array.isArray(data.transactions)) {
      issues.push('লেনদেন ডেটা সংরক্ষণ করা হয়নি');
    }

    // প্রতিটি লেনদেনের বৈধতা চেক
    (data.transactions || []).forEach((transaction, index) => {
      if (!transaction.date || !transaction.amount || !transaction.category) {
        issues.push(`লেনদেন #${index + 1} অসম্পূর্ণ`);
      }
    });

    // বাজেট ডেটা চেক
    if (typeof data.budgets !== 'object') {
      data.budgets = {};
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
};

// সিকিউরিটি চেক এবং সতর্কতা সিস্টেম
const SecurityChecker = {
  checkDuplicateTransaction(transaction, existingTransactions) {
    // একই তারিখে, একই পরিমাণ, একই বিভাগে লেনদেন আছে কিনা চেক
    return existingTransactions.some(t => 
      t.date === transaction.date &&
      t.amount === transaction.amount &&
      t.category === transaction.category &&
      t.type === transaction.type
    );
  },

  checkUnusualActivity(transaction, previousTransactions) {
    const warnings = [];

    // গত ৩০ দিনের গড় পরিমাণ
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTransactions = previousTransactions.filter(t => 
      new Date(t.date) >= thirtyDaysAgo &&
      t.category === transaction.category &&
      t.type === transaction.type
    );

    if (recentTransactions.length > 0) {
      const avgAmount = recentTransactions.reduce((sum, t) => sum + t.amount, 0) / recentTransactions.length;
      
      // যদি লেনদেন গড়ের দ্বিগুণ হয়
      if (transaction.amount > avgAmount * 2) {
        warnings.push(`⚠️ এই লেনদেন সাধারণের চেয়ে বেশি (গড়: ৳${avgAmount.toFixed(0)})`);
      }
    }

    return warnings;
  },

  detectFraudulentPattern(transactions) {
    const issues = [];

    // একই দিনে একাধিক বড় লেনদেন
    const dailyTransactions = {};
    transactions.forEach(t => {
      if (!dailyTransactions[t.date]) dailyTransactions[t.date] = [];
      dailyTransactions[t.date].push(t);
    });

    Object.entries(dailyTransactions).forEach(([date, txns]) => {
      const largeTransactions = txns.filter(t => t.amount > 50000);
      if (largeTransactions.length > 3) {
        issues.push(`⚠️ ${date} এ অনেক বড় লেনদেন রয়েছে`);
      }
    });

    return issues;
  }
};

// পারফরম্যান্স অপটিমাইজেশন পরামর্শ
const PerformanceOptimizer = {
  analyzeDataSize(data) {
    const stats = {
      totalTransactions: (data.transactions || []).length,
      totalBills: (data.bills || []).length,
      totalRecurring: (data.recurringTransactions || []).length,
      estimatedStorageKB: new Blob([JSON.stringify(data)]).size / 1024
    };

    const recommendations = [];

    if (stats.totalTransactions > 10000) {
      recommendations.push('📊 ১০,০০০+ লেনদেন আছে - পুরানো ডেটা আর্কাইভ করার বিবেচনা করুন');
    }

    if (stats.estimatedStorageKB > 1000) {
      recommendations.push('💾 ডেটা ১ MB এর বেশি - নিয়মিত ব্যাকআপ নিন এবং পুরানো ডেটা পরিষ্কার করুন');
    }

    return {
      stats,
      recommendations
    };
  },

  getOptimizationTips() {
    return [
      '📈 মাসিক ডেটা আর্কাইভ করুন পুরানো লেনদেন সরিয়ে',
      '🗑️ ডুপ্লিকেট লেনদেন সরান',
      '🔄 নিয়মিত লেনদেন একীভূত করুন',
      '📊 রিপোর্ট জেনারেশন পারফরম্যান্স উন্নত করুন'
    ];
  }
};

// হেলথ চেক এবং ডায়াগনস্টিক
const HealthChecker = {
  runDiagnostics(data) {
    const diagnostics = {
      timestamp: new Date().toLocaleDateString('bn-BD'),
      status: 'healthy',
      issues: [],
      warnings: [],
      suggestions: []
    };

    // ডেটা সংরক্ষণ চেক
    const storageData = localStorage.getItem('bk_app_data');
    if (!storageData) {
      diagnostics.issues.push('❌ ডেটা সংরক্ষণে সমস্যা');
      diagnostics.status = 'critical';
    }

    // সামঞ্জস্য চেক
    const consistency = DataValidator.validateDataConsistency(data);
    if (!consistency.isValid) {
      diagnostics.warnings.push(...consistency.issues);
    }

    // পারফরম্যান্স চেক
    const perf = PerformanceOptimizer.analyzeDataSize(data);
    if (perf.recommendations.length > 0) {
      diagnostics.suggestions.push(...perf.recommendations);
    }

    // স্টোরেজ কোটা চেক
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        const percentUsed = (estimate.usage / estimate.quota) * 100;
        if (percentUsed > 80) {
          diagnostics.warnings.push(`⚠️ স্টোরেজ ${percentUsed.toFixed(1)}% পূর্ণ`);
        }
      });
    }

    diagnostics.status = diagnostics.issues.length > 0 ? 'critical' : 
                        diagnostics.warnings.length > 0 ? 'warning' : 'healthy';

    return diagnostics;
  }
};
