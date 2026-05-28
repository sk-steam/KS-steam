/**
 * UI Module
 * Handles UI interactions and updates
 */

class UIService {
    /**
     * Show toast notification
     */
    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} animate-slideInDown`;
        toast.style.position = 'fixed';
        toast.style.top = '100px';
        toast.style.right = '20px';
        toast.style.zIndex = '3000';
        toast.style.maxWidth = '400px';
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <div class="alert-icon">${icons[type] || icons.info}</div>
            <div class="alert-content">
                <div class="alert-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div>${message}</div>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Show loading spinner
     */
    static showLoading(message = 'Loading...') {
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        `;
        loader.innerHTML = `
            <div class="spinner" style="width: 60px; height: 60px;"></div>
            <p>${message}</p>
        `;
        document.body.appendChild(loader);
    }

    /**
     * Hide loading spinner
     */
    static hideLoading() {
        const loader = document.getElementById('global-loader');
        if (loader) loader.remove();
    }

    /**
     * Update user avatar
     */
    static updateAvatar(username) {
        const avatars = document.querySelectorAll('.user-avatar, #profileAvatar');
        const initial = username.charAt(0).toUpperCase();
        avatars.forEach(avatar => {
            avatar.textContent = initial;
        });
    }

    /**
     * Update user name display
     */
    static updateUserName(username) {
        const userNames = document.querySelectorAll('.user-name, #profileName, #userName');
        userNames.forEach(el => {
            el.textContent = username;
        });
    }

    /**
     * Disable button
     */
    static disableButton(buttonElement, message = 'Processing...') {
        if (!buttonElement) return;
        buttonElement.disabled = true;
        buttonElement.textContent = message;
        buttonElement.style.opacity = '0.5';
        buttonElement.style.cursor = 'not-allowed';
    }

    /**
     * Enable button
     */
    static enableButton(buttonElement, originalText = 'Submit') {
        if (!buttonElement) return;
        buttonElement.disabled = false;
        buttonElement.textContent = originalText;
        buttonElement.style.opacity = '1';
        buttonElement.style.cursor = 'pointer';
    }

    /**
     * Shake element (error feedback)
     */
    static shakeElement(element) {
        if (!element) return;
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'shake 0.4s ease';
        }, 10);
    }

    /**
     * Show modal
     */
    static showModal(modalId, data = {}) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Update modal content if data provided
            if (data.title) {
                const titleEl = modal.querySelector('.modal-title');
                if (titleEl) titleEl.textContent = data.title;
            }
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close modal
     */
    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * Animate element entrance
     */
    static animateEntrance(element, animation = 'fadeInUp') {
        if (!element) return;
        element.classList.add(`animate-${animation}`);
    }

    /**
     * Create animated progress bar
     */
    static updateProgress(containerId, percentage, color = '#00d9ff') {
        let container = document.getElementById(containerId);
        
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = 'progress-bar';
            document.body.appendChild(container);
        }

        const fill = container.querySelector('.progress-bar-fill') || document.createElement('div');
        fill.className = 'progress-bar-fill';
        fill.style.width = percentage + '%';
        fill.style.backgroundColor = color;
        
        if (!container.contains(fill)) {
            container.appendChild(fill);
        }
    }
}

// Add shake animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Make UIService globally accessible
window.UIService = UIService;
