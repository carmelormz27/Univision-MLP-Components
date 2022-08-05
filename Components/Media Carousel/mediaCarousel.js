function MediaCarousel(el) {
  const options = {
    arrows: false,
    perPage: 3,
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
        gap: 40,
      },
      767: {
        perPage: 1,
        gap: 20,
      },
    },
  };

  const [slideContainer] = $(el).find('.splide');
  const slider = new Splide(slideContainer, options);
  const rightArrow = $(el).find('.media-carousel-arrow-control.right');
  const leftArrow = $(el).find('.media-carousel-arrow-control.left');
  const progressBar = $(el).find('.media-carousel-progress');
  const pagination = $(el).find('.media-carousel-pagination');
  let hasFadeAnimation = false;
  let initPos = null;
  let initialWidth = null;
  let initProgressWidth = null;
  let maxWidth = null;

  const dragPosition = () => {
    const currentPosition =
      (slider.Components.Move.getPosition() - initPos) / (maxWidth - initPos);
    const x = currentPosition * (initProgressWidth - getXPosition());

    //pagination.css("margin-left", `${x}px`);
    pagination.css('margin-left', `${initialWidth * slider.index}px`);
  };

  const getEnd = () => {
    return slider.Components.Controller.getEnd() + 1;
  };

  const getXPosition = () => {
    initialWidth = progressBar.width() / getEnd();
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

  const previousElementAnimation = (item) => {
    $(item)
      .children()
      .removeClass('fadeIn fadeOut')
      .addClass('fadeOutNoAnimation');

    setTimeout(() => {
      $(item).children().removeClass('fadeOutNoAnimation').addClass('fadeIn');
    }, 15);
  };

  pagination.css('transition', 'width 200ms ease, margin-left 200ms ease');

  rightArrow.click(() => {
    const maxWidth = slider.Components.Move.getLimit(true);
    const limit = slider.Components.Move.toPosition(slider.index);
    hasFadeAnimation = true;

    if (limit > maxWidth) {
      const pastElement = $(
        slider.Components.Elements.slides[slider.index]
      ).children();
      $(pastElement).removeClass('fadeIn').addClass('fadeOut');
    } else {
      resetSlides(true);
    }

    slider.go('>');
  });

  leftArrow.click(() => {
    const counter = slider.index - 1;
    const pastElement = $(slider.Components.Elements.slides[counter]);
    hasFadeAnimation = true;

    if (counter >= 0) {
      previousElementAnimation(pastElement);
    } else {
      const numberOfSlides = slider.Components.Slides.get(true)?.length - 1;
      const previousClone =
        slider.Components.Slides.getAt(numberOfSlides)?.slide;

      if (previousClone) {
        previousElementAnimation(previousClone);
      }
    }
    slider.go('<');
  });

  slider.on('mounted resize', () => {
    resetSlides();
    pagination.css('width', `${getXPosition()}px`);
    pagination.css('margin-left', `${initialWidth * slider.index}px`);
    initPos = initPos || slider.Components.Move.getPosition(0);
    initProgressWidth = progressBar.width() || 0;
    maxWidth = slider.Components.Move.getLimit(true) || 0;
  });

  slider.on('move', (e) => {
    pagination.css('transition', 'width 200ms ease, margin-left 200ms ease');
    pagination.css('margin-left', `${initialWidth * slider.index}px`);
  });

  slider.on('moved', () => {
    dragPosition();
  });

  slider.on('dragging', () => {
    pagination.css('transition', 'none');
    dragPosition();
  });

  slider.on('drag', () => {
    resetSlides();
  });

  return slider;
}

$('.media-carousel').each((index, carousel) => {
  new MediaCarousel(carousel).mount();
});
