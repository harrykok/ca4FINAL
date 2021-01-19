trackerId = 1;

function addTracking() {
    //remove original addTracker
    document.getElementById("addTracking").remove();
    //add tracking box
    document.getElementById("grid-container").innerHTML +=
        '<div class="grid-item tracking" id="tracker' + trackerId + '">' +
        '<form action="#" onsubmit="getQueueApi(' + trackerId + ');return false">' +
        '<table class="tableAlign">' +
        '<tr>' +                        //append trackerId to make companyid unique
        '<td><input type="text" id="companyId' + trackerId + '" placeholder="Company Id" onInvalid="InvalidMsg(this)" oninput="InvalidMsg(this)" required="required"></td>' +
        '<td><input type="submit" id="search" value="Search"/></td>' +
        '<td><span class="cross" onclick="closeTracking(' + trackerId + ')">x</span></td>' +
        '<td id="closeTrackingCross"></td>' +
        '</tr>' +
        '<tr>' +
        '<td><span id="errorMsg' + trackerId + '"></td>' +
        '</tr>' +
        '<tr>' +
        '<td><select class="queueId" id="queueId' + trackerId + '" onchange = loadChart(this.value)>' +
        '</select></td>' +
        '<td colspan="2"><input type="checkbox" name="hideInactivez" onclick="hideInactives()" checked>' +
        '<label for="hideInactive" id="hideInactive">Hide Inactive</label></td>' +
        '</tr>' +
        '</table>' +
        '</form>' +
        '<canvas id="'+trackerId+'" width="200" height="100""></canvas> '+
        '</div>';
    //add new addTracker box
    document.getElementById("grid-container").innerHTML +=
        '<div class="grid-item" id="addTracking" onclick=addTracking()>' +
        '<span class="circle plus"></span><a class="addAnotherText">Add another</a>' +
        '</div>';
    //tracker id count increase for next tracker added
    trackerId++;
}

function closeTracking(trackerId) {
    //remove tracker
    document.getElementById("tracker" + trackerId).remove();
    //stop backend calling with function
    stopGraph(trackerId); 
}

function getQueueApi(trackerId) {
    console.log("Tracker Id: " + trackerId);
    var companyId = document.getElementById("companyId" + trackerId).value;
    var errorSpan = document.getElementById("errorMsg" + trackerId);
    var expressions = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/; //to see if the input has this shit
    //var textbox = document.getElementById("companyId");
    //console.log(textbox.value);

    fetch('http://localhost:3000/company/queue?company_id=' + companyId)
        .then(response => { return response.json(); })
        .then(data => {
            console.log(data);
            if (data.length == 0) {
                //companyId.validity=false;
                //companyId.setCustomValidity("unknown company id")
                //console.log(companyId);
                //InvalidMsg(companyId,0);
                //InvalidMsg(0); //this also does not work
                errorSpan.innerText = "Unknown Company Id: " + companyId; //can do the error like this
            }

            else {
                errorSpan.innerText = "";
                //companyId.setCustomValidity("");
                var optionString = "";
                for (i = 0; i < data.length; i++) {
                    console.log(data[i].queue_id);
                    console.log(data[i].is_active);
                    if (data[i].is_active == 1) {
                        optionString += '<option name="options" value="' + data[i].is_active + '">' + data[i].queue_id + '</option> ';
                    } else if (data[i].is_active == 0) {
                        optionString += '<option name="options" value="' + data[i].is_active + '" disabled>' + data[i].queue_id + '</option> ';
                    }
                }
                document.getElementById("queueId" + trackerId).innerHTML = optionString;
                
            }
        })
        .catch(error => {
            console.log(error);
            if (error = TypeError) {
                errorSpan.innerText = "Failed to fetch";
            }
            else if (error.code == 400) {  //need htis
                errorSpan.innerText = "400 bad request.";
            }
            else if (error.code = 500) { //need this as well
                errorSpan.innerText = "Internal server error.";
            }
            else if (error.code = 404) {
                errorSpan.innerText = "404 Not found.";
            }
            // else if (error != null) {
            //     errorSpan.innerText = "Unable to establish connection with database";
            // }

        });

}

function InvalidMsg(textbox) {
    var expressions = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    //console.log(textbox);
    if (textbox.value === '') {
        textbox.setCustomValidity
            ('Company Id cannot be empty');
    } else if (textbox.value < 1000000000) {
        textbox.setCustomValidity
            ('Company Id should be more than or equals to 1000000000');
    } else if (textbox.value > 9999999999) {
        textbox.setCustomValidity
            ('Company Id should be less than or equals to 999999999');
    } else if (expressions.test(textbox.value)) {
        textbox.setCustomValidity
            ('Invalid Company Id');
    }
    // else if (dataLength == 0) {  //dont need this chunk
    //     textbox.setCustomValidity
    //         ('Unknown Company Id');
    //         console.log("entered unknown company")
    //         console.log(textbox); //goes inside here when uunknown company id passed
    // }
    else {
        textbox.setCustomValidity('');
    }

    return true;
}

function hideInactives() {
    var Checkbox = document.getElementsByName("hideInactivez");
    var Options = document.getElementsByName("options");

    if (Checkbox[0].checked == true) { //disable inactive
        for (i = 0; i < Options.length; i++) {
            if (Options[i].value == 0) {
                Options[i].disabled = true;
            }
        }
    }
    if (Checkbox[0].checked == false) { //dont disable inactive
        for (i = 0; i < Options.length; i++) {
            if (Options[i].value == 0) {
                Options[i].removeAttribute('disabled');
            }
        }
    }

}

function showGraph(trackerId) {
    //draw bottom half box
    if (!document.getElementById("bottomhalf" + trackerId)) {
        document.getElementById("tracker" + trackerId).innerHTML +=
            '<div class="bottomHalf" id="bottomhalf' + trackerId + '">' +
            'wahts up' +
            '</div>';
    }
}

function getGraphData(queueid) {
    var time = moment();
    time = time.subtract(3, 'minutes');
    time = moment(time).format();
    time = time.replace("+", "%2B");
    var queue_id = queueid;
    console.log(queue_id);
    

    fetch(`http://localhost:3000/company/arrival_rate?queue_id=${queue_id}&from=${time}&duration=3`)
        .then(response => response.json())
        .then(data => {
            for (i = 0; i < data.length; i++) {
                countArray[i] = data[i].count;
                timeArray[i] = (new Date(data[i].timestamp * 1000).toLocaleString().slice(11));
            }
        })
        .catch(console.error);
}


function drawChart(queue_id, countArray, timeArray) {
    getGraphData(queue_id);
    var ctx = document.getElementById(trackerId);
    console.log(countArray, timeArray);
    var newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeArray,
            datasets: [{
                label: 'Arrival Rate',
                data: countArray,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {

            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
function loadChart(queue_id) {
    countArray = [];
    timeArray=[];
    update = setInterval(run=>drawChart(queue_id, countArray, timeArray), 3000);
}

function stopGraph(){
    clearInterval(update);
}