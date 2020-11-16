
/*------------------Glabal Varible---------------------*/
var url = "scheduling.json";   
var parsedObj;
var dir_date = {}; //{date1:[firstLayerNum,day],date2:[firstLayerNum,day],...}
var dir_date_time ={};//{date1:{timeslot1:slotId1,timeslot2:slotId2,...},date2:{...},...}
var select_date ="", select_time="all", select_type ="all";

/*------------------Read Json file--------------------*/    
var xmlhttp1 = new XMLHttpRequest();
xmlhttp1.onreadystatechange = function() {
    if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {
        
        //Parse the JSON data to a JavaScript variable. 
        parsedObj = JSON.parse(xmlhttp1.responseText); 
        read_date_display(parsedObj)
    }
};

xmlhttp1.open("GET", url, true);
xmlhttp1.send();

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
                // console.log("dir_date_time",dir_date_time)
                return 0;
            }
        }
        return -1;
    }
}
/*------------------HTML element creator ---------------------------------------*/
function create_table(temp_dir_ls,sessions_id,type_value)
{
    var text="";
    //create table for each session
    if(temp_dir_ls.length)
    {
        for(var j=0;j<temp_dir_ls.length; j++)
        {   
            var title_local = temp_dir_ls[j].title;
            var time_local = temp_dir_ls[j].time;
            var room_local = temp_dir_ls[j].room;
            var type_local = temp_dir_ls[j].type;
            var sessionID_local = temp_dir_ls[j].sessionId;
            var submissions_local = temp_dir_ls[j].submissions;
            if(type_value === 'other')
            {
                if(type_local === "paper")
                {
                    continue;
                }
            }
            else if(type_value === "paper")
            {
                if(type_local !== "paper")
                {
                    continue;
                }
            }

            text += "<tr><td id='table_title'>" +
            title_local +
            "</td><td id='table_time'>" +
            time_local +
            "</td><td id='table_room'>" +
            room_local +
            "</td><td id= table_type>" +
            type_local +
            "</td><td id = table_submissions>" +
            "<button id="+sessionID_local+" type=\"button\" onclick=\"btn_submissons_function(id)\">More</button>" 
            "</td></tr>";

            
            if(sessionID_local === sessions_id)
            {
                console.log('sessions_id',sessions_id,"sessionID_local",sessionID_local)
                if (submissions_local.length >0)
                {
                    // console.log("temp_dir_ls.submissions",submissions_local[k].title);
                    for(var k=0;k<submissions_local.length;k++)
                    {
                        // console.log("temp_dir_ls.submissions",submissions_local[k].title);
                        var title_local_s = submissions_local[k].title;
                        var doiUrl_local_s = submissions_local[k].doiUrl;
                        text += "<tr><td colspan='2'>" +
                        title_local_s +
                        "</td><td colspan='3'>" +
                        "<a href="+doiUrl_local_s+" target='_blank'>Detail Information</a>"
                        "</td></tr>";
                    }
                }
                else
                {
                    console.log("temp_dir_ls.submissions","No submisson");
                }
            }
        }
    }
    else
    {
        console.log("No sessions this slot");
    }
    return text
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

        //keys = slots in specific date
        var keys = Object.keys(dir_date_time[date]);
        for(var i=0; i < keys.length; i++)
        {
            text +="<option value="+dir_date_time[date][keys[i]]+">"+keys[i]+"</option>";
        }
    }
    catch
    {
        text += "Fail to read time"
    }
    document.getElementById("sel_time").innerHTML = text;
}

function read_Session_display(obj,date,time,sessions_id,type_value)
{
    
    var first_layer = dir_date[select_date][0];
    var text = ""
    document.getElementById("column2_l").innerHTML = text;
    try
    {
        if(time === "all")
        {
            var slotID_keys = Object.keys(obj[first_layer].slots);
            text = "<br><br><table width='100%'>";

            text+=
            "<colgroup>"+
            "<col style='width:60%'>"+
            "<col style='width:10%'>"+
            "<col style='width:10%'>"+
            "<col style='width:10%'>"+
            "<col style='width:10%'>"+
            "</colgroup>"  
            
            text += "<tr><th>Title</th><th>Start time</th><th>Room</th><th>Type</th><th>submissions</th></tr>";  
            for(var i=0; i<slotID_keys.length;i++)
            {   
                //read sessions in selected slot by slotID
                var temp_dir_ls = obj[first_layer].slots[slotID_keys[i]].sessions;
                //create table for each session
                text += create_table(temp_dir_ls,sessions_id,type_value)
            }
            text += "</table>"; 
        }
        else
        {
            var slotID = dir_date_time[date][time];
            //read sessions in selected slot by slotID
            var temp_dir_ls = obj[first_layer].slots[slotID].sessions;
            if(temp_dir_ls.length>0)
            {
                text = "<br><br><table width='100%'>";
                text+=
                "<colgroup>"+
                "<col style='width:60%'>"+
                "<col style='width:10%'>"+
                "<col style='width:10%'>"+
                "<col style='width:10%'>"+
                "<col style='width:10%'>"+
                "</colgroup>" 
                
                text += "<tr><th>Title</th><th>Start time</th><th>Room</th><th>Type</th><th>submissions</th></tr>";  
                //create table for each session
                text += create_table(temp_dir_ls,sessions_id,type_value)
                text += "</table>"; 
            }
            else
            {
                text= "<p>No sessions in this slot</p>"
            }

        }
       
    }
    catch
    {
        text += "Fail to read sessions"
    }
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
    document.getElementById("type_all").disabled = true;
    document.getElementById("type_paper").disabled = true;
    document.getElementById("type_other").disabled = true;
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
    document.getElementById("type_all").disabled = true;
    document.getElementById("type_paper").disabled = true;
    document.getElementById("type_other").disabled = true;
    console.log('select_time:',select_time);
}

function btn_session_function()
{

    console.log('in btn_session_function select_time:',select_time);
    read_Session_display(parsedObj,select_date,select_time);
    document.getElementById("type_all").disabled = false;
    document.getElementById("type_paper").disabled = false;
    document.getElementById("type_other").disabled = false;
    document.getElementById("type_all").checked = true;

}

function btn_submissons_function(session_id)
{   
    console.log("more : ",session_id)
    read_Session_display(parsedObj,select_date,select_time,session_id,select_type);
}

function radiobtn_type_function(type_value)
{   
    session_id="";
    console.log("value : ",type_value);
    select_type = type_value
    read_Session_display(parsedObj,select_date,select_time,session_id,select_type);

}

/*-------------------------------------------------------*/


