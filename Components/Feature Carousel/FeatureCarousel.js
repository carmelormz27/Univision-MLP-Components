//<script src="https://unpkg.com/swiper@8/swiper-bundle.min.js"></script>

function FeatureCarousel(el) {
  const swiperContainer = el.querySelector('.swiper');
  const ctaButton = el.querySelector('.large-button.feature-carousel');
  const originalesQuickLink = el.querySelector('#originales');
  const peliculasQuickLink = el.querySelector('#peliculas');
  const deportesQuickLink = el.querySelector('#deportes');

  let currentWindowSize = window.innerWidth;

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  const getDiameter = () => {
    const currentWidth = window.innerWidth;
    if (currentWidth >= 768) {
      return (
        Math.round(currentWidth) * 1.1458 +
        Math.round(currentWidth * 0.174) * 1.5
      );
    }

    return (
      clamp(800, currentWidth * 3.2401, 1215) +
      Math.round(currentWidth * 0.5) * 1.5
    );
  };

  const updateSlider = (swiper) => {
    const currentIndex = swiper.realIndex;
    const slides = el.querySelectorAll(
      '.swiper-slide:not(.swiper-slide-duplicate)'
    );
    const progressBarEl = el.querySelector('.feature-carousel-scrollbar');
    const scrollbarDragEl = el.querySelector('.feature-carousel-draggable');
    const dragWidth = progressBarEl.offsetWidth / slides.length;
    const titleEl = el.querySelector('.feature-carousel-action-container h1');
    const subtitleEl = el.querySelector(
      '.feature-carousel-action-container h3'
    );
    const activeCategory =
      swiper.slides[swiper.activeIndex].querySelector('img').dataset.category;

    //update active slide text
    titleEl.innerHTML =
      swiper.slides[swiper.activeIndex].querySelector('img').dataset.title;
    subtitleEl.innerHTML =
      swiper.slides[swiper.activeIndex].querySelector('img').dataset.subtitle;

    //Update scrollbar slider position
    scrollbarDragEl.style.width = `${dragWidth}px`;
    scrollbarDragEl.style.marginLeft = `${currentIndex * dragWidth}px`;

    updateQuickLinkActiveState(activeCategory);
  };

  const quickLinkClickHandler = (category, swiper) => {
    const filteredSlides = [...swiper.slides].filter((slide) => {
      const imgEl = slide.querySelector('img');
      return imgEl.dataset.category === category;
    });
    const indexToSlide = filteredSlides[0].dataset.swiperSlideIndex;
    swiper.slideToLoop(+indexToSlide + 2);

    updateQuickLinkActiveState(category);
  };

  const updateQuickLinkActiveState = (category) => {
    const quickLinks = el.querySelectorAll('.feature-carousel-quick-links');

    [...quickLinks].forEach((el) => el.classList.remove('active'));
    el.querySelector(`#${category}`).classList.add('active');
  };

  const initFeatureCarousel = () => {
    return new Swiper(swiperContainer, {
      speed: 200,
      centeredSlides: true,
      loop: true,
      slidesPerView: 'auto',
      grabCursor: true,
      effect: 'creative',
      observer: true,
      creativeEffect: {
        prev: {
          shadow: true,
          translate: [0, 0, '0px'],
          rotate: [0, 0, -10],
          origin: `50% ${getDiameter()}px`,
        },
        next: {
          shadow: true,
          translate: [0, 0, '0px'],
          rotate: [0, 0, 10],
          origin: `50% ${getDiameter()}px`,
        },
        progressMultiplier: 1,
        limitProgress: 3,
      },
      breakpoints: {
        768: {
          creativeEffect: {
            prev: {
              shadow: true,
              translate: [0, 0, '0px'],
              rotate: [0, 0, -10],
              origin: `50% ${getDiameter()}px`,
            },
            next: {
              shadow: true,
              translate: [0, 0, '0px'],
              rotate: [0, 0, 10],
              origin: `50% ${getDiameter()}px`,
            },
            progressMultiplier: 1,
            limitProgress: 3,
          },
        },
      },
      on: {
        init: (swiper) => updateSlider(swiper),
        slideChange: (swiper) => updateSlider(swiper),
      },
    });
  };

  let swiper = initFeatureCarousel();

  window.addEventListener('resize', () => {
    if (window.innerWidth != currentWindowSize) {
      swiper.destroy();
      swiper = initFeatureCarousel();
      swiper.init();

      currentWindowSize = window.innerWidth;
    }
  });

  ctaButton.addEventListener('click', (e) => {
    e.preventDefault();
    const activeSlide = swiper.slides[swiper.activeIndex].querySelector('img');
    window.open(activeSlide.dataset.url, '_blank');
  });

  const quickLinks = el.querySelectorAll('.feature-carousel-quick-links');
  [...quickLinks].forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      quickLinkClickHandler(link.id, swiper);
    });
  });
}

$('.feature-carousel-component').each((i, el) => {
  new FeatureCarousel(el);
});
