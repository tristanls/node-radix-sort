/*

index.js - radix sort

The MIT License (MIT)

Copyright (c) 2013 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

var radixSort = module.exports = function radixSort (array, d, ascending) {
    ascending = (typeof ascending === "undefined") ? true : ascending;
    var digits, i, j, index;
    if (typeof d === "undefined") {
        d = 0;
        for (i = 0; i < array.length; i++) {
            digits = array[i].toString().length;
            if (digits > d) d = digits;
        }
    }
    // counting sort (stable) on digit d
    var result = new Array(array.length);
    var workingCopy = new Array(10);
    // because we are doing counting sort multiple times, we are going to
    // reuse `array` and `result` and alternate which one is being read
    // and which one is being populated using the `toResult` flag
    var toResult = true;
    for (i = 1; i <= d; i++) {
        // 1 is least significant digit (ones)
        // 2 is next significant digit (tens), etc..
        for (j = 0; j < 10; j++) {
            workingCopy[j] = 0;
        }
        for (j = 0; j < array.length; j++) {
            var value = toResult ? array[j] : result[j];
            digits = value.toString();
            if (digits.length < i) {
                workingCopy[0]++;
            } else {
                workingCopy[digits[digits.length - i]]++;
            }
        }
        if (ascending) {
            for (j = 1; j < workingCopy.length; j++) {
                workingCopy[j] = workingCopy[j] + workingCopy[j - 1];
            }
        } else {
            for (j = workingCopy.length - 2; j >= 0; j--) {
                workingCopy[j] = workingCopy[j] + workingCopy[j + 1];
            }
        }
        for (j = array.length - 1; j >= 0; j--) {
            digits = toResult ? array[j].toString() : result[j].toString();
            if (digits.length < i) {
                index = workingCopy[0] - 1
                workingCopy[0]--;
            } else {
                index = workingCopy[digits[digits.length - i]] - 1;
                workingCopy[digits[digits.length - i]]--;
            }
            toResult ? result[index] = array[j] : array[index] = result[j];
        }
        toResult = !toResult;
    }
    return toResult ? array : result;
};