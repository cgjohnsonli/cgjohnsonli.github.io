class ImmersiveStory {
    constructor() {
        this.sections = [];
        this.currentSection = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }

    init() {
        this.setupSections();
        this.bindEvents();
        this.updateProgress();
        this.observeVisibility();
    }

    setupSections() {
        // 获取所有章节
        this.sections = Array.from(document.querySelectorAll('.story-section'));
        
        // 为每个章节添加索引
        this.sections.forEach((section, index) => {
            section.dataset.index = index;
        });
    }

    bindEvents() {
        // 滚动事件 - 只保留进度条更新
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                this.isScrolling = true;
                this.handleScroll();
                
                // 防抖处理
                clearTimeout(this.scrollTimeout);
                this.scrollTimeout = setTimeout(() => {
                    this.isScrolling = false;
                }, 100);
            }
        }, { passive: true });

        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.updateProgress();
        });
    }

    handleScroll() {
        this.updateProgress();
        this.updateCurrentSection();
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    }

    updateCurrentSection() {
        const scrollTop = window.pageYOffset + window.innerHeight / 2;
        
        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                if (this.currentSection !== index) {
                    this.currentSection = index;
                    this.onSectionChange(index);
                }
            }
        });
    }

    onSectionChange(sectionIndex) {
        // 触发章节变化事件 - 仅用于内部状态管理，不进行自动滚动
        const event = new CustomEvent('sectionChange', {
            detail: { sectionIndex, section: this.sections[sectionIndex] }
        });
        document.dispatchEvent(event);
    }

    observeVisibility() {
        // 使用 Intersection Observer 来触发文本动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const textBlock = entry.target.querySelector('.text-block');
                    if (textBlock && !textBlock.classList.contains('visible')) {
                        // 延迟显示文本块
                        setTimeout(() => {
                            textBlock.classList.add('visible');
                        }, 200);
                    }
                    
                    // 特殊处理audience section的逐行动画
                    if (entry.target.id === 'audience') {
                        this.animateAudienceLines(entry.target);
                    }
                    
                    // 特殊处理case2 section的时间轴动画
                    if (entry.target.id === 'case2') {
                        this.animateCase2Timeline(entry.target);
                    }
                    
                    // 特殊处理trap section的科技宫殿背景动画
                    if (entry.target.id === 'trap') {
                        this.animateTrapSection(entry.target);
                    }
                    
                    // 特殊处理story-return section的段落动画和社交证明
                    if (entry.target.id === 'story-return') {
                        this.animateStoryReturnSection(entry.target);
                    }
                    
                    // 特殊处理future section的段落动画
                    if (entry.target.id === 'future') {
                        this.animateFutureSection(entry.target);
                    }
                    
                    // 特殊处理reality section的段落动画
                    if (entry.target.id === 'reality') {
                        this.animateRealitySection(entry.target);
                    }
                    
                    // 特殊处理humanity section的段落动画
                    if (entry.target.id === 'humanity') {
                        this.animateHumanitySection(entry.target);
                    }
                    
                    // 特殊处理about section的动画
                    if (entry.target.id === 'about') {
                        this.animateAboutSection(entry.target);
                    }
                    
                    // 特殊处理ending section的动画
                    if (entry.target.classList.contains('about-ending-section')) {
                        this.animateEndingSection(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });

        // 观察所有章节
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    animateAudienceLines(audienceSection) {
        const lines = audienceSection.querySelectorAll('.audience-line');
        const animatedLines = audienceSection.querySelectorAll('.audience-line.visible');
        
        // 如果已经动画过，不再重复
        if (animatedLines.length > 0) {
            return;
        }
        
        lines.forEach((line, index) => {
            const delay = parseFloat(line.dataset.delay) || (index * 0.3);
            setTimeout(() => {
                line.classList.add('visible');
            }, delay * 1000);
        });
    }

    animateCase2Timeline(case2Section) {
        const timelineItems = case2Section.querySelectorAll('.timeline-item');
        const animatedItems = case2Section.querySelectorAll('.timeline-item.visible');
        
        // 如果已经动画过，不再重复
        if (animatedItems.length > 0) {
            return;
        }
        
        timelineItems.forEach((item, index) => {
            const delay = parseFloat(item.dataset.delay) || (index * 0.4);
            setTimeout(() => {
                item.classList.add('visible');
            }, delay * 1000);
        });
    }

    animateTrapSection(trapSection) {
        // 触发科技宫殿背景的崩塌动画
        const backdrop = trapSection.querySelector('.trap-backdrop');
        if (backdrop) {
            backdrop.style.animation = 'tech-collapse 40s ease-in-out infinite';
        }
        
        // 为动态标题添加点击交互
        const dynamicTitle = trapSection.querySelector('.trap-dynamic-title');
        if (dynamicTitle && !dynamicTitle.dataset.interactive) {
            dynamicTitle.dataset.interactive = 'true';
            
            dynamicTitle.addEventListener('click', () => {
                // 创建点击脉冲效果
                dynamicTitle.style.animation = 'none';
                setTimeout(() => {
                    dynamicTitle.style.animation = 'keyword-pulse 0.6s ease';
                }, 10);
                
                // 可以在这里添加更多交互效果
                // 比如播放音效、显示更多信息等
            });
        }
    }

    animateStoryReturnSection(storyReturnSection) {
        // 触发段落动画
        const paragraphs = storyReturnSection.querySelectorAll('.story-return-paragraph');
        paragraphs.forEach((paragraph, index) => {
            setTimeout(() => {
                paragraph.classList.add('visible');
            }, (index + 1) * 800);
        });
        
        // 延迟显示社交证明蒙版
        const socialProofOverlay = storyReturnSection.querySelector('.social-proof-overlay');
        if (socialProofOverlay) {
            setTimeout(() => {
                socialProofOverlay.classList.add('visible');
            }, 4000); // 4秒后显示
        }
        
        // 为故事关键词添加交互
        const storyKeyword = storyReturnSection.querySelector('.story-keyword');
        if (storyKeyword && !storyKeyword.dataset.interactive) {
            storyKeyword.dataset.interactive = 'true';
            
            storyKeyword.addEventListener('click', () => {
                // 创建点击脉冲效果
                storyKeyword.style.animation = 'none';
                setTimeout(() => {
                    storyKeyword.style.animation = 'keyword-pulse 0.6s ease';
                }, 10);
            });
        }

        // 为对比卡片添加悬停效果
        const comparisonCards = storyReturnSection.querySelectorAll('.comparison-card');
        comparisonCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
        
        // 为卡片图片添加交互效果
        const cardImages = storyReturnSection.querySelectorAll('.card-image');
        cardImages.forEach(image => {
            image.addEventListener('click', () => {
                // 创建点击脉冲效果
                image.style.animation = 'none';
                setTimeout(() => {
                    image.style.animation = 'keyword-pulse 0.6s ease';
                }, 10);
            });
            
            // 设置可访问性属性
            image.setAttribute('tabindex', '0');
            image.setAttribute('role', 'button');
            image.setAttribute('aria-label', '点击查看图片详情');
        });
    }

    animateFutureSection(futureSection) {
        // 触发诗性分句动画，创造情绪节奏感
        const poetryLines = futureSection.querySelectorAll('.poetry-line');
        const animatedLines = futureSection.querySelectorAll('.poetry-line.visible');
        
        // 如果已经动画过，不再重复
        if (animatedLines.length > 0) {
            return;
        }
        
        poetryLines.forEach((line, index) => {
            // 每行延迟1.2秒，创造停顿感
            setTimeout(() => {
                line.classList.add('visible');
                
                // 为"热爱它"添加特殊效果
                if (line.textContent.includes('热爱它')) {
                    line.style.animation = 'none';
                    setTimeout(() => {
                        line.style.animation = 'glow-pulse 2s ease-in-out infinite';
                    }, 100);
                }
            }, index * 1200);
        });
        
        // 为横幅引用添加点击交互
        const bannerQuote = futureSection.querySelector('.banner-quote');
        if (bannerQuote && !bannerQuote.dataset.interactive) {
            bannerQuote.dataset.interactive = 'true';
            
            bannerQuote.addEventListener('click', () => {
                // 创建点击脉冲效果
                bannerQuote.style.animation = 'none';
                setTimeout(() => {
                    bannerQuote.style.animation = 'keyword-pulse 0.6s ease';
                }, 10);
            });
        }
    }

    animateRealitySection(realitySection) {
        // 触发批判性文字震动式动画
        const paragraphs = realitySection.querySelectorAll('.reality-paragraph');
        const animatedParagraphs = realitySection.querySelectorAll('.reality-paragraph.visible');
        
        // 如果已经动画过，不再重复
        if (animatedParagraphs.length > 0) {
            return;
        }
        
        paragraphs.forEach((paragraph, index) => {
            // 每段延迟1.2秒，创造意识冲击感
            setTimeout(() => {
                paragraph.classList.add('visible');
                
                // 为最后一句"问题依然在人身上"添加特殊效果
                if (paragraph.textContent.includes('问题，依然在人身上')) {
                    paragraph.style.animation = 'none';
                    setTimeout(() => {
                        paragraph.style.animation = 'reality-glow 3s ease-in-out infinite';
                    }, 100);
                }
            }, index * 1200);
        });
        
        // 为AI谬误添加交互
        const aiMyth = realitySection.querySelector('.ai-myth');
        if (aiMyth && !aiMyth.dataset.interactive) {
            aiMyth.dataset.interactive = 'true';
            
            aiMyth.addEventListener('click', () => {
                // 创建点击脉冲效果
                aiMyth.style.animation = 'none';
                setTimeout(() => {
                    aiMyth.style.animation = 'keyword-pulse 0.6s ease';
                }, 10);
            });
            
            // 设置可访问性属性
            aiMyth.setAttribute('tabindex', '0');
            aiMyth.setAttribute('role', 'button');
            aiMyth.setAttribute('aria-label', '点击查看AI替代谬误的批判');
        }
        
        // 为横幅引用添加点击交互
        const realityBanners = realitySection.querySelectorAll('.reality-banner');
        realityBanners.forEach((banner, index) => {
            if (!banner.dataset.interactive) {
                banner.dataset.interactive = 'true';
                
                banner.addEventListener('click', () => {
                    // 创建点击脉冲效果
                    banner.style.animation = 'none';
                    setTimeout(() => {
                        banner.style.animation = 'keyword-pulse 0.6s ease';
                    }, 10);
                });
                
                // 设置可访问性属性
                banner.setAttribute('tabindex', '0');
                banner.setAttribute('role', 'button');
                banner.setAttribute('aria-label', `点击查看第${index + 1}个历史引用`);
            }
        });
        
        // 为最终觉醒句添加交互
        const realityAwakening = realitySection.querySelector('.reality-awakening');
        if (realityAwakening && !realityAwakening.dataset.interactive) {
            realityAwakening.dataset.interactive = 'true';
            
            realityAwakening.addEventListener('click', () => {
                // 创建点击脉冲效果
                realityAwakening.style.animation = 'none';
                setTimeout(() => {
                    realityAwakening.style.animation = 'reality-glow 3s ease-in-out infinite';
                }, 10);
            });
            
            // 设置可访问性属性
            realityAwakening.setAttribute('tabindex', '0');
            realityAwakening.setAttribute('role', 'button');
            realityAwakening.setAttribute('aria-label', '点击查看最终觉醒句');
        }
    }

    animateHumanitySection(humanitySection) {
        // 触发人文关怀文字呼吸式动画
        const paragraphs = humanitySection.querySelectorAll('.humanity-paragraph');
        const animatedParagraphs = humanitySection.querySelectorAll('.humanity-paragraph.visible');
        
        // 如果已经动画过，不再重复
        if (animatedParagraphs.length > 0) {
            return;
        }
        
        paragraphs.forEach((paragraph, index) => {
            // 每段延迟1.5秒，创造呼吸感
            setTimeout(() => {
                paragraph.classList.add('visible');
                
                // 为"面对现实的勇气"添加页面光感增强效果
                if (paragraph.textContent.includes('面对现实的勇气')) {
                    setTimeout(() => {
                        this.triggerHumanityBrightness();
                    }, 1000);
                }
            }, index * 1500);
        });
        
        // 为关键词添加微光点动画
        const keywords = humanitySection.querySelectorAll('.humanity-keyword');
        keywords.forEach(keyword => {
            if (!keyword.dataset.interactive) {
                keyword.dataset.interactive = 'true';
                
                keyword.addEventListener('click', () => {
                    // 创建点击脉冲效果
                    keyword.style.animation = 'none';
                    setTimeout(() => {
                        keyword.style.animation = 'keyword-pulse 0.6s ease';
                    }, 10);
                });
                
                // 设置可访问性属性
                keyword.setAttribute('tabindex', '0');
                keyword.setAttribute('role', 'button');
                keyword.setAttribute('aria-label', '点击查看人文关键词');
            }
        });
        
        // 为横幅引用添加点击交互
        const humanityBanner = humanitySection.querySelector('.humanity-banner');
        if (humanityBanner && !humanityBanner.dataset.interactive) {
            humanityBanner.dataset.interactive = 'true';
            
            humanityBanner.addEventListener('click', () => {
                // 创建点击脉冲效果
                humanityBanner.style.animation = 'none';
                setTimeout(() => {
                    humanityBanner.style.animation = 'keyword-pulse 0.6s ease';
                }, 10);
            });
            
            // 设置可访问性属性
            humanityBanner.setAttribute('tabindex', '0');
            humanityBanner.setAttribute('role', 'button');
            humanityBanner.setAttribute('aria-label', '点击查看人文关怀引用');
        }
        
        // 为最终人文关怀句添加交互
        const humanityFinal = humanitySection.querySelector('.humanity-final');
        if (humanityFinal && !humanityFinal.dataset.interactive) {
            humanityFinal.dataset.interactive = 'true';
            
            humanityFinal.addEventListener('click', () => {
                // 创建点击脉冲效果
                humanityFinal.style.animation = 'none';
                setTimeout(() => {
                    humanityFinal.style.animation = 'humanity-glow 3s ease-in-out infinite';
                }, 10);
            });
            
            // 设置可访问性属性
            humanityFinal.setAttribute('tabindex', '0');
            humanityFinal.setAttribute('role', 'button');
            humanityFinal.setAttribute('aria-label', '点击查看最终人文关怀句');
        }
        
        // 为对比插图添加交互效果
        const illustrations = humanitySection.querySelectorAll('.illustration-left, .illustration-right');
        illustrations.forEach((illustration, index) => {
            if (!illustration.dataset.interactive) {
                illustration.dataset.interactive = 'true';
                
                illustration.addEventListener('click', () => {
                    // 创建点击脉冲效果
                    illustration.style.animation = 'none';
                    setTimeout(() => {
                        illustration.style.animation = 'keyword-pulse 0.6s ease';
                    }, 10);
                });
                
                // 设置可访问性属性
                illustration.setAttribute('tabindex', '0');
                illustration.setAttribute('role', 'button');
                illustration.setAttribute('aria-label', `点击查看第${index + 1}个对比插图`);
            }
        });
    }

    // 触发页面光感增强效果
    triggerHumanityBrightness() {
        // 创建光感增强遮罩
        let brightnessOverlay = document.querySelector('.humanity-brightness');
        if (!brightnessOverlay) {
            brightnessOverlay = document.createElement('div');
            brightnessOverlay.className = 'humanity-brightness';
            document.body.appendChild(brightnessOverlay);
        }
        
        // 显示光感增强效果
        brightnessOverlay.classList.add('visible');
        
        // 3秒后渐暗
        setTimeout(() => {
            brightnessOverlay.classList.remove('visible');
            
            // 移除元素
            setTimeout(() => {
                if (brightnessOverlay.parentNode) {
                    brightnessOverlay.parentNode.removeChild(brightnessOverlay);
                }
            }, 2000);
        }, 3000);
    }

    // 获取当前章节信息
    getCurrentSection() {
        return {
            index: this.currentSection,
            element: this.sections[this.currentSection],
            id: this.sections[this.currentSection].id
        };
    }

    // 获取总章节数
    getTotalSections() {
        return this.sections.length;
    }

    // 特殊处理about section的作者信息动画
    animateAboutSection(aboutSection) {
        // 作者信息卡片动画
        const authorInfo = aboutSection.querySelector('.about-author-info');
        const readingSection = aboutSection.querySelector('.reading-section');
        const aboutEnding = aboutSection.querySelector('.about-ending');
        
        if (authorInfo && !authorInfo.classList.contains('animated')) {
            authorInfo.classList.add('animated');
            authorInfo.style.animation = 'fadeInUp 1.2s ease-out 0.6s forwards';
        }
        
        if (readingSection && !readingSection.classList.contains('animated')) {
            readingSection.classList.add('animated');
            readingSection.style.animation = 'fadeInUp 1.2s ease-out 0.9s forwards';
        }
        
        if (aboutEnding && !aboutEnding.classList.contains('animated')) {
            aboutEnding.classList.add('animated');
            aboutEnding.style.animation = 'fadeInUp 1.2s ease-out 1.2s forwards';
        }
        
        // 文章卡片hover效果
        const articleCards = aboutSection.querySelectorAll('.article-card');
        articleCards.forEach((card, index) => {
            if (!card.classList.contains('animated')) {
                card.classList.add('animated');
                card.style.animation = `fadeInUp 1.2s ease-out ${1.2 + index * 0.2}s forwards`;
            }
        });
        
        // 字段项目动画
        const fieldItems = aboutSection.querySelectorAll('.about-field-item');
        fieldItems.forEach((item, index) => {
            if (!item.classList.contains('animated')) {
                item.classList.add('animated');
                item.style.animation = `fadeInUp 1.2s ease-out ${0.9 + index * 0.1}s forwards`;
            }
        });
    }

    animateEndingSection(endingSection) {
        const aboutEnding = endingSection.querySelector('.about-ending');
        
        if (aboutEnding && !aboutEnding.classList.contains('animated')) {
            aboutEnding.classList.add('animated');
            aboutEnding.style.animation = 'fadeInUp 1.2s ease-out 0.3s forwards';
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const story = new ImmersiveStory();
    
    // 初始化封面动画
    initCoverAnimations();

    // 初始化#start打字机动画
    initStartTyping();
    
    // 初始化过渡效果
    initCoverTransitionEffects();
    
    // 初始化#competition section效果
    initCompetitionEffects();
    
    // 初始化过渡section效果
    initTransitionSectionEffects();
    
    // 初始化#trap section效果
    initTrapSectionEffects();
    
    // 初始化#story-return section效果
    initStoryReturnSectionEffects();
    
    // 初始化#future section效果
    initFutureSectionEffects();
    
    // 初始化#reality section效果
    initRealitySectionEffects();
    
    // 初始化#humanity section效果
    initHumanitySectionEffects();
    
    // 监听章节变化事件
    document.addEventListener('sectionChange', (e) => {
        const { sectionIndex, section } = e.detail;
        console.log(`当前章节: ${sectionIndex + 1}/${story.getTotalSections()} - ${section.id}`);
        
        // 可以在这里添加章节变化的额外逻辑
        // 比如更新导航状态、触发特定动画等
    });


    // 添加一些额外的交互效果
    addExtraInteractions();
});

// 初始化封面动画
function initCoverAnimations() {
    const coverSection = document.getElementById('cover');
    if (coverSection) {
        // 确保封面元素在页面加载时就开始动画
        const coverContent = coverSection.querySelector('.cover-content');
        if (coverContent) {
            // 添加一个小的延迟确保CSS动画能够正常触发
            setTimeout(() => {
                coverContent.style.opacity = '1';
            }, 100);
        }
    }
}

// #start section 打字机动画
function initStartTyping() {
    const dynamic = document.getElementById('typed-dynamic');
    const epilogue = document.querySelector('.typed-epilogue');
    if (!dynamic || !epilogue) return;
    
    const text = '但我错了——那样的"完美"，缺少温度。';
    let i = 0;
    dynamic.textContent = '';
    epilogue.style.opacity = 0;
    
    function typeNext() {
        if (i <= text.length) {
            dynamic.textContent = text.slice(0, i);
            i++;
            // 更慢的打字速度：120-200ms 随机间隔
            setTimeout(typeNext, Math.random() * 80 + 120);
        } else {
            dynamic.textContent = text;
            setTimeout(() => {
                dynamic.style.borderRight = 'none';
                epilogue.style.transition = 'opacity 1.2s ease';
                epilogue.style.opacity = 1;
            }, 500);
        }
    }
    
    // 使用 Intersection Observer 确保只在用户看到这部分时才触发动画
    let triggered = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !triggered) {
                triggered = true;
                // 延迟一秒开始打字，让用户有时间阅读前面的内容
                setTimeout(typeNext, 1000);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.6, // 当60%的内容可见时触发
        rootMargin: '0px 0px -100px 0px'
    });
    
    const startSection = document.getElementById('start');
    if (startSection) {
        observer.observe(startSection);
    }
}

