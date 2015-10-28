var ans1count, ans2count, ans3count;
var ans1perc, ans2perc, ans3perc;
var ans1height, ans2height, ans3height;
getCounts();
$(".image1").on("click", function() {
	setHits("div.id1");
	getCounts();
});
$(".image2").on("click", function() {
	setHits("div.id2");
	getCounts();
});
$(".image3").on("click", function() {
	setHits("div.id3");
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
		ans1count = result;
		getHits("div.id2", function(result) {
			ans2count = result;
			getHits("div.id3", function(result) {
				ans3count = result;
				setVariables();
			});
		});
	});
}
function setVariables() {
	var total = ans1count + ans2count + ans3count;
	if(total === 0) {
		ans1perc = 0;
		ans2perc = 0;
		ans3perc = 0;
	} else {
		ans1perc = (ans1count / total) * 100;
    	ans1perc = Math.round(ans1perc * 100) / 100;
    	ans2perc = (ans2count / total) * 100;
    	ans2perc = Math.round(ans2perc * 100) / 100;
    	ans3perc = (ans3count / total) * 100;
    	ans3perc = Math.round(ans3perc * 100) / 100;
	}
    ans1height = (ans1perc / 100) * 200;
    $(".bar1").css("height", ans1height + "px");
    ans2height = (ans2perc / 100) * 200;
    $(".bar2").css("height", ans2height + "px");
    ans3height = (ans3perc / 100) * 200;
    $(".bar3").css("height", ans3height + "px");
}