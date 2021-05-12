// console = console || {};
// console.log = function(){};

var HomeEnv = true;

/***************************/
/* Setup Modal Menu setup  */
/***************************/
  
  async function SetupModalMenu() {
    console.log("Function SetupModalMenu()");
    return getMapSetupParameters().then(function(result) {
      if(result) {
        // under CreateMap() map_globals.map.spin(true) gets set;
        console.log("\t** Attach Modal menu Event listeners");
        // setup click listener for modal [X] for closing menu
        var closeX = document.querySelector("span.end");
        closeX.onclick = ClickHandlerToggleModal;
        // setup keystroke listener for ESC key
        document.addEventListener('keyup', KeyToggleModal);
        // initialize toggle switches for right click Content menu
        console.log("\t** Intializing Content Menu Toggle Switches");
        Initial_ToggleSwitches_Settings();
        // // initialize state, county, zipcode border outlines
        console.log("\t** Intializing Map Borders");
        InitializeMapBorders();
        // Center the map on the state read
        map_globals.map.dragging.enable();
        // Restore Location & Zoom Level
        let done = map_globals.map.restoreView();
        if( !done ) CenterOnState(map_globals.state); // Fallback: center map on current State
        // Stop Spin.
        setTimeout(() => { map_globals.map.spin(false); }, 500);
      }
      return result;
    });
  }
  
/**************************************/
/* Function setup the basic map view  */
/**************************************/
  
  function CreateMap() {
    /*=================== Create the Base MAP ==================*/

        /*===> Define map Options <=== */
        const mapOptions = { 
            center: 11,
            zoomControl: false,
            zoomSnap: 0.25,
            doubleClickZoom: false,
            contextmenu: true,
            contextmenuInheritItems: true,
            contextmenuWidth: 180,
            contextmenuItems: [{
                text: 'Show coordinates',
                index: 0,
                callback: showCoordinates
              }, {
                text: 'Center map here',
                index: 1,
                callback: centerMap
              }, '-', {
                text: 'State outlines ON',
                index: 3,
                callback: Toggle_State_Layer
              }, {
                text: 'County outlines ON',
                index: 4,
                callback: Toggle_County_Layer
              }, {
                text: 'Zipcode outlines OFF',
                index: 5,
                callback: Toggle_Zipcode_Layer,
              }, '-', {
                text: 'Route Direction OFF',
                index: 6,
                callback: Toggle_BypassRouteInstructions
              }, {
                  text: 'Show Route Panel',
                  index: 8,
                  callback: ShowDirectionsSidebar
              }, '-', {
                  text: 'Color Chart MBody',
                  index: 10,
                  callback: ShowColorChartMBody,
              }, {
                text: 'Color Chart MCircle',
                index: 11,
                callback: ShowColorChartMCircle,
              }, {
                text: 'Color Chart Areafill',
                index: 12,
                callback: ShowColorChartArea,
              }]
        };
        /*===> Map ID(div) and initial Map Location & inital Zoom level */
        map_globals.map = L.map('mapid', mapOptions).setView([ map_globals.map_center.lat, map_globals.map_center.lng ], 5);

        /*===> Create attributions for map use <===*/
        const attributions = '&copy Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a>' +
        '\| &copy OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM</a>' +
        'Contributers';

        /*===> Contruct and setup TileLayer server Options <===*/
        const tileLayerOptions = {
          attribution: attributions, 
          detectRetina: true,
          maxZoom: 18,
          minZoom: 2,
          enableHighAccuracy: true,
          timout: 10000
        };

        /*===> Create Tile Server URL vars <===*/
        let InternalStreetsMap;
        if( HomeEnv ) 
              InternalStreetsMap = L.tileLayer('http://localhost:9876/styles/osm-bright/{z}/{x}/{y}.png', tileLayerOptions); //for development
        else 
              InternalStreetsMap = L.tileLayer('http://192.168.3.15:9876/styles/osm-bright/{z}/{x}/{y}.png', tileLayerOptions); //actual
        const ExternalStreetsMap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', tileLayerOptions);
        const    ExternalTopoMap = L.tileLayer('http://{s}.opentopomap.org/{z}/{x}/{y}.png', tileLayerOptions);       
        /*===> Create an array of TileLayer service Choice vars from above <===*/
        map_globals.BaseLayerGroup = BaseLayerGroup = [ InternalStreetsMap, ExternalStreetsMap, ExternalTopoMap ];
        /*===> Add the initial tileLayer to the Map <=== */
        BaseLayerGroup[0].addTo(map_globals.map);

    /*=================== Base Map has been Created ==================*/

    /*===> Basemap is created, show busy and disable map movement */
    map_globals.map.spin(true);
    map_globals.map.dragging.disable();

    /*===> initialize item selections of right click context menu <===*/
    map_globals.map.contextmenu.setDisabled('5', true);
    map_globals.map.contextmenu.setDisabled('10', true);
    map_globals.map.contextmenu.setDisabled('11', true);
    map_globals.map.contextmenu.setDisabled('12', true);
  }

/*****************************************/
/* Function setup sidebar plugin control */
/*****************************************/
  
  function Setup_Sidebar_Plugin() {
    var sidebar = L.control.sidebar('sidebar', { position: 'left' });
    map_globals.map.addControl(sidebar);
    CustomElementSelector.Sidebar = sidebar;
  } 

/********************************/
/* Function setup scale control */
/********************************/
  
  function Setup_MapScale_Control() {
    let scale = L.control.scale({ metric: false });
    scale.addTo(map_globals.map);             // Add Scale control

    map_globals.map.addControl(new scaleTitle);           // Add text map SCALE'
  }

/***************************************/
/* Function setup custom Icon controls */
/***************************************/
  
  function Setup_CustomControls() {
      map_globals.map.addControl(new IconBoxBtnSpacer());   // Dummy spacer from Top of Screen;
      map_globals.map.addControl(new IconBoxBtn5Control()); // Search Control
      map_globals.map.addControl(new IconBoxBtn0Control()); // Color Select Control
      map_globals.map.addControl(new IconBoxBtn1Control()); // Route Select Controls
      map_globals.map.addControl(new IconBoxBtn2Control()); // Drvmap Select Controls
      map_globals.map.addControl(new IconBoxBtn7Control()); // Search Memory List
      map_globals.map.addControl(new IconBoxBtn3Control()); // Enable/diable Leaflet.Draw Tools control
      map_globals.map.addControl(new IconBoxBtn4Control()); // Layer Controls
      map_globals.map.addControl(new IconBoxBtn6Control()); // Saving Control

      // setup Storm Radar image player 
      map_globals.map.addControl(L.control.rainviewer({ 
          position: 'bottomleft',
          nextButtonText: '>',
          playStopButtonText: 'Play/Stop',
          prevButtonText: '<',
          positionSliderLabelText: "Hour:",
          opacitySliderLabelText: "Opacity:",
          animationInterval: 500,
          opacity: 0.5
      }));

    /*===> Setup MapQuest Layers but limit to 15,000 acquires <===*/
      // var mapLayer = MQ.mapLayer();
      // L.control.layers({
      //   'Map': mapLayer,
      //   'Hybrid': MQ.hybridLayer(),
      //   'Satellite': MQ.satelliteLayer(),
      //   'Dark': MQ.darkLayer(),
      //   'Light': MQ.lightLayer()
      // }).addTo(map_globals.map);

      // MQ.trafficLayer().addTo(map_globals.map);
  }