// 初始化过渡效果
function initCoverTransitionEffects() {
    const connector = document.querySelector('.transition-connector');
    if (!connector) return;
    
    // 监听滚动，让连接线有动态效果
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const coverSection = document.getElementById('cover');
        if (!coverSection) return;
        
        const coverBottom = coverSection.offsetTop + coverSection.offsetHeight;
        const startSection = document.getElementById('start');
        if (!startSection) return;
        
        const startTop = startSection.offsetTop;
        
        // 当滚动到过渡区域时，增强连接线效果
        if (scrollTop > coverBottom - 200 && scrollTop < startTop + 200) {
            const progress = (scrollTop - (coverBottom - 200)) / (startTop - coverBottom + 400);
            const opacity = Math.min(1, progress * 2);
            const scale = 1 + progress * 0.3;
            
            connector.style.opacity = opacity;
            connector.style.transform = `translateX(-50%) scaleY(${scale})`;
            
            // 连接线底部圆点的发光效果
            const dot = connector.querySelector('::before');
            if (dot) {
                connector.style.setProperty('--glow-intensity', opacity.toString());
            }
        } else {
            connector.style.opacity = 0;
            connector.style.transform = 'translateX(-50%) scaleY(1)';
        }
    });
}

// 初始化#competition section效果
function initCompetitionEffects() {
    // 视差背景效果
    const competitionSection = document.getElementById('competition');
    if (!competitionSection) return;
    
    const exhibitionBg = competitionSection.querySelector('.exhibition-bg');
    const sketchBg = competitionSection.querySelector('.sketch-bg');
    
    window.addEventListener('scroll', () => {
        const rect = competitionSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset;
        
        // 只在section可见时应用视差效果
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const progress = (scrollTop - competitionSection.offsetTop) / window.innerHeight;
            
            if (exhibitionBg) {
                exhibitionBg.style.transform = `translateY(${progress * 50}px)`;
            }
            if (sketchBg) {
                sketchBg.style.transform = `translateY(${progress * -30}px)`;
            }
        }
    });
    
    // 记忆回闪动画
    const memoryFlashes = competitionSection.querySelectorAll('.memory-flash');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 1000);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    memoryFlashes.forEach(flash => {
        observer.observe(flash);
    });
}

