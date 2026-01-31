# জমা-খরচ ৩৬০ - বিস্তারিত টেকনিক্যাল ডকুমেন্টেশন

## 📘 সম্পূর্ণ প্রযুক্তিগত গাইড

---

## 🏗️ আর্কিটেকচার

### মূল স্তর:

```
┌─────────────────────────────────────┐
│         index.html (HTML5)          │
│       PWA Manifest + Meta Tags      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       React 18 (JSX/Babel)          │
│         app.js (Main App)           │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
┌───────▼────┐  ┌────▼─────────┐
│ Components │  │     Utils     │
│(17 files)  │  │(dataManager,  │
│            │  │ gestureHooks) │
└──────┬─────┘  └────┬──────────┘
       │             │
       └──────┬──────┘
              │
       ┌──────▼──────────┐
       │ LocalStorage    │
       │ (Browser DB)    │
       │                 │
       │ - transactions  │
       │ - budgets       │
       │ - goals         │
       │ - accounts      │
       │ - settings      │
       └─────────────────┘
       
       ┌──────────────────┐
       │ Service Worker   │
       │ (Offline Cache)  │
       │                  │
       │ - Static Assets  │
       │ - CDN Resources  │
       └──────────────────┘
```

### ডেটা ফ্লো:

```
User Interaction (UI Events)
           ↓
    React Component State
           ↓
    DataManager Functions
           ↓
    LocalStorage API
           ↓
    Persistent Data
```

---

## 🔐 নিরাপত্তা বিবেচনা

### বর্তমান সুরক্ষা ব্যবস্থা:

| বৈশিষ্ট্য | স্তর | বর্ণনা |
|----------|------|--------|
| **PIN Lock** | মৌলিক | চার অঙ্কের PIN সুরক্ষা |
| **LocalStorage** | মাঝারি | ব্রাউজার দ্বারা এনক্রিপ্ট নয় |
| **HTTPS** | সুপারিশকৃত | উৎপাদনে HTTPS ব্যবহার করুন |
| **Service Worker** | নিরাপদ | HTTPS প্রয়োজন |

### নিরাপত্তা সুপারিশ:

```javascript
// ❌ UNSAFE: সংবেদনশীল তথ্য প্লেইন টেক্সটে
localStorage.setItem('pinLock', '1234');

// ✅ SAFE: কমপক্ষে হ্যাশ ব্যবহার করুন
const hash = btoa('1234'); // Base64 এনকোডিং
localStorage.setItem('pinLock', hash);

// 🔒 BETTER: bcrypt বা Argon2 ব্যবহার করুন (ভবিষ্যত)
```

### সুপারিশকৃত উন্নতি:

1. **ডেটা এনক্রিপশন:**
   ```javascript
   // library যোগ করুন: crypto-js
   const encrypted = CryptoJS.AES.encrypt(data, 'secretKey');
   localStorage.setItem('encryptedData', encrypted);
   ```

2. **Secure Communication:**
   ```javascript
   // Backend API সহ
   fetch('/api/sync', {
       method: 'POST',
       credentials: 'include',
       headers: {
           'Content-Type': 'application/json',
           'X-CSRF-Token': getCsrfToken()
       }
   });
   ```

3. **ডেটা ট্রান্সমিশন:**
   - সর্বদা HTTPS ব্যবহার করুন
   - সংবেদনশীল ডেটা কখনও URL পরামিতিতে পাঠাবেন না

---

## 🗄️ LocalStorage স্কিমা

### সংরক্ষিত ডেটা কী এবং মূল্য:

