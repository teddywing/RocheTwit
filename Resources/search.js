// Create a reference to the current window
var win = Titanium.UI.currentWindow;


// Create a search input bar
var search_input = Titanium.UI.createSearchBar({
	hintText: 'Rechercher sur Twitter', // let user know what to type
	height: 43,
	top: 0
});

var result_table = Titanium.UI.createTableView({
	top: 43 // Make sure the tableview is underneath our search bar
});
var row_data = []; // an array to store our result rows in
                   // (this gets fed into the result_table)


// Create an object to contain some useful functions
// Namespacing can be useful for keeping code organised in Ti applications
// In simple applications such as this, it's not exactly necessary
var TSearch = {
	s: function(query) {
		var request = Titanium.Network.createHTTPClient();
		request.open('GET', 'http://search.twitter.com/search.json?q=' + query.replace('#', '%23')); // Appcelerator URL-encodes automatically, but doesn't always encode hashes ('#'). Twitter wants hashes to be URL-encoded, so we'll make sure they are.
		
		request.onload = function() {
			var results = (eval('(' + this.responseText + ')')).results;
			
			row_data = []; // Clear existing row_data
			
			for (var i = 0; i < results.length; i++) {
				// Construct a TableView to display our results
				
				var tweet  = results[i].text;
				var user   = results[i].from_user;
				var avatar = results[i].profile_image_url;
				
				var row = Titanium.UI.createTableViewRow({
					height: 'auto',
					selectedBackgroundColor: 'transparent'
				});
				// tweet_view will contain our tweet elements for a customised TableRow
				var tweet_view = Titanium.UI.createView({
					height: 'auto',
					top: 5,
					right: 5,
					bottom: 5,
					left: 5
				});
				var avatar_image = Titanium.UI.createImageView({
					image: avatar,
					top: 0,
					left: 0,
					height: 45,
					width: 45
				});
				var user_label = Titanium.UI.createLabel({
					text: user,
					height: 'auto',
					font: {fontFamily: 'Helvetica Neue', fontSize: 16, fontWeight: 'bold'},
					top: -5,
					left: 50
				});
				var tweet_label = Titanium.UI.createLabel({
					text: tweet,
					height: 'auto',
					font: {fontSize: 14},
					top: 15,
					left: 50
				});
				
				
				// Combine our UI elements
				tweet_view.add(avatar_image);
				tweet_view.add(user_label);
				tweet_view.add(tweet_label);
				row.add(tweet_view);
				
				// Add our row to the row_data array
				row_data.push(row);
			}
			
			// Add our new rows to the result TableView
			result_table.setData(row_data);
		};
		
		request.send();
	}
};


// Event listener on Search button click
search_input.addEventListener('return', function(e) {
	TSearch.s(e.value);
	
	// Blur search field to hide on-screen keyboard
	search_input.blur();
});


// Add our UI elements to the window
win.add(search_input);
win.add(result_table);