// 初始化过渡section效果
function initTransitionSectionEffects() {
    const transitionSection = document.getElementById('transition');
    if (!transitionSection) return;
    
    const transitionText = transitionSection.querySelector('.transition-text');
    const techExit = transitionSection.querySelector('.tech-exit');
    const storyEnter = transitionSection.querySelector('.story-enter');
    const divider = transitionSection.querySelector('.transition-divider');
    
    // 使用 Intersection Observer 触发动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 触发文字动画
                setTimeout(() => {
                    if (techExit) techExit.style.opacity = '1';
                }, 500);
                
                setTimeout(() => {
                    if (divider) divider.style.opacity = '1';
                }, 1000);
                
                setTimeout(() => {
                    if (storyEnter) storyEnter.style.opacity = '1';
                }, 1500);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(transitionSection);
    
    // 初始化文字透明度
    if (techExit) techExit.style.opacity = '0';
    if (storyEnter) storyEnter.style.opacity = '0';
    if (divider) divider.style.opacity = '0';
    
    // 添加过渡动画
    [techExit, storyEnter, divider].forEach(element => {
        if (element) {
            element.style.transition = 'opacity 1s ease, transform 1s ease';
        }
    });
}

// 初始化#trap section效果
function initTrapSectionEffects() {
    const trapSection = document.getElementById('trap');
    if (!trapSection) return;
    
    // 为动态标题添加点击交互
    const dynamicTitle = trapSection.querySelector('.trap-dynamic-title');
    if (dynamicTitle) {
        dynamicTitle.addEventListener('click', () => {
            // 创建点击脉冲效果
            dynamicTitle.style.animation = 'none';
            setTimeout(() => {
                dynamicTitle.style.animation = 'keyword-pulse 0.6s ease';
            }, 10);
            
            // 可以在这里添加更多交互效果
            // 比如播放音效、显示更多信息等
        });
        
        // 设置可访问性属性
        dynamicTitle.setAttribute('tabindex', '0');
        dynamicTitle.setAttribute('role', 'button');
        dynamicTitle.setAttribute('aria-label', '点击查看隐藏注释');
    }
    
    // 为引用文字添加悬停效果
    const trapQuotes = trapSection.querySelectorAll('.trap-quote');
    trapQuotes.forEach(quote => {
        quote.addEventListener('mouseenter', () => {
            quote.style.transform = 'translateX(10px)';
        });
        
        quote.addEventListener('mouseleave', () => {
            quote.style.transform = 'translateX(0)';
        });
    });
}