```javascript
// Transactions Array
bk_transactions: [
    {
        id: "txn_1704067200000",
        type: "income|expense",
        amount: 5000,
        category: "বেতন|খাদ্য|পরিবহন",
        description: "মাসিক বেতন",
        date: "2024-01-01T10:30:00Z",
        accountId: "acc_1",
        isRecurring: true,
        recurringPattern: "monthly",
        tags: ["খাদ্য", "জরুরী"]
    }
]

// Categories Array
bk_categories: {
    all: ["খাদ্য", "পরিবহন", ...],
    income: ["বেতন", "ব্যবসা", ...],
    expense: ["খাদ্য", "বিদ্যুৎ", ...]
}

// Budgets Array
bk_budgets: [
    {
        id: "bgt_1",
        category: "খাদ্য",
        limit: 10000,
        spent: 6500,
        period: "monthly",
        startDate: "2024-01-01T00:00:00Z"
    }
]

// Goals Array
bk_goals: [
    {
        id: "goal_1",
        name: "গাড়ি কেনা",
        targetAmount: 500000,
        currentAmount: 150000,
        deadline: "2025-12-31T23:59:59Z",
        category: "বিনিয়োগ"
    }
]

// Accounts Array
bk_accounts: [
    {
        id: "acc_1",
        name: "ডাচ ব্যাংক",
        type: "checking|savings|investment",
        balance: 250000,
        currency: "BDT"
    }
]

// Settings Object
bk_settings: {
    darkMode: false,
    privacyMode: true,
    currency: "BDT",
    themeColor: "#10B981",
    enableHaptic: true,
    pinLock: "NTEzOA==" // হ্যাশ করা PIN
}
```

### ডেটা আকার অপটিমাইজেশন:

```javascript
// LocalStorage সীমা: ~5-10MB

// বর্তমান পরিস্থিতি:
// 1000 transactions = ~200KB
// সম্পূর্ণ ডেটা = ~500KB (নিরাপদ)

// সতর্কতা: > 8MB হলে সংকোচিত করুন বা প্রাচীন ডেটা মুছুন
```

---

## 🔄 ডেটা ম্যানেজার API

### প্রধান ফাংশন:

```javascript
// ✅ Transactions
DataManager.getTransactions()              // সমস্ত লেনদেন পান
DataManager.addTransaction(txnData)        // নতুন যোগ করুন
DataManager.updateTransaction(id, data)    // আপডেট করুন
DataManager.deleteTransaction(id)          // মুছুন

// ✅ Budgets
DataManager.getBudgets()
DataManager.addBudget(budgetData)
DataManager.updateBudget(id, data)
DataManager.deleteBudget(id)

// ✅ Goals
DataManager.getGoals()
DataManager.addGoal(goalData)
DataManager.updateGoal(id, data)
DataManager.deleteGoal(id)

// ✅ Accounts
DataManager.getAccounts()
DataManager.addAccount(accountData)
DataManager.updateAccount(id, data)
DataManager.deleteAccount(id)

// ✅ Settings
DataManager.getSettings()
DataManager.saveSettings(settingsObject)

// ✅ Categories
DataManager.getCategories()
DataManager.addCategory(name, type)
DataManager.removeCategory(name, type)
```

### ব্যবহারের উদাহরণ:

```javascript
// লেনদেন যোগ করুন
const newTxn = {
    id: Date.now().toString(),
    type: 'expense',
    amount: 500,
    category: 'খাদ্য',
    description: 'দুপুরের খাবার',
    date: new Date().toISOString(),
    accountId: 'acc_1'
};
DataManager.addTransaction(newTxn);

// বাজেট আপডেট করুন
DataManager.updateBudget('bgt_1', {
    limit: 15000
});

// সেটিংস সংরক্ষণ করুন
DataManager.saveSettings({
    ...DataManager.getSettings(),
    darkMode: true
});
```

---

## 🎮 জেসচার হুকস

### উপলব্ধ জেসচার:

```javascript
// 1. Swipe Detection
const { onTouchStart, onTouchMove, onTouchEnd } = GestureHooks.useSwipe({
    onSwipeLeft: () => console.log('Swiped left'),
    onSwipeRight: () => console.log('Swiped right'),
    onSwipeUp: () => console.log('Swiped up'),
    onSwipeDown: () => console.log('Swiped down'),
    threshold: 50 // পিক্সেল
});

// ব্যবহার:
<div 
    onTouchStart={onTouchStart}
    onTouchMove={onTouchMove}
    onTouchEnd={onTouchEnd}
>
    Content
</div>

// 2. Long Press Detection
const { onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd } = 
    GestureHooks.useLongPress(
        () => console.log('Long pressed!'), 
        500 // মিলিসেকেন্ড
    );

// 3. Shake Detection
GestureHooks.useShake(() => {
    console.log('Device shaken!');
});

// 4. Device Orientation
GestureHooks.useDeviceOrientation((orientation) => {
    console.log(orientation); // 'portrait' | 'landscape'
});
```

