"use strict";
define(["jquery",
        "../lib/chat",
        "../lib/fileupload",
        "/scripts/vendor/bootstrap/bootstrap.min.js",
        "/scripts/vendor/bootstrap/bootstrap-modal.min.js",
        "/scripts/vendor/bootstrap/bootstrap-transition.min.js",
        "/scripts/vendor/css_browser_selector.min.js"],

        function($, chat, fileupload) {
  
          $(document).ready(function() {
            // Close the username modal when user hits enter
            $('#username').keypress(function(e) {
              if (e.which == 13) {
                e.preventDefault();
                $('#loginModal').modal('hide');
                // Fade the sidebar after some time
                setTimeout(function() {
                  $('#sidebar').fadeTo(4000, 0.3);
                  $('#sidebar p').mouseover(function() {
                    $('#sidebar').fadeTo('fast', 1.0);
                  });
                }, 10000);
                return false;
              }
            });

            // Maximize message area
            var resizeChatArea = function() {
              var viewportHeight = $('body').height();
              var height = viewportHeight - 180;
              $('#messages').height(height + 'px');
              $('#messages').scrollTop(999999);
            }
            resizeChatArea();
            $(window).resize(resizeChatArea);

            // start the chat when the username modal closes
            $('#username').focus();
            $('#loginModal').modal();
            $('#loginModal').on('hide', function () {
              var chatSocket = chat.start($('#username').val());
              chat.handleInput(chatSocket, $('#input'));
              chat.handleOutput(chatSocket, $('#messages'));
            });

            // initialize the drag&drop file upload
            fileupload.initialize({
              dropElement: $('#filedroparea'),
              targetUrl: '/upload',

              dragEnterCallback: function() {
                $('#messages').addClass('filehover');
              },

              dragLeaveCallback: function() {
                $('#messages').removeClass('filehover');
              },

              beforeEachCallback: function() {
                $('#uploadprogressarea').fadeIn();
                $('#messages').removeClass('filehover');
              },

              uploadStartedCallback: function(i, file, len) {

              },

              progressUpdatedCallback: function(i, file, progress) {
              },

              uploadFinishedCallback: function(i, file, response){
                $('#uploadprogressarea').fadeOut('slow');
              },

              errorCallback: function(message) {
                $('#uploadprogressarea').hide();
                $('#messages').removeClass('filehover');
                window.alert(message);
              }
            });
          });
        }

);
