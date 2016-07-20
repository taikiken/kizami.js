/**
 * author (at)taikiken / http://inazumatv.com
 * date 2016/07/19
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */

export class DSP {
  // constructor() {
  //
  // }
  // ----------------------------------------
  // CONST (GETTER) @read only
  // ----------------------------------------

  // Channels
  /**
   * Channels - left
   * @const LEFT
   * @returns {number} left channel number (0) を返します
   * @default 0
   */
  static get LEFT() {
    return 0;
  }
  /**
   * Channels - right
   * @const RIGHT
   * @returns {number} right channel number (1) を返します
   * @default 1
   */
  static get RIGHT() {
    return 1;
  }
  /**
   * Channels - mix
   * @const MIX
   * @returns {number} mix channel number (2) を返します
   * @default 2
   */
  static get MIX() {
    return 2;
  }

  // Waveforms
  /**
   * Waveforms - sine 波
   * @const SINE
   * @returns {number} Waveforms sine 波 (1) を返します
   * @default 1
   */
  static get SINE() {
    return 1;
  }
  /**
   * Waveforms - triangle 三角波
   * @const TRIANGLE
   * @returns {number} Waveforms triangle 三角波 (2) を返します
   * @default 2
   */
  static get TRIANGLE() {
    return 2;
  }
  /**
   * Waveforms - saw 鋸波
   * @const SAW
   * @returns {number} Waveforms saw 鋸波 (3) を返します
   * @default 3
   */
  static get SAW() {
    return 3;
  }
  /**
   * Waveforms - square 矩形波
   * @const SQUARE
   * @returns {number} Waveforms square 矩形波 (4) を返します
   * @default 4
   */
  static get SQUARE() {
    return 4;
  }

  // Filters
  /**
   * Filters - low pass filter
   *
   * @see https://ja.wikipedia.org/wiki/ローパスフィルタ
   *
   * @const LOW_PASS
   * @returns {number} Filters low pass filter (0) を返します
   * @default 0
   */
  static get LOW_PASS() {
    return 0;
  }
  /**
   * Filters - high pass filter
   *
   * @see https://ja.wikipedia.org/wiki/ローパスフィルタ
   *
   * @const HIGH_PASS
   * @returns {number} Filters high pass filter (1) を返します
   * @default 0
   */
  static get HIGH_PASS() {
    return 1;
  }
  /**
   * Filters - band pass filter
   *
   * @see https://ja.wikipedia.org/wiki/バンドパスフィルタ
   *
   * @const BAND_PASS
   * @returns {number} Filters band pass filter (2) を返します
   * @default 2
   */
  static get BAND_PASS() {
    return 2;
  }
  /**
   * Filters - notch filter
   *
   * @see https://ja.wikipedia.org/wiki/バンドストップフィルタ
   *
   * <pre>
   * ノッチフィルタ (notch filter) は、阻止帯域が狭い（Q値が高い）バンドストップフィルタである。
   * </pre>
   * @const NOTCH
   * @returns {number} Filters notch filter (3) を返します
   * @default 2
   */
  static get NOTCH() {
    return 3;
  }

  // Loop modes
  /**
   * Loop modes - off
   * @const OFF
   * @returns {number} Loop modes - off (0) を返します
   * @default 0
   */
  static get OFF() {
    return 0;
  }
  /**
   * Loop modes - fw
   * @const FW
   * @returns {number} Loop modes - fw (1) を返します
   * @default 1
   */
  static get FW() {
    return 1;
  }
  /**
   * Loop modes - bw
   * @const BW
   * @returns {number} Loop modes - bw (2) を返します
   * @default 2
   */
  static get BW() {
    return 2;
  }
  /**
   * Loop modes - fwbw
   * @const FWBW
   * @returns {number} Loop modes - fwbw (3) を返します
   * @default 2
   */
  static get FWBW() {
    return 3;
  }

  // Math
  /**
   * PI * 2
   * @const TWO_PI
   * @returns {number} PI * 2 を返します
   * @default Math.PI * 2
   */
  static get TWO_PI() {
    return Math.PI * 2;
  }

  // ----------------------------------------
  // METHOD STATIC
  // ----------------------------------------
  /**
   * Inverts the phase of a signal
   * @param {Array|*} buffers A sample buffer
   * @returns {Array|*} The inverted sample buffer
   */
  static invert(buffers) {
    return buffers.map((buffer) => -1 * buffer);
  }
  static deInterleave(channel, buffers) {
    switch (channel) {
      case DSP.LEFT: {
        return DSP.deInterleaveLeft(buffers);
      }
      case DSP.RIGHT: {
        return DSP.deInterleaveRight(buffers);
      }
      case DSP.MIX: {
        return DSP.deInterleaveMix(buffers);
      }
      default: {
        throw new Error(`illegal channel number: ${channel}`);
      }
    }
  }
  static deInterleaveLeft(buffers) {
    const left = new Float64Array(buffers.length / 2);
    left.map((buffer, index) => buffers[2 * index]);
    return left;
  }
  static deInterleaveRight(buffers) {
    const right = new Float64Array(buffers.length / 2);
    right.map((buffer, index) => buffers[2 * index + 1]);
    return right;
  }
  static deInterleaveMix(buffers) {
    const mix = new Float64Array(buffers.length / 2);
    mix.map((buffer, index) => {
      const index2 = 2 * index;
      return (buffers[index2] + buffers[index2 + 1]) / 2;
    });
    return mix;
  }
  static getChannel(channel, buffers) {
    return DSP.deInterleave(channel, buffers);
  }
  /**
   * Helper method (for Reverb) to mix two (interleaved) sample buffers. It's possible
   * to negate the second buffer while mixing and to perform a volume correction
   * on the final signal.
   *
   * @param {Array|*} sampleBuffer1 Array containing Float values or a Float64Array
   * @param {Array|*} sampleBuffer2 Array containing Float values or a Float64Array
   * @param {Boolean} negate When true inverts/flips the audio signal
   * @param {Number} volumeCorrection When you add multiple sample buffers,
   * <br>use this to tame your signal ;)
   * @returns {Float64Array} A new Float64Array interleaved buffer.
   */
  static mixSampleBuffers(sampleBuffer1, sampleBuffer2, negate, volumeCorrection) {
    const outputSamples = new Float64Array(sampleBuffer1);
    outputSamples.map((buffer, index) => {
      const sign = negate ? -1 : 1;
      return sign * sampleBuffer2[index] / volumeCorrection;
    });
    return outputSamples;
  }
  /**
   * Find RMS of signal
   * @param {Array|Float64Array|*} buffers
   * @returns {number} RMS of signal
   */
  static rms(buffers) {
    const sum = buffers.reduce((total, buffer) => total + (buffer * buffer), 0);
    return Math.sqrt(sum / buffers.length);
  }
  /**
   * Find Peak of signal
   * @param buffers
   * @returns {number} Find Peak of signal
   */
  static peak(buffers) {
    let peak = 0;
    buffers.forEach((buffer) => {
      const abs = Math.abs(buffer);
      peak = abs > peak ? abs : peak;
    });
    return peak;
  }
}

