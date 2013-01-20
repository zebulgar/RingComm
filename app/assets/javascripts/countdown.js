// Countdown class
var Countdown = function (settings) {

	var self = this;

	self.holder = $("#" + settings.holder_id);

	//  if there is no element with this id - do not apply plugin
	if (!self.holder[0]) return;


	if (!settings.holder_width) settings.holder_width = 545;

	var current_date = (new Date()).getTime();

	// constants
	var ONE_DAY_SECONDS = 86400000,
		MAIN_SECTION_MARGIN_BOTTOM = 35,
		MAIN_SECTION2_PADDING = 20,
		COUNTDOWN_PADDING = 20,
		COUNTDOWN_TITLE_FONT_SIZE = 18,
		PROGRESS_LINE_HEIGHT = 25;


	if (!settings.start_work || (settings.start_work > current_date)) settings.start_work = current_date - 2 * ONE_DAY_SECONDS;

	if (!settings.end_work) settings.end_work = current_date + 2 * ONE_DAY_SECONDS;

	// progress bar color
	if (!settings.progress_bar_color) settings.progress_bar_color = "yellow"

	// number styles
	if (!settings.fill) settings.fill = "#fcd116";
	if (!settings.stroke) settings.stroke = "#6b6b6b";
	if (!settings.fill_opacity) settings.fill_opacity = 0.6;
	if (!settings.stroke_width) settings.stroke_width = 0.8;


	var countdown_width = settings.holder_width;
		countdown_item_width = Math.floor(countdown_width * 160 / 730),
		countdown_item_height = Math.floor(countdown_width * 120 / 730),
		countdown_margin = Math.floor(countdown_width * 27 / 730),
		number_scale_x = (countdown_item_width / 160).toFixed(2) * 1,
		number_scale_y = (countdown_item_height / 120).toFixed(2) * 1;

	self.countdown_template = '' +
		'<div class="main_section" style="width: 100%; margin-bottom: ' + (Math.ceil(MAIN_SECTION_MARGIN_BOTTOM * number_scale_x)) + 'px;">' +
			'<div class="main_section2" style="padding: ' + (Math.ceil(MAIN_SECTION2_PADDING * number_scale_x)) + 'px 0">' +
				'<div id="work_limits_' + settings.holder_id + '" class="work_limits clearfix">' +
					'<div id="start_working_' + settings.holder_id + '" class="start_working"><span class="limit_title">Today:</span>&nbsp;&nbsp;<span class="limit_date"></span></div>' +
					'<div id="end_working_' + settings.holder_id + '" class="end_working"><span class="limit_title">Ring Premiere:</span>&nbsp;&nbsp;<span class="limit_date"></span></div>' +
				'</div>' +
				'<div id="countdown_' + settings.holder_id + '" class="countdown clearfix" style="padding: ' + (Math.ceil(COUNTDOWN_PADDING * number_scale_x)) + 'px 0">' +
					'<div class="time_block">' +
						'<div id="countdown_days_' + settings.holder_id + '" class="time_block_number"></div>' +
					'</div>' +
					'<div class="time_block" style="margin-left: ' + countdown_margin + 'px">' +
						'<div id="countdown_hours_' + settings.holder_id + '" class="time_block_number"></div>' +
					'</div>' +
					'<div class="time_block" style="margin-left: ' + countdown_margin + 'px">' +
						'<div id="countdown_minutes_' + settings.holder_id + '" class="time_block_number"></div>' +
					'</div>' +
					'<div class="time_block" style="margin-left: ' + countdown_margin + 'px">' +
						'<div id="countdown_seconds_' + settings.holder_id + '" class="time_block_number"></div>' +
					'</div>' +
				'</div>' +
				'<div id="countdown_title_' + settings.holder_id + '" class="countdown_title clearfix" style="font-size: ' + Math.ceil(COUNTDOWN_TITLE_FONT_SIZE * number_scale_x) + 'px; line-height: ' + Math.ceil((COUNTDOWN_TITLE_FONT_SIZE + 4) * number_scale_x) + 'px">' +
					'<div class="countdown_item_title" style="width: ' + (countdown_item_width + 2) + 'px;">Days</div>' +
					'<div class="countdown_item_title" style="margin-left: ' + countdown_margin + 'px; width: ' + (countdown_item_width + 2) + 'px;">Hours</div>' +
					'<div class="countdown_item_title" style="margin-left: ' + countdown_margin + 'px; width: ' + (countdown_item_width + 2) + 'px;">Minutes</div>' +
					'<div class="countdown_item_title" style="margin-left: ' + countdown_margin + 'px; width: ' + (countdown_item_width + 2) + 'px;">Seconds</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div id="construction_progress_' + settings.holder_id + '" class="construction_progress" style="width: ' + (settings.holder_width - 6) +  'px; height: ' + Math.round(25 * number_scale_y) + 'px;">' +
			'<div id="progress_line_' + settings.holder_id + '" class="progress_line ' + settings.progress_bar_color + '" style="height: ' + Math.ceil(PROGRESS_LINE_HEIGHT * number_scale_y) + 'px;"></div>' +
		'</div>'

	// function that returns object with dates difference
	self.dateDifference = function (start_works_date, end_works_date) {
		var difference = end_works_date - start_works_date;

		return (isNaN(difference) || difference <= 0) ? {s : 0, m : 0, h : 0, d : 0} : {
			s : Math.floor(difference / 1000 % 60),    // seconds
			m : Math.floor(difference / 60000 % 60),   // minutes
			h : Math.floor(difference / 3600000 % 24), // hours
			d : Math.floor(difference / 86400000)      // days
		}
	};

	self.getFormatedDate = function(current_date, end_works_date) {

		// get difference for current date and end working day
		var time_obj = self.dateDifference(current_date, end_works_date);

		time_obj.d = time_obj.d.toString();
		time_obj.h = time_obj.h.toString();
		time_obj.m = time_obj.m.toString();
		time_obj.s = time_obj.s.toString();

		for (var i in time_obj) {
			// if value of date item has one number - adding "0" before
			if (time_obj[i].length == 1) time_obj[i] = "0" + time_obj[i];

			// if value of date is negative set all date items to "00",
			// it means that the working date is expired
			if (time_obj[i][0] && time_obj[i][0] == "-") {
				var zeroD = "00";
				time_obj.d = time_obj.h = time_obj.m = time_obj.s = zeroD;

				break;
			}
		}

		return time_obj;
	}

	self.hideWorkLimits = function() {
		$("#work_limits_" + settings.holder_id).hide();
	}

	self.hideCountdownTitle = function() {
		$("#countdown_title_" + settings.holder_id).hide();
	}

	self.hideProgressBar = function() {
		$("#construction_progress_" + settings.holder_id).hide();
	}

	// set value for progress bar and animate it on start
	self.setProgress = function(start_works_date, current_date, end_works_date) {
		var start = start_works_date,
			current = current_date - start,
			end = end_works_date - start;
		
		var percent = current / end;

		if (percent >= 1) percent = 1;

		$("#progress_line_" + settings.holder_id).animate({
			width : Math.floor(($("#construction_progress_" + settings.holder_id).width()) * percent)
		}, 2000);
	};

	// init countdown
	self.Init = function(start_works_date, end_works_date) {

		// append html template for counter
		self.holder.append(self.countdown_template);

		// set text for "Start Time" and "End Time"
		$("#start_working_" + settings.holder_id + " span.limit_date").text(new Date(start_works_date).toLocaleDateString());
		$("#end_working_" + settings.holder_id + " span.limit_date").text(new Date(end_works_date).toLocaleDateString());

		if (!settings.show_working_dates || (countdown_width < 500)) self.hideWorkLimits();
		if (countdown_width < 400) self.hideCountdownTitle();
		if (!settings.show_progress_bar) self.hideProgressBar();

		// set svg/vml areas for date items
		var r1 = Raphael("countdown_days_" + settings.holder_id, countdown_item_width, countdown_item_height);
		var r2 = Raphael("countdown_hours_" + settings.holder_id, countdown_item_width, countdown_item_height);
		var r3 = Raphael("countdown_minutes_" + settings.holder_id, countdown_item_width, countdown_item_height);
		var r4 = Raphael("countdown_seconds_" + settings.holder_id, countdown_item_width, countdown_item_height);

		// set default style for countdown numbers
		var style_object = {fill: settings.fill, stroke:  settings.stroke, "fill-opacity":  settings.fill_opacity, "stroke-width": settings.stroke_width, "stroke-linecap":"round", translation:"0 0"};

		var number1_x = 7;
		var number2_x = Math.round(countdown_item_width / 2 + 4);

		// scale each number and set default position
		var letter1 = r1.path(helvetica["0"]).attr(style_object).scale(number_scale_x, number_scale_y, 0, 0).translate(number1_x, 1);
		var letter2 = r1.path(helvetica["0"]).attr(style_object).scale(number_scale_x, number_scale_y, countdown_item_width / 2, 1).translate(number2_x, 1);
		var letter3 = r2.path(helvetica["0"]).attr(style_object).scale(number_scale_x, number_scale_y, 0, 0).translate(number1_x, 1);
		var letter4 = r2.path(helvetica["0"]).attr(style_object).scale(number_scale_x, number_scale_y, countdown_item_width / 2, 0).translate(number2_x, 1);
		var letter5 = r3.path(helvetica["0"]).attr(style_object).scale(number_scale_x, number_scale_y, 0, 0).translate(number1_x, 1);
		var letter6 = r3.path(helvetica["0"]).attr(style_object).scale(number_scale_x, number_scale_y, countdown_item_width / 2, 0).translate(number2_x, 1);
		var letter7 = r4.path(helvetica["0"]).attr(style_object).scale(number_scale_x, number_scale_y, 0, 0).translate(number1_x, 1);
		var letter8 = r4.path(helvetica["0"]).attr(style_object).scale(number_scale_x, number_scale_y, countdown_item_width / 2, 0).translate(number2_x, 1);

		// start 1-second interval
		var getCurrentTimeInterval = setInterval(function () {

			// get current date
			var current_date = new Date();

			var date_obj = self.getFormatedDate(current_date, end_works_date);

			// set animation of Days
			letter1.animate({path:helvetica[(date_obj.d).substr(0, 1)]}, 0);
			letter2.animate({path:helvetica[(date_obj.d).substr(1)]}, 0);

			// set animation of Hours
			letter3.animate({path:helvetica[(date_obj.h).substr(0, 1)]}, 0);
			letter4.animate({path:helvetica[(date_obj.h).substr(1)]}, 0);

			// set animation of Minutes
			letter5.animate({path:helvetica[(date_obj.m).substr(0, 1)]}, 0);
			letter6.animate({path:helvetica[(date_obj.m).substr(1)]}, 0);

			// set animation of Seconds
			letter7.animate({path:helvetica[(date_obj.s).substr(0, 1)]}, 0);
			letter8.animate({path:helvetica[(date_obj.s).substr(1)]}, 0);

			// apply progress bar
			self.setProgress(start_works_date, current_date, end_works_date);

		}, 1000);
	}

	return self.Init(settings.start_work, settings.end_work);
};

