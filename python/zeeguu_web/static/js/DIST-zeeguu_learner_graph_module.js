
/**
* Created by A.Lukjanenkovs on 21.06.2016. This DIST version generated on 21.07.2017
*/


function append_css_for_activity_graph(appendTo) {
    $(appendTo).append('<style> body {    font-size: 10px;  shape-rendering: crispEdges;}.wday {    box-sizing: border-box;    display: block;    text-anchor: middle;    font: 11px sans-serif;    padding: 2px 0px 4px;}.day {    fill: #dddddd;    stroke: #ffffff;}.month {    fill: none;    stroke: #A6A6A6;    stroke-width: 1px;}/* 1 - 9 */.RdYlGn .q0-5 {    fill: #d6e685}/* 10 - 19 */.RdYlGn .q1-5 {    fill: #8cc665}/* 20 - 29 */.RdYlGn .q2-5 {    fill: #44a340}/* 30 - 39 */.RdYlGn .q3-5 {    fill: #1e6823}/* 40+ */.RdYlGn .q4-5 {    fill: #304030}/*stylesheet style.css?e51a6469*/a {    background-color: transparent;}a:active, a:hover {    outline: 0px;}small {    font-size: 80%;}svg:not(:root) {    overflow: hidden;}row {    box-sizing: border-box;}h3, h4 {      line-height: 20px;    color: black;}h3 {    margin-top: 20px;    margin-bottom: 10px;}h4 {    margin-top: 10px;    margin-bottom: 10px;}h3 {    font-size: 24px;}h4 {    font-size: 18px;}.row {    margin-right: -15px;    margin-left: -15px;}.col-xs-4, .col-md-4, .col-footer, .col-md-10 {    position: relative;    min-height: 1px;    padding-right: 15px;    padding-left: 15px;}.col-xs-4, .col-footer {    float: left;}.col-footer {    width: 50%;}.col-xs-4 {    width: 33.3333%;} </style>');
}

function append_css_for_line_graph(appendTo) {
    $(appendTo).append('<style>     .axis path {        fill: none;        stroke: #49524c;        shape-rendering: crispEdges;    }    .axis text {        font-family: Lato;        font-size: 13px;    }    .legend {        font-size: 14px;        font-weight: bold;        font-family: "PT Sans", sans-serif;        color: #4A4A4A;        line-height: 2;    } </style>');
}

function append_css_for_piechart_graph(appendTo) {
    $(appendTo).append('<style> .pie_graph {    height: 360px;    position: relative;    width: 360px;    text-align: center;}.arc path {    stroke: #fff;}.legend {    font-size: 12px;    font-weight: bold;    font-family: "PT Sans", sans-serif;    color: #4A4A4A;    line-height: 2;}rect {    stroke-width: 2;}.pie_tooltip {    background: #eee;    box-shadow: 0 0 5px #999999;    color: #333;    display: none;    font-size: 12px;    font-family: "PT Sans", sans-serif;    padding-left: 2px;    position: absolute;    text-align: center;    margin-top: 100px;    width: 100px;    z-index: 1000;    margin-left: -430px;} </style>');
}

// defined variables for activity graph

var cellSize = 20; // cell size
var width = 60 * cellSize;
var max_width = 1200;
var height = 9 * cellSize;

var months_in_year = 12;
var week_count_in_year = 53;
var day_count_in_week = 7;
var milliseconds_in_day = 1000 * 3600 * 24;

var year = new Date().getFullYear();
var month = new Date().getMonth();
var day = new Date().getDate();

var week_format = d3.time.format("%W");
var year_format = d3.time.format("%Y");
var date_format = d3.time.format("%Y-%m-%d");

var month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var week_days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

var input_data;

// function convert_day_of_week_from_sun_to_mon
var convert_day_of_week_from_sun_to_mon = function (date) {
    return (date.getDay() + 6) % 7;
};

