# iOS UI - দ্রুত শুরু

## 🚀 ৩০ সেকেন্ডে শুরু করুন

### 1️⃣ সাধারণ টেক্সট ইনপুট
```javascript
<iOSTextField
    label="পরিমাণ"
    value={amount}
    onChange={setAmount}
    placeholder="০ টাইপ করুন"
    icon={<span>৳</span>}
/>
```

### 2️⃣ সাধারণ কার্ড
```javascript
<iOSCard>
    <h3>শিরোনাম</h3>
    <p>কন্টেন্ট</p>
</iOSCard>
```

### 3️⃣ সাধারণ বাটন
```javascript
<iOSFilledButton onClick={handleClick}>
    যোগ করুন
</iOSFilledButton>
```

### 4️⃣ সাধারণ নির্বাচন
```javascript
<iOSPicker
    label="ক্যাটাগরি"
    value={category}
    onChange={setCategory}
    options={[
        { label: 'খাদ্য', value: 'food' },
        { label: 'পরিবহন', value: 'transport' }
    ]}
/>
```

### 5️⃣ সাধারণ মডাল
```javascript
<iOSSheet
    isOpen={isOpen}
    onClose={handleClose}
    title="শিরোনাম"
>
    <p>মডাল কন্টেন্ট</p>
</iOSSheet>
```

---

## 📚 সব কম্পোনেন্টের তালিকা

### ইনপুট কম্পোনেন্টস
| কম্পোনেন্ট | ব্যবহার |
|------------|--------|
| `iOSTextField` | টেক্সট/নম্বর ইনপুট |
| `iOSPicker` | ড্রপডাউন নির্বাচন |
| `iOSSegmentedControl` | ট্যাব নির্বাচন |
| `iOSSwitch` | টগল চেকবক্স |

### ডিসপ্লে কম্পোনেন্টস
| কম্পোনেন্ট | ব্যবহার |
|------------|--------|
| `iOSCard` | সাধারণ কন্টেন্ট কার্ড |
| `iOSGradientCard` | গ্রেডিয়েন্ট কার্ড |
| `iOSListItem` | লিস্ট আইটেম |
| `iOSBadge` | ট্যাগ/ব্যাজ |

### অ্যাকশন কম্পোনেন্টস
| কম্পোনেন্ট | ব্যবহার |
|------------|--------|
| `iOSButton` | সাধারণ বাটন |
| `iOSFilledButton` | প্রধান বাটন |
| `iOSSoftButton` | গৌণ বাটন |
| `iOSSheet` | মডাল ডায়ালগ |

### ফিডব্যাক কম্পোনেন্টস
| কম্পোনেন্ট | ব্যবহার |
|------------|--------|
| `iOSToast` | বিজ্ঞপ্তি |
| `iOSActivityIndicator` | লোডিং |
| `iOSEmptyState` | খালি পেজ |

### বিশেষ কার্ডস
| কম্পোনেন্ট | ব্যবহার |
|------------|--------|
| `BudgetCardiOS` | বাজেট ডিসপ্লে |
| `GoalCardiOS` | লক্ষ্য ডিসপ্লে |
| `BillCardiOS` | বিল ডিসপ্লে |
| `InvestmentCardiOS` | বিনিয়োগ ডিসপ্লে |
| `LoanCardiOS` | ঋণ ডিসপ্লে |
| `AccountCardiOS` | অ্যাকাউন্ট ডিসপ্লে |

---

## 🎨 রঙ ব্যবহার

### স্ট্যান্ডার্ড রঙ
```javascript
// প্রাইমারি
<iOSFilledButton color="emerald">যোগ করুন</iOSFilledButton>

// ডেঞ্জার
<iOSFilledButton color="red">মুছুন</iOSFilledButton>

// ওয়ার্নিং
<iOSFilledButton color="orange">সতর্ক</iOSFilledButton>

// তথ্য
<iOSFilledButton color="blue">তথ্য</iOSFilledButton>
```

---

## 🔧 সাধারণ কাজ

### সার্চ বার
```javascript
<iOSTextField
    icon={<div className="icon-search"></div>}
    placeholder="খোঁজার জন্য টাইপ করুন..."
    value={search}
    onChange={setSearch}
/>
```

### ফিল্টার ট্যাব
```javascript
<iOSSegmentedControl
    segments={[
        { label: 'সব', value: 'all' },
        { label: 'আয়', value: 'income' },
        { label: 'ব্যয়', value: 'expense' }
    ]}
    value={filter}
    onChange={setFilter}
/>
```

### লোডিং
```javascript
<iOSActivityIndicator size="medium" color="emerald" />
```

### খালি অবস্থা
```javascript
<iOSEmptyState
    icon="📋"
    title="কোন আইটেম নেই"
    description="প্রথম আইটেম যোগ করুন"
    action={
        <iOSFilledButton>নতুন আইটেম</iOSFilledButton>
    }
/>
```

### ফর্ম ফিল্ড গ্রুপ
```javascript
<iOSInputGroup
    title="ব্যক্তিগত তথ্য"
    description="আপনার বিবরণ আপডেট করুন"
>
    <iOSTextField label="নাম" />
    <iOSTextField label="ইমেইল" type="email" />
    <iOSTextField label="ফোন" type="tel" />
</iOSInputGroup>
```

---

