# iOS-অপটিমাইজড UI কম্পোনেন্টস গাইড

## 📱 ওভারভিউ

আপনার অ্যাপ্লিকেশনে সম্পূর্ণ iOS-স্টাইল ইউজার ইন্টারফেস বাস্তবায়িত হয়েছে। এটি নিশ্চিত করে যে আপনার অ্যাপ iPhone এবং iOS ডিভাইসে নেটিভ অ্যাপের মতো অনুভূত হয়।

---

## 🎨 UI কম্পোনেন্টস

### 1. **iOSTextField** - টেক্সট ইনপুট ফিল্ড
প্রতিটি টেক্সট ইনপুট নতুন iOS স্টাইলে ডিজাইন করা হয়েছে।

**বৈশিষ্ট্য:**
- ফোকাস অ্যানিমেশন
- আইকন সাপোর্ট
- এরর মেসেজিং
- রিয়েল-টাইম ভ্যালিডেশন

**ব্যবহার:**
```javascript
<iOSTextField
    label="পরিমাণ"
    value={amount}
    onChange={(val) => setAmount(val)}
    placeholder="0.00"
    icon={<span>৳</span>}
    error={error}
    required={true}
    inputMode="decimal"
/>
```

**Props:**
- `label` - ইনপুট লেবেল
- `value` - বর্তমান মান
- `onChange` - পরিবর্তন হ্যান্ডলার
- `placeholder` - প্লেসহোল্ডার টেক্সট
- `type` - ইনপুট টাইপ (text, number, date, etc.)
- `icon` - আইকন এলিমেন্ট
- `error` - এরর মেসেজ
- `required` - প্রয়োজনীয় চিহ্ন দেখাবেন?
- `disabled` - ডিসেবল করবেন?
- `maxLength` - সর্বোচ্চ দৈর্ঘ্য

---

### 2. **iOSCard** - কার্ড কম্পোনেন্ট
আধুনিক কার্ড ডিজাইন সব কন্টেন্টের জন্য।

**বৈশিষ্ট্য:**
- স্মুথ অ্যানিমেশন
- প্রেস ইফেক্ট
- কাস্টমাইজযোগ্য ব্যাকগ্রাউন্ড
- শ্যাডো এফেক্ট

**ব্যবহার:**
```javascript
<iOSCard
    backgroundColor="white"
    interactive={true}
    onClick={handleClick}
    elevation={true}
    padded={true}
>
    <h3>কার্ড শিরোনাম</h3>
    <p>কার্ড কন্টেন্ট</p>
</iOSCard>
```

**Props:**
- `backgroundColor` - white, gray, light, emerald, blue
- `interactive` - ক্লিক করা যাবে?
- `onClick` - ক্লিক হ্যান্ডলার
- `elevation` - শ্যাডো দেখাবেন?
- `padded` - প্যাডিং যোগ করবেন?
- `className` - অতিরিক্ত CSS ক্লাস

---

### 3. **iOSButton** - বাটান
সব ধরনের বাটনের জন্য একক সমাধান।

**ব্যবহার:**
```javascript
<iOSButton
    variant="primary"  // primary, secondary, tertiary, danger
    size="large"       // small, medium, large
    onClick={handleClick}
    fullWidth={true}
    loading={loading}
    icon={<div className="icon-plus"></div>}
>
    যোগ করুন
</iOSButton>
```

**প্রি-ডিজাইনড বাটনস:**

#### a) iOSFilledButton - পূর্ণ রঙের বাটন
```javascript
<iOSFilledButton
    color="emerald"  // emerald, red, blue, gray
    size="large"
    fullWidth={true}
    onClick={handleSubmit}
    loading={loading}
>
    সংরক্ষণ করুন
</iOSFilledButton>
```

#### b) iOSSoftButton - হালকা রঙের বাটন
```javascript
<iOSSoftButton
    color="gray"  // gray, emerald, red, blue
    icon={<div className="icon-x"></div>}
>
    বাতিল করুন
</iOSSoftButton>
```

---

### 4. **iOSSegmentedControl** - সেগমেন্টেড কন্ট্রোল
বিকল্প নির্বাচনের জন্য iOS স্টাইল সেগমেন্ট।

