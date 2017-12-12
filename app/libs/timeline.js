(function(){

  var hdil = window.hdil || (window.hdil = {});

  hdil.timeline = function(){

  var height = 600,
      width = 600,
      dispatch = d3.dispatch("brushEnd"),
      resetBrush = false,
      normalize = false,
      duration = 1000,
      maxY,
      extent;


  function timeline(selection){
    selection.each(function(data){
      var chart;
      var margin = {top: 10, right: 10, bottom: 0, left: 10},
          chartWidth = width - margin.left - margin.right,
          chartHeight = height - margin.top - margin.bottom;

      if (selection.select('svg').empty()){
        chart = selection.append('svg')
        .attr('width', width)
        .attr('height', height)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      }
      else
      {
        chart = selection.select('svg')
        .attr('width', width)
        .attr('height', height)
          .select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      }

      var y = d3.scaleLinear()
                .rangeRound([chartHeight,0])

      var x = d3.scaleTime()
              .rangeRound([0, chartWidth]);

      var area = d3.area()
          .x(function(d) { return x(d.date); })
          .y1(function(d) { return y(d.value); })
          .curve(d3.curveStep)

      var timeRange = d3.timeMonth.range(extent);
      var dateMap = data.map(function(d){return d.date.getTime()})
      timeRange.forEach(function(d){
        if(dateMap.indexOf(d.getTime()) == -1){
          data.push({date:d,value:0})
        }
      })

      var bisectDate = d3.bisector(function(d) { return d.date; }).left;

      x.domain(extent);
      if(normalize){
        y.domain([0, maxY]);
      }else{
        y.domain([0, d3.max(data, function(d) { return d.value; })]);
      }

      area.y0(y(0));


      var path = chart.selectAll('path').data([data])

      path.enter().append("path")
        .attr("fill", "#00C5CA")
        .attr("d", area)

      path.attr("d", area);


      var xAxis = chart.select('.xAxis');

      if(xAxis.empty()){
        chart.append("g")
            .attr('class', 'xAxis')
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(
              d3.axisBottom(x).tickSize(-chartHeight)
            );
      }else{
        xAxis.call(d3.axisBottom(x).tickSize(-chartHeight))
      }

      var focus = chart.select('.focus');
      if(focus.empty()){
        focus = chart.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 2);

        focus.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size","10px")
            .attr("dy", "-3px");
      }

      var overlay = chart.select('.overlay');
      if(overlay.empty()){

        var overlayWidth = x(data[data.length-1].date)-x(data[0].date),
            overlayX = x(data[0].date);

        chart.append("rect")
          .attr("class", "overlay")
          .attr("width", overlayWidth)
          .attr("height", chartHeight)
          .attr("x", overlayX)
          .attr("fill", "none")
          .style("pointer-events","all")
          .style("cursor","none")
          .on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove);
      }else{
        overlay.on("mousemove", mousemove);
      }


      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i]?data[i]:data[i - 1];
        var d = x0 - d0.date.getTime() > d1.date.getTime() - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
        focus.select("text").text(function() {
          return d.value===0?'':d3.format(",.0f")(d.value);
        });
      }
    }); //end selection
  } // end timeline

  timeline.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return timeline;
  }

  timeline.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return timeline;
  }

  timeline.extent = function(x){
    if (!arguments.length) return extent;
    extent = x;
    return timeline;
  }

  timeline.maxY = function(x){
    if (!arguments.length) return maxY;
    maxY = x;
    return timeline;
  }

  timeline.normalize = function(x){
    if (!arguments.length) return normalize;
    normalize = x;
    return timeline;
  }

  timeline.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return timeline;
  }

  timeline.resetBrush = function(x){
    if (!arguments.length) return resetBrush;
    resetBrush = x;
    return timeline;
  }

  timeline.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? timeline : value;
  }

  return timeline;

}

})();
