var xmlhttp = new XMLHttpRequest();
var url = "scheduling.json";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        
        //Parse the JSON data to a JavaScript variable. 
        var parsedObj = JSON.parse(xmlhttp.responseText);    
        // This function is defined below and deals with the JSON data parsed from the file. 
        displayJSON(parsedObj); 
    }
};

xmlhttp.open("GET", url, true);
xmlhttp.send();

    
function displayJSON(obj) {
    console.log('in display JSON');
    var text = '';
   
    var keys = Object.keys(obj[0].slots);
    console.log(typeof(keys[0]))
    // class.property[var] in this way varibles could be a key
    text = obj[0].slots[keys[0]].time; 
    for(var i=0 ; i< keys.length; i++)
    {
        // console.log(keys[i]);
        
    }
    // Add the new html code to the div element with id = 'id01'.
    document.getElementById("id01").innerHTML = text;
    
}
