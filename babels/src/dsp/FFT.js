/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/07/20 - 17:46
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import { FourierTransform } from './FourierTransform';

/**
 * calculating the Discrete Fourier Transform of a signal
 * with the Fast Fourier Transform algorithm.
 */
export class FFT extends FourierTransform {
  /**
   *
   * @param {number} bufferSize The size of the sample buffer to be computed
   * @param {number} sampleRate The sampleRate of the buffer (eg. 44100)
   */
  constructor(bufferSize, sampleRate) {
    super(bufferSize, sampleRate);

    // @type {Float64Array}
    const reverseTable = new Float64Array(bufferSize);
    // @type {Float64Array}
    const sinTable = new Float64Array(bufferSize);
    // @type {Float64Array}
    const cosTable = new Float64Array(bufferSize);

    // @type {number}
    let limit = 1;
    // >> (符号を維持する右シフト)
    // @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Right_shift
    // 2 進表現の a を b (< 32) ビット分だけ右にシフトします。あふれたビットは破棄します。
    // a >> b
    // @type {number}
    let bit = bufferSize >> 1;

    while (limit < bufferSize) {
      for (let i = 0; i < limit; i = (i + 1) | 0) {
        reverseTable[i + limit] = reverseTable[i] + bit;
      }

      // 任意の数値 x を y ビット左にシフトすると、x * 2^y になります。
      limit = limit << 1;
      bit = bit >> 1;
    }

    sinTable.forEach((val, index) => {
      // @type {number}
      const minusPi = -Math.PI / index;
      sinTable[index] = Math.sin(minusPi);
      cosTable[index] = Math.cos(minusPi);
    });

    // property
    Object.assign(this, {
      reverseTable,
      sinTable,
      cosTable,
    });
  }
  /**
   * Performs a forward transform on the sample buffer.
   * Converts a time domain signal to frequency domain spectra.
   *
   * @param {Float64Array|Array|*} buffers The sample buffer. Buffer Length must be power of 2
   * @returns {Float64Array} The frequency spectrum array
   */
  foward(buffers) {
    // @type {number}
    const bufferSize = this.bufferSize;

    const k = Math.floor(Math.log(bufferSize) / Math.LN2);
    if (Math.pow(2, k) !== bufferSize) {
      throw new Error(
        `Invalid buffer size, must be a power of 2. ${k}, ${Math.pow(2, k)}, ${bufferSize}`
      );
    }
    if (bufferSize !== buffers.length) {
      throw new Error(
        `Supplied buffer is not the same size as defined FFT. FFT Size: ${bufferSize}.` +
        `Buffer Size: ${buffers.length}`
      );
    }

    // @type {Float64Array}
    const cosTable = this.cosTable;
    // @type {Float64Array}
    const sinTable = this.sinTable;
    // @type {Float64Array}
    const real = this.real;
    // @type {Float64Array}
    const imag = this.imag;
    // @type {Float64Array}
    const reverseTable = this.reverseTable;

    for (let i = 0; i < bufferSize; i = (i + 1) | 0) {
      real[i] = buffers[reverseTable[i]];
      imag[i] = 0;
    }

    let halfSize = 1;
    while (halfSize < bufferSize) {
      const phaseShiftStepReal = cosTable[halfSize];
      const phaseShiftStepImag = sinTable[halfSize];

      let currentPhaseShiftReal = 1;
      let currentPhaseShiftImag = 0;

      for (let fftStep = 0; fftStep < halfSize; fftStep = (fftStep + 1) | 0) {
        // @type {number}
        let index = fftStep;

        while (index < bufferSize) {
          const off = index + halfSize;
          const tr = (currentPhaseShiftReal * real[off]) - (currentPhaseShiftImag * imag[off]);
          const ti = (currentPhaseShiftReal * imag[off]) + (currentPhaseShiftImag * real[off]);

          real[off] = real[index] - tr;
          imag[off] = imag[index] - ti;
          real[index] += tr;
          imag[index] += ti;

          index += halfSize << 1;
        }// while

        const tmpReal = currentPhaseShiftReal;
        currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) -
          (currentPhaseShiftImag * phaseShiftStepImag);

        currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) +
          (currentPhaseShiftImag * phaseShiftStepReal);
      }// for

      halfSize = halfSize << 1;
    }// while

    return this.calculateSpectrum(bufferSize);
  }
  /**
   *
   * @param {Float64Array|Array|*} [real=this.real]
   * @param {Float64Array|Array|*} [imag=this.imag]
   * @returns {Float64Array}
   */
  inverse(real = this.real, imag = this.imag) {
    // @type {number}
    const bufferSize = this.bufferSize;
    // @type {Float64Array}
    const cosTable = this.cosTable;
    // @type {Float64Array}
    const sinTable = this.sinTable;
    // @type {Float64Array}
    const reverseTable = this.reverseTable;
    // // @type {Float64Array}
    // const spectrum = this.spectrum;

    let imagArg = imag;
    let realArg = real;

    for (let i = 0; i < bufferSize; i = (i + 1) | 0) {
      imagArg[i] *= -1;
    }

    // @type {Float64Array}
    const revReal = new Float64Array(bufferSize);
    // @type {Float64Array}
    const revImag = new Float64Array(bufferSize);
    revReal.forEach((val, index) => {
      revReal[index] = real[reverseTable[index]];
      revImag[index] = imag[reverseTable[index]];
    });

    realArg = revReal;
    imagArg = revImag;

    let halfSize = 1;
    while (halfSize < bufferSize) {
      // @type {number}
      const phaseShiftStepReal = cosTable[halfSize];
      // @type {number}
      const phaseShiftStepImag = sinTable[halfSize];

      let currentPhaseShiftReal = 1;
      let currentPhaseShiftImag = 0;

      for (let fftStep = 0; fftStep < halfSize; fftStep = (fftStep + 1) | 0) {
        // @type {number}
        let index = fftStep;

        while (index < bufferSize) {
          const off = index + halfSize;
          const tr = (currentPhaseShiftReal * realArg[off]) -
            (currentPhaseShiftImag * imagArg[off]);
          const ti = (currentPhaseShiftReal * imagArg[off]) +
            (currentPhaseShiftImag * realArg[off]);

          realArg[off] = realArg[index] - tr;
          imagArg[off] = imagArg[index] - ti;
          realArg[index] += tr;
          imagArg[index] += ti;

          index += halfSize << 1;
        }// while

        const tmpReal = currentPhaseShiftReal;
        currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) -
          (currentPhaseShiftImag * phaseShiftStepImag);
        currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) +
          (currentPhaseShiftImag * phaseShiftStepReal);
      }// for

      halfSize = halfSize << 1;
    }// while

    // this should be reused instead
    const buffers = new Float64Array(bufferSize);
    buffers.map((buffer, index) => realArg[index] / bufferSize);

    return buffers;
  }
}
