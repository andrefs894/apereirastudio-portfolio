// ========================================
// APereira Studio — JavaScript
// ========================================

// Service Accordion
function toggleService(header) {
    const item = header.parentElement;
    const isActive = item.classList.contains('active');
    const icon = header.querySelector('.service-toggle-icon');

    // Remember where the clicked header sits in the viewport
    const prevTop = header.getBoundingClientRect().top;

    // Collapse every OTHER open panel instantly (no transition) so the layout
    // shift is applied at once and we can compensate the scroll for it
    document.querySelectorAll('.service-item').forEach(el => {
        if (el === item) return;
        el.classList.remove('active');
        el.querySelector('.service-toggle-icon').textContent = '+';
        const details = el.querySelector('.service-details');
        if (details) {
            details.style.transition = 'none';
            details.style.maxHeight = null;
        }
    });

    // Toggle the clicked item (this keeps its normal open/close animation)
    const details = item.querySelector('.service-details');
    if (isActive) {
        item.classList.remove('active');
        icon.textContent = '+';
        if (details) details.style.maxHeight = null;
    } else {
        item.classList.add('active');
        icon.textContent = '−';
        if (details) details.style.maxHeight = details.scrollHeight + 'px';
    }

    // Keep the clicked header anchored: undo any shift caused by the instant
    // collapse of the other panel(s) above it
    const newTop = header.getBoundingClientRect().top;
    if (newTop !== prevTop) {
        window.scrollBy({ top: newTop - prevTop, behavior: 'instant' });
    }

    // Restore transitions so future toggles animate normally
    requestAnimationFrame(() => {
        document.querySelectorAll('.service-details').forEach(d => {
            if (d !== details) d.style.transition = '';
        });
    });
}

// Keep an open service panel sized to its content when the viewport changes
window.addEventListener('resize', () => {
    const openItem = document.querySelector('.service-item.active .service-details');
    if (openItem) openItem.style.maxHeight = openItem.scrollHeight + 'px';
});

document.addEventListener('DOMContentLoaded', () => {
    // Navigation scroll effect
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    let lockedScrollY = 0;

    // overflow:hidden alone doesn't stop background scroll on touch devices,
    // which drags the page underneath and makes the fixed overlay look like
    // it's being clipped/hidden as you scroll — pin body scroll position instead
    const lockScroll = () => {
        lockedScrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${lockedScrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
    };

    const unlockScroll = () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        window.scrollTo(0, lockedScrollY);
    };

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            if (mobileMenu.classList.contains('active')) {
                lockScroll();
            } else {
                unlockScroll();
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                unlockScroll();
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.work-item, .service-card, .about-content, .about-image').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    // Add visible class styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Stagger animation for grid items
    document.querySelectorAll('.work-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.service-card').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // Image lazy loading with fade-in effect
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
        }
    });

    // Parallax effect for hero (subtle)
    const hero = document.querySelector('.hero-content');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.1}px)`;
                hero.style.opacity = 1 - (scrolled * 0.001);
            }
        });
    }

    // Testimonials carousel
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (testimonialsGrid) {
        const prevBtn = document.querySelector('.testimonial-nav-prev');
        const nextBtn = document.querySelector('.testimonial-nav-next');

        const scrollByCard = (direction) => {
            const card = testimonialsGrid.querySelector('.testimonial-card');
            const gap = parseFloat(getComputedStyle(testimonialsGrid).columnGap) || 24;
            const amount = (card ? card.getBoundingClientRect().width : 340) + gap;
            testimonialsGrid.scrollBy({ left: amount * direction, behavior: 'smooth' });
        };

        const updateNavState = () => {
            const maxScroll = testimonialsGrid.scrollWidth - testimonialsGrid.clientWidth;
            prevBtn.classList.toggle('is-hidden', testimonialsGrid.scrollLeft <= 4);
            nextBtn.classList.toggle('is-hidden', testimonialsGrid.scrollLeft >= maxScroll - 4);
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => scrollByCard(-1));
            nextBtn.addEventListener('click', () => scrollByCard(1));
            testimonialsGrid.addEventListener('scroll', updateNavState);
            window.addEventListener('resize', updateNavState);
            updateNavState();
        }
    }

    // Language switcher dropdown
    const langSwitcher = document.querySelector('.lang-switcher');
    if (langSwitcher) {
        const langBtn = langSwitcher.querySelector('.lang-current');
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langSwitcher.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            langSwitcher.classList.remove('active');
        });
    }

    // Cursor effect for work items (desktop only)
    if (window.innerWidth > 768) {
        const workItems = document.querySelectorAll('.work-item');
        
        workItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;
                
                item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }
});
