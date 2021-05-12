"use strict"

function findISOChrone(latlng, TimeInMin, CustomColor, API_token) {
    let setStyle;

    if( typeof CustomColor === 'object' && CustomColor.Color !== 'undefined' && CustomColor.FillColor !== 'undefined' ) 
    {
        setStyle = {
                fillColor: CustomColor.FillColor,
                color: CustomColor.Color,
                fillOpacity: 0.2,
                opacity: 1
        };
    } else { setStyle = {}; alert('improper CustomColor object to color ISOChrone'); }

    if( 
        latlng !== undefined &&
        typeof latlng === 'object' &&
        typeof latlng.lat === 'number' &&
        typeof latlng.lng === 'number' &&
        Number.isInteger(TimeInMin) &&
        API_token !== null 
      ) {
        let TimeInSeconds = TimeInMin * 60; // conver Time param to seconds;
        const url = 'https://api.geoapify.com/v1/isoline?' +
                    `lat=${latlng.lat}` +
                    `&lon=${latlng.lng}` +
                    '&type=time' +
                    '&mode=drive' +
                    `&range=${TimeInSeconds}` +
                    `&apiKey=${API_token}`;
        fetch(url)
        .then(response => response.json())
        .then(data => { saveISOChrone(drawISOChrone(data, setStyle)); })
        .catch(err => alert(`This Error Occured calling for ISOChrone\n${err}`));
    } else alert('improper information to create ISOChrone');
}

function drawISOChrone(data, setStyle){
    /*===> Create and translate the necessary infomation needed <===*/
    const Minutes = Math.round(data.features[0].properties.range / 60);
    const TooltipMessage = `reachable area within<br>${Minutes} minute drive`;
    /*===> Process the GeoJSON information <===*/
    const ISOChrone = L.geoJson(data, { style: setStyle })
                       .bindTooltip(TooltipMessage)
                       .addTo(map_globals.map)
                       .bringToBack();
    /*===> Save info in the layer for reconstruction when it's needed later <===*/
    ISOChrone.options.type = "DrvMap"
    ISOChrone.options.setStyle = setStyle;
    ISOChrone.options.bindTooltip = TooltipMessage;
    ISOChrone.options.LayerIndex = ISOChrones.length;

    /*===> Append layer info to array for applying to the map & layer controls <===*/        
    ISOChrones.push(ISOChrone);
    return ISOChrone; // return this new layer so it gets Pass it to SaveISOChrone below
}

function saveISOChrone(ISOChrone) {
    /*===> Reconstruct baseline GeoJSON data from this layer <===*/
    let ISOChroneInGeoJSONForm = ISOChrone.toGeoJSON();
    /*===> Copy the info from the layer to the GeoJSON for reconstruction later <===*/
    ISOChroneInGeoJSONForm.features[0].properties.bindTooltip = ISOChrone.options.bindTooltip;
    ISOChroneInGeoJSONForm.features[0].properties.setStyle = ISOChrone.options.setStyle;
    /*===> Save GeoJSON layer into an array <===*/
    GeoJSON_ISOChrones.push(ISOChroneInGeoJSONForm);
    /*===> Save or re-save GeoJSON array into local storage <===*/
    // localStorage.setItem("ISOChrones", JSON.stringify(GeoJSON_ISOChrones));
}

function deleteISOChroneAsGeoJSON(layerIndex) {
    /* ===> delete element assumes dual tracking arrays (i.e. equal length) <=== */
    GeoJSON_ISOChrones.splice(layerIndex, 1); // GeoJSON Array for storage;
    ISOChrones.splice(layerIndex, 1); // Array for Layer ON/OFF control;

    /* ===> update remaining array index numbers since one got removed <=== */
    for ( let index = layerIndex; index < GeoJSON_ISOChrones.length; index++ )
        ISOChrones[index].options.LayerIndex = index; // already an object so just access it directly.

    //localStorage.setItem("ISOChrones", JSON.stringify(GeoJSON_ISOChrones));
}

function restoreISOChrones(Geo3Source) {
    /*===> get saved array of GeoJSON ISOChrones <===*/
    //let ISOChroneList = JSON.parse(localStorage.getItem('ISOChrones'));
    let ISOChroneList = Geo3Source;
    if(ISOChroneList === undefined || ISOChroneList === null) return;
    GeoJSON_ISOChrones = ISOChroneList;
    /*===> Recontruct each ISOChrone in the array <=== */
    ISOChroneList.forEach( ISOChroneInGeoJSONForm => {
        const TooltipMessage = ISOChroneInGeoJSONForm.features[0].properties.bindTooltip;
        const setStyle = ISOChroneInGeoJSONForm.features[0].properties.setStyle;
        /*===> Process GeoJSON data and send it to the map <===*/
        const ISOChrone = L.geoJSON(ISOChroneInGeoJSONForm, { style: setStyle })
                           .bindTooltip(TooltipMessage)
                           .addTo(map_globals.map)
                           .bringToBack();
        /*===> re-save info in the layer just incase it's needed later <===*/
        ISOChrone.options.type = "DrvMap"
        ISOChrone.options.setStyle = setStyle;
        ISOChrone.options.bindTooltip = TooltipMessage;
        ISOChrone.options.LayerIndex = ISOChrones.length;
        /*===> Append layer info to array for applying to the map & layer controls <===*/        
        ISOChrones.push(ISOChrone);
    });
}

let GeoJSON_ISOChrones = [];
let ISOChrones = [];

