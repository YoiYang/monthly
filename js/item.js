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

onclick="document.getElementById('options_div').display = 'inline-block';"
// TODO:: Archive/Delete ui
setpopup('delete');
setpopup('archive');
setpopup('check');
function setpopup(idname){
    document.getElementById(idname).addEventListener('click',
        function(){
            let a = document.getElementById('popup');
            a.innerHTML = idname + "!";
            a.style.display = "block";
            setTimeout(
                function(){
                    document.getElementById('popup').style.display = "none";
                }, 1000);
        });
}
// month checkboxes
// check all months
var month_checkboxes = document.getElementsByClassName('month');
// set up each month
for (var i = 1; i < month_checkboxes.length; i++){
    month_checkboxes[i].addEventListener('input',function(){
        if (!this.checked){
            // when a month is unchecked, uncheck All option
            month_checkboxes[0].checked = false;
        }
    })
}

month_checkboxes[0].addEventListener('input', function(){
    for (var i = 1; i < month_checkboxes.length; i++){
        month_checkboxes[i].checked = this.checked;
    }
});


// Days remain/passed
var remain = document.getElementById('time_remain');
var pass = document.getElementById('time_pass');
var f_date = document.getElementById('f_date');
var i_date = document.getElementById('i_date');
f_date.addEventListener('input', calculateDays);
i_date.addEventListener('input', calculateDays);
function calculateDays (evt) {
    if (f_date.value != "")
        remain.innerHTML=Math.floor((new Date(f_date.value)-new Date())/(1000*60*60*24));
    if (i_date.value != "")
        pass.innerHTML=Math.floor((new Date()-new Date(i_date.value))/(1000*60*60*24));
}


//get from dirty url
if (document.URL.includes('?')){
    var d = (decodeURI(document.URL).split('?')[1]).split('&');
    document.getElementById('name').value = d[0].substring(5);
    document.getElementById('f_date').value = d[1].substring(5);
    document.getElementById('priority').value = d[2].substring(5);
    calculateDays();
}

function save(x){
    alert(x)
}
