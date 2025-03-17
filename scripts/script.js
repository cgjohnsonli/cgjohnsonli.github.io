document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');

    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-visible');
            toggleButton.classList.toggle('sidebar-open');
        });
    }

    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isExpanded = this.classList.contains('active');
            
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + "px";
                this.classList.add('active');
                this.textContent = '收起回复';
            } else {
                content.style.maxHeight = null;
                this.classList.remove('active');
                this.textContent = '查看回复';
            }
        });
    });
});