---

## 📡 Service Worker বিস্তারিত

### ক্যাশিং কৌশল:

```javascript
// Network First (CDN এবং APIs এর জন্য)
// Cache First (Static assets এর জন্য)
// Stale While Revalidate (Offline-first)

const CACHE_NAME = 'budget-tracker-v2';

const STATIC_ASSETS = [
    './',
    './index.html',
    './app.js',
    './manifest.json',
    // ... সমস্ত স্থানীয় ফাইল
];

const EXTERNAL_ASSETS = [
    'https://resource.trickle.so/...',
    'https://cdn.tailwindcss.com',
    // ... CDN ফাইল
];
```

### আপডেট প্রক্রিয়া:

```javascript
// নতুন সংস্করণে আপডেট করতে:
// sw.js এ CACHE_NAME পরিবর্তন করুন
const CACHE_NAME = 'budget-tracker-v3'; // v2 থেকে v3 এ

// ব্যবহারকারীরা পরবর্তী সেশনে নতুন সংস্করণ পাবেন
```

---

## 🎨 কম্পোনেন্ট আর্কিটেকচার

### কম্পোনেন্ট হায়ারার্কি:

```
App (Root)
├── ErrorBoundary
├── PinLockScreen
├── MainLayout
│   ├── Header
│   ├── Sidebar
│   ├── MainContent
│   │   ├── Dashboard
│   │   ├── Transactions
│   │   ├── Budget
│   │   ├── Goals
│   │   ├── Bills
│   │   ├── Investments
│   │   ├── Accounts
│   │   ├── Loans
│   │   ├── Reports
│   │   ├── Tools
│   │   └── Settings
│   └── BottomNav
├── UIComponents
│   ├── Toast
│   ├── ConfirmModal
│   ├── LoadingSpinner
│   └── Confetti
└── GestureUI (Custom Gesture Components)
```

### প্রধান কম্পোনেন্টের দায়িত্ব:

| কম্পোনেন্ট | দায়িত্ব |
|-----------|---------|
| **Dashboard** | আর্থিক সারসংক্ষেপ, চার্ট, গ্রাফ |
| **Transactions** | লেনদেন CRUD, তালিকা, ফিল্টার |
| **Budget** | বাজেট সেট করা, বিশ্লেষণ |
| **Goals** | সঞ্চয় লক্ষ্য, ট্র্যাকিং |
| **Reports** | বিস্তারিত রিপোর্ট, বিশ্লেষণ |
| **Settings** | অ্যাপ কনফিগারেশন, ডেটা ব্যাকআপ |

---

## 🌐 CDN ডিপেন্ডেন্সি

### বর্তমান বাহ্যিক লাইব্রেরি:

```html
<!-- React 18 -->
https://resource.trickle.so/vendor_lib/unpkg/react@18/umd/react.production.min.js
https://resource.trickle.so/vendor_lib/unpkg/react-dom@18/umd/react-dom.production.min.js

<!-- Babel Standalone -->
https://resource.trickle.so/vendor_lib/unpkg/@babel/standalone/babel.min.js

<!-- Tailwind CSS -->
https://cdn.tailwindcss.com

<!-- Lucide Icons -->
https://resource.trickle.so/vendor_lib/unpkg/lucide-static@0.516.0/font/lucide.css

<!-- Chart.js -->
https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js

<!-- Google Fonts (Hind Siliguri - Bengali) -->
https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap
```

### অফলাইন সাপোর্টের জন্য:

```javascript
// এই CDN সম্পদগুলি sw.js এ ক্যাশ করা হয়
// তবে সম্পূর্ণ অফলাইন সাপোর্টের জন্য স্থানীয়ভাবে হোস্ট করুন:

// 1. Node modules ইনস্টল করুন
npm install react react-dom chart.js

// 2. স্থানীয় সংস্করণ পরিবেশন করুন
// 3. sw.js এ পথ আপডেট করুন
```

