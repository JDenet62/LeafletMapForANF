"use strict"

/*============== Supporting Objects and Helper Function =================*/
        /*************************************************************/
        /* Below is a JSON object correlating States with State Code */
        /*************************************************************/
        const StateNumber = Object.freeze({
            'Alabama': "01",
            'Alaska': "02",
            'Arizona': "04",
            'Arkansas': "05",
            'California': "06",
            'Colorado': "08",
            'Connecticut': "09",
            'Delaware': "10",
            'District Of Columbia': "11",
            'Florida': "12",
            'Georgia': "13",
            'Hawaii': "15",
            'Idaho': "16",
            'Illinois': "17",
            'Indiana': "18",
            'Iowa': "19",
            'Kansas': "20",
            'Kentucky': "21",
            'Louisiana': "22",
            'Maine': "23",
            'Maryland': "24",
            'Massachusetts': "25",
            'Michigan': "26",
            'Minnesota': "27",
            'Mississippi': "28",
            'Missouri': "29",
            'Montana': "30",
            'Nebraska': "31",
            'Nevada': "32",
            'New Hampshire': "33",
            'New Jersey': "34",
            'New Mexico': "35",
            'New York': "36",
            'North Carolina': "37",
            'North Dakota': "38",
            'Ohio': "39",
            'Oklahoma': "40",
            'Oregon': "41",
            'Pennsylvania': "42",
            'Rhode Island': "44",
            'South Carolina': "45",
            'South Dakota': "46",
            'Tennessee': "47",
            'Texas': "48",
            'Utah': "49",
            'Vermont': "50",
            'Virginia': "51",
            'Washington': "53",
            'West Virginia': "54",
            'Wisconsin': "55",
            'Wyoming': "56",
            'NoState': "99"
        });

        /***********************************************************/
        /* Below function searches an object trying to Match a key */
        /***********************************************************/
        function SearchKeyValue (search, JSON_array = StateNumber) {
            let Keys = Object.keys(JSON_array);
            for (let i=0; i < Keys.length; i++) {
                if(JSON_array[(Keys[i])] === search) return Keys[i];
            }
        }

        /********************************************************/
        /* Below function takes a Zipcode as a String, after an */
        /* arduous lookup returns the associate State's Name    */
        /********************************************************/
        function ZipCodeToStateName(ZipcodeString) {
            let Zipcode = parseInt(ZipcodeString);
            let first = ZipcodeString.split('')[0];
            let result = "";
            switch(first) {
                case '0':
                    switch(true) {
                        case (Zipcode >= 1001 && Zipcode <= 2799 ||
                            Zipcode >= 5501 && Zipcode <= 5599):
                            result = 'Massachusetts';
                            break;
                        case (Zipcode >= 2801 && Zipcode <= 2999):
                            result = 'Rhode Island';
                            break;                                    
                        case (Zipcode >= 3001 && Zipcode <= 3899):
                            result = 'New Hampshire';
                            break;                                    
                        case (Zipcode >= 3901 && Zipcode <= 4992):
                            result = 'Maine';
                            break;
                        case (Zipcode >= 5001 && Zipcode <= 5499 ||
                            Zipcode >= 5601 && Zipcode <= 5999):
                            result = 'Vermont';
                            break;
                        case (Zipcode >= 6001 && Zipcode <= 6389 ||
                            Zipcode >= 6391 && Zipcode <= 6999):
                            result = 'Connecticut';
                            break;
                        case (Zipcode >= 7001 && Zipcode <= 8999):
                            result = 'New Jersey';
                            break;                                                                   
                        default:
                            break;
                    };
                    break;
                case '1':
                    switch(true) {
                        case (Zipcode >= 10001 && Zipcode <= 14975):
                            result = 'New York';
                            break;
                        case (Zipcode >= 15001 && Zipcode <= 19699):
                            result = 'Pennsylvania';
                            break;                                    
                        case (Zipcode >= 19701 && Zipcode <= 19980):
                            result = 'Delaware';
                            break;
                        default:
                            break;
                    };
                    break;
                case '2':
                    switch(true) {
                        case (Zipcode >= 20001 && Zipcode <= 20099 ||
                            Zipcode >= 20201 && Zipcode <= 20587 ||
                            Zipcode >= 20589 && Zipcode <= 20597 ||
                            Zipcode == 20599):
                            result = 'District Of Columbia';
                            break;
                        case (Zipcode == 20588 ||
                            Zipcode >= 20601 && Zipcode <= 21299 ||
                            Zipcode >= 21401 && Zipcode <= 21999):
                            result = 'Maryland';
                            break;
                        case (Zipcode >= 20101 && Zipcode <= 20598 ||
                            Zipcode >= 22001 && Zipcode <= 24699):
                            result = 'Virginia';
                            break;
                        case (Zipcode >= 24701 && Zipcode <= 26899):
                            result = 'West Virginia';
                            break;
                        case (Zipcode >= 27001 && Zipcode <= 28999):
                            result = 'North Carolina';
                            break;                                        
                        case (Zipcode >= 29001 && Zipcode <= 29999):
                            result = 'South Carolina';
                            break;                                                                                                 
                        default:
                            break;
                    };
                    break;
                case '3':
                    switch(true) {
                        case (Zipcode >= 30001 && Zipcode <= 31999 ||
                            Zipcode >= 39801 && Zipcode <= 39999):
                            result = 'Georgia';
                            break;
                        case (Zipcode >= 32001 && Zipcode <= 33999 ||
                            Zipcode >= 34101 && Zipcode <= 34199 ||
                            Zipcode >= 34201 && Zipcode <= 34299 ||
                            Zipcode >= 34401 && Zipcode <= 34499 ||
                            Zipcode >= 34601 && Zipcode <= 34699 ||
                            Zipcode >= 34701 && Zipcode <= 34799 ||
                            Zipcode >= 34901 && Zipcode <= 34999):
                            result = 'Florida';
                            break;
                        case (Zipcode >= 35004 && Zipcode <= 35299 || Zipcode >= 35401 && Zipcode <= 36925):
                            result = 'Alabama';
                            break;
                        case (Zipcode >= 37001 && Zipcode <= 38599):
                            result = 'Tennessee';
                            break;                                    
                        case (Zipcode >= 38601 && Zipcode <= 39799):
                            result = 'Mississippi';
                            break;
                        default:
                            break;
                    };
                    break;
                case '4':
                    switch(true) {
                        case (Zipcode >= 40001 && Zipcode <= 41899 ||
                            Zipcode >= 42001 && Zipcode <= 42799):
                            result = 'Kentucky';
                        break;
                        case (Zipcode >= 43001 && Zipcode <= 45999):
                            result = 'Ohio';
                            break;                                        
                        case (Zipcode >= 46001 && Zipcode <= 47999):
                            result =  'Indiana';
                            break;
                        case (Zipcode >= 48001 && Zipcode <= 49999):
                            result = 'Michigan';
                            break;
                        default:
                            break;
                    };
                    break;
                case '5':
                    switch(true) {
                        case (Zipcode >= 50001 && Zipcode <= 51699 ||
                            Zipcode >= 52001 && Zipcode <= 52899):
                            result = 'Iowa';
                            break;
                        case (Zipcode >= 53001 && Zipcode <= 53299 ||
                            Zipcode >= 53401 && Zipcode <= 53599 ||
                            Zipcode >= 53701 && Zipcode <= 54999):
                            result = 'Wisconsin';
                            break;
                        case (Zipcode >= 55001 && Zipcode <= 55199 ||
                            Zipcode >= 55301 && Zipcode <= 56799):
                            result = 'Minnesota';
                            break;
                        case (Zipcode >= 56901 && Zipcode <= 56999 ):
                            result = 'District Of Columbia';
                            break;
                        case (Zipcode >= 57001 && Zipcode <= 57799):
                            result = 'South Dakota';
                            break;                                    
                        case (Zipcode >= 58001 && Zipcode <= 58899):
                            result = 'North Dakota';
                            break;                                                            
                        case (Zipcode >= 59001 && Zipcode <= 59999):
                            result = 'Montana';
                            break;                
                        default:
                            break;
                    };
                    break;
                case '6':
                    switch(true) {
                        case (Zipcode >= 60001 && Zipcode <= 62099 ||
                            Zipcode >= 62201 && Zipcode <= 62999):
                            result = 'Illinois';
                            break;
                        case (Zipcode >= 63001 && Zipcode <= 63199 ||
                            Zipcode >= 63301 && Zipcode <= 64199 ||
                            Zipcode >= 64401 && Zipcode <= 65899):
                            result = 'Missouri';
                            break;
                        case (Zipcode >= 66001 && Zipcode <= 66299 ||
                            Zipcode >= 66401 && Zipcode <= 67999):
                            result = 'Kansas';
                            break;
                        case (Zipcode >= 68001 && Zipcode <= 68199 ||
                            Zipcode >= 68301 && Zipcode <= 69399):
                            result = 'Nebraska';
                            break;
                        default:
                            break;
                    };
                    break;
                case '7':
                    switch(true) {
                        case (Zipcode >= 70001 && Zipcode <= 70199 ||
                            Zipcode >= 70301 && Zipcode <= 70899 ||
                            Zipcode >= 71001 && Zipcode <= 71499):
                            result = 'Louisiana';
                            break;
                        case (Zipcode >= 71601 && Zipcode <= 72999):
                            result = 'Arkansas';
                            break;
                        case (Zipcode >= 73001 && Zipcode <= 73199 ||
                            Zipcode >= 73401 && Zipcode <= 73959 ||
                            Zipcode >= 73961 && Zipcode <= 74199 ||
                            Zipcode >= 74301 && Zipcode <= 74999):
                            result = 'Oklahoma';
                            break;                   
                        case (Zipcode == 73301 || Zipcode == 73344 || Zipcode == 73960 ||
                            Zipcode >= 75001 && Zipcode <= 75507 ||
                            Zipcode >= 75550 && Zipcode <= 79999 ||
                            Zipcode >= 88510 && Zipcode <= 88599):
                            result = 'Texas';
                            break;
                        default:
                            break;
                    };
                    break;
                case '8':
                    switch(true) {
                        case (Zipcode >= 80001 && Zipcode <= 81699):
                            result = 'Colorado';
                            break;
                        case (Zipcode >= 82001 && Zipcode <= 83199 ||
                            Zipcode == 83414):
                            result = 'Wyoming';
                            break;                                    
                        case (Zipcode >= 83201 && Zipcode <= 83413 ||
                            Zipcode >= 83415 && Zipcode <= 83899):
                            result = 'Idaho';
                            break;
                        case (Zipcode >= 84001 && Zipcode <= 84799):
                            result = 'Utah';
                            break;
                        case (Zipcode >= 85001 && Zipcode <= 85399 ||
                            Zipcode >= 85501 && Zipcode <= 85799 ||
                            Zipcode >= 85901 && Zipcode <= 86099 ||
                            Zipcode >= 86301 && Zipcode <= 86599):
                            result = 'Arizona';
                            break;
                        case (Zipcode >= 87001 && Zipcode <= 88441):
                            result = 'New Mexico';
                            break;                                       
                        case (Zipcode >= 88901 && Zipcode <= 89199 ||
                            Zipcode >= 89301 && Zipcode <= 89599 ||
                            Zipcode >= 89701 && Zipcode <= 89899):
                            result = 'Nevada';
                            break;
                        default:
                            break;
                    };
                    break;
                case '9':
                    switch(true) {
                        case (Zipcode >= 90001 && Zipcode <= 90899 ||
                            Zipcode >= 91001 && Zipcode <= 92899 ||
                            Zipcode >= 93001 && Zipcode <= 96199):
                            result = 'California';
                            break;
                        case (Zipcode >= 96701 && Zipcode <= 96798 ||
                            Zipcode >= 96801 && Zipcode <= 96899):
                            result = 'Hawaii';
                            break;
                        case (Zipcode >= 97001 && Zipcode <= 97999):
                            result = 'Oregon';
                            break;                                    
                        case (Zipcode >= 98001 && Zipcode <= 98699 ||
                            Zipcode >= 98801 && Zipcode <= 99499):
                            result = 'Washington';
                            break;
                        case (Zipcode >= 99501 && Zipcode <= 99950):
                            result = 'Alaska';
                            break;
            
                        default:
                            break;
                    };
                    break;
                default:
                    break;                                        
            };

            return result;
        }

        function EnableZipCodeOutlineSelect() {
            map_globals.map.contextmenu.setDisabled(5, false);
        }

