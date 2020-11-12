
/*------------------Glabal Varible---------------------*/
var url_json = "scheduling.json";
var parsedObj = new Object();
var dir_date = {};
var dir_date_time ={};
/*-----------------------------------------------------*/



function readJson(url)
{
    console.log("Hello1")
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


function readDate(obj,dir_date_l)
{
    for(var i =0; i< obj.length; i++)
    {
        dir_date_l[obj[i].date] = obj[i].day;
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
                var keys = Object.keys(obj[i].slots); //slot id
                for(var j=0;j<keys.length; j++)
                {
                    ls_time.push(obj[i].slots[keys[j]].time);
                    dir_date_time[date] = ls_time;
                }
                return 0;
            }
        }
        return -1;
    }
}
    
function displayJSON(obj) {
    console.log('in display JSON');
    var text = '';
    var text_2 = [];

    try 
    {
        if(! readDate(obj,dir_date))
        {
            console.log(dir_date);
            var keys = Object.keys(dir_date);
            // text = "<select>";
            for(var i =0; i < keys.length; i++) 
            {
                text +="<option>"+keys[i]+" ,"+dir_date[keys[i]]+"</option>";
                console.log(text);
            }  
            // text += "</select>";
            

            // try
            // {
            //     var keys = Object.keys(dir_date);
            //     readTime(parsedObj,keys[1],dir_date_time)
            //     console.log(dir_date_time)
            // }
            // catch
            // {
            //     text += "Fail to read time"
            // }
        }
    }
    catch
    {
        text += "Fail to read date"
    }
    // Add the new html code to the div element with id = 'id01'.
    document.getElementById("se1").innerHTML = text;
    // document.getElementById("id02").innerHTML = text_2;
}

readJson(url_json)
displayJSON(parsedObj)

