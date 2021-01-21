trackerId = 1;
update = [];

function addTracking() {
    //remove original addTracker
    document.getElementById("addTracking").remove();
    //add tracking box
    document.getElementById("grid-container").innerHTML +=
        '<div class="grid-item tracking" id="tracker' + trackerId + '">' +
        '<form action="#" onsubmit="getQueueApi(' + trackerId + ');return false">' +
        '<table class="tableAlign">' +
        '<tr>' +                            //append trackerId to make companyid unique
        '<td><input type="text" class="companyId" id="companyId' + trackerId + '" placeholder="Company Id" onInvalid="InvalidMsg(this)" oninput="InvalidMsg(this)" required="required"></td>' +
        '<td><input type="submit" id="search" value="Search"/></td>' +
        '<td><span class="cross" onclick="closeTracking(' + trackerId + ')">x</span></td>' +
        '<td id="closeTrackingCross"></td>' +
        '</tr>' +
        '<tr>' +
        '<td><span id="errorMsg' + trackerId + '" class="errorMsgText"></td>' +
        '</tr>' +
        '<tr>' +
        '<td><select class="queueId" id="queueId' + trackerId + '" onchange = "stopGraph(' + trackerId + '); loadChart(JSON.parse(this.value).queue_id,' + trackerId + ');">' +
        '</select></td>' +
        '<td colspan="2"><input type="checkbox" name="hideInactivez' + trackerId + '" onclick="hideInactives(' + trackerId + ')" checked>' +
        '<label for="hideInactive" id="hideInactive">Hide Inactive</label></td>' +
        '</tr>' +
        '</table>' +
        '</form>' +
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

    fetch('http://localhost:3000/company/queue?company_id=' + companyId)
        .then(response => { return response.json(); })
        .then(data => {
            console.log(data);
            if (data.length == 0) { //check if there are any existing queues
                errorSpan.innerText = "Unknown Company Id: " + companyId; //can do the error like this
            } else {
                errorSpan.innerText = "";
                var optionString = '<option name="options' + trackerId + '" value="#"> Please Select...</option>';
                for (i = 0; i < data.length; i++) {
                    if (data[i].is_active == 1) {
                        optionString += '<option name="options' + trackerId + '" value=' + JSON.stringify(data[i]) + '>' + data[i].queue_id + '</option> ';
                    } else if (data[i].is_active == 0) {
                        optionString += '<option name="options' + trackerId + '" value=' + JSON.stringify(data[i]) + ' disabled>' + data[i].queue_id + '</option> ';
                    }
                }
                document.getElementById("queueId" + trackerId).innerHTML = optionString;

            }
        })
        .catch(error => {
            console.log(error);
            if (error = TypeError) {
                errorSpan.innerText = "Failed to fetch!";
            }
            else if (error.code == 400) {
                errorSpan.innerText = "400 bad request.";
            }
            else if (error.code = 500) {
                errorSpan.innerText = "Internal server error.";
            }
            else if (error.code = 404) {
                errorSpan.innerText = "404 Not found.";
            }
        });
}

function InvalidMsg(textbox) {
    var expressions = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
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
    else {
        textbox.setCustomValidity('');
    }
    return true;
}

function hideInactives(hideInactivesId) {
    var Checkbox = document.getElementsByName("hideInactivez" + hideInactivesId);
    var Options = document.getElementsByName("options" + hideInactivesId);

    if (Checkbox[0].checked == true) { //disable inactive
        for (i = 1; i < Options.length; i++) {
            data = JSON.parse(Options[i].value)
            if (data.is_active == 0) {
                Options[i].disabled = true;
            }
        }
    }
    if (Checkbox[0].checked == false) { //dont disable inactive
        for (i = 1; i < Options.length; i++) {
            data = JSON.parse(Options[i].value)
            if (data.is_active == 0) {
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

function getGraphData(queueid, trackerId) {
    var time = moment();
    time = time.subtract(3, 'minutes');
    time = moment(time).format();
    time = time.replace("+", "%2B");
    var queue_id = queueid;
    //console.log(queue_id);

    fetch(`http://localhost:3000/company/arrival_rate?queue_id=${queue_id}&from=${time}&duration=3`)
        .then(response => response.json())
        .then(data => {
            //loading bar success
            document.getElementById("loadingBar" + trackerId).innerHTML = '<div class="loaderSuccess"></div>';
            for (i = 0; i < data.length; i++) {
                countArray[i] = data[i].count;
                timeArray[i] = (new Date(data[i].timestamp * 1000).toLocaleString().slice(11,-2));
            }
        })
        .catch(function () {
            console.error();
            //loading bar error
            document.getElementById("loadingBar" + trackerId).innerHTML = '<div class="loaderError"></div>';
        });
}


function drawChart(queue_id, countArray, timeArray, trackerId) {
    getGraphData(queue_id, trackerId);
    var ctx = document.getElementById(trackerId);
    //console.log(countArray, timeArray);
    var newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeArray,
            datasets: [{
                data: countArray,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {  
            legend: {
                display: false
           },
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

function loadChart(queue_id, trackerId) {
    countArray = [];
    timeArray = [];
    //draw bottom half box
    if (!document.getElementById("bottomhalf" + trackerId)) {
        document.getElementById("tracker" + trackerId).innerHTML +=
            '<div id="loadingBar' + trackerId + '"></div>' +
            '<div class="bottomHalf" id="bottomhalf' + trackerId + '">' +
            '<canvas id="' + trackerId + '" width="300" height="300""></canvas>' +
            '</div>';
    }
    update[trackerId] = {
        id: trackerId, chart: setInterval(function run() {
            //draw graph
            drawChart(queue_id, countArray, timeArray, trackerId)
        }, 3000)
    }
}

function stopGraph(trackerId) {
    //console.log(trackerId)
    if (!update[trackerId]) {
        console.log('nothing printing out');
    } else {
        clearInterval(update[trackerId].chart);
        console.log(update[trackerId].id)
    }
}