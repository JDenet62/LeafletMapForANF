"use strict"

/*===> define global vars <===*/
const Marker_global_vars = {
  SquareIcons: [],
  AssignedSqIcons: [],
  MarkerLayers: [],
  mySubGroup: null,
  myVisitsGroup: [],
  DataLoadList: [],
  TToffset: null,
  CC: new Array(),
  ZipCC: new Array(),
  ColorKeyAreaLookups: null,
  TextSymbolEncodeLookups: null,
  ColorKeyBodyLookups: null,
  ColorKeyCircleLookups: null
}

/*======== Define Custom Marker Icons ==========*/
for(let i=1; i <= 40; i++) {
  Marker_global_vars.SquareIcons.push(
    L.divIcon({
      className: 'custom-div-icon',
      html: '<div style="width:18px; height:22px;' +
                        'box-sizing:border-box;'+
                        'text-align:center;' + 
                        'background-color:gold;' +
                        'border:2px solid black;"' +
                  'class="marker-pin">' +
              `${i}</div>`,
      iconSize: [20, 24],
      iconAnchor: [9, 14],
      popupAnchor: [9,-5]
    })
  );
}

// let blueIcon = new L.Icon({
// 	iconUrl: '/images/marker-icon-blue.png',
// 	shadowUrl: '/images/marker-shadow.png',
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });

// let goldIcon = new L.Icon({
// 	iconUrl: '/images/marker-icon-gold.png',
// 	shadowUrl: '/images/marker-shadow.png',
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });

// let redIcon = new L.Icon({
// 	iconUrl: '/images/marker-icon-red.png',
// 	shadowUrl: '/images/marker-shadow.png',
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });

let greenIcon = new L.Icon({
	iconUrl: '/images/marker-icon-green.png',
	shadowUrl: '/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

// let orangeIcon = new L.Icon({
// 	iconUrl: '/images/marker-icon-orange.png',
// 	shadowUrl: '/images/marker-shadow.png',
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });

// let yellowIcon = new L.Icon({
// 	iconUrl: '/images/marker-icon-yellow.png',
// 	shadowUrl: '/images/marker-shadow.png',
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });

// let purpleIcon = new L.Icon({
// 	iconUrl: '/images/marker-icon-violet.png',
// 	shadowUrl: '/images/marker-shadow.png',
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });

// let greyIcon = new L.Icon({
// 	iconUrl: '/images/marker-icon-grey.png',
// 	shadowUrl: '/images/marker-shadow.png',
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });

// let blackIcon = new L.Icon({
// 	iconUrl: '/images/marker-icon-black.png',
// 	shadowUrl: '/images/marker-shadow.png',
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// let red1Icon = L.icon({ 
//   iconUrl: '/images/blankpin/redmapin.png',
//   iconSize: [38,25],
//   iconAnchor: [19,25],
//   popupAnchor: [0,-25]
// });

// let redpin1 = L.icon({ 
//   iconUrl: '/images/redpin1.png',
//   iconSize: [38,38],
//   iconAnchor: [19,38],
//   popupAnchor: [0,-38]
// });

// let redPushPin = L.icon({
//   iconUrl: '/images/blankpin/MapPushPin.png',
//   iconSize: [38,42],
//   iconAnchor: [19,42],
//   popupAnchor: [0,-42]
// });

let OLOFPin = L.icon( {
  iconUrl: '/images/OurLady.png',
  iconSize: [32,139],
  iconAnchor: [16,139],
  popupAnchor: [0,-139]
});

/**************************************************/
/* marker click handler for Route point data      */
/**************************************************/
function onClick(ev) {
  if (
    MutuallyExclusive.IconBoxBtn0_Active ||
    MutuallyExclusive.IconBoxBtn1_Active ||
    MutuallyExclusive.IconBoxBtn2_Active ||
    MutuallyExclusive.IconBoxBtn4_Active 
  ) { 
    ev.originalEvent.stopPropagation();
    /* Get the location where clicked and store it in a global array */
    const Markerclicked = {'lat': ev.latlng.lat,'lng': ev.latlng.lng};
      
    map_globals.MouseSelections.push(Markerclicked);
    /* Update the current Custom Control interface */
    ProcessMarkerSelected();
  }
}

