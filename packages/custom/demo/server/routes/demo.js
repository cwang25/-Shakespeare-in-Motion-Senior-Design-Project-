'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Demo, app, auth, database) {

  var entities = require('../controllers/entity')(Demo);
  //news article rest api
  app.route('/api/demo/entity')
    .get(entities.all)
    .post(entities.create);
  app.route('/api/demo/entity/:entityId')
    .get(entities.show)
    .put(entities.update)
    .delete(entities.destroy);
  //This is function that always attach record data into request if given
  //record id.  It will help for update, delete, findOne.
  app.param('entityId', entities.entity);
  //
  app.get('/api/demo/entitiesbydaterange', function(req, res, next){
    entities.entitiesintimerange(req, res);
  });

  var newsarticles = require('../controllers/newsArticle')(Demo);
  //news article rest api
  app.route('/api/demo/newsarticles')
    .get(newsarticles.all)
    .post(newsarticles.create);
  app.route('/api/demo/newsarticles/:newsarticleId')
    .get(newsarticles.show)
    .put(newsarticles.update)
    .delete(newsarticles.destroy);
  //This is function that always attach record data into request if given
  //record id.  It will help for update, delete, findOne.
  app.param('newsarticleId', newsarticles.newsarticle);
  //
  app.get('/api/demo/newsbydaterange', function(req, res){
    newsarticles.newsintimerange(req, res);
  });
  //// Finish with setting up the articleId param
  //app.param('articleId', articles.article);
  //quotes rest api
  var quotes = require('../controllers/quote')(Demo);
  app.route('/api/demo/quotes')
    .get(quotes.all)
    .post(quotes.create);
  app.route('/api/demo/quotes/:quoteId')
    .get(quotes.show)
    .put(quotes.update)
    .delete(quotes.destroy);
  //This is function that always attach record data into request if given
  //record id.  It will help for update, delete, findOne.
  app.param('quoteId', quotes.quote);

  //Week Summary Rest API for week sum
  var weeksum = require('../controllers/weekSum')(Demo);
  app.route('/api/demo/weeksum')
    .get(weeksum.all)
    .post(weeksum.create);
  app.route('/api/demo/weeksum/:weeksumId')
    .get(weeksum.show)
    .put(weeksum.update)
    .delete(weeksum.destroy);
  //This is function that always attach record data into request if given
  //record id.  It will help for update, delete, findOne.
  app.param('weeksumId', weeksum.weeksum);


  //trigger python scripts
  //trigger index crawler and articles
  //get start date and end date arguement.
  //i.e. /api/demo/crawl_and_generate_week_summary?startdate=YYYY-MM-DD&enddate=YYYY-MM-DD&qsymbol=^DJC
  app.get('/api/demo/crawl_and_generate_week_summary', function (req, res, next) {
    var quoteSymbol = req.query.qsymbol;
    if(quoteSymbol == null){
      quoteSymbol = "^DJC";
    }
    var pyShell = require('python-shell');
    var respond_msg = 'Scripts finished running\n';
    var options = {
      mode: 'text',
      scriptPath: 'packages/custom/demo/PythonScripts',
      args:['-start',req.query.startdate,'-end',req.query.enddate]
    };
    options["args"] = ['-start',req.query.startdate,'-end',req.query.enddate, '-index', quoteSymbol];
    pyShell.run('IndexCrawler.py', options, function(err,results){
      if (err){
        //console.log(err);
        res.send("Error");
      }else {
        //console.log(results);
        //respond_msg += results;
        options["args"] = ['-start',req.query.startdate,'-end',req.query.enddate, '-index', quoteSymbol];
        options["mode"] = 'text';
        pyShell.run('WeekSummary.py', options, function(err,results){
          if (err){
            console.log(err);
          }else {
            console.log(results);
            res.send(results);
          }
          //req.query.date = req.query.startdate;
          ////res.send(req.query);
          //weeksum.weeksum_by_date(req, res, next);
        });
      }
    });
    //res.send(respond_msg);
  });

  app.get('/api/demo/get_news_from_alchemy', function (req, res, next) {
    var commodity = req.query.commodity;
    var pyShell = require('python-shell');
    var respond_msg = 'Scripts finished running\n';
    var options = {
      mode: 'text',
      scriptPath: 'packages/custom/demo/PythonScripts',
      args:['-start',req.query.startdate,'-end',req.query.enddate]
    };
    options["args"] = ['-start',req.query.startdate,'-end',req.query.enddate, '-commodity', commodity];
    pyShell.run('ArticleCrawler.py', options, function(err,results){
      if (err){
        //console.log(err);
        res.send("Error");
      }else {

        pyShell.run('ArticleDatabaseClean.py', options, function(err,results){
          if (err){
            console.log(err);
          }else {
            console.log(results);
            res.send(results);
          }
        });
      }
    });
  });


  /**
   * Date range api requries url paramters
   * - startdate
   * - enddate
   */
  //i.e. /api/demo/weeksum_by_date?date=YYYY-MM-DD&qsymbol="^DJC"
  app.get('/api/demo/weeksum_by_date_index', function(req, res, next){
    weeksum.weeksum_by_date(req, res);
  });

  //required startdate and enddate parameter
  //i.e. /api/demo/quotes_in_time_range?startdate=YYYY-MM-DD&enddate=YYYY-MM-DD
  //optional argument: indexsymbol
  app.get('/api/demo/quotes_by_date_range', function(req, res, next){
    quotes.quotes_in_time_range(req, res);
  });
  // required parameter indexsymbol which is the symbol of the idnex to look for
  //i.e. /api/demo/quotes_by_symbol?indexsymbol=^DJI
  app.get('/api/demo/quotes_by_symbol', function(req, res, next){
    quotes.quotes_by_symbol(req, res);
  });
  //-----
  app.get('/api/demo/getAllNews', function(req, res, next){
    newsarticles.all(req, res);
  });

  app.get('/api/demo/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/api/demo/example/auth', auth.requiresLogin, function(req, res, next) {

    res.send('Only authenticated users can access this');
  });

  app.get('/api/demo/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });



  app.get('/api/demo/documentation_page', function(req, res, next) {
    var path = require('path');
    var express = require('express');
    app.use(express.static(path.join(__dirname, 'public')));
    Demo.render('index', {
      package: 'demo'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });

};
