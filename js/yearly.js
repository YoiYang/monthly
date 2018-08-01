document.getElementById('log_out').addEventListener('click',function(){
    firebase.auth().signOut().then(function() {
        window.location.href="/index.html";
    }).catch(function(error) {
        alert(error.message);
    });
    localStorage.removeItem('offline');
});

// import some sample data for user local use
document.title = "Monthly (Offline)";
if (localStorage.dataList == null && (localStorage.offline == null || JSON.parse(localStorage.offline)!=false)){
    console.log("Using local data");
    let dat = [
        {"Name":"Learn how to play Tennis", "Mon":"1,3,5,7,8","Day":31, "Note":"I gladly wrote notes here","More":true,"End":"2018-07-31","Prio":"2","Archive":false,"Begin":"2018-07-04","Inprog":true}
        ,{"Name":"Read a book this month","Day":30,"Note":"some other notes", "More":true,"End":"2018-08-04","Prio":"3", "Archive":false,"Begin":"2018-07-04","PreInprog":false}
        ,{"Name":"Appreciate your achivements", "Mon":"1,5,6,8","Day":15,"Note":"I should take notes here", "More":false,"Archive":false,"Begin":"2018-07-04", "End":"2018-10-04","Inprog":true}
        ,{"Name":"Contact someone I didn\'t contact for years", "Mon":"5","Note":"I note here", "More":true,"End":"2018-07-31", "Prio":"2","Archive":false,"Begin":"2018-07-04", "Inprog":true,"PreInprog":false}
        ,{"Name":"Sleep enough at least two times a week", "Mon":"5,8","Day":13,"Note":"It\'s true","More": true, "End":"2018-07-05",  "Prio":"1","Archive":true, "Color":"r", "Begin":"2018-07-04", "Inprog":false,"PreInprog":true}
        , {"Name":"Study AI programming ", "Mon":"5,8,9,11", "Day":3,"Note":"Machine Learning man! Oh Yeah! ???","More":false,"End":"2018-07-04", "Prio":"0", "Archive":true,"Color":"g","Begin":"2018-07-04","Begin":"2019-07-04", "Inprog":false, "PreInprog":true}
        , {"Name":"Study anthropology", "Mon":"1,2,3,10", "Day":24,"Note":"What is that","End":"2020-07-04", "Prio":"0", "Archive":false,"Begin":"2018-07-04", "Inprog":true, "PreInprog":true}
        ,{"Name":"Fail bad for once", "Mon":"1,3,4,8,10", "Day":24,"Note":"And reflect about it.","More":false,"End":"2050-07-03", "Prio":"0", "Archive":false,"Color":"g","Begin":"2019-07-04", "Inprog":false, "PreInprog":true}
    ];
    localStorage.dataList = JSON.stringify(dat);
    localStorage.last_log_in_month = new Date().getMonth()+ 1;
    localStorage.offline = true;
}

// if using online database
if (localStorage.offline != null && !JSON.parse(localStorage.offline)){
    localStorage.server_url = 'http://localhost:3000/posts';
    localStorage.info_url = 'http://localhost:3000/info';
    console.log("Using json database");
    document.title = "Monthly (Online)";
    // initialize
    if (localStorage.dataList == null){
        localStorage.last_log_in_month = new Date().getMonth()+ 1;
        localStorage.offline = false;
    }
    let xhr = new XMLHttpRequest();
    // make it synchronous
    xhr.open('GET', localStorage.server_url , false);
    xhr.onload = function() {
      localStorage.dataList = this.responseText;
    }
    xhr.send();
    // get user info
    xhr = new XMLHttpRequest();
    // make it synchronous
    xhr.open('GET', localStorage.info_url , false);
    xhr.onload = function() {
      localStorage.last_log_in_month = JSON.parse(this.responseText)['last_log_in_month'];
    }
    xhr.send();
}

// helper function when parsing data
function addToNoDates(i){
    // No dates
    if (index_list[13] == null)
        index_list[13] = [i];
    else {
        index_list[13].push(i);
    }
}

// remove null in the datalist (previously removed)
var d_list = JSON.parse(localStorage.dataList);
let temp_length = d_list.length;
d_list = d_list.filter(item => item!=null);
// this only will be executed in offline mode
if (temp_length > d_list.length)
    localStorage.dataList = JSON.stringify(d_list);

