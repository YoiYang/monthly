// setup elements
var inp_name = document.getElementById('name');
var inp_note = document.getElementById('note');
var inp_day = document.getElementById('day_of_month');
var inp_i_date = document.getElementById('i_date');
var inp_f_date = document.getElementById('f_date');
var inp_prio = document.getElementById('priority');
var month_checkboxes = document.getElementsByClassName('month');
var check_btn = document.getElementById('check');
var archive_btn = document.getElementById('archive');

// "more" options
var moreBtn = document.getElementById('more');
var more_blocks = document.getElementsByClassName('more_attrs');
moreBtn.addEventListener('click',function(){
    if (more_blocks[0].style.display == 'none')
        for (let i = 0; i < more_blocks.length; i++){
            more_blocks[i].style.display = 'inline-block';
        }
    else
        for (let i = 0; i < more_blocks.length; i++){
            more_blocks[i].style.display = 'none';
        }
});

// month checkboxes UI setup
for (var i = 1; i < month_checkboxes.length; i++){
    month_checkboxes[i].addEventListener('input',function(){
        if (!this.checked)
            month_checkboxes[0].checked = false;
    })
}
month_checkboxes[0].addEventListener('input', function(){
    for (var i = 1; i < month_checkboxes.length; i++)
        month_checkboxes[i].checked = this.checked;
});

// Days remain/passed auto-calculation
var remain = document.getElementById('time_remain');
var pass = document.getElementById('time_pass');
inp_f_date.addEventListener('input', calculateDays);
inp_i_date.addEventListener('input', calculateDays);
function calculateDays (evt) {
    if (inp_f_date.value != "")
        remain.innerHTML=1+Math.floor((new Date(inp_f_date.value)-new Date())/(1000*60*60*24));
    if (inp_i_date.value != "")
        pass.innerHTML=Math.floor((new Date()-new Date(inp_i_date.value))/(1000*60*60*24))-1;
}

// fetch data
var d_list = JSON.parse(localStorage.dataList);
let url = new URL(document.URL);
if (url.searchParams.get("more") != null){
    for (let i = 0; i < more_blocks.length; i++){
        more_blocks[i].style.display = 'inline-block';
    }
}
var item_ind;
if (url.searchParams.get("ind") != null && url.searchParams.get("ind") < d_list.length){
    // modifying an old item
    item_ind = parseInt(url.searchParams.get("ind"));
    inp_name.value = d_list[item_ind]['Name'];
    if (d_list[item_ind]['Mon'] != null){
        let months = d_list[item_ind]['Mon'].split(',');
        for (var i = 0; i < months.length; i++){
            if (months[i] != "")
                month_checkboxes[parseInt(months[i])].checked = true;
        }
        if (months.length == 12)
            month_checkboxes[0].checked = true;
    }
    if (d_list[item_ind]['Day'] != null)
        inp_day.value = parseInt(d_list[item_ind]['Day']);
    inp_note.value = d_list[item_ind]['Note'];
    inp_i_date.value = d_list[item_ind]['Begin'];
    inp_f_date.value = d_list[item_ind]['End'];
    inp_prio.value = d_list[item_ind]['Prio'];
    calculateDays();
    if(!d_list[item_ind]["Inprog"]){
        check_btn.style.background = '#b7e3ff';
    }
    if(d_list[item_ind]["Archive"]){
        archive_btn.style.background = '#b7e3ff';
        archive_btn.childNodes[0].nodeValue = 'Unarchive\n';
    }
}
else{
    // adding a new item
    item_ind = d_list.length;
}
// set up Save/Archive/Delete/Check
function storeInfo(){
    // if adding a new item
    if (item_ind == d_list.length){
        console.log("Creating new element");
        d_list[item_ind]= {
            id: Math.random().toString(36).slice(2, 12),
            Name: "",
            Mon: "",
            Day: "",
            Note: "",
            Begin: new Date().toJSON().slice(0,10),
            End: "",
            Prio: 3,
            Archive: false,
            Inprog: true,
            PreInprog: false,
            color: ""
        };
    }
    d_list[item_ind]['Name'] = inp_name.value;
    d_list[item_ind]['Mon'] = "";
    if (month_checkboxes[0].checked == true)
        d_list[item_ind]['Mon'] = "1,2,3,4,5,6,7,8,9,10,11,12";
    else{
        for (var i = 1; i < 13; i++){
            if (month_checkboxes[i].checked){
                if (d_list[item_ind]['Mon'].length == 0)
                    d_list[item_ind]['Mon'] += i;
                else
                    d_list[item_ind]['Mon'] += (',' + i);
            }
        }
    }
    if (inp_day.value.length > 0)
        d_list[item_ind]['Day'] = inp_day.value;
    d_list[item_ind]['Note'] = inp_note.value;
    d_list[item_ind]['Begin'] = inp_i_date.value;
    d_list[item_ind]['End'] = inp_f_date.value;
    d_list[item_ind]['Prio'] = inp_prio.value;
}