function week_number(date) {
    var result, week_count_in_displayed_interval;
    var days_in_month = 31;

    if ((year_format(date) - year + 1) == 0) {
        week_count_in_displayed_interval = week_format(new Date(year, month, day));
        result = (cellSize * (+week_format(date) - parseInt(week_count_in_displayed_interval)));
    } else {
        week_count_in_displayed_interval = week_format(new Date(year - 1, months_in_year - month - 1, days_in_month - day + 1));
        result = (cellSize * (+week_format(date) + parseInt(week_count_in_displayed_interval) - 1));
    }

    return result;
}

function total_bookmarks_per_displayed_period() {
    var sum = 0;
    input_data.forEach(function (entry) {
        sum = sum + parseInt(entry.count);
    });
    return sum;
}

function compute_distance_between_dates_in_days(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (milliseconds_in_day));
    return diffDays;
}

function str_to_date(str) {
    var str_parts = str.split("-");

    var extracted_day = str_parts[2];
    var extracted_month = str_parts[1] - 1;
    var extracted_year = str_parts[0];

    return new Date(extracted_year, extracted_month, extracted_day);
}

function compare_dates_strings(dict1, dict2) {
    var date1 = new Date(str_to_date(dict1.date)).getTime();
    var date2 = new Date(str_to_date(dict2.date)).getTime();
    if (date1 < date2)
        return -1;
    else if (date1 > date2)
        return 1;
    else
        return 0;
}

function longest_streak() {
    var max = 0;
    var temp = 1; // temp is 1 ,as we need count the day itself which was compared to

    if (input_data.length > 0) { // check if array is not empty
        var prev_date = "0-0-0"; // initialize variable to keep track of previous iterations date

        input_data.forEach(function (entry) {
            if (compute_distance_between_dates_in_days(str_to_date(entry.date), str_to_date(prev_date)) <= 1) {
                temp++;
            } else {
                temp = 1;
            }
            max = Math.max(max, temp);
            prev_date = entry.date;
        });
    }

    return max;
}