**ব্যবহার:**
```javascript
<iOSSegmentedControl
    segments={[
        { label: '↓ আয়', value: 'income' },
        { label: '↑ ব্যয়', value: 'expense' }
    ]}
    value={selectedType}
    onChange={(val) => setSelectedType(val)}
    fullWidth={true}
/>
```

---

### 5. **iOSSheet** - মডাল শীট
iOS-স্টাইল মডাল ডায়ালগ এবং শীট।

**ব্যবহার:**
```javascript
<iOSSheet
    isOpen={isOpen}
    onClose={handleClose}
    title="নতুন লেনদেন"
    scrollable={true}
    actions={[
        <iOSFilledButton onClick={handleSubmit}>
            যোগ করুন
        </iOSFilledButton>,
        <iOSSoftButton onClick={handleClose}>
            বাতিল করুন
        </iOSSoftButton>
    ]}
>
    {/* Form content */}
</iOSSheet>
```

---

### 6. **iOSToast** - বিজ্ঞপ্তি
অটো-হাইড টোস্ট মেসেজ।

**ব্যবহার:**
```javascript
const [toast, setToast] = React.useState(null);

<iOSToast
    message="সংরক্ষণ সফল হয়েছে!"
    type="success"  // success, error, warning, info
    duration={3000}
    onClose={() => setToast(null)}
/>
```

---

### 7. **iOSPicker** - ড্রপডাউন নির্বাচন
আধুনিক সিলেক্ট কম্পোনেন্ট।

**ব্যবহার:**
```javascript
<iOSPicker
    label="ক্যাটাগরি"
    value={category}
    onChange={(val) => setCategory(val)}
    options={[
        { label: 'খাদ্য', value: 'food' },
        { label: 'পরিবহন', value: 'transport' },
        { label: 'শিক্ষা', value: 'education' }
    ]}
    placeholder="নির্বাচন করুন"
    required={true}
    error={error}
/>
```

---

### 8. **iOSBadge** - ব্যাজ
স্ট্যাটাস ইন্ডিকেটর।

**ব্যবহার:**
```javascript
<iOSBadge
    text="পেন্ডিং"
    variant="warning"  // primary, secondary, success, danger, warning
    size="medium"      // small, medium, large
/>
```

---

### 9. **iOSSwitch** - টগল সুইচ
iOS-স্টাইল টগল স্যুইচ।

**ব্যবহার:**
```javascript
<iOSSwitch
    value={darkMode}
    onChange={(val) => setDarkMode(val)}
    label="ডার্ক মোড"
    disabled={false}
/>
```

---

### 10. **iOSGradientCard** - গ্রেডিয়েন্ট কার্ড
প্রিমিয়াম গ্রেডিয়েন্ট ব্যাকগ্রাউন্ড।

**ব্যবহার:**
```javascript
<iOSGradientCard
    gradientFrom="from-emerald-500"
    gradientTo="to-blue-500"
    onClick={handleClick}
    interactive={true}
>
    <h2 className="text-white font-bold">নেট ওয়ার্থ</h2>
    <p className="text-3xl font-black text-white">৳ 1,50,000</p>
</iOSGradientCard>
```

---

### 11. **iOSListItem** - লিস্ট আইটেম
ইন্টারঅ্যাক্টিভ লিস্ট আইটেম।

**ব্যবহার:**
```javascript
<iOSListItem
    icon={<div className="icon-settings"></div>}
    title="সেটিংস"
    subtitle="অ্যাপ সেটিংস পরিবর্তন করুন"
    rightContent={<div className="icon-chevron-right"></div>}
    onClick={handleClick}
    divider={true}
    interactive={true}
/>
```

---

### 12. **iOSActivityIndicator** - লোডিং স্পিনার
iOS-স্টাইল লোডিং ইন্ডিকেটর।

**ব্যবহার:**
```javascript
<iOSActivityIndicator
    size="medium"  // small, medium, large
    color="emerald"  // emerald, gray, white
/>
```

---

### 13. **iOSEmptyState** - খালি অবস্থা
খালি অবস্থার জন্য ভিউ।

