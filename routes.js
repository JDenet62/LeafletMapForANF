"use strict"

let GEORoutes = [];
let RouteLayers = [];
/****************************************************/
/* Function generates a simple FROM_TO  route it    */
/* displays the Time to drive it, and the miles     */
/****************************************************/
function findRoute(obj1, obj2, CustomColor, API_token) {
    let setStyle;

    if( typeof CustomColor === 'object' &&
        CustomColor.Color !== 'undefined' &&
        CustomColor.Color !== null &&
        CustomColor.FillColor !== 'undefined' &&
        CustomColor.FillColor !== null
      ) 
    {
        /*===> Initalize style options <===*/
        setStyle = {
            fillColor: CustomColor.FillColor,
            color: CustomColor.Color,
            fillOpacity: 0.2,
            opacity: 1, 
            weight: 6
        };
    } else { setStyle = {}; alert('improper CustomColor object to color Route'); }


    /*===> If has obj1 & obj2 contains valid latitude & Longitude Info <===*/
    if( typeof obj1 + typeof obj2 === "objectobject" &&
        typeof obj1.lat === 'number' &&
        typeof obj1.lng === 'number' &&
        typeof obj2.lat === 'number' &&
        typeof obj2.lng === 'number' &&
        API_token !== null       
    ) {
        const url = 'https://api.geoapify.com/v1/routing?waypoints=' +
        `${obj1.lat},${obj1.lng}|${obj2.lat},${obj2.lng}&mode=drive&apiKey=${API_token}`;

        fetch(url)
        .then(response => response.json())
        .then(data => saveRoute( drawRoute(data, setStyle) ))
        .catch(err => alert(`This Error Occured calling for route\n${err}`) );
    }
};

function drawRoute(data, setStyle){
    /*===> convert returned seconds data into minutes for display <===*/
    let minutes = Math.round(data.features[0].properties.time / 60);
    let hours = (minutes > 60) ? Math.floor(minutes / 60) : 0;
    if(hours > 0) minutes -= hours * 60;
    /*===> convert returned Meters into Miles for display <===*/
    const miles = Math.round(data.features[0].properties.distance / 1609.34);   
    /*===> create Tooltip message <===*/
    const TooltipMessage = (hours > 0) ? `<b>${hours} hrs ${minutes} min ${miles} miles</b>` : `<b>${minutes} min ${miles} miles</b>`;
    /*===> Process GeoJSON data and send it to the map <===*/
    let myRenderer = new L.SVG({ padding: 0.5 });
    const route = L.geoJSON(data, { renderer: myRenderer, style: setStyle })
                        .on('click', RouteClickHandler)
                        .bindTooltip(TooltipMessage)
                        .addTo(map_globals.map)
                        .bringToFront();
    route.options.type = 'route';
    /*===> Add omportant options below for later to use <=== */
    route.options.type = "Route";
    route.options.setStyle = setStyle;
    route.options.bindTooltip = TooltipMessage;
    route.options.LayerIndex = RouteLayers.length;
    let sectionText = generateInstructions(data);
    console.log(sectionText);
    route.options.drivingIns = sectionText;
    /*===> record layer information <===*/
    RouteLayers.push(route);
    return route;
} 

function saveRoute(route) {
    /*===> Reconstruct baseline GeoJSON data from this layer <===*/
    let RouteInGeoJSONForm = route.toGeoJSON();
    /*===> Copy the info from the layer to the GeoJSON for reconstruction later <===*/
    RouteInGeoJSONForm.features[0].properties.type = route.options.type;
    RouteInGeoJSONForm.features[0].properties.setStyle = route.options.setStyle;
    RouteInGeoJSONForm.features[0].properties.bindTooltip = route.options.bindTooltip;
    RouteInGeoJSONForm.features[0].properties.drivingIns = route.options.drivingIns;
    /*===> Save GeoJSON layer into an array <===*/
    GEORoutes.push(RouteInGeoJSONForm);
}

