/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/07/22 - 16:19
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import { FourierTransform } from '../FourierTransform';

/**
 * RFFT is a class for calculating the Discrete Fourier Transform of a signal
 * with the Fast Fourier Transform algorithm.
 *
 * This method currently only contains a forward transform but is highly optimized.
 *
 * lookup tables don't really gain us any speed, but they do increase
 * cache footprint, so don't use them in here
 *
 * also we don't use separate arrays for real/imaginary parts
 *
 * this one a little more than twice as fast as the one in FFT
 * however I only did the forward transform
 *
 * the rest of this was translated from C, see http://www.jjj.de/fxt/
 * this is the real split radix FFT
 *
 */
export class RFFT extends FourierTransform {
  /**
   *
   * @param {number} bufferSize bufferSize The size of the sample buffer to be computed. Must be power of 2
   * @param {number} sampleRate sampleRate The sampleRate of the buffer (eg. 44100)
   */
  constructor(bufferSize, sampleRate) {
    super(bufferSize, sampleRate);

    this.trans = new Float64Array(bufferSize);

    this.reverseTable = new Uint32Array(bufferSize);
  }

  reverseBinPermute(dest, source) {
    let destArg = dest;
    let sourceArg = source;

    const bufferSize = this.bufferSize;
    const bufferSizeHalf = bufferSize >>> 1;
    const bufferSizeMinus1 = bufferSize - 1;
    let index = 1;

  }
}
