(function() {
  'use strict';

  socialcast.keyboardShortcut = {
    init: function(o) {
      var defaults = {
        queue: [],
        multiKeyTimer: null,
        multiKeyTimeout: 500,
      };

      options = $.extend(this, defaults, o);

      this.listeners = options.listeners;
      this.queue = options.queue;
      this.multiKeyTimer = options.multiKeyTimer;
      this.multiKeyTimeout = options.multiKeyTimeout;
    },

    handleEvent: function(e) {
      if (this._isDisabled(e)) {
        return;
      }

      e.preventDefault();
      this.queue.push(this._characterFromEvent(e));
      clearTimeout(this.pKeyTimer);
      this.pKeyTimer = this._executeShortcuts();
    },

    _isDisabled: function(e) {
      return (!socialcast.currentUser.areKeyboardShortcutsEnabled || e.ctrlKey || e.altKey || e.metaKey || $(e.target).is(':typeable'));
    },

    _characterFromEvent: function(e) {
      return String.fromCharCode(e.which).toLowerCase();
    },

    _executeShortcuts: function() {
      var keyCodes = socialcast.keyboardShortcut.queue.join(" ");
      var shortcut = socialcast.keyboardShortcut.listeners[keyCodes];

      if (shortcut) {
        shortcut();
        socialcast.keyboardShortcut.queue = [];
        return null;
      } else {
        return setTimeout(function() {
          socialcast.keyboardShortcut.queue = [];
        }, this.multiKeyTimeout);
      }
    }
  };

  var options = {
    listeners: {
      '?': function() {
        socialcast.modal('/users/' + socialcast.currentUser.id + '/keyboard_shortcuts', {
          width: 700,
          title: I18n.t('js.modal.keyboard_shortcuts.modal_title')
        });
      },
      's': function() {
        $('#q').focus();
      },
      '/': function() {
        $('#q').focus();
      },
      'p u': function() {
        $('#post_update').focus();
      }
    }
  };

  socialcast.keyboardShortcut.init(options);

  $(document).on('keypress', function(e) {
    socialcast.keyboardShortcut.handleEvent(e);
  });

})();
