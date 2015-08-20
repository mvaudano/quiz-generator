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
    console.log(input);
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
    embedcode = "&lt;div class='quiz-container'></div>&lt;script src='//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'>&lt;/script>&lt;script type='text/javascript'>var input = " + JSON.stringify(input) + "; var pubStylesheet = '" + pubStylesheet + "'; var pub = '" + pub + "'; var cdn = '" + cdn + "'; var twitteracount = '" + $('input#twitter').val().substring(1) + "'; &lt;/script>&lt;script src='"+cdn+"javascripts/" + quizType + ".js'>&lt;/script>";
    $("#embedcode").html(embedcode)
    downloadHTML(input)
    addJS();
  }

  function downloadHTML(input) {
     downloadcode = "<html>\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n</head>\n<body id=\"articleBody\">\n<div class='quiz-container'></div>\n<script src='//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>\n<script type='text/javascript'>\nvar input = " + JSON.stringify(input) + ";\nvar pubStylesheet = '" + pubStylesheet + "';\nvar pub = '" + pub + "';\nvar cdn = '" + cdn + "';\n</script>\n<script src='"+cdn+"javascripts/" + quizType + ".js'></script>\n</body>\n</html>";
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
    $('input:radio[name=quiz-type]').click(function() {
      quizType = $('input:radio[name=quiz-type]:checked').val();
      changeTemplate();
    });

    $('#build').on('click', function(){
        if (quizType != undefined) {
          submitquiz();
        }
        else {
          alert("Please choose a quiz type at the top of the page!");
        }
    })
  })  
})(jQuery);