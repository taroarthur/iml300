$(document).ready(function() {
    // 1. Page Load Animations - Content fades in nicely
    $('.recommendations, .mixes-grid').hide().fadeIn(800);
    $('.header-title').hide().fadeIn(1000);

    // 2. Playlist Item Hover Effects - Playlist items slide and highlight when you hover
    $('.playlist-item').hover(
        function() { 
            $(this).animate({ paddingLeft: '20px' }, 150)
                   .css('color', '#ffffff');
        },
        function() { 
            $(this).animate({ paddingLeft: '8px' }, 150)
                   .css('color', '#b3b3b3');
        }
    );

    // 3. Recommendation Card Hover - Image fades on hover
    $('.rec-card').hover(
        function() {
            $(this).find('.rec-image').animate({ opacity: 0.8 }, 250);
        },
        function() {
            $(this).find('.rec-image').animate({ opacity: 1 }, 250);
        }
    );

    // 4. Like/Heart with Animation - Heart button animates and swaps icon when clicked
    let isLiked = false;
    $('.control-button').last().click(function(e) {
        e.preventDefault();
        isLiked = !isLiked;
        const $img = $(this).find('img');
        
        $(this).animate({ fontSize: '24px' }, 150)
               .animate({ fontSize: '18px' }, 150);
        
        if (isLiked) {
            $img.attr('src', 'assets/streaming_ui_components/heart_fill_xs.png').attr('alt', 'Liked');
        } else {
            $img.attr('src', 'assets/streaming_ui_components/heart_xs.png').attr('alt', 'Like');
        }
    });

    // 5. Control Button Hover Effects - Buttons scale up on hover (excluding play button)
    $('.control-button').not('.play').hover(
        function() {
            $(this).stop(true, false).animate({ 
                fontSize: '22px'
            }, 150);
        },
        function() {
            $(this).stop(true, false).animate({ 
                fontSize: '18px'
            }, 150);
        }
    );

    // Play button special hover effect
    $('.control-button.play').hover(
        function() {
            $(this).stop(true, false).animate({ 
                width: '44px',
                height: '44px'
            }, 150);
        },
        function() {
            $(this).stop(true, false).animate({ 
                width: '40px',
                height: '40px'
            }, 150);
        }
    );

    // Play button click toggle with image swap
    $('.control-button.play').click(function() {
        let isPlaying = $(this).data('playing');
        const $img = $(this).find('img');
        
        if (isPlaying) {
            $img.attr('src', 'assets/streaming_ui_components/play_l.png').attr('alt', 'Play');
            $(this).data('playing', false);
        } else {
            $img.attr('src', 'assets/streaming_ui_components/pause_l.png').attr('alt', 'Pause');
            $(this).data('playing', true);
        }
    });

    // Sidebar item active state - apply bold styling via jQuery
    $('.sidebar-item').click(function() {
        const href = $(this).data('href');
        if (href) {
            window.location.href = href;
        }
        $('.sidebar-item').removeClass('active').css('font-weight', '400');
        $(this).addClass('active').css('font-weight', '600');
    });

    // Playlist item navigation
    $('.playlist-item').click(function() {
        const href = $(this).data('href');
        if (href) {
            window.location.href = href;
        }
    });

    // Recommendation card navigation
    $('.rec-card').click(function() {
        const href = $(this).data('href');
        if (href) {
            window.location.href = href;
        }
    });


// quote page interaction

const $quote = $("#dodging-quote");
  const originalText = $quote.text().trim();

  // Split into words
  const words = originalText.split(" ");
  const wrappedWords = words.map(word => `<span class="word">${word}</span>`).join(" ");
  $quote.html(wrappedWords);

  const $words = $quote.find(".word");

  $(document).on("mousemove", function (e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    $words.each(function () {
      const $word = $(this);
      const rect = this.getBoundingClientRect();

      const centreX = rect.left + rect.width / 2;
      const centreY = rect.top + rect.height / 2;

      const dx = centreX - mouseX;
      const dy = centreY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const influenceRadius = 140;
      const maxPush = 40;

      if (distance < influenceRadius) {
        const force = (1 - distance / influenceRadius) * maxPush;

        const angle = Math.atan2(dy, dx);
        const moveX = Math.cos(angle) * force;
        const moveY = Math.sin(angle) * force;

        $word.css("transform", `translate(${moveX}px, ${moveY}px)`);
      } else {
        $word.css("transform", "translate(0px, 0px)");
      }
    });
  });

  $(document).on("mouseleave", function () {
    $words.css("transform", "translate(0px, 0px)");
  });










});
