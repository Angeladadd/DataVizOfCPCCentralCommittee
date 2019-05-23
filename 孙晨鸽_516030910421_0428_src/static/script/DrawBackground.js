function DrawBackground(){
    var obj = {};
    obj.flag = false;
    obj.update = function () {
        var local_current_people = current_people;
        if(current_people_attr.background!=null){
            var tmp = current_people_attr.background;
            current_people_attr.background = null;
            local_current_people = calculate_people();
            current_people_attr.background = tmp;
        }
        var old_svg=d3.select("#background_svg").select("g");
        old_svg.remove();
    var words = new Array(0);
    var freqs = new Array(0);
    for(var i=0;i<local_current_people.length;i++){
        var word_list = local_current_people[i].background_list;
       for(var j=0;j<word_list.length;j++){
           var word = word_list[j];
           var index=words.indexOf(word);
           if(index>=0){
               freqs[index] ++;
           }
           else{
               words.push(word);
               freqs.push(0);
           }
       }
    }
    var myWords = new Array(0);
    var linear = d3.scaleLinear()
        .domain([Math.min.apply(Math,freqs),Math.max.apply(Math,freqs)])
        .range([10,40]);

    for(var i=0;i<words.length;i++){
        myWords[i]={};
        myWords[i].text = words[i];
        myWords[i].size = linear(freqs[i]);
    }
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 400- margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

    var svg = d3.select("#background_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if(current_people.length==0) return;
    var layout = d3.layout.cloud()
    .size([width, height])
    .words(myWords.map(function (d) {
        return d;
    }))
    .padding(5)        //space between words
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return d.size; })      // font size of words
    .on("end", draw);
    layout.start();
    var flag = this.flag;


    function draw(words) {
  svg
    .append("g")
      .attr("class","words")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size; })
        .style("fill", "#212121")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) {
            if(d.text == current_people_attr.background){
                d3.select(this).style("fill","lightgrey");
                flag = true;
            }
            return d.text; })
      .on("mouseover",function (d,i) {
          if(flag == true) return;
          d3.select(this).style("fill","lightgrey");
          current_people_attr.background = d.text;
          current_people = calculate_people();
          if(current_people_attr.region == null) obj_region.update();
          if(current_people_attr.province == null) obj_province.update();
          if(current_people_attr.age == null) obj_age.update();
          if(current_people_attr.school == null) obj_school.update();
      })
      .on("mouseout",function(d, i){
          if(flag == true) return;
          d3.select(this).style("fill","#212121");
          current_people_attr.background = null;
          current_people = calculate_people();
          if(current_people_attr.region == null) obj_region.update();
          if(current_people_attr.province == null) obj_province.update();
          if(current_people_attr.age == null) obj_age.update();
          if(current_people_attr.school == null) obj_school.update();
      })
      .on("click",function (d,i) {
          if(flag == true){
              flag = false;
              current_people_attr.background = null;
              current_people = calculate_people();
          svg.select(".words").selectAll("text").style("fill","#212121");
          obj_region.update();
          obj_province.update();
          obj_age.update();
          obj_school.update();
          obj_people.update();
          }
          else{
              flag = true;
              obj_people.update();
          }
      });
}
    };
    return obj;

}