// 初始化#story-return section效果
function initStoryReturnSectionEffects() {
    const storyReturnSection = document.getElementById('story-return');
    if (!storyReturnSection) return;
    
    // 为故事关键词添加交互
    const storyKeyword = storyReturnSection.querySelector('.story-keyword');
    if (storyKeyword) {
        storyKeyword.addEventListener('click', () => {
            // 创建点击脉冲效果
            storyKeyword.style.animation = 'none';
            setTimeout(() => {
                storyKeyword.style.animation = 'keyword-pulse 0.6s ease';
            }, 10);
        });
        
        // 设置可访问性属性
        storyKeyword.setAttribute('tabindex', '0');
        storyKeyword.setAttribute('role', 'button');
        storyKeyword.setAttribute('aria-label', '点击查看隐藏注释');
    }
    
    // 为对比卡片添加悬停效果
    const comparisonCards = storyReturnSection.querySelectorAll('.comparison-card');
    comparisonCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // 为卡片图片添加交互效果
    const cardImages = storyReturnSection.querySelectorAll('.card-image');
    cardImages.forEach(image => {
        image.addEventListener('click', () => {
            // 创建点击脉冲效果
            image.style.animation = 'none';
            setTimeout(() => {
                image.style.animation = 'keyword-pulse 0.6s ease';
            }, 10);
        });
        
        // 设置可访问性属性
        image.setAttribute('tabindex', '0');
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', '点击查看图片详情');
    });
    
    // 为横幅引用添加点击效果
    const bannerQuote = storyReturnSection.querySelector('.banner-quote');
    if (bannerQuote) {
        bannerQuote.addEventListener('click', () => {
            // 创建点击脉冲效果
            bannerQuote.style.animation = 'none';
            setTimeout(() => {
                bannerQuote.style.animation = 'keyword-pulse 0.6s ease';
            }, 10);
        });
        
        // 设置可访问性属性
        bannerQuote.setAttribute('tabindex', '0');
        bannerQuote.setAttribute('role', 'button');
        bannerQuote.setAttribute('aria-label', '点击查看引用');
    }
}

