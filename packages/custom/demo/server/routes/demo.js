'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Demo, app, auth, database) {

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
  app.get('/api/demo/newsbydaterange', function(req, res, next){
    newsarticles.newsintimerange(req, res, next);
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
  /**
   * Date range api requries url paramters
   * - startdate
   * - enddate
   */
  //required startdate and enddate parameter
  //i.e. /api/demo/quotes_in_time_range?startdate=YYYY-MM-DD&enddate=YYYY-MM-DD
  //optional argument: indexsymbol
  app.get('/api/demo/quotes_by_date_range', function(req, res, next){
    quotes.quotes_in_time_range(req, res, next);
  });
  // required parameter indexsymbol which is the symbol of the idnex to look for
  //i.e. /api/demo/quotes_by_symbol?indexsymbol=^DJI
  app.get('/api/demo/quotes_by_symbol', function(req, res, next){
    quotes.quotes_by_symbol(req, res, next);
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

  app.get('/api/demo/example/render', function(req, res, next) {
    Demo.render('index', {
      package: 'demo'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
