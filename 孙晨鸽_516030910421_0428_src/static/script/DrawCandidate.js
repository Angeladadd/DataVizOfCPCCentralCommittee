function Drawcandidate(){
    var obj = {};
    obj.flag = false;
    obj.update = function () {
        var candidate_div = document.getElementById("candidate");
        while(candidate_div.childNodes.length>0){
            var child = candidate_div.firstChild;
            candidate_div.removeChild(child);
        }
        for(var i=0;i<current_people.length;i++){
            var button = document.createElement("button");
            button.value = current_people[i].name;
            button.innerHTML = current_people[i].name;
            button.onclick = function () {
                DrawPerson(this.value);
            };
            candidate_div.appendChild(button);
            candidate_div.appendChild(document.createTextNode(" "));
        }
    };
    return obj;
}
function DrawPerson(person_name){
    $.ajax({
                type: "GET",
                url: "/people/"+person_name,
                dataType: "json",
                success: function (result) {
                    $("table#person tr").remove();
                    $("#person_name").html(person_name);
                    $("table#person").append("<tr><th>时间</th><th>职位</th></tr>");
                    $.each(result, function (i, item) {
                        $("table#person").append("<tr><td>"+item.time+"</td><td>"+item.position+"</td></tr>");
                    });
                }
            });
}