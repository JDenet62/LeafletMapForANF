/* Adds a custom ISOChronecontrol */
const IconBoxBtn2Control =  L.Control.extend({        
  options: {
    position: 'topright'
  },
  onAdd: function () {
    let IconBoxBtn2 = L.DomUtil.create('div', 'IconBoxBtn2Ctrl leaflet-bar leaflet-control leaflet-control-custom');
    IconBoxBtn2.style.position = "relative";
    IconBoxBtn2.style.backgroundColor = 'white';     
    IconBoxBtn2.style.width = '36px';
    IconBoxBtn2.style.height = '36px';
    IconBoxBtn2.style.border = '1px solid black'; 
    IconBoxBtn2.style.margin = '0px 10px';
    IconBoxBtn2.style.backgroundImage = 'url("./images/icon2.png")';
    IconBoxBtn2.style.backgroundSize = "180% 180%";
    IconBoxBtn2.style.backgroundPosition = "center";
    IconBoxBtn2.style.opacity = '0.8';
    IconBoxBtn2.style.boxSizing = "border-box";
    IconBoxBtn2.title = "DriveMap Area Control";
    CustomElementSelector.IconBoxBtn2.IconBoxBtn2Ctrl = IconBoxBtn2; 
    /*===> Append External user controls <===*/
    const DivISOChrone = CustomElementSelector.IconBoxBtn2.DivISOChrone;
    IconBoxBtn2.appendChild(DivISOChrone);

    /*===> setup event Listeners <===*/
    IconBoxBtn2.onclick = IconBoxBtn2_ctrlToggle;
    DivISOChrone.addEventListener('click', function(ev) {ev.stopPropagation();}); 
    CustomElementSelector.IconBoxBtn2.ShowBtn.addEventListener('click', IconBoxBtn2_ShowClicked, false);    
    CustomElementSelector.IconBoxBtn2.ClearBtn.addEventListener('click',ClearISOChrone, false);

    /*===> this section contains the event handler functions <===*/   
    function IconBoxBtn2_ctrlToggle(ev){
      ev.preventDefault();
      if(
          CC_GlobalVars.debounce === false &&
          MutuallyExclusive.IconBoxBtn1_Active === false 
        ) {
          CC_GlobalVars.debounce = true;
          MutuallyExclusive.IconBoxBtn2_Active = (IconBox2Ctrl_ToggleDisplay() === 'flex') ? true : false;
          IconBox2Div_ToggleStyles();
          ClearISOChrone();
          setTimeout(() => CC_GlobalVars.debounce = false, 350);
        }
    };

    function IconBox2Ctrl_ToggleDisplay() { 
      const DivISOChrone = CustomElementSelector.IconBoxBtn2.DivISOChrone; // get Elem
      let display = DivISOChrone.style.display; // get CSS [display] property
      display = DivISOChrone.style.display = (display === 'none') ? 'flex' : 'none'; // toggle it
      return display; // return the updated CSS [display] property
    }

    function IconBox2Div_ToggleStyles() {
      const IconBoxBtn2Ctrl = CustomElementSelector.IconBoxBtn2.IconBoxBtn2Ctrl;
      const ONOFF = MutuallyExclusive.IconBoxBtn2_Active;
      IconBoxBtn2Ctrl.style.border = ((ONOFF) ? 'medium inset ivory' : 'thin outset black');
      IconBoxBtn2Ctrl.style.boxShadow = ((ONOFF) ? "5px 5px 8px darkgray inset" : "none");
    }

    function IconBoxBtn2_ShowClicked(ev){
      ev.preventDefault();
      map_globals.map.spin(true);
      const obj1 = map_globals.MouseSelections[0];
      const minutes = parseInt(CustomElementSelector.IconBoxBtn2.Minutes.value);
      const CustomColor = CustomElementSelector.CustomColor;
      findISOChrone(obj1, minutes, CustomColor, map_globals.API_token);
      setTimeout(() => {
        ClearISOChrone();
        MutuallyExclusive.IconBoxBtn2_Active = (IconBox2Ctrl_ToggleDisplay() === 'flex') ? true : false;
        IconBox2Div_ToggleStyles();
        map_globals.map.spin(false);
      }, 1000);
    }

    function ClearISOChrone() {
      map_globals.MouseSelections = [];
      map_globals.MouseSelections.length = 0;      
      CustomElementSelector.IconBoxBtn2.FromDiv.style.backgroundColor = 'darkgreen';
      CustomElementSelector.IconBoxBtn2.MinLabel.style.backgroundColor = 'darkgreen';
      CustomElementSelector.IconBoxBtn2.ShowBtn.disabled = true;
      CustomElementSelector.IconBoxBtn2.Minutes.disabled = false;
    }
 
    return IconBoxBtn2; // return the main control Element
  },

  onRemove: function() {
    /*===> Append External user controls <===*/
    const DivISOChrone = CustomElementSelector.IconBoxBtn2.DivISOChrone;
    const IconBoxBtn2 = CustomElementSelector.IconBoxBtn2.IconBoxBtn2Ctrl;
    IconBoxBtn2.appendChild(DivISOChrone);

    /*===> setup event Listeners <===*/
    IconBoxBtn2.onclick = null;
    DivISOChrone.removeEventListener('click', function(ev) {ev.stopPropagation();}); 
    CustomElementSelector.IconBoxBtn2.ShowBtn.removeEventListener('click', IconBoxBtn2_ShowClicked, false);    
    CustomElementSelector.IconBoxBtn2.ClearBtn.removeEventListener('click',ClearISOChrone, false);
  }

});