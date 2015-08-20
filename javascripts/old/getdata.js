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
  var key, pub, quizType;

  // initialize tabletop library
  function init() {
  		Tabletop.init( { key: url,
                     callback: readData,
                     simpleSheet: true } );
  	}

  function readData(data, tabletop) {
  	input = [];
  	for ( var i = 0; i < data.length; i++ ) {
  		input[i] = findUrlinObject( data[i] );
  	}
  	embed(input);
  }

  function findUrlinObject ( data ) {
  	$.each( data, function( key, value ){
  		if ( key == 'correct' || key == 'incorrect' || key == 'text') {
  			data[key] = converttoHex( data[key] );
  		}
  	} );
  	return data;
  }

  function converttoHex ( string ) {
  	var hex, i;
  	var result = "";
  	for ( i = 0; i < string.length; i++ ) {
  		hex = string.charCodeAt( i ).toString( 16 );
  		result += ( "000" + hex ).slice( -4 );
  	}
  	return result;
  }

  function addJS() {
  	quizType = $('input[name="quiz-type"]:checked').val();
		if (quizType == 'quiz') {
			$('body').append('<script src="javascripts/quiz.js" type="text/javascript"><\/script>');
		} else if (quizType == 'flowchart') {
			$('body').append('<script src="javascripts/flowchart.js" type="text/javascript"><\/script>');
		} else {
      $('body').append('<script src="javascripts/binary.js" type="text/javascript"><\/script>');
    }
  }

  function changeTemplate() {
    var quizTypeLabel ={
      "quiz":"QCM",
      "flowchart":"flowchart",
      "binary":"vrai/faux"
    }

  	if (quizType == 'quiz') { // QCM
      $('#quiz-template').attr('href', 'https://drive.google.com/previewtemplate?id=1r5l6eNaJiOht8oYiAAR26XUoBcnB1y4kLKUbQ1Ld2tA&mode=public').addClass('template');
      $('#example-spreadsheet').val('https://docs.google.com/spreadsheets/d/1r5l6eNaJiOht8oYiAAR26XUoBcnB1y4kLKUbQ1Ld2tA/pubhtml');
    } else if (quizType == 'flowchart') { // Flowchart
      $('#quiz-template').attr('href', 'https://drive.google.com/previewtemplate?id=1b6S21syewzwAbpVcncVZSrs-MJ4UkQx0cn8L3JY-rWk&mode=public').addClass('template');
      $('#example-spreadsheet').val('https://docs.google.com/spreadsheets/d/1b6S21syewzwAbpVcncVZSrs-MJ4UkQx0cn8L3JY-rWk/pubhtml');
    } else { // Vrai-faux
      $('#quiz-template').attr('href', 'https://drive.google.com/previewtemplate?id=0AlMgrVuuAI0MdFlNdHlNay1ibnNSWU93TThTS1VuSVE&mode=public').addClass('template');
      $('#example-spreadsheet').val('https://docs.google.com/spreadsheets/d/1nFODc_D-ynfglSvU9qdwKfy44HVU3oeqmsodTsx-qds/pubhtml');
    }
    $('#adresse_exemple span').html("du "+quizTypeLabel[quizType]);
  }

  function submitquiz() {
  	quizType = $('input[name="quiz-type"]:checked').val();
  	if (quizType == 'quiz') {
  		$('.quiz-container').empty();
  		buildquiz();
  	} else {
  		$('.quiz-container').empty();
  		buildflowchart();
  	}
  }

  function getStylesheet() {
  	pub = $('input[name="pub"]:checked').val();
    $('body').append('<script type="text/javascript">var pub ="' + pub + '"</script>');
    pubStylesheet = "quiz-" + pub + ".css";
    cdn = $('input#cdn').val();
  }

  function embed(input) {
    embedcode = "&lt;div class='quiz-container'></div>&lt;script src='//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'>&lt;/script>&lt;script type='text/javascript'>var input = " + JSON.stringify(input) + "; var pubStylesheet = '" + pubStylesheet + "'; var pub = '" + pub + "'; var cdn = '" + cdn + "'; &lt;/script>&lt;script src='"+cdn+"javascripts/" + quizType + ".js'>&lt;/script>";
    $("#embedcode").html(embedcode)
   
    downloadHTML(input)
    addJS();

  }

  function downloadHTML(input) {
     downloadcode = "<html>\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<link rel=\"stylesheet\" href=\"//s1.lemde.fr/medias/web/css/normalize.css\">\n<link rel=\"stylesheet\" href=\"//s1.lemde.fr/medias/web/css/grille.css\">\n<link rel=\"stylesheet\" href=\"//s1.lemde.fr/medias/web/css/base.css\">\n<link rel=\"stylesheet\" href=\"//s1.lemde.fr/medias/web/css/fonts.css\">\n<link rel=\"stylesheet\" href=\"//s1.lemde.fr/medias/web/css/couleurs.css\">\n<link rel=\"stylesheet\" href=\"//s1.lemde.fr/medias/web/css/article.css\">\n</head>\n<body id=\"articleBody\">\n<div class='quiz-container'></div>\n<script src='//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>\n<script type='text/javascript'>\nvar input = " + JSON.stringify(input) + ";\nvar pubStylesheet = '" + pubStylesheet + "';\nvar pub = '" + pub + "';\nvar cdn = '" + cdn + "';\n</script>\n<script src='"+cdn+"javascripts/" + quizType + ".js'></script>\n</body>\n</html>";
    var zip = new JSZip();
    zip.file("index.html", downloadcode);
    var content = zip.generate({type:"blob"});
    $("#downloadhtml").removeAttr("disabled")
    $("#downloadhtml").click(function(){
       saveAs(content, "quiz.zip");
    })
   
    
  }

  function buildquiz(){
    url = $('#url').val();
    init();
    getStylesheet();
  }

  function buildflowchart() {
    url = $('#url').val();
    init();
    getStylesheet();
  }

  $(document).ready(function() {
    quizSelector();
    $('input:radio[name=quiz-type]').click(function(){ quizSelector() })

    function quizSelector() {
      quizType = $('input:radio[name=quiz-type]:checked').val();
      changeTemplate();
    };

    $('#build').on('click', function(){
        if (quizType != undefined) {
          submitquiz();
        }
        else {
          alert("Choisissez un type de quiz en haut de la page !");
        }
    })
  })  
})(jQuery);
