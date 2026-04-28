fetch('quote.json')
  .then(r => r.json())
  .then(data => {
    const container = document.getElementById('quotes-container');

    data.quotes.forEach(q => {
      const item = document.createElement('div');
      item.className = 'quote-item';

      const textHtml = q.text.replace(/\*(.*?)\*/g, '<em>$1</em>');
      const sourceHtml = q.source
        ? `<span class="quote-source">${q.source}</span>`
        : '';

      item.innerHTML = `
        <blockquote class="quote">“${textHtml}”</blockquote>
        <cite class="quote-author">
          <span class="quote-author-name">${q.author}</span>
          ${sourceHtml}
        </cite>
      `;

      container.appendChild(item);
    });

    // Wrap every word in every quote in a .word span, preserving HTML tags
    document.querySelectorAll('.quote').forEach(blockquote => {
      wrapWordsInSpans(blockquote);
    });

    initDodge();
  })
  .catch(err => console.error('Failed to load quotes:', err));

// Walks text nodes only, wrapping each word in a <span class="word">,
// so <em> tags and other markup are preserved as-is.
function wrapWordsInSpans(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);

  nodes.forEach(node => {
    const parts = node.textContent.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    parts.forEach(part => {
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
      } else if (part) {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = part;
        frag.appendChild(span);
      }
    });
    node.parentNode.replaceChild(frag, node);
  });
}

function initDodge() {
  const $words = $('.quote .word');

  $(document).on('mousemove', function(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    $words.each(function() {
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
        $(this).css('transform', `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px)`);
      } else {
        $(this).css('transform', 'translate(0px, 0px)');
      }
    });
  });

  $(document).on('mouseleave', function() {
    $words.css('transform', 'translate(0px, 0px)');
  });
}
