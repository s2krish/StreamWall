function StreamWall() {
	
	var osname = Ti.Platform.osname;
	var offset = 0,
		firePull = false,
		firePush = false;
	
	var label = {
		releaseRefresh: 'Release to refresh',
		releaseLoad: 'Release to load more',
		refreshing: 'Updating ...', 
		loading: 'Loading more ...',
	};
	
	//Create wrapper view
	var self = Ti.UI.createView({
		backgroundColor: '#fff',
		layout: 'vertical',
	});
	
	//Label to show "loading..." at top of view, when window is pulled down
	var refreshLabel = Ti.UI.createLabel({
		pull: true,
	});
	
	var table = Ti.UI.createTableView();
	
	//set footerView of table so rows don't repeat
	var footerView = Ti.UI.createView({
		text: '',
		height: 0,
	});
	table.footerView = footerView;
	
	//Label to show "loading more ..." at buttom of view, when window is pushed up
	var loadMoreLabel = Ti.UI.createLabel({
		push: true,
	});
	
	self.showPull = function() {
		refreshLabel.height = 30;
		refreshLabel.visible = true;
		refreshLabel.text = label.releaseRefresh;
		refreshLabel.pull = true;
	};
	
	self.hidePull = function() {
		refreshLabel.height = 0;
		refreshLabel.visible = false;
		refreshLabel.text = '';
		refreshLabel.pull = false;
	};
	
	self.showPush = function() {
		loadMoreLabel.height = 30;
		loadMoreLabel.visible = true;
		loadMoreLabel.text = label.releaseLoad;
		loadMoreLabel.push = true;
		table.height = '90%';
	};
	
	self.hidePush = function() {
		loadMoreLabel.height = 0;
		loadMoreLabel.visible = false;
		loadMoreLabel.text = '';
		loadMoreLabel.push = false;
		table.height = '100%';
	};
	
	self.ready = function() {
		refreshLabel.pull = false;
		loadmoreLabel.push = false;
	};
	
	/**
	 * Set the table data 
 	 * @param {Object} rows
	*/
	self.setTable = function (rows) {
		if (Object.prototype.toString.apply(rows) === '[object Array]') {
			table.setData(rows);
		}
		
		//Enable pull and push
		self.ready();
	};
	
	/**
	 * Add the rows at top of table 
 	 * @param {Object} rows
	*/
	self.refreshNew = function (rows) {
		if (Object.prototype.toString.apply(rows) === '[object Array]') {
			for(var i = (rows.length-1); i >= 0; i--) {
				table.insertRowBefore(0, rows[i]);
			}
		}
		
		self.hidePull();
	};
	
	/**
	 * Add the rows at bottom of table 
 	 * @param {Object} rows
	*/
	self.loadMore = function (rows) {
		if (Object.prototype.toString.apply(rows) === '[object Array]') {
			for(var i = 0; i < rows.length; i++){
				table.appendRow(rows[i]);
			}
		}
		
		self.hidePush();
	};
	
	self.add(refreshLabel);
	self.add(table);
	self.add(loadMoreLabel);
	
	//Hide and refresh and load more label at biginning.
	self.hidePull();
	self.hidePush();
	
	//Frie an event when row is clicked
	table.addEventListener('click', function(e) {
		self.fireEvent('itemSelected', e);
	});
	
	table.addEventListener('scroll', function(e) {
		if ('android' === osname) {
			offset = e.firstVisibleItem;
			//load more content when user scroll down and reach bottom
			//and pushes table up (more than total height of table)
			if(offset && e.totalItemCount <= (offset + e.visibleItemCount) && false === loadMoreLabel.push){
				self.showPush();
				self.fireEvent('push', e);
			}
		} else {
			
			offset = e.contentOffset.y;
			
			//load new content when user scroll up and reach at very top of view,
			//and pull the table down e.g. -65 pixle 
			if (-50 >= offset && false === refreshLabel.pull){
				self.showPull();
				firePull = true;
			}
			
			//load more content when user scroll down and reach bottom
			//and pushes table up (drag table up)
			if((offset + e.size.height) > (e.contentSize.height + 50) && false === loadMoreLabel.push) {
				self.showPush();
				firePush = true;
			} 
		}

	});
	
	//Android understand swipe down event, not iOS
	if ('android' === osname) {
		table.addEventListener('swipe', function(e){
			//load new content when user scroll up and reach at very top of view,
			//and still try to pull table down. 
			//Since android do not allow pull down table on negative, catching swipe to down event is good    
			if ('down' === e.direction && 0 === offset && false === refreshLabel.pull) {
				self.showPull();
				self.fireEvent('pull', e);
			}
		});
	} else {
		//dragend is not supported by android
		table.addEventListener('dragend', function(e) {			
			if (true === firePull) {
				refreshLabel.text = label.refreshing;
				firePull = false;
				self.fireEvent('pull', e);
			}
			
			if (true === firePush) {
				loadMoreLabel.text = label.loading;
				firePush = false;
				self.fireEvent('push', e);
			}
		});
	}
	
	return self;
};
module.exports = StreamWall;