/**************************************************/
/* Create an ICON Marker based on the information */
/* obtained from the spreadsheet in JSON format   */
/**************************************************/
function CreateMarker(  record, 
                        MarkerBody = "NoColor",
                        MarkerCircle = "white",
                        MarkerCircleRim = "DarkGray"
                        // GroupNo = ""
                     ) {
  // test that we have what we need
  if( !record.Latitude ||
      !record.Longitude ||
      record.Latitude === "" ||
      record.Longitude === ""
    ) { alert("missing latlong"); return; }

  // Use our Lady of Fatima's ICON to mark scheduled visits
  let thisIcon = (record.GroupLetter === "A1" || record.GroupLetter === "B1" || record.GroupLetter === "C1") ? OLOFPin : greenIcon;

  let WeekLoadColors = [
    '#1E90FF', '#0000FF', '#0000CD', '#00008B', //Blu
    '#00FF00', '#00C000', '#008000', '#006400', //Grn
    '#FF6347', '#FF0000', '#B22222', '#800000', //Red
    '#EE82EE', '#DA70D6', '#BA55D3', '#800080', //Vio
    '#FFCC00', '#FFA000', '#FF8C00', '#B8860B', //Org
    '#FAEBD7', '#FFE4C4', '#FFDEAD', '#D2B48C', //Tan 
    '#FFFF80', '#FFFE00', '#FFF800', '#F0E68C', //Yel
    '#D3D3D3', '#A9A9A9', '#808080', '#696969', //Gry
    '#FFF5F5', '#F0F0F0', '#F3F3FF', '#F5FFF5', //Wht
                       ];

  // GroupNo = (GroupNo === "") ? (record.GroupLetter.split('')[0]) : GroupNo;
  let getLoadNo = () => {
    let result = 0;
    Marker_global_vars.DataLoadList.forEach((v,i) => {
      if( v === record['realweek'] ) result = i; 
    });
    return result;
  };
  // let WeekLoadKeys  = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P','Q','R','S','T','U','V','W','X','Y','Z',
  //                      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; //Eugenia was upto 'c'
  let WeekLoadNo    = getLoadNo();

  let marker;
  if(thisIcon === OLOFPin || MarkerBody === "greenICON") {
    let TToffset = (thisIcon === OLOFPin) ? { offset: [0,-139], direction: 'top' } : { offset: [-1,-28], direction: 'top' };
    marker =  new L.Marker({lat: record.Latitude, lng: record.Longitude}, { icon: thisIcon } )
                    /*=== below event is to capture marker locations when clicked === */
                    .on('click', onClick)
                    /*=== below event is a fix to stop popup when    === */
                    /*=== selecting markers for Routes or ISOChrones === */
                    .on('popupopen', CheckIfPopupAllowed)
                    /*=== below 2-events are a leaflet bugfix when removing then  === */
                    /*=== adding back those same markers(i.e.popups stop working) === */
                    .on('popupclose', function () {
                          if (marker._icon) {
                              marker.setOpacity(1);
                          }
                          marker.off('popupclose');
                        })
                    .on('remove', function () {
                          marker.off('popupclose');
                        })
                    .bindTooltip(record.Name, TToffset)
                    .bindPopup(`<u><span style="font-weight:800;">${record.Name}</span></u><br>
                                  ${record.Address1}<br>
                                  ${record["City"]}, ${record.State} ${record.ZIP}<br>
                                  ${record["County"]} County<br>
                                  Ph: ${record.Callout2}<br>`);
  } else {
    let TToffset = { offset: [-1,-28], direction: 'top' };
    if(MarkerBody === "NoColor") MarkerBody = WeekLoadColors[WeekLoadNo];

    if(MarkerCircleRim === "") MarkerCircleRim = MarkerCircle;
    let FontColor = (isHex(MarkerCircle) === false) ? colorNameToHexVal(MarkerCircle) : MarkerCircle;
    FontColor = pickTextColorBasedOnBgColorAdvanced(FontColor, "white", "black");
    marker = new L.Marker.SVGMarker({lat: record.Latitude, lng: record.Longitude}, {
                      iconOptions: {
                        color: 'black',
                        fillColor: MarkerBody,
                        fillOpacity: 1,
                        circleFillColor: MarkerCircle,
                        circleColor: MarkerCircleRim,
                        circleText: WeekLoadNo + 1,
                        fontColor: FontColor
                      }
                    })
                    /*=== below event is to capture marker locations when clicked === */
                    .on('click', onClick)
                    /*=== below event is a fix to stop popup when    === */
                    /*=== selecting markers for Routes or ISOChrones === */
                    .on('popupopen', CheckIfPopupAllowed)
                    /*=== below 2-events are a leaflet bugfix when removing then  === */
                    /*=== adding back those same markers(i.e.popups stop working) === */
                    .on('popupclose', function () {
                        if (marker._icon) {
                            marker.setOpacity(1);
                        }
                        marker.off('popupclose');
                    })
                    .on('remove', function () {
                        marker.off('popupclose');
                    })
                    .bindTooltip(record.Name, TToffset)
                    .bindPopup(`<u><span style="font-weight:800;">${record.Name}</span></u><br>
                                  ${record.Address1}<br>
                                  ${record["City"]}, ${record.State} ${record.ZIP}<br>
                                  ${record["County"]} County<br>
                                  Ph: ${record.Callout2}<br>`);
  }
  /*===> make sure blue Markers are on top of other Markers <===*/
  if (thisIcon === OLOFPin) {
    marker.setZIndexOffset(9900);
//    marker._popup._content += `ID: ${marker._leaflet_id}`;
  }
  if (thisIcon === greenIcon) {
    marker.setZIndexOffset(9950);
  }

  Marker_global_vars.MarkerLayers.push(marker);
}