/*===================== Main called Functions =====================*/
        /***********************************************/
        /* Function to load US State's GEOJSON outline */
        /***********************************************/
        async function Create_US_StatesOutline(filepath) {

            let promisedata = async() => {
                let response = await fetch( filepath, {
                    Method: "GET",
                    Headers: {"Content-type": "application/text;charset=UTF-8"}
                });
                let text = await response.text();
                let json = await JSON.parse(text);
                return json;
            };
            let data = await promisedata();

            const setStyle = (feature) => {
                return {
                    color: 'black', //fixed bluish color
                    fillColor: 'black', //fixed bluish color
                    fillOpacity: 0.0,
                    opacity: 0.6, 
                    weight: 2
                };
            };

            const HighLightFeature = (e) => {
                let layer = e.target;
                let ZLevel = map_globals.map.getZoom();
                let ZoutThres =  map_globals.US_States_ZThresholds.zout;
                let tooltiptext = `<b>${layer.feature.properties.name}</b>`;
                layer.bindTooltip(tooltiptext , { interactive: false, direction: 'auto'}).openTooltip();
    
                if(ZLevel <= ZoutThres ) {
                    layer.setStyle({
                        weight: 5,
                        color: '#666',
                        fillColor: '#666',
                        dashArray: '-',
                        fillOpacity: 0.3
                    });
                    layer.on('click', zoomToFeature, this);
                } else {
                    layer.off('click', this);
                    layer.unbindTooltip();
                }
            
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    if(ZLevel <= ZoutThres) 
                        layer.bringToFront();
                    else
                        layer.bringToBack();
                }
            };
            
            const ResetHighLight = (e) => {
                var layer = e.target;
            
                layer.setStyle({
                    fillColor: 'black',
                    color: 'black',
                    fillOpacity: 0.0,
                    opacity: 0.6, 
                    weight: 2 
                    });
            };

            /*********************************************/
            /* When a hightlighted features get clicked, */
            /* this function zooms in to its bounds      */
            /*********************************************/
            function zoomToFeature(e) {
                let layer = e.target;
                let map = map_globals.map;
                let StateNo = StateNumber[e.target.feature.properties.name];
                // Update to State selected
                map_globals.state = SearchKeyValue(StateNo);           
                map.fitBounds(layer.getBounds());
                if (StateNo != "") {
                    let switches = map_globals.switches;
                    // Remove old County boundaries
                    if( switches[1].children[1].checked ) Toggle_County_Layer();
                    map_globals.US_County_Boundaries.pop();
                    // Create new Boundaries
                    Create_County_Lines('./GeoJSON/US_StateCounty_Boundaries.json', StateNumber[map_globals.state]);
                    // Reset ToggleSwitches
                    Initial_ToggleSwitches_Settings();
                }
                setTimeout(() => { // allow time for fitBounds() to work.
                    let ZoutThres =  map_globals.US_Counties_ZThresholds.zout;
                    if(map.getZoom() < ZoutThres) map.setZoom(ZoutThres + 1);
                    ResetHighLight(e);
                    e.target.bringToBack(); 
                },2000);
            }       

            /* ===> Animate some features but only when zoomed out <=== */
            const onEachFeature = (feature, layer) => {
                layer.on({
                    mouseover: HighLightFeature,
                    mouseout: ResetHighLight,
                    click: zoomToFeature
                });
            }

            map_globals.US_States = data;

            /* Create GEOJson Layer and display it */
            map_globals.US_States_Boundaries.push( L.geoJson( Object.freeze(data), { onEachFeature: onEachFeature, style: setStyle })
                                                    .addTo(map_globals.map)
                                                    .bringToBack() );
        }

        /********************************************************/
        /* Function to load this states County GEOJSON outlines */
        /********************************************************/
        async function Create_County_Lines(filepath, STATE) {
            let promisedata = async() => {
                let response = await fetch( filepath, {
                    Method: "GET",
                    Headers: {"Content-type": "application/text;charset=UTF-8"}
                });
                let text = await response.text();
                let json = await JSON.parse(text);
                return json;
            };
            let data = await promisedata();

            const setStyle = (feature) => {
                // Lookup matching County for the Color to use
                let County = [];
                if(GetCountySettings() === "CCSA") 
                    County = Marker_global_vars.CC.filter((ThisCounty) => (ThisCounty.State.localeCompare(map_globals.state) === 0 && feature.properties.NAME.localeCompare(ThisCounty.County) === 0)  ? true : false);

                return {
                    fillColor: ( County.length !== 0 ) ? County[0].Color : 'transparent', //fixed bluish color,
                    color: '#666', //'#3388ff'
                    opacity: 0.6,
                    fillOpacity: 0.3,
                    weight: 2
                };
            };

            const HighLightFeature = (e) => {
                let layer = e.target;
                let ZLevel = map_globals.map.getZoom();
                let ZinThres = map_globals.US_Counties_ZThresholds.zin;
                let ZoutThres =  map_globals.US_Counties_ZThresholds.zout;
                let tooltiptext = `<b>${layer.feature.properties.NAME}</b>`;

                if( ZLevel >= ZoutThres && ZLevel <= ZinThres ) {
                    layer.setStyle({
                        weight: 5,
                        color: 'black',
                        opacity: 1,
                        fillColor: "darkgray",
                        fillOpacity: 0.3
                    });
                    layer.bindTooltip(tooltiptext, {interactive: false, direction: 'top'}).openTooltip();
                } else {
                    ResetHighLight(e);
                    layer.unbindTooltip();
                }

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    if(ZLevel >= ZoutThres && ZLevel <= ZinThres)
                        layer.bringToFront();
                    else
                        layer.bringToBack();
                }
            };

            const ResetHighLight = (e) => {
                var layer = e.target;

                // Lookup matching County for the Color to use
                let County = [];
                if(GetCountySettings() === "CCSA")
                    County = Marker_global_vars.CC.filter((ThisCounty) => (ThisCounty.State.localeCompare(map_globals.state) === 0 && layer.feature.properties.NAME.localeCompare(ThisCounty.County) === 0)  ? true : false);

                layer.setStyle({
                    fillColor: ( County.length !== 0 ) ? County[0].Color : 'transparent', //fixed bluish color,
                    color: '#666',
                    fillOpacity: 0.3,
                    opacity: 0.6, 
                    weight: 2 
                });
            };

            /*********************************************/
            /* When a hightlighted features get clicked, */
            /* this function zooms in to its bounds      */
            /*********************************************/
            const zoomToFeature = (e) => {
                const map = map_globals.map;
                map.spin(true);
                map.fitBounds(e.target.getBounds());
                setTimeout(() => { // allow time for fitBounds() to work.
                    let ZoutThres =  map_globals.US_Counties_ZThresholds.zout;
                    if(map.getZoom() < ZoutThres) map.setZoom(ZoutThres + 1);
                    ResetHighLight(e);
                    e.target.bringToBack(); 
                    map.spin(false);
                },2000);          
            };

            const onEachFeature = (feature, layer) => {
                layer.on({
                    mouseover: HighLightFeature,
                    mouseout: ResetHighLight,
                    click: zoomToFeature
                });
            };

            let subsetdata = data.features.filter(StateCounty => {
                return StateCounty.properties.STATE === STATE;
            });
        
            map_globals.US_County_Boundaries.push( L.geoJson(subsetdata, { onEachFeature: onEachFeature, style: setStyle }).addTo(map_globals.map).bringToFront() );
                
        }

        /************************************************/
        /* Function to load US Zipcode GEOJSON outlines */
        /************************************************/
        async function Create_ZipCode_Lines(filepath, STATE) {

            let promisedata = async() => {
                let response = await fetch( filepath, {
                    Method: "GET",
                    Headers: {"Content-type": "application/text;charset=UTF-8"}
                });
                let text = await response.text();
                let json = await JSON.parse(text);
                return json;
            };
            let data = await promisedata();
                
            const setStyle = (feature) => {
                let Zip = [];
                if(GetZipcodeSettings() === "CCSA")
                    Zip = Marker_global_vars.ZipCC.filter((item, index, arr) => (feature.properties.ZCTA5CE10.localeCompare(item.Zip) === 0) ? true : false);
                return {
                    fillColor: ( Zip.length !== 0 ) ? Zip[0].Color : 'transparent',
                    color: 'royalblue', //fixed bluish color,
                    fillOpacity: 0.3,
                    opacity: 0.6,
                    weight: 1
                }
            };

            const HighLightFeature = (e) => {
                var layer = e.target;
                let ZLevel = map_globals.map.getZoom();
                let ZinThres = map_globals.US_Zipcodes_ZThresholds.zin;
                let tooltiptext = `<b>ZipCode<br>${layer.feature.properties.ZCTA5CE10}</b>`;
                if(ZLevel >= ZinThres ) {
                    if(GetZipcodeSettings() === "CCSA") {
                        layer.setStyle({
                            weight: 5,
                            color: 'black',
                            opacity: 1
                        });
                    }
                    else {
                        layer.setStyle({
                            weight: 5,
                            color: 'black',
                            opacity: 1,
                            fillColor: "cornflowerblue",
                            fillOpacity: 0.3
                        });
                        layer.bindTooltip(tooltiptext, {interactive: false, direction: 'auto'}).openTooltip();
                    }
                } else {
                    layer.unbindTooltip();
                }
            
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    if(ZLevel >= ZinThres) 
                        layer.bringToFront();
                    else
                        layer.bringToBack();
                }
            };
            
            const ResetHighLight = (e) => {
                var layer = e.target;
                let Zip = [];
                if(GetZipcodeSettings() === "CCSA")
                    Zip = Marker_global_vars.ZipCC.filter((item) => (layer.feature.properties.ZCTA5CE10.localeCompare(item.Zip) === 0) ? true : false);
                layer.setStyle({
                                fillColor: ( Zip.length !== 0 ) ? Zip[0].Color : 'transparent',
                                color: 'royalblue',
                                fillOpacity: 0.3,
                                opacity: 0.3, 
                                weight: 1
                            });
                layer.unbindTooltip();
            };

            const zoomToFeature = (e) => {
                let layer = e.target;
                map_globals.map.fitBounds(layer.getBounds());
            } 
            
            const onEachFeature = (feature, layer) => {
                if(layer.options.fillColor !== "transparent") {
                    L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                        className: 'leaflet-label',
                        html: feature.properties.ZCTA5CE10,
                        iconSize: [40, 20]
                        })
                    }).addTo(map_globals.map);
                }
                layer.on({
                    mouseover: HighLightFeature,
                    mouseout: ResetHighLight,
                    click: zoomToFeature
                });
            };

            let StateName2Match = SearchKeyValue(STATE);
            let subsetdata = data.features.filter(feature => {
                // let Zipcode = feature.properties.ZCTA5CE10;
                let StateName2Compare = feature.properties.StateName;
                // let StateName2Compare = ZipCodeToStateName(Zipcode);
                return ( StateName2Match === StateName2Compare ) ? true : false;
            });
        
            map_globals.US_Zipcode_Boundaries.push(  L.geoJson(subsetdata, { onEachFeature: onEachFeature, style: setStyle }) );               

            EnableZipCodeOutlineSelect();
        }

        /*******************************************/
        /* Function to initialize GEOJSON outlines */
        /*******************************************/
        function InitializeMapBorders() {
        
            /*****************************************/
            /* Adds Each State's outline to the map  */
            /*****************************************/
                if( map_globals.US_States_Boundaries && map_globals.map.hasLayer(map_globals.US_States_Boundaries) )
                    Toggle_State_Layer();

                Create_US_StatesOutline('./GeoJSON/US_StateLines.json').then(result => {return result;});


            /******************************************/
            /* Adds County line boundaries to the map */
            /******************************************/
                if( map_globals.US_County_Boundaries && map_globals.map.hasLayer(map_globals.US_County_Boundaries) )
                    Toggle_County_Layer();

                Create_County_Lines('./GeoJSON/US_StateCounty_Boundaries.json', StateNumber[map_globals.state]).then(result => {return result;});

            /*******************************************/
            /* Adds ZipCode line boundaries to the map */
            /*******************************************/
                if( map_globals.US_Zipcode_Boundaries && map_globals.map.hasLayer(map_globals.US_Zipcode_Boundaries) )
                    Toggle_Zipcode_Layer();

                Create_ZipCode_Lines('./GeoJSON/US_ZipCode_Boundaries2.json', StateNumber[map_globals.state]).then(result => {return result;});

        }

