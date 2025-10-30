class Lang {
    static current = {};

    static init() {
        const lang = localStorage.getItem('language') || 'uk';
        this.current = lang === 'uk' ? LANG_UK : LANG_EN;
        this.updateUI();
    }

    static get(key) {
        return key.split('.').reduce((obj, k) => obj?.[k], this.current) || key;
    }

    static updateUI() {
        // Update static elements
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            el.textContent = this.get(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-placeholder]').forEach(el => {
            const key = el.getAttribute('data-placeholder');
            el.placeholder = this.get(key);
        });

        // Update dynamic content
        this.updateDynamicContent();
    }

    static updateDynamicContent() {
        // Update page title
        document.title = 'KS Steam - ' + this.get(window.location.hash.slice(1) || 'store');
        
        // Update search placeholder
        const searchInput = document.getElementById('storeSearch');
        if (searchInput) {
            searchInput.placeholder = this.get('search');
        }

        // Update modals
        const modals = document.querySelectorAll('.modal h2');
        modals.forEach(modal => {
            if (modal.closest('#loginModal')) {
                modal.textContent = this.get('auth.login.title');
            } else if (modal.closest('#registerModal')) {
                modal.textContent = this.get('auth.register.title');
            }
        });
    }
}

// Initialize language system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Lang.init();
});
