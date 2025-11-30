/* 
   RAKLIFY - Main JavaScript
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Header Scroll Effect ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(15, 23, 42, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(15, 23, 42, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // --- Scroll Animations (Fade In) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .feature-card, .section-header, .testimonial-card, .blog-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add class for animation
    const style = document.createElement('style');
    style.innerHTML = `.fade-in-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }`;
    document.head.appendChild(style);

    // WordPress API configuration
    const WORDPRESS_SITE_ID = 'raklifyblogs.wordpress.com';
    const BLOG_API_URL = `https://public-api.wordpress.com/wp/v2/sites/raklifyblogs.wordpress.com/posts`;
    const blogGrid = document.getElementById("home-blog-grid");
    const blogPageGrid = document.getElementById("blog-page-grid");


    // Fetch blogs with embedded media
    async function fetchBlogs() {
        try {
            const response = await fetch(`${BLOG_API_URL}?_embed`);
            if (!response.ok) throw new Error('Network response was not ok');
            const posts = await response.json();

            if (Array.isArray(posts) && posts.length > 0) {
                renderBlogs(posts);
            } else {
                throw new Error('No posts found');
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            const fallbackContent = `
                <div class="glass-card blog-card">
                    <div class="blog-content">
                        <h3>Unable to load blogs</h3>
                        <p>Please check the WordPress Site ID in script.js or your internet connection.</p>
                    </div>
                </div>
            `;
            if (blogGrid) blogGrid.innerHTML = fallbackContent;
            if (blogPageGrid) blogPageGrid.innerHTML = fallbackContent;
        }
    }

    function createBlogCard(post) {
        const title = post.title.rendered;
        const excerpt = post.excerpt.rendered.replace(/<[^>]*>/gm, '').substring(0, 100) + '...';
        const date = new Date(post.date).toLocaleDateString();

        let image = 'https://via.placeholder.com/400x200/2563EB/FFFFFF?text=RAKLIFY+Blog';
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url) {
            image = post._embedded['wp:featuredmedia'][0].source_url;
        } else if (post.jetpack_featured_media_url) {
            image = post.jetpack_featured_media_url;
        }

        let prefix = './';
        if (document.querySelector('link[href="../../style.css"]')) {
            prefix = '../../';
        } else if (document.querySelector('link[href="../style.css"]')) {
            prefix = '../';
        }

        let linkBase = `${prefix}blog/blog-reading/index.html`;
        const link = `${linkBase}?id=${post.id}`;

        return `
            <div class="glass-card blog-card">
                <img src="${image}" alt="${title}" class="blog-thumb">
                <div class="blog-content">
                    <span class="blog-date">${date}</span>
                    <h3>${title}</h3>
                    <p>${excerpt}</p>
                    <a href="${link}" class="service-link" target=_blank>Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `;
    }

    function renderBlogs(posts) {
        // Render for Home Page (Limit 3)
        if (blogGrid) {
            blogGrid.innerHTML = posts.slice(0, 3).map(post => createBlogCard(post)).join('');
            document.querySelectorAll('#home-blog-grid .blog-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.observe(el);
            });
        }

        // Render for Blog Page (All fetched)
        if (blogPageGrid) {
            blogPageGrid.innerHTML = posts.map(post => createBlogCard(post)).join('');
            document.querySelectorAll('#blog-page-grid .blog-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.observe(el);
            });
        }
    }

    if (blogGrid || blogPageGrid) {
        fetchBlogs();
    }


    //--- Simple Particle Animation for Hero ---
    const canvas = document.createElement('canvas');
    const heroBg = document.getElementById('particles-js');

    if (heroBg) {
        heroBg.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = heroBg.offsetWidth;
            height = canvas.height = heroBg.offsetHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = (Math.random() - 0.5) * 1;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(37, 99, 235, ${0.2 - dist / 150 * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        resize();
        initParticles();
        animateParticles();
    }
});
document.getElementById("year").textContent = new Date().getFullYear();