/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/07/20 - 16:35
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * Fourier Transform Module used by DFT, FFT, RFFT
 */
export class FourierTransform {
  /**
   *
   * @param {number} bufferSize The size of the sample buffer to be computed
   * @param {number} sampleRate The sampleRate of the buffer (eg. 44100)
   */
  constructor(bufferSize, sampleRate) {
    // @type {number}
    const bandWidth = 2 / bufferSize * sampleRate / 2;
    // @type {Float64Array}
    const spectrum = new Float64Array(bufferSize / 2);
    // @type {Float64Array}
    const real = new Float64Array(bufferSize);
    // @type {Float64Array}
    const imag = new Float64Array(bufferSize);
    // @type {number}
    const peakBand = 0;
    // @type {number}
    const peak = 0;

    // property
    Object.assign(this, {
      bufferSize,
      sampleRate,
      bandWidth,
      spectrum,
      real,
      imag,
      peakBand,
      peak,
    });
  }
  /**
   * Calculates the *middle* frequency of an FFT band.
   * @param {number} index The index of the FFT band.
   * @returns {number} The middle frequency in Hz.
   */
  getBandFrequency(index) {
    const bandWidth = this.bandWidth;
    return bandWidth * index + bandWidth / 2;
  }
  /**
   *
   * @param {number} bufferSize The size of the sample buffer to be computed
   * @returns {Float64Array} spectrum
   */
  calculateSpectrum(bufferSize) {
    // @type {Float64Array}
    const spectrum = this.spectrum;
    // @type {Float64Array}
    const real = this.real;
    // @type {Float64Array}
    const imag = this.imag;
    // @type {number}
    const bSi = 2 / bufferSize;
    // iterator
    spectrum.map((spec, index) => {
      const realValue = real[index];
      const imagValue = imag[index];
      const mag = bSi * Math.sqrt(realValue * realValue + imagValue * imagValue);
      if (mag > this.peak) {
        this.peakBand = index;
        this.peak = mag;
      }
      return mag;
    });

    // Float64Array
    return spectrum;
  }
}
