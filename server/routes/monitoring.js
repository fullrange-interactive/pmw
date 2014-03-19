exports.index = function (req, res){
	var i = null;
	for(i in windows){
		if ( windows[i].windowId == req.query.windowId ){
			break;
		}
	}
	if ( !i ){
		console.log("Monitoring request error: window ID not specified");
		return;
	}
	var window = windows[i];
	if ( req.query.check ){
		if( window.windowId  == req.query.windowId ){
			res.send(window.monitoringAction);
			return;
		}
	}else if ( req.query.action ){
		if ( req.query.action == 'status' ){
			window.windowlastStatus = req.body.statusData;
			window.monitoringAction = '-';
			window.save();
		}else if ( req.query.action == 'reboot' ){
			window.monitoringAction = '-';
			window.save();
		}
	}else if ( req.query.apply ){
		window.monitoringAction = req.query.apply;
		window.save();
		res.send('ok');
	}
}