
function calculate_people() {
    var rtn_prople_list = people;
    if(current_people_attr.province!=null){
        rtn_prople_list = people_list_province(rtn_prople_list, current_people_attr.province);
    }
    if(current_people_attr.age!=null){
        rtn_prople_list = people_list_age(rtn_prople_list, current_people_attr.age);
    }
    if(current_people_attr.region!=null){
        rtn_prople_list = people_list_region(rtn_prople_list,current_people_attr.region);
    }
    if(current_people_attr.background!=null){
        rtn_prople_list = people_list_background(rtn_prople_list,current_people_attr.background);
    }
    if(current_people_attr.school!=null){
        rtn_prople_list = people_list_school(rtn_prople_list,current_people_attr.school);
    }
    return rtn_prople_list;
}
    function people_list_province(people_list, province){
        var new_people_list = new Array(0);
        var cnt = 0;
        for(var i=0;i<people_list.length;i++){
            if(people_list[i].province == province){
                new_people_list.push(people_list[i]);
                cnt++;
            }
        }
        return new_people_list;
    }
    function people_list_school(people_list, school){
        var new_people_list = new Array(0);
        var cnt = 0;
        for(var i=0;i<people_list.length;i++){
            if(people_list[i].school1 == school){
                new_people_list.push(people_list[i]);
                cnt++;
            }
            else if(people_list[i].school2 == school){
                new_people_list.push(people_list[i]);
                cnt++;
            }
        }
        return new_people_list;
    }
    function people_list_age(people_list, year){
        var new_people_list = new Array(0);
        var cnt = 0;
        for(var i=0;i<people_list.length;i++){
            if(people_list[i].year == year){
                new_people_list.push(people_list[i]);
                cnt++;
            }
        }
        return new_people_list;
    }
    function people_list_region(people_list, region) {
        var new_people_list = new Array(0);
        var cnt = 0;
        for(var i=0;i<people_list.length;i++){
            if(people_list[i].region == region){
                new_people_list.push(people_list[i]);
                cnt++;
            }
        }
        return new_people_list;
    }
    function people_list_background(people_list,background){
        var new_people_list = new Array(0);
        var cnt = 0;
        for(var i=0;i<people_list.length;i++){
            if(people_list[i].background_list.indexOf(background)>=0){
                new_people_list.push(people_list[i]);
                cnt++;
            }
        }
        return new_people_list;
    }