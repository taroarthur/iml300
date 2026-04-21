// Facts Page Interactivity

$(document).ready(function() {
  setupNavigation();
  setupCalculator();
  setupAnimations();
});

function setupNavigation() {
  $('.facts-nav-link').on('click', function(e) {
    e.preventDefault();

    const sectionId = $(this).data('section');

    // Update active nav link
    $('.facts-nav-link').removeClass('active');
    $(this).addClass('active');

    // Show/hide sections with fade effect
    $('.facts-section').removeClass('active');
    $('#' + sectionId).addClass('active');

    // Scroll to section
    const targetTop = $('#' + sectionId).offset().top - 100;
    $('.facts-content').animate({ scrollTop: targetTop }, 600, 'easeInOutQuad');
  });
}

function setupCalculator() {
  const slider = $('#stream-slider');
  const sliderDisplay = $('.slider-value');
  const resultAmount = $('.result-amount');

  function updateCalculator() {
    const streams = parseInt(slider.val());

    // Format number with commas
    const formattedStreams = streams.toLocaleString();
    sliderDisplay.text(formattedStreams);

    // Calculate earnings (using $0.003 - $0.005 range for Spotify)
    const minEarnings = streams * 0.003;
    const maxEarnings = streams * 0.005;

    const formattedMin = '$' + Math.round(minEarnings).toLocaleString();
    const formattedMax = '$' + Math.round(maxEarnings).toLocaleString();

    resultAmount.text(formattedMin + ' – ' + formattedMax);

    // Add visual feedback
    updateSliderBackground(slider);
  }

  slider.on('input', updateCalculator);

  // Initialize
  updateCalculator();
}

function updateSliderBackground(slider) {
  const value = (slider.val() - slider.prop('min')) / (slider.prop('max') - slider.prop('min')) * 100;
  slider.css('background', `linear-gradient(to right, var(--accent) 0%, var(--accent) ${value}%, var(--light) ${value}%, var(--light) 100%)`);
}

function setupAnimations() {
  // Platform bars hover animation
  $('.platform-bar').hover(
    function() {
      $(this).stop(true, false).animate({
        opacity: 1
      }, 200);
    },
    function() {
      $(this).stop(true, false).animate({
        opacity: 0.8
      }, 200);
    }
  );

  // Earnings table row hover
  $('.earnings-table tbody tr').hover(
    function() {
      $(this).stop(true, false).animate({
        backgroundColor: 'rgba(245, 252, 0, 0.1)'
      }, 150);
    },
    function() {
      $(this).stop(true, false).animate({
        backgroundColor: 'transparent'
      }, 150);
    }
  );

  // Tradeoff box animations
  $('.tradeoff-box').hover(
    function() {
      $(this).stop(true, false).animate({
        transform: 'translateY(-4px)'
      }, 200);
    },
    function() {
      $(this).stop(true, false).animate({
        transform: 'translateY(0)'
      }, 200);
    }
  );

  // Reality box animations
  $('.reality-box').each(function(index) {
    $(this).css('opacity', '0').delay(index * 100).animate({
      opacity: 1
    }, 400, 'easeOutQuad');
  });
}

// Smooth scroll behavior
$.easing.easeInOutQuad = function(x, t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
};
