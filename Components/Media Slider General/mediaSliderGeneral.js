const setArrowEventSegment = (eventName, direction) => {
  const event = 'User Interacted';

  const properties = {
    ui_event_version: '1.0',
    ui_event_name: eventName,
    screen_id: window.location.pathname, // Send the URL Path
    screen_title: document.title, //Send the page title
    screen_type: 'mlp_page', //Always stays as "mlp_page"

    ui_carousel_id: 'w-node-_7138d749-4c5a-f753-4dab-4ad95e33322a-c28808f5', //Pass always this id
    ui_carousel_title: 'Streaming en español y sin límites',

    ui_content_type: 'Promo',
  };

  analytics.track(event, properties, SEGMENT_OPTIONS);
};

const setVisibleMobileEventSegment = (title, index, slideId) => {
  const eventName = 'User Interacted';
  const properties = {
    ui_event_version: '1.0', //Always pass this value
    ui_event_name: 'Slide Swaped',
    screen_id: window.location.pathname, // Send the URL Path
    screen_title: document.title, //Send the page title
    screen_type: 'mlp_page', //Always stays as "mlp_page"

    ui_carousel_id: 'w-node-_7138d749-4c5a-f753-4dab-4ad95e33322a-c28808f5', //Pass always this id
    ui_carousel_title: 'Streaming en español y sin límites', //Always pass this value

    ui_content_type: 'Promo', //Always statys as "Promo"
    ui_content_id: slideId, //Pass the id of active slide
    ui_content_index: `${index + 1}`, //Pass element position, always starts in 1
    ui_content_title: title, //Pass the card title
  };

  analytics.track(eventName, properties, SEGMENT_OPTIONS);
};

function Carousel(elm) {
  const options = {
    arrows: false,
    perPage: 2,
    perMove: 1,
    waitForTransition: false,
    trimSpace: true,
    slideFocus: false,
    pagination: false,
    speed: 600,
    keyboard: false,
    type: 'loop',
    breakpoints: {
      9999: {
        gap: 40,
      },
      1279: {
        perPage: 2,
        gap: 20,
      },
      991: {
        perPage: 3,
        gap: 20,
      },
      767: {
        perPage: 2,
        gap: 20,
      },
      479: {
        perPage: 1,
        gap: 16,
      },
    },
  };

  const [slideContainer] = $(elm).find('.splide');

  const slider = new Splide(slideContainer, options);
  const pagination = $(elm).find('.slider-pagination');
  const progressBar = $(elm).find('.slider-progress');
  const rightArrow = $(elm).find('.right-arrow');
  const leftArrow = $(elm).find('.left-arrow');
  let hasFadeAnimation = false;
  let initPos = null;
  let initialWidth = null;
  let initProgressWidth = null;
  let maxWidth = null;
  const mobileMaxSize = 767;

  pagination.css('transition', 'width 200ms ease');

  const previousElementAnimation = (item) => {
    $(item)
      .children()
      .removeClass('fadeIn fadeOut')
      .addClass('fadeOutNoAnimation');

    setTimeout(() => {
      $(item).children().removeClass('fadeOutNoAnimation').addClass('fadeIn');
    }, 15);
  };

  rightArrow.click(() => {
    const maxWidth = slider.Components.Move.getLimit(true);
    const limit = slider.Components.Move.toPosition(slider.index);
    hasFadeAnimation = true;

    if (limit > maxWidth) {
      const pastElement = $(
        slider.Components.Elements.slides[slider.index]
      ).children();
      $(pastElement).removeClass('fadeIn').addClass('fadeOut');
      slider.go('>');
    } else {
      resetSlides(true);
      slider.go('>');
    }

    setArrowEventSegment('Slide Arrow Clicked Right', 'Right');
  });

  leftArrow.click(() => {
    const counter = slider.index - 1;
    const pastElement = $(slider.Components.Elements.slides[counter]);
    hasFadeAnimation = true;

    if (counter >= 0) {
      previousElementAnimation(pastElement);
      slider.go('<');
    } else {
      const numberOfSlides = slider.Components.Slides.get(true)?.length - 1;
      const previousClone =
        slider.Components.Slides.getAt(numberOfSlides)?.slide;

      if (previousClone) {
        previousElementAnimation(previousClone);
      }

      slider.go('<');
    }
    setArrowEventSegment('Slide Arrow Clicked Left', 'Left');
  });

  const dragPosition = () => {
    const currentPosition =
      (slider.Components.Move.getPosition() - initPos) / (maxWidth - initPos);
    const x = currentPosition * (initProgressWidth - getXPosition());

    pagination.css(
      'width',
      `${Math.min(x + getXPosition(), initProgressWidth)}px`
    );
  };

  const getEnd = () => {
    return slider.Components.Controller.getEnd() + 1;
  };

  const getXPosition = () => {
    if (!initialWidth) {
      initialWidth = progressBar.width() / getEnd();
    }
    return initialWidth || 0;
  };

  const resetSlides = (withoutAnimation) => {
    if (withoutAnimation) {
      let lastElementClone;
      slider.Components.Slides.forEach(({ slide, index }) => {
        if (index === -1) {
          lastElementClone = slide;
        }

        $(slide).children().removeClass('fadeOut fadeIn');
      });

      $(lastElementClone).children().addClass('fadeOut');
      setTimeout(() => {
        $(lastElementClone).children().removeClass('fadeOut');
      }, 300);
    }

    if (hasFadeAnimation && !withoutAnimation) {
      hasFadeAnimation = false;
      slider.Components.Slides.forEach(({ slide }) => {
        $(slide).children().removeClass('fadeOut').addClass('fadeIn');
      });
    }
  };

  slider.on('mounted resize', () => {
    resetSlides();
    pagination.css('width', `${getXPosition()}px`);
    initPos = initPos || slider.Components.Move.getPosition(0);
    initProgressWidth = progressBar.width() || 0;
    maxWidth = slider.Components.Move.getLimit(true) || 0;
  });

  slider.on('move', (e) => {
    pagination.css('transition', 'width 200ms ease');
    pagination.css('width', `${(100 * (slider.index + 1)) / getEnd()}%`);
  });

  slider.on('moved', () => {
    dragPosition();
  });

  slider.on('drag', () => {
    resetSlides();
  });

  slider.on('dragging', () => {
    pagination.css('transition', 'none');
    dragPosition();
  });

  slider.on('visible', (slide) => {
    if (window.innerWidth <= mobileMaxSize) {
      const $slide = $(slide.slide);
      const $cardTitle = $('.card-title', $slide);
      setVisibleMobileEventSegment($cardTitle.text(), slide.index, $slide.id);
    }
  });

  return slider;
}

$('.media-slider').each((_idx, mediaSlide) => {
  new Carousel(mediaSlide).mount();
});
