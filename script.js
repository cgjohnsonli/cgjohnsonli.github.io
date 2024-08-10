document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');

    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('sidebar-visible');
        toggleButton.classList.toggle('sidebar-open');
    });
});
