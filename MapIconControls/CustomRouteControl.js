/* Adds a custom Routecontrol */
const IconBoxBtn1Control =  L.Control.extend({
  options: {
    position: 'topright'
  },
  onAdd: function () {
    let IconBoxBtn1 = L.DomUtil.create('div', 'IconBoxBtn1Ctrl leaflet-bar leaflet-control leaflet-control-custom');
    IconBoxBtn1.style.position = "relative";
    IconBoxBtn1.style.backgroundColor = 'white';     
    IconBoxBtn1.style.width = '36px';
    IconBoxBtn1.style.height = '36px';
    IconBoxBtn1.style.border = '1px solid black'; 
    IconBoxBtn1.style.margin = '0px 10px';
    IconBoxBtn1.style.backgroundImage = 'url("./images/icon1.png")';
    IconBoxBtn1.style.backgroundSize = '150% 150%';
    IconBoxBtn1.style.backgroundPosition = 'center';
    IconBoxBtn1.style.opacity = '0.8';
    IconBoxBtn1.style.boxSizing = 'border-box'; 
    IconBoxBtn1.title = "Routing Control";
    CustomElementSelector.IconBoxBtn1.IconBoxBtn1Ctrl = IconBoxBtn1;

    /*===> Append children controls <===*/
    const DivRoute = CustomElementSelector.IconBoxBtn1.DivRoute;
    IconBoxBtn1.appendChild(DivRoute);
   
    /*===> Setup event listeners <===*/
    IconBoxBtn1.onclick = IconBoxBtn1_crtlToggle;    
    DivRoute.addEventListener('click', function(ev) {ev.stopPropagation();});
    CustomElementSelector.IconBoxBtn1.RouteBtn.addEventListener('click',RouteBtn_Clicked, false);
    CustomElementSelector.IconBoxBtn1.ClearBtn.addEventListener('click',ClearBtnRoute, false);
    
    /*===> This section contains the event handler functions <===*/
    function IconBoxBtn1_crtlToggle(ev) {
      ev.stopPropagation();
      if(
          CC_GlobalVars.debounce === false &&
          MutuallyExclusive.IconBoxBtn2_Active === false
        ) {
          CC_GlobalVars.debounce = true;
          MutuallyExclusive.IconBoxBtn1_Active = (IconBox1Ctrl_ToggleDisplay() === 'flex') ? true : false;
          IconBox1Div_ToggleStyles();
          ClearBtnRoute();
          setTimeout(() => CC_GlobalVars.debounce = false, 350);
      }
    };

    function IconBox1Ctrl_ToggleDisplay() { 
      const DivRoute = CustomElementSelector.IconBoxBtn1.DivRoute; // get Elem
      let display = DivRoute.style.display; // get CSS [display] property
      display = DivRoute.style.display = (display === 'none') ? 'flex' : 'none'; // toggle it
      return display; // return the updated CSS [display] property
    }

    function IconBox1Div_ToggleStyles() {
      const IconBoxBtn1Ctrl = CustomElementSelector.IconBoxBtn1.IconBoxBtn1Ctrl; // get Elem
      const ONOFF = MutuallyExclusive.IconBoxBtn1_Active; // get value
      IconBoxBtn1Ctrl.style.border = ((ONOFF) ? 'medium inset ivory' : 'thin outset black');
      IconBoxBtn1Ctrl.style.boxShadow = ((ONOFF) ? "5px 5px 8px darkgray inset" : "none");
    }

    /*===> Functions to Process Route <===*/
    function RouteBtn_Clicked(ev) {
      map_globals.map.spin(true);
      setTimeout(() => {
          const obj1 = map_globals.MouseSelections[0];
          const obj2 = map_globals.MouseSelections[1];
          const CustomColor = CustomElementSelector.CustomColor;
          findRoute(obj1, obj2, CustomColor, map_globals.API_token);
          ClearBtnRoute();
          MutuallyExclusive.IconBoxBtn1_Active = (IconBox1Ctrl_ToggleDisplay() === 'flex') ? true : false;
          IconBox1Div_ToggleStyles();
          map_globals.map.spin(false);
      }, 1000);
    }

    function ClearBtnRoute() {
      map_globals.MouseSelections.length = 0;
      map_globals.MouseSelections = [];
      CustomElementSelector.IconBoxBtn1.FromDiv.style.backgroundColor = 'darkgreen';
      CustomElementSelector.IconBoxBtn1.ToDiv.style.backgroundColor = 'darkgreen';
      CustomElementSelector.IconBoxBtn1.RouteBtn.disabled = true;
    }
    
    
    return IconBoxBtn1; // return control element
  },

  onRemove: function() {
    /*===> Remove Appended children controls <===*/
    const IconBoxBtn1 = CustomElementSelector.IconBoxBtn1.IconBoxBtn1Ctrl;
    const DivRoute = CustomElementSelector.IconBoxBtn1.DivRoute;
    IconBoxBtn1.removeChild(DivRoute);
    
    /*===> Remove event listeners <===*/
    IconBoxBtn1.onclick = null;    
    DivRoute.removeEventListener('click', function(ev) {ev.stopPropagation();});
    CustomElementSelector.IconBoxBtn1.RouteBtn.removeEventListener('click',RouteBtn_Clicked, false);
    CustomElementSelector.IconBoxBtn1.ClearBtn.removeEventListener('click',ClearBtnRoute, false);
  }
});
