/**
 * URGENT: iOS UI Fix Script
 * এই স্ক্রিপ্ট সমস্ত ভাঙা UI এবং স্টেকচার সমস্যা ঠিক করে।
 * 
 * ব্যবহার: এই ফাইলটি index.html এর শেষে app.js এর আগে লোড করুন
 */

// ============= iOS UI INITIALIZATION =============
window.iOSUIInitialized = true;

// সমস্ত পুরাতন স্টাইল ফিক্স এবং উন্নতি
document.addEventListener('DOMContentLoaded', () => {
    // ১. সব ইনপুট ফিল্ড দেশীয় করুন
    document.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], input[type="password"], input[type="tel"]').forEach(input => {
        if (!input.classList.contains('input-field') && !input.classList.contains('px-4')) {
            input.className = 'input-field w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:bg-emerald-50 focus:outline-none transition-all font-medium';
        }
    });

    // ২. সব সিলেক্ট এলিমেন্ট ঠিক করুন
    document.querySelectorAll('select').forEach(select => {
        if (!select.classList.contains('input-field')) {
            select.className = 'input-field w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:bg-emerald-50 outline-none font-medium bg-white';
        }
    });

    // ৩. সব টেক্সট এরিয়া ঠিক করুন
    document.querySelectorAll('textarea').forEach(textarea => {
        if (!textarea.classList.contains('input-field')) {
            textarea.className = 'input-field w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:bg-emerald-50 outline-none font-medium resize-none';
        }
    });

    // ৪. সব কার্ড ঠিক করুন
    document.querySelectorAll('.card').forEach(card => {
        if (!card.classList.contains('rounded-2xl')) {
            card.classList.add('rounded-2xl', 'border', 'border-gray-200', 'shadow-sm');
            card.classList.remove('rounded-xl', 'rounded-lg');
        }
    });

    // ৫. সব বাটন ঠিক করুন
    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('btn') || button.classList.contains('btn-primary')) {
            button.className = 'px-6 py-3.5 rounded-2xl font-bold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none text-base shadow-sm active:scale-95 ' + button.className;
        }
    });

    // ৬. Spacing সমস্যা ঠিক করুন
    document.querySelectorAll('[className*="space-y"]').forEach(el => {
        // space-y ক্লাস ইতিমধ্যে ঠিক আছে
    });

    // ৭. সমস্ত fixed ইলিমেন্টের জন্য z-index ঠিক করুন
    document.querySelectorAll('[className*="fixed"]').forEach(el => {
        if (el.classList.contains('fixed') && !el.getAttribute('style')?.includes('z-index')) {
            const classes = el.className;
            if (classes.includes('top-0') || classes.includes('top-6')) {
                el.style.zIndex = '40';
            } else if (classes.includes('top-1/2')) {
                el.style.zIndex = '50';
            } else if (classes.includes('inset-0')) {
                el.style.zIndex = '30';
            }
        }
    });

    // ৮. অপ্টিমাইজেশন: Haptic Feedback
    if ('vibrate' in navigator) {
        document.addEventListener('click', function(e) {
            if (e.target.closest('button') && !e.target.closest('button').disabled) {
                navigator.vibrate(10);
            }
        });
    }

    console.log('✅ iOS UI অপটিমাইজেশন সম্পূর্ণ');
});

// ============= Utility Functions =============

// সব মডাল স্বয়ংক্রিয়ভাবে iOS শীট হয়ে যায়
function makeModalSheetiOS(modalElement) {
    if (!modalElement) return;
    
    modalElement.classList.add('fixed', 'inset-0', 'z-50', 'flex', 'items-end');
    modalElement.classList.remove('flex', 'items-center', 'justify-center');
    
    const content = modalElement.querySelector('[className*="bg-white"]') || modalElement.querySelector('div:first-child');
    if (content) {
        content.classList.add('rounded-t-3xl', 'w-full', 'max-h-[90vh]', 'animate-slide-up');
        content.classList.remove('rounded-xl', 'max-w-md');
    }
}

// সব পপআপ ঠিক করুন
function fixAllPopups() {
    // ডায়ালগ
    document.querySelectorAll('[role="dialog"], .modal, .popup, [className*="modal"]').forEach(popup => {
        makeModalSheetiOS(popup);
    });
}

// ফর্ম স্বয়ংক্রিয় ভ্যালিডেশন উন্নত করুন
function enhanceFormValidation(formElement) {
    if (!formElement) return;
    
    formElement.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        field.addEventListener('blur', () => {
            if (!field.value) {
                field.classList.add('border-red-500', 'bg-red-50');
                field.classList.remove('border-gray-200');
            } else {
                field.classList.remove('border-red-500', 'bg-red-50');
                field.classList.add('border-gray-200');
            }
        });
    });
}

// ============= Global Fixes =============

// সব পেজ লোডিংয়ের পরে ঠিক করুন
window.addEventListener('load', () => {
    fixAllPopups();
    
    // সব ফর্ম উন্নত করুন
    document.querySelectorAll('form').forEach(form => {
        enhanceFormValidation(form);
    });
    
    // অ্যানিমেশন পারফরম্যান্স অপটিমাইজ করুন
    document.documentElement.style.scrollBehavior = 'smooth';
    
    console.log('✅ সব পেজ iOS-অপটিমাইজড');
});

// React এনমাউন্ট/আপডেটের পরে ফিক্স চালান
const originalSetTimeout = window.setTimeout;
window.setTimeout = function(...args) {
    const result = originalSetTimeout.apply(this, args);
    if (args[1] > 0 && args[1] < 500) {
        originalSetTimeout(() => {
            fixAllPopups();
        }, args[1] + 100);
    }
    return result;
};

// MutationObserver - নতুন এলিমেন্ট যোগ হলে ঠিক করুন
const observer = new MutationObserver((mutations) => {
    let needsFix = false;
    
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    if (node.querySelector?.('input, select, textarea, .card, button')) {
                        needsFix = true;
                    }
                }
            });
        }
    });
    
    if (needsFix) {
        setTimeout(() => {
            fixAllPopups();
            document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
                if (!input.classList.contains('input-field')) {
                    input.classList.add('input-field', 'px-4', 'py-3.5', 'rounded-2xl', 'border-2', 'border-gray-200');
                }
            });
        }, 100);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('✅ iOS UI ফিক্সার স্ক্রিপ্ট লোড হয়েছে');
