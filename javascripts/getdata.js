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
  	if (quizType == 'quiz') {
      $('#quiz-template').attr('href', 'https://drive.google.com/previewtemplate?id=0AlMgrVuuAI0MdGl6NngwMGYtX3RHQjlic0xzNnBjUGc&mode=public').addClass('template');
      $('#example-spreadsheet').val('https://docs.google.com/spreadsheet/pub?key=0AlMgrVuuAI0MdGl6NngwMGYtX3RHQjlic0xzNnBjUGc&output=html');
    } else if (quizType == 'flowchart') {
      $('#quiz-template').attr('href', 'https://drive.google.com/previewtemplate?id=0AlMgrVuuAI0MdE9ZNVhnYmk0TUdidGhiZTgwT0F6MGc&mode=public').addClass('template');
      $('#example-spreadsheet').val('https://docs.google.com/spreadsheet/pub?key=0ArcRX35HpjojdGlSR012UjVDZkpIM19ObVY5TE03U2c&output=html');
    } else {
      $('#quiz-template').attr('href', 'https://drive.google.com/previewtemplate?id=0AlMgrVuuAI0MdFlNdHlNay1ibnNSWU93TThTS1VuSVE&mode=public').addClass('template');
      $('#example-spreadsheet').val('https://docs.google.com/spreadsheets/d/1UIiEZwiwsOAZ7jTZ8xzJJj35Y55Mg6TCcVR4qM_A1rg/pubhtml');
    }
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
    pubStylesheet = cdn+"stylesheets/quiz-" + pub + ".css";
    cdn = $('input#cdn').val();
    twitteraccount = $('input#twitter').val().substring(1);
  }

  function embed(input) {
    pubStylesheet = cdn+"stylesheets/quiz-" + pub + ".css";
    twitteraccount2 = (($('input#twitter').val().substring(1) !=="") ? "var twitteraccount = \"" + twitteraccount + "\"" : "var twitteraccount = \"\"");
    embedcode = "&lt;div class='quiz-container'></div>&lt;script src='https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'>&lt;/script>&lt;script type='text/javascript'>var input = " + JSON.stringify(input) + "; var pubStylesheet = '" + pubStylesheet + "'; var pub = '" + pub + "'; var cdn = '" + cdn + "'; " + twitteraccount2 + "; &lt;/script>&lt;script src='"+cdn+"javascripts/" + quizType + ".js'>&lt;/script>";
    $("#embedcode").html(embedcode)
    downloadHTML(input)
    addJS();
  }

  function downloadHTML(input) {
    cdn = "";
    pubStylesheet = cdn+"stylesheets/quiz-" + pub + ".css";
    twitteraccount2 = (($('input#twitter').val().substring(1) !=="") ? "\nvar twitteraccount = \"" + twitteraccount + "\"" : "var twitteraccount = \"\"");
     downloadcode = "<html>\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n</head>\n<body id=\"articleBody\">\n<div class='quiz-container'></div>\n<script src='//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>\n<script type='text/javascript'>\nvar input = " + JSON.stringify(input) + ";\nvar pubStylesheet = '" + pubStylesheet + "';\nvar pub = '" + pub + "';\nvar cdn = '" + cdn + "'; " + twitteraccount2 + ";\n</script>\n<script src='"+cdn+"javascripts/" + quizType + ".js'></script>\n</body>\n</html>";
     var stylesheet = "";

    // console.log(downloadcode)
    var zip = new JSZip();
    zip.file("index.html", downloadcode);

    if(quizType == "flowchart"){
            typeStylesheet = "flowchart"
        }
        else{
         typeStylesheet = "quiz"
        }


    $.when(
        // Get the stylesheet
        $.get(cdn+"stylesheets/"+typeStylesheet+".css", function(css) {
          zip.file("stylesheets/" + typeStylesheet + ".css",css)
        }),
        $.get(pubStylesheet, function(css) {
          zip.file("stylesheets/quiz-" + pub + ".css",css)
        }),

        // Get the JS
        $.get(cdn+"javascripts/" + quizType + ".js", function(js) {
          zip.file("javascripts/" + quizType + ".js",js)
        }),
        $.get(cdn+"javascripts/getdata.js", function(js) {
          zip.file("javascripts/getdata.js",js)
        }),
        $.get(cdn+"javascripts/tabletop.js", function(js) {
          zip.file("javascripts/tabletop.js",js)
        }),
        $.get(cdn+"javascripts/jszip.min.js", function(js) {
          zip.file("javascripts/jszip.min.js",js)
        }),
        $.get(cdn+"javascripts/FileSaver.min.js", function(js) {
          zip.file("javascripts/FileSaver.min.js",js)
        }),
        $.get(cdn+"javascripts/jquery.min.js", function(js) {
          zip.file("javascripts/jquery.min.js",js)
        })
      ).then(function() {
           $("#downloadhtml").removeAttr("disabled")
          var content = zip.generate({type:"blob"});
         
          $("#downloadhtml").click(function(){
             saveAs(content, "quiz.zip");
        
          });
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
    $('input:radio[name=quiz-type]').click(function() {
      quizType = $('input:radio[name=quiz-type]:checked').val();
      changeTemplate();
    });

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