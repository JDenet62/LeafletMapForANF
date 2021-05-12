/* Adds a custom text control used for spacing from the top */
const IconBoxBtn6Control =  L.Control.extend({        
  options: {
    position: 'topright'
  },
  onAdd: function () {
    let IconBoxBtn6 = L.DomUtil.create('div', 'IconBoxBtn6Ctrl leaflet-bar leaflet-control leaflet-control-custom');
    IconBoxBtn6.style.backgroundColor = "ivory";     
    IconBoxBtn6.style.width = '36px';
    IconBoxBtn6.style.height = '36px';
    IconBoxBtn6.style.border = '1px solid black'; 
    IconBoxBtn6.style.margin = '0px 10px';
    IconBoxBtn6.style.backgroundImage = 'url("./images/icon5.png")';
    IconBoxBtn6.style.backgroundSize = "100% 100%";
    IconBoxBtn6.style.backgroundPosition = "center";
    IconBoxBtn6.style.opacity = '0.57';
    IconBoxBtn6.style.boxSizing = "border-box"; 
    IconBoxBtn6.title = "Saves Map Changes";
    CustomElementSelector.IconBoxBtn6.IconBoxBtn6Ctrl = IconBoxBtn6; 
    /*===> Setup event listeners <===*/
    IconBoxBtn6.onclick = Save_Toggle;
    
    /*===> This section contains the event handler functions <===*/
    function Save_Toggle(ev){
      ev.preventDefault();
      if(CC_GlobalVars.debounce === false && 
        !MutuallyExclusive.IconBoxBtn5_Active &&
        !MutuallyExclusive.IconBoxBtn4_Active &&
        !MutuallyExclusive.IconBoxBtn2_Active &&      
        !MutuallyExclusive.IconBoxBtn1_Active
        )
      {
        CC_GlobalVars.debounce = true;
        IconBox6Ctrl_ctrlToggleDisplay();
        IconBox6Div_ToggleStyles();
        setTimeout(() => CC_GlobalVars.debounce = false, 2000);
      }
    }

    function IconBox6Ctrl_ctrlToggleDisplay() {
      let isActive = MutuallyExclusive.IconBoxBtn6_Active;
      if(isActive === true) {
        MutuallyExclusive.IconBoxBtn6_Active = false;
      }
      else {
        MutuallyExclusive.IconBoxBtn6_Active = true;
        map_globals.map.spin(true);
        saveMapItems().then(res => {
          alert(res);
          map_globals.map.spin(false);
          CC_GlobalVars.debounce = false;
          CustomElementSelector.IconBoxBtn6.IconBoxBtn6Ctrl.click();
        });
      }

      return MutuallyExclusive.IconBoxBtn6_Active;
    }

    function IconBox6Div_ToggleStyles() {
      const IconBoxBtn6Ctrl = CustomElementSelector.IconBoxBtn6.IconBoxBtn6Ctrl;
      const ONOFF = MutuallyExclusive.IconBoxBtn6_Active;
      IconBoxBtn6Ctrl.style.border = ((ONOFF) ? 'medium inset ivory' : 'thin outset black');
      IconBoxBtn6Ctrl.style.boxShadow = ((ONOFF) ? "5px 5px 8px darkgray inset" : "none");
    }

    return IconBoxBtn6; // returns the control element
  },

  onRemove: function() {
    const IconBoxBtn6 = CustomElementSelector.IconBoxBtn6.IconBoxBtn6Ctrl; 
    /*===> Remove event listeners <===*/
    IconBoxBtn6.onclick = null;
  }
});