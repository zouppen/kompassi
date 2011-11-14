/*
 * File: designer.js
 * Date: Sun Nov 13 2011 01:42:54 GMT+0200 (EET)
 *
 */

Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    name: 'Kompassi',

    launch: function() {
        Ext.QuickTips.init();

	Ext.Ajax.request({
	    url: 'questions.json',
	    disableCaching: false,
	    method: 'GET',
	    success: function(response) {
		var qs = Ext.decode(response.responseText);

		var cmp1 = Ext.create('Kompassi.Form', {
		    renderTo: Ext.getBody(),
		    questions: qs
		});
		
		cmp1.show();
	    },
	});
    }
});

Ext.define('Kompassi.Form', {
    extend: 'Ext.form.Panel',

    initComponent: function() {
        var me = this;
	var form = [];

	for(key in me.questions) {
	    form.push({
		xtype: 'label',
		text: me.questions[key].min
	    });
	    form.push({
		xtype: 'slider',
		width: 200,
		name: key,
		value: 0,
		maxValue: 10,
		minValue: -10,
		useTips: false
	    });
	    form.push({
		xtype: 'label',
		text: me.questions[key].max
	    });
	};

	Ext.applyIf(me, {
	    items: [
		{
		    xtype: 'textfield',
		    fieldLabel: 'Nimimerkki',
		    name: 'nick'
		},
		{
		    xtype: 'container',
		    layout: {
			columns: 3,
			type: 'table'
		    },
		    items: form
		},
		{
		    xtype: 'checkboxfield',
		    name: 'arvonta',
		    boxLabel: 'Osallistun arvontaan',		
		    inputValue: true
		},
		{
		    xtype: 'checkboxfield',
		    name: 'kiinnostus',
		    boxLabel: 'Olen kiinnostunut Demarinuorista',
		    inputValue: true
		},
		{
		    xtype: 'checkboxfield',
		    name: 'liittyminen',
		    boxLabel: 'Haluan liittyä Demarinuorten jäseneksi',
		    inputValue: true
		},
		{
		    xtype: 'button',
		    text: 'Lähetä',
		    type: 'submit',
		    handler: function() {
			var value = Ext.encode(me.getForm().getValues());

			Ext.Ajax.request({
			    url: '/kompassi',
			    disableCaching: false,
			    method: 'POST',
			    params: value,
			    headers: {'Content-Type': 'application/json'},
			    success: function(response) {
				alert('sinne meni');
			    }
			});
		    }
		}
	    ]
	});

        me.callParent(arguments);
    }
});