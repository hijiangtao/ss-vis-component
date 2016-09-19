// Vue component define
var demo = new Vue({
  el: '#table',
  data: {
    people_count: 200,
    scatterCategory: ['issue1', 'issue2', 'issue3', 'issue4', 'issue5', 'issue6', 'issue7', 'issue8', 'issue9', 'issue10', 'issue11', 'issue12', 'issue13', 'issue14', 'issue15'],
    selectScaCate: ['issue1', 'issue2', 'issue4', 'issue5', 'issue9'],
    sensorDockerFunc: null
  },
  methods: {
    displayMem: function () {
      var data = [
        {time: '10:01', used: 200, extra: 500, total: 1000},
        {time: '10:02', used: 620, extra: 600, total: 1000},
        {time: '10:03', used: 300, extra: 800, total: 1000},
        {time: '10:04', used: 440, extra: 700, total: 1000},
        {time: '10:05', used: 900, extra: 700, total: 1000},
        {time: '10:06', used: 300, extra: 700, total: 1000},
        {time: '10:07', used: 50, extra: 700, total: 1000},
        {time: '10:08', used: 350, extra: 700, total: 1000},
        {time: '10:09', used: 750, extra: 700, total: 1000}
      ];

      var category = ['used'];

      var hAxis = 10, mAxis = 10;

      //generation function
      function generate(data, id, axisNum) {
        var margin = {top: 20, right: 18, bottom: 35, left: 28},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var parseDate = d3.time.format("%H:%M").parse;
        var formatPercent = d3.format(".0%");

        var legendSize = 10,
            legendColor = 'rgba(0, 160, 233, 0.7)';

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(d3.time.minutes, Math.floor(data.length/axisNum))
            .tickSize(-height)
            .tickPadding([6])
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(10)
            .tickSize(-width)
            .tickFormat(formatPercent)
            .orient("left");

        var ddata = (function() {
          var temp = [];

          for (var i=0; i<data.length; i++) {
            temp.push({'time': parseDate(data[i]['time']), 'used': data[i]['used'], 'extra': data[i]['extra'], 'total': data[i]['total']});
          }

          return temp;
        })();

        // console.log(ddata);

        x.domain(d3.extent(ddata, function(d) { return d.time; }));

        var area = d3.svg.area()
            .x(function(d) { return x(d.time); })
            .y0(height)
            .y1(function(d) { return y(d['used']/d['total']); })
            .interpolate("cardinal");

        d3.select('#svg-mem').remove();

        var svg = d3.select(id).append("svg")
            .attr("id", "svg-mem")
            .attr("width", width+margin.right+margin.left)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "mem-x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var path = svg.append("svg:path")
            .datum(ddata)
            .attr("class", "areaM")
            .attr("d", area);

        var points = svg.selectAll(".gPoints")
            .data(ddata)
            .enter().append("g")
            .attr("class", "gPoints");

        //legend rendering
        var legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(0,'+ (height + margin.bottom - legendSize * 1.2) +')');

        legend.append('rect')
            .attr('width', legendSize)
            .attr('height', legendSize)
            .style('fill', legendColor);

        legend.append('text')
            .data(ddata)
            .attr('x', legendSize*1.2)
            .attr('y', legendSize/1.1)
            .text('used');

        points.selectAll(".memtipPoints")
            .data(ddata)
            .enter().append("circle")
            .attr("class", "memtipPoints")
            .attr("cx", function (d) {
              return x(d.time);
            })
            .attr("cy", function (d) {
              return y(d['used']/d['total']);
            })
            .attr("r", "6px")
            .on("mouseover", function (d) {
              console.log(this);

              d3.select(this).transition().duration(100).style("opacity", 1);

              svg.append("g")
                  .attr("class", "tipDot")
                  .append("line")
                  .attr("class", "tipDot")
                  .transition()
                  .duration(50)
                  .attr("x1", x(d['time']))
                  .attr("x2", x(d['time']))
                  .attr("y2", height);

              // svg.append("circle")
              //   .attr('class', 'tipDot')
              //   .attr("cx", x(d['time']))
              //   .attr("cy", y(0))
              //   .attr("r", "4px");

              // svg.append("circle")
              //   .attr('class', 'tipDot')
              //   .attr("cx", x(d['time']))
              //   .attr("cy", y(1))
              //   .attr("r", "4px");

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(1)-2.5)+","+x(d['time'])+","+(y(1)+6)+","+(x(d['time'])+3.5)+","+(y(1)-2.5));

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(0)+2.5)+","+x(d['time'])+","+(y(0)-6)+","+(x(d['time'])+3.5)+","+(y(0)+2.5));

              $(this).tooltip({
                'container': 'body',
                'placement': 'left',
                'title': 'Used' + ' | ' + formatPercent(d['used']/d['total']),
                'trigger': 'hover'
              })
                  .tooltip('show');
            })
            .on("mouseout",  function (d) {
              d3.select(this).transition().duration(100).style("opacity", 0);

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).tooltip('destroy');
            });

        this.getOpt = function() {
          var axisOpt = new Object();
          axisOpt['x'] = x;
          axisOpt['y'] = y;
          axisOpt['xAxis'] = xAxis;
          axisOpt['width'] = width;
          axisOpt['height'] = height;

          return axisOpt;
        }

        this.getSvg = function() {
          var svgD = new Object();
          svgD['svg'] = svg;
          svgD['points'] = points;
          svgD['area'] = area;
          svgD['path'] = path;

          return svgD;
        }
      }

      //redraw function
      function redraw(data, id, x, y, xAxis, svg, area, path, points, height, axisNum) {
        //format of time data
        var parseDate = d3.time.format("%H:%M").parse;
        var formatPercent = d3.format(".0%");

        var ddata = (function() {
          var temp = [];

          for (var i=0; i<data.length; i++) {
            temp.push({'time': parseDate(data[i]['time']), 'used': data[i]['used'], 'extra': data[i]['extra'], 'total': data[i]['total']});
          }

          return temp;
        })();

        x.domain(d3.extent(ddata, function(d) {
          return d['time'];
        }));

        xAxis.ticks(d3.time.minutes, Math.floor(data.length / axisNum));

        svg.select("#mem-x-axis")
            .transition()
            .duration(200)
            .ease("sin-in-out")
            .call(xAxis);

        //area line updating
        path.datum(ddata)
            .transition()
            .duration(200)
            .attr("class", "areaM")
            .attr("d", area);

        //circle updating
        points.selectAll(".memtipPoints")
            .data(ddata)
            .attr("class", "memtipPoints")
            .attr("cx", function (d) {
              return x(d.time);
            })
            .attr("cy", function (d) {
              return y(d['used']/d['total']);
            })
            .attr("r", "6px");

        //draw new dot
        points.selectAll(".memtipPoints")
            .data(ddata)
            .enter().append("circle")
            .attr("class", "memtipPoints")
            .attr("cx", function (d) {
              return x(d.time);
            })
            .attr("cy", function (d) {
              return y(d['used']/d['total']);
            })
            .attr("r", "6px")
            .on("mouseover", function (d) {
              d3.select(this).transition().duration(100).style("opacity", 1);

              svg.append("g")
                  .attr("class", "tipDot")
                  .append("line")
                  .attr("class", "tipDot")
                  .transition()
                  .duration(50)
                  .attr("x1", x(d['time']))
                  .attr("x2", x(d['time']))
                  .attr("y2", height);

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(1)-2.5)+","+x(d['time'])+","+(y(1)+6)+","+(x(d['time'])+3.5)+","+(y(1)-2.5));

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(0)+2.5)+","+x(d['time'])+","+(y(0)-6)+","+(x(d['time'])+3.5)+","+(y(0)+2.5));

              $(this).tooltip({
                'container': 'body',
                'placement': 'left',
                'title': 'Used' + ' | ' +formatPercent(d['used']/d['total']),
                'trigger': 'hover'
              })
                  .tooltip('show');
            })
            .on("mouseout",  function (d) {
              d3.select(this).transition().duration(100).style("opacity", 0);

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).tooltip('destroy');
            });

        //remove old dot
        points.selectAll(".memtipPoints")
            .data(ddata)
            .exit()
            .transition()
            .duration(200)
            .remove();

      }

      //inits chart
      var sca = new generate(data, "#sensor-mem-area-d3", 8);

      //dynamic data and chart update
      setInterval(function() {
        //update donut data
        data.push({time: hAxis + ":" + mAxis, used: Math.random()*200+400, extra: Math.random()*1000, total: 1000});

        // console.log(tAxis);
        if(mAxis === 59) {
          hAxis++;
          mAxis=0;
        }
        else {
          mAxis++;
        }

        if (Object.keys(data).length === 20) data.shift();

        // generate(data, "#sensor-mem-area-d3");
        redraw(data, "#sensor-mem-area-d3", sca.getOpt()['x'], sca.getOpt()['y'], sca.getOpt()['xAxis'], sca.getSvg()['svg'], sca.getSvg()['area'], sca.getSvg()['path'], sca.getSvg()['points'], sca.getOpt()['height'], 8);
      }, 3500);
    },
    displayDocker: function () {
      var self = this;

      var data = [
        {time:'10:00', issue1:15.1, issue2: 13, issue3: 2, issue4: 3, issue5: 10, issue6: 8, issue7: 4, issue8: 5, issue9: 6, issue10: 11, issue11:1, issue12: 15, issue13: 7, issue14: 9, issue15: 12, issue16: 18, issue17: 16, issue18: 19, issue19: 2, issue20: 16 },
        {time:'10:01', issue1:15.1, issue2: 13, issue3: 2, issue4: 3, issue5: 10, issue6: 8, issue7: 3, issue8: 2, issue9: 2, issue10: 8, issue11:14, issue12: 13, issue13: 12, issue14: 3, issue15: 10, issue16: 18, issue17: 3, issue18: 2, issue19: 2, issue20: 16 },
        {time:'10:02', issue1:15.1, issue2: 13, issue3: 2, issue4: 3, issue5: 10, issue6: 8, issue7: 3, issue8: 2, issue9: 2, issue10: 8, issue11:14, issue12: 13, issue13: 12, issue14: 3, issue15: 10, issue16: 18, issue17: 3, issue18: 2, issue19: 2, issue20: 16 },
        {time:'10:03', issue1:15.1, issue2: 13, issue3: 2, issue4: 3, issue5: 10, issue6: 8, issue7: 3, issue8: 2, issue9: 2, issue10: 8, issue11:14, issue12: 13, issue13: 12, issue14: 3, issue15: 10, issue16: 18, issue17: 3, issue18: 2, issue19: 2, issue20: 16 },
        {time:'10:04', issue1:15.1, issue2: 13, issue3: 2, issue4: 3, issue5: 10, issue6: 8, issue7: 3, issue8: 2, issue9: 2, issue10: 8, issue11:14, issue12: 13, issue13: 12, issue14: 3, issue15: 10, issue16: 18, issue17: 3, issue18: 2, issue19: 2, issue20: 16 },
        {time:'10:05', issue1:14, issue2: 13, issue3: 2, issue4: 3, issue5: 10, issue6: 8, issue7: 3, issue8: 2, issue9: 2, issue10: 8, issue11:14, issue12: 13, issue13: 12, issue14: 3, issue15: 10, issue16: 18, issue17: 3, issue18: 2, issue19: 2, issue20: 16 },
        {time:'10:06', issue1:14, issue2: 13, issue3: 2, issue4: 3, issue5: 10, issue6: 8, issue7: 3, issue8: 2, issue9: 2, issue10: 8, issue11:14, issue12: 13, issue13: 12, issue14: 3, issue15: 10, issue16: 18, issue17: 3, issue18: 2, issue19: 2, issue20: 16 },
        {time:'10:07', issue1:14, issue2: 13, issue3: 2, issue4: 3, issue5: 10, issue6: 8, issue7: 3, issue8: 2, issue9: 2, issue10: 8, issue11:14, issue12: 13, issue13: 12, issue14: 3, issue15: 10, issue16: 18, issue17: 3, issue18: 2, issue19: 2, issue20: 16 },
        {time:'10:08', issue1:14, issue2: 13, issue3: 2, issue4: 3, issue5: 10, issue6: 8, issue7: 3, issue8: 2, issue9: 2, issue10: 8, issue11:14, issue12: 13, issue13: 12, issue14: 3, issue15: 10, issue16: 18, issue17: 3, issue18: 2, issue19: 2, issue20: 16 }
      ];

      var hAxis = 10, mAxis = 9;

      //generation function
      function generate(data, id, axisNum) {
        var margin = {top: 14, right: 20, bottom: 60, left: 30},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var parseDate = d3.time.format("%H:%M").parse;

        var legendSize = Math.floor(width / 27.5),
            color = d3.scale.category20();

        var x = d3.time.scale().range([0, width]),
            y = d3.scale.linear().rangeRound([height, 0]);

        //the radius of circle can be adjustable
        var r = d3.scale.linear()
            .domain([0, 20])
            .range([0, width / 45]);

        //deal with the datum, and store them into ddata
        var ddata = [];
        data.forEach(function(d) {
          for(var i=1; i<Object.keys(d).length; i++) {
            ddata.push({
              'time': parseDate(d['time']), 'issue': self.scatterCategory[i-1], 'num': d['issue'+i]
            });
          }
        });

        x.domain( d3.extent(ddata, function(d) { return d['time']; }) );
        y.domain([0,22]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(d3.time.minutes, Math.floor(data.length / axisNum))
            .tickPadding([6])
            .tickSize(-height);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10)
            .tickPadding([8])
            .tickSize(-width);

        d3.select('#svg-docker').remove();

        var svg = d3.select(id).append("svg")
            .attr('id', "#svg-docker")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "docker-x-axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var dots = svg.append("g")
            .attr("class", "scatter_dots");

        dots.selectAll(".scatter_circle")
            .data(ddata)
            .enter()
            .append("circle")
            .attr("class", function (d) { return "scatter_circle scatter_circle_" + d['issue']; })
            .attr("cx", function (d) { return x(d['time']); })
            .attr("cy", function (d) { return y(d['num']); })
            .attr("r", function (d) { return r(10); })
            .style("display", function (d) {
              //to check if the checkbox has been selected and decide whether to show it out
              //use display:none and display:inherit to control the display of scatter dots
              if ($("#"+d['issue']).prop("checked"))
                return 'inherit';
              else
                return 'none';
            })
            .style("fill", function (d) { return color(d['issue']) })
            .on("mouseover", function (d) {
              if ($("#"+d['issue']).prop("checked")) {
                $(this).tooltip({
                  'container': 'body',
                  'placement': 'left',
                  'title': d["issue"] + " | " +d['num'],
                  'trigger': 'hover'
                })
                    .tooltip('show');
              }
            })
            .on("mouseout", function(d) {
              $(this).tooltip('destroy');
            });

        d3.selectAll('.scatter_legend').remove();

        var legend = svg.append('g')
            .attr('class', 'scatter_legend');

        var singLegend = legend.selectAll('.docker_legend')
            .data(self.selectScaCate)
            .enter()
            .append('g')
            .attr('class', 'docker_legend')
            .attr('transform', function(d, i) {
              return 'translate(' + ((5 + (width-20) / 5) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
            });

        singLegend.append('g:rect')
            .attr('width', legendSize)
            .attr('height', legendSize)
            .style('fill', function(d) {
              return color(d);
            });

        singLegend.append('g:text')
            .attr('x', legendSize*1.4)
            .attr('y', legendSize/1.3)
            .attr('font-size', function() {
              if ($(id).width() > 415)
                return '.9em';
              else {
                return '.55em';
              }
            })
            .text(function(d) {
              return d;
            });

        //draw the rect for legends
        var rect = svg.append('g')
            .attr("class", 'legendOuter');

        rect.selectAll('.legendRect')
            .data(self.selectScaCate)
            .enter()
            .append('rect')
            .attr('class', 'legendRect')
            .attr('width', (width - 20) / 5)
            .attr('height', legendSize + 10)
            .attr('transform', function(d, i) {
              return 'translate(' + (i * (5 + (width-20) / 5)) + ',' + (height + margin.bottom - legendSize - 20) + ')';
            });

        this.getOpt = function() {
          var axisOpt = new Object();
          axisOpt['x'] = x;
          axisOpt['xAxis'] = xAxis;
          axisOpt['y'] = y;
          axisOpt['r'] = r;
          axisOpt['legendSize'] = legendSize;
          axisOpt['height'] = height;
          axisOpt['width'] = width;
          axisOpt['margin'] = margin;

          return axisOpt;
        }

        this.getSvg = function() {
          var svgD = new Object();
          svgD['svg'] = svg;
          svgD['dots'] = dots;
          svgD['color'] = color;
          svgD['legend'] = legend
          svgD['rect'] = rect;

          return svgD;
        }
      }

      //redraw function
      function redraw(data, id, svg, dots, color, x, xAxis, y, r, init, axisNum) {
        //update the axis
        var parseDate = d3.time.format("%H:%M").parse;

        //parse the data
        var ddata = [];
        data.forEach(function(d) {
          for(var i=1; i<Object.keys(d).length; i++) {
            ddata.push({
              'time': parseDate(d['time']),
              'issue': self.scatterCategory[i-1],
              'num': d['issue'+i]
            });
          }
        });

        x.domain( d3.extent(ddata, function(d) { return d['time']; }) );
        xAxis.ticks(d3.time.minutes, Math.floor(data.length / axisNum));

        //update the axis
        svg.select("#docker-x-axis")
            .transition()
            .duration(200)
            .ease("sin-in-out")
            .call(xAxis);

        //update the dot
        dots.selectAll(".scatter_circle")
            .data(ddata)
            .transition()
            .duration(200)
            .attr("cx", function (d) {
              return x(d['time']);
            })
            .style("display", function (d) {
              //to check if the checkbox has been selected and decide whether to show it out
              //use display:none and display:inherit to control the display of scatter dots
              if ($("#"+d['issue']).prop("checked"))
                return 'inherit';
              else
                return 'none';
            });
        //////////////////////////

        //draw new dot
        dots.selectAll(".scatter_circle")
            .data(ddata)
            .enter()
            .append("circle")
            .attr("class", function (d) { return "scatter_circle scatter_circle_" + d['issue']; })
            .attr("cx", function (d) { return x(d['time']); })
            .attr("cy", function (d) { return y(d['num']); })
            .attr("r", function (d) { return r(10); })
            .style("display", function (d) {
              //to check if the checkbox has been selected and decide whether to show it out
              //use display:none and display:inherit to control the display of scatter dots
              if ($("#"+d['issue']).prop("checked"))
                return 'inherit';
              else
                return 'none';
            })
            .style("fill", function (d) { return color(d['issue']) })
            .on("mouseover", function (d) {
              if ($("#"+d['issue']).prop("checked")) {
                $(this).tooltip({
                  'container': 'body',
                  'placement': 'left',
                  'title': d["issue"] + " | " +d['num'],
                  'trigger': 'hover'
                })
                    .tooltip('show');
              }
            })
            .on("mouseout", function(d) {
              $(this).tooltip('destroy');
            });

        //remove old dot
        dots.selectAll(".scatter_circle")
            .data(ddata)
            .exit()
            .transition()
            .duration(500)
            .remove();

        //redraw legend
        self.legendRedraw(self.selectScaCate, id, init.getSvg()['legend'], init.getSvg()['rect'], init.getOpt()['legendSize'], init.getOpt()['margin'], init.getOpt()['height'], init.getOpt()['width'], init.getSvg()['color']);
      }

      //inits chart
      self.sensorDockerFunc = new generate(data, "#sensor-docker-scatterplot-d3", 5);

      //dynamic data and chart update
      setInterval(function() {
        //update donut data
        data.push({
          time: hAxis + ":" + mAxis,
          issue1: Math.floor(Math.random()*20),
          issue2: Math.floor(Math.random()*20),
          issue3: Math.floor(Math.random()*20),
          issue4: Math.floor(Math.random()*20),
          issue5: Math.floor(Math.random()*20),
          issue6: Math.floor(Math.random()*20),
          issue7: Math.floor(Math.random()*20),
          issue8: Math.floor(Math.random()*20),
          issue9: Math.floor(Math.random()*20),
          issue10: Math.floor(Math.random()*20),
          issue11: Math.floor(Math.random()*20),
          issue12: Math.floor(Math.random()*20),
          issue13: Math.floor(Math.random()*20),
          issue14: Math.floor(Math.random()*20),
          issue15: Math.floor(Math.random()*20),
          issue16: Math.floor(Math.random()*20),
          issue17: Math.floor(Math.random()*20),
          issue18: Math.floor(Math.random()*20),
          issue19: Math.floor(Math.random()*20),
          issue20: Math.floor(Math.random()*20)
        });

        if(mAxis === 59) {
          hAxis++;
          mAxis=0;
        }
        else {
          mAxis++;
        }

        if (Object.keys(data).length === 15) data.shift();

        redraw(data, "#sensor-docker-scatterplot-d3", self.sensorDockerFunc.getSvg()['svg'], self.sensorDockerFunc.getSvg()['dots'], self.sensorDockerFunc.getSvg()['color'], self.sensorDockerFunc.getOpt()['x'], self.sensorDockerFunc.getOpt()['xAxis'], self.sensorDockerFunc.getOpt()['y'], self.sensorDockerFunc.getOpt()['r'], self.sensorDockerFunc, 5);
      }, 6000);
    },
    displayCPU: function () {
      var data = [
        { inits: 'A', value: 10 },
        { inits: 'B', value: 100 },
        { inits: 'C', value: 60 },
        { inits: 'D', value: 10 },
        { inits: 'E', value: 80 },
        { inits: 'F', value: 100 }
      ];

      var category = ['A', 'B', 'C', 'D', 'E', 'F'],
          cateColor = ["#fff799", "#ffee00" , "#0068b7", '#00b7ee', '#a5d4f3', '#eff9ff'];

      //generation function
      function generate(data, id) {
        var margin = {top: 20, right: 0, bottom: 40, left: 0},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var radius = Math.min(width, height) / 2,
            innerRadius = radius * 0.25,
            outerRadius = radius * 0.75;

        var legendRectSize = radius/8,
            legendSpacing = radius/5;

        var color = d3.scale.ordinal()
            .domain(category)
            .range(cateColor);

        var formatPercent = d3.format(".0%");

        var pie = d3.layout.pie()
            .value(function(d) {return d.value; })
            .sort(null);

        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var svgX = (width+margin.right+margin.left) / 2,
            svgY = (radius*2 + margin.top*2) / 2;

        var svg = d3.select(id).append("svg")
            .attr("width", width+margin.right+margin.left)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + svgX + "," + svgY + ")");

        path = svg.datum(data).selectAll(".solidArc")
            .data(pie)
            .enter()
            .append("path")
            .attr("fill", function(d) {
              return color(d.data.inits);
            })
            .attr("class", "solidArc")
            .attr("stroke", "none")
            .attr("d", arc)
            .each(function(d) {
              this._current=d;
            })
            .on('mouseover', function(d) {
              console.log(d);

              d3.select(this).transition().duration(200).attr("d", arc.innerRadius(innerRadius).outerRadius(outerRadius / 0.75 * 0.9));

              //count the sum
              var count = 0;
              for (var i = 0; i < category.length; i++) {
                count += data[i]['value'];
              }

              svg.append("svg:text")
                  .attr("class", "donutCenterText")
                  .attr("dy", "-.3em")
                  .attr("text-anchor", "middle")
                  .transition().duration(200)
                  .text(d['data']['inits']);

              svg.append("svg:text")
                  .attr("class", "donutCenterText")
                  .attr("dy", ".8em")
                  .attr("text-anchor", "middle")
                  .transition().duration(200)
                  .text(formatPercent(d['value'] / count));

            })
            .on('mouseout', function(d) {
              d3.select(this).transition().duration(200).attr("d", arc.innerRadius(innerRadius).outerRadius(outerRadius));

              d3.selectAll('.donutCenterText').remove();
            });

        //legend rendering
        var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr("id", function(d) {
              return "legend-" + d;
            })
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var horz = (i-2.8)*(legendSpacing+legendRectSize);
              var vert =  radius + margin.bottom / 4;
              return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color);

        legend.append('text')
            .data(data)
            .attr('x', legendRectSize*1.2)
            .attr('y', legendRectSize/1.3)
            .text(function(d) {
              //console.log(d);
              return d.inits; });

        this.getPath = function() {
          return path;
        }

        this.getArc = function() {
          return d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);
        }
      }

      //redraw function
      function redraw(data, path, arc) {
        //for the transition effect of donut chart
        var arcTween = function arcTween(a) {
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) {
            return arc(i(t));
          };
        }

        var donut = d3.layout.pie()
            .value(function(d) {return d.value; })
            .sort(null);

        donut.value(function(d) { return d['value']; });
        path = path.datum(data).data(donut).attr("d", arc); // compute the new angles
        path.transition().duration(750).attrTween("d", arcTween);
      }

      //inits chart
      var sca = new generate(data, "#sensor-cpu-donut-d3");

      //dynamic data and chart update
      setInterval(function() {
        //update donut data
        for (var i=0; i<Object.keys(data).length; i++){
          data[i].value = Math.floor(Math.random()*100);
        }

        redraw(data, sca.getPath(), sca.getArc());
      }, 5000);
    },
    displayNet: function () {
      var data = [
        {time: '10:01', upload: 200, download: 500, total: 1000},
        {time: '10:02', upload: 620, download: 600, total: 1000},
        {time: '10:03', upload: 300, download: 800, total: 1000},
        {time: '10:04', upload: 440, download: 700, total: 1000},
        {time: '10:05', upload: 900, download: 900, total: 1000},
        {time: '10:06', upload: 300, download: 500, total: 1000},
        {time: '10:07', upload: 50, download: 300, total: 1000},
        {time: '10:08', upload: 350, download: 70, total: 1000},
        {time: '10:09', upload: 750, download: 200, total: 1000}
      ];

      var category = ['upload', 'download'];

      var hAxis = 10, mAxis = 10;

      //generation function
      function generate(data, id, lineType, axisNum) {
        var margin = {top: 20, right: 18, bottom: 35, left: 28},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var parseDate = d3.time.format("%H:%M").parse;

        var legendSize = 10,
            legendColor = {'upload': 'rgba(0, 160, 233, 1)', 'download': 'rgba(34, 172, 56, 1)'};

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        //data.length/10 is set for the garantte of timeseries's fitting effect in svg chart
        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(d3.time.minutes, Math.floor(data.length / axisNum))
            .tickSize(-height)
            .tickPadding([6])
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(10)
            .tickSize(-width)
            .orient("left");

        var ddata = (function() {
          var temp = {}, seriesArr = [];

          category.forEach(function (name) {
            temp[name] = {category: name, values:[]};
            seriesArr.push(temp[name]);
          });

          data.forEach(function (d) {
            category.map(function (name) {
              temp[name].values.push({'category': name, 'time': parseDate(d['time']), 'num': d[name]});
            });
          });

          return seriesArr;
        })();

        // q = ddata;
        // console.log(ddata);

        x.domain( d3.extent(data, function(d) { return parseDate(d['time']); }) );

        y.domain([
          0,
          d3.max(ddata, function(c) { return d3.max(c.values, function(v) { return v['num']; }); })+100
        ]);

        var area = d3.svg.area()
            .x(function(d) { return x(d['time']); })
            .y0(height)
            .y1(function(d) { return y(d['num']); })
            .interpolate(lineType);

        d3.select('#svg-net').remove();

        var svg = d3.select(id).append("svg")
            .attr("id", "svg-net")
            .attr("width", width+margin.right+margin.left)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "net-x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var path = svg.selectAll(".gPath")
            .data(ddata)
            .enter().append("g")
            .attr("class", "gPath");

        path.append("path")
            .attr("d", function(d) { return area(d['values']); })
            .attr("class", function(d) {
              if (d['category'] === 'upload')
                return 'areaU';
              else
                return 'areaD';
            });

        var legend = svg.selectAll('.legend')
            .data(category)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              return 'translate(' + (i * 10 * legendSize) + ',' + (height + margin.bottom - legendSize * 1.2) + ')';
            });

        legend.append('rect')
            .attr('width', legendSize)
            .attr('height', legendSize)
            .style('fill', function(d) { return legendColor[d]});

        legend.append('text')
            .data(category)
            .attr('x', legendSize*1.2)
            .attr('y', legendSize/1.1)
            .text(function(d) {
              return d;
            });

        var points = svg.selectAll(".seriesPoints")
            .data(ddata)
            .enter().append("g")
            .attr("class", "seriesPoints");

        points.selectAll(".tipNetPoints")
            .data(function (d) { return d['values']; })
            .enter().append("circle")
            .attr("class", "tipNetPoints")
            .attr("cx", function (d) { return x(d['time']); })
            .attr("cy", function (d) { return y(d['num']); })
            .text(function (d) { return d['num']; })
            .attr("r", "6px")
            .style("fill",function (d) { return legendColor[d['category']]; })
            .on("mouseover", function (d) {
              // console.log();
              var currentX = $(this)[0]['cx']['animVal']['value'],
                  currentY = $(this)[0]['cy']['animVal']['value'];

              d3.select(this).transition().duration(100).style("opacity", 1);

              var ret = $('.tipNetPoints').filter(function(index) {
                return ($(this)[0]['cx']['animVal']['value'] === currentX && $(this)[0]['cy']['animVal']['value'] !== currentY);
              });

              //to adjust tooltip'x content if upload and download data are the same
              var jud = ret.length;

              // console.log(ret.length);

              var mainCate = (function() {
                if (jud === 0)
                  return 'upload/download';
                else
                  return d['category'];
              })();

              var viceCate = (function() {
                if (category[0] === d['category'])
                  return category[1];
                else
                  return category[0];
              })();

              $.each(ret, function(index, val) {
                // console.log(mainCate + ' | ' + viceCate);

                $(val).animate({
                  opacity: "1"
                }, 100);

                $(val).tooltip({
                  'container': 'body',
                  'placement': 'left',
                  'title': viceCate + ' | ' + $(this)[0]['textContent'],
                  'trigger': 'hover'
                })
                    .tooltip('show');
              });

              svg.append("g")
                .attr("class", "tipDot")
                .append("line")
                .attr("class", "tipDot")
                .transition()
                .duration(50)
                .attr("x1", $(this)[0]['cx']['animVal']['value'])
                .attr("x2", $(this)[0]['cx']['animVal']['value'])
                .attr("y2", height);

              svg.append("polyline")
                .attr("class", "tipDot")
                .style("fill", "black")
                .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(0-2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(0+6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(0-2.5));

              svg.append("polyline")
                .attr("class", "tipDot")
                .style("fill", "black")
                .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(y(0)+2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(y(0)-6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(y(0)+2.5));

              $(this).tooltip({
                'container': 'body',
                'placement': 'left',
                'title': mainCate + ' | ' + d['num'],
                'trigger': 'hover'
              })
              .tooltip('show');
            })
            .on("mouseout",  function (d) {
              var currentX = $(this)[0]['cx']['animVal']['value'];

              d3.select(this).transition().duration(100).style("opacity", 0);

              var ret = $('.tipNetPoints').filter(function(index) {
                return ($(this)[0]['cx']['animVal']['value'] === currentX);
              });

              $.each(ret, function(index, val) {
                $(val).animate({
                  opacity: "0"
                }, 100);

                $(val).tooltip('destroy');
              });

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).tooltip('destroy');
            });

        this.getOpt = function() {
          var axisOpt = new Object();
          axisOpt['x'] = x;
          axisOpt['y'] = y;
          axisOpt['xAxis'] = xAxis;
          axisOpt['width'] = width;
          axisOpt['height'] = height;

          return axisOpt;
        }

        this.getSvg = function() {
          var svgD = new Object();
          svgD['svg'] = svg;
          svgD['points'] = points;
          svgD['area'] = area;
          svgD['path'] = path;
          svgD['legendColor'] = legendColor;

          return svgD;
        }
      }

      //redraw function
      function redraw(data, id, x, y, xAxis, svg, area, path, points, legendColor, height, axisNum) {
        //format of time data
        var parseDate = d3.time.format("%H:%M").parse;

        var ddata = (function() {
          var temp = {}, seriesArr = [];

          category.forEach(function (name) {
            temp[name] = {category: name, values:[]};
            seriesArr.push(temp[name]);
          });

          data.forEach(function (d) {
            category.map(function (name) {
              temp[name].values.push({'category': name, 'time': parseDate(d['time']), 'num': d[name]});
            });
          });

          return seriesArr;
        })();

        x.domain( d3.extent(data, function(d) { return parseDate(d['time']); }) );
        xAxis.ticks(d3.time.minutes, Math.floor(data.length / axisNum));

        svg.select("#net-x-axis")
            .transition()
            .duration(200)
            .ease("sin-in-out")
            .call(xAxis);

        //different area line updating

        path.select("path")
            .data(ddata)
            .transition()
            .duration(200)
            .attr("d", function(d) { return area(d['values']); })
            .attr("class", function(d) {
              if (d['category'] === 'upload')
                return 'areaU';
              else
                return 'areaD';
            });

        //circle updating

        points.selectAll(".tipNetPoints")
            .data(function (d) { return d['values']; })
            .attr("class", "tipNetPoints")
            .attr("cx", function (d) { return x(d['time']); })
            .attr("cy", function (d) { return y(d['num']); })
            .attr("r", "6px")
            .style("fill",function (d) { return legendColor[d['category']]; });

        // //draw new dot

        // console.log(ddata);
        points.data(ddata);

        points.selectAll(".tipNetPoints")
            .data(function (d) {
              return d['values'];
            })
            .enter().append("circle")
            .attr("class", "tipNetPoints")
            .attr("cx", function (d) { return x(d['time']); })
            .attr("cy", function (d) { return y(d['num']); })
            .text(function (d) { return d['num']; })
            .attr("r", "6px")
            .style("fill",function (d) { return legendColor[d['category']]; })
            .on("mouseover", function (d) {
              // console.log();
              var currentX = $(this)[0]['cx']['animVal']['value'],
                  currentY = $(this)[0]['cy']['animVal']['value'];

              d3.select(this).transition().duration(100).style("opacity", 1);

              var ret = $('.tipNetPoints').filter(function(index) {
                return ($(this)[0]['cx']['animVal']['value'] === currentX && $(this)[0]['cy']['animVal']['value'] !== currentY);
              });

              //to adjust tooltip'x content if upload and download data are the same
              var jud = ret.length;

              var mainCate = (function() {
                if (jud === 0)
                  return 'upload/download';
                else
                  return d['category'];
              })();

              var viceCate = (function() {
                if (category[0] === d['category'])
                  return category[1];
                else
                  return category[0];
              })();

              $.each(ret, function(index, val) {
                $(val).animate({
                  opacity: "1"
                }, 100);

                $(val).tooltip({
                  'container': 'body',
                  'placement': 'left',
                  'title': viceCate + ' | ' + $(this)[0]['textContent'],
                  'trigger': 'hover'
                })
                    .tooltip('show');
              });

              // console.log("the correct xaxis is: ", currentX, 'but the output is ', x(d['time']), '$this object is: ', $(this)[0]['cx']['animVal']['value']);

              svg.append("g")
                  .attr("class", "tipDot")
                  .append("line")
                  .attr("class", "tipDot")
                  .transition()
                  .duration(50)
                  .attr("x1", $(this)[0]['cx']['animVal']['value'])
                  .attr("x2", $(this)[0]['cx']['animVal']['value'])
                  .attr("y2", height);

              svg.append("polyline")
                  .attr("class", "tipDot")
                  .style("fill", "black")
                  .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(0-2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(0+6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(0-2.5));

              svg.append("polyline")
                  .attr("class", "tipDot")
                  .style("fill", "black")
                  .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(y(0)+2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(y(0)-6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(y(0)+2.5));

              $(this).tooltip({
                'container': 'body',
                'placement': 'left',
                'title': mainCate + ' | ' + d['num'],
                'trigger': 'hover'
              })
                  .tooltip('show');
            })
            .on("mouseout",  function (d) {
              var currentX = $(this)[0]['cx']['animVal']['value'];

              d3.select(this).transition().duration(100).style("opacity", 0);

              var ret = $('.tipNetPoints').filter(function(index) {
                return ($(this)[0]['cx']['animVal']['value'] === currentX);
              });

              $.each(ret, function(index, val) {
                $(val).animate({
                  opacity: "0"
                }, 100);

                $(val).tooltip('destroy');
              });

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).tooltip('destroy');
            });

        //remove old dot
        points.selectAll(".tipNetPoints")
            .data(function (d) { return d['values']; })
            .exit()
            .transition()
            .duration(200)
            .remove();

      }

      //inits chart
      var sca = new generate(data, "#sensor-net-area-d3", "linear", 6);

      //dynamic data and chart update
      setInterval(function() {
        //update donut data
        data.push({time: hAxis + ":" + mAxis, upload: Math.random()*200+400, download: Math.random()*400+200, total: 1000});

        // console.log(tAxis);
        if(mAxis === 59) {
          hAxis++;
          mAxis=0;
        }
        else {
          mAxis++;
        }

        if (Object.keys(data).length === 20) data.shift();

        redraw(data, "#sensor-net-area-d3", sca.getOpt()['x'], sca.getOpt()['y'], sca.getOpt()['xAxis'], sca.getSvg()['svg'], sca.getSvg()['area'], sca.getSvg()['path'], sca.getSvg()['points'], sca.getSvg()['legendColor'], sca.getOpt()['height'], 6);
      }, 3500);
    },
    displayDisk: function () {
      var data = [
        {time: '10:01', read: 200, write: 500, total: 1000},
        {time: '10:02', read: 620, write: 600, total: 1000},
        {time: '10:03', read: 300, write: 800, total: 1000},
        {time: '10:04', read: 440, write: 700, total: 1000},
        {time: '10:05', read: 900, write: 900, total: 1000},
        {time: '10:06', read: 300, write: 500, total: 1000},
        {time: '10:07', read: 50, write: 300, total: 1000},
        {time: '10:08', read: 350, write: 70, total: 1000},
        {time: '10:09', read: 750, write: 200, total: 1000}
      ];

      var category = ['read', 'write'];

      var drawLine = ['write'],
          drawArea = ['read'];

      var hAxis = 10, mAxis = 10;

      //generation function
      function generate(data, id, lineType, axisNum) {
        var margin = {top: 20, right: 18, bottom: 35, left: 28},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var parseDate = d3.time.format("%H:%M").parse;

        var legendSize = 10,
            legendColor = {'read': 'rgba(0, 160, 233, 1)', 'write': 'rgba(255, 255, 255, 1)'};

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        //data.length/10 is set for the garantte of timeseries's fitting effect in svg chart
        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(d3.time.minutes, Math.floor(data.length / axisNum))
            .tickSize(-height)
            .tickPadding([6])
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(10)
            .tickSize(-width)
            .orient("left");

        var ddata = (function() {
          var temp = {}, seriesArr = [];

          category.forEach(function (name) {
            temp[name] = {category: name, values:[]};
            seriesArr.push(temp[name]);
          });

          data.forEach(function (d) {
            category.map(function (name) {
              temp[name].values.push({'category': name, 'time': parseDate(d['time']), 'num': d[name]});
            });
          });

          return seriesArr;
        })();

        var ldata = (function() {
          var temp = {}, seriesArr = [];

          temp[drawLine[0]] = {category: drawLine[0], values:[]};
          seriesArr.push(temp[drawLine]);

          data.forEach(function (d) {
            drawLine.map(function (name) {
              temp[name].values.push({'category': name, 'time': parseDate(d['time']), 'num': d[name]});
            });
          });

          return seriesArr;
        })();

        var adata = (function() {
          var temp = {}, seriesArr = [];

          temp[drawArea[0]] = {category: drawArea[0], values:[]};
          seriesArr.push(temp[drawArea]);

          data.forEach(function (d) {
            drawArea.map(function (name) {
              temp[name].values.push({'category': name, 'time': parseDate(d['time']), 'num': d[name]});
            });
          });

          return seriesArr;
        })();

        // q = ddata;
        // console.log(ddata);

        x.domain( d3.extent(data, function(d) { return parseDate(d['time']); }) );

        y.domain([
          0,
          d3.max(ddata, function(c) { return d3.max(c.values, function(v) { return v['num']; }); })+100
        ]);

        var area = d3.svg.area()
            .x(function(d) { return x(d['time']); })
            .y0(height)
            .y1(function(d) { return y(d['num']); })
            .interpolate(lineType);

        var line = d3.svg.line()
            .interpolate(lineType)
            .x(function(d) { return x(d['time']); })
            .y(function(d) { return y(d['num']); });

        d3.select('#svg-disk').remove();

        var svg = d3.select(id).append("svg")
            .attr("id", "svg-disk")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "disk-x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var path = svg.selectAll(".gPath")
            .data(adata)
            .enter().append("g")
            .attr("class", "gPath");

        path.append("path")
            .attr("d", function(d) { return area(d['values']); })
            .attr("class", 'areaR');

        var lpath = svg.selectAll(".lpath")
            .data(ldata)
            .enter().append("g")
            .attr("class", "lpath");

        lpath.append("path")
            .attr("d", function(d) { return line(d['values']); })
            .attr("class", "areaW");

        var legend = svg.selectAll('.legend')
            .data(category)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              return 'translate(' + (i * 10 * legendSize) + ',' + (height + margin.bottom - legendSize * 1.2) + ')';
            });

        legend.append('rect')
            .attr('width', legendSize)
            .attr('height', legendSize)
            .style('fill', function(d) {
              return legendColor[d]
            })
            .style('stroke', function(d) {
              return legendColor['read'];
            });

        legend.append('text')
            .data(category)
            .attr('x', legendSize * 1.2)
            .attr('y', legendSize / 1.1)
            .text(function(d) {
              return d;
            });

        var points = svg.selectAll(".seriesPoints")
            .data(ddata)
            .enter().append("g")
            .attr("class", "seriesPoints");

        points.selectAll(".tipPoints")
            .data(function (d) { return d['values']; })
            .enter().append("circle")
            .attr("class", "tipPoints")
            .attr("cx", function (d) { return x(d['time']); })
            .attr("cy", function (d) { return y(d['num']); })
            .text(function (d) { return d['num']; })
            .attr("r", "6px")
            .style("fill",function (d) { return legendColor[d['category']]; })
            .style("stroke", function (d) {
              if (d['category'] === 'write')
                return legendColor['read'];
              else
                return legendColor['write'];
            })
            .on("mouseover", function (d) {
              // console.log();
              var currentX = $(this)[0]['cx']['animVal']['value'],
                  currentY = $(this)[0]['cy']['animVal']['value'];

              d3.select(this).transition().duration(100).style("opacity", 1);

              var ret = $('.tipPoints').filter(function(index) {
                return ($(this)[0]['cx']['animVal']['value'] === currentX && $(this)[0]['cy']['animVal']['value'] !== currentY);
              });

              //to adjust tooltip'x content if read and write data are the same
              var jud = ret.length;

              // console.log(ret.length);

              var mainCate = (function() {
                if (jud === 0)
                  return 'read/write';
                else
                  return d['category'];
              })();

              var viceCate = (function() {
                if (category[0] === d['category'])
                  return category[1];
                else
                  return category[0];
              })();

              $.each(ret, function(index, val) {
                // console.log(mainCate + ' | ' + viceCate);

                $(val).animate({
                  opacity: "1"
                }, 100);

                $(val).tooltip({
                  'container': 'body',
                  'placement': 'left',
                  'title': viceCate + ' | ' + $(this)[0]['textContent'],
                  'trigger': 'hover'
                })
                    .tooltip('show');
              });

              svg.append("g")
                .attr("class", "tipDot")
                .append("line")
                .attr("class", "tipDot")
                .transition()
                .duration(50)
                .attr("x1", currentX)
                .attr("x2", currentX)
                .attr("y2", height);

              svg.append("polyline")
                .attr("class", "tipDot")
                .style("fill", "black")
                .attr("points", (currentX-3.5)+","+(0-2.5)+","+currentX+","+(0+6)+","+(currentX+3.5)+","+(0-2.5));

              svg.append("polyline")
                .attr("class", "tipDot")
                .style("fill", "black")
                .attr("points", (currentX-3.5)+","+(y(0)+2.5)+","+currentX+","+(y(0)-6)+","+(currentX+3.5)+","+(y(0)+2.5));

              $(this).tooltip({
                'container': 'body',
                'placement': 'left',
                'title': mainCate + ' | ' + d['num'],
                'trigger': 'hover'
              })
              .tooltip('show');
            })
            .on("mouseout",  function (d) {
              var currentX = $(this)[0]['cx']['animVal']['value'];

              d3.select(this).transition().duration(100).style("opacity", 0);

              var ret = $('.tipPoints').filter(function(index) {
                return ($(this)[0]['cx']['animVal']['value'] === currentX);
              });

              $.each(ret, function(index, val) {
                $(val).animate({
                  opacity: "0"
                }, 100);

                $(val).tooltip('destroy');
              });

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).tooltip('destroy');
            });

        this.getOpt = function() {
          var axisOpt = new Object();
          axisOpt['x'] = x;
          axisOpt['y'] = y;
          axisOpt['xAxis'] = xAxis;
          axisOpt['width'] = width;
          axisOpt['height'] = height;

          return axisOpt;
        }

        this.getSvg = function() {
          var svgD = new Object();
          svgD['svg'] = svg;
          svgD['points'] = points;
          svgD['area'] = area;
          svgD['path'] = path;
          svgD['lpath'] = lpath;
          svgD['legendColor'] = legendColor;
          svgD['line'] = line;

          return svgD;
        }
      }

      //redraw function
      function redraw(data, id, x, y, xAxis, svg, area, line, path, lpath, points, legendColor, height, axisNum) {
        //format of time data
        var parseDate = d3.time.format("%H:%M").parse;

        var ddata = (function() {
          var temp = {}, seriesArr = [];

          category.forEach(function (name) {
            temp[name] = {category: name, values:[]};
            seriesArr.push(temp[name]);
          });

          data.forEach(function (d) {
            category.map(function (name) {
              temp[name].values.push({'category': name, 'time': parseDate(d['time']), 'num': d[name]});
            });
          });

          return seriesArr;
        })();

        var ldata = (function() {
          var temp = {}, seriesArr = [];

          temp[drawLine[0]] = {category: drawLine[0], values:[]};
          seriesArr.push(temp[drawLine]);

          data.forEach(function (d) {
            drawLine.map(function (name) {
              temp[name].values.push({'category': name, 'time': parseDate(d['time']), 'num': d[name]});
            });
          });

          return seriesArr;
        })();

        var adata = (function() {
          var temp = {}, seriesArr = [];

          temp[drawArea[0]] = {category: drawArea[0], values:[]};
          seriesArr.push(temp[drawArea]);

          data.forEach(function (d) {
            drawArea.map(function (name) {
              temp[name].values.push({'category': name, 'time': parseDate(d['time']), 'num': d[name]});
            });
          });

          return seriesArr;
        })();

        // console.log(ddata);
        // console.log(adata);
        // console.log(ldata);

        x.domain( d3.extent(data, function(d) { return parseDate(d['time']); }) );
        xAxis.ticks(d3.time.minutes, Math.floor(data.length / axisNum));

        svg.select("#disk-x-axis")
            .transition()
            .duration(200)
            .ease("sin-in-out")
            .call(xAxis);

        //different area line updating

        path.select("path")
            .data(adata)
            .transition()
            .duration(200)
            .attr("d", function(d) { return area(d['values']); })
            .attr("class", 'areaR');

        lpath.select("path")
            .data(ldata)
            .transition()
            .duration(200)
            .attr("d", function(d) { return line(d['values']); })
            .attr("class", 'areaW');

        //circle updating

        points.selectAll(".tipPoints")
            .data(function (d) { return d['values']; })
            .attr("class", "tipPoints")
            .attr("cx", function (d) { return x(d['time']); })
            .attr("cy", function (d) { return y(d['num']); });

        // //draw new dot

        // console.log(ddata);
        points.data(ddata);

        points.selectAll(".tipPoints")
            .data(function (d) {
              return d['values'];
            })
            .enter().append("circle")
            .attr("class", "tipPoints")
            .attr("cx", function (d) { return x(d['time']); })
            .attr("cy", function (d) { return y(d['num']); })
            .text(function (d) { return d['num']; })
            .attr("r", "6px")
            .style("fill",function (d) { return legendColor[d['category']]; })
            .style("stroke", function (d) {
              if (d['category'] === 'write')
                return legendColor['read'];
              else
                return legendColor['write'];
            })
            .on("mouseover", function (d) {
              // console.log();
              var currentX = $(this)[0]['cx']['animVal']['value'],
                  currentY = $(this)[0]['cy']['animVal']['value'];

              d3.select(this).transition().duration(100).style("opacity", 1);

              var ret = $('.tipPoints').filter(function(index) {
                return ($(this)[0]['cx']['animVal']['value'] === currentX && $(this)[0]['cy']['animVal']['value'] !== currentY);
              });

              //to adjust tooltip'x content if read and write data are the same
              var jud = ret.length;

              var mainCate = (function() {
                if (jud === 0)
                  return 'read/write';
                else
                  return d['category'];
              })();

              var viceCate = (function() {
                if (category[0] === d['category'])
                  return category[1];
                else
                  return category[0];
              })();

              $.each(ret, function(index, val) {
                $(val).animate({
                  opacity: "1"
                }, 100);

                $(val).tooltip({
                  'container': 'body',
                  'placement': 'left',
                  'title': viceCate + ' | ' + $(this)[0]['textContent'],
                  'trigger': 'hover'
                })
                    .tooltip('show');
              });

              svg.append("g")
                  .attr("class", "tipDot")
                  .append("line")
                  .attr("class", "tipDot")
                  .transition()
                  .duration(50)
                  .attr("x1", currentX)
                  .attr("x2", currentX)
                  .attr("y2", height);

              svg.append("polyline")
                  .attr("class", "tipDot")
                  .style("fill", "black")
                  .attr("points", (currentX-3.5)+","+(0-2.5)+","+currentX+","+(0+6)+","+(currentX+3.5)+","+(0-2.5));

              svg.append("polyline")
                  .attr("class", "tipDot")
                  .style("fill", "black")
                  .attr("points", (currentX-3.5)+","+(y(0)+2.5)+","+currentX+","+(y(0)-6)+","+(currentX+3.5)+","+(y(0)+2.5));

              $(this).tooltip({
                'container': 'body',
                'placement': 'left',
                'title': mainCate + ' | ' + d['num'],
                'trigger': 'hover'
              })
              .tooltip('show');
            })
            .on("mouseout",  function (d) {
              var currentX = $(this)[0]['cx']['animVal']['value'];

              d3.select(this).transition().duration(100).style("opacity", 0);

              var ret = $('.tipPoints').filter(function(index) {
                return ($(this)[0]['cx']['animVal']['value'] === currentX);
              });

              $.each(ret, function(index, val) {
                $(val).animate({
                  opacity: "0"
                }, 100);

                $(val).tooltip('destroy');
              });

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).tooltip('destroy');
            });

        //remove old dot
        points.selectAll("circle")
            .data(function (d) { return d['values']; })
            .exit()
            .transition()
            .duration(200)
            .remove();

      }

      //inits chart
      var sca = new generate(data, "#sensor-disk-multi-d3", "monotone", 6);

      //dynamic data and chart update
      setInterval(function() {
        //update donut data
        data.push({time: hAxis + ":" + mAxis, read: Math.random()*700+200, write: Math.random()*500+400, total: 1000});

        // console.log(tAxis);
        if(mAxis === 59) {
          hAxis++;
          mAxis=0;
        }
        else {
          mAxis++;
        }

        if (Object.keys(data).length === 20) data.shift();

        redraw(data, "#sensor-disk-multi-d3", sca.getOpt()['x'], sca.getOpt()['y'], sca.getOpt()['xAxis'], sca.getSvg()['svg'], sca.getSvg()['area'], sca.getSvg()['line'], sca.getSvg()['path'], sca.getSvg()['lpath'], sca.getSvg()['points'], sca.getSvg()['legendColor'], sca.getOpt()['height'], 6);
      }, 3000);
    },
    displayPeople: function () {
      var data = [];

      for(var i=1; i<=20; i++) {
        var x = Math.random() * 141.4 - 70.7;
        var y = Math.abs(x) + Math.random() * (Math.sqrt(10000- x*x) - Math.abs(x));
        data.push({"x": x, "y": y, "radius": Math.floor(Math.random()*20), "id": i});
      }

      //generation function
      function generate(data, id) {
        var margin = {top: 20, right: 5, bottom: 10, left: 5}, height, width;

        var wTemp = $(id).width() - margin.top - margin.bottom;
        var hTemp = $(id).height() - margin.left - margin.top;

        if (hTemp * 8 / 5 > wTemp) {
          width = wTemp;
          height = width * 5 / 8;
        } else {
          height = hTemp;
          width = height * 8 / 5;
        }

        var color = d3.scale.category20();

        var x = d3.scale.linear().rangeRound([0, width]),
            y = d3.scale.linear().rangeRound([height, 0]);

        x.domain([-75,85]);
        y.domain([0,100]);

        var xAxis = d3.svg.axis().scale(x).orient("top"),
            yAxis = d3.svg.axis().scale(y).orient("left");

        var outlineArc = d3.svg.arc()
            .startAngle(-Math.PI/4.0)
            .endAngle(Math.PI/4.0)
            .innerRadius(y(0))
            .outerRadius(y(0));

        var r = d3.scale.linear()
            .domain([0, 20])
            .range([0, $(id).width() / 33]);

        // svg.append("g")
        //     .attr("class", "scatter_axis")
        //     .attr("transform", "translate(0, "+height+")")
        //     .call(xAxis);

        // svg.append("g")
        //     .attr("class", "scatter_axis")
        //     .attr("transform", "translate("+width/2+", 0)")
        //     .call(yAxis);

        var svg = d3.select(id)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //the outlines drawing of arcpie chart
        svg.append("line")
            .attr('class', 'moniOutlineXY')
            .attr({
              x1: x(0),
              y1: y(0),
              x2: x(Math.sqrt(5000)),
              y2: y(Math.sqrt(5000)),
              stroke: 'gray',
              "stroke-width": 1
            });

        svg.append("line")
            .attr('class', 'moniOutlineXY')
            .attr({
              x1: x(0),
              y1: y(0),
              x2: x(-Math.sqrt(5000)),
              y2: y(Math.sqrt(5000)),
              stroke: 'gray',
              "stroke-width": 1
            });

        var outerPath = svg.append("path")
            .attr("transform", "translate(" + (width * 15 / 32) + "," + height + ")")
            .attr("class", "moniOutlineArc")
            .attr("d", outlineArc);

        svg.selectAll(".monitorCircle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "monitorCircle")
            .attr("cx", function (d) { return x(d['x']); })
            .attr("cy", function (d) { return y(d['y']); })
            .attr("r", function (d) { return r(18); })
            .style("fill", function (d) { return color(d['id'])})
            .on("mouseover", function(d) {
              $(this).tooltip({
                'container': 'body',
                'placement': 'top',
                'title': 'PEOPLE ' + d['id'],
                'trigger': 'hover'
              })
                  .tooltip('show');
            })
            .on("mouseout", function(d) {
              $(this).tooltip('destroy');
            });

        var legendhBase = height / 21 + 1;

        var legend = svg.selectAll(".moniLegend")
            .data(data)
            .enter().append("g")
            .attr("class", "moniLegend")
            .attr("transform", function(d, i) { return "translate(0," + i * legendhBase + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
            .attr('class', 'singMoniLegend')
            .attr("x", width - legendhBase)
            .attr("width", legendhBase - 1)
            .attr("height", legendhBase - 1)
            .style("fill", function (d) { return color(d['id'])});

        // draw legend text
        legend.append("text")
            .attr("x", width - legendhBase * 1.4)
            .attr("y", legendhBase * 0.7)
          // .attr("dy", ".35em")
            .style("text-anchor", "end")
            .attr('font-size', '.6em')
            .text(function(d) { return d['id'];});

        this.getOpt = function() {
          var opt = new Object();

          opt['svg'] = svg;
          opt['x'] = x;
          opt['y'] = y;
          opt['r'] = r;
          opt['legend'] = legend;
          opt['height'] = height;
          opt['width'] = width;
          opt['legendhBase'] = legendhBase;
          opt['color'] = color;

          return opt;
        }

      }

      //redraw function
      function redraw(data, svg, legend, x, y, r, color, width, height, legendhBase) {
        //update the dot
        svg.selectAll(".monitorCircle")
            .data(data);

        //draw new dot
        svg.selectAll(".monitorCircle")
            .data(data)
            .enter()
            .append("circle")
          // .transition()
          // .duration(500)
            .attr("class", "monitorCircle")
            .attr("cx", function (d) { return x(d['x']); })
            .attr("cy", function (d) { return y(d['y']); })
            .attr("r", function (d) { return r(18); })
            .style("fill", function (d) { return color(d['id'])})
            .on("mouseover", function(d) {
              $(this).tooltip({
                'container': 'body',
                'placement': 'top',
                'title': 'PEOPLE ' + d['id'],
                'trigger': 'hover'
              })
                  .tooltip('show');
            })
            .on("mouseout", function(d) {
              $(this).tooltip('destroy');
            });

        //remove old data
        svg.selectAll(".monitorCircle")
            .data(data)
            .exit()
          // .transition()
          // .duration(500)
            .remove();

        //remove the old legend and redraw the new legend
        svg.selectAll(".moniLegend").remove();

        legend = svg.selectAll(".moniLegend")
            .data(data)
            .enter().append("g")
            .attr("class", "moniLegend")
            .attr("transform", function(d, i) { return "translate(0," + i * legendhBase + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
            .attr('class', 'singMoniLegend')
            .attr("x", width - legendhBase)
            .attr("width", legendhBase - 1)
            .attr("height", legendhBase - 1)
            .style("fill", function (d) { return color(d['id'])});

        // draw legend text
        legend.append("text")
            .attr("x", width - legendhBase * 1.4)
            .attr("y", legendhBase * 0.7)
            .style("text-anchor", "end")
            .attr('font-size', '.6em')
            .text(function(d) { return d['id'];});
      }

      //inits chart
      var sca = new generate(data, "#sensor-moni-arcpie-d3");

      //dynamic data and chart update
      setInterval(function() {
        //update data
        data = [];
        for(var i = 1; i <= Math.random() * 16; i++) {
          //to confirm the circle in the arcpie scope
          var x = Math.random() * 141.4 - 70.7;
          var y = Math.abs(x) + Math.random() * (Math.sqrt(10000- x*x) - Math.abs(x));

          data.push({
            "x": x,
            "y": y,
            "radius": Math.floor(Math.random()*20),
            "id": i
          });
        }

        redraw(data, sca.getOpt()['svg'], sca.getOpt()['legend'], sca.getOpt()['x'], sca.getOpt()['y'], sca.getOpt()['r'], sca.getOpt()['color'], sca.getOpt()['width'], sca.getOpt()['height'], sca.getOpt()['legendhBase'], "#sensor-moni-arcpie-d3");
      }, 1000);
    },
    displayDisDur: function () {
      var data=[];

      var hAxis = 10, mAxis = 20, scaAxis = 20, id = 10;

      for (var i=0; i<10; i++) {
        data.push({
          "id": 'People-'+i,
          "time": hAxis + ":" + (i * 2),
          "distance": Math.floor(Math.random()*100),
          "duration": Math.floor(Math.random() * 2 + 4)
        });
      }

      function generate(data, id, axisNum) {
        var margin = {top: 20, right: 20, bottom: 20, left: 28},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var parseDate = d3.time.format("%H:%M").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(d3.time.minutes, Math.floor(data.length/axisNum))
            .tickSize(-height)
            .tickPadding([6])
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(10)
            .tickSize(-width)
            .orient("left");

        var ddata = (function() {
          var temp = [];

          for (var i=0; i<data.length; i++) {
            temp.push({
              'id': data[i]['id'],
              'time': parseDate(data[i]['time']),
              'distance': data[i]['distance'],
              'duration': data[i]['duration']
            });
          }

          return temp;
        })();

        x.domain(d3.extent(ddata, function(d) {
          return d.time;
        }));

        y.domain([-2,102]);

        var minTime = d3.min(ddata, function(d) {
              return d.time;
            }),
            maxTime = d3.max(ddata, function(d) {
              return d.time;
            });

        var durTime;

        if (maxTime - minTime < 0)
          durTime = (maxTime - minTime + 43200000) / 60000;
        else
          durTime = (maxTime - minTime) / 60000;

        // console.log(durTime);

        d3.selectAll('.svg_timeline').remove();

        var svg = d3.select(id).append("svg")
            .attr('class', 'svg_timeline')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "sensor-timeline")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //append xaxis and yaxis lines
        svg.append("g")
            .attr("class", "axis y")
            .call(yAxis);

        //for the baseline of axis
        svg.append("g")
            .attr('id', 'timeline-x-axis')
            .attr("class", "axis x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        var bars = svg.selectAll(".timelineRect")
            .data(ddata)
            .enter().append("g")
            .attr('class', 'timelineRect')
            .attr("id", function(d) {
              return "timelineRect-"+d['id'];
            });

        bars.append("rect")
            .attr("class", "innertimeRect")
            .attr("height", 2)
            .attr("x", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud <= d['duration'] * 60000)
                return x(minTime);
              else
                return x(d['time']) - d['duration'] / durTime * width;
            })
            .attr("y", function(d) {
              return y(d['distance']) - 1;
            })
            .attr("width", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud > d['duration'] * 60000)
                return d['duration'] / durTime * width;
              else
                return x(d['time']);
            });

        bars.append("rect")
            .attr("class", "outertimeRect")
            .attr("height", 16)
            .attr("x", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud <= d['duration'] * 60000)
                return x(minTime);
              else
                return x(d['time']) - d['duration'] / durTime * width;
            })
            .attr("y", function(d) {
              return y(d['distance']) - 8;
            })
            .attr("width", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud > d['duration'] * 60000)
                return d['duration'] / durTime * width;
              else
                return x(d['time']);
            });

        bars.on("mouseover", function(d) {
          d3.selectAll('.timelineRect').transition().duration(0).style("opacity", .4);

          d3.select("#timelineRect-"+d['id']).transition().duration(50).style("opacity", 1);

          // tooltip.html('ID: '+d['id'] + '<br>Duration: ' + d['duration']+'mins<br>Time: '+d['time']+'clock<br>Distance: '+Math.floor(d['distance'])+' meters')

          $(this).popover({
            'container': 'body',
            'placement': 'right',
            'html': 'true',
            'title': d['id'],
            'content': 'Time | ' + d['time'].getDate() + "/" + (d['time'].getMonth() + 1) + "-" + d['time'].getHours() + ":" + d['time'].getMinutes() + '<br>Duration | ' + d['duration'] + '<br>Distance | ' + d['distance'],
            'trigger': 'hover'
          })
              .popover('show');

          console.log(d['time']);
        })
            .on("mouseout", function(d) {
              d3.selectAll('.timelineRect').transition().duration(300).style("opacity", 1);

              $(this).popover('destroy');
            });

        this.getData = function () {
          var svgD = new Object();
          svgD['bars'] = bars;
          svgD['xAxis'] = xAxis;
          svgD['x'] = x;
          svgD['y'] = y;
          svgD['width'] = width;
          svgD['svg'] = svg;

          return svgD;
        }
      }

      //redraw function
      function redraw(data, svg, bars, xAxis, x, y, width, axisNum) {
        var parseDate = d3.time.format("%H:%M").parse;

        var ddata = (function() {
          var temp = [];

          for (var i=0; i<data.length; i++) {
            temp.push({
              'id': data[i]['id'],
              'time': parseDate(data[i]['time']),
              'distance': data[i]['distance'],
              'duration': data[i]['duration']
            });
          }

          return temp;
        })();

        // console.log(ddata);

        x.domain(d3.extent(ddata, function(d) {
          // console.log(d['time']);
          return d.time;
        }));

        var minTime = d3.min(ddata, function(d) {
              return d.time;
            }),
            maxTime = d3.max(ddata, function(d) {
              return d.time;
            });

        var durTime;

        if (maxTime - minTime < 0)
          durTime = (maxTime - minTime + 43200000) / 60000;
        else
          durTime = (maxTime - minTime) / 60000;

        xAxis.ticks(d3.time.minutes, Math.floor(durTime / axisNum));

        svg.select('#timeline-x-axis')
            .transition()
            .duration(100)
            .ease("sin-in-out")
            .call(xAxis);

        bars = svg.selectAll(".timelineRect")
            .data(ddata);

        bars.select('.innertimeRect')
            .transition()
            .duration(0)
          // .ease("sin-in-out")
            .attr("x", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud <= d['duration'] * 60000)
                return x(minTime);
              else
                return x(d['time']) - d['duration'] / durTime * width;
            })
            .attr("y", function(d) {
              return y(d['distance']) - 1;
            })
            .attr("width", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud > d['duration'] * 60000)
                return d['duration'] / durTime * width;
              else
                return x(d['time']);
            });

        bars.select('.outertimeRect')
            .transition()
            .duration(0)
            .attr("x", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud <= d['duration'] * 60000)
                return x(minTime);
              else
                return x(d['time']) - d['duration'] / durTime * width;
            })
            .attr("y", function(d) {
              return y(d['distance']) - 8;
            })
            .attr("width", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud > d['duration'] * 60000)
                return d['duration'] / durTime * width;
              else
                return x(d['time']);
            });

        var singBar = svg.selectAll(".timelineRect")
            .data(ddata)
            .enter().append("g")
            .attr('class', 'timelineRect')
            .attr("id", function(d) {
              return "timelineRect-"+d['id'];
            });

        singBar.append("rect")
            .attr("class", "innertimeRect")
            .attr("height", 2)
            .attr("x", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud <= d['duration'] * 60000)
                return x(minTime);
              else
                return x(d['time']) - d['duration'] / durTime * width;
            })
            .attr("y", function(d) {
              return y(d['distance']) - 1;
            })
            .attr("width", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud > d['duration'] * 60000)
                return d['duration'] / durTime * width;
              else
                return x(d['time']);
            });

        singBar.append("rect")
            .attr("class", "outertimeRect")
            .attr("height", 16)
            .attr("x", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud <= d['duration'] * 60000)
                return x(minTime);
              else
                return x(d['time']) - d['duration'] / durTime * width;
            })
            .attr("y", function(d) {
              return y(d['distance']) - 8;
            })
            .attr("width", function(d) {
              var timeJud = d['time'] - minTime;
              if (timeJud < 0)
                timeJud = timeJud + 43200000;
              if (timeJud > d['duration'] * 60000)
                return d['duration'] / durTime * width;
              else
                return x(d['time']);
            });

        singBar.on("mouseover", function(d) {
          d3.selectAll('.timelineRect').transition().duration(0).style("opacity", .4);

          d3.select("#timelineRect-"+d['id']).transition().duration(50).style("opacity", 1);

          $(this).popover({
            'container': 'body',
            'placement': 'right',
            'html': 'true',
            'title': d['id'],
            'content': 'Time | ' + d['time'].getDate() + "/" + (d['time'].getMonth() + 1) + "-" + d['time'].getHours() + ":" + d['time'].getMinutes() + '<br>Duration | ' + d['duration'] + '<br>Distance | ' + d['distance'],
            'trigger': 'hover'
          })
              .popover('show');
        })
            .on("mouseout", function(d) {
              d3.selectAll('.timelineRect').transition().duration(300).style("opacity", 1);

              $(this).popover('destroy');
            });

        bars.selectAll('.timelineRect')
            .data(ddata)
            .exit()
            .transition()
            .duration(200)
            .remove();
      }

      //inits chart
      var sca = new generate(data, "#sensor-dis-dur-timeline-d3", 5);

      //dynamic data and chart update
      setInterval(function() {
        //throw the old data
        var loopJud = Object.keys(data).length, delNum = 0;

        var beginJud;

        if (mAxis - scaAxis < 0) {
          if (hAxis == 0)
            beginJud = '23:' + (60 + mAxis - scaAxis);
          else
            beginJud = (hAxis-1) + ':' + (60 + mAxis - scaAxis);
          // console.log(beginJud);
        } else {
          beginJud = hAxis + ':' + (mAxis - scaAxis);
        }

        if (scaAxis === 60) {
          for (var i=0; ; i++) {
            if ((i+delNum) === loopJud)
              break;

            // console('beginJud is '+beginJud + ', and time is' + data[i-delNum]['time']);

            //BUG
            console.log('beginJud is '+beginJud );

            if (data[i-delNum]['time'] === beginJud) {
              console.log('I AM DELETING DATA.');

              data.shift();
              delNum++;
            }
          }
        }

        // append new data into existing json dataset
        // var randNum = Math.floor(Math.random()*2);
        var randNum = 1;

        if (randNum) {
          for (var i=0; i<randNum; i++) {
            data.push({
              "id": 'people-' + id,
              "time": hAxis + ":" + mAxis,
              "distance": Math.floor(Math.random()*100),
              "duration": Math.floor(Math.random()*4+6)});

            id++;
          }
        }

        if(mAxis === 59) {
          hAxis++;
          mAxis=0;
        }
        else {
          mAxis++;
        }

        if (scaAxis < 60) scaAxis++;

        redraw(data, sca.getData()['svg'], sca.getData()['bars'], sca.getData()['xAxis'], sca.getData()['x'], sca.getData()['y'], sca.getData()['width'], 5);
      }, 6000);
    },
    displayDetec: function () {
      var data = [
        {label: "fall detection", value: 59, color: '#fff799'},
        {label: "lens detection", value: 75, color: '#ffee00'},
        {label: "violence_sos detection", value: 92, color: '#0068b7'},
        {label: "single money detection", value: 80, color: '#00b7ee'}
      ];

      var data2 = [
        {label: "task_scheduler", value: 59, color: '#fff799'},
        {label: "depth_MoG_background", value: 75, color: '#ffee00'},
        {label: "door_latch", value: 92, color: '#0068b7'},
        {label: "primesense_ringbuffer", value: 80, color: '#00b7ee'},
        {label: "plane_view", value: 59, color: '#a5d4f3'},
        {label: "detection_combination", value: 75, color: '#eff9ff'},
        {label: "object_tracker", value: 92, color: '#00a0e9'},
        {label: "global_event_vis", value: 80, color: '#ca02ab'},
        {label: "fall_detection", value: 59, color: '#f29c9f'},
        {label: "violence_sos_detection", value: 75, color: '#ff0000'},
        {label: "invalid_operation_detection", value: 92, color: '#22ac38'},
        {label: "cutboard", value: 80, color: '#FF8C00'}
      ];

      var category = [];

      //generation function
      function generate(data, id, mAxis) {
        var margin = {top: 15, right: 10, bottom: 5, left: 10},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var radius = Math.min(width, height) / 2 - margin.bottom,
            innerRadius = 0.3 * radius;

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
              return 50;
            });

        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(function (d) {
              return (radius - innerRadius) * (d.data.value / mAxis) + innerRadius;
            });

        var outlineArc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);

        var svg = d3.select(id).append('svg')
            .attr('class', 'aster_svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + ((height) / 2 +  margin.top) + ")");

        // svg.call(tip);

        var path = svg.selectAll(".solidAsterArc")
            .data(pie(data))
            .enter().append("path")
            .attr("fill", function(d) { return d.data.color; })
            .attr("class", "solidAsterArc")
            .attr("d", arc)
            .on("mouseover", function (d) {
              $(this).tooltip({
                'container': 'body',
                'placement': 'top',
                'title': d.data.label + " | " + d.data.value,
                'trigger': 'hover'
              })
                  .tooltip('show');
            })
            .on("mouseout", function(d) {
              $(this).tooltip('destroy');
            });

        var outerPath = svg.selectAll(".outlineAsterArc")
            .data(pie(data))
            .enter().append("path")
            .attr("class", "outlineAsterArc")
            .attr("d", outlineArc);

        svg.append("svg:text")
            .attr("class", "asterCenterText")
            .attr('dy', '.4em')
            .text('DEMO');

        this.getSvg = function () {
          var svgD = new Object();
          // svgD['svg'] = svg;
          svgD['path'] = path;
          svgD['pie'] = pie;
          svgD['arc'] = arc;
          svgD['r'] = radius;
          svgD['ir'] = innerRadius;

          return svgD;
        }
      }

      //redraw function
      function redraw(data, path, pie, arc, r, ir, mAxis) {
        // arc.outerRadius(function (d) {
        //   return (r - ir) * (d.data.value / mAxis) + ir;
        // });
        // console.log("I am updating the drawing work.");

        path.data(pie(data))
            .transition()
            .duration(200)
            .attr("d", arc.innerRadius(ir).outerRadius(function (d) {
              return (r - ir) * (d.data.value / mAxis) + ir;
            }));
      }

      //inits chart
      var sca = new generate(data, "#sensor-detec-aster-d3", 100),
          sca2 = new generate(data2, '#sensor-detec-aster2-d3', 100);

      //dynamic data and chart update
      setInterval(function() {
        //update donut data
        for (var i=0; i<data.length; i++) {
          data[i]['value'] = Math.floor(Math.random()*100);
        }

        for (var i=0; i<data2.length; i++) {
          data2[i]['value'] = Math.floor(Math.random()*100);
        }

        redraw(data, sca.getSvg()['path'], sca.getSvg()['pie'], sca.getSvg()['arc'], sca.getSvg()['r'], sca.getSvg()['ir'], 100);
        redraw(data2, sca2.getSvg()['path'], sca2.getSvg()['pie'], sca2.getSvg()['arc'], sca2.getSvg()['r'], sca2.getSvg()['ir'], 100);
      }, 5000);
    },
    displayCount: function () {
      var data = [
        {time: '10:01', 'in': 200, 'remain': 500, 'out': 1000},
        {time: '10:02', 'in': 620, 'remain': 600, 'out': 1000},
        {time: '10:03', 'in': 300, 'remain': 800, 'out': 1000},
        {time: '10:04', 'in': 440, 'remain': 700, 'out': 1000},
        {time: '10:05', 'in': 900, 'remain': 900, 'out': 1000},
        {time: '10:06', 'in': 300, 'remain': 500, 'out': 1000},
        {time: '10:07', 'in': 50, 'remain': 300, 'out': 1000},
        {time: '10:08', 'in': 350, 'remain': 70, 'out': 1000},
        {time: '10:09', 'in': 750, 'remain': 200, 'out': 1000}
      ];

      var category = ['in', 'remain', 'out'];

      var drawLine = ['write'],
          drawBar = ['in', 'out'];

      var hAxis = 10, mAxis = 10;

      //generation function
      function generate(data, id, lineType, axisNum, drawBar, category) {
        var margin = {top: 10, right: 70, bottom: 35, left: 32},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var parseDate = d3.time.format("%H:%M").parse;

        var legendSize = 10,
            legendColor = {'in': 'rgba(0, 160, 233, .8)', 'out': 'rgba(0, 160, 233, .2)', 'remain': '#41DB00'};

        var x = d3.time.scale()
            .range([0, width]);
        // .rangeRoundBands([0, width], .1);

        var x1 = d3.scale.ordinal();

        var y = d3.scale.linear()
            .range([height, 0]);

        //data.length/10 is set for the garantte of timeseries's fitting effect in svg chart
        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(d3.time.minutes, Math.floor(data.length / axisNum))
            .tickPadding([6])
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(10)
            .orient("left");

        var ddata = data;

        ddata.forEach(function(d) {
          d.ages = drawBar.map(function(name) { return {name: name, value: +d[name]}; });
        });

        x.domain( d3.extent(ddata, function(d) { return parseDate(d['time']); }) );

        // console.log(x(parseDate(10:10))-x(parseDate(10:09)));

        var tranLength = (x(parseDate('00:10'))-x(parseDate('00:09'))) / 4;

        x1.domain(drawBar).rangeRoundBands([0, tranLength * 2]);

        y.domain([
          0,
          d3.max(ddata, function(d) { return d3.max([d['in'], d['out'], d['remain']]); }) + 50
        ]);

        var line = d3.svg.line()
            .interpolate(lineType)
            .x(function(d) { return xTransLen(d['time']); })
            .y(function(d) { return y(d['remain']); });

        d3.select('#svg-count').remove();

        var svg = d3.select(id).append("svg")
            .attr("id", "svg-count")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "count-x-axis")
            .attr("transform", "translate(" + tranLength + "," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var stat = svg.selectAll(".countBpath")
            .data(ddata)
            .enter().append("g")
            .attr("class", "countBpath")
            .attr("transform", function(d) { return "translate(" + x(parseDate(d['time'])) + ",0)"; });

        stat.selectAll(".countIORect")
            .data(function(d) { return d.ages; })
            .enter().append("rect")
            .attr('class', 'countIORect')
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d['name']); })
            .attr("y", function(d) { return y(d['value']); })
            .attr("height", function(d) { return height - y(d['value']); })
            .style("fill", function(d) { return legendColor[d['name']]; });

        var path = svg.append("g")
            .attr("class", "countPath");

        path.append("path")
            .attr("d", line(ddata))
            .attr("class", 'countRemainPath')
            .attr('stroke', legendColor['remain']);

        var legend = svg.selectAll('.countLegend')
            .data(category)
            .enter()
            .append('g')
            .attr('class', 'countLegend')
            .attr('transform', function(d, i) {
              return 'translate(' + (i * 10 * legendSize) + ',' + (height + margin.bottom - legendSize * 1.2) + ')';
            });

        legend.append('rect')
            .attr('width', legendSize)
            .attr('height', legendSize)
            .style('fill', function(d) {
              return legendColor[d];
            });

        legend.append('text')
            .data(category)
            .attr('x', legendSize * 1.2)
            .attr('y', legendSize / 1.1)
            .text(function(d) {
              return d;
            });

        var points = svg.append("g")
            .attr("class", "countPoints");

        points.selectAll(".tipCountPoints")
            .data(ddata)
            .enter().append("circle")
            .attr("class", "tipCountPoints")
            .attr("cx", function (d) { return xTransLen(d['time']); })
            .attr("cy", function (d) { return y(d['remain']); })
            .attr("r", "6px")
            .on("mouseover", function (d) {
              d3.select(this).transition().duration(100).attr("r", '8px');

              // svg.append("g")
              //   .append("line")
              //   .attr("class", "tipDot")
              //   .transition()
              //   .duration(50)
              //   .attr("x1", xTransLen(d['time']))
              //   .attr("x2", xTransLen(d['time']))
              //   .attr("y2", height);

              // svg.append("polyline")
              //   .attr("class", "tipDot")
              //   .style("fill", "black")
              //   .attr("points", (xTransLen(d['time'])-3.5)+","+(0-2.5)+","+xTransLen(d['time'])+","+(0+6)+","+(xTransLen(d['time'])+3.5)+","+(0-2.5));

              // svg.append("polyline")
              //   .attr("class", "tipDot")
              //   .style("fill", "black")
              //   .attr("points", (xTransLen(d['time'])-3.5)+","+(y(0)+2.5)+","+xTransLen(d['time'])+","+(y(0)-6)+","+(xTransLen(d['time'])+3.5)+","+(y(0)+2.5));

              $(this).popover({
                'container': 'body',
                'placement': 'top',
                'html': 'true',
                'title': d['time'],
                'content': '<table><tr><td>' + 'TIME' + '</td><td> | ' + d['time'] + '</td></tr>' + '<tr><td>' + 'REMAIN' + '</td><td> | ' + d['remain'] + '</td></tr>' + '<tr><td>' + 'IN' + '</td><td> | ' + d['in'] + '</td></tr>' + '<tr><td>' + 'OUT' + '</td><td> | ' + d['out'] + '</td></tr></table>',
                'trigger': 'hover'
              })
                  .popover('show');
            })
            .on("mouseout",  function (d) {
              d3.select(this).transition().duration(100).attr("r", '6px');

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).popover('destroy');
            });

        function xTransLen(t) {
          return x(parseDate(t)) + tranLength;
        }

        this.getOpt = function() {
          var axisOpt = new Object();
          axisOpt['x'] = x;
          axisOpt['x1'] = x;
          axisOpt['y'] = y;
          axisOpt['xAxis'] = xAxis;
          axisOpt['height'] = height;
          axisOpt['axisNum'] = axisNum;
          axisOpt['drawBar'] = drawBar;

          return axisOpt;
        }

        this.getSvg = function() {
          var svgD = new Object();
          svgD['svg'] = svg;
          svgD['points'] = points;
          svgD['stat'] = stat;
          svgD['path'] = path;
          svgD['line']  =line;
          svgD['legendColor'] = legendColor;

          return svgD;
        }
      }

      //redraw function
      function redraw(data, id, x, y, xAxis, svg, stat, path, line, points, legendColor, height, axisNum, drawBar) {
        //format of time data
        var parseDate = d3.time.format("%H:%M").parse;

        var ddata = data;

        ddata.forEach(function(d) {
          d.ages = drawBar.map(function(name) { return {name: name, value: +d[name]}; });
        });

        x.domain( d3.extent(ddata, function(d) { return parseDate(d['time']); }) );

        var tranLength = (x(parseDate('00:10'))-x(parseDate('00:09'))) / 4;

        var x1 = d3.scale.ordinal();

        x1.domain(drawBar).rangeRoundBands([0, tranLength * 2]);

        xAxis.ticks(d3.time.minutes, Math.floor(data.length / axisNum));

        line.x(function(d) { return xTransLen(d['time']); });

        svg.select("#count-x-axis")
            .transition()
            .duration(200)
            .ease("sin-in-out")
            .call(xAxis);

        //update the stat bar
        stat = svg.selectAll(".countBpath")
            .data(ddata)
            .attr("transform", function(d) { return "translate(" + x(parseDate(d['time'])) + ",0)"; });

        stat.selectAll(".countIORect")
            .data(function(d) { return d.ages; })
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d['name']); })
            .attr("y", function(d) { return y(d['value']); })
            .attr("height", function(d) { return height - y(d['value']); })
            .style("fill", function(d) { return legendColor[d['name']]; });

        //append new bar
        stat = svg.selectAll(".countBpath")
            .data(ddata)
            .enter().append("g")
            .attr("class", "countBpath")
            .attr("transform", function(d) { return "translate(" + x(parseDate(d['time'])) + ",0)"; });

        stat.selectAll(".countIORect")
            .data(function(d) { return d.ages; })
            .enter().append("rect")
            .attr('class', 'countIORect')
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d['name']); })
            .attr("y", function(d) { return y(d['value']); })
            .attr("height", function(d) { return height - y(d['value']); })
            .style("fill", function(d) { return legendColor[d['name']]; });

        //remove the old bar
        stat.selectAll(".countIORect")
            .data(function(d) { return d.ages; })
            .exit()
            .transition()
            .duration(200)
            .remove();

        //remove the path and redraw it, in order to confirm it display in front of other elements
        d3.selectAll('.countPath').remove();

        var path = svg.append("g")
            .attr("class", "countPath");

        path.append("path")
            .attr("d", line(ddata))
            .attr("class", 'countRemainPath')
            .attr('stroke', legendColor['remain']);

        //update the path line
        // path.selectAll('.countRemainPath')
        //   .data(ddata)
        //   .transition()
        //   .duration(200)
        //   .attr("d", line(ddata))
        //   .attr("class", 'countRemainPath')
        //   .attr('stroke', legendColor['remain']);

        //circle updating
        // points.selectAll(".tipCountPoints")
        //   .data(ddata)
        //   .attr("class", "tipCountPoints")
        //   .attr("cx", function (d) { return xTransLen(d['time']); })
        //   .attr("cy", function (d) { return y(d['remain']); });

        //remove all the points and append new points
        d3.selectAll('.countPoints').remove();

        points = svg.append("g")
            .attr("class", "countPoints");

        points.selectAll(".tipCountPoints")
            .data(ddata)
            .enter().append("circle")
            .attr("class", "tipCountPoints")
            .attr("cx", function (d) { return xTransLen(d['time']); })
            .attr("cy", function (d) { return y(d['remain']); })
            .attr("r", "6px")
            .on("mouseover", function (d) {
              d3.select(this).transition().duration(100).attr("r", '8px');

              $(this).popover({
                'container': 'body',
                'placement': 'top',
                'html': 'true',
                'title': d['time'],
                'content': '<table><tr><td>' + 'TIME' + '</td><td> | ' + d['time'] + '</td></tr>' + '<tr><td>' + 'REMAIN' + '</td><td> | ' + d['remain'] + '</td></tr>' + '<tr><td>' + 'IN' + '</td><td> | ' + d['in'] + '</td></tr>' + '<tr><td>' + 'OUT' + '</td><td> | ' + d['out'] + '</td></tr></table>',
                'trigger': 'hover'
              })
                  .popover('show');
            })
            .on("mouseout",  function (d) {
              d3.select(this).transition().duration(100).attr("r", '6px');

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).popover('destroy');
            });

        //remove old dot
        // points.selectAll(".tipCountPoints")
        //   .data(ddata)
        //   .exit()
        //   .transition()
        //   .duration(200)
        //   .remove();

        function xTransLen(t) {
          return x(parseDate(t)) + tranLength;
        }

      }

      //inits chart
      var sca = new generate(data, "#sensor-count-multi-d3", "monotone", 5, drawBar, category);

      //dynamic data and chart update
      setInterval(function() {
        //update donut data
        data.push({time: hAxis + ":" + mAxis, 'in': Math.random()*700+200, 'out': Math.random()*500+400, 'remain': Math.random()*700+200});

        // console.log(tAxis);
        if(mAxis === 59) {
          hAxis++;
          mAxis=0;
        }
        else {
          mAxis++;
        }

        if (Object.keys(data).length === 18) data.shift();

        redraw(data, "#sensor-disk-multi-d3", sca.getOpt()['x'], sca.getOpt()['y'], sca.getOpt()['xAxis'], sca.getSvg()['svg'], sca.getSvg()['stat'], sca.getSvg()['path'], sca.getSvg()['line'], sca.getSvg()['points'], sca.getSvg()['legendColor'], sca.getOpt()['height'], sca.getOpt()['axisNum'], sca.getOpt()['drawBar']);
      }, 3000);
    },
    checkOpt: function (e) {
      var self = this;

      //check the Scatter Choice and Refresh the charts
      var count = 0;
      for (var i=0; i < self.scatterCategory.length; i++) {
        if ($("#" + self.scatterCategory[i]).prop("checked"))
          count++;
      }

      //judge if the checked checkbox reach the max limitation
      if (count>5) {
        alert("NOTICE: The MAXIMUM selection should be FIVE.");
        e.target.checked = false;
      }

      self.selectScaCate = [];

      for (var i=0; i<self.scatterCategory.length; i++) {
        if ($("#"+self.scatterCategory[i]).prop("checked")) {
          self.selectScaCate.push(self.scatterCategory[i]);
          d3.selectAll(".scatter_circle_"+self.scatterCategory[i]).transition().duration(300).style("display", 'inherit');
        }
        else
          d3.selectAll(".scatter_circle_"+self.scatterCategory[i]).transition().duration(300).style("display", 'none');
      }

      //redraw the legend and chart
      this.legendRedraw(self.selectScaCate, "#sensor-docker-scatterplot-d3", self.sensorDockerFunc.getSvg()['legend'], self.sensorDockerFunc.getSvg()['rect'], self.sensorDockerFunc.getOpt()['legendSize'], self.sensorDockerFunc.getOpt()['margin'], self.sensorDockerFunc.getOpt()['height'], self.sensorDockerFunc.getOpt()['width'], self.sensorDockerFunc.getSvg()['color']);
    },
    legendRedraw: function (selectCate, id, legend, rect, legendSize, margin, height, width, color) {
      //update the scatter plot legend
      legend.selectAll('.docker_legend')
          .data(selectCate)
        // .transition()
        // .duration(200)
          .attr('transform', function(d, i) {
            return 'translate(' + ((5 + (width-20) / 5) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
          })

      legend.selectAll('rect')
          .data(selectCate)
          .style('fill', function(d) {
            return color(d);
          });

      legend.selectAll('text')
          .data(selectCate)
          .attr('x', legendSize*1.4)
          .attr('y', legendSize/1.3)
          .attr('font-size', function() {
            if ($(id).width() > 415)
              return '.9em';
            else {
              return '.55em';
            }
          })
          .text(function(d) {
            return d;
          });

      //create new legends
      var singLegend = legend.selectAll('.docker_legend')
          .data(selectCate)
          .enter()
          .append('g')
          .attr('class', 'docker_legend')
          .attr('transform', function(d, i) {
            return 'translate(' + ((5 + (width-20) / 5) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
          });

      singLegend.append('rect')
          .attr('width', legendSize)
          .attr('height', legendSize)
          .style('fill', function(d) {
            return color(d);
          });

      singLegend.append('text')
          .attr('x', legendSize*1.4)
          .attr('y', legendSize/1.3)
          .attr('font-size', function() {
            if ($(id).width() > 415)
              return '.9em';
            else {
              return '.55em';
            }
          })
          .text(function(d) {
            return d;
          });

      //remove the old legends
      legend.selectAll('.docker_legend')
          .data(selectCate)
          .exit()
          .remove();

      //redraw the rect around the legend
      rect.selectAll('.legendRect')
          .data(selectCate)
          .attr('transform', function(d, i) {
            return 'translate(' + ((5 + (width-20) / 5) * i) + ',' + (height + margin.bottom - legendSize - 20) + ')';
          });

      rect.selectAll('.legendRect')
          .data(selectCate)
          .enter()
          .append('rect')
          .attr('class', 'legendRect')
          .attr('width', (width - 20) / 5)
          .attr('height', legendSize + 10)
          .attr('transform', function(d, i) {
            return 'translate(' + ((5 + (width-20) / 5) * i) + ',' + (height + margin.bottom - legendSize - 20) + ')';
          });

      rect.selectAll('.legendRect')
          .data(selectCate)
          .exit()
          .remove();
    },
    displayDCPU: function () {
      var data = 55;

      //generation function
      function generate(data, id) {
        var margin = {top: 45, right: 10, bottom: 10, left: 10},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var svg = d3.select(id).append("svg")
            .attr("width", width+margin.right+margin.left)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        for (var i=0; i<20; i++) {
          svg.append('rect')
              .attr("width", (width - 84) / 20)
              .attr("height", height * 0.55)
              .attr('id', 'docker_cpu_rect_' + (i+1))
              .attr('transform', "translate(" + (i * (width - 4) / 20) + ",0)" );
        }

        var i=0;
        var temp = Math.floor(data / 5);
        if (temp === 0 && data !== 0)
          temp =1;

        for ( ; i < temp; i++) {
          svg.select('#docker_cpu_rect_' + (i+1)).style('fill', '#00afff');
        }

        for ( ; i<20; i++) {
          svg.select('#docker_cpu_rect_' + (i+1)).style('fill', '#f3f3f3');
        }

        svg.selectAll('.dockerCpuText').remove();

        svg.append('text')
            .attr('class', 'dockerCpuText')
            .attr('x', 0)
            .attr('y', height * 0.8 + margin.top)
            .text(data + '%');
      }

      //redraw function
      function redraw(data) {
        //format of time data
        var i=0;
        var temp = Math.floor(data / 5);
        if (temp === 0 && data !== 0)
          temp =1;

        for ( ; i < temp; i++) {
          d3.select('#docker_cpu_rect_' + (i+1)).style('fill', '#00afff');
        }

        for ( ; i<20; i++) {
          d3.select('#docker_cpu_rect_' + (i+1)).style('fill', '#f3f3f3');
        }

        d3.select('.dockerCpuText').text(data + '%');
      }

      //inits chart
      var sca = new generate(data, "#docker-cpu-rect-d3");

      //dynamic data and chart update
      setInterval(function() {
        //update donut data
        data = Math.floor(Math.random() * 100);

        redraw(data);
      }, 1500);
    },
    displayDMem: function () {
      var data = [
        {time: '10:01', used: 200, extra: 500, total: 1000},
        {time: '10:02', used: 620, extra: 600, total: 1000},
        {time: '10:03', used: 300, extra: 800, total: 1000},
        {time: '10:04', used: 440, extra: 700, total: 1000},
        {time: '10:05', used: 900, extra: 700, total: 1000},
        {time: '10:06', used: 300, extra: 700, total: 1000},
        {time: '10:07', used: 50, extra: 700, total: 1000},
        {time: '10:08', used: 350, extra: 700, total: 1000},
        {time: '10:09', used: 750, extra: 700, total: 1000}
      ];

      var category = ['used'];

      var hAxis = 10, mAxis = 10;

      //generation function
      function generate(data, id, axisNum) {
        var margin = {top: 20, right: 18, bottom: 35, left: 28},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var parseDate = d3.time.format("%H:%M").parse;
        var formatPercent = d3.format(".0%");

        var legendSize = 10,
            legendColor = 'rgba(0, 160, 233, 0.7)';

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(d3.time.minutes, Math.floor(data.length/axisNum))
            .tickSize(-height)
            .tickPadding([6])
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(10)
            .tickSize(-width)
            .tickFormat(formatPercent)
            .orient("left");

        var ddata = (function() {
          var temp = [];

          for (var i=0; i<data.length; i++) {
            temp.push({'time': parseDate(data[i]['time']), 'used': data[i]['used'], 'extra': data[i]['extra'], 'total': data[i]['total']});
          }

          return temp;
        })();

        // console.log(ddata);

        x.domain(d3.extent(ddata, function(d) { return d.time; }));

        var area = d3.svg.area()
            .x(function(d) { return x(d.time); })
            .y0(height)
            .y1(function(d) { return y(d['used']/d['total']); })
            .interpolate("cardinal");

        d3.select('#svg-memD').remove();

        var svg = d3.select(id).append("svg")
            .attr("id", "svg-memD")
            .attr("width", width+margin.right+margin.left)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "memD-x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var path = svg.append("svg:path")
            .datum(ddata)
            .attr("class", "areaDM")
            .attr("d", area);

        var points = svg.selectAll(".gPoints")
            .data(ddata)
            .enter().append("g")
            .attr("class", "gPoints");

        //legend rendering
        var legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(0,'+ (height + margin.bottom - legendSize * 1.2) +')');

        legend.append('rect')
            .attr('width', legendSize)
            .attr('height', legendSize)
            .style('fill', legendColor);

        legend.append('text')
            .data(ddata)
            .attr('x', legendSize*1.2)
            .attr('y', legendSize/1.1)
            .text('used');

        points.selectAll(".circle")
            .data(ddata)
            .enter().append("circle")
            .attr("class", "memtipDPoints")
            .attr("cx", function (d) {
              return x(d.time);
            })
            .attr("cy", function (d) {
              return y(d['used']/d['total']);
            })
            .attr("r", "6px")
            .on("mouseover", function (d) {
              console.log(this);

              d3.select(this).transition().duration(100).style("opacity", 1);

              svg.append("g")
                  .attr("class", "tipDot")
                  .append("line")
                  .attr("class", "tipDot")
                  .transition()
                  .duration(50)
                  .attr("x1", x(d['time']))
                  .attr("x2", x(d['time']))
                  .attr("y2", height);

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(1)-2.5)+","+x(d['time'])+","+(y(1)+6)+","+(x(d['time'])+3.5)+","+(y(1)-2.5));

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(0)+2.5)+","+x(d['time'])+","+(y(0)-6)+","+(x(d['time'])+3.5)+","+(y(0)+2.5));

              $(this).tooltip({
                'container': 'body',
                'placement': 'left',
                'title': 'Used' + ' | ' + formatPercent(d['used']/d['total']),
                'trigger': 'hover'
              })
                  .tooltip('show');
            })
            .on("mouseout",  function (d) {
              d3.select(this).transition().duration(100).style("opacity", 0);

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).tooltip('destroy');
            });

        this.getOpt = function() {
          var axisOpt = new Object();
          axisOpt['x'] = x;
          axisOpt['y'] = y;
          axisOpt['xAxis'] = xAxis;
          axisOpt['width'] = width;
          axisOpt['height'] = height;

          return axisOpt;
        }

        this.getSvg = function() {
          var svgD = new Object();
          svgD['svg'] = svg;
          svgD['points'] = points;
          svgD['area'] = area;
          svgD['path'] = path;

          return svgD;
        }
      }

      //redraw function
      function redraw(data, id, x, y, xAxis, svg, area, path, points, height, axisNum) {
        //format of time data
        var parseDate = d3.time.format("%H:%M").parse;
        var formatPercent = d3.format(".0%");

        var ddata = (function() {
          var temp = [];

          for (var i=0; i<data.length; i++) {
            temp.push({'time': parseDate(data[i]['time']), 'used': data[i]['used'], 'extra': data[i]['extra'], 'total': data[i]['total']});
          }

          return temp;
        })();

        // svg.attr("width", $(id).width())
        //   .attr("height", $(id).height());

        x.domain(d3.extent(ddata, function(d) {
          return d['time'];
        }));

        xAxis.ticks(d3.time.minutes, Math.floor(data.length / axisNum));

        svg.select("#memD-x-axis")
            .transition()
            .duration(200)
            .ease("sin-in-out")
            .call(xAxis);

        //area line updating
        path.datum(ddata)
            .transition()
            .duration(200)
            .attr("class", "areaDM")
            .attr("d", area);

        //circle updating
        points.selectAll(".memtipDPoints")
            .data(ddata)
            .attr("class", "memtipDPoints")
            .attr("cx", function (d) {
              return x(d.time);
            })
            .attr("cy", function (d) {
              return y(d['used']/d['total']);
            })
            .attr("r", "6px");

        //draw new dot
        points.selectAll(".memtipDPoints")
            .data(ddata)
            .enter().append("circle")
            .attr("class", "memtipDPoints")
            .attr("cx", function (d) {
              return x(d.time);
            })
            .attr("cy", function (d) {
              return y(d['used']/d['total']);
            })
            .attr("r", "6px")
            .on("mouseover", function (d) {
              d3.select(this).transition().duration(100).style("opacity", 1);

              svg.append("g")
                  .attr("class", "tipDot")
                  .append("line")
                  .attr("class", "tipDot")
                  .transition()
                  .duration(50)
                  .attr("x1", x(d['time']))
                  .attr("x2", x(d['time']))
                  .attr("y2", height);

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(1)-2.5)+","+x(d['time'])+","+(y(1)+6)+","+(x(d['time'])+3.5)+","+(y(1)-2.5));

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(0)+2.5)+","+x(d['time'])+","+(y(0)-6)+","+(x(d['time'])+3.5)+","+(y(0)+2.5));

              $(this).tooltip({
                'container': 'body',
                'placement': 'left',
                'title': 'Used' + ' | ' +formatPercent(d['used']/d['total']),
                'trigger': 'hover'
              })
                  .tooltip('show');
            })
            .on("mouseout",  function (d) {
              d3.select(this).transition().duration(100).style("opacity", 0);

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).tooltip('destroy');
            });

        //remove old dot
        points.selectAll(".memtipDPoints")
            .data(ddata)
            .exit()
            .transition()
            .duration(200)
            .remove();

      }

      //inits chart
      var sca = new generate(data, "#docker-mem-area-d3", 8);

      //dynamic data and chart update
      setInterval(function() {
        //update donut data
        data.push({time: hAxis + ":" + mAxis, used: Math.random()*200+400, extra: Math.random()*1000, total: 1000});

        // console.log(tAxis);
        if(mAxis === 59) {
          hAxis++;
          mAxis=0;
        }
        else {
          mAxis++;
        }

        if (Object.keys(data).length === 20) data.shift();

        // generate(data, "#docker-mem-area-d3");
        redraw(data, "#docker-mem-area-d3", sca.getOpt()['x'], sca.getOpt()['y'], sca.getOpt()['xAxis'], sca.getSvg()['svg'], sca.getSvg()['area'], sca.getSvg()['path'], sca.getSvg()['points'], sca.getOpt()['height'], 8);
      }, 3500);
    }
  },
  compiled: function () {
    var self = this;

    self.displayMem();
    self.displayDocker();
    self.displayCPU();
    self.displayNet();
    self.displayDisk();

    self.displayPeople();
    self.displayDisDur();
    self.displayDetec();
    self.displayCount();

    self.displayDCPU();
    self.displayDMem();

    setInterval(function () {
      self.people_count = Math.floor( Math.random() * 1000 );
    }, 2000);
  }
});