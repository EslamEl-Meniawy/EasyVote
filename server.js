var fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
var mongo = require("mongodb");
var dbHost = config.dbHost;
var dbPort = mongo.Connection.DEFAULT_PORT;
var BSON = mongo.BSONPure;
var db = new mongo.Db("easyvote", new mongo.Server(dbHost, dbPort, {}));
var express = require("express"), http = require('http');
var bodyParser = require('body-parser');
var app = express();
var server = http.createServer(app);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.get("/:id", function(request, response) {
	response.setHeader("Content-Type", "text/html");
	var id = request.params.id;
	console.log("ID: " + id);
	if(id.length == 24) {
		var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
		if(checkForHexRegExp.test(id)) {
			getQuestions(id, function(questions) {
				var content;
				if(questions.length > 0) {
				    var qtitle = questions[0].title;
				    var qlayout = questions[0].layout;
				    if(qlayout === 1) {
				    	content = fs.readFileSync("./templates/vote1.html");
				    	content = content.toString("utf8");
				    	content = content.replace("{{question}}", qtitle);
				    	getAnswers(id, function(answers) {
				    		if(answers.length > 0) {
				    			if(answers.length === 2) {
					    			content = content.replace("{{answer1}}", answers[0].title);
					    			content = content.replace("{{answer2}}", answers[1].title);
					    			content = content.replace("{{src1}}", 'src="' + answers[0].media + '"');
					    			content = content.replace("{{src2}}", 'src="' + answers[1].media + '"');
					    			content = content.replace("{{cy}}", 'style="background: ' + answers[0].color + ';"');
					    			content = content.replace("{{cn}}", 'style="background: ' + answers[1].color + ';"');
					    			content = content.replace("{{id1}}", answers[0]._id);
					    			content = content.replace("{{id2}}", answers[1]._id);
								   	response.send(content);
								} else {
									response.send("<h1>Wrong number of answers for that question :(</h1>");
								} 
							} else {
								response.send("<h1>No answers found for that ID :(</h1>");
							}
				    	});
				    } else if(qlayout === 2) {
				    	var contenth = fs.readFileSync("./templates/vote2head.html");
				    	contenth = contenth.toString("utf8");
				    	contenth = contenth.replace("{{question}}", qtitle);
				    	content = contenth;
				    	getAnswers(id, function(answers) {
				    		if(answers.length > 0) {
				    			var n = 0;
				    			answers.forEach(function(answer) {
				    				var contenta = fs.readFileSync("./templates/vote2answer.html");
				    				contenta = contenta.toString("utf8");
				    				contenta = contenta.replace("{{answer}}", answer.title);
				    				contenta = contenta.replace("{{src}}", 'src="' + answer.media + '"');
				    				contenta = contenta.replace("{{back}}", 'style="background: ' + answer.color + ';"');
				    				contenta = contenta.replace("{{color}}", 'style="color: ' + answer.color + ';"');
				    				contenta = contenta.replace("{{id}}", answer._id);
				    				contenta = contenta.replace(/{{n}}/g, n);
				    				content += contenta;
				    				n++;
				    			});
				    			var contentt = fs.readFileSync("./templates/vote2tail.html");
				    			contentt = contentt.toString("utf8");
				    			contentt = contentt.replace("{{n}}", n);
				    			content += contentt;
				    			response.send(content);
				    		} else {
				    			response.send("<h1>No answers found for that ID :(</h1>");
				    		}
				    	});
				    } else if(qlayout === 3) {
				    	content = fs.readFileSync("./templates/vote3.html");
				    	content = content.toString("utf8");
				    	content = content.replace("{{question}}", qtitle);
				    	content = content.replace("{{src}}", 'src="' + questions[0].media + '"');
				    	getAnswers(id, function(answers) {
				    		if(answers.length > 0) {
				    			if(answers.length === 2) {
				    				content = content.replace("{{yes}}", answers[0].title);
					    			content = content.replace("{{no}}", answers[1].title);
					    			content = content.replace("{{id1}}", answers[0]._id);
					    			content = content.replace("{{id2}}", answers[1]._id);
					    			response.send(content);
				    			} else {
				    				response.send("<h1>Wrong number of answers for that question :(</h1>");
				    			}
				    		} else {
				    			response.send("<h1>No answers found for that ID :(</h1>");
				    		}
				    	});
				    } else if(qlayout === 4) {
				    	var contenth = fs.readFileSync("./templates/vote4head.html");
				    	contenth = contenth.toString("utf8");
				    	contenth = contenth.replace("{{question}}", qtitle);
				    	content = contenth;
				    	getAnswers(id, function(answers) {
				    		if(answers.length > 0) {
				    			var n = 0;
				    			answers.forEach(function(answer) {
				    				var contenta = fs.readFileSync("./templates/vote4answer.html");
				    				contenta = contenta.toString("utf8");
				    				contenta = contenta.replace("{{answer}}", answer.title);
				    				contenta = contenta.replace("{{src}}", 'src="' + answer.media + '"');
				    				contenta = contenta.replace("{{id}}", answer._id);
				    				contenta = contenta.replace(/{{color}}/g, 'style="color: ' + answer.color + ';"');
				    				contenta = contenta.replace(/{{n}}/g, n);
				    				content += contenta;
				    				n++;
				    			});
				    			var contentt = fs.readFileSync("./templates/vote4tail.html");
				    			contentt = contentt.toString("utf8");
				    			contentt = contentt.replace("{{n}}", n);
				    			content += contentt;
				    			response.send(content);
				    		} else {
				    			response.send("<h1>No answers found for that ID :(</h1>");
				    		}
				    	});
				    } else if(qlayout === 5) {
				    	var contenth = fs.readFileSync("./templates/vote5head.html");
				    	contenth = contenth.toString("utf8");
				    	contenth = contenth.replace("{{question}}", qtitle);
				    	content = contenth;
				    	getAnswers(id, function(answers) {
				    		if(answers.length > 0) {
				    			var n = 0;
				    			answers.forEach(function(answer) {
				    				var contenta = fs.readFileSync("./templates/vote5answer.html");
				    				contenta = contenta.toString("utf8");
				    				contenta = contenta.replace("{{answer}}", answer.title);
				    				contenta = contenta.replace("{{id}}", answer._id);
				    				contenta = contenta.replace(/{{n}}/g, n);
				    				content += contenta;
				    				n++;
				    			});
				    			var contentt = fs.readFileSync("./templates/vote5tail.html");
				    			contentt = contentt.toString("utf8");
				    			contentt = contentt.replace("{{n}}", n);
				    			content += contentt;
				    			response.send(content);
				    		} else {
				    			response.send("<h1>No answers found for that ID :(</h1>");
				    		}
				    	});
				    } else if(qlayout === 6) {
				    	content = fs.readFileSync("./templates/vote6.html");
				    	content = content.toString("utf8");
				    	content = content.replace("{{question}}", qtitle);
				    	getAnswers(id, function(answers) {
				    		if(answers.length > 0) {
				    			if(answers.length === 3) {
					    			content = content.replace("{{src1}}", 'src="' + answers[0].media + '"');
					    			content = content.replace("{{src2}}", 'src="' + answers[1].media + '"');
					    			content = content.replace("{{src3}}", 'src="' + answers[2].media + '"');
					    			content = content.replace("{{id1}}", answers[0]._id);
					    			content = content.replace("{{id2}}", answers[1]._id);
					    			content = content.replace("{{id3}}", answers[2]._id);
								   	response.send(content);
								} else {
									response.send("<h1>Wrong number of answers for that question :(</h1>");
								}
				    		} else {
				    			response.send("<h1>No answers found for that ID :(</h1>");
				    		}
				    	});
				    } else {
				    	response.send("<h1>No or wrong layout for that ID :(</h1>");
				    }
			    } else {
			    	response.send("<h1>No questions found for that ID :(</h1>");
			    }
		    });
		} else {
			response.send("<h1>The ID contains non hex characters :(</h1>");
		}
	} else {
		response.send("<h1>The ID is not 24 hex characters :(</h1>");
	}
});
app.get("/getvotestatistics/:id", function(request, response) {
	var aid = request.params.id;
	getHits(aid, function(hits) {
		response.send(hits[0]);
	});
});
app.post("/setvotestatistics/:id", function(request, response) {
	var aid = request.params.id;
	incrementHits(aid, function() {
		setResults(request, function(result) {
			response.send(result.length.toString());
		});
	});
});
app.get("*", function(request, response) {
    response.status(404).send("<h1>Not found :(</h1>");
});
var questionsCollection;
var answersCollection;
var resultsCollection;
db.open(function(error) {
    if(!error) {
        console.log("We are connected to database at: " + dbHost + ":" + dbPort);
        db.collection("questions", function(error, collection) {
            if(!error) {
                questionsCollection = collection;
            }
        });
        db.collection("answers", function(error, collection) {
            if(!error) {
                answersCollection = collection;
            }
        });
        db.collection("results", function(error, collection) {
            if(!error) {
                resultsCollection = collection;
            }
        });
    }
});
app.listen(port, host);
console.log("Server listenning on: " + host + ":" + port);
function getQuestions(qid, callback) {
	questionsCollection.find({"_id": new BSON.ObjectID(qid)}, {"sort": {"_id": 1}}, function(error, cursor) {
		if(!error) {
			cursor.toArray(function(error, questions) {
				if(!error) {
					callback(questions);
				}
			});
		}
	});
}
function getAnswers(qid, callback) {
	answersCollection.find({"qid.$id": new BSON.ObjectID(qid)}, {"sort": {"_id": 1}}, function(error, cursor) {
		if(!error) {
			cursor.toArray(function(error, answers) {
				if(!error) {
					callback(answers);
				}
			});
		}
	});
}
function getHits(aid, callback) {
	answersCollection.find({"_id": new BSON.ObjectID(aid)}, {"fields": {"hits": 1}}, function(error, cursor) {
		if(!error) {
			cursor.toArray(function(error, hits) {
				if(!error) {
					callback(hits);
				}
			});
		}
	});
}
function incrementHits(aid, callback) {
	answersCollection.update({"_id": new BSON.ObjectID(aid)}, {$inc: {"hits": 1}}, function(error, result) {
		if(!error) {
			callback();
		}
	});
}
function setResults(request, callback) {
	resultsCollection.insert({
		"_id": BSON.ObjectID(),
		"age": parseInt(request.body.age, 10),
		"answerid": {
			"$ref": request.body.answerref,
			"$id": BSON.ObjectID(request.body.answerid)
		},
		"ip": request.body.ip,
		"job": request.body.job,
		"questionid": {
			"$ref": request.body.questionref,
			"$id": BSON.ObjectID(request.body.questionid)
		},
		"sex": request.body.sex,
		"userid": parseInt(request.body.userid, 10),
		"username": request.body.username
	}, function(error, result) {
		if(!error) {
			callback(result);
		}
	});
}