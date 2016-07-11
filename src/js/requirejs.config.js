requirejs.config({

    baseUrl: './js/',
    paths: {
        'jquery': 'https://code.jquery.com/jquery-3.1.0.min',
        'underscore': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
        'backbone': 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min',
        'text': 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
        'app': 'app'
    },
    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        }
    }

});

/* app bootstrap */

require(['app'],

    function(phonepayApp) {
      new phonepayApp.PhonepayView({model: phonepayApp.PhonePayModel}).render();
    }

  );
