'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Demo = new Module('demo');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Demo.register(function(app, auth, database) {
  //We enable routing. By default the Package Object is passed to the routes
  Demo.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Demo.menus.add({
    title: 'demo example page',
    link: 'demo example page',
    roles: ['all'],
    menu: 'main'
  });
  Demo.menus.add({
    title: 'reports page',
    link: 'reports page',
    roles: ['all'],
    menu: 'main'
  });
  /**
   * Here is place improt all files from assets includig js library.
   */
  Demo.aggregateAsset('css', 'demo.css');
  Demo.aggregateAsset('js', '../lib/d3.js');
  Demo.aggregateAsset('js', '../lib/c3.js');
  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Demo.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Demo.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Demo.settings(function(err, settings) {
        //you now have the settings object
    });
    */
  Demo.events.defaultData({
    type: 'post',
    subtype: 'newsarticle'
  });
  //app.set('views', __dirname + '/server/views/');

  return Demo;
});