/*******************************************/
/* Functions supporting mouse context menu */
/*******************************************/
  
  function showCoordinates (e) {
    alert(e.latlng);
  }

  function centerMap (e) {
    map_globals.map.panTo(e.latlng);
  }

  function Toggle_State_Layer () {
    let switches = map_globals.switches;
    let States_toggleState = (map_globals.map.hasLayer( map_globals.US_States_Boundaries[0]) ? false : true);
    let GeoJson_Layer = map_globals.US_States_Boundaries[0];
    let Status = "State outlines " + ((States_toggleState) ? "ON" : "OFF");

    switches[0].children[0].innerHTML = Status;
    
    Toggle_Layer(GeoJson_Layer, States_toggleState);
    setTimeout(ToggleSwitch_ON_OFF(switches[0].children, States_toggleState), 380);
    
  }

  function Toggle_County_Layer () {
    let switches = map_globals.switches;
    let County_toggleState = (map_globals.map.hasLayer( map_globals.US_County_Boundaries[0] ) ? false : true);
    let Status = "County outlines " + ((County_toggleState) ? "ON" : "OFF");
    let GeoJson_Layer = map_globals.US_County_Boundaries[0];

    switches[1].children[0].innerHTML = Status;

    Toggle_Layer(GeoJson_Layer, County_toggleState);
    setTimeout(ToggleSwitch_ON_OFF(switches[1].children, County_toggleState), 380);
  }

  function Toggle_Zipcode_Layer () {
    let switches = map_globals.switches;
    let Zipcode_ToggleState = (map_globals.map.hasLayer( map_globals.US_Zipcode_Boundaries[0] ) ? false : true);
    let Status = "Zipcode outlines " + ((Zipcode_ToggleState) ? "ON" : "OFF");
    let GeoJson_Layer = map_globals.US_Zipcode_Boundaries[0];
    let AllLabels = document.querySelectorAll(".leaflet-label");
    
    switches[2].children[0].innerHTML = Status;

    Toggle_Layer(GeoJson_Layer, Zipcode_ToggleState);
    setTimeout(ToggleSwitch_ON_OFF(switches[2].children, Zipcode_ToggleState), 380);
    
    if(Zipcode_ToggleState)
      AllLabels.forEach( label => label.style.display = "block" );
    else 
      AllLabels.forEach( label => label.style.display = "none" );
  }

  function Toggle_BypassRouteInstructions(e) {
    let switches = map_globals.switches;
    let Status = 'Route Direction '+((map_globals.BypassRouteInstructions) ? "ON" : "OFF");
    map_globals.BypassRouteInstructions = !map_globals.BypassRouteInstructions;

    switches[3].children[0].innerHTML = Status;

    if(!map_globals.BypassRouteInstructions) 
      setTimeout(ToggleSwitch_ON_OFF(switches[3].children, true), 380);
    else
      setTimeout(ToggleSwitch_ON_OFF(switches[3].children, false), 380);
  }

  function ShowDirectionsSidebar(e) {
    const sidebar = CustomElementSelector.Sidebar;
    if(sidebar !== undefined && RouteLayers.length > 0) sidebar.show();
  }

  function CreateMarkerBodyChart(collection, type) {
    let sectionText = "";
    let MarkerOutline = SVGMarkerOutline();
    let circle = SVGMarkerCircle();
    
    sectionText += '<div style="display: flex; width: 400px; height:40px;">' +
                  `<p style="vertical-align: basleine; padding-left:10px; width: 70%;"> <b>${type}</b> </p>` + 
                   '<p style="vertical-align: top; padding: 0px;">' +
                      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' + MarkerOutline + circle + '</svg>' +
                   '</p></div>';

    sectionText +=  '<p>____________________________________________________</p><br>';

    collection.forEach(item => {

      if( (type === 'County') ? item.County.length > 0 : item.Zip.length > 0 ) {
        MarkerOutline = SVGMarkerOutline(item.Color);
        let section_type = (type === 'County') ? 
        `<p style="vertical-align: basleine; padding-left:10px; width: 70%;"> <em>${item.County}</em> </p>` :
        `<p style="vertical-align: basleine; width: 70%;"> <em>${item.Zip}</em> </p>`;       
        sectionText += '<div style="display: flex; width: 400px; height: 40px;">' +
                        section_type +
                      '<p style="vertical-align: top; padding: 0px;">' +
                          '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' + MarkerOutline + circle + '</svg>' + 
                      '</p></div>';
      }
    });

    Marker_global_vars.ColorKeyBodyLookups = sectionText;
    map_globals.map.contextmenu.setDisabled(10, false);
  }

  function CreateMarkerCircleChart(collection, type) {
    let sectionText = "";
    let MarkerOutline = SVGMarkerOutline("transparent");
    let circle = SVGMarkerCircle("red");
    
    sectionText += '<div style="display: flex; width: 400px; height: 40px;">' +
                   `<p style="vertical-align: basleine; padding-left:10px; width: 70%;"> <b>${type}</b> </p>` + 
                   '<p style="vertical-align: top; padding: 0px;">' +
                      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' + MarkerOutline + circle + '</svg>' +
                   '</p></div>';

    sectionText +=  '<p>____________________________________________________</p><br>';

    collection.forEach(item => {
      if( (type === 'County') ? item.County.length > 0 : item.Zip.length > 0 ) {
        circle = SVGMarkerCircle(item.Color);
        let section_type = (type === 'County') ? 
        `<p style="vertical-align: basleine; padding-left:10px; width: 70%;"> <em>${item.County}</em> </p>` :
        `<p style="vertical-align: basleine; width: 70%;"> <em>${item.Zip}</em> </p>`;
        sectionText += '<div style="margin-bottom: 10px;display: flex; width: 400px; height: 40px;">' +
                        section_type +
                      '<p style="margin: auto; vertical-align: top; padding: 0px;">' +
                          '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' + MarkerOutline + circle + '</svg></p>' +
                      `</div>`;
      }
    });

    Marker_global_vars.ColorKeyCircleLookups = sectionText;
    map_globals.map.contextmenu.setDisabled(11, false);
  }

  function CreateAreaColorChart(collection, type) {
    let sectionText = "";
    
    sectionText += '<div style="display: flex; width: 400px; height:40px;">' +
                  `<p style="vertical-align: basleine; padding-left:10px; width: 70%;"> <b>${type} Area Fill Color ===></b> </p>` + 
                   '<p style="vertical-align: top; padding: 0px;">' +
                      '<div style="width: 60px; height: 20px; margin-right:40px; background-color: red; opacity: 0.5;"></div>' +
                   '</p></div>';

    sectionText +=  '<p>____________________________________________________</p><br>';

    collection.forEach(item => {
      if( (type === 'County') ? item.County.length > 0 : item.Zip.length > 0 ) {
        MarkerOutline = SVGMarkerOutline(item.Color);
        let section_type = (type === 'County') ? 
        `<p style="vertical-align: basleine; padding-left:10px; width: 70%;"> <em>${item.County}</em> </p>` :
        `<p style="vertical-align: basleine; width: 70%;"> <em>${item.Zip}</em> </p>`;       
        sectionText += '<div style="display: flex; width: 400px; height: 40px;">' +
                        section_type +
                      '<p style="vertical-align: top; padding: 0px;">' +
                        `<div style="width: 60px; height: 20px; margin-right:40px; background-color: ${item.Color}; opacity: 0.5;"></div>` +
                      '</p></div>';
      }
    });

    Marker_global_vars.ColorKeyAreaLookups = sectionText;
    map_globals.map.contextmenu.setDisabled(12, false);
  }

  function ShowSquareIconList() {
    // CustomElementSelector.Sidebar.setContent(sectionText);
    // CustomElementSelector.Sidebar.show();
  }

  function ShowColorChartArea() {
    let sectionText = Marker_global_vars.ColorKeyAreaLookups;
    CustomElementSelector.Sidebar.setContent(sectionText);
    CustomElementSelector.Sidebar.show();
  }

  function ShowColorChartMBody() {
    let sectionText = Marker_global_vars.ColorKeyBodyLookups;
    CustomElementSelector.Sidebar.setContent(sectionText);
    CustomElementSelector.Sidebar.show();
  }

  function ShowColorChartMCircle() {
    let sectionText = Marker_global_vars.ColorKeyCircleLookups;
    CustomElementSelector.Sidebar.setContent(sectionText);
    CustomElementSelector.Sidebar.show();
  }

  function SVGMarkerOutline(CountyColor = "red") {
    var height = 32;
    var width = 24;
    var weight = 1;
    var margin = weight / 2;

    var startPoint = "M " + margin + " " + (width/2) + " "
    var leftLine = "L " + (width/2) + " " + (height - weight) + " "
    var rightLine = "L " + (width - margin) + " " + (width/2) + " "
    var arc = "A " + (width/4) + " " + (width/4) + " 0 0 0 " + margin + " " + (width/2) + " Z"

    var d = startPoint + leftLine + rightLine + arc

    var strokeWidth = 1;
    var stroke = "blue";
    var strokeOpacity = 1;
    var fill = CountyColor;
    var fillOpacity = 0.5;
    var className = "svg-icon" + "-path";

    var path = '<path class="'  + className + '" d="' + d +
        '" stroke-width="' + strokeWidth + '" stroke="' + stroke + '" stroke-opacity="' + strokeOpacity +
        '" fill="' + fill + '" fill-opacity="' + fillOpacity + '"/>';

    return path;
  }

  function SVGMarkerCircle(CirColor = "white", StrokeColor = "white") {
    var cx = 12;
    var cy = 10;
    var radius = 24 * 0.25;
    var fill = CirColor;
    var fillOpacity = 0.5;
    var stroke = StrokeColor;
    var strokeOpacity = 1;
    var strokeWidth = 1;
    var className = "svg-icon" + "-circle";
   
    var circle = '<circle class="' + className + '" cx="' + cx + '" cy="' + cy + '" r="' + radius +
        '" fill="' + fill + '" fill-opacity="'+ fillOpacity + 
        '" stroke="' + stroke + '" stroke-opacity=' + strokeOpacity + '" stroke-width="' + strokeWidth + '"/>';
    
    return circle;
  }

  function ToggleSwitch_ON_OFF(SwElems, checked) {
    var span = SwElems[2];
    let innerspan = span.children[0];

    SwElems[1].checked = checked;

    if(checked == true) { //Toggle ON
      if(span.classList.contains('switch-off')) {
        span.classList.remove('switch-off');
        span.classList.add('switch-on');
      }
      span.style.boxShadow = "rgb(100, 189, 99) 0px 0px 0px 11.1111px inset";
      span.style.border = "1px solid rgb(100, 189, 99)";
      span.style.backgroundColor = "rgb(100, 189, 99)";
      innerspan.style.left = "14px";
      innerspan.innerHTML = "on";
    }
    else { // Toggle OFF
      if(span.classList.contains('switch-on')) {
        span.classList.remove('switch-on');
        span.classList.add('switch-off');
      }
      span.style.boxShadow = "rgb(255, 255, 255) 0px 0px 0px 0px inset";
      span.style.border = "1px solid rgb(223, 223, 223)";
      span.style.backgroundColor = "rgb(255, 255, 255)";
      innerspan.style.left = 0;
      innerspan.innerHTML = "off";
    }
  }

  function Initial_ToggleSwitches_Settings() {
    let switches = map_globals.switches,
        settings = [true, true, false, false];
    for(let i=0; i < switches.length-1; i++) {
      setTimeout( ToggleSwitch_ON_OFF(switches[i].children, settings[i]), 380 );
    }

    map_globals.map.contextmenu.setDisabled('5', true);
  }