function current_streak() {
    var streak = 0;
    var size = input_data.length;
    var today = new Date();

    // check if the last entry date is today/yesterday, if yes proceed counting else return
    for (var i = size - 1; i >= 0; i--) {
        var last_entry_date = input_data[i].date;
        if (compute_distance_between_dates_in_days(today, str_to_date(last_entry_date)) <= 1) {
            today = str_to_date(last_entry_date);
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

function day_or_days(num) {
    if (num == 1) {
        return " day";
    } else {
        return " days";
    }
}

function draw_activity_graph(input_data_a, appendTo, months_to_show) {

    if (isNaN(months_to_show)) {
        var months_to_show = 12;
    }

    // get client window size (-55px is reserved space for names of week days on left side)
    var win_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 55;

    // check months limits
    months_to_show = Math.max(3, months_to_show);
    months_to_show = Math.min(months_to_show, Math.round(win_width / 100));

    // add attribute to the graph of how many months to show for resize functionality
    d3.select(appendTo).attr("months_to_show", months_to_show);
    // add attribute type to the graph for resize functionality
    d3.select(appendTo).attr("type", "activity");

    // needed offset for calculating right positions for draw elements
    var months_offset = 12 - months_to_show;
    // recalculating width + 55px offset for error
    width = months_to_show * 5 * cellSize + 55;


    input_data = input_data_a;

    // function which returns the style class for the color tone, depending on what is the count of the bookmarks
    // more bookmarks -> more darker tone
    var number_of_intervals = 5;
    var color_getter = d3.scale.quantize()
        .domain([0, 60])
        .range(d3.range(number_of_intervals).map(function (index) {
            return "q" + index + "-5";
        }));

    var graph_table_x = (max_width - cellSize * week_count_in_year) / 2; //edited
    var graph_table_y = height - cellSize * day_count_in_week - 1;

    var activity_graph = d3.select(appendTo).selectAll("svg")
        .data(d3.range(year, year + 1))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
        .attr("id", "containerStats")
        .append("g")
        .attr("transform", "translate(" + graph_table_x + "," + graph_table_y + ")");

    var starting_date = new Date(year - 1, month + months_offset, day + 1);
    var week_offset = week_number(starting_date);

    var day_rectangles = activity_graph.selectAll(".day")
        .data(function (year) {
            // time period of squares
            // new Date(year-1 , month, day + 1)
            return d3.time.days(starting_date, new Date(year, month, day + 1));
        })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function (date) {
            return week_number(date) - week_offset; // edited
        })
        .attr("y", function (date) {
            return convert_day_of_week_from_sun_to_mon(date) * cellSize;
        })
        .datum(date_format);

    // adding default tooltip for empty day_rectangles
    day_rectangles.append("title")
        .text(function (date) {
            return "0 translations on " + date;
        });

    // text adding

    // adding month names to the graph
    for (var index = 0 + months_offset; index < months_in_year; index++) { // edited
        var temp_year = year;
        var temp_month = month;
        var left_offset_of_matrix = 45;

        // calculating on top of which day should be printed month name
        if (day < 10) temp_month--; // on which side of the table to print month name if the month divided in half
        if (index + temp_month < months_in_year - 1) temp_year = temp_year - 1; // which year to add to the month name
        temp_month = (index + temp_month + 1) % months_in_year; // calculating correct index of the month name in the month_names array

        activity_graph.append("text")
            .attr("transform", "translate(" + (week_number(new Date(temp_year, temp_month, 4)) - week_offset + left_offset_of_matrix) + ",0)") // edited
            .style("text-anchor", "end")
            .attr("dy", "-.25em")
            .text(month_names[temp_month] + " " + temp_year);
    }

    // adding day names to the graph
    for (index = 0; index < day_count_in_week; index++) {
        activity_graph.append("text")
            .attr("transform", "translate(-8," + cellSize * (index + 1) + ")")
            .style("text-anchor", "end")
            .attr("dy", "-.25em")
            .text(week_days[index]);
    }

    // end of text adding

    var nested_input_data = d3.nest()
        .key(function (entry) {
            return entry.date;
        })
        .rollup(function (entry) {
            return entry[0].count;
        })
        .map(input_data);

    // editing tooltip for filled day_rectangles
    day_rectangles.filter(
        function (date) {
            return date in nested_input_data;
        })
        .attr("class", function (index) {
            return "day " + color_getter(nested_input_data[index]);
        })
        .select("title")
        .text(function (date) {
            return nested_input_data[date] + " translations on " + date;
        });

    input_data.sort(compare_dates_strings); // sort array based on the dates

    var html = "<br/><br/><br/>";
    html += '<div class="row" style="height: 80px; padding: 0px 50px;">';
    html += '<div class="col-xs-4 col-md-4">';
    html += "<h4>Translations in this period</h4> <h3>" + total_bookmarks_per_displayed_period() + " Total" + "</h3>";
    html += "</div>";

    html += '<div class="col-xs-4 col-md-4" style="padding-left: 40px;"> <h4>Longest streak</h4>';
    var longest_streak_res = longest_streak();
    html += "<h3>" + longest_streak_res + day_or_days(longest_streak_res) + "</h3>";
    html += "</div>";

    html += '<div class="col-xs-4 col-md-4" style="padding-left: 30px;"> <h4>Current streak</h4>';
    var current_streak_res = current_streak();
    html += "<h3>" + current_streak_res + day_or_days(current_streak_res) + "</h3>";
    html += "</div>";

    html += "</div>";

    $(html).appendTo(document.getElementById(appendTo.substring(1)));

}

function draw_line_graph(input_data, appendTo, months_to_show) {

    // get size of th client window width
    var win_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    // fetching learner_stats_data from the server and parsing(nesting) it for d3js library
    var input_data_nested = d3.nest()
        .key(function (entry) {
            return entry.name;
        })
        .entries(input_data);

    // end of the fetching and parsing learner_stats_data

    // setting up graph and its parameters
    // graph's width adjusts based on the client window size
    // max graph width is 1200px and min is 500px
    var WIDTH = Math.max(500, Math.min(1200, win_width));
    var HEIGHT = 500;

    // how many months to show
    if (isNaN(months_to_show)) {
        var months_to_show = Math.round(WIDTH / 100);
    }

    var extraHeight = 0;
    // check if 1 month was requested
    if (months_to_show != 1) {
        // check months limits
        months_to_show = Math.min(months_to_show, Math.round(win_width / 100));
        months_to_show = Math.max(5, Math.min(12, months_to_show));

        // slice array and take only part we need based on how many months to show
        input_data_nested.forEach(function (element) {
            element.values = element.values.slice(-months_to_show - 1, element.values.length);
        });
        // add attribute type to the graph for resize functionality
        d3.select(appendTo).attr("type", "line");
    } else {
        extraHeight = 55; // added extraHeight for better displaying date names for month
        // add attribute type to the graph for resize functionality
        d3.select(appendTo).attr("type", "line_month");
    }

    // add attribute to the graph of how many months to show for resize functionality
    d3.select(appendTo).attr("months_to_show", months_to_show);


    var line_graph = d3.select(appendTo)
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT + extraHeight);

    // offsets of the graph
    var MARGINS = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    var lSpace = WIDTH / input_data_nested.length; // offset for the labels(legends) below the graph

    var month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var date_of_today = new Date();

    var year = date_of_today.getFullYear();
    var month = date_of_today.getMonth();

    if (months_to_show == 1) {
        var date = date_of_today.getDate();
        var date_one_year_ago = new Date(year, month - 1, date);
    } else {
        // in this case we don't care about precise day(date) ,because only months and year are used for this graph
        var date_one_year_ago = new Date(year - 1, month + (12 - months_to_show), 1);
    }


    var xScale = d3.time.scale()
        .range([MARGINS.left, WIDTH - MARGINS.right])
        .domain([date_one_year_ago, date_of_today]);

    var yScale = d3.scale.linear()
        .range([HEIGHT - MARGINS.top, MARGINS.bottom])
        .domain([
            0,
            +d3.max(input_data, function (entry) {
                return +entry.amount;
            })
        ]);


    if (months_to_show == 1) {
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom").ticks(15)
            .tickFormat(d3.time.format("%d %b %Y"));
    } else {
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(d3.time.format("%b %Y"));
    }

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");


    // draw both axes with indicators
    if (months_to_show == 1) {
        line_graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis)
            .selectAll("text") // added to month
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-65)"
            });
    } else {
        line_graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);
    }

    line_graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

    // generates the line path for the graph
    var line_gen = d3.svg.line()
        .interpolate("basis")
        .x(function (entry) {
            if (months_to_show == 1) {
                var entry_day = entry.date.split(" ")[0];
                var entry_month_number = month_names.indexOf(entry.date.split(" ")[1]) + 1;
                var entry_year = entry.date.split(" ")[2];
            } else {
                var entry_day = 1;
                var entry_month_number = month_names.indexOf(entry.date.split(" ")[0]) + 1;
                var entry_year = entry.date.split(" ")[1];
            }
            return xScale(new Date(entry_month_number + "." + entry_day + "." + entry_year));
        })
        .y(function (entry) {
            return yScale(entry.amount);
        });

    input_data_nested.forEach(function (entry, index) {

        // generates how dark or light should be the color of the line, depending of the lines array order
        var color_tone = 50 - 20 * index;

        // draw the lines itself
        line_graph.append('svg:path')
            .attr('d', line_gen(entry.values))
            .attr('stroke', function () {
                return "hsl(" + 200 + ",100%, " + color_tone + "% )";
            })
            .attr('stroke-width', 2)
            .attr('id', 'line_' + entry.key)
            .attr('fill', 'none');

        // draw legends below the graph
        line_graph.append("text")
            .attr("x", (lSpace / 2) + index * lSpace)
            .attr("y", HEIGHT - 10 + extraHeight)
            .style("fill", "hsl(" + 200 + ",100%, " + color_tone + "% )")
            .attr("class", "legend")
            .on('click', function () {
                var active = entry.active ? false : true;
                var opacity = active ? 0 : 1;
                d3.select("#line_" + entry.key).style("opacity", opacity);
                entry.active = active;
            })
            .text(entry.key);
    });

}


