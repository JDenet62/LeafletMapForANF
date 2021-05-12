"use strict"

let GJSONShapes = [];
let RegionShapes = [];

/*********************************************/
/* function use to draw Circles based upon a */
/* center point and the radius in miles      */
/*********************************************/
function CreateCircle(latlng, CustomColor, miles) {
    let setStyle = null;
    
    /* draw circle defining border & fill colors */
    if( typeof CustomColor === 'object' &&
        typeof CustomColor.Color === 'string' &&
        typeof CustomColor.FillColor === 'string'
      ) { 
            setStyle = {
                fillColor: CustomColor.FillColor,
                color: CustomColor.Color,
                fillOpacity: 0.2,
                opacity: 1, 
                weight: 2
            };
        }
    
       
    /* if arguments are valid */    
    if(  typeof latlng.lat == 'number' &&
         typeof latlng.lng == 'number' &&
         typeof CustomColor.Color === 'string' &&
         typeof CustomColor.FillColor === 'string' &&
         typeof miles == 'number' &&
         Number.isInteger(miles.valueOf())
    )
    { 
        let layer = drawCircle(latlng, miles, setStyle);
        saveShapeAsGeoJSON( layer );
    } else { console.log('invalid arguments'); }
}

function drawCircle (latlng, miles, setStyle) {
    /* calculate the circle radius in meters */
    const Meters = convertMilesToMeters(miles);
    const circle = L.circle(latlng, { radius: Meters });
    circle.setStyle(setStyle);
    circle.options.type = 'circle';
    addTooltipToShapeLayer(circle);
    return circle;
}

function convertMilesToMeters(miles) {
    return (miles && miles > 0) ? Math.round((miles * 1609) / 2) : 12068;
}

function convertMetersToMiles(meters) {
    return (meters && meters > 0) ? Math.round(meters / 1609) : 15;
}

function addTooltipToShapeLayer(layer) {
    let TooltipMessage;
    const meters = (layer.options.radius) ?  layer.options.radius : map_globals.map.distance(layer._latlngs[0],layer._latlngs[1]);
    const miles = convertMetersToMiles(meters);

    switch(layer.options.type) {
        case 'polyline':
            TooltipMessage = `${miles} miles long`;
            break;
        case 'circle':
            TooltipMessage = `${miles} miles radius or ${miles * 2} wide`;
            break;
        default:
          break;
      };
    layer.bindTooltip(TooltipMessage);
}

function saveShapeAsGeoJSON(layer, layerIndex) {
    if(layer._mRadius !== undefined)
        layer.options.radius = layer._mRadius;
    let layerGeoJSON = layer.toGeoJSON(); 
    if(layerGeoJSON == null)
        return;
    layerGeoJSON.properties.options = layer.options;
    if(layer._mRadius !== undefined) 
        layerGeoJSON.properties.options.radius = layer._mRadius;
    if(layer._tooltip !== undefined )
        layerGeoJSON.properties.bindTooltip = layer._tooltip._content;
    GJSONShapes[layerIndex] = JSON.stringify(layerGeoJSON);
}

function deleteShapeAsGeoJSON(layerIndex) {
    /* ===> delete element assumes dual tracking arrays (i.e. equal length) <=== */
    GJSONShapes.splice(layerIndex, 1); // GeoJSON Array for storage;
    RegionShapes.splice(layerIndex, 1); // Array for Layer ON/OFF control;

    /* ===> update remaining array index numbers since one got removed <=== */
    for ( let index = layerIndex; index < GJSONShapes.length; index++ )
    {
        // Convert from JSON => Object then (update indexes on array) and reconvert back Object => JSON
        let GeoJSONLayer = JSON.parse(GJSONShapes[index]); //parse it out to access GeoJSON object
        GeoJSONLayer.properties.options.LayerIndex = index; //update GeoJSON object
        GJSONShapes[index] = JSON.stringify(GeoJSONLayer); // convert it back with changes added
        // update indexes on array;
        RegionShapes[index].options.LayerIndex = index; // already an object so just access it directly.
    }
    //localStorage.setItem("Shapes", JSON.stringify(GJSONShapes));
}

