// Facts Page Interactivity

$(document).ready(function() {
  setupNavigation();
  setupCalculator();
  setupAnimations();
});

function setupNavigation() {
  const topbarHeight = () => $('.facts-topbar').outerHeight() || 80;

  // Smooth scroll on nav link click
  $('.facts-nav-link').on('click', function(e) {
    e.preventDefault();
    const target = $($(this).attr('href'));
    if (target.length) {
      $('html, body').animate(
        { scrollTop: target.offset().top - topbarHeight() - 20 },
        500,
        'easeInOutQuad'
      );
    }
  });

  // Highlight active link based on scroll position
  $(window).on('scroll.facts', function() {
    const scrollPos = $(this).scrollTop();
    const offset = topbarHeight() + 40;

    $('.facts-section').each(function() {
      const top = $(this).offset().top - offset;
      const bottom = top + $(this).outerHeight();
      if (scrollPos >= top && scrollPos < bottom) {
        const id = $(this).attr('id');
        $('.facts-nav-link').removeClass('active');
        $(`.facts-nav-link[href="#${id}"]`).addClass('active');
      }
    });
  });

  // Trigger once on load to set initial state
  $(window).trigger('scroll.facts');
}

function setupCalculator() {
  const slider = $('#stream-slider');
  const sliderDisplay = $('.slider-value');
  const resultAmount = $('.result-amount');

  function updateCalculator() {
    const streams = parseInt(slider.val());
    sliderDisplay.text(streams.toLocaleString());

    const minEarnings = streams * 0.003;
    const maxEarnings = streams * 0.005;
    resultAmount.text('$' + Math.round(minEarnings).toLocaleString() + ' – $' + Math.round(maxEarnings).toLocaleString());

    updateSliderBackground(slider);
  }

  slider.on('input', updateCalculator);
  updateCalculator();
}

function updateSliderBackground(slider) {
  const value = (slider.val() - slider.prop('min')) / (slider.prop('max') - slider.prop('min')) * 100;
  slider.css('background', `linear-gradient(to right, var(--accent) 0%, var(--accent) ${value}%, rgba(193,197,191,0.2) ${value}%, rgba(193,197,191,0.2) 100%)`);
}

function setupAnimations() {
  $('.platform-bar').hover(
    function() { $(this).stop(true, false).animate({ opacity: 1 }, 200); },
    function() { $(this).stop(true, false).animate({ opacity: 0.85 }, 200); }
  );

  $('.earnings-table tbody tr').hover(
    function() { $(this).stop(true, false).animate({ backgroundColor: 'rgba(245, 252, 0, 0.06)' }, 150); },
    function() { $(this).stop(true, false).animate({ backgroundColor: 'transparent' }, 150); }
  );
}

$.easing.easeInOutQuad = function(x, t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
};
