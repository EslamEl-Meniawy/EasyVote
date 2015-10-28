var n = (parseInt($("div.n").text(), 10)) - 1;
var counts = [];
var percs = [];
getCounts();
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
	loop(n);
}
function setVariables() {
	for(var i = 0;i <= n;i++) {
		var bar = ".bar" + i;
        var count = ".count" + i;
        var perc = ".perc" + i;
        var total = 0;
        for(var j = 0;j <= n;j++) {
            total = total + counts[j];
        }
        if(total === 0) {
        	percs[i] = 0;
        } else {
        	percs[i] = (counts[i] / total) * 100;
        	percs[i] = Math.round(percs[i] * 100) / 100;
        }
        $(bar).css("width", percs[i] + "%");
        $(count).text(counts[i]);
        $(perc).text(percs[i] + "%");
	}
}
function votingClick(index) {
	setHits("div.id" + index);
	getCounts();
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