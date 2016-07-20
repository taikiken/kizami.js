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

export class MathUtil {
  /**
   * Returns the hyperbolic sine of the number, defined as (exp(number) - exp(-number))/2
   * @see http://phpjs.org/functions/sinh
   *
   * @example
   * MathUtil.sinh(-0.9834330348825909);
   * // returns: -1.1497971402636502
   *
   * @param {number} arg
   * @returns {number} the hyperbolic sine of the number, defined as (exp(number) - exp(-number))/2
   */
  static sinh(arg) {
    // Returns the hyperbolic sine of the number, defined as (exp(number) - exp(-number))/2
    //
    // version: 1004.2314
    // discuss at: http://phpjs.org/functions/sinh    // +   original by: Onno Marsman
    // *     example 1: sinh(-0.9834330348825909);
    // *     returns 1: -1.1497971402636502
    return (Math.exp(arg) - Math.exp(-arg)) / 2;
  }
}
