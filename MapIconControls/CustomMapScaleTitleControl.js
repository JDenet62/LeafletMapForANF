const scaleTitle = L.Control.extend({ 
  options: {
    position: 'bottomleft',
  },
  onAdd: function () {
    const scaleTitle = L.DomUtil.create('div', 'ScaleTitle'); // create a div with a class "scaleTitle"
    scaleTitle.style.width = 'auto';
    scaleTitle.style.height = '20px';
    scaleTitle.style.color = 'black';
    scaleTitle.style.backgroundColor = 'transparent';
    scaleTitle.style.margin = '0px 8px'; 
 
    scaleTitle.innerHTML = '<h3><b><u>Map Scale</u><b></h3>';
    return scaleTitle;
  },
});


/* Adds a custom text control used for spacing from the top */
const IconBoxBtnSpacer =  L.Control.extend({        
  options: {
    position: 'topright'
  },
  onAdd: function () {
    let IconBoxBtnSpacer = L.DomUtil.create('div', 'IconBoxBtnSpacer leaflet-bar leaflet-control leaflet-control-custom');
    IconBoxBtnSpacer.style.border = "none !important";
    IconBoxBtnSpacer.style.backgroundColor = 'transparent';     
    IconBoxBtnSpacer.style.fontFamily = "fantasy";
    IconBoxBtnSpacer.style.fontSize = '36px';
    IconBoxBtnSpacer.style.textAlign = "center";
    IconBoxBtnSpacer.style.position = 'relative';
    IconBoxBtnSpacer.style.width = '100%';
    IconBoxBtnSpacer.style.height = '50px';
    IconBoxBtnSpacer.style.padding = "auto";
    IconBoxBtnSpacer.style.top = '0';
    IconBoxBtnSpacer.style.left = '0';
    IconBoxBtnSpacer.style.marginRight = "10px";
    IconBoxBtnSpacer.style.opacity = '0.0';
    IconBoxBtnSpacer.style.boxSizing = "border-box";
    IconBoxBtnSpacer.style.animationName = 'fadeout';
    IconBoxBtnSpacer.style.animationDuration = '2s';
    IconBoxBtnSpacer.innerHTML = "<u><em>America Needs Fatima</em></u>"; 
    CustomElementSelector.IconBoxBtnSpacer = IconBoxBtnSpacer;

    /*===> setup event listeners <===*/
    IconBoxBtnSpacer.onclick = (e) => { e.stopPropagation(); };

    return IconBoxBtnSpacer;
  },
  onRemove: function() {
    const IconBoxBtnSpacer = CustomElementSelector.IconBoxBtnSpacer;
    IconBoxBtnSpacer.onclick = null;
  }
});
