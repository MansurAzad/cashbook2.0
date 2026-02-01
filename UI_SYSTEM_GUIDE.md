# DBH CASH - UI/UX System Guide

## সামঞ্জস্যপূর্ণ UI/UX শৈলী নির্দেশিকা

এই দস্তাবেজটি সম্পূর্ণ অ্যাপ্লিকেশনে সামঞ্জস্যপূর্ণ ডিজাইন নিশ্চিত করে।

---

## 1. Border Radius (গোলাকারতা)

### মানক Border Radius মূল্য:
- **xl**: 11px - ইনপুট ফিল্ড, ছোট উপাদান
- **2xl**: 16px - কার্ড, মডেল, বোতাম
- **3xl**: 24px - বড় কার্ড, বিশেষ উপাদান
- **full**: রাউন্ড - টুল, অ্যাভাটার

### কোথায় ব্যবহার করবেন:
```css
/* Input Fields */
.input-field { @apply rounded-xl; }

/* Buttons */
.btn { @apply rounded-xl; }

/* Cards */
.card { @apply rounded-2xl; }

/* Modals */
.modal-content { @apply rounded-2xl; }

/* Toasts */
.toast { @apply rounded-xl; }

/* Icons/Avatars */
.avatar { @apply rounded-full; }
```

---

## 2. Input Fields (ইনপুট ফিল্ড)

### ইনপুট ফিল্ড স্টাইলিং:
```html
<!-- এখানে ব্যবহার করুন -->
<input type="text" class="input-field" placeholder="...">
<input type="number" class="input-field" placeholder="...">
<input type="date" class="input-field">
<select class="input-field">...</select>
```

### Tailwind Classes:
- **প্যাডিং**: px-4 py-3
- **বর্ডার**: border border-gray-300
- **ফোকাস**: focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
- **Rounded**: rounded-xl
- **পটভূমি**: bg-white

