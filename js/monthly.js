// fetch month
var url = new URL(document.URL);
let monName = url.searchParams.get("mon");

// "options" panel
var opt_template = document.getElementById('opt_btns').content;
// get month index
let mon_ind = url.searchParams.get("m");
// if no input -> 404.html
if (mon_ind == null) window.location.href = "/404.html";
// get data lists
let d_list = JSON.parse(localStorage.dataList);
let mon_index_list = JSON.parse(sessionStorage.index_list);
// sort lambda functions
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = d_list[a][key];
        var y = d_list[b][key];
        if (x == null || x == "")
            return 1;
        if (y == null || y == "")
            return -1;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
// populate data (in default sorted by "Day")
var orderedList = sortByKey(mon_index_list[mon_ind],'Day');
// write title
if (monName != null && monName.length > 0)
    document.getElementById("title").innerHTML = monName +
    ' (' + orderedList.length + ')';
// write body
var tbody = document.getElementById('tbody');
for (let i = 0; i < orderedList.length; i++){
    let trTag = document.createElement('tr');
    // TODO:: maybe assign value to it?
    let d_ind = orderedList[i];
    let td = document.createElement('td');
    td.appendChild(document.createTextNode(d_list[d_ind]['Name']));
    trTag.appendChild(td);
    td = document.createElement('td');
    let day = d_list[d_ind]['Day'];
    if (day == null)
        day = ""
    td.appendChild(document.createTextNode(day));
    trTag.appendChild(td);
    let opts = opt_template.cloneNode(true);
    trTag.appendChild(opts);

    tbody.appendChild(trTag);
}


// prompt to edit
var edit = document.querySelectorAll('tr');
var temp_name = '';
edit.forEach(function(element){
    element.addEventListener('click',function(){
        let d = element.getElementsByTagName('td');
        // todo: get item id here
        // if (d.length == 0) return;
        // let note = d[0].innerHTML;
        // let date = d[1].innerHTML;
        // let prio = d[2].innerHTML;
        window.location.href = '/item.html?id='+id;
    });
    element.addEventListener('mouseover',function(){
        let d = element.getElementsByTagName('td');
        if (d.length == 0) return;
        temp_name = d[0].innerHTML;
        d[0].innerHTML = "(Click to Edit)";
        d[0].style.fontWeight = 'Bold';
    });
    element.addEventListener('mouseout',function(){
        let d = element.getElementsByTagName('td');
        if (d.length == 0) return;
        d[0].innerHTML = temp_name;
        d[0].style.fontWeight = 'lighter';
    });
});