---

## 📊 রিপোর্টিং ইঞ্জিন

### সমর্থিত চার্ট:

```javascript
// Dashboard এ
- Pie Chart: বিভাগ অনুযায়ী ব্যয়
- Bar Chart: মাসিক ট্রেন্ড
- Line Chart: জমার অগ্রগতি

// Reports এ
- Detailed Analytics
- Category-wise Breakdown
- Time-based Filtering
- CSV Export
```

### চার্ট কনফিগারেশন:

```javascript
const chartConfig = {
    type: 'pie',
    data: {
        labels: ['খাদ্য', 'পরিবহন', 'বিনোদন'],
        datasets: [{
            data: [5000, 2000, 1500],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
};

const chart = new ChartJS(ctx, chartConfig);
```

---

## 🔌 REST API সংযোগ (ভবিষ্যত)

### সুপারিশকৃত স্ট্রাকচার:

```javascript
const API_BASE_URL = 'https://api.example.com';

const ApiService = {
    async syncData() {
        try {
            const localData = DataManager.getAllData();
            const response = await fetch(`${API_BASE_URL}/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(localData)
            });
            const cloudData = await response.json();
            DataManager.mergeData(cloudData);
        } catch (error) {
            console.error('Sync failed', error);
        }
    }
};
```

---

## 🧪 পরীক্ষা এবং বাগ রিপোর্টিং

### কমন ইস্যু এবং সমাধান:

| সমস্যা | কারণ | সমাধান |
|--------|------|--------|
| Service Worker নিবন্ধন ব্যর্থ | HTTPS ছাড়া | localhost ব্যবহার করুন বা HTTPS সেট করুন |
| স্ক্রিপ্ট লোড হয় না | CORS সমস্যা | HTTP সার্ভার চালান |
| ডেটা হারিয়ে যায় | স্টোরেজ ভরা | পুরানো ডেটা মুছুন বা ডাউনলোড করুন |
| পিন লক কাজ করে না | বিভিন্ন ব্রাউজার | ব্রাউজার ডেটা রিসেট করুন |
| Chart.js ত্রুটি | গ্লোবাল নেমস্পেস | `ChartJS` ব্যবহার করুন, `Chart` নয় |

---

## 📈 কর্মক্ষমতা অপটিমাইজেশন

### বর্তমান অপটিমাইজেশন:

```javascript
// 1. React Lazy Loading
const Dashboard = React.lazy(() => import('./components/Dashboard'));

// 2. Memoization
const MemoComponent = React.memo(MyComponent);

// 3. Code Splitting (Future)
const Reports = lazy(() => import('./components/Reports'));

// 4. Image Optimization
// SVG icons ব্যবহার করুন (Lucide)
```

### কর্মক্ষমতা মেট্রিক্স:

```javascript
// Performance API ব্যবহার করুন
console.time('DataLoad');
const data = DataManager.getTransactions();
console.timeEnd('DataLoad');

// Lighthouse স্কোর: 
// Performance: 85+ (লক্ষ্য)
// Accessibility: 90+ (লক্ষ্য)
// Best Practices: 85+ (লক্ষ্য)
// SEO: 85+ (লক্ষ্য)
```

---

## 🚀 স্থাপনা গাইড

### উৎপাদনে স্থাপনা:

```bash
# 1. GitHub এ পুশ করুন
git add .
git commit -m "Production ready"
git push origin main

# 2. GitHub Pages/Netlify এ স্থাপন করুন
# GitHub Pages:
# Settings → Pages → Deploy from branch: main

# 3. Custom Domain সেট করুন (ঐচ্ছিক)
# CNAME ফাইল যোগ করুন

# 4. HTTPS সক্ষম করুন (স্বয়ংক্রিয়)
```

### পরিবেশ ভেরিয়েবল:

```javascript
// .env ফাইল (গিটইগনোর করুন)
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
```

---

## 📚 শিক্ষামূলক সম্পদ

### সুপারিশকৃত পাঠ:

- [React 18 Documentation](https://react.dev)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Tailwind CSS](https://tailwindcss.com)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**শেষ আপডেট:** ৩১ জানুয়ারি ২০২৬
