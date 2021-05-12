"use strict"

/****************** creating the map *********************/
const map_globals = {
    'team': 'NoTeam',
    'sched': 'NoUser',
    'state': 'NoState',
    'filename': null,
    'wait4load': null,
    'data': null,
    'map_center': { lat:39.099724, lng:-94.578331 },
    'map': null,
    'markers': [],
    'MarkerGlobalVars': {},
    'MouseSelections': [], // holds latlng objects for varies controls
    "US_States_Boundaries": [],
    "US_States_ZThresholds": {zout: 5, zin: 5},
    "US_County_Boundaries": [], 
    "US_Counties_ZThresholds": {zout: 6, zin: 9},
    "US_Zipcode_Boundaries": [],
    "US_Zipcodes_ZThresholds": {zout: 10, zin: 10},
    "CountySettings": "BHTN",
    "ZipcodeSettings": "BHTN",
    "RouteDirection": [],
    'runOnce': true,      // flag to only run during setup thats it
    'BypassRouteInstructions': true,
    'ShapesLayerGroup': null,
    'BaseLayerGroup': null,
    'StateName': null,
    'PouchDB': null,
    'switches': [],
    'API_token': "7175817a2217478bbab35df62019df33"
};

/**************************************************************/
/* function called to create map after DOCUMENT DOM is Ready  */
/**************************************************************/
const readyState = function(e) { 
    /*****************************/
    /* Setup Modal Menu Handlers */
    /*****************************/
        SetupModalMenu().then(async (res) => {
            /************************/
            /* Initializes PouchDB  */
            /************************/
            if(res)
                await InitDB();
        });
    /*************************************/
    /* Creates and displays a basic map  */
    /*************************************/
        CreateMap();

    /* ======> The below section is all about adding Map Controls <====== */
    /* ===> NOTE: the sequence in which they are declared is import! <=== */
    
        /************************************************************/
        /* Setup and initialize the leaflet.sidebar plugin package  */
        /* and its associated Controls                              */
        /************************************************************/
            Setup_Sidebar_Plugin();

        /*********************************************************/
        /* Setup and initialize the leaflet.draw plugin package  */
        /* and its associated Controls                           */
        /*********************************************************/
            Setup_Leaflet_Draw_Package();

        /***************************************************/
        /* Creates & adds a map scale display to the map.  */
        /* NOTE: Remove the metric measurement             */
        /***************************************************/
            Setup_MapScale_Control();

        /********************************/
        /* Adds my Custom ICON controls */
        /********************************/
            Setup_CustomControls();

        /**********************************/
        /* Restore Saved Items to the Map */
        /**********************************/
            RegionShapes.forEach(layer => layer.addTo(map_globals.ShapesLayerGroup));
            
        /************************************************/
        /* Create layer groupings to turn them on & off */
        /************************************************/
            CustomElementSelector.IconBoxBtn4.MarkerLayerGroup = map_globals.markers;
            CustomElementSelector.IconBoxBtn4.ShapesLayerGroup = map_globals.ShapesLayerGroup;
            CustomElementSelector.IconBoxBtn4.RoutesLayerGroup = RouteLayers;
            CustomElementSelector.IconBoxBtn4.DriveMapLayerGroup = ISOChrones;
            
    /*=== end section on adding map controls ===*/
/*================== end of readyState() ====================*/
}
/*===> listener who calls readyState() which creates the map <===*/
window.addEventListener('DOMContentLoaded', readyState);
