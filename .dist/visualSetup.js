
  var margin = { top: 50, left: 50, right: 50, bottom: 50},
  height = 1080 - margin.top - margin.bottom,
  width = 1920 - margin.left - margin.right;

  d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/399e11800f8c96a1c7e2edceca9cf69bc918c596/public/data/jhu/full_data.csv")
  .then(function(data) {
    console.log(data);
  })
  .catch(function(error) {
    console.log(error);
  });//   .then(data => {
  //     const countries = topojson.features()
  // });

  var svg = d3.select("#map")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.right + margin.left)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  /*
    Reads in wolrd.topojson
    Readsd in the locations.csv
  */
  d3.queue()
  .defer(d3.json, "world.toposjon")
  .await(ready);

  /*
    Creates a new projection using d3.geoOrthographic()
    and centres it (translates it)
    and zooms in a certain amount using scale
  */

  var projection = d3.geoMercator()
  //d3.geoOrthographic()
    .translate([width /2 , height / 2])
    .scale(100);

  /*
    Creating colour scale for colours of countries
  */
  const colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

    
  /*
    creates a geoPath
    using projection
  */
  var path = d3.geoPath()
  .projection(projection);

  function ready (error, data){
    console.log(data);
    /*
      topojson.feature converts the raw geo data into useable geo data
      always passes its data, then data.objects.(name of object)
      then get .features out of it 
    */

    var countries = topojson.feature(data, data.object.countries).features;
    //debugging
    console.log(countries);

    
    /*
      adds a path for each country
    */

    svg.selectAll(".country")
    .data(countries)
    .enter().append("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("fill", function (d) {
      d.total = data.get(d.id) || 0;
      return colorScale(d.total);
    })
    .attr("stroke", "#333333")
    .attr("stroke-width", "o.5");

    /*
      adds the cities
      Get the x and y from the latitude and longitude + projection
    */

  };