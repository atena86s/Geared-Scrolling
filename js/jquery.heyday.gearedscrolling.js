/*
 *
 * Copyright (c) 2010 heyday (dev [at] heyday [dot] co [dot] nz)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license
 *
 */

/**
 *
 * jquery.heyday.gearedscrolling
 * Synchronise the scrolling of columns within a container.
 *
 * @name     jquery.heyday.gearedscrolling
 * @version  0.1
 * @author   James Goodman (james [at] heyday [dot] co [dot] nz)
 * @requires jQuery
 *
 */

/*global jQuery, window */

"use strict";

(function ($) {

	function GearedScrolling(columnHolder, options) {
		var publ = {}, priv = {};


		priv.defaults = {
			columnSelector: '.column',
			shortColumnClass: 'short',
			shortColumnSelector: '.short',
			tallColumnClass: 'tall',
			tallColumnSelector: '.tall',
			tallMarkerClass: 'tall'
		};


		priv.init = function (columnHolder, options) {
			priv.columnHolder = $(columnHolder);

			priv.settings = $.extend(priv.defaults, options);

			priv.initVariables();
			priv.storeColumns();

			priv.storePageHeights();
			priv.storeScrollTop();

			priv.calculateMaxHeight();
			priv.findHighestColumn();
			priv.splitColumnsByHeight();

			priv.storeColumnTopOffset();
			priv.markTallestColumn();

			priv.calculateMinMaxScrollTop();

			priv.addEventHandlers();
		};


		priv.initVariables = function () {
			priv.columns = null;

			priv.windowHeight = 0;
			priv.documentHeight = 0;

			priv.scrollTop = 0;

			priv.minScrollTop = 0;
			priv.maxScrollTop = 0;

			priv.maxHeight = 0;

			priv.columnTopOffset = 0;

			priv.active = true;
			
			priv.shortColumns = null;
			priv.tallColumn = null;
		};


		priv.storeColumns = function () {
			priv.columns = priv.columnHolder.find(priv.settings.columnSelector);
		};


		priv.storePageHeights = function () {
			priv.windowHeight = $(window).height();
			priv.documentHeight = $(document).height();
		};


		priv.storeScrollTop = function () {
			priv.scrollTop = $(window).scrollTop();
		};


		priv.calculateMaxHeight = function () {
			priv.columns.each(function () {
				var column, columnHeight;

				column = $(this);
				columnHeight = column.outerHeight();

				if (columnHeight > priv.maxHeight) {
					priv.maxHeight = columnHeight;
				}
			});
		};


		priv.findHighestColumn = function () {
			priv.columns.each(function () {
				var column, columnHeight;

				column = $(this);
				columnHeight = column.outerHeight();

				if (columnHeight < priv.maxHeight) {
					column.addClass(priv.settings.shortColumnClass);
				}

				if (columnHeight === priv.maxHeight) {
					column.addClass(priv.settings.tallColumnClass);
				}
			});
		};


		priv.splitColumnsByHeight = function () {
			priv.shortColumns = priv.columnHolder.find(priv.settings.shortColumnSelector);
			priv.tallColumn = priv.columnHolder.find(priv.settings.tallColumnSelector);
		};


		priv.storeColumnTopOffset = function () {
			priv.columnTopOffset = priv.tallColumn.offset().top;
		};


		priv.markTallestColumn = function () {
			priv.columnHolder.addClass(priv.settings.tallMarkerClass + (priv.tallColumn.index(priv.settings.columnSelector) + 1));
		};


		priv.calculateMinMaxScrollTop = function () {
			priv.minScrollTop = 0;
			priv.maxScrollTop = (priv.documentHeight - priv.windowHeight) - priv.columnTopOffset;
		};


		priv.addEventHandlers = function () {
			priv.addScrollHandler();
			priv.addResizeHandler();
		};


		priv.addScrollHandler = function () {
			$(window).bind('scroll.synccol', function () {
				var scrollTop, tallOffset, columnScrollTop;

				scrollTop = $(window).scrollTop();

				tallOffset = scrollTop - priv.columnTopOffset;

				columnScrollTop = Math.max(tallOffset, priv.minScrollTop);
				columnScrollTop = Math.min(columnScrollTop, priv.maxScrollTop);

				priv.shortColumns.each(function () {
					var top;

					top = columnScrollTop * ((priv.maxHeight - $(this).height()) / (priv.documentHeight - (priv.windowHeight + priv.columnTopOffset)));

					$(this).css('top', Math.round(top));
                    
				});
			});
		};


		priv.addResizeHandler = function () {
			$(window).bind('resize.synccol', function () {
				priv.storePageHeights();
				priv.calculateMinMaxScrollTop();
				$(window).trigger('scroll.synccol');
			});
		};


		priv.removeEventHandlers = function () {
			$(window).unbind('resize.synccol');
			$(window).unbind('scroll.synccol');
		};


		publ.activate = function () {
			if (!priv.active) {
				priv.active = true;
				priv.addEventHandlers();
				$(window).trigger('resize.synccol');
			}
		};


		publ.deactivate = function () {
			if (priv.active) {
				priv.active = false;
				priv.removeEventHandlers();
				priv.shortColumns.animate({
					top: 0
				}, 1000);
			}
		};


		priv.init(columnHolder, options);


		return publ;
	}

	$.fn.gearedscrolling = function (options) {
		var instances = [];

		this.each(function () {
			instances.push(new GearedScrolling(this, options));
		});

		return (instances.length === 1) ? instances[0] : instances;
	};

}(jQuery));