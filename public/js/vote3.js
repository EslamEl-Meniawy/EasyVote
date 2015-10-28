var yescount, nocount;
getCounts();
$(".yes").on("click", function() {
	setHits("div.id1");
	getCounts();
});
$(".no").on("click", function() {
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
	$(".countyes").text(yescount);
	$(".countno").text(nocount);
}