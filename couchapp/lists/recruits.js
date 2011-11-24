function(head, req) {
    var row;
    start({
	"headers": {
	    "Content-Type": "text/plain;charset=UTF-8"
	}
    });
    send("type,name,phone,email,born\n");
    
    while(row = getRow()) {
	var a = row.doc;
	send(""+row.key+","+a.name+","+a.phone+","+a.email+","+a.born+"\n");
    }
}
