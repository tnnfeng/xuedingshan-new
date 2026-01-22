// 雪顶山矿泉网站交互功能

// 错误处理函数
function handleError(error, context) {
    console.error('Error in ' + context + ':', error);
}

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 确保内容立即显示
function ensureImmediateDisplay() {
    // 移除所有图片的懒加载属性
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.removeAttribute('loading');
        img.classList.add('image-loaded');
    });
    
    // 确保页面内容立即可见
    const contentElements = document.querySelectorAll('.handbook-section, .contact-content');
    contentElements.forEach(element => {
        element.style.opacity = '1';
        element.style.visibility = 'visible';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        // 立即显示所有内容
        ensureImmediateDisplay();
        
        // 导航菜单切换
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                
                // 汉堡菜单动画
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => span.classList.toggle('active'));
            });
        }
        
        // 平滑滚动 - 只处理页面内锚点链接
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // 如果是页面内锚点链接（以#开头），则进行平滑滚动处理
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        // 关闭移动端菜单
                        if (navMenu.classList.contains('active')) {
                            navMenu.classList.remove('active');
                        }
                        
                        // 计算偏移量（考虑固定导航栏）
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetSection.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                // 如果是外部页面链接（如about.html），则允许正常跳转
                // 为了确保谷歌浏览器兼容性，明确不阻止默认行为
                else if (targetId.includes('.html') || targetId.includes('http')) {
                    // 允许正常跳转，不阻止默认行为
                    // 可以添加一些额外的处理，比如关闭移动端菜单
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                    }
                    
                    // 为了确保兼容性，明确允许默认行为
                    // 不调用e.preventDefault()
                }
            });
        });
        
        // 额外的安全措施：确保所有外部链接都能正常工作
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a');
            if (target && (target.href.includes('.html') || target.href.includes('http'))) {
                // 确保外部链接能正常跳转
                // 不阻止默认行为
            }
        });

        // 厂区图片切换功能
        const factoryThumbs = document.querySelectorAll('.factory-thumb');
        const mainImg = document.querySelector('.main-img');
        
        if (factoryThumbs.length > 0 && mainImg) {
            factoryThumbs.forEach((thumb, index) => {
                thumb.addEventListener('click', function() {
                    // 切换主图
                    const newSrc = this.src;
                    const newAlt = this.alt;
                    
                    mainImg.src = newSrc;
                    mainImg.alt = newAlt;
                    
                    // 更新缩略图状态
                    factoryThumbs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
                
                // 默认激活第一张缩略图
                if (index === 0) {
                    thumb.classList.add('active');
                }
            });
        }
        
        // CTA按钮点击事件
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', function() {
                const productsSection = document.querySelector('#products');
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = productsSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        }
        
        // 页面加载完成后的额外处理
        window.addEventListener('load', function() {
            // 确保所有内容都已加载
            console.log('页面加载完成，所有交互功能已初始化');
        });
        
    } catch (error) {
        handleError(error, 'DOMContentLoaded');
    }
});

// 窗口大小改变时的响应式处理
window.addEventListener('resize', debounce(function() {
    // 在窗口大小改变时，重新计算导航栏高度等
    if (window.innerWidth > 768) {
        // 在大屏幕上确保导航菜单是展开状态
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
}, 250));