// 初始化#future section效果
function initFutureSectionEffects() {
    const futureSection = document.getElementById('future');
    if (!futureSection) return;
    
    // 为横幅引用添加点击交互
    const bannerQuote = futureSection.querySelector('.banner-quote');
    if (bannerQuote) {
        bannerQuote.addEventListener('click', () => {
            // 创建点击脉冲效果
            bannerQuote.style.animation = 'none';
            setTimeout(() => {
                bannerQuote.style.animation = 'keyword-pulse 0.6s ease';
            }, 10);
        });
        
        // 设置可访问性属性
        bannerQuote.setAttribute('tabindex', '0');
        bannerQuote.setAttribute('role', 'button');
        bannerQuote.setAttribute('aria-label', '点击查看引用');
    }
    
    // 为诗性分句添加悬停效果
    const poetryLines = futureSection.querySelectorAll('.poetry-line');
    poetryLines.forEach(line => {
        line.addEventListener('mouseenter', () => {
            line.style.transform = 'translateY(-2px)';
            line.style.textShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
        });
        
        line.addEventListener('mouseleave', () => {
            line.style.transform = 'translateY(0)';
            line.style.textShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        });
    });
    
    // 为感性收束点添加特殊效果
    const futureEnding = futureSection.querySelector('.future-ending');
    if (futureEnding) {
        futureEnding.addEventListener('click', () => {
            // 创建点击脉冲效果
            futureEnding.style.animation = 'none';
            setTimeout(() => {
                futureEnding.style.animation = 'glow-pulse 2s ease-in-out infinite';
            }, 10);
        });
        
        // 设置可访问性属性
        futureEnding.setAttribute('tabindex', '0');
        futureEnding.setAttribute('role', 'button');
        futureEnding.setAttribute('aria-label', '点击查看收束点');
    }
}

