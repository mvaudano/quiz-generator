/*
Based on Vox Media's Quiz Quartet (https://github.com/voxmedia/quiz-generator)

Copyright (c) 2014 Vox Media Inc., KK Rebecca Lai, Nicole Zhu, Adam Baumgartner

BSD license

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


(function ($) {
  // make sure to attach json object 'var input' with quiz data

  //variables
  var reponse,
      qnumber,
      score = 0,
      currentQuestion = 0;

  // social media icons
  var facebook = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' style='height: 2.4em;'><circle cx='8' cy='8' r='8' class='shape-1'></circle><path fill='#fff' d='M8.5 3.7h1.4v1.6h-1c-.2 0-.4.1-.4.4v.9h1.4l-.1 1.7h-1.3v4.5h-1.9v-4.5h-.9v-1.7h.9v-1c0-.7.4-1.9 1.9-1.9z' class='shape-2'></path><foreignObject width='200' height='100'><text><tspan style='color:#414141; margin-right: 20px; margin-left: 15px;''>Facebook</tspan></text></foreignObject></svg>";
  var twitter = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' style='height: 2.4em;'><circle cx='8' cy='8' r='8' class='shape-1'></circle><path fill='#fff' d='M4 4.8c1 1.2 2.5 2 4.2 2.1l-.1-.4c0-1.1.9-2 2-2 .6 0 1.1.3 1.5.6.5-.1.9-.3 1.3-.5-.2.4-.5.8-.9 1.1l1.2-.3c-.3.4-.6.8-1 1.1v.3c0 2.7-2 5.8-5.8 5.8-1.1 0-2.2-.3-3.1-.9h.5c.9 0 1.8-.3 2.5-.9-.9 0-1.6-.6-1.9-1.4h.4c.2 0 .4 0 .5-.1-.9-.2-1.6-1-1.6-2 .3.2.6.2.9.3-.6-.5-.9-1.1-.9-1.8 0-.4.1-.7.3-1z' class='shape-2'></path><foreignObject width='200' height='100'><text><tspan style='color:#414141; margin-right: 20px;''>Twitter</tspan></text></foreignObject></svg>";
  var google = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' style='height: 2.4em;'><circle cx='8' cy='8' r='8' class='shape-1'></circle><path fill='#fff' d='M8.6 4.3l.6-.4c.1-.1.1-.1.1-.2s-.1-.1-.2-.1h-2.7c-.3 0-.6.1-.9.2-1 .3-1.6 1.1-1.6 2 0 1.2.9 2.1 2.2 2.1-.1 0-.1.1-.1.2 0 .2 0 .4.1.5-1.1 0-2.2.6-2.6 1.4-.1.2-.2.4-.2.7 0 .2.1.4.2.6.3.5.8.8 1.5 1 .4.1.8.1 1.2.1.4 0 .7 0 1.1-.1 1-.3 1.7-1.1 1.7-2 0-.8-.2-1.3-1-1.8-.3-.2-.6-.6-.6-.7 0-.2 0-.3.4-.6.5-.4.8-1 .8-1.5s-.2-1-.4-1.3h.2c.1 0 .1 0 .2-.1zm-3.3 1.3c-.1-.4 0-.8.3-1.1.1-.2.3-.2.5-.2.6 0 1.1.7 1.2 1.4.1.4 0 .8-.3 1.1-.1.2-.3.3-.5.3-.6 0-1.1-.7-1.2-1.5zm2.6 4.6v.2c0 .8-.6 1.2-1.7 1.2-.9 0-1.5-.5-1.5-1.2 0-.6.8-1.2 1.7-1.2.2 0 .4 0 .6.1l.2.1c.4.4.7.5.7.8z' class='shape-2'></path><path fill='#fff' d='M13.3 7.8c0 .1-.1.2-.2.2h-1.5v1.5c0 .1-.1.2-.2.2h-.4c-.1 0-.2-.1-.2-.2v-1.5h-1.6c-.1 0-.2-.1-.2-.2v-.4c0-.1.1-.2.2-.2h1.5v-1.5c0-.1.1-.2.2-.2h.4c.1 0 .2.1.2.2v1.5h1.5c.1 0 .2.1.2.2v.4z' class='shape-3'></path><foreignObject width='200' height='100'><text><tspan style='color:#414141; margin-right: 20px;''>Google+</tspan></text></foreignObject></svg>";

  // twitter links
  var account;
  var lemonde = "lemondefr"
  

  var pageScroll = function(target) {
    $('html,body').animate({
       scrollTop: $(target).offset().top - 30
    }, 1000);
  };

  // write questions and reponses on html
  var buildQuiz = function (input) {
    if (currentQuestion != 0) {
      pageScroll('.quiz-container');
    }
    qnumber = currentQuestion + 1;
    $(".quiz-container").html("<div class='progress'>Question " + qnumber + "&nbsp;sur&nbsp;" + input.length + "</div><div class='qq-question'>"+((input[currentQuestion].description !== "") ? ("<div class='qq-description'>"+input[currentQuestion].description+"</div>") : "")+"<div class='question'>" + input[currentQuestion].question + "</div></div>" +
      "<ol class='reponses'><li id='option-a'>" + input[currentQuestion].a + "</li>" +
      "<li id='option-d'>" + input[currentQuestion].b + "</li></ol>" +
      "<button class='qq-button btn indice'>Besoin d'un indice ?</button>" +
      "<button class='qq-button btn submit-reponse' disabled='disabled'>OK</button>" +
      "<div class='reponse'></div>");
    selectAnswer();
    $('.indice').on('click', showHint);
    $('.submit-reponse').on('click', checkAnswer);
    trackEvent('q' + qnumber + '-displayed', 'Q' + qnumber + ' displayed');
  }

  // shows (1) out of (3) questinos
  var displayProgress = function () {
    $('.progress').html("<div class='progress'>Question " + qnumber + "&nbsp;sur&nbsp;" + input.length + "</div>");
  }

  // style changes when user selects reponses
  var selectAnswer = function () {
    $("li").click(function() {
      $(".submit-reponse").prop("disabled",false)
      trackEvent(
        'q' + qnumber + '-selected-' + this.id,
        'Q' + qnumber + ' selected ' + this.id);
      $(".selected").removeClass("selected");
      $(this).addClass("selected");
      $(".submit-reponse").addClass("submit-highlight").fadeIn();
    });
  }

  // show indice
  var showHint = function () {
    trackEvent(
      'q' + qnumber + '-indice-showed',
      'Q' + qnumber + ' indice showed');
    $(".reponse").html(input[currentQuestion].indice);
  }

  // check reponse by comparing selected html and correct reponse from input
  var checkAnswer = function () {
    if ($(".selected").length > 0) {
      $('li').off('click');
      $(".indice").off('click');
      reponse = $(".selected").html();
      if (reponse == input[currentQuestion].bonnereponse) {
        trackEvent(
          'q' + qnumber + '-reponseed-correctly',
          'Q' + qnumber + ' reponseed correctly');
        score++;
        displayProgress();
        $(".reponse").html("<p>Bonne réponse !</p><p>" + input[currentQuestion].correct + "</p>");

      } else {
        trackEvent(
          'q' + qnumber + '-reponseed-incorrectly',
          'Q' + qnumber + ' reponseed incorrectly');
        $(".reponse").html("<p>Désolé, mauvaise réponse !</p><p>La bonne r&eacute;ponse &eacute;tait : <span class=\"bonnereponse\">" + input[currentQuestion].bonnereponse + "</span>.</p><p> " + input[currentQuestion].incorrect + "</p>");
      }
      if (currentQuestion != (input.length-1)) {
        $(".reponse").append("<button class='qq-button btn next'>Suivant</button>");
        $('.next').on('click', nextQuestion);
      } else {
        $(".reponse").append("<button class='qq-button btn_fonce btn_grand check-score'>Voir le score final</button>");
        $('.check-score').on('click', finalScore);
      }
    }
  }

  // increment question count and built new question and reponses
  var nextQuestion = function () {
    trackEvent(
      'q' + qnumber + '-next',
      'Q' + qnumber + ' clicked to next question');
    currentQuestion++;
    buildQuiz(input);
  }

  function trackEvent(action, label) {
    if( typeof(ga) != 'undefined' ) {
      ga('send', 'event', 'quiz', action, label);
    } else if (typeof(_gaq) != 'undefined' ){
      _gaq.push($.merge(['_trackEvent', 'quiz'], arguments));
    }
  }

  // display final score card and social media sharing
  var link = document.URL
  var finalScore = function () {
    trackEvent(
      'scored-' + score + '-sur-' + input.length,
      'Scored ' + score + ' sur ' + input.length);
    trackEvent('completed', 'Quiz terminé');
    switch (pub) {
      case 'lemonde':
        account = lemonde;
        break;
      default:
        account = 'lemondefr';
    }

    $(".quiz-container")
      .html("<div class='scorecard'><p>Vous avez correctement r&eacute;pondu &agrave;</p><p class=\"tt3_capital\">" + score + "&nbsp;r&eacute;ponse"+(score > 1 ? "s" : "")+ " sur&nbsp;" + input.length + "</p><p class=\"defiez\">D&eacute;fiez vos amis !</p><div id='social-media'><ul><li><a class=\"fb-share\" href='http://www.facebook.com/sharer.php?u=" + link + "' target='_blank'>" + facebook + "</a></li><li><a class=\"twitter-share\" href='http://twitter.com/home?status=J%27ai obtenu le score de " + score + "/" + input.length + " sur ce quiz du Monde " + link + " via @" + account + "' target='_blank'>" + twitter   + "</a></li><li><a class=\"gplus-share\" href='https://plus.google.com/share?url=" + link + "' target='_blank'>" + google + "</a></li></ul></div></div>");
     $('.quiz-container .fb-share').click(function() {
      trackEvent('shared-on-fb', 'Quiz partag&eacute; sur Facebook');
    });
    $('.quiz-container .twitter-share').click(function() {
      trackEvent('shared-on-twitter', 'Quiz partag&eacute; sur Twitter');
    });
    $('.quiz-container .gplus-share').click(function() {
      trackEvent('shared-on-gplus', 'Quiz partag&eacute; sur Google+');
    });
  }

  // attach quiz and vertical-specific stylesheets
  $('head').append('<link rel="stylesheet" href="'+cdn+'stylesheets/quiz.css" type="text/css" />');
  //$('head').append('<link rel="stylesheet" href="stylesheets/quiz.css" type="text/css" />');
  $('head').append('<link rel="stylesheet" href="'+cdn+'stylesheets/' + pubStylesheet + '" type="text/css" />');

  function unpackQuizHack() {
    var newInput = [];
    for ( var i = 0; i < input.length; i++ ) {
      newInput[i] = convertUrlinJson( input[i] );
    }
    input = newInput;
    buildQuiz(input);
  }

  function convertUrlinJson( data ) {
    $.each( data, function( key, value ) {
      if ( key == 'correct' || key == 'incorrect' ) {
        var j;
        var hexes = data[key].match(/.{1,4}/g) || [];
        var back = "";
        for( j = 0; j<hexes.length; j++ ) {
          back += String.fromCharCode( parseInt( hexes[j], 16 ) );
        }
        data[key] = back;
      }
    } );
    return data;
  }

  $(document).ready(function () {
    trackEvent('loaded', 'Quiz chargé');
    unpackQuizHack();
  });
})(jQuery);
