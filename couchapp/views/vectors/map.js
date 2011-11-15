function(doc) {
    // !json questions
    var ans = {nick: doc.nick, x: 0, y: 0};

    for (q in questions) {
	var vec = questions[q].vector;
	var scale = doc[q];
	
	ans.x+= scale * vec[0];
	ans.y+= scale * vec[1];
    }
    
    emit(doc._id,ans);
}