## 💡 পেমেন্ট ফর্ম উদাহরণ
```javascript
<iOSSheet
    isOpen={showForm}
    onClose={closeForm}
    title="নতুন লেনদেন"
    actions={[
        <iOSFilledButton onClick={handleSubmit} color="emerald">
            সংরক্ষণ করুন
        </iOSFilledButton>,
        <iOSSoftButton onClick={closeForm} color="gray">
            বাতিল করুন
        </iOSSoftButton>
    ]}
>
    <form className="space-y-6">
        <iOSSegmentedControl
            segments={[
                { label: '↓ আয়', value: 'income' },
                { label: '↑ ব্যয়', value: 'expense' }
            ]}
            value={type}
            onChange={setType}
            fullWidth={true}
        />
        
        <iOSTextField
            label="পরিমাণ"
            type="number"
            value={amount}
            onChange={setAmount}
            icon={<span>৳</span>}
        />
        
        <iOSPicker
            label="ক্যাটাগরি"
            value={category}
            onChange={setCategory}
            options={categories}
        />
        
        <iOSPicker
            label="অ্যাকাউন্ট"
            value={account}
            onChange={setAccount}
            options={accounts}
        />
        
        <iOSTextField
            label="তারিখ"
            type="date"
            value={date}
            onChange={setDate}
        />
        
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">
                নোট (ঐচ্ছিক)
            </label>
            <textarea
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 outline-none"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
        </div>
    </form>
</iOSSheet>
```

---

## 🏠 ড্যাশবোর্ড উদাহরণ
```javascript
<div className="space-y-4">
    {/* গ্রেডিয়েন্ট স্ট্যাটাস কার্ড */}
    <iOSGradientCard
        gradientFrom="from-emerald-500"
        gradientTo="to-blue-500"
    >
        <p className="text-white/80 text-sm">নেট ওয়ার্থ</p>
        <h2 className="text-3xl font-black text-white">৳ 1,50,000</h2>
    </iOSGradientCard>
    
    {/* পরিসংখ্যান কার্ডস */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickStatCardiOS
            title="আজকের খরচ"
            value="৳ 2,500"
            icon="📊"
            color="emerald"
        />
        <QuickStatCardiOS
            title="এই মাসের বাজেট"
            value="৳ 50,000"
            icon="📈"
            color="blue"
        />
    </div>
    
    {/* বাজেট কার্ডস */}
    {budgets.map(budget => (
        <BudgetCardiOS
            key={budget.id}
            budget={budget}
            spent={calculateSpent(budget)}
            remaining={calculateRemaining(budget)}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    ))}
</div>
```

---

## 🔄 লিস্ট উদাহরণ
```javascript
<div className="space-y-2">
    {items.length === 0 ? (
        <iOSEmptyState
            icon="📋"
            title="কোন আইটেম নেই"
        />
    ) : (
        items.map(item => (
            <iOSCard key={item.id} interactive={true}>
                <iOSListItem
                    icon={<div className="icon-file"></div>}
                    title={item.title}
                    subtitle={item.date}
                    rightContent={
                        <span className="font-bold">৳ {item.amount}</span>
                    }
                    onClick={() => handleSelect(item)}
                />
            </iOSCard>
        ))
    )}
</div>
```

---

## 🎯 সেটিংস পেজ উদাহরণ
```javascript
<div className="space-y-4">
    <iOSInputGroup title="অ্যাপ সেটিংস">
        <iOSSwitch
            label="ডার্ক মোড"
            value={darkMode}
            onChange={setDarkMode}
        />
        <iOSSwitch
            label="বিজ্ঞপ্তি"
            value={notifications}
            onChange={setNotifications}
        />
    </iOSInputGroup>
    
    <iOSInputGroup title="নিরাপত্তা">
        <iOSSwitch
            label="বায়োমেট্রিক্স"
            value={biometric}
            onChange={setBiometric}
        />
        <iOSTextField
            label="পিন"
            type="password"
            placeholder="নতুন পিন সেট করুন"
        />
    </iOSInputGroup>
    
    <iOSFilledButton
        color="red"
        fullWidth={true}
        onClick={handleLogout}
    >
        লগআউট
    </iOSFilledButton>
</div>
```

---

## 🚨 এরর হ্যান্ডলিং
```javascript
const [error, setError] = React.useState('');

<iOSTextField
    label="পরিমাণ"
    value={amount}
    onChange={setAmount}
    error={error}
    required={true}
/>

// ভ্যালিডেট করুন
const handleSubmit = () => {
    if (!amount) {
        setError('পরিমাণ প্রয়োজন');
        return;
    }
    if (amount <= 0) {
        setError('পরিমাণ ০ এর বেশি হতে হবে');
        return;
    }
    // জমা দিন
};
```

---

## 📱 রেসপন্সিভ উদাহরণ
```javascript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map(item => (
        <iOSCard key={item.id}>
            {/* কন্টেন্ট */}
        </iOSCard>
    ))}
</div>
```

---

## ⚡ পারফরম্যান্স টিপস

1. **Lazy লোড করুন** দীর্ঘ লিস্টের জন্য
2. **Memo ব্যবহার করুন** পুনরাবৃত্ত কম্পোনেন্টের জন্য
3. **useCallback** ব্যবহার করুন ইভেন্ট হ্যান্ডলারের জন্য
4. **অ্যানিমেশন debounce করুন** বড় ডেটার জন্য

---

## 🎓 শিখুন আরও

বিস্তারিত ডকুমেন্টেশনের জন্য দেখুন: [`iOS_UI_GUIDE.md`](iOS_UI_GUIDE.md)

---

**আপনার iOS UI যাত্রা শুরু করুন আজই!** 🚀
