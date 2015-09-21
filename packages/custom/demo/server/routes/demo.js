'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Demo, app, auth, database) {

  var newsarticles = require('../controllers/newsArticle')(Demo);
  //
  app.route('/api/demo/newsarticles')
      .get(newsarticles.all)
      .post(newsarticles.create);
  app.route('/api/demo/newsarticles/:newsarticleId')
      .get(newsarticles.show)
      .put(newsarticles.update)
      .delete(newsarticles.destroy);
  app.param('newsarticleId', newsarticles.newsarticle);
  //
  app.get('/api/demo/newsbydaterange', function(req, res, next){
    newsarticles.newsintimerange(req, res, next);
  });
  //// Finish with setting up the articleId param
  //app.param('articleId', articles.article);

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
