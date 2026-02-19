// ========================================
// APereira Studio — JavaScript
// ========================================

// Service Modals
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
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

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
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
