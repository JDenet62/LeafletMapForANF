const IconBoxBtn7Control =  L.Control.extend({        
  options: {
    position: 'topright'
  },

  onAdd: function () {
    let IconBoxBtn7 = L.DomUtil.create('div', 'IconBoxBtn7Ctrl leaflet-bar leaflet-control leaflet-control-custom');
    IconBoxBtn7.style.backgroundColor = 'white';     
    IconBoxBtn7.style.width = '36px';
    IconBoxBtn7.style.height = '36px';
    IconBoxBtn7.style.border = '1px solid black'; 
    IconBoxBtn7.style.margin = '0px 10px';
    IconBoxBtn7.style.backgroundImage = 'url("./images/MapPushPin.png")';
    IconBoxBtn7.style.backgroundRepeat = 'no-repeat';
    IconBoxBtn7.style.backgroundSize = "80% 80%";
    IconBoxBtn7.style.backgroundPosition = "center";
    IconBoxBtn7.style.opacity = '0.8';
    IconBoxBtn7.style.boxSizing = "border-box"; 
    IconBoxBtn7.title = "Search Memory List";
    CustomElementSelector.IconBoxBtn7.IconBoxBtn7Ctrl = IconBoxBtn7; 

    const ArrowHead =L.DomUtil.create('div','arrow leaflet-bar leaflet-control leaflet-control-custom');
    ArrowHead.style.border = 'solid black';
    ArrowHead.style.borderWidth = '0 3px 3px 0';
    ArrowHead.style.display = 'inline-block';
    ArrowHead.style.padding = '3px';
    ArrowHead.style.position = 'absolute';
    ArrowHead.style.bottom = '0px';
    ArrowHead.style.left = '50%';
    ArrowHead.style.transform = 'rotate(45deg) translateX(-50%)';
    CustomElementSelector.IconBoxBtn7.ArrowHead = ArrowHead;

    /*===============> Setup Event listeners <===============*/
    IconBoxBtn7.onclick = Panel_Toggle;

    /*===> Setup event listeners <===*/
    let CloseXelem;
    let map = map_globals.map;

    function mydoNothing(ev) {ev.stopPropagation()}; // do nothing click event handler

    /*===> This section contains the event handler functions <===*/    
    function Panel_Toggle(ev){
      ev.preventDefault();
      if(!CC_GlobalVars.debounce && !MutuallyExclusive.IconBoxBtn5_Active)
      {
        CC_GlobalVars.debounce = true;
        IconBox7Ctrl_ctrlToggleDisplay();
        IconBox7Div_ToggleStyles();
        setTimeout(() => CC_GlobalVars.debounce = false, 1000);
      }
    }

    function IconBox7Ctrl_ctrlToggleDisplay() {
      let isActive = MutuallyExclusive.IconBoxBtn7_Active;
      if(isActive === true) {
        MutuallyExclusive.IconBoxBtn7_Active = false;
        let sidebar = CustomElementSelector.Sidebar;
        sidebar.hide();
        CloseXelem.onclick = undefined;
        map_globals.map.off('zoomend', this);
      }
      else {
        MutuallyExclusive.IconBoxBtn7_Active = true;
        updatelist();
      }
      return MutuallyExclusive.IconBoxBtn7_Active;
    }

    function IconBox7Div_ToggleStyles() {
      const IconBoxBtn7Ctrl = CustomElementSelector.IconBoxBtn7.IconBoxBtn7Ctrl;
      const ONOFF = MutuallyExclusive.IconBoxBtn7_Active;
      IconBoxBtn7Ctrl.style.border = ((ONOFF) ? 'medium inset ivory' : 'thin outset black');
      IconBoxBtn7Ctrl.style.boxShadow = ((ONOFF) ? "5px 5px 8px darkgray inset" : "none");
    }

    function updatelist() {
      let sidebar = CustomElementSelector.Sidebar;
      sidebar.setContent(getSearchMarkerBody());
      sidebar.show();
      InsertCurrentList();
      SetupEventHandlers();
    }

    function DelAllItems() {
      Marker_global_vars.AssignedSqIcons.forEach(markerLayer => {
        if( map_globals.map.hasLayer(markerLayer) )
          map_globals.map.removeLayer(markerLayer);
      });
      Marker_global_vars.AssignedSqIcons.length = 0;
      Marker_global_vars.AssignedSqIcons = [];
      InsertCurrentList();
    }

    function DelSelectItems() {
      let allCheckBoxes = document.querySelectorAll('#mapid > div.leaflet-control-container > div.leaflet-sidebar div#sidebar div.Mbody input[type="checkbox"]'),
          arrayOfIndex = [],
          thinnerList = [];
      
      allCheckBoxes.forEach((checkbox, index) => {
          if( checkbox.checked )
            arrayOfIndex.push(index); 
      });

      if(arrayOfIndex.length > 0) {
        let arrayList = [...Marker_global_vars.AssignedSqIcons];
        thinnerList = arrayList.filter((v,i) => {
          let result = (arrayOfIndex.indexOf(i) < 0);
          if( !result ) map_globals.map.removeLayer(v);
          return result;
        });
        Marker_global_vars.AssignedSqIcons = thinnerList;
      } else alert('No Items were Checked');

      InsertCurrentList();
    }

    function getSearchMarkerBody() {
      let structure = 
      '<div class="MSearchField leaflet-bar leaflet-control leaflet-control-custom" style="display: flex; justify-content: space-between;margin:3px;width:92%;">' +
        '<input type="text" class="text-input" name="inputfield" style="width:86%; border:4px inset lightgray;" />' +
        '<button type="button" class="MSearch" name="MSearch" style="font-weight: 700;background-color:GreenYellow; border-radius: 8px;">Search</button>' +
      '</div>' +
      '<div class="MSelector" style="display:none;border:1px solid black; padding:5px; background-color:white;width: 82%;height:auto;position: absolute;top: 34px;left: 25px;">' +
      '</div>'+
      '<br><h4 style="text-align: center;">Remembered Search Location List</h4>' +
      '<div class="Mbody" style="visibility: visible;display: block; position: static;height: 83%; width: 100%; overflow: auto; border: 2px solid black;">' +
      '</div>' +
      '<div class="buttons" style="display:flex;align-items: center;justify-content: space-around; height: 8%; width: 100%;">' +
        '<button class="DelAllItems" style="border-radius:10px;background-color:gold;padding:3px 5px;font-weight:bold;height:25px;">Delete All Items</button>' +
        '<button class="DelSelectItems" style="border-radius:10px;background-color: gold;padding: 3px 5px;font-weight: bold;height:25px;">Delete Select Items</button>' +
      '</div>';
      return structure;
    }
   
    function gotoMarker(ev) {
      ev.stopPropagation();
      console.log('gotoMarker()');
      map.spin(true);
      if(CC_GlobalVars.debounce === false) {
        let ShowLineToggle = (Elem, ONOFF) => {
          Elem.style.border = ((ONOFF) ? 'medium inset ivory' : 'thin outset black');
          Elem.style.boxShadow = ((ONOFF) ? "5px 5px 8px darkgray inset" : "none");
        };
        CC_GlobalVars.debounce = true;
        let thisH5 = ev.target;
        let thisDiv = (ev.target.parentNode).parentNode;
        ShowLineToggle(thisDiv, CC_GlobalVars.debounce);
        setTimeout(() => {
            let index = thisH5.getAttribute("name");
            let Marker = Marker_global_vars.AssignedSqIcons[index];
            if(Marker) {
              let MarkerLocation = Marker._latlng;
              map.flyTo(MarkerLocation,15);
              map.on('zoomend', ()=>{
                if(map.getZoom() === 15) {
                  CC_GlobalVars.debounce = false;
                  ShowLineToggle(thisDiv, CC_GlobalVars.debounce);      
                  map.spin(false);
                }
              });
            }
          },1000);
      }
    }

    // insert selectable item list
    function InsertCurrentList() {
      // assign vars & expression
      let Mbody   = document.querySelector('#mapid > div.leaflet-control-container > div.leaflet-sidebar div#sidebar div.Mbody'),
          structure = "",
          ExtractNum = (MarkerIcon) => { // function expression for extracting Icon Number;
            let IconHtml    = MarkerIcon._icon.innerHTML;
            let locateNum   = IconHtml.indexOf('>') + 1;
            let Nsubstr     = IconHtml.substr(locateNum, IconHtml.length - 6 ); 
            let resultNo    = parseInt(Nsubstr);
            // ** Debug only ** console.log(`locateNum = ${locateNum}, Nsubstr = ${Nsubstr}`);
            return resultNo;
          };

      // Sort list by the number inside the ICON
      Marker_global_vars.AssignedSqIcons.sort((a,b) => {
        let a_number      = ExtractNum(a);
        let b_number      = ExtractNum(b);
        // ** Debug Only ** console.log(`a_number = ${a_number}, b_Number = ${b_number}`);
        return (a_number - b_number);
      });

      // Create a Division list for sidebar selection display
      Marker_global_vars.AssignedSqIcons.forEach((MarkerLayer,index) => {
          let IconHtml = MarkerLayer._icon.innerHTML;
          structure += `<div style="height: 26px;padding: 3px 5px;border-bottom:1px solid black;display: flex;justify-content: space-between;">${IconHtml}` +
                          `<span class="go2clickable" style="width: 88%;position: relative; top: 2px; whiteSpace: nowrap;overflow:hidden;">` +
                          `<h5 name=${index}>${MarkerLayer._tooltip._content}</h5></span>` +
                          `<input type="checkbox" class="Selector" name=${index} style="position: relative;top:4px;" />` +
                       '</div>';
      });
      Mbody.innerHTML = structure; // display div list structure.
      
      // Assign event click handler to the inner span element which holds the selectable text
      let allSpans = Mbody.querySelectorAll('span.go2clickable');
      if(allSpans) {
        allSpans.forEach(thisSpan => { thisSpan.addEventListener('click', gotoMarker); });
      }
    }

    function SetupEventHandlers() {
      CloseXelem = document.querySelector("#mapid > div.leaflet-control-container > div.leaflet-sidebar.left.visible > a");
      CloseXelem.onclick = Panel_Toggle;
      /*===> Attach HTML children elements in proper order <===*/
        const SearchField = document.querySelector('#mapid > div.leaflet-control-container > div.leaflet-sidebar > div#sidebar div.MSearchField');
        const InputField = document.querySelector('#mapid > div.leaflet-control-container > div.leaflet-sidebar > div#sidebar div.MSearchField input.text-input');
        const SearchBtn =  document.querySelector('#mapid > div.leaflet-control-container > div.leaflet-sidebar > div#sidebar div.MSearchField button.MSearch');
        const Selector = document.querySelector('#mapid > div.leaflet-control-container > div.leaflet-sidebar > div#sidebar div.MSelector');
        CustomElementSelector.IconBoxBtn7.SearchField = SearchField;
        CustomElementSelector.IconBoxBtn7.InputField = InputField;
        CustomElementSelector.IconBoxBtn7.SearchBtn = SearchBtn;
        CustomElementSelector.IconBoxBtn7.Selector = Selector;

        SearchField.onkeypress = mycheck4Enter;
        Selector.onclick = mydoNothing;
        SearchField.onclick = mydoNothing;
        SearchBtn.onclick = mySearchForIt;
        ArrowHead.onclick = mytoggleList;

        let button1 = document.querySelector("#mapid > div.leaflet-control-container > div.leaflet-sidebar div#sidebar div.buttons button.DelAllItems");
        button1.onclick = DelAllItems;
        let button2 = document.querySelector("#mapid > div.leaflet-control-container > div.leaflet-sidebar div#sidebar div.buttons button.DelSelectItems");
        button2.onclick = DelSelectItems;

        SearchField.focus();
        InputField.focus();
    }

    function mycheck4Enter(ev) {
      const SearchBtn = CustomElementSelector.IconBoxBtn7.SearchBtn;
      if (ev.code === 'Enter')
        SearchBtn.click();        
    }

    /*=================> Search Function <=================*/
    function mySearchForIt(ev) {
      const InputField = CustomElementSelector.IconBoxBtn7.InputField;
      const ArrowHead = CustomElementSelector.IconBoxBtn7.ArrowHead;
      const Selector = CustomElementSelector.IconBoxBtn7.Selector;
      const searchstring = InputField.value;
      if(!searchstring || searchstring === "") return;
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
        if(searchstring.split('').length === 0) return;
        /*===> search for location list <===*/
        if( Lookup(searchstring) ) {
          if(listItems.length > 0) {
            /*==> Enable the box which holds the listing choices <==*/
            Selector.style.display = 'block';
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
                button.display = "block";
                button.style.width = "100%";
                button.backgroundColor = 'white';
                button.opacity = "1";
                button.style.borderRadius = "5px";
                button.onclick = myProcessListChoice;        
                CustomElementSelector.IconBoxBtn7.Buttons.push(button);
            });
            CustomElementSelector.IconBoxBtn7.Buttons.forEach(button => button.disabled = true);
            myrolloutChoiceList();
          } else Selector.style.display = "none";
        } else setTimeout(()=>{ map_globals.map.spin(false); }, 180); 
      }, 180);
    }

    function waitForIt2Complete(condition, callback) {
      if(condition()) {
          console.log('waiting');
          window.setTimeout(waitForIt2Complete.bind(null, condition, callback), 100); /* this checks the flag every 100 milliseconds*/
      } else {
          console.log('done');
          callback();
      }
    } 

    function myProcessListChoice(ev) {
      ev.stopPropagation();
      map_globals.map.spin(true);
      CC_GlobalVars.markerWatch2 = true;
      const index = ev.target.value;
      const Record = listItems[index];
      Record.Name = ev.target.innerText;
      CC_GlobalVars.RecordToUse = Record;
      /* ======== Define All Function Expressions below ======== */
      const placeMarker = () => { // define a function expression
            const SqIcon = Marker_global_vars.SquareIcons.shift();
            const record = CC_GlobalVars.RecordToUse;
            const TToffset = { offset: [0,-18], direction: 'top' };
            const thisMarker = new L.Marker({lat: record.Latitude, lng: record.Longitude}, { icon: SqIcon } )
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
                                    .bindTooltip(record.Name, TToffset)
                                    .bindPopup(`<u><span style="font-weight:800;">${record.Name}</span></u><br>
                                                  ${record.Address1}<br>
                                                  ${record["City"]}, ${record.State} ${record.ZIP}<br>
                                                  ${record["County"]} County<br>
                                                  Ph: ${record.Callout2}<br>`);
            thisMarker.setZIndexOffset(9999);
            thisMarker.addTo(map_globals.map);
            Marker_global_vars.AssignedSqIcons.push(thisMarker);
            InsertCurrentList();
            // now that a selection has been choosen and processed, retract items in pulldown list.
            myretractChoiceList();
            CC_GlobalVars.markerWatch2 = false;
      }; // end of define

      let finishup = ()=>{ // define another function expression
        map.off("zoomend", placeMarker);
        const bbox = actionItems[index];// retrieve box bounds
        if( bbox && bbox !== null) {    // if BBox available process
          map.fitBounds(bbox);          // Zoom out to outline bounds
        }   
        setTimeout(()=>{ map_globals.map.spin(false); }, 180);
      }; // end define

      let CheckCondition = ()=>{ // a function express to access a flag
        return CC_GlobalVars.markerWatch2; 
      };
      /* ======== End Defining Function Expressions ======== */

      // Check if Map Coordinates Available
      if( Record.Latitude !== "" || Record.Longitude !== "" ) {
        map.on("zoomend", placeMarker); //uses the first function expression
        map.flyTo([Record.Latitude, Record.Longitude],16);
        waitForIt2Complete(CheckCondition,finishup); 
      } 
      else // Error if no map coordinates
        alert("Error: Record lacks any viable Map Coordinates!");
    }

    /*======> Functions used to display & handle the Search Results <======*/
    function mytoggleList(ev) {
      ev.stopPropagation();     
      const Selector = CustomElementSelector.IconBoxBtn7.Selector;
      if ( Selector.childElementCount > 1 ) 
        myretractChoiceList();
      else
        myrolloutChoiceList();
    }

    function myrolloutChoiceList() {
      let Mbody = document.querySelector('#mapid > div.leaflet-control-container > div.leaflet-sidebar div#sidebar div.Mbody');
      Mbody.style.visibility = 'hidden';
      const SearchField = CustomElementSelector.IconBoxBtn7.SearchField;
      SearchField.onkeypress = mydoNothing;
      const buttons = CustomElementSelector.IconBoxBtn7.Buttons;
      const Selector = CustomElementSelector.IconBoxBtn7.Selector;
      const ArrowHead = CustomElementSelector.IconBoxBtn7.ArrowHead;
      ArrowHead.style.transform = 'rotate(45deg)';
      let listLength = (buttons.length > 12) ?  12 : buttons.length - 1;
      for(let i=0; i <= listLength; i++) {
          const button = buttons[i];  
          setTimeout(() => { Selector.appendChild(button); SearchField.onkeypress = mycheck4Enter; }, i * 75);
      }
      buttons.forEach(button => button.disabled = false);
    }

    function myretractChoiceList() {
      const SearchField = CustomElementSelector.IconBoxBtn7.SearchField;
      SearchField.onkeypress = mydoNothing;
      const Selector = CustomElementSelector.IconBoxBtn7.Selector;
      const buttons = CustomElementSelector.IconBoxBtn7.Buttons;
      const ArrowHead = CustomElementSelector.IconBoxBtn7.ArrowHead;
      ArrowHead.style.transform = 'rotate(-135deg) translateY(-50%)';
      let listLength = (buttons.length > 12) ?  12 : buttons.length - 1;
      buttons.forEach(button => button.disabled = true);
      for(let i=listLength; i >= 0; i-- ) {
        const button = buttons[i];  
        setTimeout(() => { Selector.removeChild(button); SearchField.onkeypress = mycheck4Enter; }, i * 75);
      }
      Selector.style.display = "none";
      CustomElementSelector.IconBoxBtn7.Buttons = [];
      let Mbody = document.querySelector('#mapid > div.leaflet-control-container > div.leaflet-sidebar div#sidebar div.Mbody');
      Mbody.style.visibility = 'visible';
    }

    return IconBoxBtn7; // returns the control element
  },
  
  onRemove: function() {

  }
});
  
