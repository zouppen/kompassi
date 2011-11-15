/*
 * File: designer.js
 * Date: Sun Nov 13 2011 01:42:54 GMT+0200 (EET)
 *
 */

var mystore;

Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    name: 'Kompassiplot',

    launch: function() {
        Ext.QuickTips.init();

	Ext.define('KompassiPoint', {
	    extend: 'Ext.data.Model',
	    fields: ['x', 'y','nick']
	});

	mystore = Ext.create('Ext.data.Store', {
	    model: 'KompassiPoint',
	    data: []
	});

	var cmp1 = Ext.create('Kompassi.Plot', {
	    store: mystore,
	    renderTo: Ext.getBody()	
	});
	cmp1.show();
    },
});

Ext.define('Kompassi.Plot', {
    extend: 'Ext.chart.Chart',
    width: 400,
    height: 300,
    axes: [
	{
	    grid: true,
	    title: 'konservatiivi / liberaali',
	    type: 'Numeric',
	    position: 'left',
	    fields: ['y'],
	    minimum: -50,
	    maximum: 50
	},
	{
	    grid: true,
	    title: 'vasemmisto / oikeisto',
	    type: 'Numeric',
	    position: 'bottom',
	    fields: ['x'],
	    minimum: -50,
	    maximum: 50
	}
    ],

    series: [
        {
            type: 'scatter',
            xField: 'x',
            yField: 'y',
            axis: ['left','bottom'],
            markerConfig: {
		radius: 5,
		size: 5
            },
            label: {
                display: 'middle',
                field: 'nick',
                'text-anchor': 'middle',
//                contrast: true,
//		color: '#000'
		font: "15px Liberation Sans, sans-serif"
            },
        }
    ],

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

	// Point getter
	var pointReq = {
	    url: '/kompassi/_design/kompassi/_view/vectors',
	    disableCaching: false,
	    method: 'POST',
	    headers: {'Content-Type': 'application/json'},
	    success: function(response) {
		var json = Ext.decode(response.responseText);
		for (i in json.rows) {
		    // Plot new point.
		    mystore.add(json.rows[i].value);
		}
	    }
	}

	// Launch CouchDB document retrieval
	var longpoll = {
	    url: '/kompassi/_changes',
	    disableCaching: false,
	    method: 'GET',
	    params: {
		feed: 'longpoll'
	    },
	    headers: {'Content-Type': 'application/json'},
	    failure: function(response) {
		// If it fails, wait and try again.
		setTimeout(function() {
		    Ext.Ajax.request(longpoll);
		}, 5000);
	    },
	    success: function(response) {
		var json = Ext.decode(response.responseText, true);
		if (json !== null) {
		    // Finding out interesting ones
		    var idReq = {"keys": []};

		    for (i in json.results) {
			var id = json.results[i].id;
			if (id.charAt(0) == '_') continue;
			idReq.keys.push(id);
		    }
		    
		    // Then, ask these documents from CouchDB.
		    pointReq.params = Ext.encode(idReq);
		    Ext.Ajax.request(pointReq);

		    // Move last "pointer".
		    longpoll.params.since=json.last_seq;
		}
		// Re-request anyway.
		Ext.Ajax.request(longpoll);
	    }
	}
	// Launch first request.
	Ext.Ajax.request(longpoll);
    }
});
