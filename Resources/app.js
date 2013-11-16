var createRow = function(data) {
	
	rows = [];
	for (var i = 0; i < data.length; i++) {
		row = Ti.UI.createTableViewRow({
			title: data[i].title,
		});
		
		rows.push(row);
	}
	
	return rows;
};

(function() {

	//You might want to get those records as per your wish.
	//In real scenario it may be from rss, REST Api, Database etc.
	var newRecords = [
		{title: 'I am new rows 1'},
		{title: 'I am new rows 2'},
		{title: 'I am new rows 3'},
	];
	
	var moreRecords = [
		{title: 'I am more rows 1'},
		{title: 'I am more rows 2'},
		{title: 'I am more rows 3'},
	];
	
	var defaultRecords = [
		{title: 'I am default rows 1'},
		{title: 'I am default rows 2'},
		{title: 'I am default rows 3'},
		{title: 'I am default rows 4'},
		{title: 'I am default rows 5'},
		{title: 'I am default rows 6'},
		{title: 'I am default rows 7'},
		{title: 'I am default rows 8'},
		{title: 'I am default rows 9'},
		{title: 'I am default rows 10'},
		{title: 'I am default rows 11'},
		{title: 'I am default rows 12'},
		{title: 'I am default rows 13'},
		{title: 'I am default rows 14'},
		{title: 'I am default rows 15'},
		{title: 'I am default rows 16'},
		{title: 'I am default rows 17'},
		{title: 'I am default rows 18'},
	];
	
	var win = Ti.UI.createWindow({
		title:'Stream Wall',
		backgroundColor: '#fff',
	});
	
	var StreamWall = require('/StreamWall');
	var streamWall = new StreamWall();
	
	var defaultRows = createRow(defaultRecords);
	streamWall.setTable(defaultRows);
	win.add(streamWall);
	
	//What happen when clicked in row
	streamWall.addEventListener('itemSelected', function(e){
		alert (e.row.title);
	});
	
	//Refresh table by loading new records
	streamWall.addEventListener('pull', function(e){
		var newRows = createRow(newRecords);
		streamWall.refreshNew(newRows);
	});
	
	//Add more rows in table by loading old records
	streamWall.addEventListener('push', function(e){
		var moreData = createRow(moreRecords);
		streamWall.loadMore(moreData);
	});
	
	win.open();

})();