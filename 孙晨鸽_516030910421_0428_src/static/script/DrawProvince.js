function DrawProvince() {
    var obj = {};
    var margin = {top: 5, right: 5, bottom: 5, left: 5},
            width = 570 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
    var svg = d3.select("#province_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    svg.selectAll(".state")
        .data(china)
        .enter().append("path")
        .attr("class","state")
        .attr("d",function(d){ return d.d;})
        .style("stroke","black")
        .style("fill","lightgrey");
    obj.svg = svg;
    obj.flag=false;
    obj.new_people_list=null;
    obj.update=function (){
        //if(people_list.length==0) return;
        var flag=this.flag;
        var local_current_people = current_people;
        if(current_people_attr.province != null){
            var tmp = current_people_attr.province;
            current_people_attr.province = null;
            local_current_people = calculate_people();
            current_people_attr.province = tmp;
        }
        var local_people = Array(34);
        for(var i=0;i<34;i++) local_people[i] = 0;
        for(var i=0;i<local_current_people.length;i++){
            for(var j=0;j<34;j++){
                if(local_current_people[i].province == province[j]){
                    local_people[j] ++;
                }
            }
        }
        var min_people = local_people[0];
        var max_people = local_people[0];
        for(var i=1;i<34;i++){
            if(min_people>local_people[i])
                min_people = local_people[i];
            if(max_people<local_people[i])
                max_people = local_people[i];
        }

        var color1=d3.rgb(255,255,255);
        var color2=d3.rgb(55,75,83);
        var compute=d3.interpolate(color1,color2);
        var linear=d3.scaleLinear()
            .domain([min_people,max_people])
            .range([0,1]);

        var obj_svg = this.svg;

        obj_svg.selectAll(".state")
            .transition()
            .duration(100)
            .style("fill", function (d, i) {
                for(var j=0;j<34;j++){
                    if(province[j] == d.n){
                        return compute(linear(local_people[j]));
                    }
                    if(d.n == current_people_attr.province)
                    {
                        flag =true;
                        return "lightgrey";
                    }
                }
            });
        obj_svg.selectAll(".state")
            .on("mouseover",function (d,i) {
                if(flag==true)  return;
                d3.select(this).style("fill","lightgrey");
                current_people_attr.province = d.n;
                current_people = calculate_people();
                if(current_people_attr.region == null) obj_region.update();
                if(current_people_attr.age == null) obj_age.update();
                if(current_people_attr.background == null) obj_bg.update();
                if(current_people_attr.school == null) obj_school.update();
            })
            .on("mouseout",function(d,i){
                if(flag==true) return;
                d3.select(this).style("fill",function (d,i) {
                    for(var j=0;j<34;j++){
                        if(province[j] == d.n){
                            return compute(linear(local_people[j]));
                        }
                    }
                });
                current_people_attr.province = null;
                current_people = calculate_people();
                    if(current_people_attr.region == null) obj_region.update();
                    if(current_people_attr.age == null) obj_age.update();
                    if(current_people_attr.background == null) obj_bg.update();
                    if(current_people_attr.school == null) obj_school.update();
            })
            .on("click",function (d,i) {
                if(flag == false) {
                    flag = true;
                    obj_people.update();
                }
                else {
                    flag=false;
                    current_people_attr.province = null;
                    current_people=calculate_people();
                    obj_region.update();
                    obj_age.update();
                    obj_bg.update();
                    obj_school.update();
                    obj_people.update();
                    obj_svg.selectAll(".state")
                        .style("fill", function (d, i) {
                for(var j=0;j<34;j++){
                    if(province[j] == d.n){
                        return compute(linear(local_people[j]));
                    }
                }
            });
                }
            });
    };
    return obj;
}