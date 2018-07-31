// fetch month
var url = new URL(document.URL);
let monName = url.searchParams.get("mon");
var selectOrder = document.getElementById('order_by');
// helpers for options
var confirmDel =  document.getElementById('confirmDel');
var delInd = document.getElementById('delInd');
var delTag;
var archMesg = document.getElementById('confirmAction');

// "options" panel
var opt_template = document.getElementById('opt_btns').content;
if (monName == "Archived"){
    // set up different elements for Archive page
    opt_template.children[0].children[1].children[0].src = "img/unarchive.png";
    opt_template.children[0].children[1].children[1].src = "img/unarchive2.png";
    archMesg.children[0].innerHTML = "Unarchived!";
}
// get month index
let mon_ind = parseInt(url.searchParams.get("m"));
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
        // console.log("Compare " + key+": " + a + ":" + x + " " + b+":" + y);
        if (x == null || x == "")
            return 1;
        if (y == null || y == "")
            return -1;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
// populate data (in default sorted by "Day")
var orderedList = [];
let sortBy = url.searchParams.get('sort');
if (sortBy == null)
    orderedList = sortByKey(mon_index_list[mon_ind],'Day');
else{
    orderedList = sortByKey(mon_index_list[mon_ind],sortBy);
    selectOrder.value = sortBy;
}
// write title
if (monName != null && monName.length > 0)
    document.getElementById("title").innerHTML = monName + ' (' + orderedList.length + ')';

// text styling function
function assignFontStyle(td,d_ind){
    td.style.fontStyle = 'normal';
    switch (parseInt(d_list[d_ind]['Prio'])) {
        case 0: // high
        td.style.textDecoration = "underline";
        td.style.color = '#e85140';
        td.style.fontWeight = 'bold';
        break;
        case 1: // med
        td.style.fontWeight = '400';
        td.style.color = '#8c291e';
        td.style.textDecoration = "underline";
        break;
        case 2:
        td.style.color = '#8c291e';
        break;
        default:
        td.style.color = 'black';
    }
    // // make it gray if it's finished
    if(d_list[d_ind]['Inprog'] == false){
        td.style.fontStyle = 'italic';
        td.style.color = 'DarkGray';
    }
    return td;
}

// structuring
function removeFromSession(ind){
    if (mon_index_list[mon_ind] != null){
        let alloc_ind = mon_index_list[mon_ind].indexOf(ind);
        if (alloc_ind > -1){
            mon_index_list[mon_ind].splice(alloc_ind,1);
            sessionStorage.index_list = JSON.stringify(mon_index_list);
        }
    }
}
// write body
var tbody = document.getElementById('tbody');
tbody.innerHTML = "";
for (let i = 0; i < orderedList.length; i++){
    let trTag = document.createElement('tr');
    // TODO:: maybe assign value to it?
    let d_ind = orderedList[i];
    let td = document.createElement('td');
    td.appendChild(document.createTextNode(d_list[d_ind]['Name']));
    td = assignFontStyle(td,d_ind);
    trTag.appendChild(td);
    let td2 = document.createElement('td');
    let day = d_list[d_ind]['Day'];
    if (day == null)
    day = ""
    td2.appendChild(document.createTextNode(day));
    trTag.appendChild(td2);

    let opts = opt_template.cloneNode(true);
    // set up option eventlistener
    // check
    opts.children[0].children[0].addEventListener('click',function(){
        d_list[d_ind]["Inprog"] = !d_list[d_ind]["Inprog"];
        if (d_list[d_ind]["Inprog"] == false){
            td.style.fontStyle = 'italic';
            td.style.color = 'DarkGray';
        }
        else
            td = assignFontStyle(td,d_ind);
        localStorage.dataList = JSON.stringify(d_list);
    });
    // archive
    opts.children[0].children[1].addEventListener('click',function(){
        d_list[d_ind]["Archive"] = !d_list[d_ind]["Archive"];
        trTag.style.display = 'none';
        setTimeout(function(){
            archMesg.style.display = 'none';
        },700);
        archMesg.style.display = 'block';
        localStorage.dataList = JSON.stringify(d_list);
        removeFromSession(d_ind);
    });
    // delete
    opts.children[0].children[2].addEventListener('click',function(){
        delInd.value = d_ind;
        delTag = trTag;
        confirmDel.style.display = 'inline-block';
    });

    trTag.appendChild(opts);
    tbody.appendChild(trTag);
}

// prompt to edit
var edit = document.querySelectorAll('tr');
var temp_name = '';
var cancel_btn = document.getElementById('cancel');
function hideEditBox(){
    editBox.style.visibility = 'none';
    editBox.style.opacity = 0;
    editBox.style.width = 0;
    cancel_btn.style.visibility = 'none';
    cancel_btn.style.opacity = 0;
}
// Edit setup assign click/mouseover listener
var editBox = document.getElementById('edit_item_info');
// let "save" hide the edit box
editBox.addEventListener('load',function(){
    ['save','archive','delete'].forEach(function(idName){
        editBox.contentDocument.getElementById(idName).addEventListener('click',function(){
            hideEditBox();
            location.reload();
        });
    });
});
for (let i = 1; i < edit.length; i++){
    let name_tag = edit[i].children[0];
    let col2_tag = edit[i].children[1];
    name_tag.addEventListener('click',function(){
        editBox.src = url.href.substr(0,url.href.indexOf('month')) +
        '/item.html?ind='+orderedList[i-1]+ "&frommon=" + (mon_ind+1)+ "&more";

        if (editBox.style.opacity == 0){
            editBox.style.opacity = 1
            editBox.style.width = '80%';
            if (document.documentElement.clientWidth < 420){
                editBox.style.width = '100%';
            }
            editBox.style.visibility = 'visible';
            cancel_btn.style.visibility = 'none';
            cancel_btn.style.opacity = 1;
        }
    });
    col2_tag.addEventListener('click',function(){
        editBox.src = url.href.substr(0,url.href.indexOf('month')) +
        '/item.html?ind='+orderedList[i-1]+ "&frommon=" + (mon_ind+1);
    });
    edit[i].addEventListener('mouseover',function(){
        temp_name = name_tag.innerHTML;
        name_tag.innerHTML = "(Click to Edit)";
        name_tag.style.fontWeight = 'bold';
    });
    edit[i].addEventListener('mouseout',function(){
        name_tag.innerHTML = temp_name;
        name_tag.style.fontWeight = 'lighter';
    });
}
// use ESC to cancel editBox
document.onkeyup = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        hideEditBox();
    }
};
// use cancel_btn to cancel edit
cancel_btn.addEventListener('click',function(){
    hideEditBox();
});

// sort by Priority/Name/Completion
selectOrder.addEventListener('input', function(){
    url.searchParams.delete('sort');
    url.searchParams.append('sort',selectOrder.value);
    window.location.href = url.href;
})

// set up delete confirm box
document.getElementById('cancelDel').addEventListener('click',function(){
    confirmDel.style.display = 'none';
    delInd.value = -1;
    delTag = null;
});
document.getElementById('del-confirm').addEventListener('click',function(){
    if (delInd.value > -1 && delTag != null){
        confirmDel.style.display = 'none';
        delTag.style.display = 'none';
        removeFromSession(delInd.value);
        d_list[delInd.value] = null;
        localStorage.dataList = JSON.stringify(d_list);
    }
});
