"use strict"

const CustomElementSelector = {
  IconBoxBtnSpacer: {
  },
  IconBoxBtn0: {
    'ColorChooser': document.querySelector('.ColorChooser'),
    'ColorChoiceIndicator': document.querySelector('.ColorChoiceIndicator'),
    'ColorDropdownContent': document.querySelector('.ColorDropdownContent')
  },
  IconBoxBtn1: {
    'DivRoute': document.querySelector('.DivRoute'),
    'ClearBtn': document.querySelector('.ClearBtn'),
    'RouteBtn': document.querySelector('.RouteBtn'),
    'FromDiv': document.querySelector('.RouteFrom'),
    'ToDiv': document.querySelector('.RouteTo')
  },
  IconBoxBtn2: {
    'DivISOChrone': document.querySelector('.DivISOChrone'),
    'Minutes': document.querySelector('.DistanceInMinutes input'),
    'MinLabel': document.querySelector('.DistanceInMinutes .ISOLabel'),
    'ClearBtn': document.querySelector('.Ctrls4ISOChrone .ClearISOBtn'),
    'ShowBtn': document.querySelector('.Ctrls4ISOChrone .ShowISOBtn'),
    'FromDiv': document.querySelector('.Anchor4ISOChrone')
  },
  IconBoxBtn3: {
  },
  IconBoxBtn4: {
    'IconBoxBtn4Ctrl': {},
    'LayerControls': document.querySelector('.LayerControls'),
    'Divider': {},
    'InnerDiv': {},
    'MarkerLayerGroup': {},
    'ShapesLayerGroup': {},
    'RoutesLayerGroup': {},
    'DriveMapLayerGroup': {},
  },
  IconBoxBtn5:{
    'IconBoxBtn4Ctrl': {},
    'SearchField': document.querySelector('.SearchField'),
    'InputField': document.querySelector('.SearchField input.text-input'),
    'SearchBtn': document.querySelector('.SearchField button.Search'),
    'Selector': document.querySelector('.Selector'),
    'Buttons': [],
    'ArrowHead': {}
  },
  IconBoxBtn6: {
    'IconBoxBtn6Ctrl': {}
  },
  IconBoxBtn7: {
    'IconBoxBtn7Ctrl': {},
    'SearchField': {},
    'InputField': {},
    'SearchBtn':{},
    'Selector': {},
    'Buttons': [],   
    'ArrowHead': {},
    'MarkersGeoJSON': []
  },
  CustomColor: {
    'Color': 'blue',
    'FillColor': '#88f',
  },
  Sidebar: {}
};

const CC_GlobalVars = {
  debounce: false,
  drawControl: null,
  markerWatch1: false,
  markerWatch2: false,
  RecordToUse: {},
  DeleteLayer: deleteShapeAsGeoJSON, 
  Layers:[]
};

let MutuallyExclusive = {
  'IconBoxBtn0_Active': false,
  'IconBoxBtn1_Active': false,
  'IconBoxBtn2_Active': false,
  'IconBoxBtn3_Active': false,
  'IconBoxBtn4_Active': false,
  'IconBoxBtn5_Active': false,
  'IconBoxBtn6_Active': false,
  'IconBoxBtn7_Active': false,
  'ColorPicker_Active': false
};

function ProcessMarkerSelected() {
  const NoOfCoordinates =  map_globals.MouseSelections.length;
  if( MutuallyExclusive.IconBoxBtn1_Active ) {
    switch(NoOfCoordinates){
      case 1:
        CustomElementSelector.IconBoxBtn1.FromDiv.style.backgroundColor = 'greenYellow';
        break;
      case 2:
        CustomElementSelector.IconBoxBtn1.ToDiv.style.backgroundColor = 'greenYellow';
        CustomElementSelector.IconBoxBtn1.RouteBtn.disabled = false;
        break;
      default:
        CustomElementSelector.IconBoxBtn1.FromDiv.style.backgroundColor = 'darkgreen';
        CustomElementSelector.IconBoxBtn1.ToDiv.style.backgroundColor = 'darkgreen';
        CustomElementSelector.IconBoxBtn1.RouteBtn.disabled = true;
    }
  }
  if( MutuallyExclusive.IconBoxBtn2_Active ) {
    switch(NoOfCoordinates){
      case 1:
        CustomElementSelector.IconBoxBtn2.Minutes.disabled = true;
        CustomElementSelector.IconBoxBtn2.FromDiv.style.backgroundColor = 'greenYellow';
        CustomElementSelector.IconBoxBtn2.MinLabel.style.backgroundColor = 'greenYellow';
        CustomElementSelector.IconBoxBtn2.ShowBtn.disabled = false;
        break;
      default:
        CustomElementSelector.IconBoxBtn2.FromDiv.style.backgroundColor = 'darkgreen';
        CustomElementSelector.IconBoxBtn2.MinLabel.style.backgroundColor = 'darkgreen';
        CustomElementSelector.IconBoxBtn2.ShowBtn.disabled = false;
    }
  }
}

function updateCustomColor(ev){
  let ColorChoice = ev.target.value;
  CustomElementSelector.CustomColor = getColorInfo(ColorChoice);
  CustomElementSelector.IconBoxBtn0.ColorChoiceIndicator.style.backgroundColor = ColorChoice;
  CustomElementSelector.IconBoxBtn0.IconBoxBtn0Ctrl.click();
  CustomElementSelector.IconBoxBtn0.Color_dropdown_content.style.display = 'none';
  MutuallyExclusive.IconBoxBtn0_Active = false;
}
