###
  @author (at)taikiken / http://inazumatv.com
  Copyright (c) 2011-2015 inazumatv.com

  Licensed under the Apache License, Version 2.0 (the "License");
  https://www.apache.org/licenses/LICENSE-2.0
###

setting = require './setting'

# gulp / module
gulp = setting.gulp
$ = setting.$

$$ = setting.$$

del = $$.del
runSequence = $$.runSequence
browserSync = $$.browserSync
reload = $$.reload

# prefix
AUTO_PREFIX_BROWSERS = setting.AUTO_PREFIX_BROWSERS

# replace patterns
patterns = setting.patterns

# server
server = setting.server

# directory
dir = setting.dir

app = dir.app

# --------------------------------------------
# 外部 task load
# --------------------------------------------

# Load custom tasks from the `tasks` directory
# 不要の時はコメントアウトしてください
# 基本 task読み込み
try
  require( 'require-dir' )( 'tasks' )
catch error
  console.error error


# --------------------------------------------
# task
# --------------------------------------------

# DEVELOP

# browserSync + watch

###
  app で開発
###
gulp.task 'serve:app', ->
  option =
    notify: false
    # Customize the BrowserSync console logging prefix
    logPrefix: 'DEV'
    # Run as an https by uncommenting 'https: true'
    # Note: this uses an unsigned certificate which on first access
    # will present a certificate warning in the browser.
    # https: true
    server:
      baseDir: [ dir.tmp, app.root ]
      directory: server.indexes
    # additional option sever launch by ip address
    open: "external"
    port: server.port

  browserSync option

  # watch
  # sprite image
  # gulp.watch [ sprite + '/**/*.{png,jpg,gif,svg}' ], [ 'sprite:build' ]
  # html
  gulp.watch [ app.root + '/**/*.html' ], reload
  # scss, css
  gulp.watch [ app.css + '/**/*.{scss,css}' ], ['css:dev', reload]
  # js
  gulp.watch [ app.js + '/**/*.js' ], ['js:eslint', reload]
  # image
  gulp.watch [ app.root + '/**/*.{png,jpg,gif,svg}' ], reload
  # font
  gulp.watch [ app.root + '/**/*.{eot,svg,ttf,woff}' ], reload

  return

###
デプロイ・ディレクトリで開発
app でファイルを作成しdistで確認します
###

gulp.task 'serve:htdocs', ['vendor:dev', 'libs:copy'], () ->
  option =
    notify: false
    # Customize the BrowserSync console logging prefix
    logPrefix: 'DST'
    # Run as an https by uncommenting 'https: true'
    # Note: this uses an unsigned certificate which on first access
    # will present a certificate warning in the browser.
    # https: true
    server:
      baseDir: [ dir.tmp, app.root ]
      directory: server.indexes
      # additional option sever launch by ip address
    open: "external"
    port: server.port

  browserSync option

  # watch
  # sprite image
  # gulp.watch [ sprite + '/**/*.{png,jpg,gif,svg}' ], [ 'sprite:build' ]
  # html
  gulp.watch [ app.root + '/**/*.html' ], ['html:build', reload]
  # scss, css
  gulp.watch [ app.css + '/**/*.{scss,css}' ], ['css:dev', reload]
  # js
  gulp.watch [ app.js + '/**/*.js' ], ['js:dev', reload]
  # image
  gulp.watch [ app.root + '/**/*.{png,jpg,gif,svg}' ], ['image:copy', reload]
  # font
  gulp.watch [ app.root + '/**/*.{eot,svg,ttf,woff}' ], ['font:copy', reload]

  return

# BUILD

# --------------------------------------------
# 【デプロイ】

gulp.task 'default', (cb) ->
  runSequence(
    'vendor:build'
    'babels:build'
    'scripts:build'
    'js:build'
    'sprite:build'
    'css:build'
    'libs:copy'
    'font:copy'
    'image:build'
    'html:build'
    'clean:build'
    cb
  )
  return

gulp.task 'serve', ['default'], () ->
  option =
    notify: false
    # Customize the BrowserSync console logging prefix
    logPrefix: 'BLD'
    # Run as an https by uncommenting 'https: true'
    # Note: this uses an unsigned certificate which on first access
    # will present a certificate warning in the browser.
    # https: true
    server:
      baseDir: [ dir.tmp, app.root ]
      directory: server.indexes
    # additional option sever launch by ip address
    open: "external"
    port: server.port

  browserSync option

  # html
  gulp.watch [ app.root + '/**/*.html' ], reload
  # scss, css
  gulp.watch [ app.css + '/**/*.{scss,css}' ], reload
  # js
  gulp.watch [ app.js + '/**/*.js' ], reload
  # image
  gulp.watch [ app.root + '/**/*.{png,jpg,gif,svg}' ], reload
  # font
  gulp.watch [ app.root + '/**/*.{eot,svg,ttf,woff}' ], reload

  return