// populate data into a local indexing list **************
// 0~11: each month, 12: archived, 13: no dates,
// 14: didn't finish last month, 15: didn't finish this month
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
        // collect tasks unfinished last month
        if (d_list[i]['PreInprog'] != null && d_list[i]['PreInprog']){
            if (index_list[14] == null)
                index_list[14] = [i];
            else
                index_list[14].push(i);
        }
        // collect tasks unfinished this month
        if (d_list[i]['Inprog'] != null && d_list[i]['Inprog']){
            if (index_list[15] == null)
                index_list[15] = [i];
            else
                index_list[15].push(i);
        }
    }
}

// Update the "PreInprog" and "Inprog" if a new month came
// record unfinished tasks from last month
var now = new Date();
var cur_mon = now.getMonth() + 1;
var last_use_month = JSON.parse(localStorage.last_log_in_month);
if (cur_mon != last_use_month){
    // update "Inprog" and "PreInprog" in this month
    for(var i = 0; i < index_list[14].length; i++){
        d_list[index_list[14][i]]['PreInprog'] = false;
    }
    // update the current "last month" progress
    for(var i = 0; i < index_list[15].length; i++){
        if (d_list[index_list[15][i]]["Inprog"] != null)
            d_list[index_list[15][i]]["PreInprog"] = d_list[index_list[15][i]]["Inprog"];
        else
            d_list[index_list[15][i]]["PreInprog"] = false;
        d_list[index_list[15][i]]["Inprog"] = true;
    }
    localStorage.last_log_in_month = new Date().getMonth() + 1;
    // update the new month on the database
    let payload = JSON.stringify({"last_log_in_month": localStorage.last_log_in_month})
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', "http://localhost:3000/info/", true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
    xhr.send(payload);
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
        else{
            if (d_list[id]["Day"] != "")
                progress.setAttribute('value',d_list[id]["Day"] - now.getDate());
        }
        progress.setAttribute('max',30);
        liTag.appendChild(progress);
        ulTag.appendChild(liTag);
    }
    // add ... to indicate more than 4
    if (index_list[mon_index].length > 4){
        let liTag = document.createElement('li');
        liTag.appendChild(document.createTextNode(". . ."));
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
var no_dates = document.getElementById("no_dates");
if (index_list[13] != null && index_list[13].length != 0){
    no_dates.style.display = 'block';
    // populate no_date data in No_date
    let ulTag = document.getElementById('no_dates_list');
    for (var j = 0; j < 4 && j < index_list[13].length; j++){
        // item name
        let liTag = document.createElement('li');
        let id = index_list[13][j];
        content = document.createTextNode(d_list[id]["Name"]+" ");
        liTag.appendChild(content);
        ulTag.appendChild(liTag);
    }
    no_dates.addEventListener('click',function(){
        window.location.href = '/monthly.html?m=13&mon=No%20Month%20Assigned'
    });
    scroll_view.style.height = '65vh';
}

// put indexed info in session storage
sessionStorage.index_list = JSON.stringify(index_list);

// add item set up
var add = document.getElementById('add_item_btn');
// set add item iframe
var addBox = document.getElementById('add_item_info');
function hideAddBox(){
    addBox.style.visibility = 'none';
    addBox.style.opacity = 0;
    addBox.style.width = 0;
    add.innerHTML = "Add Item";
}
add.addEventListener('click',function(){
    if (addBox.style.opacity == 0){
        addBox.style.opacity = 1
        addBox.style.width = '419px';
        if (document.documentElement.clientWidth < 420){
            addBox.style.width = '100%';
        }
        addBox.src = '/item.html?ind='+d_list.length;
        addBox.style.visibility = 'visible';
        addBox.style.height = addBox.contentWindow.document.body.scrollHeight + 'px';
        add.innerHTML = "Cancel";
    }
    else
        hideAddBox();
});
// cancel add items
document.onkeyup = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27)
        hideAddBox();
};
scroll_view.addEventListener('click',function(){
    if (addBox.style.opacity == 1)
        hideAddBox();
});
// let "delete" hide the edit box
addBox.addEventListener('load',function(){
    addBox.contentDocument.getElementById('delete').addEventListener('click',function(){
        hideAddBox();
    });
    addBox.contentDocument.getElementById('archive').addEventListener('click',function(){
        hideAddBox();
        location.reload();
    });
    addBox.contentDocument.getElementById('save').addEventListener('click',function(){
        hideAddBox();
        location.reload();
    });
});
