"use strict"
/* Adds a custom Colorcontrol */
const IconBoxBtn0Control =  L.Control.extend({        
  options: {
    position: 'topright'
  },
  onAdd: function () {
    const IconBoxBtn0 =  L.DomUtil.create('div', 'IconBoxBtn0Ctrl leaflet-bar leaflet-control leaflet-control-custom');
    IconBoxBtn0.style.backgroundColor = 'white';     
    IconBoxBtn0.style.width = '36px';
    IconBoxBtn0.style.height = '36px';
    IconBoxBtn0.style.border = '1px solid black'; 
    IconBoxBtn0.style.margin = '0px 10px';
    IconBoxBtn0.style.backgroundImage = 'linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)';
    IconBoxBtn0.style.backgroundSize = "36px 36px";
    IconBoxBtn0.style.opacity = '0.6';
    IconBoxBtn0.style.boxSizing = "border-box";
    IconBoxBtn0.style.position = 'realtive';
    IconBoxBtn0.style.transition = 'all 750'; 
    IconBoxBtn0.title = "Color Selection Control";
    CustomElementSelector.IconBoxBtn0.IconBoxBtn0Ctrl = IconBoxBtn0;

  
    const ColorChoiceIndicator =  L.DomUtil.create('div', 'ColorChoiceIndicator leaflet-bar leaflet-control leaflet-control-custom');
    ColorChoiceIndicator.style.width = '18px';
    ColorChoiceIndicator.style.height = '18px'; 
    ColorChoiceIndicator.style.border = '1px solid black'; 
    ColorChoiceIndicator.style.margin = '0px';
    ColorChoiceIndicator.style.position = 'absolute';
    ColorChoiceIndicator.style.left = '5%';
    ColorChoiceIndicator.style.bottom = '5%';
    ColorChoiceIndicator.style.borderRadius = '50%';
    ColorChoiceIndicator.style.boxSizing = 'border-box';
    ColorChoiceIndicator.style.backgroundColor = 'blue';
    ColorChoiceIndicator.style.opacity = '1.0 important!';
    ColorChoiceIndicator.style.transition = 'all 750'; 
    CustomElementSelector.IconBoxBtn0.ColorChoiceIndicator = ColorChoiceIndicator;
   
    /*===> Append children controls <===*/
    const ColorDropdownContent = CustomElementSelector.IconBoxBtn0.ColorDropdownContent;
    IconBoxBtn0.appendChild(ColorChoiceIndicator);  
    IconBoxBtn0.appendChild(ColorDropdownContent);

    /*===> Setup event listeners foritself and extended controls <===*/
    IconBoxBtn0.onclick          = function(ev) { ev.preventDefault();  ev.stopPropagation(); IconBoxBtn0_crtlToggle(ev); };
    ColorChoiceIndicator.onclick = function(ev) { ev.preventDefault();  ev.stopPropagation(); if( !CC_GlobalVars.debounce ) IconBoxBtn0.click(); };
    ColorDropdownContent.onclick = function (ev) { ev.preventDefault(); ev.stopPropagation(); };
    ColorDropdownContent.onTouch = function (ev) { ev.preventDefault(); ev.stopPropagation(); };
    
    /*===> This section contains the event handler functions <===*/
    function IconBoxBtn0_crtlToggle(ev) {
      ev.preventDefault();
      if(
          CC_GlobalVars.debounce === false &&
          MutuallyExclusive.IconBoxBtn1_Active === false &&
          MutuallyExclusive.IconBoxBtn2_Active === false 
        ) {
          CC_GlobalVars.debounce = true;
          MutuallyExclusive.IconBoxBtn0_Active = (ctrlToggleOnOff(ev) === 'flex') ? true : false; // after update active status
          ClearAnyPreviousStoredMarkers();
          setTimeout(() => CC_GlobalVars.debounce = false, 350);
      }
    };

    function ctrlToggleOnOff(ev) {
      ev.stopPropagation();
      const ColorDropdownContent = CustomElementSelector.IconBoxBtn0.ColorDropdownContent;
      let display = ColorDropdownContent.style.display; // get CSS display property
      display = ColorDropdownContent.style.display = (display === 'none') ? 'flex' : 'none'; // toggle div on/off
      ev.target.style.border = ((display === 'flex') ? 'medium inset ivory' : 'thin outset black');
      ev.target.style.boxShadow = ((display === 'flex') ? "5px 5px 8px darkgray inset" : "none");
      return display;
    }

    function ClearAnyPreviousStoredMarkers() {
      let display = ColorDropdownContent.style.display;
      if(display === 'flex')
        CreateColorPicker(); 
      else
        DeleteColorPicker(); 
      map_globals.MouseSelections = [];
      map_globals.MouseSelections.length = 0;
    }

    let popupBasic;
    function DeleteColorPicker() {
      if( !MutuallyExclusive.ColorPicker_Active ) {
        map_globals.map.dragging.enable();
        console.log(popupBasic);
        MutuallyExclusive.ColorPicker_Active = false;
      } 
    }

    function CreateColorPicker() {
      if( !MutuallyExclusive.ColorPicker_Active ) {
        map_globals.map.dragging.disable();
        MutuallyExclusive.ColorPicker_Active = true;
       
        popupBasic = new Picker({
          parent: document.querySelector(".ColorDropdownContent"),
          popup: false,
          editorFormat: 'rgb',
          color: CustomElementSelector.CustomColor.Color,
          alpha: false,
        });
        
        popupBasic.onclick = (ev) => { ev.preventDefault(); return false; };
        popupBasic.onTouch = (ev) => { ev.preventDefault(); return false; };
        popupBasic.onChange = (color) => { setTimeout( () => {}, 380);  };

        popupBasic.onDone = function(color) {
          const ColorChoiceIndicator = CustomElementSelector.IconBoxBtn0.ColorChoiceIndicator;
          ColorChoiceIndicator.style.backgroundColor = color.rgbaString;
          CustomElementSelector.CustomColor.Color = rgba2hex(color.rgbaString);
          let FillColor = rgba2hex(color.rgbaString.replace(/(1).$/gi,"0.1)"));
          CustomElementSelector.CustomColor.FillColor = FillColor;
          MutuallyExclusive.ColorPicker_Active = false;
          popupBasic.destroy();
          CustomElementSelector.IconBoxBtn0.IconBoxBtn0Ctrl.click();
        };

        //Open the popup manually:
        popupBasic.show();
      }
    }

    return IconBoxBtn0; // return the new control element
  },

  onRemove: function () {
    /*===> Append children controls <===*/
    const IconBoxBtn0 = CustomElementSelector.IconBoxBtn0.IconBoxBtn0Ctrl;
    const ColorChooser = CustomElementSelector.IconBoxBtn0.ColorChooser;
    const ColorChoiceIndicator = CustomElementSelector.IconBoxBtn0.ColorChoiceIndicator;

    IconBoxBtn0.removeChild(ColorChoiceIndicator);  
    IconBoxBtn0.removeChild(ColorChooser);

    /*===> Setup event listeners foritself and extended controls <===*/
    const dropdownBtn = CustomElementSelector.IconBoxBtn0.Color_dropBtn;
    IconBoxBtn0.onclick = null;
    ColorChooser.removeEventListener('click', function(ev) { ev.stopPropagation(); });
    dropdownBtn.removeEventListener('click', DropdownBtn_click); 
  }

});
