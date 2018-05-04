(function ($) {
  Drupal.behaviors.dlts_interview = {
    attach: function( context, settings ) {
      $.each( settings.dlts.interview.streams, function( index, stream ) {
        $f( stream.id, settings.dlts.interview.player.url, {
          playlist: stream.playlist,
          plugins : settings.dlts.interview.player.plugins
        });
	  });
    }
  };
})(jQuery);