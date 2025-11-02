/*
	Miniport by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	var $window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: [null, '736px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Scrolly.
	$('#nav a, .scrolly').scrolly({
		speed: 1000,
		offset: function () { return $nav.height(); }
	});

	// Portfolio carousel: horizontal scroll controlled by arrows
	$(function () {
		var $carousel = $('#portfolio .portfolio-carousel');
		if ($carousel.length) {
			var $track = $carousel.find('.carousel-track');
			var $cards = $track.find('.project-card');
			var $prev = $carousel.find('.carousel-arrow.prev');
			var $next = $carousel.find('.carousel-arrow.next');

			function getStep() {
				var cardW = $cards.first().outerWidth(true) || 320;
				var trackW = $track.innerWidth() || 800;
				return Math.min(cardW + 16, Math.max(240, Math.floor(trackW * 0.8)));
			}

			function scrollBy(delta) {
				$track[0].scrollBy({ left: delta, behavior: 'smooth' });
			}

			$prev.on('click', function (e) {
				e.preventDefault();
				scrollBy(-getStep());
			});

			$next.on('click', function (e) {
				e.preventDefault();
				scrollBy(getStep());
			});

			// Keyboard support (focus the track or arrows to use Left/Right)
			$track.attr('tabindex', '0');
			$track.on('keydown', function (e) {
				if (e.key === 'ArrowLeft') { e.preventDefault(); scrollBy(-getStep()); }
				else if (e.key === 'ArrowRight') { e.preventDefault(); scrollBy(getStep()); }
			});
		}
	});

	// Hero title typewriter effect
	$(function () {
		var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		var $l1 = $('#hero-line1');
		var $l2 = $('#hero-line2');
		if (!$l1.length || !$l2.length) return;

		// Ensure line2 visible while we control text ourselves
		$l2.css({ opacity: 1, transform: 'none' });

		// Gather originals
		var full1 = $l1.text().trim();
		var hl1 = ($l1.data('highlight') || '').toString();
		var full2 = $l2.text().trim();

		if (prefersReduced) {
			// No animation: restore original markup
			if (hl1 && full1.indexOf(hl1) !== -1) {
				var open = '<strong class="hero-highlight">';
				var close = '</strong>';
				var i = full1.indexOf(hl1);
				$l1.html(full1.slice(0, i) + open + hl1 + close + full1.slice(i + hl1.length));
			}
			// Restore AI/ML highlight
			$l2.html('<span class="ai-ml hero-highlight">AI/ML</span> Engineer');
			return;
		}

		function typeWithOptionalHighlight($el, text, highlight, speed, done, wrapperOpen, wrapperClose) {
			var idx = 0;
			var start = highlight ? text.indexOf(highlight) : -1;
			var end = start >= 0 ? start + highlight.length : -1;
			function frame() {
				idx++;
				if (idx > text.length) { if (done) done(); return; }
				var out = '';
				if (start >= 0 && idx > start) {
					// Build segments around highlight
					var before = text.slice(0, Math.min(idx, start));
					var hiPartEnd = Math.min(idx, end);
					var hiPart = text.slice(start, hiPartEnd);
					var after = idx > end ? text.slice(end, idx) : '';
					var open = wrapperOpen || '<strong class="hero-highlight">';
					var close = wrapperClose || '</strong>';
					out = before + open + hiPart + close + after;
				} else {
					out = text.slice(0, idx);
				}
				$el.html(out);
				setTimeout(frame, speed);
			}
			frame();
		}

		function typePlain($el, text, speed, done) {
			var idx = 0;
			function frame() {
				idx++;
				if (idx > text.length) { if (done) done(); return; }
				$el.text(text.slice(0, idx));
				setTimeout(frame, speed);
			}
			frame();
		}

		// Prepare: clear contents to start typing
		$l1.empty();
		$l2.empty();

		var charSpeed1 = 100; // ms per char line 1
		var charSpeed2 = 100; // ms per char line 2
		var delayBetween = 1100; // ms between lines

		typeWithOptionalHighlight($l1, full1, hl1, charSpeed1, function () {
			setTimeout(function () {
				typeWithOptionalHighlight(
					$l2,
					full2,
					'AI/ML',
					charSpeed2,
					function () { },
					'<span class="ai-ml hero-highlight">',
					'</span>'
				);
			}, delayBetween);
		});
	});

	// Reveal-on-scroll (IntersectionObserver)
	$(function () {
		var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReduced || !('IntersectionObserver' in window)) return;
		var $targets = $('.box, .image.fit, .project-card, .cert-card, article header, .meta');
		$targets.addClass('reveal');
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (en.isIntersecting) {
					$(en.target).addClass('in');
					io.unobserve(en.target);
				}
			});
		}, { threshold: 0.15 });
		$targets.each(function () { io.observe(this); });
	});

	// Scrollspy for nav
	$(function () {
		var ids = ['#top', '#work', '#certificates', '#portfolio', '#contact'];
		var $links = ids.map(function (id) { return $('#nav a[href="' + id + '"]'); });
		function onScroll() {
			var pos = $window.scrollTop() + $nav.outerHeight() + 10;
			var current = null;
			ids.forEach(function (id) {
				var $sec = $(id);
				if ($sec.length && $sec.offset().top <= pos) current = id;
			});
			$('#nav a').removeClass('active');
			if (current) $('#nav a[href="' + current + '"]').addClass('active');
		}
		$window.on('scroll', onScroll);
		onScroll();
	});

	// Certificates keyboard support (per-card)
	$(function () {
		var $cert = $('#certificates .certs-carousel');
		if (!$cert.length) return;
		var $track = $cert.find('.certs-track');
		var $cards = $track.find('.cert-card');
		function step() {
			var $first = $cards.first();
			return Math.ceil(($first.outerWidth() || 320) + 16);
		}
		$track.attr('tabindex', '0');
		$track.on('keydown', function (e) {
			if (e.key === 'ArrowLeft') { e.preventDefault(); $track[0].scrollBy({ left: -step(), behavior: 'smooth' }); }
			else if (e.key === 'ArrowRight') { e.preventDefault(); $track[0].scrollBy({ left: step(), behavior: 'smooth' }); }
		});
	});

	// Certificates lightbox
	$(function () {
		var $lb = $('#lightbox');
		if (!$lb.length) return;
		var $lbImg = $lb.find('img');
		$('#certificates .certs-track').on('click', 'img', function () {
			var src = $(this).attr('src');
			if (!src) return;
			$lbImg.attr('src', src);
			$lb.addClass('open').focus();
		});
		$lb.on('click', function (e) {
			if (e.target === this || e.target.tagName === 'IMG') {
				$lb.removeClass('open');
				$lbImg.attr('src', '');
			}
		});
		$(document).on('keydown', function (e) {
			if (e.key === 'Escape' && $lb.hasClass('open')) {
				$lb.removeClass('open');
				$lbImg.attr('src', '');
			}
		});
	});

})(jQuery);