/**************************************************/
/* Function to load All Markers from data given   */
/**************************************************/
function LoadMarkers(data) {
  /*=== define Vars used ===*/
  let clrindex = 0,
      CountySetting = "",
      ZipcodeSetting = "",
      RecordState = "";

  /*=== Remove all previous markers to make room for the new ===*/
  DeleteAllMarkers();

  /*=== Create a single list of all Counties and Zipcodes without duplicates ===*/
  const CountySet = new Set();
  const ZipcodeSet = new Set();
  const RecLoadSet = new Set();

  // populate SETS with data
  data.forEach(record => { 
    RecordState = LookupFullStateName(record.State);
    if(RecordState == map_globals.state) {
       CountySet.add(record.County); 
       ZipcodeSet.add(record.ZIP); 
       RecLoadSet.add(record.realweek);
    } 
  });  
  
  /*=== Convert List Sets into JSArrays. ===*/
  const Countylist = Array.from(CountySet).sort(); 
  const Zipcodelist = Array.from(ZipcodeSet).sort();
  Marker_global_vars.DataLoadList = Array.from(RecLoadSet).sort((a,b) => {
    let yearA = parseInt( a.substring(0,4) );
    let yearB = parseInt( b.substring(0,4) );
    let weekNoA = parseInt( a.substring(a.length-2, a.length) );
    let weekNoB = parseInt( b.substring(b.length-2, b.length) );
    if(yearA === yearB) return weekNoA - weekNoB;
    return yearA - yearB;
  });
  console.log(`RecLoadSet ${Marker_global_vars.DataLoadList}`);

  /*=== Assign an associated Color for each County ===*/
  Countylist.forEach(Countyname => { // for each county name
    if(Countyname.length > 0 && Countyname != "") {
      if( clrindex > (HighContrast.length-1) ) clrindex = 0; // circle around if ranout
      let color = HighContrast[clrindex++];
      Marker_global_vars.CC.push({ "County": `${Countyname}`, "Color": `${color}`, "State": `${RecordState}` });
    }
  });

  /*=== Assign an associated Color for each Zipcode ===*/
  clrindex = 0; // reset var for use
  Zipcodelist.forEach( ZipNum => { // for each Zip Code
    let color = HighContrast[clrindex++]; // grab a new color
    if(clrindex >= HighContrast.length - 1) clrindex = 0; // circle around if ranout
    // create an array of objects associating a zipcode with a color
    Marker_global_vars.ZipCC.push({ "Zip": `${ZipNum}`, "Color": `${color}` });
  });

  /*=== Fetch County & Zipcode display Setting Options ===*/
  CountySetting = GetCountySettings();
  ZipcodeSetting = GetZipcodeSettings();

  /*===> Parse through each Record and Create a Map Marker <===*/
  data.forEach(record => {
    if(record.Latitude !== null && record.Longitude !== null) { // if has a Map location
      // Lookup matching County for the Color to use
      const County = Marker_global_vars.CC.filter((item, index, arr) => (record.County.localeCompare(item.County) === 0) ? true : false);
      // Lookup matching Zipcode for the Color to use
      const Zip = Marker_global_vars.ZipCC.filter((item, index, arr) => (record.ZIP.toString().localeCompare(item.Zip) === 0) ? true : false);
      /*=== Fetch County & Zipcode display Setting Options ===*/
      CountySetting = GetCountySettings();
      ZipcodeSetting = GetZipcodeSettings();
      // Create the Marker based upon the Record and Associated Colors to use
      if ( CountySetting === "BHTN" && ZipcodeSetting ==="BHTN" ) 
        CreateMarker(record);
      else {
        let body = "", circle = "";
        if(County.length === 1) {
          body = (CountySetting === "CCMB") ? County[0].Color : "red";
          circle = (CountySetting === "CCMC") ? County[0].Color : "white";
        }
        if(Zip.length === 1) {
          body = (ZipcodeSetting === "CCMB" && CountySetting !== "CCMB") ? Zip[0].Color : body;
          circle = (ZipcodeSetting === "CCMC" && CountySetting !== "CCMC") ? Zip[0].Color : circle;
        }
        if (CountySetting === "CCMB" && ZipcodeSetting === "CCMB") ResetZipcodeDisplaySettings();
        if (CountySetting === "CCMC" && ZipcodeSetting === "CCMC") ResetZipcodeDisplaySettings();

        CreateMarker(record, colorNameToHexVal(body), colorNameToHexVal(circle));
      } 

    } //else console.log(`error no latitude or longitude for ${record.Name}`);
  });

  /*=== Separate and all scheduled visits into its own array ===*/
  //Push and copy the visit markers into it's own array. by use of filtering the main array.
  let mindex = 0;
  while(mindex < Marker_global_vars.MarkerLayers.length) {
      
    let marker = Marker_global_vars.MarkerLayers[mindex];

    if (marker.options.zIndexOffset === 9900) {
      marker.options.type = "visit";
      Marker_global_vars.myVisitsGroup.push(marker);
      Marker_global_vars.MarkerLayers.splice(mindex,1);
    }
    else 
      mindex++;
  }
  /*=== Slower Alternative way ===*/
  // Marker_global_vars.myVisitsGroup.push( ...Marker_global_vars.MarkerLayers.filter((marker) => { 
  //   marker.options.type = "visit";
  //   return ( marker.options.zIndexOffset === 9900 ) ? true : false; 
  // }));
  // // Remove the visits from the main array (NOTE: This didn't work when combined with the above filtering i.e. indexing problems). 
  // Marker_global_vars.MarkerLayers = [ ...Marker_global_vars.MarkerLayers.filter((marker) => ( marker.options.zIndexOffset === 9900 ) ? false : true) ];

  /*===> Create cluster control & Marker groups below <===*/
  const ClusterGroupOptions = { 
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: false,
    removeOutsideVisibleBounds: true,
    maxClusterRadius: 70,
    chunkedLoading: true,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 17
  };
  map_globals.markers = L.markerClusterGroup(ClusterGroupOptions); //create cluster control parent.
  Marker_global_vars.mySubGroup = L.featureGroup.subGroup(map_globals.markers, Marker_global_vars.MarkerLayers); // markers are a subgroup of the parent
  CustomElementSelector.IconBoxBtn4.MarkerLayerGroup = map_globals.markers; //retain for later
  map_globals.markers.addTo(map_globals.map);// Add Cluster Control to the Map
  Marker_global_vars.mySubGroup.addTo(map_globals.map); //Add Marker Subgroup to the map

  /* ===> Create Color Charts for specific Visual Display Options <===*/
  if ( CountySetting === "CCSA" || ZipcodeSetting === "CCSA" ) {
    let collection, type;
    if( CountySetting === 'CCSA' ) {
      type = "County";
      collection = Marker_global_vars.CC;
    }
    else if( ZipcodeSetting === 'CCSA' ) {
      type = "Zipcode";
      collection = Marker_global_vars.ZipCC;
    }
    CreateAreaColorChart(collection, type);
  }
  
  if ( CountySetting === "CCMB" || ZipcodeSetting === "CCMB" ) {
    let collection, type;
    if( CountySetting === 'CCMB' ) {
      type = "County";
      collection = Marker_global_vars.CC;
    }
    else if( ZipcodeSetting === 'CCMB' ) {
      type = "Zipcode";
      collection = Marker_global_vars.ZipCC;
    }
    CreateMarkerBodyChart(collection, type);
  }

  if ( CountySetting === "CCMC" || ZipcodeSetting === "CCMC" ) {
    let collection, type;
    if( CountySetting === 'CCMC' ) {
      type = "County";
      collection = Marker_global_vars.CC;
    }
    else if( ZipcodeSetting === 'CCMC' ) {
      type = "Zipcode";
      collection = Marker_global_vars.ZipCC;
    }
    CreateMarkerCircleChart(collection, type);
  }
}