/*====================================================*/                                          
/* Functions dealing with switching the layers ON/OFF */
/*====================================================*/                                          
  
  function Toggle_Layer(LayerGroup, checked) {
    const layers = LayerGroup._layers;
    if (checked) {
      for(let i in layers) {
        let layer = layers[i];
        AddRemoveLayer(layer, checked); //add layer
        if( LayerGroup !== map_globals.ShapesLayerGroup ) AddRemoveLayer(LayerGroup, checked);
      }      
    } else {
      for(let i in layers) {
        let layer = layers[i];
        AddRemoveLayer(layer, checked); //remove layer
        if( LayerGroup !== map_globals.ShapesLayerGroup ) AddRemoveLayer(LayerGroup, checked);
      }      
    }
  }

  function GEOToggle_Layer(LayerGroup, checked) {
    LayerGroup.forEach(item => {
        AddRemoveLayer(item, checked)
    });
  }

  function AddRemoveLayer(item, checked) {
    if (checked)
      map_globals.map.addLayer(item);
    else 
      map_globals.map.removeLayer(item);
  }

/*===========================================================*/                                          
/* Events Handlers for Modal Setup Menu & associated buttons */
/*===========================================================*/  

  // Event Handler for Keypress Modal menu 
  function KeyToggleModal(e) {
    if(e.key === "Escape")
      ClickHandlerToggleModal(e);
  }

  // Event Handler to Toggle Modal menu 
  function ClickHandlerToggleModal(e) {
    var popup = document.getElementById('myModal');
    if(popup.style.display === "none") {
      populate_state_selections();
      popup.style.display = "block";
    } else
      popup.style.display = "none";
  }

  // Event Handler for [ Setup ] button click slide1
  function ClickHandler4SetupPage() {
    ResetProgressBarSlide2();
    FromSlide1ToSlide2();
  }

  // Event Handler for [ Save ] button click slide2
  async function ClickHandler4SetupSave() {
    /* obtain values from Setup page slide1 */
    map_globals.map.spin(true);
    /* setup to register when file is done loading */
    let result = "NoFileChoosen";
    map_globals.wait4load = (ev) => {
      if(ev.type === "loadend")
        result = ev.type;
      if(ev.target.error !== null)
        result = ev.error;
    };
    startRead(false); // select a file
    setTimeout(async () => {
      if(result === "loadend" || result === "NoFileChoosen") {     
        let team_select = document.querySelector("#team_select").value;
        let sched_select = document.querySelector("#sched_select").value;
        let state_select = document.querySelector("#state_select").value;

        map_globals.team = team_select
        map_globals.sched = sched_select;
        map_globals.state = state_select;

        /*===> writeout values to PouchDB <=== */
        let db;
        const docName = await getNetworkIP();
        db = new PouchDB(`${docName}`, { skip_setup: true });

        await db.get("team").then(async (doc) => {
          doc.value = team_select;
          await db.put(doc).then(res => {
            console.log(res.id + ' ok:' + res.ok);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));

        await db.get("sched").then(async (doc) => {
          doc.value = sched_select;
          await db.put(doc).then(res => {
            console.log(res.id + ' ok:' + res.ok);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
          
        await db.get("state").then(async (doc) => {
          doc.value = state_select;
          await db.put(doc).then(res => {
            console.log(res.id + ' ok:' + res.ok);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));

        await db.get("mapcenter").then(async (doc) => {
          doc.value = map_globals.map_center;
          await db.put(doc).then(res => {
            console.log(res.id + ' ok:' + res.ok);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));

        await db.get("filename").then(async (doc) => {
          doc.value = map_globals.filename;
          await db.put(doc).then(res => {
            console.log(res.id + ' ok:' + res.ok);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));

        await db.get("data").then(async (doc) => {
          doc.value = map_globals.data;
          await db.put(doc).then(res => {
            console.log(res.id + ' ok:' + res.ok);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));

        await db.get("CountySettings").then(async (doc) => {
          doc.value = map_globals.CountySettings;
          await db.put(doc).then(res => {
            console.log(res.id + ' ok:' + res.ok);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));

        await db.get("ZipcodeSettings").then(async (doc) => {
          doc.value = map_globals.ZipcodeSettings;
          await db.put(doc).then(res => {
            console.log(res.id + ' ok:' + res.ok);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));

        await ReplicateMapSettingsUpStream(db, false).then(res => {
          console.log(`complete = ${res}`);
        });

        await db.close();

        await getMapSetupParameters().then(result => {
            FromSlide2ToSlide1();
        });

        // initialize state, county, zipcode border outlines
        console.log("\t** Intializing Map Borders");
        InitializeMapBorders();

        // Center the map on the state read
        setTimeout(() => {
          if( map_globals.data != null ) {
              let fgroup = L.featureGroup(Marker_global_vars.MarkerLayers);
              map_globals.map.fitBounds(fgroup.getBounds(), { padding: [20, 20] });
              map_globals.map.spin(false);
          } else CenterOnState(map_globals.state);
          map_globals.map.dragging.enable();
          map_globals.map.spin(false);
          ClickHandlerToggleModal(new Event('nothing'));
        },1300);

      } else
        alert("file didn't complete loading");
    },2500);

    InitializeMapBorders();

  }

  function ClickHandler4SetupOptions() {
    FromSlide2ToSlide3();
  }
  
  // Event Handler for [ Cancel ] button click slide1
  function ClickHandler4Back() {
    FromSlide2ToSlide1();
  }

/*=======================================================*/                                          
/* Functions dealing with the MODAL Setup Menu functions */
/*=======================================================*/  
  function getTeamUser() {
    // get pointers to the Display Element values on Slide1
    let result = "";
    result += ("_" + document.querySelector("#team_select").value);
    result += ("_" + document.querySelector("#sched_select").value);
    result += ("_" + States[ document.querySelector("#state_select").value ]);
    
    return result.toLocaleLowerCase();
  }

  async function getMapSetupParameters() {
    console.log('\tFunction getMapSetupParameters()');   
    // define vars
    let db, PrevTaskComplete = false;
    
    // Open local data base if can but don't create it
    const docName = await getNetworkIP();
    db = new PouchDB(`${docName}`, { skip_setup: true });
    if( db ) PrevTaskComplete = true;

    // Test database for documents stored
    if( db !== undefined && db !== null ) 
      PrevTaskComplete = await DoesDataBaseExist(db);
    // if doesn't exist create it!
    if( !PrevTaskComplete ) {
      let newDB = await InitializeMapSetupInfo();
      if( newDB ) {
         db = newDB;
         PrevTaskComplete = true;
      } 
    }
    // Local DB exists now check remote DB on CouchDB
    if( PrevTaskComplete ) {
      // does the remoteDB exist?
      PrevTaskComplete = await DoesRemoteDB4MapSetupExist();
      if( PrevTaskComplete )
        PrevTaskComplete = await ReplicateMapSettingsDownStream(db); // yes, download to localDB
      else
        PrevTaskComplete = await ReplicateMapSettingsUpStream(db, true); // no, Create it
    }

    // Read documents values and update
    await db.allDocs({include_docs: true}).then(res => {
      res.rows.forEach(row => {
        if(row.doc.value !== undefined && row.doc.value !== "") {
          map_globals[row.doc.name] = row.doc.value;
          console.log(`\t\t**Restored Setting ${row.id}`);
        } else
          console.log(`\tNo ${row.id} to restore`);
      }); // end res.rows.forEach()
    }); // end db.allDocs()

    // close local DB.
    await db.close();

    // update the map control setup Slides        
    UpdateDisplaySlide1();
    UpdateSelectsSlide2();
    UpdateSelectsSlide3();

    // Read in Records file if not null
    if( map_globals.data !== null ) {
      console.log("\t** Restoring Markers from saved data");
      startRead(true);
    }

    return PrevTaskComplete;
  }

  function UpdateDisplaySlide1() {
    // get pointers to the Display Elements on Slide1
    let show_team = document.querySelector("#show_team");
    let show_sched = document.querySelector("#show_sched");
    let show_state = document.querySelector("#show_state");
    let show_records = document.querySelector("#show_records");

    // Update the display info on slide1
    show_team.innerHTML = `[ <em>${map_globals.team}</em> ]`;
    show_sched.innerHTML = `[ <em>${map_globals.sched}</em> ]`;
    show_state.innerHTML = `[ <em>${map_globals.state}</em> ]`;
    if(map_globals.filename !== null && map_globals.filename !== "") {
      let tmpStr = map_globals.filename.replace("_map_data_","..");
      show_records.innerHTML = `[ <em>${tmpStr}</em> ]`;
    }
  }

  function UpdateSelectsSlide2() {
    // populate pull down states
    populate_state_selections();

    // get pointers to the Display Elements on Slide1
    let team_selections = document.querySelectorAll("select#team_select option");
    let sched_selections = document.querySelectorAll("select#sched_select option");
    let state_selections = document.querySelectorAll("select#state_select option");

    team_selections.forEach(option => {
      if( option.value.localeCompare(map_globals.team) === 0 )
          option.setAttribute('selected', true);
      else
          option.removeAttribute('selected');
    });

    sched_selections.forEach(option => {
      if( option.value.localeCompare(map_globals.sched) === 0 )
          option.setAttribute('selected', true);
      else
          option.removeAttribute('selected');
    });

    state_selections.forEach(option => {
      if( option.value.localeCompare(map_globals.state) === 0 )
          option.setAttribute('selected', true);
      else
          option.removeAttribute('selected');
    });

    UpdateSelectsSlide3();
  }

  function UpdateSelectsSlide3() {
    // get pointers to the Display Elements on Slide1
    let group1 = [], group2 = [];
    let groups = document.querySelectorAll('input[type=radio]');
    groups.forEach((button) => {
      if( button.getAttribute('name') == "group1")
        group1.push(button);
      if( button.getAttribute('name') == "group2")
        group2.push(button);
    });

    group1.forEach(option => {
      if( option.value.localeCompare(map_globals.CountySettings) === 0 )
          option.checked = true;
      else
          option.checked = false;
    });

    group2.forEach(option => {
      if( option.value.localeCompare(map_globals.ZipcodeSettings) === 0 )
          option.checked = true;
      else
          option.checked = false;
    });
  }

  async function InitializeMapSetupInfo() {
    console.log('\t\t==> InitializeMapSetupinfo');
    let PrevTaskComplete, db;
    /*===> Open/Create Database <===*/
    const docName = await getNetworkIP();
    db = new PouchDB(`${docName}`);
    if(db !== undefined) PrevTaskComplete = true;
 
    /*===> store an initial skeleton of docs into PouchDB <===*/
    await db.bulkDocs([
      {_id: 'team', name: 'team', value: 'NoTeam'},
      {_id: 'sched', name: 'sched', value: 'NoUser'},
      {_id: 'state', name: 'state', value: 'NoState'},
      {_id: 'mapcenter', name: 'mapcenter', value: null},
      {_id: 'filename', name: 'filename', value: null},
      {_id: 'data', name: 'data', value: null},
      {_id: 'CountySettings', name: 'CountySettings', value: "BHTN"},
      {_id: 'ZipcodeSettings', name: 'ZipcodeSettings', value: "BHTN"}
    ]).then(async (res) => {
      PrevTaskComplete = true;
      console.log(res);
    }).catch(function (err) {
      PrevTaskComplete = false;
      console.log(err);
    });

    // copy it up stream to the central CouchDB (returns true/false)
    if( PrevTaskComplete ) {
      PrevTaskComplete = await DoesRemoteDB4MapSetupExist();
      if( !PrevTaskComplete ) {
        PrevTaskComplete = await ReplicateMapSettingsUpStream(db, true);
        console.log('\t\t\t** Copied up new created db upstream ');
      }
    }
    return db;  
  }

  function populate_state_selections() {
    // get a pointer to the Select pull down Element
    let selectElem = document.querySelector('#state_select');
    // get a list of state names
    let Keys = Object.keys(StateNumber);
    // if already loaded don't load it again.
    if(selectElem.length === Keys.length) return;
    // load up select options
    Keys.forEach(key => {
      let optionElem = document.createElement("option");
      optionElem.innerHTML = key.toString();
      optionElem.value = key.toString();
      selectElem.appendChild(optionElem);
    });
    // set 'Select' change event Handler
    selectElem.onchange = SelectStateChangeHandler;
  }

  function SelectStateChangeHandler(ev) {
    Toggle_County_Layer();
    map_globals['team'] = $("#team_select option:selected").val();
    map_globals['state'] = $("#state_select option:selected").val();
    InitializeMapBorders();
  }

  function CenterOnState(thisState) {
    $.ajax({
      url: '/GeoJSON/US_StateLines.json',
      type: 'GET',
      data: { },
      async: false,
      success: function(data) {
          // get State GEOJSON file
          data.features.forEach(State => {
              if( State.properties.name.localeCompare(thisState) === 0 ) {
                  const bbox = L.geoJSON(State).getBounds();
                  map_globals.map_center = bbox.getCenter();
                  setTimeout(() => { map_globals.map.fitBounds(bbox, {padding: [10,10]}); map_globals.map.spin(false); },2000);
              }
          });
      },
      error: function() { alert(`This Error Occured in SearchStateData lookup\n${status}`) },
      dataType: "json"
    });
  }

  function ResetProgressBarSlide2()
  {  
    let progressbarElem = document.querySelector("progress#fileloading");
    progressbarElem.value = 0;
    progressbarElem.innerHTML = " 0% ";
  }  

  function FromSlide1ToSlide2() {
    var slide1Elem = document.querySelector(".slide1");
    var slide2Elem = document.querySelector(".slide2");
    for( let i=-100; i <= 0; i++) {
      setTimeout( () => {
        slide2Elem.style.left = i + '%';
        slide1Elem.style.left = (100 + i) + '%';
      }, (100 + i) * 10);
    };
  }

  function FromSlide2ToSlide1() {
    ResetProgressBarSlide2();
    
    var slide1Elem = document.querySelector(".slide1");
    var slide2Elem = document.querySelector(".slide2");
    for( let i=0; i >= -100; i--) {
      setTimeout( () => {
        slide2Elem.style.left = i + '%';
        slide1Elem.style.left = (100 + i) + '%';
      }, i * -10);
    };
  }

  function FromSlide2ToSlide3() {  
    var slide3Elem = document.querySelector(".slide3");
    var slide2Elem = document.querySelector(".slide2");
    for( let i=-100; i <= 0; i++) {
      setTimeout( () => {
        slide3Elem.style.left = i + '%';
        slide2Elem.style.left = (100 + i) + '%';
      }, (100 + i) * 10);
    };

    $("input[type='radio']").click(function() {
        map_globals.CountySettings = $("input[name='group1']:checked").val();
        map_globals.ZipcodeSettings = $("input[name='group2']:checked").val();
    });
  }

  function FromSlide3ToSlide2() {
    var slide3Elem = document.querySelector(".slide3");
    var slide2Elem = document.querySelector(".slide2");
    for( let i=0; i >= -100; i--) {
      setTimeout( () => {
        slide3Elem.style.left = i + '%';
        slide2Elem.style.left = (100 + i) + '%';
      }, i * -10);
    };
  }

  function ResetCountyDisplaySettings() {
    // alert("Conflict with Display Options settings...Reset County setting");
    let radioButtons = $("input[name='group1']").get();
    radioButtons[2].checked = false;
    radioButtons[1].checked = false;
    radioButtons[0].checked = true;
    GetCountySettings();
  }

  function ResetZipcodeDisplaySettings() {
    // alert("Conflict with Display Options settings...Reset Zipcode setting");
    let radioButtons = $("input[name='group2']").get();
    radioButtons[2].checked = false;  
    radioButtons[1].checked = false;
    radioButtons[0].checked = true;
    GetZipcodeSettings();
  }

  async function ReplicateMapSettingsUpStream(db, Override = false) {
    console.log("\t\t==> Function Replicate MapSetup PouchDB => CouchDB");
    let remoteDB,
        remoteDB_URL,
        PrevTaskComplete;
    /*===> Open remoteDB connection for CouchDB <===*/
    const docName = await getNetworkIP();
    if( HomeEnv )
      remoteDB_URL = `http://admin:testpass1@localhost:5984/${docName}`;
    else
      remoteDB_URL = `http://admin:testpass1@192.168.3.84:5984/${docName}`;

    if( !Override )
      remoteDB = new PouchDB( remoteDB_URL, { skip_setup: true });
    else
      remoteDB = new PouchDB( remoteDB_URL);

    if(remoteDB !== undefined) PrevTaskComplete = true;

    PrevTaskComplete = await DoesRemoteDB4MapSetupExist();

    if( !PrevTaskComplete ) {
        /*===> store an initial skeleton of docs into PouchDB <===*/
        await remoteDB.bulkDocs([
          {_id: 'team', name: 'team', value: 'NoTeam'},
          {_id: 'sched', name: 'sched', value: 'NoUser'},
          {_id: 'state', name: 'state', value: 'NoState'},
          {_id: 'mapcenter', name: 'mapcenter', value: null},
          {_id: 'filename', name: 'filename', value: null},
          {_id: 'data', name: 'data', value: null},
          {_id: 'CountySettings', name: 'CountySettings', value: "BHTN"},
          {_id: 'ZipcodeSettings', name: 'ZipcodeSettings', value: "BHTN"}
        ]).then(async (res) => {
          PrevTaskComplete = true;
          console.log(res);
        }).catch(function (err) {
          PrevTaskComplete = false;
          console.log(err);
        });      
    }

    /* ===> Replicate PouchDB to CouchDB <=== */
    if( PrevTaskComplete ) {
      await db.replicate.to(remoteDB)
      .on('complete', function(res) {
        PrevTaskComplete = true;
        console.log(`\t\t\t** Replication to ${remoteDB_URL} Complete`);
      })
      .on('error', function(err) {
        PrevTaskComplete = false;
        console.log(`\t\t\t** Error replicating to ${remoteDB_URL} with error ${err}`);
      });
    } 
    
    /*===> close out <=== */
    await remoteDB.close();

    return PrevTaskComplete;
  }

  async function ReplicateMapSettingsDownStream(db) {
    console.log("\tFunction ReplicateMapSettingsDownStream(db)")
    /*===> vars used <===*/
    let remoteDB,
        remoteDB_URL,
        PrevTaskComplete;
    /*===> Open remoteDB connection for CouchDB <===*/
    await getNetworkIP().then(docName => {
      if( HomeEnv )
        remoteDB_URL = `http://admin:testpass1@localhost:5984/${docName}`;
      else
        remoteDB_URL = `http://admin:testpass1@192.168.3.84:5984/${docName}`;

      remoteDB = new PouchDB( remoteDB_URL, { skip_setup: true });
      if(remoteDB !== undefined && remoteDB !== null) PrevTaskComplete = true;
      else PrevTaskComplete = false;
    });

    if( PrevTaskComplete )
      PrevTaskComplete = await DoesRemoteDB4MapSetupExist();
    /* ===> Sync CouchDB to PouchDB <=== */
    if( PrevTaskComplete ) {
      await db.replicate.from(remoteDB)
      .on('complete', function () {
        console.log(`\t** Replicating from ${remoteDB_URL} Completed`);
        PrevTaskComplete = true;
      }).on('error', function (err) {
        console.log(`\t\t\t*** Error replicating from ${remoteDB_URL} with error ${err}`);
        PrevTaskComplete = false;
      });
    }
    /*===> Close out RemoteDB <===*/
    await remoteDB.close();

    return PrevTaskComplete;
  }

  async function DoesDataBaseExist(db) {
    let PrevTaskComplete;
    console.log("\tVerify the DataBase Exists");
    await db.info().then(info => {
      if (info !== null && info.doc_count > 2 ) PrevTaskComplete = true;          
      else PrevTaskComplete = false;
    });

    return PrevTaskComplete;
  }

  async function DoesRemoteDB4MapSetupExist() {
    let remoteDB, remoteDB_URL, PrevTaskComplete;
    await getNetworkIP().then(docName => {
      if( HomeEnv )
        remoteDB_URL = `http://admin:testpass1@localhost:5984/${docName}`;
      else
        remoteDB_URL = `http://admin:testpass1@192.168.3.84:5984/${docName}`;

      remoteDB = new PouchDB( remoteDB_URL, { skip_setup: true });
      if(remoteDB !== undefined && remoteDB !== null) PrevTaskComplete = true;
      else PrevTaskComplete = false;
    });

    if( PrevTaskComplete ) {
      await remoteDB.info().then(info => {
        if ( info !== null && info.doc_count > 2 ) PrevTaskComplete = true;          
        else PrevTaskComplete = false;
      }).catch(function (err) {
        PrevTaskComplete = false;
        console.log('error: ' + err);
      });

      await remoteDB.close();
    }

    return PrevTaskComplete;
  }

  /*===============================================================*/                                          
  /* Functions dealing with saving and restoring MAP setup changes */
  /*===============================================================*/

  async function InitDB() {
    console.log("Function InitDB()");
    let db,
        remoteDB,
        PrevTaskComplete,
        user = getTeamUser();

    /*===> initialize URL <===*/   
    if( HomeEnv )
      remoteDB_URL = `http://admin:testpass1@localhost:5984/saved${user}`;
    else
      remoteDB_URL = `http://admin:testpass1@192.168.3.84:5984/saved${user}`;

    /*===> Open/Create db connection for PouchDB <===*/
    db = new PouchDB(`saved${user}`, { skip_setup: true });
    if( db !== undefined && db !== null) PrevTaskComplete = true;
    else PrevTaskComplete = false;
 
    /*===> Test if DB pre-exists? if not create it <===*/
    if( PrevTaskComplete ) {
      PrevTaskComplete = await DoesDataBaseExist(db);
      if( PrevTaskComplete ) console.log("\tLocal Saved Items DB is Available!");
      else { // create local DB
        console.log("\tLocal Saved Items DB doesn't Exist!");
        PrevTaskComplete = InitializeSavedDB(db);
      }
    }
    /* ===> PouchDB should exist at this point */
    if( PrevTaskComplete ) {
      console.log("\tCheck if remoteDB Exists!");
      remoteDB = new PouchDB( remoteDB_URL, { skip_setup: true }); // attempt to open RemoteDB          
      if( remoteDB !== undefined && remoteDB !== null ) PrevTaskComplete = true;
      else PrevTaskComplete = false;

      if( PrevTaskComplete ) {
        PrevTaskComplete =  await DoesDataBaseExist(remoteDB);
        if( PrevTaskComplete ) {
          PrevTaskComplete = await ReplicateDownStream(db);
          if( PrevTaskComplete ) restoreSavedItems(db);
          else ReplicateItemsUpStream(db, true);
        }
      }
    }

    return PrevTaskComplete;
  }

  function InitializeSavedDB(db) {
    let remoteDB,
        PrevTaskComplete,
        user = getTeamUser();
    /*===> Open/Create remoteDB connection for CouchDB <===*/
    if( HomeEnv )
      remoteDB = new PouchDB(`http://admin:testpass1@localhost:5984/saved${user}`);
    else
      remoteDB = new PouchDB(`http://admin:testpass1@192.168.3.84:5984/saved${user}`);

    /*===> create documents to store <===*/
    let blob1 = [];
    let blob2 = [];
    let blob3 = [];
    let blob4 = [];

    /* ===> store them in db PouchDB <=== */
    //let d = new Date();
    db.bulkDocs([
      {_id: 'shapes', name: 'shapes', blob: blob1},
      {_id: 'routes', name: 'routes', blob: blob2},
      {_id: 'drvmaps', name: 'drvmaps', blob: blob3},
      {_id: 'sqicons', name: 'sqicons', blob: blob4}
    ]).then(function () {
      PrevTaskComplete = true;  
      status = '*** Save Completed ***';
    }).catch(function (err) {
      PrevTaskComplete = false;
      console.log(err);
    });

    return PrevTaskComplete;
  }

  function restoreSavedItems(db) { 
    console.log('*** Restoring Map Data ***');
    /*===> Open/Create db connection for PouchDB <===*/
    let index = 0;
    db.allDocs({include_docs: true}).then(res => {
      res.rows.forEach(row => {
        switch(row.id) {
          case 'shapes':
            RegionShapes = [];
            if(row.doc.blob !== undefined && row.doc.blob !== []) {
              restoreShapeLayer(JSON.parse(row.doc.blob));
              console.log('Restored Shapes');
            } else
              console.log('No Shapes to restore');
            index++; 
            break;
          case 'routes':
            if(row.doc.blob !== undefined && row.doc.blob !== []) {
              restoreRoutes(JSON.parse(row.doc.blob));
              console.log('Restored Routes');
            } else console.log('No routes to restore');
            index++; 
            break;
          case 'drvmaps':
            if(row.doc.blob !== undefined && row.doc.blob !== []) {
              restoreISOChrones(JSON.parse(row.doc.blob));
              console.log('Restored DrvMaps');
            } else console.log('No DrvMaps to restore');
            index++; 
            break;
          case 'sqicons':
            if(row.doc.blob !== undefined && row.doc.blob !== []) {
              let Georay = JSON.parse(row.doc.blob);
              if(Georay !== "" && Georay.length > 0)
                RestoreMarkersFromGeoJSON(Georay);
                console.log('Restored SqIcons');
              } else console.log('No SqIcons to restore');
            index++; 
            break;
          default:
            break;
        };
      });
      if(index === 3 || index === 4) console.log("*** Restoration Complete! ***");
    }).catch(err => { throw `error ${err} occurred during restore`; });
  }

  async function saveMapItems() {
    console.log('*** Saving Map Items ***');
    /*===> Open/Create db connection for PouchDB <===*/
    let user = getTeamUser();
    let db = new PouchDB(`saved${user}`);

    //db.debug(on);
    /*===> create documents to store <===*/
    let blob1 = JSON.stringify(GJSONShapes);
    let blob2 = JSON.stringify(GEORoutes);
    let blob3 = JSON.stringify(GeoJSON_ISOChrones);
    let blob4 = [];

    await db.get("shapes").then(async (doc) => {
      doc.blob = blob1;
      await db.put(doc).then(res => {
        console.log(res.id + ' ok:' + res.ok);
      }).catch(err => console.log(err));
    });  

    await db.get("routes").then(async (doc) => {
      doc.blob = blob2;
      await db.put(doc).then(res => {
        console.log(res.id + ' ok:' + res.ok);
      }).catch(err => console.log(err));
    });  

    await db.get("drvmaps").then(async (doc) => {
      doc.blob = blob3;
      await db.put(doc).then(res => {
        console.log(res.id + ' ok:' + res.ok);
      }).catch(err => console.log(err));
    });  

    if(Marker_global_vars.AssignedSqIcons.length > 0) {
      Marker_global_vars.AssignedSqIcons.forEach((v,i) => { Marker2GeoJson(v,i); });
      blob4 = JSON.stringify( CustomElementSelector.IconBoxBtn7.MarkersGeoJSON );
    } else blob4 = [];

    await db.get("sqicons").then(async (doc) => {
      doc.blob = blob4;
      await db.put(doc).then(res => {
        console.log(res.id + ' ok:' + res.ok);
      }).catch(err => console.log(err));
    });  

    /*===> Replicate upstream pouchDB => counchDB and return status <===*/
    let status = '*** Error Occurred ***';
    await ReplicateItemsUpStream(db, true)
          .then(result => status = '*** Save Completed ***' + result )
          .catch(err => console.log(err));

    await db.close();

    return status;
  }

  function Marker2GeoJson(markerLayer, layerIndex) {
    markerLayer.options.type = 'sqmarker';
    let layerGeoJSON = markerLayer.toGeoJSON(); 
    console.log(layerGeoJSON);
    if(layerGeoJSON == null)
        return;
    layerGeoJSON.properties.options = markerLayer.options;
    layerGeoJSON.properties.bindTooltip = markerLayer._tooltip._content;
    CustomElementSelector.IconBoxBtn7.MarkersGeoJSON[ layerIndex ] = JSON.stringify(layerGeoJSON);
  }

  function RestoreMarkersFromGeoJSON(Geo1Source) {
    console.log('RestoreMarkersFromGeoJSON()');
    let GJSONarray = Geo1Source;
    if(GJSONarray === undefined || GJSONarray === null || !GJSONarray.length) return;
    /*===> Recontruct each circle in the array <=== */
    GJSONarray.forEach(layer_GeoJSON => {
        /* ===> Define Variables <=== */
        let latlng = [];
        /* ===> Define Object Variables <=== */       
        let thisLayer = JSON.parse(layer_GeoJSON);
        let options   = thisLayer.properties.options;
        let sqicon    = L.divIcon(options.icon.options);
        let tooltip   = thisLayer.properties.bindTooltip;

        /* ===> GeoJSON Objects are accessed differently Group them <=== */
        latlng = {'lat': thisLayer.geometry.coordinates[1], 'lng': thisLayer.geometry.coordinates[0]};

        const TToffset = { offset: [0,-18], direction: 'top' };
        let thisMarker = new L.Marker([latlng.lat, latlng.lng], { icon: sqicon } )
                                /*=== below event is to capture marker locations when clicked === */
                                .on('click', onClick)
                                /*=== below event is a fix to stop popup when    === */
                                /*=== selecting markers for Routes or ISOChrones === */
                                .on('popupopen', CheckIfPopupAllowed)
                                /*=== below 2-events are a leaflet bugfix when removing then  === */
                                /*=== adding back those same markers(i.e.popups stop working) === */
                                .on('popupclose', function () {
                                      if (thisMarker._icon) {
                                          thisMarker.setOpacity(1);
                                      }
                                      thisMarker.off('popupclose');
                                    })
                                .on('remove', function () {
                                      thisMarker.off('popupclose');
                                    })
                                .bindTooltip(tooltip, TToffset);
                                // .bindPopup(`<u><span style="font-weight:800;">${record.Name}</span></u><br>
                                //               ${record.Address1}<br>
                                //               ${record["City"]}, ${record.State} ${record.ZIP}<br>
                                //               ${record["County"]} County<br>
                                //               Ph: ${record.Callout2}<br>`);
        thisMarker.setZIndexOffset(9999);

        RemoveUsedIconsFromAvailable(thisMarker);

        Marker_global_vars.AssignedSqIcons.push(thisMarker);
        thisMarker.addTo(map_globals.map);
    });

  }

  function ExtractTheIndexNo(IconHtml) {
    let index = NaN;
    let html  = IconHtml;
    let end   = (html.toString().split('')).length;
    if(end > 136) {
      let text  = html.substring(end - 8, end - 6).replace('>', "");
      index = parseInt(text);
    }
    return index;
  }

  function RemoveUsedIconsFromAvailable(markerLayer) {
    console.log('RemoveUsedIconFromAvailable()');
    let IconIndex = ExtractTheIndexNo(markerLayer.options.icon.options.html);
    if( IconIndex !== NaN ) {
      let temp = Marker_global_vars.SquareIcons.filter((marker,Index) => {
        let index = ExtractTheIndexNo(marker.options.html);
        return index !== IconIndex;
      });
      Marker_global_vars.SquareIcons = temp;
    }
  }

  async function ReplicateItemsUpStream(db, Override = false) {
    console.log("Function ReplicateItemsUpStream(db)");
    let remoteDB,
        remoteDB_URL,
        PrevTaskComplete,
        user = getTeamUser();
    /*===> Open/Create remoteDB connection for CouchDB <===*/
    if( HomeEnv )
      remoteDB_URL = `http://admin:testpass1@localhost:5984/saved${user}`;
    else
      remoteDB_URL = `http://admin:testpass1@192.168.3.84:5984/saved${user}`;

    // open remoteDB
    // if( !Override )
    //   remoteDB = new PouchDB( remoteDB_URL, { skip_setup: true });
    // else
      remoteDB = new PouchDB( remoteDB_URL);

    if( remoteDB !== undefined && remoteDB !== null ) PrevTaskComplete = true;
    else PrevTaskComplete = false;

    if( PrevTaskComplete ) {
      PrevTaskComplete = await DoesDataBaseExist(remoteDB);
      if( !PrevTaskComplete ) {
        console.log("\tNo, lets create one");
          /*===> create documents to store <===*/
          let blob1 = "";
          let blob2 = "";
          let blob3 = "";
          let blob4 = "";
          /*===> store an initial skeleton of docs into PouchDB <===*/
          await remoteDB.bulkDocs([
            {_id: 'shapes', name: 'shapes', blob: blob1},
            {_id: 'routes', name: 'routes', blob: blob2},
            {_id: 'drvmaps', name: 'drvmaps', blob: blob3},
            {_id: 'sqicons', name: 'sqicons', blob: blob4}
          ]).then(async (res) => {
            PrevTaskComplete = true;
            console.log(res);
          }).catch(function (err) {
            PrevTaskComplete = false;
            console.log(err);
          });      
      }
      else console.log("\tRemoteDB Database Exists!");

    }
 
    /* ===> Replicate PouchDB to CouchDB <=== */
    if( PrevTaskComplete ) {
      await db.replicate.to(remoteDB)
      .on('complete', function(res) {
        PrevTaskComplete = true;
        console.log(`\t\t\t** Replication to ${remoteDB_URL} Complete`);
      })
      .on('error', function(err) {
        PrevTaskComplete = false;
        console.log(`\t\t\t** Error replicating to ${remoteDB_URL} with error ${err}`);
      });
    } 
    
    /*===> close out <=== */
    await remoteDB.close();

    return PrevTaskComplete;
  }

  async function ReplicateDownStream(db) {
    console.log("\tFunction ReplicateDownStream(db)");
    let remoteDB,
        remoteDB_URL,
        PrevTaskComplete,
        user = getTeamUser();
    /*===> Open/Create remoteDB connection for CouchDB <===*/
    if( HomeEnv )
      remoteDB_URL = `http://admin:testpass1@localhost:5984/saved${user}`;
    else
      remoteDB_URL = `http://admin:testpass1@192.168.3.84:5984/saved${user}`;

    // open remoteDB
    remoteDB = new PouchDB( remoteDB_URL, { skip_setup: true });
    if( remoteDB !== undefined && remoteDB !== null ) PrevTaskComplete = true;
    else PrevTaskComplete = false;

    if( PrevTaskComplete ) {
      PrevTaskComplete = await DoesDataBaseExist(remoteDB);
      /* ===> Replicate PouchDB to CouchDB <=== */
      if( PrevTaskComplete ) {
        await db.replicate.from(remoteDB)
        .on('complete', function () {
          console.log(`\tReplicating from ${remoteDB_URL} Completed`);
          PrevTaskComplete = true;
        }).on('error', function (err) {
          console.log(`\t\t*** Error replicating from ${remoteDB_URL} with error ${err}`);
          PrevTaskComplete = false;
        });
      }
      else console.log("\t*** RemoteDB Database Doesn't Exists");
    }
    return PrevTaskComplete;
  }

  async function getNetworkIP() {
    let IPid = null;
    if(HomeEnv) {
      IPid = "pc10005";
    } else {
      await $.get("http://192.168.3.84/myip.php", function(data) {     
        IPid = data;
      }).fail(function(error) {
        console.log( "error" );
      });
    }
    return IPid;
  }
   