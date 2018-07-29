// TODO:: update cur_mon everytime log in

// import some sample data (if there's localStorage)
var cur_mon = 7;
if (localStorage.length == 0){
    let dat = ['{"Name":"Learn how to play Tennis", "Mon":"1,3,5,7,8","Day":31, "Note":"I gladly wrote notes here","More":true,"End":"2018-07-31","Prio":false,"Archive":false,"Begin":"2018-07-04","Done":false}','{"Name":"Read 3 books this month","Day":30,"Note":"some other notes", "More":true,"End":"2018-08-04","Prio":3, "Archive":false,"0":false,"Begin":"2018-07-04","Predone":false}',' {"Name":"Pretend to be like a student", "Mon":"1,5,6","Note":"I gladly  here", "More":false,"Archive":false,"Begin":"2018-07-04", "End":"2018-10-04","Done":true}','{"Name":"Something else", "Mon":"5","Note":"I notes here", "More":true,"End":"2018-07-31", "Prio":2,"Archive":false,"Begin":"2018-07-04", "Done":true,"Predone":false}','{"Name":"Sleep enough everyday", "Mon":"5,8","Day":13,"Note":"I am here","More": true, "End":"2018-07-05",  "Prio":true,"Archive":true, "Color":"r", "Begin":"2018-07-04", "Done":false,"Predone":true}',' {"Name":"Learn AI programming ", "Mon":"5,9,11", "Day":3,"Note":"I gladly","More":false,"End":"2018-07-04", "Prio":false, "Archive":true,"Color":"g","Begin":"2018-07-04","Begin":"2019-07-04", "Done":false, "Predone":true}'];
    var list = [];
    for (var i = 0; i<dat.length;i++){
        list.push(JSON.parse(dat[i]));
    }
    localStorage.dataList = JSON.stringify(list);
}

function addToNoDates(i){
    // No dates
    if (index_list[13] == null)
        index_list[13] = [i];
    else {
        index_list[13].push(i);
    }
}
// populate data into a list
// 0~11: each month, 12: archived, 13: no dates,
// 14: undone in current month, 15:undone in last month
var d_list = JSON.parse(localStorage.dataList);
var index_list = [];
for (var i = 0; i < d_list.length; i++){
    if (d_list[i]['Archive'] == true){
        // Archived
        if (index_list[12] == null)
            index_list[12] = [i];
        else {
            index_list[12].push(i);
        }
    }
    else{
        if (d_list[i]['Mon'] == null){
            addToNoDates(i);
        }
        else{
            let ms = d_list[i]['Mon'].split(',');
            if (ms[0] == "")
                addToNoDates(i);
                else{
                    // assign its months to the list
                    for (let ii in ms){
                        if (index_list[parseInt(ms[ii]) - 1] == null)
                        index_list[parseInt(ms[ii]) - 1] = [i];
                        else {
                            index_list[parseInt(ms[ii]) - 1].push(i);
                        }
                    }
                }
            }
        // assign its progress of completion
        if (d_list[i]['Done'] == null || d_list[i]['Done'] == false){
            if (index_list[14] == null)
                index_list[14] = [i];
            else
                index_list[14].push(i);
        }
        if (d_list[i]['Predone'] == null || d_list[i]['Predone'] == false){
            if (index_list[15] == null)
                index_list[15] = [i];
            else
                index_list[15].push(i);
        }
    }
}

// reset "Done" attribute if a new month has come
var now = new Date();
if (now.getMonth() + 1 > cur_mon){
    for(var i = 0; i < index_list[15].length; i++){
        d_list[index_list[15][i]]["Predone"] = d_list[index_list[15][i]]["Done"];
        d_list[index_list[15][i]]["Done"] = false;
    }
    index_list[15] = index_list[14];
    index_list[14] = [];
}

// populate data in scroll_view
var scroll_view = document.getElementById("scroll_view");
let monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"];
for (var i = 0; i < 12; i++){
    let mon_index = (i + cur_mon - 1)%12;
    if (index_list[mon_index] == null) continue;
    // add Month, Year title
    let newH3 = document.createElement('h3');
    let year = now.getFullYear() + ((mon_index < (cur_mon - 1)) ? 1 : 0);
    let content = document.createTextNode(monthNames[mon_index] + ", " + year);
    newH3.appendChild(content);
    scroll_view.appendChild(newH3);
    // add items on display
    let newMonthDiv = document.createElement('div');
    newMonthDiv.setAttribute('class','month');
    newMonthDiv.setAttribute('id',mon_index);
    let ulTag = document.createElement('ul');
    for (var j = 0; j < 4 && j < index_list[mon_index].length; j++){
        // item name
        let liTag = document.createElement('li');
        let id = index_list[mon_index][j];
        content = document.createTextNode(d_list[id]["Name"]+" ");
        liTag.appendChild(content);
        // item progress
        let progress = document.createElement('progress');
        if (cur_mon-1 != mon_index)
            progress.setAttribute('value',30);
        else
            progress.setAttribute('value',d_list[j]["Day"] - now.getDate());
        progress.setAttribute('max',30);
        liTag.appendChild(progress);
        ulTag.appendChild(liTag);
    }
    // add ... to indicate more than 4
    if (index_list[mon_index].length > 4){
        let liTag = document.createElement('li');
        liTag.appendChild(document.createTextNode("..."));
        ulTag.appendChild(liTag);
    }
    newMonthDiv.appendChild(ulTag);
    // register click listener
    newMonthDiv.addEventListener('click',function(){
        window.location.href = "/monthly.html?m=" + mon_index
         + "&mon="+ monthNames[mon_index] + ", " + year;
    });
    scroll_view.appendChild(newMonthDiv);
}

// if needed to display "no_dates"
if (index_list[13] != null && index_list[13].length != 0){
    var no_dates = document.getElementById("no_dates");
    no_dates.style.display = 'block';

    // populate no_date data in No_date
    let ulTag = document.getElementById('no_dates_list');
    for (var j = 0; j < 4 && j < index_list[13].length; j++){
        // item name
        console.log(j);
        let liTag = document.createElement('li');
        let id = index_list[13][j];
        content = document.createTextNode(d_list[id]["Name"]+" ");
        liTag.appendChild(content);
        ulTag.appendChild(liTag);
    }
    scroll_view.style.height = '65vh';
}

// put important info in session storage
sessionStorage.index_list = JSON.stringify(index_list);

// add item?
// var add = document.getElementById('add_item_btn');
// var addBox = document.getElementById('add_item_info');
// add.addEventListener('click',function(){
//     if (window.getComputedStyle(addBox).display == 'none')
//         addBox.style.display = 'block';
//     else
//         addBox.style.display = 'none';
// });
