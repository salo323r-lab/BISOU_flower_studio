import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Smooth Scrolling (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Get scroll value for GSAP
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// 2. Custom Cursor Logic
const cursor = document.getElementById('custom-cursor');
const hoverElements = document.querySelectorAll('.cursor-hover, a, button');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// 3. Preloader & Initial Animations
window.addEventListener('load', () => {
  const tl = gsap.timeline();

  // Animate loader text
  tl.to('.loader-text span', {
    y: 0,
    duration: 1,
    stagger: 0.05,
    ease: "power4.out"
  })
    .to('#loader', {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        document.getElementById('loader').style.display = 'none';
      }
    })
    // Hero reveals
    .to('#hero-bg', {
      scale: 1,
      duration: 2,
      ease: "power3.out"
    }, "-=0.5")
    .to(['#hero-subtitle', '#hero-title', '#scroll-indicator'], {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power3.out",
      onStart: function () {
        gsap.set(['#hero-subtitle', '#hero-title', '#scroll-indicator'], { y: 30 });
      }
    }, "-=1.5");
});

// 4. GSAP Scroll Animations

// Parallax for Intro text
gsap.to('.text-parallax', {
  y: -50,
  ease: "none",
  scrollTrigger: {
    trigger: '.text-parallax',
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

// 5. Horizontal Scroll Storytelling Section
const horizontalSection = document.querySelector('.horizontal-section');
const horizontalContainer = document.querySelector('.horizontal-container');
const panels = gsap.utils.toArray('.panel');

if (horizontalSection && horizontalContainer) {
  let mm = gsap.matchMedia();

  // Desktop (>= 768px): Horizontal Scroll Animation
  mm.add("(min-width: 768px)", () => {
    const tween = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: horizontalSection,
        pin: true,
        scrub: 1,
        end: () => `+=${horizontalContainer.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true
      }
    });

    const revealImages = document.querySelectorAll('.img-reveal');
    revealImages.forEach((container) => {
      if (container.closest('.panel')) {
        gsap.to(container, {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ease: "power3.inOut",
          duration: 1.5,
          scrollTrigger: {
            trigger: container.closest('.panel'),
            containerAnimation: tween,
            start: "left center",
            toggleActions: "play none none reverse"
          }
        });
      }
    });
  });

  // Mobile (< 768px): Standard vertical reveal for panels instead of horizontal scroll
  mm.add("(max-width: 767px)", () => {
    const revealImages = document.querySelectorAll('.panel .img-reveal');
    revealImages.forEach((container) => {
      gsap.to(container, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        ease: "power3.inOut",
        duration: 1.5,
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    });
  });

  // Elements outside of the horizontal scroll section always use standard vertical scrolltrigger
  const outsideRevealImages = document.querySelectorAll('section:not(.horizontal-section) .img-reveal');
  outsideRevealImages.forEach((container) => {
    gsap.to(container, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      ease: "power3.inOut",
      duration: 1.5,
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  });
}

// 7. Scroll to Top Button Logic
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

if (scrollToTopBtn) {
  // Show/Hide button based on scroll position
  lenis.on('scroll', (e) => {
    // Show after scrolling past 1 window height (the Hero section)
    if (e.scroll > window.innerHeight) {
      scrollToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
      scrollToTopBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    } else {
      scrollToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
      scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }
  });

  // Scroll to top on click
  scrollToTopBtn.addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  });
}