### ফোকাস স্টেট:
- রঙ: Emerald-500 (#10B981)
- ছায়া: প্রসারিত ছায়া যোগ করা হয়

---

## 3. Buttons (বোতাম)

### বোতাম ধরন:

#### Primary Button (প্রধান বোতাম)
```html
<button class="btn btn-primary">করুন</button>
```
- পটভূমি: emerald-500
- টেক্সট: white
- হোভার: emerald-600

#### Secondary Button (গৌণ বোতাম)
```html
<button class="btn btn-secondary">বিকল্প</button>
```
- পটভূমি: gray-200
- টেক্সট: gray-900
- হোভার: gray-300

#### Ghost Button (ভূতের বোতাম)
```html
<button class="btn btn-ghost">বাতিল</button>
```
- পটভূমি: স্বচ্ছ
- টেক্সট: gray-700
- হোভার: gray-100

#### Danger Button (বিপদজনক বোতাম)
```html
<button class="btn btn-danger">মুছুন</button>
```
- পটভূমি: red-500
- টেক্সট: white
- হোভার: red-600

### বোতাম আকার:
- Rounded: `rounded-xl`
- Padding: `px-6 py-3` (স্ট্যান্ডার্ড)
- Font: `font-bold text-base`
- Shadow: `shadow-sm` স্বাভাবিক, `shadow-lg` হোভারে

---

## 4. Cards (কার্ড)

### কার্ড স্টাইলিং:
```html
<div class="card">
  <!-- কন্টেন্ট -->
</div>
```

### প্রপার্টি:
- পটভূমি: white
- Rounded: `rounded-2xl`
- Shadow: `shadow-sm` (সাধারণ), `shadow-md` (হোভার)
- Border: `border border-gray-200`
- Padding: `p-6` (বড়) বা `p-4` (ছোট)

### iOS কার্ড:
```html
<div class="ios-card">
  <!-- কন্টেন্ট -->
</div>
```

---

## 5. Modals এবং Popups (মডেল এবং পপআপ)

### মডেল স্ট্রাকচার:
```html
<div class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">শিরোনাম</h3>
    </div>
    <div class="modal-body">
      <!-- কন্টেন্ট -->
    </div>
    <div class="modal-footer">
      <!-- বোতাম -->
    </div>
  </div>
</div>
```

### পটভূমি:
- রঙ: black/50 (50% স্বচ্ছতা)
- ব্লার: backdrop-blur-md

### কন্টেন্ট:
- পটভূমি: white
- Rounded: `rounded-2xl`
- Padding: `p-6 sm:p-8`
- Shadow: `shadow-2xl`

---

## 6. Tabs (ট্যাব)

### ট্যাব স্টাইলিং:
```html
<div class="tab-list">
  <button class="tab-item active">সক্রিয়</button>
  <button class="tab-item">নিষ্ক্রিয়</button>
</div>
```

### অ্যাক্টিভ ট্যাব:
- Text Color: emerald-600
- Border-Bottom: 2px emerald-600
- Font: bold

### নিষ্ক্রিয় ট্যাব:
- Text Color: gray-600
- Border-Bottom: 2px transparent
- Hover: gray-900

---

## 7. Badges (ব্যাজ)

### ব্যাজ স্টাইলিং:
```html
<span class="badge badge-success">সফল</span>
<span class="badge badge-warning">সতর্কতা</span>
<span class="badge badge-error">ত্রুটি</span>
```

### Rounded: `rounded-full`
### Padding: `px-3 py-1.5`
### Font: `text-xs font-bold`

---

## 8. Alert Boxes (সতর্কতা বাক্স)

### সতর্কতা স্টাইলিং:
```html
<div class="alert alert-success">সাফল্যের বার্তা</div>
<div class="alert alert-warning">সতর্কতার বার্তা</div>
<div class="alert alert-error">ত্রুটির বার্তা</div>
```

### সব ধরনের জন্য:
- Rounded: `rounded-xl`
- Padding: `p-4`
- Border: 1px সীমান্ত

---

## 9. ফর্ম উপাদান (Form Elements)

### ফর্ম লেআউট:
```html
<div class="form-group">
  <label class="form-label">লেবেল</label>
  <input class="input-field" />
  <p class="form-hint">ইঙ্গিত টেক্সট</p>
  <p class="form-error">ত্রুটি বার্তা</p>
</div>
```

---

## 10. রঙ প্যালেট (Color Palette)

### প্রধান রঙ:
- **Emerald-500**: #10B981 (প্রধান সবুজ)
- **Emerald-600**: #059669 (হোভার)

### নিরপেক্ষ রঙ:
- **Gray-900**: #111827 (টেক্সট)
- **Gray-700**: #374151 (সাবটেক্সট)
- **Gray-200**: #E5E7EB (বিভাজক)

### স্থিতি রঙ:
- **Green/Emerald**: সাফল্য
- **Red**: বিপদ/ত্রুটি
- **Amber/Yellow**: সতর্কতা
- **Blue**: তথ্য

---

## 11. Typography (টাইপোগ্রাফি)

### ফন্ট পরিবার:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hind Siliguri', sans-serif;
```

### ফন্ট সাইজ:
- **Title (h1)**: 34px / 700 ওজন
- **Title (h2)**: 28px / 700 ওজন
- **Headline (h3)**: 17px / 700 ওজন
- **Body**: 16px / 400-500 ওজন

---

## 12. প্রকল্পের নমুনা কোড

### একটি সম্পূর্ণ ফর্ম উদাহরণ:
```html
<div class="card">
  <h2 class="text-2xl font-bold mb-6">নতুন লেনদেন</h2>
  
  <div class="form-group">
    <label class="form-label">ক্যাটাগরি</label>
    <select class="input-field">
      <option>নির্বাচন করুন</option>
      <option>খাদ্য</option>
      <option>পরিবহন</option>
    </select>
  </div>
  
  <div class="form-group">
    <label class="form-label">পরিমাণ</label>
    <input type="number" class="input-field" placeholder="০.০০" />
  </div>
  
  <div class="flex gap-3">
    <button class="btn btn-primary flex-1">যোগ করুন</button>
    <button class="btn btn-ghost flex-1">বাতিল</button>
  </div>
</div>
```

---

## 13. সাধারণ নিয়ম

✅ **করুন:**
- সর্বদা `.input-field` ক্লাস ব্যবহার করুন ইনপুট/সিলেক্টের জন্য
- সর্বদা `.btn` এবং `.btn-*` ক্লাস ব্যবহার করুন বোতামের জন্য
- সর্বদা `.card` ক্লাস ব্যবহার করুন কার্ড কন্টেনারের জন্য
- সামঞ্জস্যপূর্ণ থাকুন `rounded-xl` এবং `rounded-2xl` এর সাথে

❌ **করবেন না:**
- বিভিন্ন border-radius মূল্য মিশ্রিত করবেন না (যেমন `rounded-lg`, `rounded-3xl`)
- হার্ড-কোড করা রঙ ব্যবহার করবেন না স্টেট-নির্দিষ্ট ক্লাসের পরিবর্তে
- ছায়া অতিরিক্ত ব্যবহার করবেন না
- অসামঞ্জস্যপূর্ণ প্যাডিং/মার্জিন ব্যবহার করবেন না

---

## 14. আপডেট লগ

### সংস্করণ 1.0 (2026-02-02)
- ✅ সামঞ্জস্যপূর্ণ border-radius স্টাইলিং প্রয়োগ করা হয়েছে
- ✅ ইনপুট ফিল্ড স্টাইলিং একীভূত করা হয়েছে
- ✅ বোতাম স্টাইলিং একীভূত করা হয়েছে
- ✅ মডেল/পপআপ স্টাইলিং একীভূত করা হয়েছে
- ✅ কার্ড স্টাইলিং সামঞ্জস্যপূর্ণ করা হয়েছে

---

## যোগাযোগ

সমস্যা বা প্রশ্ন থাকলে, দয়া করে ডেভেলপমেন্ট টিমকে জানান।
