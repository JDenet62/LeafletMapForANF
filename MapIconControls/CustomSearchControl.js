/* Adds a custom Search icon control */
const IconBoxBtn5Control =  L.Control.extend({        
  options: {
    position: 'topright'
  },
  onAdd: function () {
    let IconBoxBtn5 = L.DomUtil.create('div', 'IconBoxBtn5Ctrl leaflet-bar leaflet-control leaflet-control-custom');
    IconBoxBtn5.style.backgroundColor = "ivory";     
    IconBoxBtn5.style.width = '36px';
    IconBoxBtn5.style.height = '36px';
    IconBoxBtn5.style.border = '1px solid black'; 
    IconBoxBtn5.style.margin = '0px 10px';
    IconBoxBtn5.style.backgroundImage = 'url("./images/SearchIcon.png")';
    IconBoxBtn5.style.backgroundSize = "100% 100%";
    IconBoxBtn5.style.backgroundPosition = "center";
    IconBoxBtn5.style.opacity = '0.8';
    IconBoxBtn5.style.boxSizing = "border-box";
    IconBoxBtn5.title = "Search & Locate Control"; 
    CustomElementSelector.IconBoxBtn5.IconBoxBtn5Ctrl = IconBoxBtn5; 

    const ArrowHead =L.DomUtil.create('div','arrow leaflet-bar leaflet-control leaflet-control-custom');
    ArrowHead.style.border = 'solid black';
    ArrowHead.style.borderWidth = '0 3px 3px 0';
    ArrowHead.style.display = 'inline-block';
    ArrowHead.style.padding = '3px';
    ArrowHead.style.position = 'absolute';
    ArrowHead.style.bottom = '0px';
    ArrowHead.style.left = '50%';
    ArrowHead.style.transform = 'rotate(45deg) translateX(-50%)';
    CustomElementSelector.IconBoxBtn5.ArrowHead = ArrowHead;

    /*===> Attach HTML children elements in proper order <===*/
    const SearchField = CustomElementSelector.IconBoxBtn5.SearchField;
    const Selector = CustomElementSelector.IconBoxBtn5.Selector;
    IconBoxBtn5.appendChild(SearchField);
    SearchField.appendChild(Selector);

    /*===============> Setup Event listeners <===============*/
    IconBoxBtn5.onclick = SearchCtrl_Toggle;
    const SearchBtn = CustomElementSelector.IconBoxBtn5.SearchBtn;
    SearchField.onkeypress = check4Enter;
    Selector.onclick = doNothing;
    SearchField.onclick = doNothing;
    SearchBtn.onclick = SearchForIt;
    ArrowHead.onclick = toggleList;
    map_globals.map.on('zoomend', MarkLocation, this);
     
    /*=====> Click Event Handlers & associated Helper Functions <=====*/
    function SearchCtrl_Toggle(ev){
      ev.preventDefault();
      if(CC_GlobalVars.debounce === false && !MutuallyExclusive.IconBoxBtn7_Active) {
        CC_GlobalVars.debounce = true;
        MutuallyExclusive.IconBoxBtn5_Active = (IconBox5Ctrl_ctrlToggleDisplay() === 'flex') ? true : false;
        IconBox5Div_ToggleStyles();
        setTimeout(() => CC_GlobalVars.debounce = false, 350);
      }
    }

    function doNothing(ev) {ev.stopPropagation()}; // do nothing click event handler

    function IconBox5Ctrl_ctrlToggleDisplay() {
      const SearchField = CustomElementSelector.IconBoxBtn5.SearchField;
      const InputField = CustomElementSelector.IconBoxBtn5.InputField;
      let display = SearchField.style.display;
      display = SearchField.style.display = ((display === 'flex') ? 'none' : 'flex');
      //(display === 'flex') ? map_globals.map.dragging.disable() : map_globals.map.dragging.enable();
      if(display === 'flex') {SearchField.focus(); InputField.focus(); }
      else  map_globals.map.on('zoomend', this);

      return display;
    }

    function IconBox5Div_ToggleStyles() { // Animate Icon button push
      const IconBoxBtn5Ctrl = CustomElementSelector.IconBoxBtn5.IconBoxBtn5Ctrl;
      const ONOFF = MutuallyExclusive.IconBoxBtn5_Active;
      IconBoxBtn5Ctrl.style.border = ((ONOFF) ? 'medium inset ivory' : 'thin outset black');
      IconBoxBtn5Ctrl.style.boxShadow = ((ONOFF) ? "5px 5px 8px darkgray inset" : "none");
      if(!ONOFF) clearSelectableChoices(); // clears out old results
    }

    function check4Enter(ev) {
      const SearchBtn = CustomElementSelector.IconBoxBtn5.SearchBtn;
      if (ev.code === 'Enter')
        SearchBtn.click();        
    }

    /*=================> Search Function <=================*/
    function SearchForIt(ev) {
      const InputField = CustomElementSelector.IconBoxBtn5.InputField;
      const ArrowHead = CustomElementSelector.IconBoxBtn5.ArrowHead;
      const Selector = CustomElementSelector.IconBoxBtn5.Selector;
      const searchstring = InputField.value;
      map_globals.map.spin(true);
      /* ===========================================================================*/
      /*          FG = Foreground Process  BG = Background Process Problem          */
      /* ===========================================================================*/
      /* map_globals.map.spin(true) running in the BG or FG would not show up in    */
      /* the display! It was determined there wasn't enough time allowed for the    */
      /* map to update. This is due to the relationship between BG and FG queues    */
      /* and how threading is processed.                                            */
      /*                                                                            */
      /* The background process can only run if foreground process queue complete or*/ 
      /* gaps exist in the FG process. So in this case to much happening in FG then */
      /* BG can't run. So I wrapped the remainder of the function in a background   */ 
      /* process allowing enough time for the spinner to appear and start.          */
      /* ===========================================================================*/
      setTimeout(() => {
        /*===> is the search empty <===*/
        if(searchstring.split('').length == 0) return;
        /*===> search for location list <===*/
        if( Lookup(searchstring) ) {
          if(listItems.length > 0) {
            /*==> Enable the box which holds the listing choices <==*/
            Selector.style.display = 'flex';
            Selector.appendChild(ArrowHead);

            listItems.forEach((item,index) => {
                const button =  L.DomUtil.create('button', 'ListChoice');
                if(item.Formatted !== undefined) {
                  button.innerText = item.Formatted;
                } else {
                  button.innerText =
                  item.Name + ' ' +
                  item.Address1 + ',' +
                  item.City + ',' +
                  item.State + ' ' +
                  item.ZIP;
                }
                button.value = index;
                button.onclick = ProcessListChoice;        
                CustomElementSelector.IconBoxBtn5.Buttons.push(button);
            });
          } else Selector.style.display = "none"; 
          CustomElementSelector.IconBoxBtn5.Buttons.forEach(button => button.disabled = true);
          rolloutChoiceList();
        }
      }, 180);
    }
    
    function ProcessListChoice(ev) {
      ev.stopPropagation();
      const index = ev.target.value;
      const Record = listItems[index];
      CC_GlobalVars.RecordToUse = Record;
      // First check if Map Coordinates Available
      if( Record.Latitude !== "" || Record.Longitude !== "" ) {
        CC_GlobalVars.markerWatch1 = true;
        // Fly to new Map Coordinates
        map_globals.map.flyTo([Record.Latitude, Record.Longitude],15);
        const wait4Flag = function(flag) { setTimeout(() => { return flag; }, 2000 ); };
        const bbox = actionItems[index]; // retrieve box bounds
        if( bbox && bbox !== null) { // if BBox available process
          while(wait4Flag(CC_GlobalVars.markerWatch1)) {}; // wait until flyover complete
          setTimeout(() => { map_globals.map.fitBounds(bbox);  }, 8000); // Zoom out to outline bounds
        } 
      } else alert("Error: Record lacks any viable Map Coordinates!"); // no map coordinates
      // now that a selection has been choosen and processed, retract items in pulldown list.
      retractChoiceList();
    }

    function MarkLocation() {
      if(CC_GlobalVars.markerWatch1) {
        setTimeout(() => {
          const Record = CC_GlobalVars.RecordToUse;
          CreateMarker(Record,"greenICON", "white" ,"white", "S");
          const thisMarker = Marker_global_vars.MarkerLayers[Marker_global_vars.MarkerLayers.length - 1];
          Marker_global_vars.mySubGroup.removeLayer(thisMarker);
          thisMarker.addTo(map_globals.map);
          // thisMarker.refreshIconOptions({}, true);
        }, 1200);
        CC_GlobalVars.markerWatch1 = false;
      }
    }

    /*======> Functions used to display & handle the Search Results <======*/
    function toggleList(ev) {
      ev.stopPropagation();     
      const Selector = CustomElementSelector.IconBoxBtn5.Selector;
      if ( Selector.childElementCount > 1 ) 
        retractChoiceList();
      else
        rolloutChoiceList();
    }

    function rolloutChoiceList() {
      const SearchField = CustomElementSelector.IconBoxBtn5.SearchField;
      SearchField.onkeypress = doNothing;
      const buttons = CustomElementSelector.IconBoxBtn5.Buttons;
      const Selector = CustomElementSelector.IconBoxBtn5.Selector;
      const ArrowHead = CustomElementSelector.IconBoxBtn5.ArrowHead;
      ArrowHead.style.transform = 'rotate(45deg)';
      let listLength = (buttons.length > 12) ?  12 : buttons.length - 1;
      for(let i=0; i <= listLength; i++) {
          const button = buttons[i];  
          setTimeout(() => { Selector.appendChild(button); SearchField.onkeypress = check4Enter; }, i * 75);
      }
      buttons.forEach(button => button.disabled = false);
      setTimeout(() => { map_globals.map.spin(false); }, 180);
    }

    function retractChoiceList() {
      const SearchField = CustomElementSelector.IconBoxBtn5.SearchField;
      SearchField.onkeypress = doNothing;
      const Selector = CustomElementSelector.IconBoxBtn5.Selector;
      const buttons = CustomElementSelector.IconBoxBtn5.Buttons;
      const ArrowHead = CustomElementSelector.IconBoxBtn5.ArrowHead;
      ArrowHead.style.transform = 'rotate(-135deg) translateY(-50%)';
      let listLength = (buttons.length > 12) ?  12 : buttons.length - 1;
      buttons.forEach(button => button.disabled = true);
      for(let i=listLength; i >= 0; i-- ) {
        const button = buttons[i];  
        setTimeout(() => { Selector.removeChild(button); SearchField.onkeypress = check4Enter; }, i * 75);
      }
    }
    
    return IconBoxBtn5;
  },

  onRemove: function() {
    const ArrowHead = CustomElementSelector.IconBoxBtn5.ArrowHead;
    const IconBoxBtn5 = CustomElementSelector.IconBoxBtn5.IconBoxBtn5Ctrl;
    const SearchField = CustomElementSelector.IconBoxBtn5.SearchField;
    const Selector = CustomElementSelector.IconBoxBtn5.Selector;
    const SearchBtn = CustomElementSelector.IconBoxBtn5.SearchBtn;

    IconBoxBtn5.removeChild(SearchField);
    SearchField.removeChild(Selector);

    /*===> setup event listeners <===*/
    IconBoxBtn5.onclick = null;
    SearchField.onkeypress = null;
    Selector.onclick = null;
    SearchField.onclick = null;
    SearchBtn.onclick = null;
    ArrowHead.onclick = null;
    map_globals.map.off('zoomend', "MarkLocation", this);

  }
});
