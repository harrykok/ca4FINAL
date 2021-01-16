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
        '<td><input type="text" class="companyId" id="companyId' + trackerId + '" placeholder="  Company Id"></td>' +
        '<td><input type="submit" id="search" value="Search"/></td>' +
        '<td><span class="cross" onclick="closeTracking(' + trackerId + ')">x</span></td>' +
        '<td id="closeTrackingCross"></td>' +
        '</tr>' +
        '<tr>' +
        '<td><span id="errorMsg' + trackerId + '"></td>' +
        '</tr>' +
        '<tr>' +
        '<td><select class="queueId" id="queueId' + trackerId + '">' +
        '</select></td>' +
        '<td colspan="2"><input type="checkbox" name="hideInactivez" onclick="hideInactives()" checked>' +
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
}

function getQueueApi(trackerId) {
    console.log("Tracker Id: " + trackerId);
    var companyId = document.getElementById("companyId" + trackerId).value;
    var errorSpan = document.getElementById("errorMsg" + trackerId);
    var expressions = "!`@#$%^&*()+=-[]\\\';,./{}|\":<>?~_";

    fetch('http://localhost:3000/company/queue?company_id=' + companyId)
        .then(response => { return response.json(); })
        .then(data => {
            if (data.length == 0) {
                errorSpan.innerText = "Unknown Company Id: " + companyId;
            }
            else if (companyId == "") {
                errorSpan.innerText = "Company Id cannot be empty";
            }
            else if (companyId > 9999999999) {
                errorSpan.innerText = "Company Id should be less than or equals to 999999999";
            }
            else if (companyId < 1000000000) {
                errorSpan.innerText = "Company Id should be more than or equals to 1000000000";
            }
            else if (companyId.includes(expressions)) {
                errorSpan.innerText = "Invalid Company Id";
            }
            else {
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
            if (error != null) {
                errorSpan.innerText = "Unable to establish connection with database";
            }
        });

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