// 初始化#reality section效果
function initRealitySectionEffects() {
    const realitySection = document.getElementById('reality');
    if (!realitySection) return;
    
    // 为AI谬误添加交互
    const aiMyth = realitySection.querySelector('.ai-myth');
    if (aiMyth && !aiMyth.dataset.interactive) {
        aiMyth.dataset.interactive = 'true';
        
        aiMyth.addEventListener('click', () => {
            // 创建点击脉冲效果
            aiMyth.style.animation = 'none';
            setTimeout(() => {
                aiMyth.style.animation = 'keyword-pulse 0.6s ease';
            }, 10);
        });
        
        // 设置可访问性属性
        aiMyth.setAttribute('tabindex', '0');
        aiMyth.setAttribute('role', 'button');
        aiMyth.setAttribute('aria-label', '点击查看AI替代谬误的批判');
    }
    
    // 为横幅引用添加点击交互
    const realityBanners = realitySection.querySelectorAll('.reality-banner');
    realityBanners.forEach((banner, index) => {
        if (!banner.dataset.interactive) {
            banner.dataset.interactive = 'true';
            
            banner.addEventListener('click', () => {
                // 创建点击脉冲效果
                banner.style.animation = 'none';
                setTimeout(() => {
                    banner.style.animation = 'keyword-pulse 0.6s ease';
                }, 10);
            });
            
            // 设置可访问性属性
            banner.setAttribute('tabindex', '0');
            banner.setAttribute('role', 'button');
            banner.setAttribute('aria-label', `点击查看第${index + 1}个历史引用`);
        }
    });
    
    // 为最终觉醒句添加交互
    const realityAwakening = realitySection.querySelector('.reality-awakening');
    if (realityAwakening && !realityAwakening.dataset.interactive) {
        realityAwakening.dataset.interactive = 'true';
        
        realityAwakening.addEventListener('click', () => {
            // 创建点击脉冲效果
            realityAwakening.style.animation = 'none';
            setTimeout(() => {
                realityAwakening.style.animation = 'reality-glow 3s ease-in-out infinite';
            }, 10);
        });
        
        // 设置可访问性属性
        realityAwakening.setAttribute('tabindex', '0');
        realityAwakening.setAttribute('role', 'button');
        realityAwakening.setAttribute('aria-label', '点击查看最终觉醒句');
    }
}

