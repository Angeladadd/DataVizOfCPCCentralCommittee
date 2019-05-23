function DrawAge() {
    var obj = {};
    var margin = {top: 5, right: 5, bottom: 65, left: 45},
            width = 570 - margin.left - margin.right,
            height = 270 - margin.top - margin.bottom;
    var svg = d3.select("#age_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var x = d3.scaleBand()
            .domain(d3.range(1945,1975,1))
            .range([0, width-10]);

    var x_axis = d3.scaleBand()
        .domain(d3.range(1945,1975,5))
        .range([0,width-10]);

    svg.append("g")
        .attr("class","xaxis")
        .attr("transform", "translate("+margin.left+"," + height + ")")
        .call(d3.axisBottom(x_axis).ticks(5));

    var y = d3.scaleBand()
            .range([height, 0])
            .domain(d3.range(0,34));
    svg.append("g")
        .attr("class","yaxis")
        .attr("transform", "translate("+margin.left + ",0)")
        .call(d3.axisLeft(y));

    svg.append("rect")
        .attr("class","male_rect")
        .attr("x",margin.left)
        .attr("y",height+40)
        .attr("width",width/2)
        .style("opacity",0.6)
        .attr("fill","#859CAB")
        .attr("height",20);
    svg.append("rect")
        .attr("class","female_rect")
        .attr("fill","#F7CDCD")
        .attr("x",margin.left+width/2)
        .attr("y",height+40)
        .attr("width",width/2)
        .style("opacity",0.6)
        .attr("width",width/2)
        .attr("height",20);

    var age = new Array(26);
    var age_male = new Array(26);
    var age_female = new Array(26);
    for(var i=0;i<26;i++){
        age[i] = 0;
        age_male[i] = 0;
        age_female[i] = 0;
    }

    svg.append("path")
        .datum(age)
        .attr("fill", "lightgrey")
        .attr("class","total_age")
        .attr("opacity", "0.2")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("transform", "translate("+margin.left + ",0)")
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d, i) { return x(i+1945)+margin.left; })
            .y(function(d, i) { return y(d); })
        );
    svg.append("path")
        .datum(age_male)
        .attr("fill", "#859CAB")
        .attr("class","male_age")
        .attr("opacity", "1")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("transform", "translate("+margin.left + ",0)")
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d, i) { return x(i+1945)+margin.left; })
            .y(function(d, i) { return y(d); })
        );
    svg.append("path")
        .datum(age_female)
        .attr("fill", "#F7CDCD")
        .attr("class","female_age")
        .attr("opacity", "1")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("transform", "translate("+margin.left + ",0)")
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d, i) { return x(i+1945)+margin.left; })
            .y(function(d, i) { return y(d); })
        );
    obj.svg = svg;
    obj.x = x;
    obj.y = y;
    obj.height = height;
    obj.width = width;
    obj.update=function (){
        //if(people_list.length==0) return;
        var obj_svg = this.svg;
        var new_age = new Array(26);
        var new_male_age = new Array(26);
        var new_female_age = new Array(26);
        var obj_x=this.x;
        var obj_y=this.y;
        var male = 0;
        var female = 0;
        for(var i=0;i<26;i++) {
            new_age[i] = 0;
            new_male_age[i] = 0;
            new_female_age[i] = 0;
        }
        for(var i=0;i<current_people.length;i++){
            if(current_people[i].age != ""){
                new_age[parseInt(current_people[i].year)-1945] ++;
                if(current_people[i].gender == "女"){
                    new_female_age[parseInt(current_people[i].year)-1945] ++;
                    female++;
                }
                else{
                    new_male_age[parseInt(current_people[i].year)-1945] ++;
                    male++;
                }
            }
        }
        var max_y = 0;
        for(var i=0;i<26;i++){
            if(max_y<new_age[i])
                max_y=new_age[i];
        }
        /*var range = new Array(Math.max(max_y,5));
        var domain = new Array(Math.max(max_y,5));
        for(var i=0;i<Math.max(max_y,5);i++){
            range[i] = height - i/Math.max(max_y,5)*height;
            domain[i] = i;
        }*/
        var height = this.height;
        obj_y=d3.scalePoint().domain(d3.range(0,max_y+1,1)).range([height,10]);
        //obj_svg.select("path").remove();
        obj_svg.select(".yaxis").attr("transform", "translate("+margin.left + ",0)").call(d3.axisLeft(obj_y));
        //obj_svg.select(".xaxis").call(d3.axisBottom(obj_x));

        obj_svg.select(".total_age")
        .datum(new_age)
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d, i) {return obj_x(i+1945); })
            .y(function(d, i) {return obj_y(d); })
        );
        obj_svg.select(".male_age")
        .datum(new_male_age)
        .attr("fill", "#859CAB")
        .attr("opacity", ".4")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
            .attr("transform", "translate("+margin.left + ",0)")
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d, i) { return obj_x(i+1945); })
            .y(function(d, i) { return obj_y(d); })
        );
        obj_svg.select(".female_age")
        .datum(new_female_age)
        .attr("fill", "#F7CDCD")
        .attr("opacity", ".6")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
            .attr("transform", "translate("+margin.left + ",0)")
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d, i) { return obj_x(i+1945); })
            .y(function(d, i) { return obj_y(d); })
        );
        if(male!=0)
            obj_svg.select(".male_rect")
            .attr("width",width*male/(male+female));
        else
            obj_svg.select(".male_rect")
            .attr("width",0);
        if(female!=0)
            obj_svg.select(".female_rect")
            .attr("width",width*female/(male+female))
            .attr("x",width*male/(male+female)+margin.left);
        else
            obj_svg.select(".female_rect")
            .attr("width",0);

    };
    return obj;
}