function deleteRoutesAsGeoJSON(layerIndex) {
    /* ===> delete element assumes dual tracking arrays (i.e. equal length) <=== */
    GEORoutes.splice(layerIndex, 1); // GeoJSON Array for storage;
    RouteLayers.splice(layerIndex, 1); // Array for Layer ON/OFF control;

    /* ===> update remaining array index numbers since one got removed <=== */
    for ( let index = 0; index < GEORoutes.length; index++ )
        RouteLayers[index].options.LayerIndex = index; // already an object so just access it directly.
}

function restoreRoutes(Geo2Source){
    /*===> get saved array of GeoJSON Routes <===*/
    let GeoJSONRoutes = Geo2Source;
    if(GeoJSONRoutes === undefined || GeoJSONRoutes === null) return;
    GEORoutes = GeoJSONRoutes;
    /*===> Recontruct each Route in the array of Routes <=== */
    GeoJSONRoutes.forEach( GJSONRoute => {
        const drivingIns =  GJSONRoute.features[0].properties.drivingIns;
        const TooltipMessage = GJSONRoute.features[0].properties.bindTooltip;
        const setStyle = GJSONRoute.features[0].properties.setStyle;
        /*===> Process GeoJSON data and send it to the map <===*/
        const route = L.geoJSON(GJSONRoute, {style: setStyle})
                      .on('click', RouteClickHandler)
                      .bindTooltip(TooltipMessage)
                      .addTo(map_globals.map)
                      .bringToFront();
        /*===> re-save info in the layer just incase it's needed later <===*/
        route.options.type = 'Route';
        route.options.setStyle = setStyle;
        route.options.bindTooltip = TooltipMessage;
        route.options.LayerIndex = RouteLayers.length;
        route.options.drivingIns = drivingIns;
        /*===> record layer information <===*/
        RouteLayers.push(route);
    });
}

function generateInstructions(data) {
    // const legs = data.legs;
    const features = data.features;
    let instructions = "";
    features.forEach(feature => {
        let sidebar = CustomElementSelector.Sidebar;
        let legs = feature.properties.legs;
        instructions = '<br><h2 style="text-align: center;">Driving Directions</h2>' +
                       '_________________________________________________';
        legs.forEach(leg => {
            /*===> convert returned seconds data into minutes for display <===*/
            let minutes = Math.round(data.features[0].properties.time / 60);
            let hours = (minutes > 60) ? Math.floor(minutes / 60) : 0;
            if(hours > 0) minutes -= hours * 60;
            /*===> convert returned Meters into Miles for display <===*/
            const miles = Math.round(data.features[0].properties.distance / 1609.34);
            /*===> create Tooltip message <===*/
            if(hours > 0) 
                instructions += `<h3 style="text-align:center;">The Total is ${hours} Hrs ${minutes} minutes ${miles} miles</h3><br>`;
            else 
                instructions += `<h3 style="text-align:center;">The Total is ${minutes} minutes ${miles} miles</h3><br>`;
            let steps = leg.steps;
            let instrcount = 1;
            steps.forEach(step => {
                let units = step.distance;
                let time = step.time;
                let miles = (Math.round((units / 1609.34) * 100) / 100 ).toString() + ' miles ';
                let minutes = (Math.round((time / 60) * 100) / 100 ).toString() + " mins";
                instructions += '<h3>' + ((units !== 0) ? `${instrcount++}  ` : '*** ') + step.instruction.text + 
                                ((units !== 0) ? `...<h5><em>` + miles + minutes + "</h5></em><br>" : " ***") +
                                "</h3>";
            })

        });
        sidebar.setContent(instructions);
        if(!map_globals.BypassRouteInstructions)
            sidebar.show();
    });

    return instructions;
}

function RouteClickHandler(ev) {
    let sidebar = CustomElementSelector.Sidebar;
    let sectionText = ev.target.options.drivingIns;
    sidebar.setContent(sectionText);
    sidebar.show();
}

