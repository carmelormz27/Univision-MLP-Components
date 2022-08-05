function HeroSliderCarousel(el) {
  const swiperContainer = el.querySelector('.swiper');
  const rightArrowEl = el.querySelector(
    '.hero-slider-arrows-container .arrow-right'
  );
  const leftArrowEl = el.querySelector(
    '.hero-slider-arrows-container .arrow-left'
  );

  const updateActiveState = (heroContainer, swiper) => {
    const currentIndex = swiper.realIndex;

    const activeSlide = swiper.slides[swiper.activeIndex];
    const activeTitle = activeSlide.dataset.title;
    const titleEl = heroContainer.querySelector('.hero-slider-active-title');

    const paginationEl = heroContainer.querySelector('.hero-slider-pagination');
    const scrollbarEl = heroContainer.querySelector('.hero-slider-scroll');
    const slides = heroContainer.querySelectorAll(
      '.swiper-slide:not(.swiper-slide-duplicate)'
    );
    const dragWidth = paginationEl.offsetWidth / slides.length;

    //Update active title
    titleEl.innerHTML = activeTitle;

    //Update scrollbar slider position
    scrollbarEl.style.width = `${dragWidth}px`;
    scrollbarEl.style.left = `${currentIndex * dragWidth}px`;
  };

  const swiper = new Swiper(swiperContainer, {
    speed: 300,
    loop: true,
    slidesPerView: 'auto',
    effect: 'slide',
    autoplay: {
      delay: 2000,
      //pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
    on: {
      afterInit: (swiper) => updateActiveState(el, swiper),
      slideChange: (swiper) => updateActiveState(el, swiper),
    },
    navigation: {
      nextEl: rightArrowEl,
      prevEl: leftArrowEl,
    },
    breakpoints: {
      1024: {
        allowTouchMove: false,
      },
    },
  });

  el.addEventListener('mouseover', () => {
    swiper.autoplay.stop();
  });

  el.addEventListener('mouseout', () => {
    swiper.autoplay.start();
  });
}

$('.hero-slider-component').each((index, el) => {
  new HeroSliderCarousel(el);
});
