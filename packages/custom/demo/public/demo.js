/**
 * Created by hanswang on 10/9/15.
 */
'use strict';
/**
 * Override the default homepage.
 */
angular.module('mean.demo', ['mean.system']).config(['$viewPathProvider',
  function ($viewPathProvider) {
    $viewPathProvider.override('system/views/index.html', 'demo/views/reports.html');
  }
]);