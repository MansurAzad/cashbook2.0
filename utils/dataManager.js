const DataManager = {
    // Keys for LocalStorage
    STORAGE_KEYS: {
        TRANSACTIONS: 'bk_transactions',
        CATEGORIES: 'bk_categories',
        BUDGETS: 'bk_budgets',
        GOALS: 'bk_goals',
        BILLS: 'bk_bills',
        INVESTMENTS: 'bk_investments',
        ACCOUNTS: 'bk_accounts',
        LOANS: 'bk_loans',
        SHOPPING_LIST: 'bk_shopping_list',
        SYNC_QUEUE: 'bk_sync_queue',
        SETTINGS: 'bk_settings'
    },

    // Helper to get from LS
    getFromLS: (key, defaultVal) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultVal;
        } catch (e) {
            console.error('LS Read Error', e);
            return defaultVal;
        }
    },

    // Helper to save to LS
    saveToLS: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('LS Write Error', e);
        }
    },

    getSettings: () => {
        return DataManager.getFromLS(DataManager.STORAGE_KEYS.SETTINGS, {
            darkMode: false,
            privacyMode: false,
            currency: 'BDT',
            themeColor: '#10B981', // Default Emerald
            enableHaptic: true,
            pinLock: null // null or '1234'
        });
    },

    saveSettings: (settings) => {
        DataManager.saveToLS(DataManager.STORAGE_KEYS.SETTINGS, settings);
    },

    getShoppingList: () => DataManager.getFromLS(DataManager.STORAGE_KEYS.SHOPPING_LIST, []),
    saveShoppingList: (list) => DataManager.saveToLS(DataManager.STORAGE_KEYS.SHOPPING_LIST, list),

    addToSyncQueue: (action) => {
        const queue = DataManager.getFromLS(DataManager.STORAGE_KEYS.SYNC_QUEUE, []);
        queue.push({ ...action, timestamp: Date.now() });
        DataManager.saveToLS(DataManager.STORAGE_KEYS.SYNC_QUEUE, queue);
    },

    processSyncQueue: async () => {
        const queue = DataManager.getFromLS(DataManager.STORAGE_KEYS.SYNC_QUEUE, []);
        if (queue.length === 0) return;

        console.log('Processing sync queue:', queue.length, 'items');
        const newQueue = [];

        for (const item of queue) {
            try {
                // Generic handler based on type pattern
                const [action, type] = item.type.split('_'); // ADD_TRANSACTION -> action: ADD, type: TRANSACTION
                const objectType = type.toLowerCase(); // transaction
                
                if (action === 'ADD') {
                    await trickleCreateObject(objectType, item.payload);
                } else if (action === 'DELETE') {
                    await trickleDeleteObject(objectType, item.id);
                } else if (action === 'UPDATE') {
                    await trickleUpdateObject(objectType, item.id, item.payload);
                } else if (item.type === 'SAVE_BUDGET') {
                    if (item.existingId) await trickleUpdateObject('budget', item.existingId, item.payload);
                    else await trickleCreateObject('budget', item.payload);
                }
            } catch (error) {
                console.error('Sync failed for item:', item, error);
                const errorStr = String(error);
                if (errorStr.includes('NoPermission') || errorStr.includes('NotFound') || errorStr.includes('not exist')) {
                    console.warn('Skipping item due to permanent error:', item);
                } else {
                    newQueue.push(item);
                }
            }
        }
        
        DataManager.saveToLS(DataManager.STORAGE_KEYS.SYNC_QUEUE, newQueue);
    },

    fetchData: async () => {
        let localData = {
            transactions: DataManager.getFromLS(DataManager.STORAGE_KEYS.TRANSACTIONS, []),
            categories: DataManager.getFromLS(DataManager.STORAGE_KEYS.CATEGORIES, []),
            budgets: DataManager.getFromLS(DataManager.STORAGE_KEYS.BUDGETS, []),
            goals: DataManager.getFromLS(DataManager.STORAGE_KEYS.GOALS, []),
            bills: DataManager.getFromLS(DataManager.STORAGE_KEYS.BILLS, []),
            investments: DataManager.getFromLS(DataManager.STORAGE_KEYS.INVESTMENTS, []),
            accounts: DataManager.getFromLS(DataManager.STORAGE_KEYS.ACCOUNTS, []),
            loans: DataManager.getFromLS(DataManager.STORAGE_KEYS.LOANS, [])
        };

        if (navigator.onLine) {
            await DataManager.processSyncQueue();
        }

        try {
            const [transResp, catResp, budgetResp, goalResp, billResp, invResp, accResp, loanResp] = await Promise.all([
                trickleListObjects('transaction', 1000, true),
                trickleListObjects('category', 100, true),
                trickleListObjects('budget', 100, true),
                trickleListObjects('goal', 100, true),
                trickleListObjects('bill', 100, true),
                trickleListObjects('investment', 100, true),
                trickleListObjects('account', 100, true),
                trickleListObjects('loan', 100, true)
            ]);

            const mapData = (resp) => resp.items.map(item => ({ id: item.objectId, ...item.objectData }));

            const onlineData = {
                transactions: mapData(transResp),
                categories: mapData(catResp),
                budgets: mapData(budgetResp),
                goals: mapData(goalResp),
                bills: mapData(billResp),
                investments: mapData(invResp),
                accounts: mapData(accResp),
                loans: mapData(loanResp)
            };

            // Save to LS
            Object.keys(onlineData).forEach(key => {
                DataManager.saveToLS(DataManager.STORAGE_KEYS[key.toUpperCase()], onlineData[key]);
                localData[key] = onlineData[key];
            });

        } catch (error) {
            const errStr = String(error);
            if (errStr.includes('NoPermission')) {
                console.warn('Access denied to backend data. Running in offline/local mode.');
            } else {
                console.warn('Online fetch failed, using local data', error);
            }
        }

        // Default Categories Handling
        let categoriesList = localData.categories;
        if (categoriesList.length === 0) {
             const defaultCategories = [
                { name: 'বেতন', type: 'income', icon: 'icon-banknote', color: '#10B981' },
                { name: 'ব্যাবসা', type: 'income', icon: 'icon-briefcase', color: '#3B82F6' },
                { name: 'বাসা ভাড়া', type: 'expense', icon: 'icon-home', color: '#EF4444' },
                { name: 'খাবার', type: 'expense', icon: 'icon-utensils', color: '#F59E0B' },
                { name: 'যাতায়াত', type: 'expense', icon: 'icon-bus', color: '#6366F1' },
                { name: 'শপিং', type: 'expense', icon: 'icon-shopping-bag', color: '#EC4899' },
                { name: 'চিকিৎসা', type: 'expense', icon: 'icon-heart-pulse', color: '#EF4444' },
                { name: 'শিক্ষা', type: 'expense', icon: 'icon-graduation-cap', color: '#8B5CF6' }
             ];
             categoriesList = defaultCategories.map((c, i) => ({ id: `default-${i}`, ...c }));
        }

        return { 
            ...localData,
            categories: {
                all: categoriesList,
                income: categoriesList.filter(c => c.type === 'income'),
                expense: categoriesList.filter(c => c.type === 'expense')
            }
        };
    },

    // Generic CRUD Helper
    async genericAdd(type, data, storageKey) {
        const tempId = `temp-${type}-${Date.now()}`;
        const newItem = { id: tempId, ...data };
        const currentItems = DataManager.getFromLS(storageKey, []);
        DataManager.saveToLS(storageKey, [...currentItems, newItem]);

        try {
            await trickleCreateObject(type, data);
            return await DataManager.fetchData();
        } catch (error) {
            const errorStr = String(error);
            console.error(`Error adding ${type}:`, error);
            if (!errorStr.includes('NoPermission')) {
                DataManager.addToSyncQueue({ type: `ADD_${type.toUpperCase()}`, payload: data });
            }
            return await DataManager.fetchData();
        }
    },

    async genericDelete(type, id, storageKey) {
        const currentItems = DataManager.getFromLS(storageKey, []);
        DataManager.saveToLS(storageKey, currentItems.filter(i => i.id !== id));

        try {
            if (!id.startsWith('temp-')) await trickleDeleteObject(type, id);
            return await DataManager.fetchData();
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            const errorStr = String(error);
            if (!id.startsWith('temp-') && !errorStr.includes('NoPermission')) {
                DataManager.addToSyncQueue({ type: `DELETE_${type.toUpperCase()}`, id });
            }
            return await DataManager.fetchData();
        }
    },

    async genericUpdate(type, id, data, storageKey) {
        const currentItems = DataManager.getFromLS(storageKey, []);
        const updatedItems = currentItems.map(i => i.id === id ? { ...i, ...data } : i);
        DataManager.saveToLS(storageKey, updatedItems);

        try {
            if (!id.startsWith('temp-')) await trickleUpdateObject(type, id, data);
            return await DataManager.fetchData();
        } catch (error) {
            console.error(`Error updating ${type}:`, error);
            const errorStr = String(error);
            if (!id.startsWith('temp-') && !errorStr.includes('NoPermission')) {
                DataManager.addToSyncQueue({ type: `UPDATE_${type.toUpperCase()}`, id, payload: data });
            }
            return await DataManager.fetchData();
        }
    },

    // Special handlers for Transaction to update Accounts
    async addTransaction(data) {
        // 1. Add the transaction
        await DataManager.genericAdd('transaction', data, DataManager.STORAGE_KEYS.TRANSACTIONS);
        
        // 2. Update Account Balance if account_id is provided
        if (data.account_id) {
            const accounts = DataManager.getFromLS(DataManager.STORAGE_KEYS.ACCOUNTS, []);
            const account = accounts.find(a => a.id === data.account_id);
            if (account) {
                let newBalance = parseFloat(account.balance);
                if (data.type === 'income') {
                    newBalance += parseFloat(data.amount);
                } else {
                    newBalance -= parseFloat(data.amount);
                }
                await DataManager.updateAccount(account.id, { ...account, balance: newBalance });
            }
        }
        return await DataManager.fetchData();
    },

    async deleteTransaction(id) {
        // 1. Find transaction to revert balance
        const transactions = DataManager.getFromLS(DataManager.STORAGE_KEYS.TRANSACTIONS, []);
        const transaction = transactions.find(t => t.id === id);

        if (transaction && transaction.account_id) {
            const accounts = DataManager.getFromLS(DataManager.STORAGE_KEYS.ACCOUNTS, []);
            const account = accounts.find(a => a.id === transaction.account_id);
            if (account) {
                let newBalance = parseFloat(account.balance);
                // Revert logic: if it was income (added), now subtract. If expense (subtracted), now add.
                if (transaction.type === 'income') {
                    newBalance -= parseFloat(transaction.amount);
                } else {
                    newBalance += parseFloat(transaction.amount);
                }
                await DataManager.updateAccount(account.id, { ...account, balance: newBalance });
            }
        }

        // 2. Delete transaction
        return await DataManager.genericDelete('transaction', id, DataManager.STORAGE_KEYS.TRANSACTIONS);
    },

    async updateTransaction(id, newData) {
        // Complex logic: Revert old, Apply new. 
        // For simplicity in this version, we will just update the transaction record 
        // and recommend user to manually adjust balance if they made a mistake in amount/account.
        // OR: We can try to be smart if account_id is same.
        
        // Let's implement smart update only if account_id matches, otherwise it's too risky for syncing.
        const transactions = DataManager.getFromLS(DataManager.STORAGE_KEYS.TRANSACTIONS, []);
        const oldTransaction = transactions.find(t => t.id === id);

        if (oldTransaction && newData.account_id && oldTransaction.account_id === newData.account_id) {
            const accounts = DataManager.getFromLS(DataManager.STORAGE_KEYS.ACCOUNTS, []);
            const account = accounts.find(a => a.id === newData.account_id);
            if (account) {
                let currentBal = parseFloat(account.balance);
                
                // Revert old
                if (oldTransaction.type === 'income') currentBal -= parseFloat(oldTransaction.amount);
                else currentBal += parseFloat(oldTransaction.amount);

                // Apply new
                if (newData.type === 'income') currentBal += parseFloat(newData.amount);
                else currentBal -= parseFloat(newData.amount);

                await DataManager.updateAccount(account.id, { ...account, balance: currentBal });
            }
        }
        
        return await DataManager.genericUpdate('transaction', id, newData, DataManager.STORAGE_KEYS.TRANSACTIONS);
    },

    // Exposed Methods (rest unchanged)
    addCategory: (data) => DataManager.genericAdd('category', data, DataManager.STORAGE_KEYS.CATEGORIES),
    deleteCategory: (id) => DataManager.genericDelete('category', id, DataManager.STORAGE_KEYS.CATEGORIES),
    
    addGoal: (data) => DataManager.genericAdd('goal', data, DataManager.STORAGE_KEYS.GOALS),
    updateGoal: (id, data) => DataManager.genericUpdate('goal', id, data, DataManager.STORAGE_KEYS.GOALS),
    deleteGoal: (id) => DataManager.genericDelete('goal', id, DataManager.STORAGE_KEYS.GOALS),

    addBill: (data) => DataManager.genericAdd('bill', data, DataManager.STORAGE_KEYS.BILLS),
    updateBill: (id, data) => DataManager.genericUpdate('bill', id, data, DataManager.STORAGE_KEYS.BILLS),
    deleteBill: (id) => DataManager.genericDelete('bill', id, DataManager.STORAGE_KEYS.BILLS),

    addInvestment: (data) => DataManager.genericAdd('investment', data, DataManager.STORAGE_KEYS.INVESTMENTS),
    updateInvestment: (id, data) => DataManager.genericUpdate('investment', id, data, DataManager.STORAGE_KEYS.INVESTMENTS),
    deleteInvestment: (id) => DataManager.genericDelete('investment', id, DataManager.STORAGE_KEYS.INVESTMENTS),

    addAccount: (data) => DataManager.genericAdd('account', data, DataManager.STORAGE_KEYS.ACCOUNTS),
    updateAccount: (id, data) => DataManager.genericUpdate('account', id, data, DataManager.STORAGE_KEYS.ACCOUNTS),
    deleteAccount: (id) => DataManager.genericDelete('account', id, DataManager.STORAGE_KEYS.ACCOUNTS),

    addLoan: (data) => DataManager.genericAdd('loan', data, DataManager.STORAGE_KEYS.LOANS),
    updateLoan: (id, data) => DataManager.genericUpdate('loan', id, data, DataManager.STORAGE_KEYS.LOANS),
    deleteLoan: (id) => DataManager.genericDelete('loan', id, DataManager.STORAGE_KEYS.LOANS),

    saveBudget: async (budgetData, existingId = null) => {
        const currentBudgets = DataManager.getFromLS(DataManager.STORAGE_KEYS.BUDGETS, []);
        let updatedBudgets;
        if (existingId) {
            updatedBudgets = currentBudgets.map(b => b.id === existingId ? { ...b, ...budgetData } : b);
        } else {
            updatedBudgets = [...currentBudgets, { id: 'temp-bud-' + Date.now(), ...budgetData }];
        }
        DataManager.saveToLS(DataManager.STORAGE_KEYS.BUDGETS, updatedBudgets);

        try {
            if (existingId && !existingId.startsWith('temp-')) {
                await trickleUpdateObject('budget', existingId, budgetData);
            } else {
                await trickleCreateObject('budget', budgetData);
            }
            return await DataManager.fetchData();
        } catch (error) {
            console.error('Error saving budget:', error);
            const errorStr = String(error);
            if (!errorStr.includes('NoPermission')) {
                DataManager.addToSyncQueue({ type: 'SAVE_BUDGET', payload: budgetData, existingId: (existingId && !existingId.startsWith('temp-') ? existingId : null) });
            }
            return await DataManager.fetchData();
        }
    },
    
    deleteBudget: (id) => DataManager.genericDelete('budget', id, DataManager.STORAGE_KEYS.BUDGETS),

    calculateTotals: (transactions) => {
        return transactions.reduce((acc, curr) => {
            if (curr.type === 'income') acc.income += parseFloat(curr.amount || 0);
            if (curr.type === 'expense') acc.expense += parseFloat(curr.amount || 0);
            return acc;
        }, { income: 0, expense: 0 });
    },

    getMonthlyBudgetStatus: (transactions, budgets, monthStr) => {
        const monthlyTransactions = transactions.filter(t => t.date.startsWith(monthStr) && t.type === 'expense');
        const monthlyBudgets = budgets.filter(b => b.month === monthStr);
        const expensesByCategory = monthlyTransactions.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
            return acc;
        }, {});
        const totalExpense = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
        const status = monthlyBudgets.map(b => ({
            ...b,
            spent: expensesByCategory[b.category] || 0,
            remaining: parseFloat(b.amount) - (expensesByCategory[b.category] || 0),
            percentage: Math.min(100, ((expensesByCategory[b.category] || 0) / parseFloat(b.amount)) * 100)
        }));
        const totalBudgetAmount = monthlyBudgets.reduce((sum, b) => sum + parseFloat(b.amount), 0);
        const totalStatus = {
            category: 'সর্বমোট',
            amount: totalBudgetAmount,
            spent: totalExpense,
            remaining: totalBudgetAmount - totalExpense,
            percentage: totalBudgetAmount > 0 ? Math.min(100, (totalExpense / totalBudgetAmount) * 100) : 0
        };
        return { items: status, total: totalStatus };
    },

    getFinancialHealth: (data) => {
        const { income, expense } = DataManager.calculateTotals(data.transactions);
        const totalSavings = data.goals.reduce((sum, g) => sum + parseFloat(g.saved_amount || 0), 0);
        const totalInvestments = data.investments.reduce((sum, i) => sum + parseFloat(i.current_value || 0), 0);
        const unpaidBills = data.bills.filter(b => !b.is_paid).reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
        const accountBalance = data.accounts.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0);
        
        // Net Worth = Assets (Cash + Savings + Investments) - Liabilities (Unpaid Bills + Loans Taken)
        // Ignoring loan taken for simplicity here or assume negative balance accounts cover it
        
        const netWorth = accountBalance + totalSavings + totalInvestments - unpaidBills;
        const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
        
        let score = 0;
        if (savingsRate > 20) score += 40;
        else if (savingsRate > 10) score += 20;
        if (unpaidBills === 0) score += 30;
        if (totalInvestments > 0) score += 30;

        return { netWorth, savingsRate, score: Math.min(100, score) };
    }
};