document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.sidebar ul li a');

    // 切换侧边栏的显示状态
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('sidebar-visible');
        toggleButton.classList.toggle('sidebar-open');
    });

    // 添加滚动监听来更新活动导航项
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('.section-card');
        
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 点击导航链接时平滑滚动到对应部分
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });

            // 在移动设备上，点击链接后关闭侧边栏
            if (window.innerWidth <= 1000) {
                sidebar.classList.remove('sidebar-visible');
                toggleButton.classList.remove('sidebar-open');
            }
        });
    });
});

document.querySelectorAll('.expand-btn').forEach(button => {
    button.addEventListener('click', function() {
        var detailedContent = this.nextElementSibling;
        if (detailedContent.style.display === 'none') {
            detailedContent.style.display = 'block';
            this.textContent = '收起详细内容';
        } else {
            detailedContent.style.display = 'none';
            this.textContent = this.textContent.replace('收起', '展开');
        }
    });
});