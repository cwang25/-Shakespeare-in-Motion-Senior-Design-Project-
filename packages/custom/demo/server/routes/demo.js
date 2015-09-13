'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Demo, app, auth, database) {

  var newsarticles = require('../controllers/newsArticle')(Demo);
  //
  //app.route('/api/demo/articles')
  //    .get(articles.all)
  //    .post(auth.requiresLogin, hasPermissions, articles.create);
  //app.route('/api/demo/articles/:articleId')
  //    .get(auth.isMongoId, articles.show)
  //    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, hasPermissions, articles.update)
  //    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, articles.destroy);
  //
  //// Finish with setting up the articleId param
  //app.param('articleId', articles.article);
  app.get('/api/demo/addDummyNews', function(req, res, next){
    //req.body = {title : 'DummyTitle',content : 'DummyContent' };
    newsarticles.savedummy(req, res);
    //res.json({ message: 'Bear created!' });
  });

  app.route('/api/demo/testDummyNews')
      .get(newsarticles.savedummy)
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