// 初始化#humanity section效果
function initHumanitySectionEffects() {
    const humanitySection = document.getElementById('humanity');
    if (!humanitySection) return;
    
    // 为AI谬误添加交互
    const aiMyth = humanitySection.querySelector('.ai-myth');
    if (aiMyth && !aiMyth.dataset.interactive) {
        aiMyth.dataset.interactive = 'true';
        
        aiMyth.addEventListener('click', () => {
            // 创建点击脉冲效果
            aiMyth.style.animation = 'none';
            setTimeout(() => {
                aiMyth.style.animation = 'keyword-pulse 0.6s ease';
            }, 10);
        });
        
        // 设置可访问性属性
        aiMyth.setAttribute('tabindex', '0');
        aiMyth.setAttribute('role', 'button');
        aiMyth.setAttribute('aria-label', '点击查看AI替代谬误的批判');
    }
    
    // 为横幅引用添加点击交互
    const humanityBanner = humanitySection.querySelector('.humanity-banner');
    if (humanityBanner && !humanityBanner.dataset.interactive) {
        humanityBanner.dataset.interactive = 'true';
        
        humanityBanner.addEventListener('click', () => {
            // 创建点击脉冲效果
            humanityBanner.style.animation = 'none';
            setTimeout(() => {
                humanityBanner.style.animation = 'keyword-pulse 0.6s ease';
            }, 10);
        });
        
        // 设置可访问性属性
        humanityBanner.setAttribute('tabindex', '0');
        humanityBanner.setAttribute('role', 'button');
        humanityBanner.setAttribute('aria-label', '点击查看人文关怀引用');
    }
    
    // 为最终人文关怀句添加交互
    const humanityFinal = humanitySection.querySelector('.humanity-final');
    if (humanityFinal && !humanityFinal.dataset.interactive) {
        humanityFinal.dataset.interactive = 'true';
        
        humanityFinal.addEventListener('click', () => {
            // 创建点击脉冲效果
            humanityFinal.style.animation = 'none';
            setTimeout(() => {
                humanityFinal.style.animation = 'humanity-glow 3s ease-in-out infinite';
            }, 10);
        });
        
        // 设置可访问性属性
        humanityFinal.setAttribute('tabindex', '0');
        humanityFinal.setAttribute('role', 'button');
        humanityFinal.setAttribute('aria-label', '点击查看最终人文关怀句');
    }
    
    // 为对比插图添加交互效果
    const illustrations = humanitySection.querySelectorAll('.illustration-left, .illustration-right');
    illustrations.forEach((illustration, index) => {
        if (!illustration.dataset.interactive) {
            illustration.dataset.interactive = 'true';
            
            illustration.addEventListener('click', () => {
                // 创建点击脉冲效果
                illustration.style.animation = 'none';
                setTimeout(() => {
                    illustration.style.animation = 'keyword-pulse 0.6s ease';
                }, 10);
            });
            
            // 设置可访问性属性
            illustration.setAttribute('tabindex', '0');
            illustration.setAttribute('role', 'button');
            illustration.setAttribute('aria-label', `点击查看第${index + 1}个对比插图`);
        }
    });
}

