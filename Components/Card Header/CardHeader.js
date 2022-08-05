/**
 * Uses SwiperJS
 * JS: https://unpkg.com/swiper@8/swiper-bundle.min.js
 * CSS: https://unpkg.com/swiper/swiper-bundle.min.css
 */
function CardHeader(el) {
  const swiperContainer = el.querySelector('.swiper');
  const leftArrowEl = el.querySelector('.card-header-arrow.left');
  const rightArrowEl = el.querySelector('.card-header-arrow.right');
  const paginationEl = el.querySelector('.card-header-carousel-pagination');

  const setActiveSlideState = (slides, activeIndex, cardHeaderContainer) => {
    const activeSlide = slides[activeIndex];
    const activeImg = activeSlide.querySelector('img');
    //const backgroundTextEl = cardHeaderContainer.querySelector('.card-header-background-text');

    cardHeaderContainer.style.backgroundImage = `url('${activeImg.src}')`;
    //backgroundTextEl.innerHTML = activeSlide.dataset.title;
  };

  const swiper = new Swiper(swiperContainer, {
    speed: 200,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    grabCursor: true,
    effect: 'creative',
    creativeEffect: {
      prev: {
        shadow: true,
        scale: 0.77,
        translate: ['-30%', 0, 0],
        rotate: [0, 0, -2],
      },
      next: {
        shadow: true,
        scale: 0.77,
        translate: ['30%', 0, 0],
        rotate: [0, 0, 2],
      },
    },
    breakpoints: {
      768: {
        allowTouchMove: false,
        grabCursor: false,
        creativeEffect: {
          prev: {
            shadow: true,
            scale: 0.77,
            translate: ['-55%', 0, 0],
            rotate: [0, 0, -9],
          },
          next: {
            shadow: true,
            scale: 0.77,
            translate: ['55%', 0, 0],
            rotate: [0, 0, 9],
          },
        },
      },
    },
    navigation: {
      nextEl: rightArrowEl,
      prevEl: leftArrowEl,
    },
    pagination: {
      el: paginationEl,
    },
    on: {
      afterInit: (swiper) =>
        setActiveSlideState(swiper.slides, swiper.activeIndex, el),
      slideChange: (swiper) =>
        setActiveSlideState(swiper.slides, swiper.activeIndex, el),
    },
  });

  return swiper;
}

$('.card-header-container').each((index, el) => {
  new CardHeader(el);
});
