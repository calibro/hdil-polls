(function(){

  var hdil = window.hdil || (window.hdil = {});

  hdil.violin = function(){

  var height = 600,
      width = 600,
      dispatch = d3.dispatch("brushEnd"),
      duration = 1000;


  function violin(selection){
    selection.each(function(data){
      var chart;
      var margin = {top: 10, right: 10, bottom: 20, left: 20},
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

      var xViolinScale = d3.scaleBand()
        .range([0,chartWidth])
        .domain(data.map(function(d){return d.key}))
        .round(true);

      var groupWidth = xViolinScale.bandwidth();

      var gViolins = chart.selectAll('g.g-violins')
        .data(data, function(d){return d.key})

      gViolins.enter().append("g")
        .attr('class','g-violins')
        .attr("transform", function(d){
          return "translate(" + xViolinScale(d.key) +",0)"
        })

      gViolins.attr("transform", function(d){
        return "translate(" + xViolinScale(d.key) +",0)"
      })

      var y = d3.scaleLinear()
                .range([groupWidth/2,0])

      var x = d3.scaleLinear()
              .range([chartHeight,0]);

      var area = d3.area()
          .x(function(d) {

            if(d.key === ''){
              return x(0)
            }else{
              return x(parseInt(d.key))
            }

          })
          .y1(function(d) { return y(d.value); })
          .curve(d3.curveBasis)

      area.y0(y(0));

      var xDomain = d3.extent(data[0].values,function(d){
        if(d.key === ''){
          return 0
        }else{
          return parseInt(d.key)
        }
      })

      var yMax = d3.max(data,function(d){
        return d.maxY
      })


      y.domain([0,yMax])
      x.domain(xDomain)

      var pathRg = chart.selectAll('.pathR')

      if(pathRg.empty()){
        pathRg = chart.selectAll('.g-violins')
          .append('g')
          .attr('class','pathR')
          .attr('transform','translate(' + (groupWidth) + ',0)')
      }


      var pathR = pathRg.selectAll('path')
        .data(function(d){
          return [d]
        })

      pathR.enter().append("path")
        .attr("fill", "#00C5CA")
        .attr("d", function(d){
          return area(d.values)
        })
        .attr("transform", "rotate(90,0,0)")

      pathR.transition()
        .attr("d", function(d){
          return area(d.values)
        })

      var pathLg = chart.selectAll('.pathL')

      if(pathLg.empty()){
        pathLg = chart.selectAll('.g-violins')
          .append('g')
          .attr('class','pathL')
      }

      var pathL =  pathLg.selectAll('path')
                .data(function(d){
                  return [d]
                })

      pathL.enter().append("path")
        .attr("fill", "#00C5CA")
        .attr("d", function(d){
          return area(d.values)
        })
        .attr("transform", "rotate(90,0,0) scale(1,-1)")

      pathL.transition()
        .attr("d", function(d){
          return area(d.values)
        })

      /* axis */

      var xAxis = chart.select('.xAxis');

      if(xAxis.empty()){
        chart.append("g")
            .attr('class', 'xAxis')
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(
              d3.axisBottom(xViolinScale).tickSize(0).tickPadding(10)
            );
      }else{
        xAxis.call(d3.axisBottom(xViolinScale).tickSize(0).tickPadding(10))
      }

      var yAxis = chart.select('.yAxis');

      if(yAxis.empty()){
        chart.append("g")
            .attr('class', 'yAxis')
            .attr("transform", "translate(0,0)")
            .call(
              d3.axisLeft(x).tickSize(-chartWidth).ticks(7).tickSizeOuter(0).tickPadding(10)
            );
      }else{
        yAxis.call(d3.axisLeft(x).tickSize(-chartWidth).ticks(7).tickSizeOuter(0).tickPadding(10))
      }

      /* boxplot*/
      var probs = [0.25,0.5,0.75];
      var boxPlotData = [];
      var boxplotWidth = 10;

      data.forEach(function(d){
        var values = []
        var answers = [];
        d.values.forEach(function(a){
          if(a.key === ''){
            d3.range(a.value).forEach(function(){
              answers.push(0)
            })
          }else{
            d3.range(a.value).forEach(function(){
              answers.push(parseInt(a.key))
            })
          }
        })
        probs.forEach(function(p){
          values.push(d3.quantile(answers, p))
        })

        boxPlotData.push({key:d.key, values: values, mean: d3.mean(answers)})
      })

      var gBoxplot = chart.selectAll('g.g-boxplot')
        .data(boxPlotData, function(d){return d.key})

      gBoxplot.enter().append("g")
        .attr('class','g-boxplot')
        .attr("transform", function(d){
          return "translate(" + xViolinScale(d.key) +",0)"
        })
        .each(function(d){
            var html = "Q3: "+ d.values[2]+ "<br/>"
              + "mean: "+ d3.format('.2f')(d.mean)+ "<br/>"
              + "median: "+ d.values[1]+ "<br/>"
              + "Q1: "+ d.values[0]+ "<br/>";

            $(this).tooltip({
                'html': true,
                'container': 'body',
                'title': html,
                'placement': 'right'
            });
          })

      gBoxplot.attr("transform", function(d){
        return "translate(" + xViolinScale(d.key) +",0)"
      })
      .each(function(d){
          var html = "Q3: "+ d.values[2]+ "<br/>"
            + "mean: "+ d3.format('.2f')(d.mean)+ "<br/>"
            + "median: "+ d.values[1]+ "<br/>"
            + "Q1: "+ d.values[0]+ "<br/>";

          $(this)
           .attr('data-original-title', html)
           .tooltip('fixTitle')
        })

      var boxplot =  chart.selectAll('g.g-boxplot').selectAll('rect')
                .data(function(d){
                  return [[d.values[0],d.values[1]],[d.values[1],d.values[2]]]
                })

      boxplot.enter().append("rect")
        .attr("fill", "#ccc")
        .attr("stroke","#555")
        .attr("width", boxplotWidth)
        .attr("height", function(d){
          return Math.abs(x(d3.max(d)) - x(d3.min(d)))
        })
        .attr("y", function(d){
          return x(d3.max(d))
        })
        .attr("x", (groupWidth/2 - boxplotWidth/2))

      boxplot.transition()
        .attr("height", function(d){
          return Math.abs(x(d3.max(d)) - x(d3.min(d)))
        })
        .attr("y", function(d){
          return x(d3.max(d))
        })
        .attr("x", (groupWidth/2 - boxplotWidth/2))

      var boxplotMean =  chart.selectAll('g.g-boxplot').selectAll('circle')
                .data(function(d){
                  return [d.mean]
                })

      boxplotMean.enter().append("circle")
        .attr("fill", "white")
        .attr("stroke","#555")
        .attr("r", boxplotWidth/4)
        .attr("cy", function(d){
          return x(d)
        })
        .attr("cx", (groupWidth/2))

      boxplotMean.transition()
        .attr("cy", function(d){
          return x(d)
        })

    }); //end selection
  } // end violin

  violin.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return violin;
  }

  violin.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return violin;
  }

  violin.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return violin;
  }

  violin.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? violin : value;
  }

  return violin;

}

})();
