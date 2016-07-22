/**
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
 */

import { MathUtil } from '../util/MathUtil';

const typeSymbol = Symbol();
/**
 * Biquad filter
 *
 *  Created by Ricard Marxer <email@ricardmarxer.com> on 2010-05-23.
 *  Copyright 2010 Ricard Marxer. All rights reserved.
 *
 * Implementation based on:
 * @see http://www.musicdsp.org/files/Audio-EQ-Cookbook.txt
 */
export class Biquad {
  /**
   *
   * @param {number} type
   * @param {number} sampleRate
   */
  constructor(type, sampleRate) {
    // L
    const x1l = 0;
    const x2l = 0;
    const y1l = 0;
    const y2l = 0;

    // R
    const x1r = 0;
    const x2r = 0;
    const y1r = 0;
    const y2r = 0;

    const b0 = 1;
    const a0 = 1;

    const b1 = 0;
    const a1 = 0;

    const b2 = 0;
    const a2 = 0;

    // 1
    const b0a0 = b0 / a0;
    // 0
    const b1a0 = b1 / a0;
    // 0
    const b2a0 = b2 / a0;
    // 0
    const a1a0 = a1 / a0;
    // 0
    const a2a0 = a2 / a0;

    // "wherever it's happenin', man."  Center Frequency or
    // Corner Frequency, or shelf midpoint frequency, depending
    // on which filter type.  The "significant frequency".
    const f0 = 3000;

    // used only for peaking and shelving filters
    const dBgain = 12;

    // the EE kind of definition, except for peakingEQ in which A*Q is
    // the classic EE Q.  That adjustment in definition was made so that
    // a boost of N dB followed by a cut of N dB for identical Q and
    // f0/Fs results in a precisely flat unity gain filter or "wire".
    const q = 1;

    // the bandwidth in octaves (between -3 dB frequencies for BPF
    // and notch or between midpoint (dBgain/2) gain frequencies for
    // peaking EQ
    const bw = -3;

    // a "shelf slope" parameter (for shelving EQ only).  When S = 1,
    // the shelf slope is as steep as it can be and remain monotonically
    // increasing or decreasing gain with frequency.  The shelf slope, in
    // dB/octave, remains proportional to S for all other values for a
    // fixed f0/Fs and dBgain.
    const s = 1;

    /**
     * 引数の type 属性を保存します
     * @private
     * @type {number}
     */
    this[typeSymbol] = type;

    // make property
    Object.assign(this, {
      parameterType: Biquad.Q,
      type,
      sampleRate,
      // l
      x1l,
      x2l,
      y1l,
      y2l,
      // r
      x1r,
      x2r,
      y1r,
      y2r,
      // ab
      b0,
      a0,
      b1,
      a1,
      b2,
      a2,
      // NN / a0
      b0a0,
      b1a0,
      b2a0,
      a1a0,
      a2a0,
      // const
      f0,
      dBgain,
      q,
      bw,
      s,
    });
  }
  // ----------------------------------------
  // CONST
  // ----------------------------------------
  // Biquad filter types
  /**
   * H(s) = 1 / (s^2 + s/Q + 1)
   * @const LPF
   * @returns {number} type 0 を返します
   * @default 0
   */
  static get LPF() {
    return 0;
  }
  /**
   * H(s) = s^2 / (s^2 + s/Q + 1)
   * @const HPF
   * @returns {number} type 1 を返します
   * @default 1
   */
  static get HPF() {
    return 1;
  }
  /**
   * H(s) = s / (s^2 + s/Q + 1)  (constant skirt gain, peak gain = Q)
   * @const BPF_CONSTANT_SKIRT
   * @returns {number} type 2 を返します
   * @default 2
   */
  static get BPF_CONSTANT_SKIRT() {
    return 2;
  }
  /**
   * H(s) = (s/Q) / (s^2 + s/Q + 1)      (constant 0 dB peak gain)
   * @const BPF_CONSTANT_PEAK
   * @returns {number} type 2 を返します
   * @default 2
   */
  static get BPF_CONSTANT_PEAK() {
    return 2;
  }
  /**
   * H(s) = (s^2 + 1) / (s^2 + s/Q + 1)
   * @const NOTCH
   * @returns {number} type 4 を返します
   * @default 4
   */
  static get NOTCH() {
    return 4;
  }
  /**
   * H(s) = (s^2 - s/Q + 1) / (s^2 + s/Q + 1)
   * @const APF
   * @returns {number} type 5 を返します
   * @default 5
   */
  static get APF() {
    return 5;
  }
  /**
   * H(s) = (s^2 + s*(A/Q) + 1) / (s^2 + s/(A*Q) + 1)
   * @const PEAKING_EQ
   * @returns {number} type 6 を返します
   * @default 6
   */
  static get PEAKING_EQ() {
    return 6;
  }
  /**
   * H(s) = A * (s^2 + (sqrt(A)/Q)*s + A)/(A*s^2 + (sqrt(A)/Q)*s + 1)
   * @const PEAKING_EQ
   * @returns {number} type 7 を返します
   * @default 7
   */
  static get LOW_SHELF() {
    return 7;
  }
  /**
   * H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A)
   * @const HIGH_SHELF
   * @returns {number} type 8 を返します
   * @default 8
   */
  static get HIGH_SHELF() {
    return 8;
  }

