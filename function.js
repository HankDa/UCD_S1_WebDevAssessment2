
/*------------------Glabal Varible---------------------*/
var url_json = "scheduling.json";
var parsedObj = new Object();
var dir_date = {}; //{date1:[firstLayerNum,day],date2:[firstLayerNum,day],...}
var dir_date_time ={};//{date1:{timeslot1:slotId1,timeslot2:slotId2,...},date2:{...},...}
var select_date ="", select_time="all";
/*-----------------------------------------------------*/
function readJson(url)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, false); // global varible issue: change true to false, check why?
    xmlhttp.send();
    parsedObj = JSON.parse(xmlhttp.responseText); 

    // xmlhttp.onreadystatechange = parseJsFileToObj(xmlhttp,obj_json); //check this problem
}

function parseJsFileToObj(xmlhttp,obj_json)
{
    console.log("2")
    console.log(xmlhttp.readyState)
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
    {
        console.log("Hello3")
        //Parse the JSON data to a JavaScript variable. 
        obj_json = JSON.parse(xmlhttp.responseText);    // Hank: gobal varible fail
        console.log(obj_json);
        // This function is defined below and deals with the JSON data parsed from the file. 
        // displayJSON(obj); 
    }
}

/*------------------Prase specific element in Json file function---------------------*/
function readDate(obj,dir_date_l)
{
    for(var i =0; i< obj.length; i++)
    {
        dir_date_l[obj[i].date] = [i,obj[i].day];
    }
    return 0;
}

function readTime(obj,date,dir_date_time)
{
    if(date in dir_date_time)
    {
        return 0
    }
    else
    {
        for(var i =0; i< obj.length; i++)
        {
            if(obj[i].date == date)
            {   
                var ls_time=[];
                var dir_time={};
                var keys = Object.keys(obj[i].slots); //slot id
                for(var j=0;j<keys.length; j++)
                {
                    dir_time[obj[i].slots[keys[j]].time] = obj[i].slots[keys[j]].slotId
                    dir_date_time[date] = dir_time;
                }
                console.log("dir_date_time",dir_date_time)
                return 0;
            }
        }
        return -1;
    }
}

/*------------------display specific content ---------------------------------------*/
function read_date_display(obj) 
{
    console.log('in display date');
    var text = '';
    try 
    {
        if(! readDate(obj,dir_date))
        {
            console.log(dir_date);
            var keys = Object.keys(dir_date);
            //create select list in html
            text += "<option>select date</option>"
            for(var i =0; i < keys.length; i++) 
            {
                text +="<option value="+keys[i]+">"+keys[i]+" ,"+dir_date[keys[i]][1]+"</option>";
                // console.log(text);
            }  
        }
    }
    catch
    {
        text += "Fail to read date"
    }
    document.getElementById("sel_date").innerHTML = text;
}

function read_time_display(obj,date,dir_date_time)
{
    console.log('in display time');
    var text = '';
    try
    {
        readTime(obj,date,dir_date_time)
        
        text += "<option value ='all'>all</option>"
        // console.log(text);
        var keys = Object.keys(dir_date_time[date]);
        // console.log("dir_date_time keys",keys)

        for(var i=0; i < keys.length; i++)
        {
            text +="<option value="+dir_date_time[date][keys[i]]+">"+keys[i]+"</option>";

        }
        // console.log(text)
    }
    catch
    {
        text += "Fail to read time"
    }
    document.getElementById("sel_time").innerHTML = text;
}

function read_Session_display(obj,date,time)
{
    var first_layer = dir_date[select_date][0];
    var text = ""
    console.log('in read_Session_display , text1: ',text);
    document.getElementById("column2_l").innerHTML = text;
    if(time === "all")
    {
        var slotID_keys = Object.keys(obj[first_layer].slots);
        // console.log('slotID_keys',slotID_keys)
        for(var i=0; i<slotID_keys.length;i++)
        {
            var temp_dir_ls = obj[first_layer].slots[slotID_keys[i]].sessions;
            if(temp_dir_ls.length)
            {
                for(var i=0;i<temp_dir_ls.length; i++)
                {   
                    var data = [];
                    data = [temp_dir_ls[i].title,temp_dir_ls[i].time,temp_dir_ls[i].room,temp_dir_ls[i].type];

                    text+= "<p>"+data[0]+"</p>";
                    text+= "<p>"+"time:"+data[1];
                    text+= "room:"+data[2];
                    text+= "type:"+data[3]+"</p>";
                    
                    text+= "<br>";
                    // console.log("data:",data);
                }
            }
            else
            {
                text = "<p>"+"No sessions in the period"+"</p>";
                console.log("No sessions in the period");
            }
        }
    }
    else
    {
        var slotID = dir_date_time[date][time];
        var temp_dir_ls = obj[first_layer].slots[slotID].sessions;
        if(temp_dir_ls.length)
        {
            console.log("Oops");
            for(var i=0;i<temp_dir_ls.length; i++)
            {
                var data = [];
                data = [temp_dir_ls[i].title,temp_dir_ls[i].time,temp_dir_ls[i].room,temp_dir_ls[i].type];
                for(var j=0; j<data.length; j++)
                {
                    text+= "<p>"+data[j]+"</p>";
                }
                text+= "<br>";
                // console.log("data:",data);
            }
        }
        else
        {
            text = "<p>"+"No sessions in the period"+"</p>";
            console.log("No sessions in the period");
            console.log('in read_Session_display , text2: ',text);
        }
    }
    console.log('in read_Session_display , text3: ',text);
    document.getElementById("column2_l").innerHTML = text;
}
/*------------------on-click function---------------------*/
function sel_date_function(id) 
{
    var date = document.getElementById(id).value;
    console.log(date);
    select_date = date;
    select_time ="all";
    read_time_display(parsedObj,date,dir_date_time);
    document.getElementById("btn_submit").disabled = false;
}


function sel_time_function(id)
{
    var slotID = document.getElementById(id).value;
    if(slotID === 'all')
    {
        select_time = 'all';
    } 
    else
    {
        var first_layer = parsedObj[dir_date[select_date][0]];
        select_time = parsedObj[dir_date[select_date][0]].slots[slotID].time;
    }

    console.log('select_time:',select_time);
}

function btn_session_function()
{
    console.log('in btn_session_function select_time:',select_time);
    read_Session_display(parsedObj,select_date,select_time);
}
/*-------------------------------------------------------*/

// initiate funciton
readJson(url_json)
read_date_display(parsedObj)

