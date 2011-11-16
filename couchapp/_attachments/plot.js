/*
 * File: designer.js
 * Date: Sun Nov 13 2011 01:42:54 GMT+0200 (EET)
 *
 */

var mystore;

var consts = {
    circle_scale: 20,
    circle_min: 5,
    nick_count: 5,
    nick_font: "15px Liberation Sans, sans-serif"
};

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

	var win = Ext.create('Ext.Window', {
            width: 600,
            height: 500,
            hidden: false,
	    closable: false,
            maximizable: true,
	    bodyPadding: 10,
            title: 'Demarinuorten poliittinen kompassi',
            renderTo: Ext.getBody(),
            layout: 'fit',
	    items : {
		xtype: 'kompassi',
		store: mystore
	    }
	});

	var dnuoret = Ext.create('Ext.Window', {
            width: 140,
            height: 160,
	    bodyPadding: 20,
            hidden: false,
            maximizable: true,
            title: 'www.demarinuoret.fi',
            renderTo: Ext.getBody(),
            layout: 'fit',
	    items : {
		xtype: 'image',
		src: 'demarinuoret.png'
	    }
	});

	var jsdn = Ext.create('Ext.Window', {
            width: 140,
            height: 180,
	    bodyPadding: 10,
            hidden: false,
            maximizable: true,
            title: 'www.jsdn.fi',
            renderTo: Ext.getBody(),
            layout: 'fit',
	    items : {
		xtype: 'image',
		src: 'jsdn.png'
	    }
	});

    },
});

Ext.define('Kompassi.Plot', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.kompassi',
    axes: [
	{
	    title: 'konservatiivi / liberaali',
	    type: 'Numeric',
	    position: 'left',
	    fields: ['y'],
	    minimum: -50,
	    maximum: 50
	},
	{
	    title: 'vasemmisto / oikeisto',
	    type: 'Numeric',
	    position: 'bottom',
	    fields: ['x'],
	    minimum: -50,
	    maximum: 50
	}
    ],
    animate: true,
    series: [
        {
            type: 'scatter',
            xField: 'x',
            yField: 'y',
            markerConfig: {
		radius: 5,
		size: 5
            },
	    renderer: function(sprite, record, attr, index, store) {
		var n = store.count();
		var lastness = n-index-1;
		// Thanks for the algorithm, Elktro <3
		var size;
		if (lastness>30) size = consts.circle_min;
		else size = consts.circle_min+consts.circle_scale/(1 << (lastness/2));
		// Color map got from
		// http://dev.sencha.com/deploy/ChartsDemo/examples/chart/ScatterRenderer.js
		var color = ['rgb(213, 70, 121)', 
			     'rgb(44, 153, 201)', 
			     'rgb(146, 6, 157)', 
			     'rgb(49, 149, 0)', 
			     'rgb(249, 153, 0)',
			     'rgb(0, 0, 0)',
			     'rgb(120, 120, 120)',
			     'rgb(200, 200, 200)'][index % 8];
		return Ext.apply(attr, {
		    radius: size,
		    fill: color
		});
	    },
            label: {
                display: 'middle',
                field: 'nick',
                'text-anchor': 'middle',
		font: consts.nick_font
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
		    var points = json.rows[i].value;
		    // Plot new point.
		    mystore.add(points);

		    // Remove legend for old point
		    var i = mystore.count()-consts.nick_count;
		    if (i >= 0) {
			mystore.getAt(i).set("nick","");
		    }
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