// a function that removes this item from the monthly list (in sessionStorage)
var from_mon_ind = url.searchParams.get("frommon");
function removeFromTheMonth(){
    let index_list = JSON.parse(sessionStorage.index_list);
    if (from_mon_ind != null && index_list[from_mon_ind-1] != null){
        let alloc_ind = index_list[from_mon_ind-1].indexOf(item_ind);
        if (alloc_ind > -1){
            index_list[from_mon_ind-1].splice(alloc_ind,1);
            sessionStorage.index_list = JSON.stringify(index_list);
        }
    }
}
function updateDatabase(ind,method){
    // if using online mode
    if (localStorage.offline != null && !JSON.parse(localStorage.offline)){
        let xhr = new XMLHttpRequest();
        // allow async
        if (method == "POST")
            xhr.open(method, localStorage.server_url, true);
        else
            xhr.open(method, localStorage.server_url + "/" + d_list[ind]["id"], true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        if (method == "DELETE")
            xhr.send();
        else
            xhr.send(JSON.stringify(d_list[ind]));
    }
}
// set up Save
var save_btn = document.getElementById('save');
var require = document.getElementById('required');
function save_function(){
    storeInfo();
    // if adding a new item
    if (item_ind == d_list.length - 1){
        updateDatabase(item_ind,"POST");
    }else{
        // if editing an exsiting  item
        updateDatabase(item_ind,"PUT");
    }
    localStorage.dataList = JSON.stringify(d_list);

    // no need to update the session after change month.
    if (from_mon_ind == 13) return;
    // if this is from no_dates or month 1~12
    // when user makes changes in the month, update the temp list in monthly.html
    if (from_mon_ind == 14 ||
        (month_checkboxes[from_mon_ind] != null && month_checkboxes[from_mon_ind].checked == false))
        removeFromTheMonth();

}
// set up save_btn
save_btn.addEventListener('mouseover',function(){
    if (inp_name.value.trim() == ""){
        save_btn.removeEventListener('click',save_function,false);
        require.style.display = 'inline-block';
    }
    else {
        save_btn.addEventListener('click',save_function,false);
    }
});
// set up Archive
archive_btn.addEventListener('click',function(){
    storeInfo();
    d_list[item_ind]["Archive"] = !d_list[item_ind]["Archive"];
    updateDatabase(item_ind,"PUT");
    localStorage.dataList = JSON.stringify(d_list);
    removeFromTheMonth();
});
// set up Delete
// var popup =  document.getElementById('confirmDel');
document.getElementById('delete').addEventListener('click',function(){
    if (window.confirm("This item will be deleted forever.")){
        if (item_ind < d_list.length){
            // if deleting an existing item
            updateDatabase(item_ind,"DELETE");
            d_list[item_ind] = null;
            localStorage.dataList = JSON.stringify(d_list);
            removeFromTheMonth();
        }
    }
});
// set up Check
check_btn.addEventListener('click',function(){
    storeInfo();
    d_list[item_ind]["Inprog"] = !d_list[item_ind]["Inprog"];
    updateDatabase(item_ind,"PUT");
    localStorage.dataList = JSON.stringify(d_list);
    if(!d_list[item_ind]["Inprog"]){
        check_btn.style.background = '#b7e3ff';
    }
    else {
        check_btn.style.background = 'transparent';
    }
});
