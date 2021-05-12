function startRead(useSavedFile = false) {
    // obtain input element through DOM
    var inputFileElem = document.getElementById('dataRecords');
    var file;

    if( useSavedFile ) {
        if(map_globals.data !== null && map_globals.data !== undefined) {
            // Convert it back into an Object
            let mydata = convertJSONtoObject(map_globals.data);
            // with proper file data formatted load markers
            LoadMarkers(mydata);
        } else {
            map_globals.data = null;
            map_globals.filename = null;
        }
    } else {
        file = inputFileElem.files[0];
        if( file !== undefined ) {
            let FNray = file.name.split("_",4);
            let filename = FNray[0] + ".." + FNray[FNray.length - 1]
            map_globals.filename = filename;
            getAsText(file);
        }
    }

    return;
}

function getAsText(readFile) {
    var reader = new FileReader();
    // Handle progress, success, and errors
    reader.onprogress = updateProgress;
    reader.onload = loaded;
    reader.onloadend = map_globals.wait4load;
    reader.onerror = errorHandler;
    // Read file into memory as UTF-16
    reader.readAsText(readFile, "UTF-8");
    //reader.readAsDataURL(readFile);
}
  
function updateProgress(ev) {
    if (ev.lengthComputable) {
        let progressbarElem = document.querySelector("progress#fileloading");
        // evt.loaded and evt.total are ProgressEvent properties
        var loaded = (ev.loaded / ev.total);
        progressbarElem.value = Math.round(loaded * 100);
        progressbarElem.innerHTML = ` ${progressbarElem.value}% `;
    }
}
  
function loaded(ev) {
    // get data read from the file in JSON string form
    map_globals.data = ev.target.result;
    // Convert it back into an Object
    let mydata = convertJSONtoObject(map_globals.data);
    // with proper file data formatted load markers
    LoadMarkers(mydata);
}

function convertJSONtoObject(stringJSON) {
//    try {
        // Obtain the read file data change it back into plain JSON
        let tmp = JSON.parse(stringJSON);
        // evaluate the string and convert it into an array of objects
        let mydata = eval( tmp ); // readonly files no text scrubbing required
        return mydata;
    // }
    // catch(e) {
    //     if (e instanceof SyntaxError) {
    //         alert(e.stack);
    //     }
    // }
}
  
function errorHandler(ev) {
    if(ev.target.error.name == "NotReadableError") {
      alert(ev.target.error.name);
    }
}