  // Biquad filter parameter types
  /**
   * Biquad filter parameter types Q
   * @const Q
   * @returns {number} type 1 を返します
   * @default 1
   */
  static get Q() {
    return 1;
  }
  /**
   * Biquad filter parameter types BW
   *
   * SHARED with BACKWARDS LOOP MODE
   * @const Q
   * @returns {number} type 2 を返します
   * @default 2
   */
  static get BW() {
    return 2;
  }
  /**
   * Biquad filter parameter types S
   * @const S
   * @returns {number} type 3 を返します
   * @default 3
   */
  static get S() {
    return 3;
  }
  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   *
   * @returns {{b: *[], a: *[]}}
   */
  coefficients() {
    return {
      b: [
        this.b0,
        this.b1,
        this.b2,
      ],
      a: [
        this.a0,
        this.a1,
        this.a2,
      ],
    };
  }
  /**
   * filter type を設定します
   * @param {number} type filter type
   */
  setFilterType(type) {
    this.type = type;
    this.recalculateCoefficients(this[typeSymbol]);
  }
  /**
   * sample rate を設定します
   * @param {number} rate sample rate
   */
  setSampleRate(rate) {
    this.sampleRate = rate;
    this.recalculateCoefficients(this[typeSymbol]);
  }
  /**
   * Q parameter type property を設定します
   * @param {number} q parameter type
   */
  setQ(q) {
    this.parameterType = Biquad.Q;
    this.q = Math.max(Math.min(q, 115.0), 0.001);
    this.recalculateCoefficients(this[typeSymbol]);
  }
  /**
   * BW parameter type property を設定します
   * @param {number} bw BW parameter type
   */
  setBW(bw) {
    this.parameterType = Biquad.BW;
    this.bw = bw;
    this.recalculateCoefficients(this[typeSymbol]);
  }
  /**
   * S parameter type property を設定します
   * @param {number} s S parameter type
   */
  setS(s) {
    this.parameterType = Biquad.S;
    this.s = Math.max(Math.min(s, 5.0), 0.0001);
    this.recalculateCoefficients(this[typeSymbol]);
  }
  /**
   * F0 property を設定します
   * @param freq F0 property
   */
  setF0(freq) {
    this.f0 = freq;
    this.recalculateCoefficients(this[typeSymbol]);
  }
  /**
   * dBgain property を設定します
   * @param {number} gain dBgain
   */
  setDbGain(gain) {
    this.dBgain = gain;
    this.recalculateCoefficients(this[typeSymbol]);
  }
  /**
   * re calculate coefficients
   * @param {number} type
   */
  recalculateCoefficients(type) {
    const answer = this.peaking(type);
    const [consW0, sinW0, alpha] = this.alpha(answer);
    const [b0, b1, b2, a0, a1, a2] = this.coeff(consW0, sinW0, alpha, answer);
    // copy to this property
    this.b0 = b0;
    this.b1 = b1;
    this.b2 = b2;
    this.a0 = a0;
    this.a1 = a1;
    this.a2 = a2;
    // calculate
    this.b0a0 = b0 / a0;
    this.b1a0 = b1 / a0;
    this.b2a0 = b2 / a0;
    this.a1a0 = a1 / a0;
    this.a2a0 = a2 / a0;
  }
  /**
   * for peaking and shelving EQ filters only
   * @param {number} type
   * @returns {number}
   */
  peaking(type) {
    // for peaking and shelving EQ filters only
    switch (type) {
      case Biquad.PEAKING_EQ:
      case Biquad.LOW_SHELF:
      case Biquad.HIGH_SHELF: {
        return Math.pow(10, this.dBgain / 40);
      }
      default: {
        return Math.sqrt(Math.pow(10, this.dBgain / 20));
      }
    }
  }
  /**
   * alpha を基に cosW0, sinW0 を計算します
   * @param {number} answer 計算基礎
   * @returns {*[]} cosW0, sinW0, alpha
   */
  alpha(answer) {
    const w0 = Biquad.TWO_PI * this.f0 / this.sampleRate;
    const cosW0 = Math.cos(w0);
    const sinW0 = Math.sin(w0);
    const results = [cosW0, sinW0];

    switch (this.parameterType) {
      case Biquad.Q: {
        results.push(sinW0 / 2 * this.q);
        break;
      }
      case Biquad.BW: {
        results.push(sinW0 * MathUtil.sinh(Math.LN2 / 2 * this.bw * w0 / sinW0));
        break;
      }
      case Biquad.S: {
        results.push(sinW0 / 2 * Math.sqrt((answer + 1 / answer) * (1 / this.s - 1) + 2));
        break;
      }
      default: {
        results.push(0);
        break;
      }
    }
    return results;
  }
  /**
   * FYI: The relationship between bandwidth and Q is
   * 1/Q = 2*sinh(ln(2)/2*BW*w0/sin(w0))     (digital filter w BLT)
   * or   1/Q = 2*sinh(ln(2)/2*BW)             (analog filter prototype)
   *
   * The relationship between shelf slope and Q is
   * 1/Q = sqrt((A + 1/A)*(1/S - 1) + 2)
   *
   * @param {number} cosW0
   * @param {number} sinW0
   * @param {number} alpha
   * @param {number} answer
   * @returns {*[]} b0, b1, b2, a0, a1, a2
   */
  coeff(cosW0, sinW0, alpha, answer) {
    // return [b0, b1, b2, a0, a1, a2]
    switch (this.type) {
      case Biquad.LPF: {
        const oneMinusCosW0 = 1 - cosW0;
        return [
          oneMinusCosW0 / 2,
          oneMinusCosW0,
          (oneMinusCosW0) / 2,
          1 + alpha,
          -2 * cosW0,
          1 - alpha,
        ];
      }
      case Biquad.HPF: {
        const onePlusCosW0 = 1 + cosW0;
        return [
          onePlusCosW0 / 2,
          -onePlusCosW0,
          onePlusCosW0 / 2,
          1 + alpha,
          -2 * cosW0,
          1 - alpha,
        ];
      }
      case Biquad.BPF_CONSTANT_SKIRT: {
        const sinW0Half = sinW0 / 2;
        return [
          sinW0Half,
          0,
          -sinW0Half,
          1 + alpha,
          -2 * cosW0,
          1 - alpha,
        ];
      }
      case Biquad.BPF_CONSTANT_PEAK: {
        return [
          alpha,
          0,
          -alpha,
          1 + alpha,
          -2 * cosW0,
          1 - alpha,
        ];
      }
      case Biquad.NOTCH: {
        return [
          1,
          -2 * cosW0,
          1 + alpha,
          1 + alpha,
          -2 * cosW0,
          1 - alpha,
        ];
      }
      case Biquad.APF: {
        return [
          1 - alpha,
          -2 * cosW0,
          1 + alpha,
          1 + alpha,
          -2 * cosW0,
          1 - alpha,
        ];
      }
      case Biquad.PEAKING_EQ: {
        return [
          1 + alpha * answer,
          -2 * cosW0,
          1 - alpha * answer,
          1 + alpha / answer,
          -2 * cosW0,
          1 - alpha / answer,
        ];
      }
      case Biquad.LOW_SHELF: {
        const coeff = sinW0 * Math.sqrt((answer ^ 2 + 1) * (1 / this.s - 1) + 2 * answer);
        const aPlusOne = answer + 1;
        const aMinusOne = answer - 1;
        return [
          answer * (aPlusOne - aMinusOne * cosW0 + coeff),
          answer * (aMinusOne - aPlusOne * cosW0),
          2 * answer * (aPlusOne - aMinusOne * cosW0),
          answer * (aPlusOne - aMinusOne * cosW0 - coeff),
          aPlusOne + aMinusOne * cosW0 + coeff,
          -2 * (aMinusOne + aPlusOne * cosW0),
          aPlusOne + aMinusOne * cosW0 - coeff,
        ];
      }
      case Biquad.HIGH_SHELF: {
        const coeff = sinW0 * Math.sqrt((answer ^ 2 + 1) * (1 / this.s - 1) + 2 * answer);
        const aPlusOne = answer + 1;
        const aMinusOne = answer - 1;
        return [
          answer * (aPlusOne + aMinusOne * cosW0 + coeff),
          -2 * answer * (aMinusOne + aPlusOne * cosW0),
          answer * (aPlusOne + aMinusOne * cosW0 - coeff),
          aPlusOne - aMinusOne * cosW0,
          2 * (aMinusOne - aPlusOne * cosW0),
          aPlusOne - aMinusOne * cosW0 - coeff,
        ];
      }
      default: {
        throw new Error(`illegal type: ${this.type}`);
      }
    }
  }
  /**
   *
   *  y[n] = (b0/a0)*x[n] + (b1/a0)*x[n-1] + (b2/a0)*x[n-2] - (a1/a0)*y[n-1] - (a2/a0)*y[n-2]
   *
   * @param {Float64Array|Array} buffers
   * @returns {Float64Array}
   */
  process(buffers) {
    const output = new Float64Array(buffers.length);
    // loop
    buffers.forEach((buffer, index) => {
      const calculated = this.b0a0 * buffer +
        this.b1a0 * this.x1l +
        this.b2a0 * this.x2l -
        this.a1a0 * this.y1l -
        this.a2a0 * this.y2l;
      output[index] = calculated;

      this.y2l = this.y1l;
      this.y1l = calculated;
      this.x2l = this.x1l;
      this.x1l = buffer;
    });

    return output;
  }
  /**
   *
   *  y[n] = (b0/a0)*x[n] + (b1/a0)*x[n-1] + (b2/a0)*x[n-2] - (a1/a0)*y[n-1] - (a2/a0)*y[n-2]
   *
   * @param {Float64Array} buffers
   * @returns {Float64Array}
   */
  processStereo(buffers) {
    const output = new Float64Array(buffers.length);
    // loop
    for (let i = 0, limit = buffers.length / 2; i < limit; i = (i + 1) | 0) {
      const iW = i * 2;
      const iW1 = iW + 1;

      // left
      const left =
        this.b0a0 * buffers[iW] +
        this.b1a0 * this.x1l +
        this.b2a0 * this.x2l -
        this.a1a0 * this.y1l -
        this.a2a0 * this.y2l;
      output[iW] = left;

      this.y2l = this.y1l;
      this.y1l = left;
      this.x2l = this.x1l;
      this.x1l = buffers[iW];

      // right
      const right =
        this.b0a0 * buffers[iW1] +
        this.b1a0 * this.x1r +
        this.b2a0 * this.x2r -
        this.a1a0 * this.y1r -
        this.a2a0 * this.y2r;
      output[iW1] = right;

      this.y2r = this.y1r;
      this.y1r = right;
      this.x2r = this.x1r;
      this.x1r = buffers[iW1];
    }

    return output;
  }
}
