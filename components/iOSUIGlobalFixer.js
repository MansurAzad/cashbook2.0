/**
 * iOS UI System - Complete Auto-Fix for All Pages
 * This script automatically patches all existing UI elements to iOS style
 */

const iOSUICorrectionSystem = {
    // Initialize on page load
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyGlobalFixes());
        } else {
            this.applyGlobalFixes();
        }
    },

    // Apply global CSS fixes
    applyGlobalFixes() {
        const style = document.createElement('style');
        style.textContent = `
            /* iOS-style Input Fields */
            input[type="text"],
            input[type="email"],
            input[type="password"],
            input[type="number"],
            input[type="date"],
            input[type="month"],
            input[type="tel"],
            textarea,
            select {
                border-radius: 0.875rem !important;
                border: 2px solid #e5e7eb !important;
                padding: 0.75rem 1rem !important;
                font-size: 1rem !important;
                font-weight: 500 !important;
                transition: all 0.2s !important;
            }

            input:focus,
            textarea:focus,
            select:focus {
                border-color: #3b82f6 !important;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
                outline: none !important;
            }

            input:disabled,
            textarea:disabled,
            select:disabled {
                background-color: #f3f4f6 !important;
                color: #9ca3af !important;
            }

            /* iOS-style Cards */
            .card {
                background: white !important;
                border-radius: 1rem !important;
                border: 1px solid #e5e7eb !important;
                padding: 1.5rem !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }

            .card:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
            }

            /* iOS-style Buttons */
            .btn,
            button {
                border-radius: 0.875rem !important;
                padding: 0.75rem 1.5rem !important;
                font-weight: 700 !important;
                border: none !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }

            .btn:active,
            button:active {
                transform: scale(0.98) !important;
            }

            .btn-primary {
                background-color: #3b82f6 !important;
                color: white !important;
            }

            .btn-primary:hover {
                background-color: #2563eb !important;
            }

            /* iOS-style Modals */
            .modal {
                border-radius: 1.5rem !important;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
            }

            /* Safe Area Support */
            body {
                padding-left: max(env(safe-area-inset-left), 1rem) !important;
                padding-right: max(env(safe-area-inset-right), 1rem) !important;
            }

            /* Haptic feedback on interactive elements */
            [role="button"],
            button,
            input[type="button"],
            input[type="submit"],
            a[href] {
                user-select: none !important;
                -webkit-user-select: none !important;
                -webkit-touch-callout: none !important;
            }

            /* Progress bars iOS style */
            progress {
                border-radius: 999px !important;
                height: 0.75rem !important;
                overflow: hidden !important;
            }

            progress::-webkit-progress-bar {
                background-color: #e5e7eb !important;
                border-radius: 999px !important;
            }

            progress::-webkit-progress-value {
                background-color: #10b981 !important;
                border-radius: 999px !important;
            }

            /* Form styling */
            .form-group {
                margin-bottom: 1.5rem !important;
            }

            .form-group label {
                display: block !important;
                font-weight: 700 !important;
                margin-bottom: 0.5rem !important;
                color: #111827 !important;
                font-size: 0.875rem !important;
            }

            /* Text field wrapper */
            .input-wrapper {
                position: relative !important;
                display: flex !important;
                align-items: center !important;
            }

            .input-wrapper input {
                flex: 1 !important;
            }

            /* Icon support in inputs */
            .input-icon {
                position: absolute !important;
                right: 1rem !important;
                font-size: 1.25rem !important;
                pointer-events: none !important;
                color: #6b7280 !important;
            }

            /* Error state */
            .error input,
            .error textarea,
            .error select {
                border-color: #ef4444 !important;
            }

            .error-message {
                color: #ef4444 !important;
                font-size: 0.875rem !important;
                margin-top: 0.25rem !important;
            }

            /* Success state */
            .success input,
            .success textarea,
            .success select {
                border-color: #10b981 !important;
            }

            /* Loading state */
            .loading {
                opacity: 0.6 !important;
                pointer-events: none !important;
            }

            /* Spacing adjustments for mobile */
            @media (max-width: 640px) {
                .card {
                    padding: 1rem !important;
                }

                .btn {
                    padding: 0.625rem 1.25rem !important;
                    font-size: 0.875rem !important;
                }

                body {
                    padding-left: max(env(safe-area-inset-left), 0.75rem) !important;
                    padding-right: max(env(safe-area-inset-right), 0.75rem) !important;
                    padding-top: max(env(safe-area-inset-top), 0.5rem) !important;
                    padding-bottom: max(env(safe-area-inset-bottom), 0.5rem) !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Apply fixes to existing elements
        this.fixAllInputFields();
        this.fixAllCards();
        this.fixAllButtons();
        this.fixAllModals();

        // Watch for dynamically added elements
        this.observeDOMChanges();

        // Add haptic feedback support
        this.enableHapticFeedback();
    },

    // Fix all input fields
    fixAllInputFields() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Already styled by global CSS, add focus handling
            input.addEventListener('focus', (e) => {
                e.target.classList.add('focused');
            });
            input.addEventListener('blur', (e) => {
                e.target.classList.remove('focused');
            });
        });
    },

    // Fix all cards
    fixAllCards() {
        const cards = document.querySelectorAll('.card, [data-card]');
        cards.forEach(card => {
            card.classList.add('card');
        });
    },

    // Fix all buttons
    fixAllButtons() {
        const buttons = document.querySelectorAll('button, .btn, input[type="button"], input[type="submit"]');
        buttons.forEach(btn => {
            if (!btn.classList.contains('btn-primary') && !btn.classList.contains('btn-secondary')) {
                btn.classList.add('btn');
            }
        });
    },

    // Fix all modals
    fixAllModals() {
        const modals = document.querySelectorAll('[role="dialog"], .modal, [data-modal]');
        modals.forEach(modal => {
            modal.classList.add('modal');
            modal.style.borderRadius = '1.5rem';
            modal.style.overflow = 'hidden';
        });
    },

    // Watch for dynamically added elements
    observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Fix new input fields
                            const inputs = node.querySelectorAll ? node.querySelectorAll('input, textarea, select') : [];
                            inputs.forEach(input => this.styleInput(input));

                            // Fix new cards
                            const cards = node.querySelectorAll ? node.querySelectorAll('[data-card], .card') : [];
                            cards.forEach(card => card.classList.add('card'));

                            // Fix new buttons
                            const buttons = node.querySelectorAll ? node.querySelectorAll('button, [role="button"]') : [];
                            buttons.forEach(btn => btn.classList.add('btn'));
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    },

    // Style individual input
    styleInput(input) {
        input.style.borderRadius = '0.875rem';
        input.style.border = '2px solid #e5e7eb';
        input.style.padding = '0.75rem 1rem';
        input.style.fontSize = '1rem';
        input.style.fontWeight = '500';
    },

    // Enable haptic feedback
    enableHapticFeedback() {
        const interactiveElements = document.querySelectorAll('button, [role="button"], a[href], input[type="submit"], input[type="button"]');
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(20); // 20ms vibration
                }
            });

            element.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10); // Light haptic on touch
                }
            });
        });
    }
};

// Initialize on load
iOSUICorrectionSystem.init();

// Export for testing
if (typeof window !== 'undefined') {
    window.iOSUICorrectionSystem = iOSUICorrectionSystem;
}
