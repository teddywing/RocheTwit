// Create a reference to the current window
var win = Titanium.UI.currentWindow;

// Create an object to contain some useful functions
// Namespacing can be useful for keeping code organised in Ti applications
// In simple applications such as this, it's not exactly necessary
var TSearch = {
	s: function(query) {
		var row_data = []; // an array to store our result rows in
		                   // (this gets fed into the result_table)
		
		var request = Titanium.Network.createHTTPClient();
		request.open('GET', 'http://search.twitter.com/search.json?q=' + query);
		
		request.onload = function() {
			var results = (eval('(' + this.responseText + ')')).results;
			
			// No result case?
			
			// Open a database to store our result set (Ti uses asynchronous
			// requests, so this is what I came up with to separate view 
			// and data code)
			var db = Titanium.Database.open('twitsearch');
			db.execute('CREATE TABLE IF NOT EXISTS "search_results" (tweet TEXT, user STRING, avatar STRING)');
			db.execute('DELETE FROM "search_results"');
			
			for (var i = 0; i < results.length; i++) {
//				var tweet  = results[i].text;              // Tweet text
//				var user   = results[i].from_user;         // Username
//				var avatar = results[i].profile_image_url; // Avatar URL
				
// 				row_data[i] = {
// 					tweet  : results[i].text,              // Tweet text
// 					user   : results[i].from_user,         // Username
// 					avatar : results[i].profile_image_url  // Avatar URL					
// 				};
				
				db.execute('INSERT INTO "search_results" (tweet, user, avatar) VALUES (?, ?, ?)', results[i].text, results[i].from_user, results[i].profile_image_url);
			}
			
			db.close();
		};
		
		request.send();
		
		return row_data;
	}
};


// Create a search input bar
var search_input = Titanium.UI.createSearchBar({
	hintText: 'Enter a search query', // let user know what to type
	height: 43,
	top: 0
});

var result_table = Titanium.UI.createTableView();


search_input.addEventListener('return', function(e) {
	TSearch.s(e.value);
	
	var db = Titanium.Database.open('twitsearch');
	//db.execute('CREATE TABLE IF NOT EXISTS "search_results" (tweet TEXT, user STRING, avatar STRING)');
	var results = db.execute('SELECT * FROM "search_results"');
	
	while (results.isValidRow()) {
		Titanium.API.info(results.fieldByName('tweet'));
		Titanium.API.info(results.fieldByName('user'));
		Titanium.API.info(results.fieldByName('avatar'));
		
		results.next();
	}
	
	results.close();
	db.close();
});

var label1 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 1',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win.add(label1);

win.add(search_input);