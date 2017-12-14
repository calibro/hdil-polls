(function(){

  var hdil = window.hdil || (window.hdil = {});

  hdil.matrix = function(){

  var height = 600,
      width = 600,
      dispatch = d3.dispatch("brushEnd"),
      duration = 1000,
      scale;


  function matrix(selection){
    selection.each(function(data){
      var chart;
      var margin = {top: 10, right: 10, bottom: 20, left: 15},
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


      if(!data.length){
        return
      }

      var xScale = d3.scalePoint()
        .range([0,chartWidth])
        .domain(scale)
        .padding(1)
        .round(true);

      var yScale = d3.scalePoint()
        .range([chartHeight,0])
        .domain(scale)
        .padding(1)
        .round(true);

      var maxR = xScale.step()>yScale.step()?(yScale.step()/2):(xScale.step()/2);

      var rScale = d3.scaleSqrt()
        .domain([1,d3.max(data,function(d){return d.value})])
        .range([1,maxR])

      var circlesG = chart.select('g.circles')

      if(circlesG.empty()){
        circlesG = chart.append('g').attr('class','circles')
      }

      var circles = circlesG.selectAll('circle')
        .data(data, function(d){return d.x + '_' + d.y})

      circles.exit()
          .transition()
          .attr('r',0)
          .remove()

      circles.enter().append("circle")
        .attr('cx',function(d){
          return xScale(d.x)
        })
        .attr('cy',function(d){
          return yScale(d.y)
        })
        .attr("fill", "#00C5CA")
        .attr('r',0)
        .transition()
        .attr('r',function(d){
          return rScale(d.value)
        })

      circles
        .transition()
        .attr('r',function(d){
          return rScale(d.value)
        })

      /* axis */

      var xAxis = chart.select('.xAxis');

      if(xAxis.empty()){
        chart.append("g")
            .attr('class', 'xAxis')
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(
              d3.axisBottom(xScale).tickSize(-chartHeight).tickPadding(10)
            );
      }else{
        xAxis.call(d3.axisBottom(xScale).tickSize(-chartHeight).tickPadding(10))
      }

      var yAxis = chart.select('.yAxis');

      if(yAxis.empty()){
        chart.append("g")
            .attr('class', 'yAxis')
            .attr("transform", "translate(0,0)")
            .call(
              d3.axisLeft(yScale).tickSize(-chartWidth).tickSizeOuter(0).tickPadding(10)
            );
      }else{
        yAxis.call(d3.axisLeft(yScale).tickSize(-chartWidth).tickSizeOuter(0).tickPadding(10))
      }


    }); //end selection
  } // end matrix

  matrix.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return matrix;
  }

  matrix.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return matrix;
  }

  matrix.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return matrix;
  }

  matrix.scale = function(x){
    if (!arguments.length) return scale;
    scale = x;
    return matrix;
  }

  matrix.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? matrix : value;
  }

  return matrix;

}

})();
