/* Adds a custom layer controls */
const IconBoxBtn4Control =  L.Control.extend({        
  options: {
    position: 'topright'
  },

  initialize: function(options) {
    const LayerControls = CustomElementSelector.IconBoxBtn4.LayerControls;
    LayerControls.innerHTML = '<h4><u><b>Layer Controls</b></u></h4>';
    /* ===> create Main section div <=== */
    const Divider = L.DomUtil.create('div', 'Divider leaflet-bar leaflet-control leaflet-control-custom');
    Divider.style.display = 'grid';
    Divider.style.gridTemplateColumns = '1f,2f,1f';
    Divider.style.gridTemplateRows = 'repeat(7, 24px)';
    Divider.style.gridBias = 'auto';
    Divider.style.justifyContent = 'center';
    Divider.style.textAlign = 'center';
    Divider.style.fontWeight = 'bold';
    Divider.style.minWidth = '160px';
    Divider.style.maxWidth = '200px';
    Divider.style.maxHeight = '267px';
    Divider.style.margin = '10px auto';
    Divider.style.borderRadius = '8px';
    Divider.style.overflow = "auto";
    /*===> Add in Radio Button controls <===*/
    Divider.innerHTML +=
    '<input type="radio" class="BaseLayerTiles" name="BaseTiles" style="margin-top:5px; grid-column:1; grid-row:1;" value=0 checked />' +
    '<h4 style="text-align: left; margin:4px 4px 4px 10px;padding-left:2px; grid-column:2 / 4; grid-row:1;">Int Street Map Tiles</h4>';
    Divider.innerHTML +=
    '<input type="radio" class="BaseLayerTiles" name="BaseTiles" style="margin-top:5px; grid-column:1; grid-row:2;" value=1 />' +
    '<h4 style="text-align: left; margin:4px 4px 4px 10px;padding-left:2px; grid-column:2 / 4; grid-row:2;">Ext Street Map Tiles</h4>';
    Divider.innerHTML +=
    '<input type="radio" class="BaseLayerTiles" name="BaseTiles" style="margin-top:5px; grid-column:1; grid-row:3;" value=2 />' +
    '<h4 style="text-align: left; margin:4px 4px 4px 10px;padding-left:2px; grid-column:2 / 4; grid-row:3;">Ext Topog Map Tiles</h4>';
    Divider.innerHTML += '<span style="grid-column:1 / 4; grid-row:4;"><hr></span>';
    /*===> Add in Checkox controls <===*/
    Divider.innerHTML +=
    '<input type="checkBox" class="VisitIcons" name="VisitIcons" style="margin-top:5px; grid-column:1; grid-row:4;" />' +
    '<button class="ListBtn ListVisits" style="margin:4px 4px 4px 10px;text-align:left;padding-left:2px; grid-column:2; grid-row:4;">' +
    '<h4>All Visits</h4></button>' +
    '<button class="delBtn delVisitsBtn" style="margin:4px;text-align:left;padding-left:2px; grid-column:3; grid-row:4;">' +
    '<b>Del</b></button>';
    Divider.innerHTML +=
    '<input type="checkBox" class="MarkerIcons" name="MarkerIcons" style="margin-top:5px; grid-column:1; grid-row:5;" Checked />' +
    '<button class="ListBtn ListMarkers" style="margin:4px 4px 4px 10px;text-align:left;padding-left:2px; grid-column:2; grid-row:5;">' +
    '<h4>All Markers</h4></button>' +
    '<button class="delBtn delMarkersBtn" style="margin:4px;text-align:left;padding-left:2px; grid-column:3; grid-row:5;">' +
    '<b>Del</b></button>';
    Divider.innerHTML +=
    '<input type="checkBox" class="Shapes" name="Shapes" style="margin-top:5px; grid-column:1; grid-row:6;" Checked />' + 
    '<button class="ListBtn ListShapes" style="margin:4px 4px 4px 10px;text-align:left;padding-left:2px; grid-column:2; grid-row:6;">' +
    '<h4>All Shapes</h4>' + 
    '<button class="delBtn delAllShapesBtn" style="margin:4px;text-align:left;padding-left:2px; grid-column:3; grid-row:6;">' +
    '<b>Del</b></button>';
    Divider.innerHTML +=
    '<input type="checkBox" class="Routes" name="Routes" style="margin-top:5px; grid-column:1; grid-row:7;" Checked />' +
    '<button class="ListBtn ListRoutes" style="margin:4px 4px 4px 10px;text-align:left;padding-left:2px; grid-column:2; grid-row:7;">' + 
    '<h4>All Routes</h4></button>' +
    '<button class="delBtn delAllRoutesBtn" style="margin:4px;text-align:left;padding-left:2px;grid-column:3; grid-row:7;">' +
    '<b>Del</b></button>';
    Divider.innerHTML +=
    '<input type="checkBox" class="DrvMaps" name="DrvMaps" style="margin-top:5px; grid-column:1; grid-row:8;" Checked />' +
    '<button class="ListBtn ListISOChrones" style="margin:4px 4px 4px 10px;text-align:left;padding-left:2px; grid-column:2; grid-row:8;">' +
    '<h4>All DrvMaps</h4></button>' + 
    '<button class="delBtn delAllDrvMapsBtn" style="margin:4px;text-align:left;padding-left:2px; grid-column:3; grid-row:8;">' +
    '<b>Del</b></button>';
    /*===> Save Element for later access <===*/
    CustomElementSelector.IconBoxBtn4.Divider = Divider;
    LayerControls.appendChild(Divider); // add it as child element
/*===================================================================================================================================*/
    /*===> [√] CheckBoxes, (0)Radio Buttons and [Del] button click Handlers for main layer control <=== */
    
    /*===> setup Click Handler for Radio Buttons <===*/
    const BaseTiles = Divider.querySelectorAll('.BaseLayerTiles');
    BaseTiles.forEach(BaseTile => BaseTile.onclick = RadioButtonClick);
    
    const VisitsCbox = Divider.querySelector('.VisitIcons');
    VisitsCbox.onclick      = function(ev) {
                                              ev.stopPropagation();
                                              const checkbox = ev.target;
                                              const labelH4 = ev.target.nextSibling.querySelector('h4');
                                              labelH4.style.opacity = '0.3'; checkbox.disabled = true;
                                              const checked = ev.target.checked;
                                              const myVisits = Marker_global_vars.myVisitsGroup;
                                              GEOToggle_Layer(myVisits, checked);

                                              setTimeout(() => { labelH4.style.opacity = '1'; checkbox.disabled = false; }, 150);
                                           };
    const delVisitsBtn = Divider.querySelector('.delVisitsBtn');
    delVisitsBtn.onclick    = function(ev) {
                                              ev.stopPropagation();
                                              // DeleteAllVisits();
                                           };
                                       

    const MarkerCbox = Divider.querySelector('.MarkerIcons');
    MarkerCbox.onclick      = function(ev) {
                                              ev.stopPropagation();
                                              const checkbox = ev.target;
                                              const labelH4 = ev.target.nextSibling.querySelector('h4');
                                              labelH4.style.opacity = '0.3'; checkbox.disabled = true;
                                              const checked = ev.target.checked;
                                              
                                              const markers = CustomElementSelector.IconBoxBtn4.MarkerLayerGroup;
                                              AddRemoveLayer(markers, checked); //add or remove layer base on Checked status

                                              setTimeout(() => { labelH4.style.opacity = '1'; checkbox.disabled = false; }, 150);
                                           };
    const delMarkersBtn = Divider.querySelector('.delMarkersBtn');
    delMarkersBtn.onclick   = function(ev) {
                                              DeleteAllMarkers();
                                           };

    const ShapesCbox = Divider.querySelector('.Shapes');
    ShapesCbox.onclick      = function(ev) {
                                              const checkbox = ev.target;
                                              const labelH4 = ev.target.nextSibling.querySelector('h4');
                                              labelH4.style.opacity = '0.3'; checkbox.disabled = true;
                                              const checked = ev.target.checked;
                                              const ShapesLayerGroup = CustomElementSelector.IconBoxBtn4.ShapesLayerGroup;
                                              Toggle_Layer(ShapesLayerGroup, checked);
                                              setTimeout(() => { labelH4.style.opacity = '1'; checkbox.disabled = false; }, 150);
                                            };
    const delAllShapesBtn = Divider.querySelector('.delAllShapesBtn');
    delAllShapesBtn.onclick = function(ev) {
                                              const ShapesLayerGroup = CustomElementSelector.IconBoxBtn4.ShapesLayerGroup;
                                              Toggle_Layer(ShapesLayerGroup, false); // remove all shapes from the map

                                              while( RegionShapes.length > 0 ) { // assumes RegionShapes and GJSONShapes are succinct.
                                                let layer = RegionShapes[0];
                                                let index = layer.options.LayerIndex;
                                                deleteShapeAsGeoJSON(index);     // delete current layer from both Arrays and store it.
                                                ShapesLayerGroup.removeLayer(layer); // remove layer from Leaflet.draw array
                                              };
                                           };
   
    const RoutesCbox = Divider.querySelector('.Routes');
    RoutesCbox.onclick      = function(ev) {
                                             const checkbox = ev.target;
                                             const labelH4 = ev.target.nextSibling.querySelector('h4');
                                             labelH4.style.opacity = '0.3'; checkbox.disabled = true;
                                             const checked = ev.target.checked;
                                             const RoutesLayerGroup = CustomElementSelector.IconBoxBtn4.RoutesLayerGroup;
                                             GEOToggle_Layer(RoutesLayerGroup, checked);
                                             setTimeout(() => { labelH4.style.opacity = '1'; checkbox.disabled = false; }, 150);
                                           };
    const delAllRoutesBtn = Divider.querySelector('.delAllRoutesBtn');
    delAllRoutesBtn.onclick = function(ev) {
                                             let RoutesLayerGroup = CustomElementSelector.IconBoxBtn4.RoutesLayerGroup;
                                             GEOToggle_Layer(RoutesLayerGroup, false); // remove all Routes from the map

                                             while( RouteLayers.length > 0 ) { // assumes RegionShapes and GJSONShapes are succinct.
                                               let layer = RouteLayers[0];
                                               let index = layer.options.LayerIndex;
                                               deleteRoutesAsGeoJSON(index);     // delete current layer from both Arrays and store it.
                                             };
                                           };

    const DrvMapsCbox = Divider.querySelector('.DrvMaps');
    DrvMapsCbox.onclick     = function(ev) {
                                              const checkbox = ev.target;
                                              const labelH4 = ev.target.nextSibling.querySelector('h4');
                                              labelH4.style.opacity = '0.3'; checkbox.disabled = true;
                                              const checked = ev.target.checked;
                                              const DriveMapLayerGroup = CustomElementSelector.IconBoxBtn4.DriveMapLayerGroup;
                                              GEOToggle_Layer(DriveMapLayerGroup, checked);
                                              setTimeout(() => { labelH4.style.opacity = '1'; checkbox.disabled = false; }, 150);
                                           };
    const delAllDrvMapsBtn = Divider.querySelector('.delAllDrvMapsBtn');
    delAllDrvMapsBtn.onclick = function(ev) {
                                              const DriveMapLayerGroup = CustomElementSelector.IconBoxBtn4.DriveMapLayerGroup;
                                              GEOToggle_Layer(DriveMapLayerGroup, false); // remove all Routes from the map

                                              while( ISOChrones.length > 0 ) { // assumes RegionShapes and GJSONShapes are succinct.
                                                let layer = ISOChrones[0];
                                                let index = layer.options.LayerIndex;
                                                deleteISOChroneAsGeoJSON(index);     // delete current layer from both Arrays and store it.
                                              };
                                            };

/* ==================================================================================================== */
    /*===> Tile button for secondary itemized lists <===*/
    const LVisits = Divider.querySelector('.ListVisits');
    LVisits.onclick         = function(ev) {
                                              ev.stopPropagation();
                                              const checked = Divider.querySelector('.VisitIcons').checked;
                                              CC_GlobalVars.DeleteLayer = DeleteVisit;
                                              const visits = Marker_global_vars.myVisitsGroup;
                                              if( visits.length > 0 ) MakeControlList(visits, 'Marker List', checked);
                                           };
    const LMarkers = Divider.querySelector('.ListMarkers');
    LMarkers.onclick        = function(ev) {
                                              ev.stopPropagation();
                                          //    const checked = Divider.querySelector('.MarkerIcons').checked;
                                          //    CC_GlobalVars.DeleteLayer = DeleteAllMarkers();
                                          //    const AllinOne = [...Marker_global_vars.myVisitsGroup];
                                          //    if(AllinOne.length > 0) MakeControlList(AllinOne, 'Marker List', checked);
                                           };
    const LShapes = Divider.querySelector('.ListShapes');
    LShapes.onclick         = function(ev) {
                                              ev.stopPropagation();
                                              const checked = Divider.querySelector('.Shapes').checked;
                                              CC_GlobalVars.DeleteLayer = deleteShapeAsGeoJSON;
                                              if(RegionShapes.length > 0) MakeControlList(RegionShapes, 'Shapes List', checked);
                                           };
    const LRoutes = Divider.querySelector('.ListRoutes');
    LRoutes.onclick         = function(ev) {
                                              ev.stopPropagation();
                                              const checked = Divider.querySelector('.Routes').checked;
                                              CC_GlobalVars.DeleteLayer = deleteRoutesAsGeoJSON;
                                              if(RouteLayers.length > 0) MakeControlList(RouteLayers, 'Routes List', checked);
                                           };
    const LISOChrones = Divider.querySelector('.ListISOChrones');
    LISOChrones.onclick     = function (ev) {
                                              ev.stopPropagation();
                                              const checked = Divider.querySelector('.DrvMaps').checked;
                                              CC_GlobalVars.DeleteLayer = deleteISOChroneAsGeoJSON;
                                              if(ISOChrones.length > 0) MakeControlList(ISOChrones, 'DrvMap List', checked);
                                            };
    /*===> The below function creates Checkbox lists like the main section <===*/
    function MakeControlList(layers, title, checked = true) {
      CC_GlobalVars.Layers = layers;
      let LayerControls = CustomElementSelector.IconBoxBtn4.LayerControls;
      LayerControls.innerHTML = `<h4><b><u>${title}</u></b></h4>`;

      Divider.style.display = 'none';
      const innerDiv = L.DomUtil.create('div', 'innerDiv leaflet-bar leaflet-control leaflet-control-custom');
      innerDiv.style.display = 'grid';
      innerDiv.style.gridTemplateColumns = '1f,2f,1f';
      innerDiv.style.gridTemplateRows = `repeat(${layers.length}, 24px)`;
      innerDiv.style.gridBias = 'auto';
      innerDiv.style.justifyContent = 'center';
      innerDiv.style.textAlign = 'center';
      innerDiv.style.fontWeight = '800';
      innerDiv.style.width = '190px';
      innerDiv.style.height = "auto";
      innerDiv.style.maxHeight = '240px';
      innerDiv.style.margin = '10px auto';
      innerDiv.style.borderRadius = '8px';
      innerDiv.style.overflow = 'auto';

      layers.forEach((layer,index) => {

          let row = index + 1;
          /* ===> extract & normalize the color information <=== */
          let color = 'OLOFPin';
          if(layer.options.type !== 'visit') {
            if(layer.options.color != undefined) color = layer.options.color;
            else if(layer.options.iconOptions != undefined) color = layer.options.iconOptions.color;
            else if(layer.options.style != undefined) color = layer.options.style.color;
            if(color.split('')[0] !== '#') {
                 let match = color.match(/^[A-Z, a-z].*$/g);
                 if( match === color ) color = hex2rgb( colorNameToHexVal(color), 1.0 );
            }
          }
          /* ===> Shorten Long Name for display <=== */
          let itemLabel;
          switch(layer.options.type) {
            case 'circle':
              itemLabel = 'Circle';
              break;
            case 'polyline':
              itemLabel = 'PLine ';
              break;
            case 'polygon':
              itemLabel = 'Plygon';
              break; 
            case 'rectangle':
              itemLabel = 'Square';
              break;
            case 'circlemarker':
            case 'marker':
              itemLabel = 'Marker';
              break;
            case 'visit':
              itemLabel = 'Visits';
              break;
            default:
              itemLabel = layer.options.type;
              break;
        };
        itemLabel += ' ' + layer._leaflet_id;
        let CheckedStr = (checked) ? "Checked" : "";

        let FontColor = (color !== 'OLOFPin') ? pickTextColorBasedOnBgColorAdvanced(color) : "black";
        innerDiv.innerHTML +=
          `<input type="checkBox" class="ListItems ListItem${index}" name="ListItem${index}" style="margin-top:6px;grid-column:1; grid-row:${row};" value=${index} ${CheckedStr} />` +
          `<button class="ListBtn ListBtn" style="text-align:left;color: ${FontColor};background-color:${color};width:100px;margin:4px 4px 4px 10px;padding-left:2px;grid-column:2; grid-row:${row};" value=${index}>` +
          `<h4><em>${itemLabel}</em></h4></button>` +
          `<button class="delBtn delItem${index}" style="margin:4px;text-align:left;padding-left:2px;grid-column:3; grid-row:${row};"  value=${index} >` +
          '<b>Del</b></button>';

      });

      CustomElementSelector.IconBoxBtn4.InnerDiv = innerDiv; //store element for access later
      LayerControls.appendChild(innerDiv); // attach as child element of LayerControl
      const cboxes = LayerControls.querySelectorAll('div.innerDiv input[type=checkBox].ListItems');
      cboxes.forEach(element => element.onclick = CheckboxChange);
      const DelBtns = LayerControls.querySelectorAll('div.innerDiv button.delBtn');
      DelBtns.forEach(element => element.onclick = DelLayer);
      const ListOptionBtns = LayerControls.querySelectorAll(`div.innerDiv button.ListBtn`);
      if(ListOptionBtns[0].innerText.substr(0,5) === 'Route') 
        ListOptionBtns.forEach(element => element.onclick = RouteDrivingIns);
    
    } // end MakeControlList()

    function CheckboxChange(ev) {
      ev.stopPropagation();
      const index = ev.target.value;
      const checked = ev.target.checked;
      const Layers = CC_GlobalVars.Layers;
      let layer = Layers[index];
      AddRemoveLayer(layer,checked);
    }

    function DelLayer(ev) {
      /* ===> Gather P's & Q's to be able to access the layer <=== */
      const layers = CC_GlobalVars.Layers; // get current array of layers
      const index = ev.currentTarget.value; // get index
      let layer = layers[index]; // point to the specific layer
      
      /* ===> Delete the designated Layer via it's array index <=== */
      if(index !== undefined && index >= 0)
        CC_GlobalVars.DeleteLayer(index);
      
      /* ===> Delete or Remove the object from the map's view <=== */
      setTimeout( () => {
          /*===> if Shape perform extra step to remove from Cluster Control <===*/
          if(layers === RegionShapes) {
            let ShapesLayerGroup = CustomElementSelector.IconBoxBtn4.ShapesLayerGroup;
            ShapesLayerGroup.removeLayer(layer);
          }
          else
             map_globals.map.removeLayer(layer);

          /* ===> update the menu choices <=== */
          const innerDiv = CustomElementSelector.IconBoxBtn4.innerDiv;
          const LayerControls = CustomElementSelector.IconBoxBtn4.LayerControls;
          const title = LayerControls.querySelector("h4:first-child").innerText;
          LayerControls.removeChild(LayerControls.childNodes[0]);
          CustomElementSelector.IconBoxBtn4.innerDiv = null;
          if(layers.length < 1)
            CustomElementSelector.IconBoxBtn4.IconBoxBtn4Ctrl.click();  
          else
            MakeControlList(layers, title);
      }, 280);
    }

    function RadioButtonClick(ev) {
      const BaseTiles = Divider.querySelectorAll('.BaseLayerTiles');
      BaseTiles.forEach(LayerTile => {
        let index = LayerTile.value;
        let checked = LayerTile.checked;
        let layers = map_globals.BaseLayerGroup;

        AddRemoveLayer(layers[index], checked);
      });
    }
    
    function RouteDrivingIns(ev) {
      const index = ev.path[2].value;
      const Layers = CC_GlobalVars.Layers;
      let layer = Layers[index];
      if( layer != null && layer.options.drivingIns !== undefined ) {
        let sidebar = CustomElementSelector.Sidebar;
        let sectionText = layer.options.drivingIns;
        sidebar.setContent(sectionText);
        sidebar.show();
      }
    }
  }, // end Initialize()

  onAdd: function () {
    const IconBoxBtn4 = L.DomUtil.create('div', 'IconBoxBtn4Ctrl leaflet-bar leaflet-control leaflet-control-custom'); 
    IconBoxBtn4.style.backgroundColor = 'white';     
    IconBoxBtn4.style.width = '36px';
    IconBoxBtn4.style.height = '36px';
    IconBoxBtn4.style.border = '1px solid black'; 
    IconBoxBtn4.style.margin = '0px 10px';
    IconBoxBtn4.style.backgroundImage = 'url("./images/icon4.png")';
    IconBoxBtn4.style.backgroundRepeat = 'no-repeat';
    IconBoxBtn4.style.backgroundSize = '150% 150%';
    IconBoxBtn4.style.backgroundPosition = 'center';
    IconBoxBtn4.style.opacity = '0.8';
    IconBoxBtn4.style.boxSizing = "border-box"; 
    IconBoxBtn4.style.padding = '20px, 5px';
    IconBoxBtn4.style.position = "relative";
    IconBoxBtn4.title = "Layer Controls";
    CustomElementSelector.IconBoxBtn4.IconBoxBtn4Ctrl = IconBoxBtn4;

    /*===> Append children controls <===*/
    const LayerControls = CustomElementSelector.IconBoxBtn4.LayerControls;
    IconBoxBtn4.appendChild(LayerControls);

    /* ===> Setup Event Listeners <=== */
    LayerControls.onclick = doNothing;
    IconBoxBtn4.onclick = crtlToggle;

    /* ===> This section contains event Handler functions <=== */
    function doNothing(ev) {ev.stopPropagation()};

    function crtlToggle(ev) {
      if(CC_GlobalVars.debounce === false && !MutuallyExclusive.IconBoxBtn3_Active)
      {
        CC_GlobalVars.debounce = true;
        MutuallyExclusive.IconBoxBtn4_Active = (IconBoxbtn4_ToggleDisplay() === 'flex') ? true : false;
        IconBoxBtn4_ToggleStyles();
        setTimeout(() => { CC_GlobalVars.debounce = false }, 350);
      }
    }

    function IconBoxbtn4_ToggleDisplay() {
      const LayerControls = CustomElementSelector.IconBoxBtn4.LayerControls;
      const InnerDiv = CustomElementSelector.IconBoxBtn4.InnerDiv;
      const Divider = CustomElementSelector.IconBoxBtn4.Divider;
      let display = LayerControls.style.display;
      display = LayerControls.style.display = ((display === 'none') ? 'flex' : 'none'); // toggle it
      if(display === 'none' && InnerDiv instanceof Element) {
        Divider.style.display = 'grid';
        if(InnerDiv != null && InnerDiv != undefined && InnerDiv != {}) {
          LayerControls.removeChild(InnerDiv); InnerDiv.remove(); 
          CustomElementSelector.IconBoxBtn4.InnerDiv = {};
          LayerControls.innerHTML = '<h4><u><b>Layer Controls</b></u></h4>';
          LayerControls.appendChild(Divider);
        }
      }
      return display; // return the updated CSS [display] property
    }

    function IconBoxBtn4_ToggleStyles() {
      const IconBoxBtn4 = CustomElementSelector.IconBoxBtn4.IconBoxBtn4Ctrl;
      const ONOFF = MutuallyExclusive.IconBoxBtn4_Active;
      IconBoxBtn4.style.border = ((ONOFF) ? 'medium inset ivory' : 'thin outset black');
      IconBoxBtn4.style.boxShadow = ((ONOFF) ? "5px 5px 8px darkgray inset" : "none");
    }

    return IconBoxBtn4;
  },
  onRemove: function() {
    /*===> Remove appended children controls <===*/
    const IconBoxBtn4 =  CustomElementSelector.IconBoxBtn4.IconBoxBtn4Ctrl;
    const LayerControls = CustomElementSelector.IconBoxBtn4.LayerControls;
    const innerDiv = CustomElementSelector.IconBoxBtn4.InnerDiv; 
    
    LayerControls.removeChild(innerDiv); // attach as child element of LayerControl
    IconBoxBtn4.removeChild(LayerControls);

    /* ===> Setup Event Listeners <=== */
    LayerControls.onclick = null;
    IconBoxBtn4.onclick = null;
  }
});
