/*
 *
 * Copyright (c) 2009 heyday (dev [at] heyday [dot] co [dot] nz)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license
 *
 */

/**
 *
 * jquery.heyday.clamp
 * Clamp a value between two limits (or have it roll around using the rotate mode)
 *
 * @name     jquery.heyday.clamp
 * @version  0.1
 * @author   James Goodman (james [at] heyday [dot] co [dot] nz)
 * @requires jQuery
 *
 */

/*global jQuery */

"use strict";

(function ($) {

	$.clamp = function (value, lowerBound, upperBound, mode) {

		if (typeof mode === 'undefined') {
			mode = 'clamp';
		}

		if (mode === 'rotate') {
			if (value < lowerBound) {
				value = upperBound;
			}

			if (value > upperBound) {
				value = lowerBound;
			}
		} else {
			value = Math.max(value, lowerBound);
			value = Math.min(value, upperBound);
		}

		return value;

	};

}(jQuery));