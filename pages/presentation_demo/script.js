class PresentationDemo {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 5;
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSlideIndicators();
        this.addAnimations();
    }

    bindEvents() {
        // 导航按钮事件
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slideNum = parseInt(e.target.dataset.slide);
                this.goToSlide(slideNum);
            });
        });

        // 控制按钮事件
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.previousSlide();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextSlide();
        });

        // 指示器事件
        document.querySelectorAll('.indicator').forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const slideNum = parseInt(e.target.dataset.slide);
                this.goToSlide(slideNum);
            });
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            } else if (e.key >= '1' && e.key <= '5') {
                this.goToSlide(parseInt(e.key));
            }
        });

        // 触摸事件（移动端）
        let startX = 0;
        let endX = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });

        // CTA按钮事件
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick(e.target.textContent);
            });
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    goToSlide(slideNum) {
        if (this.isTransitioning || slideNum < 1 || slideNum > this.totalSlides) {
            return;
        }

        this.isTransitioning = true;

        // 隐藏当前幻灯片
        const currentSlideElement = document.getElementById(`slide-${this.currentSlide}`);
        currentSlideElement.classList.remove('active');

        // 显示新幻灯片
        const newSlideElement = document.getElementById(`slide-${slideNum}`);
        newSlideElement.classList.add('active');

        // 更新导航按钮状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-slide="${slideNum}"]`).classList.add('active');

        // 更新指示器
        this.updateSlideIndicators(slideNum);

        this.currentSlide = slideNum;

        // 添加进入动画
        this.addSlideAnimations(slideNum);

        // 重置过渡状态
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    previousSlide() {
        const prevSlide = this.currentSlide > 1 ? this.currentSlide - 1 : this.totalSlides;
        this.goToSlide(prevSlide);
    }

    nextSlide() {
        const nextSlide = this.currentSlide < this.totalSlides ? this.currentSlide + 1 : 1;
        this.goToSlide(nextSlide);
    }

    updateSlideIndicators(activeSlide = this.currentSlide) {
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index + 1 === activeSlide) {
                indicator.classList.add('active');
            }
        });
    }

    addSlideAnimations(slideNum) {
        const slideElement = document.getElementById(`slide-${slideNum}`);
        const elements = slideElement.querySelectorAll('.feature-card, .scenario-item, .summary-point, .stat-item');

        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    addAnimations() {
        // 为第一页添加初始动画
        this.addSlideAnimations(1);

        // 添加滚动视差效果
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.presentation-container');
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });
    }

    handleCTAClick(buttonText) {
        switch(buttonText) {
            case '开始体验':
                this.goToSlide(2);
                break;
            case '了解更多':
                this.goToSlide(3);
                break;
            default:
                console.log('CTA按钮点击:', buttonText);
        }
    }

    // 自动播放功能（可选）
    startAutoPlay(interval = 5000) {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, interval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new PresentationDemo();
    
    // 可选：启动自动播放
    // presentation.startAutoPlay();
    
    // 鼠标悬停时暂停自动播放
    document.addEventListener('mouseenter', () => {
        presentation.stopAutoPlay();
    });
    
    // 鼠标离开时恢复自动播放
    document.addEventListener('mouseleave', () => {
        // presentation.startAutoPlay();
    });
});

// 添加一些额外的交互效果
document.addEventListener('DOMContentLoaded', () => {
    // 为功能卡片添加点击效果
    document.querySelectorAll('.feature-card, .scenario-item').forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });

    // 为统计数字添加计数动画
    const animateNumbers = () => {
        document.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
            }, 50);
        });
    };

    // 当第一页显示时启动数字动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id === 'slide-1') {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(document.getElementById('slide-1'));
}); 