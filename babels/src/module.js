/*!
 * @license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/07/19
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 * fork from DSP.js - a comprehensive digital signal processing  library for javascript
 *
 *  Created by Corban Brook <corbanbrook@gmail.com> on 2010-01-01.
 *  Copyright 2010 Corban Brook. All rights reserved.
 */
// use strict は本来不要でエラーになる
// 無いと webpack.optimize.UglifyJsPlugin がコメントを全部削除するので記述する
/* eslint strict: [0, "global"] */
'use strict';

import { MathUtil } from './util/MathUtil';


import { DSP } from './dsp/DSP';
import { Biquad } from './dsp/Biquad';
import { DFT } from './dsp/fourier/DFT';
import { FFT } from './dsp/fourier/FFT';

const KIZAMI = {};

/**
 * version number を取得します
 * @return {string} version number を返します
 */
KIZAMI.version = () => '@@version';
/**
 * build 日時を取得します
 * @return {string}  build 日時を返します
 */
KIZAMI.build = () => '@@buildTime';

KIZAMI.util = {
  MathUtil,
};

KIZAMI.dsp = {
  DSP,
  Biquad,
  DFT,
  FFT,
};

window.KIZAMI = KIZAMI;