**ব্যবহার:**
```javascript
<iOSEmptyState
    icon="📋"
    title="কোন লেনদেন নেই"
    description="আপনার প্রথম লেনদেন যোগ করুন শুরু করতে"
    action={
        <iOSFilledButton onClick={handleAddTransaction}>
            নতুন লেনদেন যোগ করুন
        </iOSFilledButton>
    }
/>
```

---

## 🎴 কার্ড কম্পোনেন্টস (বিশেষায়িত)

### **BudgetCardiOS** - বাজেট কার্ড
```javascript
<BudgetCardiOS
    budget={{ name: 'খাদ্য', category: 'খরচ', limit: 5000 }}
    spent={3500}
    remaining={1500}
    onEdit={handleEdit}
    onDelete={handleDelete}
/>
```

**প্রগ্রেস বার** এবং **অতিরিক্ত বাজেট সতর্কতা** সহ।

---

### **GoalCardiOS** - লক্ষ্য কার্ড
```javascript
<GoalCardiOS
    goal={{
        name: 'নিউ ফোন কিনুন',
        description: 'iPhone 15',
        icon: '📱',
        target: 100000
    }}
    achieved={45000}
    onEdit={handleEdit}
    onDelete={handleDelete}
    onContribute={handleContribute}
/>
```

---

### **BillCardiOS** - বিল কার্ড
```javascript
<BillCardiOS
    bill={{
        name: 'মোবাইল বিল',
        category: 'ইউটিলিটি',
        amount: 500,
        dueDate: '2025-02-10'
    }}
    onPay={handlePayment}
    onEdit={handleEdit}
    onDelete={handleDelete}
/>
```

**ঋণের তারিখ** এবং **অতিদেয় সতর্কতা** সহ।

---

### **InvestmentCardiOS** - বিনিয়োগ কার্ড
```javascript
<InvestmentCardiOS
    investment={{
        type: 'স্টক',
        description: 'গুগল শেয়ার',
        amount: 50000
    }}
    currentValue={55000}
    onEdit={handleEdit}
    onDelete={handleDelete}
/>
```

লাভ/ক্ষতি ট্র্যাকিং সহ।

---

### **LoanCardiOS** - ঋণ কার্ড
```javascript
<LoanCardiOS
    loan={{
        lenderName: 'ব্যাংক',
        amount: 200000,
        interestRate: 8,
        nextPaymentDate: '2025-02-15'
    }}
    remainingBalance={150000}
    onPay={handlePayment}
    onEdit={handleEdit}
    onDelete={handleDelete}
/>
```

পরিশোধ ট্র্যাকিং সহ।

---

### **AccountCardiOS** - অ্যাকাউন্ট কার্ড
```javascript
<AccountCardiOS
    account={{
        name: 'আমার ব্যাংক',
        type: 'বাংক',
        accountNumber: '12345678'
    }}
    balance={75000}
    onSelect={handleSelect}
    onEdit={handleEdit}
    onDelete={handleDelete}
/>
```

---

### **QuickStatCardiOS** - দ্রুত স্ট্যাট কার্ড
```javascript
<QuickStatCardiOS
    title="আজকের খরচ"
    value="৳ 2,500"
    subtitle="গত ৭ দিনে গড় ৳ 2,100"
    icon="📊"
    color="emerald"
    onClick={handleClick}
/>
```

---

## 🔄 Transactions iOS কম্পোনেন্ট

নতুন **TransactionsiOS** কম্পোনেন্ট সম্পূর্ণ iOS-স্টাইল লেনদেন ম্যানেজমেন্ট প্রদান করে।

**বৈশিষ্ট্য:**
- পরিচিত iOS ফিল্টার ট্যাব
- স্টিকি হেডার
- অ্যাডভান্সড সার্চ ফিল্টার
- iOS শীট মডাল
- ভয়েস ইনপুট সাপোর্ট
- সোয়াইপ অ্যাকশন

**ব্যবহার:**
```javascript
<TransactionsiOS
    data={data}
    onAdd={handleAdd}
    onUpdate={handleUpdate}
    onDelete={handleDelete}
    loading={loading}
    currencySymbol="৳"
    initialParams={params}
/>
```

---

## 🎨 ডিজাইন নীতি

