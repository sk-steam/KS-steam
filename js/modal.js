class Modal {
    static open(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('active');
            // Clear any error messages
            const errorElement = modal.querySelector('[id$="Error"]');
            if (errorElement) {
                errorElement.textContent = '';
            }
            // Clear form if exists
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    }

    static close(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
        }
    }
}
