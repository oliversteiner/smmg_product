(function($) {
  Drupal.behaviors.smmgProductBehavior = {
    $elements: {},
    product: {},
    tracklist: {},
    current_track: 0,
    attach(context, settings) {
      $('#page-wrapper', context)
        .once('smmgProductBehavior')
        .each(() => {
          // Tracklist toggle Info

          this.product = drupalSettings.product;
          this.tracklist = this.getTracklist();
          const $tracklistItem = $('.product-track-list-item-trigger');

          const $toggleTracklistButton = $('.product-show-tracklist-trigger');
          const $toggleTracklistButtonLabel = $('.product-show-tracklist-trigger-label');
          const $tracklistContainer = $('.product-tracks-container');

          const $playerContainer = $('.audio-player-widget');
          const $togglePlayerButton = $('.product-listen-all-previews-trigger');

          const $orderButton = $('.product-order-trigger');


          const $playButton = $('.audio-player-play-trigger');
          const $pauseButton = $('.audio-player-pause-trigger');
          const $nextTrackButton = $('.audio-player-next-track-trigger');
          const $previewTrackButton = $('.audio-player-preview-track-trigger');

          this.$elements = {
            playerContainer: $playerContainer,
            togglePlayerButton: $togglePlayerButton,
            playButton: $playButton,
            pauseButton: $pauseButton,
            nextTrackButton: $nextTrackButton,
            previewTrackButton: $previewTrackButton,
            toggleTracklistButton: $toggleTracklistButton,
            toggleTracklistButtonLabel: $toggleTracklistButtonLabel,
            tracklistContainer: $tracklistContainer,
            orderButton: $orderButton,
          };

          const scope = this;

          $playButton.click(function() {
            scope.playAll();
          });

          $pauseButton.click(function() {
            scope.pause();
          });

          $nextTrackButton.click(function() {
            scope.nextTrack();
          });

          $previewTrackButton.click(function() {
            scope.previewTrack();
          });

          $togglePlayerButton.click(function() {
            scope.togglePlayer();
          });

          $toggleTracklistButton.click(function() {
            scope.toggleTracklist();
          });

          $orderButton.click(function() {
            scope.orderProduct();
          });

          return $tracklistItem.each(function(index) {
            const infoElemName = this.dataset.listItem;

            const $infoElem = $('.product-track-list-item-info-' + index);
            const $playerElem = $(
              '.product-track-list-item-preview-player-' + index,
            );
            $(this).click(function() {
              $tracklistItem.toggleClass('active');
              $infoElem.toggle();
              $playerElem.toggle();
            });
          });
        });
    },
    /**
     *
     */
    togglePlayer() {
      this.$elements.playerContainer.toggle();

      const number = this.tracklist[0].number;
      const title = this.tracklist[0].title;

      this.showAudioTitle(number + '. ' + title);
    },

    /**
     *
     */
    toggleTracklist() {

      const $target = this.$elements.tracklistContainer;
      const $button = this.$elements.toggleTracklistButton;
      const $buttonLabel = this.$elements.toggleTracklistButtonLabel;

      $target.toggle();

      // if tracks and mobile scroll to tracklist
      const screen = $(window).width();

      if (screen < 500) {
        $('html, body').animate({
          scrollTop: $target.offset().top,
        }, 'slow');
      }

      console.log('$target.is(\':visible\')', $target.is(':visible'));

      if ($target.is(':visible')) {
        $buttonLabel.html('Lieder ausblenden');
      } else {
        $buttonLabel.html('Lieder anzeigen');

      }

    },


    /**
     *
     */
    playAll() {
      this.play();
    },

    play() {
      this.toggleAudioActivityBars();
      this.$elements.playButton.hide();
      this.$elements.pauseButton.show();
      const ct = this.current_track;

      const number = this.tracklist[ct].number;
      const title = this.tracklist[ct].title;
      const url = this.tracklist[ct].url;
      const sound = this.tracklist[ct].sound;

      this.showAudioTitle(number + '. ' + title);
      sound.play();
    },

    /**
     *
     */
    pause() {
      this.stopAudioActivityBars();
      this.$elements.playButton.show();
      this.$elements.pauseButton.hide();

      const ct = this.current_track;
      const sound = this.tracklist[ct].sound;
      sound.pause();
    },

    /**
     *
     */
    nextTrack() {
      const ct = this.current_track;
      const max = this.tracklist.length;
      const sound = this.tracklist[ct].sound;

      let next_track = ct + 1;

      if (next_track < max) {
        sound.pause();

        this.current_track = next_track;
      }

      this.play();
    },

    /**
     *
     */
    previewTrack() {
      const ct = this.current_track;
      const sound = this.tracklist[ct].sound;

      let next_track = ct - 1;

      if (next_track < 0) {
        next_track = 0;
      }
      sound.pause();

      this.current_track = next_track;

      this.play();
    },


    /**
     *
     */
    orderProduct() {
      const url = '/order_product';
      $(location).attr('href', url);

    },

    /**
     *
     */
    toggleAudioActivityBars() {
      $('.bar').toggleClass('sound-on');
    },

    /**
     *
     */
    stopAudioActivityBars() {
      $('.bar').removeClass('sound-on');
    },

    /**
     *
     */
    showAudioTitle(title) {
      $('.audio-player-display-content').text(title);
    },

    /**
     *
     * @return {number,title,url}
     */
    getTracklist() {
      const product = this.product;

      let trackList = [];

      let list = product.tracks.filter(track => {
        if (track.has_preview) {
          const number = track.number;
          const title = track.name;
          const url = track.preview.media_link;

          const sound = new Audio();
          sound.src = url;

          const new_track = {
            number: number,
            title: title,
            url: url,
            sound: sound,
          };

          trackList.push(new_track);
          return track;
        }
      });

      return trackList;
    },
  };
})(jQuery, Drupal, drupalSettings);