// 额外的交互效果
function addExtraInteractions() {
    // 为文本添加选择效果
    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            // 可以在这里添加文本选择时的特殊效果
            // 比如显示分享按钮、高亮等
        }
    });

    // 添加鼠标悬停效果
    document.querySelectorAll('.story-text').forEach(text => {
        text.addEventListener('mouseenter', () => {
            text.style.transition = 'all 0.3s ease';
        });
    });

    // 关键词交互功能
    initKeywordInteractions();

    // 性能优化：使用 requestIdleCallback 延迟非关键操作
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // 预加载字体或其他资源
            console.log('页面初始化完成');
        });
    }
}

// 初始化关键词交互
function initKeywordInteractions() {
    const keywords = document.querySelectorAll('.keyword');
    
    keywords.forEach(keyword => {
        // 添加点击效果
        keyword.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 创建脉冲效果
            keyword.classList.add('pulse');
            setTimeout(() => {
                keyword.classList.remove('pulse');
            }, 600);
            
            // 可以在这里添加更多交互效果
            // 比如显示详细信息、播放音效等
        });
        
        // 添加键盘访问支持
        keyword.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                keyword.click();
            }
        });
        
        // 设置可访问性属性
        keyword.setAttribute('tabindex', '0');
        keyword.setAttribute('role', 'button');
        keyword.setAttribute('aria-label', '点击查看详细说明');
    });
}

// 导出类供外部使用（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImmersiveStory;
} 