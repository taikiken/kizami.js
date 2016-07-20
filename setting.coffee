###
  @author (at)taikiken / http://inazumatv.com
  Copyright (c) 2011-2015 inazumatv.com

  Licensed under the Apache License, Version 2.0 (the "License");
  https://www.apache.org/licenses/LICENSE-2.0
###

# ------------------------------------------------------
# package
# ------------------------------------------------------
pkg = require './package.json'

# ------------------------------------------------------
# Node / Gulp module
# ------------------------------------------------------
# Include Gulp & tools we'll use
gulp = require 'gulp'
$ = do require 'gulp-load-plugins'

# module
$$ = {}

# module del
$$.del = require 'del'

# module run-sequence
$$.runSequence = require 'run-sequence'

# module webpack
$$.webpack = require 'webpack'

# module browser-sync
browserSync = require 'browser-sync'
$$.browserSync = browserSync
$$.reload = browserSync.reload

# ------------------------------------------------------
# directory
# ------------------------------------------------------
dir = {}

root = '.'
dir.root = root

# dev root
app = root + '/app'
assets = app + '/assets'
dir.app =
  root: app
  assets: assets
  img: assets + '/img'
  css: assets + '/css'
  js: assets + '/js'
  libs: assets + '/js/libs'
  bundle: assets + '/js/bundle'

# scss module
dir.scss = root + '/scss'

# sprite
sprite = root + '/sprite'
dir.sprite =
  root: sprite
  css: dir.app.css
  img: dir.app.img + '/sprite'

# tmp, dev compiled css directory
dir.tmp = root + '/.tmp'

# scripts, project js library
scripts = root + '/scripts'

dir.scripts =
  src: scripts + '/src'
  dependencies: scripts + '/dependencies'

# bower
bower = root + '/bower'
dir.bower =
  components: bower + '/bower_components'
  exports: bower + '/bower_exports'

# dist root
dist = root
dir.dist =
  root: dist
  libs: root + '/libs'

# babels
babels = root + '/babels'

dir.babels =
  src: babels + '/src'
  dependencies: babels + '/dependencies'
  compile: babels + '/compile'

# ------------------------------------------------------
# webpack config
# ------------------------------------------------------
wpk =
  entry: __dirname
  output:
    path: dir.app.bundle
    publicPath: 'assets/js/bundle'
    filename: 'moku.js'
    chunkFilename: '[chunkhash].bundle.js'

# ------------------------------------------------------
# Sass prefix (Browser vendor prefix)
# ------------------------------------------------------
AUTO_PREFIX_BROWSERS = [
  'ie >= 11'
  'ie_mob >= 10'
  'ff >= 44'
  'chrome >= 48'
  'safari >= 9'
  'opera >= 34'
  'ios >= 8.4'
  'android >= 4.2'
  'bb >= 10'
]

# ------------------------------------------------------
# patterns for replace
# ------------------------------------------------------
patterns = [
  {
    match: 'buildTime'
    replacement: new Date().toLocaleString()
  }
  {
    match: 'year'
    replacement: new Date().getFullYear()
  }
  {
    match: 'version'
    replacement: pkg.version
  }
  {
    match: 'copyright'
    replacement: 'Parachute'
  }
]

# ------------------------------------------------------
# compression
# ------------------------------------------------------
compress = {}
# image
###
  optimizationLevel: default 3

  圧縮効率は下記設定の方が大きい
  progressive: true
  interlaced: true
###
compress.img =
  optimizationLevel: 5
  progressive: false
  interlaced: false

###
# html / css minify するかしないか
# true: minifyする
#
#   default =
#     html: false
#     css:  true
###

compress.html = false
compress.css = true

# ------------------------------------------------------
# server (browserSync)
# ------------------------------------------------------
server = {}
###
  _port.coffee を port.coffee へ rename します
  port.coffee の port 値を環境に合わせ変更します
  port.coffee を .gitignore に加えます
###
try
  port = require './port'
catch error
  port = { port : 61000 }

server.port = port.port

###
  indexes

  directory indexes を設定します
  * 【注意】directory index が無効になってしまうので default false にしてます
###
server.indexes = true

# ------------------------------------------------------
# exports
# ------------------------------------------------------
module.exports =
  gulp: gulp
  $: $
  wpk: wpk
  $$: $$
  dir: dir
  server: server
  AUTO_PREFIX_BROWSERS: AUTO_PREFIX_BROWSERS
  patterns: patterns
  compress: compress
