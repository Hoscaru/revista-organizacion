// OrgDesign Magazine - SPA JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initProgressBar();
    initFloatingTOC();
    initMobileMenu();
    initQuiz();
    initSmoothScroll();
    initMascota();
});

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// Reading Progress Bar
// ============================================
function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const sections = document.querySelectorAll('section, article');
    
    if (!progressBar) return;

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

// ============================================
// Floating Table of Contents
// ============================================
function initFloatingTOC() {
    const floatingTOC = document.getElementById('floating-toc');
    const tocLinks = document.querySelectorAll('.toc-link');
    const articles = document.querySelectorAll('.article-section');

    if (!floatingTOC || !tocLinks.length) return;

    // Hide/show based on scroll
    function handleTOCVisibility() {
        const heroHeight = document.getElementById('hero')?.offsetHeight || 0;
        const scrollY = window.scrollY;

        if (scrollY > heroHeight - 200) {
            floatingTOC.classList.remove('hidden');
        } else {
            floatingTOC.classList.add('hidden');
        }
    }

    // Highlight active section
    function highlightActiveSection() {
        let current = '';

        articles.forEach(article => {
            const sectionTop = article.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = article.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        handleTOCVisibility();
        highlightActiveSection();
    }, { passive: true });

    handleTOCVisibility();

    // Toggle collapse/expand
    const tocToggle = document.getElementById('toc-toggle');
    const tocContainer = document.getElementById('toc-container');
    const tocToggleIcon = document.getElementById('toc-toggle-icon');
    const tocLinksForToggle = document.querySelectorAll('.toc-link');
    const tocHeaderText = document.querySelector('#toc-header p');

    if (tocToggle && tocContainer) {
        tocToggle.addEventListener('click', () => {
            const isCollapsed = tocContainer.classList.contains('collapsed');
            
            if (isCollapsed) {
                // Expandir
                tocContainer.classList.remove('collapsed');
                tocContainer.style.width = '';
                tocContainer.style.padding = '';
                tocToggleIcon.textContent = 'chevron_right';
                tocLinksForToggle.forEach(link => {
                    link.classList.remove('justify-center');
                    link.querySelectorAll('.toc-text').forEach(text => {
                        text.style.display = '';
                    });
                });
                if (tocHeaderText) {
                    tocHeaderText.style.display = '';
                }
            } else {
                // Colapsar
                tocContainer.classList.add('collapsed');
                tocContainer.style.width = '50px';
                tocContainer.style.padding = '4px';
                tocToggleIcon.textContent = 'chevron_left';
                tocLinksForToggle.forEach(link => {
                    link.classList.add('justify-center');
                    link.querySelectorAll('.toc-text').forEach(text => {
                        text.style.display = 'none';
                    });
                });
                if (tocHeaderText) {
                    tocHeaderText.style.display = 'none';
                }
            }
        });
    }
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// ============================================
// Smooth Scroll for Navigation
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Quiz System
// ============================================
function initQuiz() {
    const form = document.getElementById('quiz-form');
    const modal = document.getElementById('result-modal');
    const overlay = document.getElementById('modal-overlay');
    const resultContent = document.getElementById('result-content');

    if (!form || !modal) return;

    const correctAnswers = {
        q1: 'b',
        q2: 'b',
        q3: 'b'
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        let score = 0;
        const totalQuestions = 3;

        for (let i = 1; i <= totalQuestions; i++) {
            const answer = formData.get(`q${i}`);
            if (answer === correctAnswers[`q${i}`]) {
                score++;
            }
        }

        showResult(score, totalQuestions);
    });

    function showResult(score, total) {
        const percentage = (score / total) * 100;
        let title, message, icon, bgColor, btnText;

        if (percentage >= 66) {
            title = '¡Felicidades!';
            message = `Obtuviste ${score} de ${total} respuestas correctas. ¡Excelente conocimiento sobre diseño organizacional!`;
            icon = 'emoji_events';
            bgColor = 'from-green-500 to-emerald-600';
            btnText = 'Seguir Leyendo';
        } else {
            title = 'Sigue Repasando';
            message = `Obtuviste ${score} de ${total} respuestas correctas. Te recomendamos revisar los artículos para mejorar tu conocimiento.`;
            icon = 'school';
            bgColor = 'from-orange-500 to-amber-600';
            btnText = 'Volver a Intentar';
        }

        resultContent.innerHTML = `
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${bgColor} flex items-center justify-center">
                <span class="material-symbols-outlined text-5xl text-white">${icon}</span>
            </div>
            <h2 class="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-3">${title}</h2>
            <p class="text-slate-600 dark:text-slate-400 mb-6">${message}</p>
            <div class="flex gap-3 justify-center flex-col sm:flex-row">
                <button id="retry-quiz" class="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    ${percentage >= 66 ? 'Seguir Leyendo' : 'Intentar de nuevo'}
                </button>
                <button id="close-modal" class="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                    ${percentage >= 66 ? 'Ver Artículos' : 'Revisar Contenido'}
                </button>
            </div>
        `;

        modal.classList.remove('hidden');

        document.getElementById('retry-quiz').addEventListener('click', () => {
            closeModal();
            if (percentage < 66) {
                form.reset();
            } else {
                // Scroll to articles
                document.querySelector('#indice')?.scrollIntoView({ behavior: 'smooth' });
            }
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            closeModal();
            if (percentage >= 66) {
                document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                document.querySelector('#article-1')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// ============================================
// Mascota System
// ============================================
function initMascota() {
    const svgContainer = document.getElementById('mascota-svg');
    const bubble = document.getElementById('mascota-bubble');
    const text = document.getElementById('mascota-text');
    
    svgContainer.innerHTML = `<img src="perro chiba inu.svg" alt="Mascota" class="w-full h-full object-contain rounded-full" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">`;

    const comments = {
        'hero': '¡Bienvenido a este viaje por el diseño organizacional!',
        'indice': 'Hay tanto que explorar... ¿por dónde empiezas?',
        'article-1': 'De pirámides a redes... ¡qué evolución!',
        'article-2': 'Las estructuras son como esqueletos, ¡dan forma!',
        'article-3': '¡Las organizaciones también necesitan código! Una buena arquitectura hace la diferencia entre el éxito y el caos.',
        'article-3-scrum': '¡Scrum es un marco de trabajo ágil! Equipos autodirigidos que iteran rápidamente para entregar valor en cada sprint.',
        'article-4': 'El proceso de diseño paso a paso...',
        'article-5': 'Diseño = proceso, Estructura = resultado',
        'article-6': 'Tres pilares: Estrategia, Tamaño, Tecnología',
        'quiz': '¡A ver si dominas el tema!'
    };

    let currentSection = 'hero';
    let hideTimeout;

    function showComment(section) {
        if (hideTimeout) clearTimeout(hideTimeout);
        
        const svgEl = document.getElementById('mascota-svg');
        svgEl.classList.add('bouncing');
        setTimeout(() => svgEl.classList.remove('bouncing'), 500);

        text.textContent = comments[section] || '';
        bubble.classList.add('visible');

        hideTimeout = setTimeout(() => {
            bubble.classList.remove('visible');
        }, 4000);
    }

    function getCurrentSection() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Check for sub-section "vision-y-metas" inside article-3
        const visionYMetas = document.getElementById('vision-y-metas');
        if (visionYMetas) {
            const rect = visionYMetas.getBoundingClientRect();
            if (rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.2) {
                return 'article-3-scrum';
            }
        }
        
        if (scrollY < windowHeight * 0.5) return 'hero';
        
        const sections = ['article-1', 'article-2', 'article-3', 'article-4', 'article-5', 'article-6', 'quiz'];
        
        for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.2) {
                    return id;
                }
            }
        }

        const indice = document.getElementById('indice');
        if (indice) {
            const rect = indice.getBoundingClientRect();
            if (rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.2) {
                return 'indice';
            }
        }

        return currentSection;
    }

    function handleScroll() {
        const newSection = getCurrentSection();
        if (newSection !== currentSection) {
            currentSection = newSection;
            showComment(currentSection);
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    setTimeout(() => {
        showComment('hero');
    }, 1500);
}
