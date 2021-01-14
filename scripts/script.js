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
        '<td><input type="text" id="companyId'+trackerId+'" placeholder="Company Id"></td>' +
        '<td><input type="submit" id="search" value="Search"/></td>' +
        '<td><span class="cross" onclick="closeTracking(' + trackerId + ')">x</span></td>' +
        '<td id="closeTrackingCross"></td>' +
        '</tr>' +
        '<tr>' +
        '<td><span id="errorMsg'+trackerId+'"></td>' +
        '</tr>' +
        '<tr>' +
        '<td><select id="queueId">' +
        '</select></td>' +
        '<td colspan="2"><input type="checkbox" id="hideInactive" checked>' +
        '<label for="hideInactive">Hide Inactive</label></td>' +
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
    console.log(trackerId);
    var companyId= document.getElementById("companyId"+trackerId).value;
    var errorSpan=document.getElementById("errorMsg"+trackerId);

    fetch('http://localhost:3000/company/queue?company_id='+companyId)  
    .then(response => {return response.json();})
    .then(data=>{
        console.log(data);
        if(data.length==0){
            errorSpan.innerText="Unknown Company Id: "+companyId;
        }
        else if(companyId==""){
            errorSpan.innerText="Company Id cannot be empty";
        }
        else if(companyId>9999999999){
            errorSpan.innerText="Company Id should be less than or equals to 999999999";
        }
        else if(companyId<1000000000){
            errorSpan.innerText="Company Id should be more than or equals to 1000000000";
        }
    })
    .catch(error=>{
        console.log(error);
        if(error!=null){
            errorSpan.innerText="Unable to establish connection with database";
        }
    });
   
    // https://ades-fsp.github.io/get-queue
    // do this dylan
    // i will do the html side after u get all the data i need out ... all queues , queue status
    // get klanz data out also for graph ask klanz
    // do validation for the queue according to the example cher showed in video

}


  



//cy stuff to keep dont delete
    //draw bottom half box

    // if (!document.getElementById("bottomhalf" + trackerId)) {
    //     document.getElementById("tracker" + trackerId).innerHTML +=
    //         '<div class="bottomHalf" id="bottomhalf' + trackerId + '">' +
    //         'wahts up' +
    //         '</div>';
    // }