function restoreShapeLayer(Geo1Source) {
    /*===> get saved array of GeoJSON Circles <===*/
    let GJSONarray = Geo1Source;
    if(GJSONarray === undefined || GJSONarray === null || !GJSONarray.length) return;
    GJSONShapes = GJSONarray; // update modual GeoJSON array
    /*===> Recontruct each circle in the array <=== */
    GJSONarray.forEach(layer_GeoJSON => {
        /* ===> Define Variables <=== */
        let layer, points, latlng = [], latlngs = [];
        /* ===> Define Object Variables <=== */       
        const thisLayer = JSON.parse(layer_GeoJSON);
        const options = thisLayer.properties.options;
        const layerType = thisLayer.properties.options.type;
        const tooltip   = thisLayer.properties.bindTooltip;

        /* ===> GeoJSON Objects are accessed differently Group them <=== */
        switch(layerType) {
            case 'polyline':
                points = thisLayer.geometry.coordinates;
                break;
            case 'rectangle':
            case 'polygon':
                points = thisLayer.geometry.coordinates[0];
                break;
            case 'circlemarker':
            case 'marker':
            default:
                latlng = {'lat': thisLayer.geometry.coordinates[1], 'lng': thisLayer.geometry.coordinates[0]};
                break;
        };

        if(latlng.length === 0) {
            points.forEach((latlng,index) => {
                const point = {'lat': latlng[1], 'lng': latlng[0]};
                latlngs.push(point);
            });
        }

        switch(layerType) {
            case 'circle':
                layer = L.circle(latlng, options);
                layer.options.type = 'circle';
                addTooltipToShapeLayer(layer);
                break;
            case 'circlemarker':
                layer = L.circleMarker(latlng, options);
                layer.options.type = 'circlemarker';
                break;
            case 'marker':
                layer = new L.Marker.SVGMarker(latlng, {
                    iconOptions: {
                        color: options.color,
                        fillColor: options.color,
                        fillOpacity: 1,
                        circleFillColor: "white",
                        circleColor: "white",
                        circleText: "*"
                      }
                    })
                    .bindTooltip(tooltip, {direction: 'top', offset: [0,-30]})
                    .on('click', onClick);
                layer.options.type = 'marker';
                break;
            case 'polyline':
            layer = L.polyline(latlngs, options);
            layer.options.type = 'polyline';
            addTooltipToShapeLayer(layer);
            break;
            case 'rectangle':
                layer = L.rectangle(latlngs, options);
                layer.options.type = 'rectangle';
                break;
            case 'polygon':
                layer = L.polygon(latlngs, options);
                layer.options.type = 'polygon';
                break;
            default:
                break;
        }
        RegionShapes.push(layer);
        map_globals.ShapesLayerGroup.addLayer(layer);
    });
}

/*****************************************************/
/* Function to initilize Leaflet.draw drawing plugin */
/*****************************************************/
function Setup_Leaflet_Draw_Package() {
    /*===> Initialize Leaflet.Draw plugin controls <===*/
    // holds the current drawn objects layers
    map_globals.ShapesLayerGroup = new L.FeatureGroup(RegionShapes);

    /*===> Enable just the options used in the drawing ICON Control <===*/
    var drawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
            polyline: { //readout units in Yards & Miles
                        metric: false,
                        feet: false,
                        nautic: false,
                        maxPoints: 2
                    },
            polygon: true,
            rectangle: true,
            circle:  { //readout units in Yards & Miles
                        metric: false,
                        feet: false,
                        nautic: false
                    },
            marker: true,
            circlemarker: false
        },
        edit: {
            featureGroup: map_globals.ShapesLayerGroup,
            remove: true
        }
    });

    /*===> Save this control to be added & removed by my ICON draw control <===*/
    CC_GlobalVars.drawControl = drawControl;
    map_globals.map.addLayer(map_globals.ShapesLayerGroup); // add marker layer group to the Map!!
    
    /*===> Setup the onDraw event map listener <===*/
    map_globals.map.on(L.Draw.Event.CREATED, function (ev) {
        let type = ev.layerType;
        let layer = ev.layer;
        let index = RegionShapes.length;

        /*===> Apply the color selected by my Custom Control on each .draw shape <===*/
        layer.options.color = CustomElementSelector.CustomColor.Color;
        /*===> Apply array index for selection by my Custom Control <===*/
        layer.options.LayerIndex = index;
        
        /*===>  Apply to correct layer group <===*/
        if(type === 'polyline') layer.options.weight = 8;

        /*===> adds Tooltip and implements and saves layer as GeoJson <===*/
        switch(type) {
            case 'polyline':
                /*===> Saving type here below, insures its passed along when converted to GeoJSon <===*/
                layer.options.type = 'polyline';
                addTooltipToShapeLayer(layer);
                break;
            case 'circle':
                /*===> Saving type here below, insures its passed along when converted to GeoJSon <===*/
                layer.options.type = 'circle';
                addTooltipToShapeLayer(layer);
                break;
            case 'polygon':
                layer.options.type = 'polygon';
                break;
            case 'rectangle':
                layer.options.type = 'rectangle';
                break;
            case 'circlemarker':
                layer.options.type = 'circlemarker';
                break;
            case 'marker':
                layer.options.type = 'marker';
                layer.on('click', onClick);
                break;              
            default:
                break;
        };
        map_globals.ShapesLayerGroup.addLayer(layer);
        RegionShapes.push(layer);
        saveShapeAsGeoJSON(layer, index);
    });

    /*===> keep count of items that got edited <===*/
    map_globals.map.on(L.Draw.Event.EDITED, function (ev) {
        let layers = ev.layers;
        layers.eachLayer(function (layer) {
            setTimeout(() => { saveShapeAsGeoJSON(layer, layer.options.LayerIndex); }, 1000);
        });
    });

    map_globals.map.on(L.Draw.Event.DELETED, function (ev) {
        let layers = ev.layers;
        layers.eachLayer(function (layer) {
            setTimeout(() => { deleteShapeAsGeoJSON(layer.options.LayerIndex); }, 1000);
        });
    });
}
