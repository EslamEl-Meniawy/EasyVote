var n = (parseInt($("div.n").text(), 10)) - 1;
for(var i = 0;i <= n;i++) {
	$("#ans" + i).prop('checked', false);
}
var counts = [];
$(".buttonvote").on("click", function() {
	for(var i = 0;i <= n;i++) {
		var check = "#ans" + i;
		if($(check).is(':checked')) {
			setHits("div.id" + i, i);
		}
	}
	if(!(($(".results").html() == null) || ($(".results").html() == ''))) {
		getCounts();
	}
});
$(".buttonresults").on("click", function() {
	getCounts();
});
function setHits(divtopost, index) {
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
		} else {
			$("#ans" + index).prop('checked', false);
		}
	});
}
function getCounts() {
	loop(n);
}
function loop(index) {
	getHits("div.id" + index, function(result) {
		counts[index] = result;
		if(index-- === 0) {
			setVariables();
		} else {
			loop(index--);
		}
	});
}
function getHits(divtoget, callback) {
	$.ajax({
		type : 'GET',
		url : '/getvotestatistics/' + $(divtoget).text()
	}).done(function(response) {
		callback(parseInt(response.hits, 10));
	});
}
function setVariables() {
	var text = '';
	for(var i = 0;i <= n;i++) {
		var label = ".label" + i;
		text += $(label).text() + ' ' + counts[i] + ' votes.<br />';
	}
	$(".results").html(text);
}