/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/07/20 - 17:06
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import { FourierTransform } from './FourierTransform';
import { DSP } from './DSP';

/**
 * calculating the Discrete Fourier Transform of a signal.
 */
export class DFT extends FourierTransform {
  /**
   *
   * @param {number} bufferSize The size of the sample buffer to be computed
   * @param {number} sampleRate The sampleRate of the buffer (eg. 44100)
   */
  constructor(bufferSize, sampleRate) {
    super(bufferSize, sampleRate);

    // @type {number}
    const TWO_PI = DSP.TWO_PI;
    // @type {number}
    const length = bufferSize / 2 * bufferSize;
    // @type {Float64Array}
    const sinTable = new Float64Array(length);
    // @type {Float64Array}
    const cosTable = new Float64Array(length);

    sinTable.forEach((val, index) => {
      // @type {number}
      const value = index * TWO_PI / bufferSize;
      sinTable[index] = Math.sin(value);
      cosTable[index] = Math.cos(value);
    });

    // property
    Object.assign(this, {
      sinTable,
      cosTable,
    });
  }
  /**
   * Performs a forward transform on the sample buffer.
   * Converts a time domain signal to frequency domain spectra.
   *
   * @param {Array|Float64Array} buffers The sample buffer
   * @returns {Float64Array} The frequency spectrum array
   */
  foward(buffers) {
    // @type {Float64Array}
    const real = this.real;
    // @type {Float64Array}
    const imag = this.imag;
    // @type {number}
    const bufferSize = this.bufferSize;
    // @type {Float64Array}
    const cosTable = this.cosTable;
    // @type {Float64Array}
    const sinTable = this.sinTable;

    real.forEach((v, i) => {
      let realValue = 0;
      let imagValue = 0;

      buffers.forEach((buffer, index) => {
        const n = i * index;
        realValue += cosTable[n] * buffer;
        imagValue += sinTable[n] * buffer;
      });

      real[i] = realValue;
      imag[i] = imagValue;
    });

    return this.calculateSpectrum(bufferSize);
  }
}
