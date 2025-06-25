const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const padding = 60;

const tooltip = d3.select("#tooltip");

d3.json(url).then((data) => {
  const parseTime = d3.timeParse("%M:%S");

  data.forEach((d) => {
    d.Place = +d.Place;
    d.Time = parseTime(d.Time);
    d.Year = new Date(d.Year, 0);
  });

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Year))
    .range([padding, width - padding]);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Time))
    .range([padding, height - padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Time))
    .attr("r", 6)
    .attr("data-xvalue", (d) => d.Year.toISOString())
    .attr("data-yvalue", (d) => d.Time.toISOString())
    .style("fill", (d) => (d.Doping ? "red" : "green"))
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 0.9)
        .html(
          `${d.Name} (${d.Nationality})<br>Year: ${d.Year.getFullYear()}<br>Time: ${d3.timeFormat("%M:%S")(d.Time)}<br>${d.Doping}`
        )
        .attr("data-year", d.Year.toISOString())
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 40 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
});
