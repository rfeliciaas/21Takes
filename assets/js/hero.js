(function () {
	var hero = document.getElementById('banner');
	if (!hero) return;

	var track = hero.querySelector('.hero-track');
	var slides = hero.querySelectorAll('.hero-slide');
	var dotsBox = hero.querySelector('.hero-dots');
	var prevBtn = hero.querySelector('.hero-prev');
	var nextBtn = hero.querySelector('.hero-next');

	var AUTOPLAY = true;        // set to false to turn off automatic sliding
	var DELAY = 6000;           // time between slides, in milliseconds

	var index = 0;
	var timer = null;
	var startX = null;
	var dots = [];

	// with only one image, hide the controls
	if (slides.length < 2) {
		prevBtn.style.display = 'none';
		nextBtn.style.display = 'none';
		return;
	}

	slides.forEach(function (_, n) {
		var dot = document.createElement('button');
		dot.type = 'button';
		dot.setAttribute('aria-label', 'Go to image ' + (n + 1));
		dot.addEventListener('click', function () { go(n); restart(); });
		dotsBox.appendChild(dot);
		dots.push(dot);
	});

	function go(i) {
		index = (i + slides.length) % slides.length;     // wraps around at both ends
		track.style.transform = 'translateX(' + (-100 * index) + '%)';
		dots.forEach(function (d, n) { d.classList.toggle('active', n === index); });
	}

	function start() {
		if (AUTOPLAY) timer = setInterval(function () { go(index + 1); }, DELAY);
	}
	function stop() { clearInterval(timer); }
	function restart() { stop(); start(); }

	prevBtn.addEventListener('click', function () { go(index - 1); restart(); });
	nextBtn.addEventListener('click', function () { go(index + 1); restart(); });

	hero.addEventListener('mouseenter', stop);
	hero.addEventListener('mouseleave', start);

	// swipe on touch screens
	hero.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
	hero.addEventListener('touchend', function (e) {
		if (startX === null) return;
		var diff = e.changedTouches[0].clientX - startX;
		if (Math.abs(diff) > 40) { go(diff < 0 ? index + 1 : index - 1); restart(); }
		startX = null;
	});

	go(0);
	start();
})();