function draw_piechart_graph(input_data, appendTo, label) {

    var width = 560;
    var height = 360;
    var radius = Math.min(width, height) / 2;
    var pie_slice_color = d3.scale.ordinal()
        .domain([0, 1, 2, 3])
        .range(['#c7c7c7', '#2AE816', '#9AFF0B', '#FFD918']);

    var pie_graph = d3.select(appendTo)
        .append("svg:svg")
        .data([input_data])
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("class", "pie_graph")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    var pie = d3.layout.pie().value(function (entry) {
        return entry.value;
    });


    // declare an arc generator function
    // circular arc is a curved boundary of length L from a circular sector(slice).
    var arc = d3.svg.arc()
        .innerRadius(radius * 0.65)  // NEW
        .outerRadius(radius);

    // select paths, use arc generator to draw
    var arcs = pie_graph.selectAll("g.slice")
        .data(pie).enter()
        .append("svg:g")
        .attr("class", "arc");

    // draw the slices
    arcs.append("svg:path")
        .attr("fill", function (entry, index) {
            return pie_slice_color(index);
        })
        .attr("d", function (entry) {
            return arc(entry);
        });


    // add legends
    var legendRectSize = 18;
    var legendSpacing = 4;

    var legend = pie_graph.selectAll('.legend')
        .data(input_data) //pie_slice_color.domain()
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (entry, index) {
            var height = legendRectSize + legendSpacing;
            var offset = height * input_data.length / 2; //pie_slice_color.domain()
            var horz = 12 * legendRectSize;
            var vert = index * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (entry, index) {
            return pie_slice_color(index);
        })
        .style('stroke', function (entry, index) {
            return pie_slice_color(index);
        });

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (entry, index) {
            return input_data[index].label;
        });


    // add tooltips
    var tooltip = d3.select(appendTo)
        .append('div')
        .attr('class', 'pie_tooltip');

    tooltip.append('div')
        .attr('class', 'name');

    tooltip.append('div')
        .attr('class', 'value');

    tooltip.append('div')
        .attr('class', 'percent');

    var path = pie_graph.selectAll('path');

    path.on('mouseover', function (entry) {
        var total = d3.sum(input_data.map(function (entry) {
            return entry.value;
        }));
        var percent = Math.round(1000 * entry.data.value / total) / 10;
        tooltip.select('.name').html(entry.data.label);
        tooltip.select('.value').html(entry.data.value);
        tooltip.select('.percent').html(percent + '%');
        tooltip.style('display', 'inline-block');
    });

    path.on('mouseout', function () {
        tooltip.style('display', 'none');
    });


    // add title
    pie_graph.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("fill", "#606060")
        .style("font-size", "23px")
        .style("font-weight", "bold")
        .style("font-family", "'Arial', Gadget, sans-serif")
        .text(function () {
            return label; // caption of the title
        });

}

// font library
$("head").append('<link href="https://fonts.googleapis.com/css?family=PT+Sans" rel="stylesheet" type="text/css">');

// initialization function for activity graph
// input json entry format should be :
// [{"date": "2016-05-28", "count": "123"}]
function activity_graph(input_data, appendTo, months_to_show) {
    append_css_for_activity_graph(appendTo);
    d3.select(appendTo).attr("input_data", input_data);     // save pointer to the input data for resizing purposes
    draw_activity_graph(window[input_data], appendTo, months_to_show);
}

// initialization function for line graph
// input json entry format should be :
// [{"name": "Example", "amount": "123", "date": "Jan 2016"}]
function line_graph(input_data, appendTo, months_to_show) {
    append_css_for_line_graph(appendTo);
    d3.select(appendTo).attr("input_data", input_data);     // save pointer to the input data for resizing purposes
    draw_line_graph(window[input_data], appendTo, width, months_to_show);
}

// initialization function for piechart graph
// input json entry format should be :
// [{"label": "Example", "value": 111 }]
function piechart_graph(input_data, appendTo, label) {
    append_css_for_piechart_graph(appendTo);
    draw_piechart_graph(input_data, appendTo, label);
}
