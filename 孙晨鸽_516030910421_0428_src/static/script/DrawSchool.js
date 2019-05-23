function DrawSchool() {
    var obj = {};
    obj.flag = false;
    obj.update = function () {
        var flag = this.flag;
        var local_current_people = current_people;
        if(current_people_attr.school!=null){
            flag = true;
            var tmp = current_people_attr.school;
            current_people_attr.school = null;
            local_current_people = calculate_people();
            current_people_attr.school = tmp;
        }
        var old_svg = d3.select("#school").select("g");
        if(old_svg) old_svg.remove();
    var schools = new Array(0);
    var number = new Array(0);
    for (var i = 0; i < local_current_people.length; i++) {
        var school = local_current_people[i].school1;
        if (school == "")
            continue;
        var index = schools.indexOf(school);
        if (index >= 0) {
            number[index]++;
        }
        else {
            schools.push(school);
            number.push(1);
        }
        school = local_current_people[i].school2;
        if (school == "")
            continue;
        index = schools.indexOf(school);
        if (index >= 0) {
            number[index]++;
        }
        else {
            if(school == null) school = "未知学校";
            schools.push(school);
            number.push(1);
        }
    }
// create dummy data -> just one element per circle
    var data = new Array(0);
    var cnt = 0;
    for (var i = 0; i < schools.length; i++) {
                data[cnt] = {};
                data[cnt].school = schools[i];
                data[cnt].number = number[i];
            if (schoolTHUPKU.indexOf(schools[i]) >= 0) {
                data[cnt].color = "清华北大中科院";
            }
            else if (school985.indexOf(schools[i]) >= 0) {
                data[cnt].color = "985";
            }
            else if (schools[i] == "国防大学") {
                data[cnt].color = "国防大学";
            }
            else if (schools[i] == "中央党校") {
                data[cnt].color = "中央党校";
            }
            else if(schoolOverboard.indexOf(schools[i])>=0){
                data[cnt].color = "海外名校";
            }
            else {
                data[cnt].color = "其他学校";
            }
            cnt++;
        }
        var linear = d3.scaleLinear()
            .domain([Math.min.apply(Math, number), Math.max.apply(Math, number)])
            .range([10, 35]);
        var width = 350;
        var height = 300;

// append the svg object to the body of the page
        var svg = d3.select("#school")
            .attr("width", 350)
            .attr("height", 350)
            .append("g");
        if(current_people.length==0) return;
// Initialize the circle: all located at the center of the svg area

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            if(flag == true) return;
            Tooltip
                .style("opacity", 1)
                .text(d.school)
                .attr("x", (d3.mouse(this)[0] + 20) + "px")
                .attr("y", (d3.mouse(this)[1]) + "px");
            current_people_attr.school = d.school;
            current_people = calculate_people();
         if(current_people_attr.age == null) obj_age.update();
         if(current_people_attr.region == null) obj_region.update();
         if(current_people_attr.province == null) obj_province.update();
         if(current_people_attr.background == null) obj_bg.update();
        };

        var mouseout = function (d) {
            if(flag == true) return;
            Tooltip
                .style("opacity", 0);
            current_people_attr.school = null;
            current_people=calculate_people();
            if(current_people_attr.age == null) obj_age.update();
         if(current_people_attr.region == null) obj_region.update();
         if(current_people_attr.province == null) obj_province.update();
         if(current_people_attr.background == null) obj_bg.update();
        };
        var color = d3.scaleOrdinal()
            .domain(["中央党校", "清华北大中科院", "国防大学", "985", "海外名校","其他学校"])
            .range(["#DCDCDD",
                "#FFC0B4",
                "#6F96A6",
                "#FDD8D3",
                "#212121",
                "#B6B5B8"]);
        d3.select("#idx_school")
            .attr("width",500)
            .attr("height",40)
            .selectAll("rect")
            .data(["中央党校", "国防大学", "985", "海外名校","其他学校","清华北大中科院"])
            .enter()
            .append("rect")
            .attr("y",10)
            .attr("x",function (d,i) {
                return i*70;
            })
            .attr("width",10)
            .attr("height",10)
            .attr("fill",function(d){
               return color(d);
            });
         d3.select("#idx_school")
            .selectAll("text")
            .data(["中央党校", "国防大学", "985", "海外名校","其他学校","清华北大中科院"])
            .enter()
            .append("text")
            .attr("y",20)
             .attr("x",function (d,i) {
                 return i*70+15;
             })
            .attr("width",10)
            .attr("height",10)
             .text(function (d) {
                 return d;
             })
             .style("font-size",12);
        var node = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", function (d) {
                return linear(d.number);
            })
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", function (d) {
                return color(d.color);
            })
            .style("fill-opacity", 0.6)
            .on("mouseover", mouseover) // What to do when hovered
            .on("mouseleave", mouseout)
            .on("click", function (d) {
                if(flag == true){
                    flag = false;
                    current_people_attr.school = null;
                    current_people = calculate_people();
                    obj_age.update();
                    obj_region.update();
                    obj_province.update();
                    obj_bg.update();
                    obj_people.update();
                    Tooltip.style("opacity",0);
                }
                else{
                    flag = true;
                    obj_people.update();
                }
            })
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        var Tooltip = svg.append("text")
            .style("opacity", 0)
            .style("font-size",14)
            .attr("class", "tooltip");
        if(flag == true){
            Tooltip
                .style("opacity", 1)
                .text(current_people_attr.school)
                .attr("x", (width/2 + 20) + "px")
                .attr("y", (height/2) + "px");
        }
        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function (d) {
                return (linear(d.number) + 3)
            }).iterations(1)); // Force that avoids circle overlapping

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(data)
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
            });

        // What happens when a circle is dragged?
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
        }
    };
    return obj;

}