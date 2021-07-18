(function ($) {

	'use strict';

	$(document).ready(function () {

		/*=============================================
		=            Handle Media Queries             =
		=============================================*/
		function handleMediaChange(mqr) {
			if (!mqr.matches) {
				$(window).on('scroll', toggleScreenNav);
			} else {
				$(window).off('scroll load', toggleScreenNav);
			}
		}

		if (window.matchMedia) {
			var mqr = window.matchMedia('(max-width: 1200px)');
			mqr.addListener(handleMediaChange);
			handleMediaChange(mqr);
		}

		/*===========================
		=            Nav            =
		===========================*/
		$('.main-nav-trigger').click(function () {
			$('.main-nav').toggleClass('main-nav-visible');
		});

		$('nav.main-nav').onePageNav({
			scrollSpeed: 500,
			easing: 'easeInOutCubic',
			filter: ':not(.external)'
		});

		function toggleScreenNav() {
			var offset = $(window).scrollTop(),
				$nav = $('.main-nav'),
				cssClass = 'main-nav-visible';
			if (offset > 500) {
				$nav.addClass(cssClass);
			} else {
				$nav.removeClass(cssClass);
			}
		}

		/*=====================================
		=            Button scroll            =
		=====================================*/
		$(document).on('click', '.btn-scroll', function (e) {
			e.preventDefault();
			var target = $(this).attr('href');
			var targetOffset = $(target).offset();
			$('html,body').animate({ scrollTop: (targetOffset.top - 59) }, 500, 'easeInOutQuart');
		});

		/*=========================================
		=            Custom scrollbars            =
		=========================================*/
		$(window).load(function () {
			$('.scroll').mCustomScrollbar({
				theme: "persona",
				scrollInertia: 300
			});
		});

		/*==============================
		=            Skills            =
		==============================*/
		$('.skills .skill').each(function () {
			var progress = $(this).data('percent');
			$('.progress', this).css('width', progress + '%');
		});

		/*=================================
		=            Portfolio            =
		=================================*/
		$('.works').shuffle({
			itemSelector: '.works-item',
			gutterWidth: 30
		});

		$('.filter li').on('click', function () {
			var $this = $(this),
				isActive = $this.hasClass('active'),
				group = isActive ? 'all' : $this.data('group');
			if (!isActive) {
				$('.filter .active').removeClass('active');
			}
			$this.toggleClass('active');
			$('.works').shuffle('shuffle', group);
		});

		$('.filtered .works-item-link').magnificPopup({
			type: 'inline',
			gallery: {
				enabled: true
			},
			mainClass: 'persona',
			closeBtnInside: false,
			removalDelay: 300
		});

		/*=================================
		=            Accordion            =
		=================================*/
		$('.accordion-item-heading').on('click', function () {
			$(this).parent().toggleClass('active').find('.accordion-item-inner').slideToggle();
		});

		/*=================================
		=            Slideshow            =
		=================================*/
		function getCurSlide(elem) {
			$(elem.owl.owlItems[elem.owl.currentItem]).addClass('current').siblings().removeClass('current');
		}

		$('.intro-slideshow').owlCarousel({
			singleItem: true,
			transitionStyle: 'fade',
			autoPlay: 10000,
			pagination: false,
			afterInit: function () {
				var self = this;
				getCurSlide(self);
			},
			afterMove: function () {
				var self = this;
				getCurSlide(self);
			}
		});

		$('.slideshow').owlCarousel({
			singleItem: true,
			transitionStyle: 'backSlide',
			autoPlay: true
		});

		/*===========================
		=            Map            =
		===========================*/
		var mapEl = document.getElementById('map');
		if (mapEl) {

			L.TileLayer.Grayscale = L.TileLayer.extend({
				options: {
					quotaRed: 21,
					quotaGreen: 71,
					quotaBlue: 8,
					quotaDividerTune: 0,
					quotaDivider: function () {
						return this.quotaRed + this.quotaGreen + this.quotaBlue + this.quotaDividerTune;
					}
				},

				initialize: function (url, options) {
					options = options || {}
					options.crossOrigin = true;
					L.TileLayer.prototype.initialize.call(this, url, options);

					this.on('tileload', function (e) {
						this._makeGrayscale(e.tile);
					});
				},

				_createTile: function () {
					var tile = L.TileLayer.prototype._createTile.call(this);
					tile.crossOrigin = "Anonymous";
					return tile;
				},

				_makeGrayscale: function (img) {
					if (img.getAttribute('data-grayscaled'))
						return;

					img.crossOrigin = '';
					var canvas = document.createElement("canvas");
					canvas.width = img.width;
					canvas.height = img.height;
					var ctx = canvas.getContext("2d");
					ctx.drawImage(img, 0, 0);

					var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
					var pix = imgd.data;
					for (var i = 0, n = pix.length; i < n; i += 4) {
						pix[i] = pix[i + 1] = pix[i + 2] = (this.options.quotaRed * pix[i] + this.options.quotaGreen * pix[i + 1] + this.options.quotaBlue * pix[i + 2]) / this.options.quotaDivider();
					}
					ctx.putImageData(imgd, 0, 0);
					img.setAttribute('data-grayscaled', true);
					img.src = canvas.toDataURL();
				}
			});

			L.tileLayer.grayscale = function (url, options) {
				return new L.TileLayer.Grayscale(url, options);
			};

			var lat = mapEl.getAttribute('data-lat');
			var lng = mapEl.getAttribute('data-lng');
			var map = L.map(mapEl, {
				center: [lat, lng],
				zoom: 15
			});
			var icon = L.icon({
				iconUrl: 'assets/images/marker.png',
				iconSize: [41, 48],
				iconAnchor: [20, 48]
			});

			L.tileLayer.grayscale('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
			L.marker([lat, lng], { icon: icon }).addTo(map);

		}

		/*=======================================
		=            Form validation            =
		=======================================*/
		$(".feedback-form").validate({
			errorClass: "inp-error",
			validClass: "inp-success",
			rules: {
				email: {
					email: true
				}
			}
		});

		/*===================================
		=            Form submit            =
		===================================*/
		$(".feedback-form").submit(function (e) {
			e.preventDefault();
			var $form = $(this);
			if ($form.valid()) {
				var dataString = $form.serialize();
				$('input[type="submit"]', this).after('<div class="loader"></div>');
				$.ajax({
					type: $form.attr('method'),
					url: $form.attr('action'),
					data: dataString,
					success: function (data) {
						$form.append('<div class="message message-success">Your message was sent successfully!</div>').find('.message').fadeIn();
					},
					error: function (data) {
						$form.append('<div class="message message-error">Your message wasn\'t sent, please try again.</div>').find('.message').fadeIn();
					},
					complete: function () {
						$form.find('.loader').remove();
						setTimeout(function () {
							$form.find('.message').fadeOut(function () {
								$(this).remove();
							});
						}, 5000);
					}
				});
			}
		});

		/*==============================
		=            Tweets            =
		==============================*/
		var tweetsID = 'tweets',
			tweetsEl = document.getElementById(tweetsID);
		if (tweetsEl) {
			var tweetsConfig = {
				'profile': { screenName: tweetsEl.getAttribute('data-username') },
				'domId': tweetsID,
				'maxTweets': 3,
				'showInteraction': false
			};
			twitterFetcher.fetch(tweetsConfig);
		}

		setTimeout(function () {
			$('.page-loader').hide();
		}, 10000);

	});

	$(window).load(function () {

		$('body').addClass('loaded');

		setTimeout(function () {
			$('.page-loader').hide();
		}, 1500);

	});

}(jQuery));