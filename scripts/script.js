trackerId = 1;

function addTracking() {
    document.getElementById("addTracking").remove();
    document.getElementById("grid-container").innerHTML +=
        '<div class="grid-item tracking" id="tracker' + trackerId+ '">' +
        '<table class="tableAlign">' +
        '<form action="#" onsubmit="getQueueApi();return false">' +
        '<tr>' +
        '<td><input type="text" id="companyId" placeholder="Company Id"></td>' +
        '<td><input type="submit" id="search" value="Search"></td>'+
        '<td><span class="cross" onclick="closeTracking(' + trackerId + ')">x</span></td>' +
        '<td id="closeTrackingCross"></td>' +
        '</tr>' +
        '<tr>' +
        '<td><select id="queueId">' +
        '</select></td>' +
        '<td colspan="2"><input type="checkbox" id="hideInactive" checked>' +
        '<label for="hideInactive">Hide Inactive</label></td>' +
        '</tr>' +
        '</form>' +
        '</table>' +
        '</div>';
    document.getElementById("grid-container").innerHTML +=
        '<div class="grid-item" id="addTracking" onclick=addTracking()>' +
        '<span class="circle plus"></span><a class="addAnotherText">Add another</a>' +
        '</div>';
    trackerId++;
}

function closeTracking(trackerId) {
    document.getElementById("tracker" + trackerId).remove();
}

function getQueueApi() {
    // https://ades-fsp.github.io/get-queue
}