/*****************************************************/
/* Support Functions (i.e. Layer Ctrl) functionality */
/*****************************************************/
function DeleteAllMarkers() {
  map_globals.map.removeLayer(map_globals.markers);
  Marker_global_vars.myVisitsGroup.forEach(marker => {
    map_globals.map.removeLayer(marker);   
  });
  map_globals.map.removeLayer(Marker_global_vars.myVisitsGroup);
  Marker_global_vars.MarkerLayers.length = 0;
}

function DeleteAllVisits() {
  let VisitLayers = Marker_global_vars.myVisitsGroup;
  GEOToggle_Layer(VisitLayers, false); // remove all Routes from the map

  while( VisitLayers.length > 0 ) { // assumes RegionShapes and GJSONShapes are succinct.
    let layer = VisitLayers[0];
    let index = layer.options.LayerIndex;
    DeleteVisit(index);     // delete current layer from both Arrays and store it.
  };

  Marker_global_vars.myVisitsGroup = [];
}

function DeleteVisit(index) {
  const VisitLayers = Marker_global_vars.myVisitsGroup;
  const visit = VisitLayers[index];
  const data = convertJSONtoObject(map_globals.data);
  data.forEach(record => { return (record.Latitude === visit._latlng.lat && record.Longitude === visit._latlng.lng ) ? false : true; });
  map_globals.data = JSON.stringify(data);
  VisitLayers.splice(index, 1);
}

function GetCountySettings() { 
  const rbs = document.querySelectorAll('input[name="group1"]');
  for (const rb of rbs) {
      if (rb.checked) {
        Marker_global_vars.CountySettings = rb.value;
        break;
      }
  } 
  return map_globals.CountySettings;
}

function GetZipcodeSettings() {
  const rbs = document.querySelectorAll('input[name="group2"]');
  for (const rb of rbs) {
      if (rb.checked) {
        Marker_global_vars.ZipcodeSettings = rb.value;
        break;
      }
  }
  return map_globals.ZipcodeSettings;
}

function CheckIfPopupAllowed(ev) {
  if (
    MutuallyExclusive.IconBoxBtn1_Active ||
    MutuallyExclusive.IconBoxBtn2_Active ||
    MutuallyExclusive.IconBoxBtn4_Active 
  ) { 
    map_globals.map.closePopup();
  }
}

function isHex(h) {
  if(h.trim().split('')[0] === '#') return true;
  else return false;
}