### রঙ প্যালেট
```javascript
const colors = {
    primary: '#10B981',      // Emerald 500
    danger: '#EF4444',       // Red 500
    warning: '#F59E0B',      // Orange 500
    info: '#3B82F6',         // Blue 500
    success: '#10B981',      // Emerald 500
    neutral: '#6B7280'       // Gray 500
};
```

### টাইপোগ্রাফি
```javascript
const typography = {
    largeTitle: 'font-black text-4xl',
    title: 'font-bold text-2xl',
    headline: 'font-bold text-lg',
    body: 'font-medium text-base',
    subheading: 'font-semibold text-sm',
    caption: 'font-medium text-xs'
};
```

### স্পেসিং
- **প্যাডিং**: 4px, 8px, 12px, 16px, 24px, 32px
- **মার্জিন**: একই
- **রাউন্ড**: 4px, 8px, 12px, 16px, 20px, 24px

---

## 📐 iOS সেফ এরিয়া

সব কম্পোনেন্ট স্বয়ংক্রিয়ভাবে iPhone X+ নচ এবং হোম ইন্ডিকেটর সামঞ্জস্য করে।

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

---

## 🚀 সাধারণ ব্যবহারের ক্ষেত্র

### 1. ফর্ম সাবমিট করার সময়
```javascript
const [loading, setLoading] = React.useState(false);

const handleSubmit = async () => {
    setLoading(true);
    try {
        // API কল
        setToast({ message: 'সফল!', type: 'success' });
    } catch (error) {
        setToast({ message: 'ত্রুটি!', type: 'error' });
    } finally {
        setLoading(false);
    }
};

<iOSFilledButton
    onClick={handleSubmit}
    loading={loading}
    color="emerald"
>
    সংরক্ষণ করুন
</iOSFilledButton>
```

### 2. লিস্ট আইটেম প্রদর্শন করার সময়
```javascript
{items.length === 0 ? (
    <iOSEmptyState
        icon="📋"
        title="কোন আইটেম নেই"
        action={<iOSFilledButton>যোগ করুন</iOSFilledButton>}
    />
) : (
    items.map(item => (
        <iOSCard key={item.id} interactive={true}>
            {/* কন্টেন্ট */}
        </iOSCard>
    ))
)}
```

### 3. সার্চ এবং ফিল্টার করার সময়
```javascript
<div className="space-y-3">
    <iOSTextField
        label="খুঁজুন"
        value={search}
        onChange={setSearch}
        icon={<div className="icon-search"></div>}
        placeholder="খোঁজার জন্য টাইপ করুন..."
    />
    <iOSSegmentedControl
        segments={filterOptions}
        value={filter}
        onChange={setFilter}
    />
</div>
```

---

## ✅ চেকলিস্ট: iOS অপটিমাইজেশন

- ✅ সব ইনপুট ফিল্ড iOS-স্টাইল
- ✅ সব কার্ডস iOS-স্টাইল
- ✅ সব বাটনস iOS-স্টাইল
- ✅ সব মডালস iOS-শীট
- ✅ অ্যানিমেশন মসৃণ এবং দ্রুত
- ✅ ট্যাচ ফিডব্যাক অন্তর্ভুক্ত
- ✅ হ্যাপটিক রেসপন্স সাপোর্ট
- ✅ সেফ এরিয়া হ্যান্ডলিং
- ✅ ডার্ক মোড সাপোর্ট প্রস্তুত
- ✅ অ্যাক্সেসিবিলিটি ফোকাস

---

## 🔧 কাস্টমাইজেশন

### থিম রঙ পরিবর্তন
```javascript
const theme = {
    primary: '#EC4899',  // গোলাপি
    secondary: '#8B5CF6', // বেগুনি
    // ...
};
```

### ফন্ট পরিবর্তন
```css
body {
    font-family: 'আপনার ফন্ট', -apple-system, sans-serif;
}
```

---

## 📚 অতিরিক্ত সংস্থান

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [iOS Design Pattern](https://www.nngroup.com/articles/ios-design-patterns/)

---

**প্রস্তুত!** আপনার অ্যাপ এখন সম্পূর্ণ iOS-স্টাইল UI দিয়ে সজ্জিত। 🎉
