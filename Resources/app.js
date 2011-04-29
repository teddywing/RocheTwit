// Create a tab group to contain our views
var tabGroup = Titanium.UI.createTabGroup();


// Create the main, root window
var search_win = Titanium.UI.createWindow({
    title: 'RocheTwit',
    backgroundColor: '#fff',
    tabBarHidden: true,      // hide the tab bar
    url: 'search.js'         // create a new context for this window in 'search.js'
});
// Create the tab to contain our search window
var search_tab = Titanium.UI.createTab({
    title: 'Recherche',
    icon: 'KS_nav_views.png',
    window: search_win       // use search_win in this tab
});


//  add tabs
tabGroup.addTab(search_tab);

// open tab group
tabGroup.open();
