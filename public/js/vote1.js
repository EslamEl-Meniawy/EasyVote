var yescount, nocount;
var yesperc, noperc;
var yesheight, noheight;
getCounts();
$(".clickyes").on("click", function() {
	setHits("div.id1");
	getCounts();
});
$(".clickno").on("click", function() {
	setHits("div.id2");
	getCounts();
});
function getHits(divtoget, callback) {
	$.ajax({
		type : 'GET',
		url : '/getvotestatistics/' + $(divtoget).text()
	}).done(function(response) {
		callback(parseInt(response.hits, 10));
	});
}
function setHits(divtopost) {
	var userData = {
		"age": 23,
		"answerref": "answers",
		"answerid": $(divtopost).text(),
		"ip": "192.168.1.500",
		"job": "Enginner",
		"questionref": "questions",
		"questionid": $(location).attr('pathname').replace("/", ""),
		"sex": "male",
		"userid": 5,
		"username": "eslam"
	};
	$.ajax({
		type : 'POST',
		data : userData,
		url : '/setvotestatistics/' + $(divtopost).text(),
		dataType : 'JSON'
	}).done(function(response) {
		if(response !== 1) {
			alert("Error");
		}
	});
}
function getCounts() {
	getHits("div.id1", function(result) {
		yescount = result;
		getHits("div.id2", function(result) {
			nocount = result;
			setVariables();
		});
	});
}
function setVariables() {
	var total = yescount + nocount;
	if(total === 0) {
		yesperc = 0;
		noperc = 0;
	} else {
		yesperc = (yescount / total) * 100;
		yesperc = Math.round(yesperc * 100) / 100;
		noperc = (nocount / total) * 100;
		noperc = Math.round(noperc * 100) / 100;
	}
	yesheight = (yesperc / 100) * 200;
	noheight = noheight = (noperc / 100) * 200;
	$(".textyes").text(yesperc + "%");
	if(yesheight > 1) {
	    $(".textyes").css("line-height", yesheight + "px");
	}
	$(".coloryes").css("height", yesheight + "px");
	$(".textno").text(noperc + "%");
	if(noheight > 1) {
	    $(".textno").css("line-height", noheight + "px");
	}
	$(".colorno").css("height", noheight + "px");
	$(".countyes").text(yescount);
	$(".countno").text(nocount);
}