/* Adds a custom drawing icon control */
const IconBoxBtn3Control =  L.Control.extend({        
  options: {
    position: 'topright'
  },
  onAdd: function () {
    let IconBoxBtn3 = L.DomUtil.create('div', 'IconBoxBtn3Ctrl leaflet-bar leaflet-control leaflet-control-custom');
    IconBoxBtn3.style.backgroundColor = 'white';     
    IconBoxBtn3.style.width = '36px';
    IconBoxBtn3.style.height = '36px';
    IconBoxBtn3.style.border = '1px solid black'; 
    IconBoxBtn3.style.margin = '0px 10px';
    IconBoxBtn3.style.backgroundImage = 'url("./images/icon3.png")';
    IconBoxBtn3.style.backgroundSize = "150% 150%";
    IconBoxBtn3.style.backgroundPosition = "center";
    IconBoxBtn3.style.opacity = '0.8';
    IconBoxBtn3.style.boxSizing = "border-box"; 
    IconBoxBtn3.title = "Drawing Tool Pallet";
    CustomElementSelector.IconBoxBtn3.IconBoxBtn3Ctrl = IconBoxBtn3; 

    /*===> Setup event listeners <===*/
    IconBoxBtn3.onclick = DrawCtrl_Toggle;
    
    /*===> This section contains the event handler functions <===*/
    function DrawCtrl_Toggle(ev){
      ev.preventDefault();
      if(CC_GlobalVars.debounce === false && !MutuallyExclusive.IconBoxBtn4_Active)
      {
        CC_GlobalVars.debounce = true;
        IconBox3Ctrl_ctrlToggleDisplay();
        IconBox3Div_ToggleStyles();
        setTimeout(() => CC_GlobalVars.debounce = false, 350);
      }
    }

    function IconBox3Ctrl_ctrlToggleDisplay() {
      let isActive = MutuallyExclusive.IconBoxBtn3_Active;
      if(isActive === true) {
        MutuallyExclusive.IconBoxBtn3_Active = false;
        map_globals.map.removeControl(CC_GlobalVars.drawControl);
      }
      else {
        MutuallyExclusive.IconBoxBtn3_Active = true;
        map_globals.map.addControl(CC_GlobalVars.drawControl);
      }
      return MutuallyExclusive.IconBoxBtn3_Active;
    }

    function IconBox3Div_ToggleStyles() {
      const IconBoxBtn3Ctrl = CustomElementSelector.IconBoxBtn3.IconBoxBtn3Ctrl;
      const ONOFF = MutuallyExclusive.IconBoxBtn3_Active;
      IconBoxBtn3Ctrl.style.border = ((ONOFF) ? 'medium inset ivory' : 'thin outset black');
      IconBoxBtn3Ctrl.style.boxShadow = ((ONOFF) ? "5px 5px 8px darkgray inset" : "none");
    }

    return IconBoxBtn3; // returns the control element
  },
 
  onRemove: function() {

  }
});
