## Political Compass CouchApp

Clone with git:

    git clone git://github.com/zouppen/kompassi.git
    cd couchapp

Install with 
    
    couchapp push . http://localhost:5984/example

or (if you have security turned on)

    couchapp push . http://adminname:adminpass@localhost:5984/example

## How to use

We assume you have it running at localhost in a database of "kompassi". Feel free to change them. This is how to get names of 3 winners:

   http://localhost:5984/kompassi/_design/kompassi/_list/lottery/lottery?limit=3&include_docs=true

To get list of recruits (interested ones or those who are willing to become members):

   http://localhost:5984/kompassi/_design/kompassi/_list/recruits/recruits?include_docs=true

## TODO

* Randomize questions
* Simpler question set for teenagers :-P
* Secured app for running by anonymous users over public Internet

## License

GNU GPL v3 or (at your option) later.