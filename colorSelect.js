/*===> this function translates color names into hex values <===*/
function colorNameToHexVal(name) { // cannot use strict mode
  try {
    if(name === undefined || name === null || name.match(/[A-Za-z].*/) === "") return '#000000';
    return {
      "aliceblue": "#f0f8ff",
      "antiquewhite": "#faebd7",
      "aqua": "#00ffff",
      "aquamarine": "#7fffd4",
      "azure": "#f0ffff",
      "beige": "#f5f5dc",
      "bisque": "#ffe4c4",
      "black": "#000000",
      "blanchedalmond": "#ffebcd",
      "blue": "#0000ff",
      "blueviolet": "#8a2be2",
      "brown": "#a52a2a",
      "burlywood": "#deb887",
      "cadetblue": "#5f9ea0",
      "chartreuse": "#7fff00",
      "chocolate": "#d2691e",
      "coral": "#ff7f50",
      "cornflowerblue": "#6495ed",
      "cornsilk": "#fff8dc",
      "crimson": "#dc143c",
      "cyan": "#00ffff",
      "darkblue": "#00008b",
      "darkcyan": "#008b8b",
      "darkgoldenrod": "#b8860b",
      "darkgray": "#a9a9a9",
      "darkgreen": "#006400",
      "darkkhaki": "#bdb76b",
      "darkmagenta": "#8b008b",
      "darkolivegreen": "#556b2f",
      "darkorange": "#ff8c00",
      "darkorchid": "#9932cc",
      "darkred": "#8b0000",
      "darksalmon": "#e9967a",
      "darkseagreen": "#8fbc8f",
      "darkslateblue": "#483d8b",
      "darkslategray": "#2f4f4f",
      "darkturquoise": "#00ced1",
      "darkviolet": "#9400d3",
      "deeppink": "#ff1493",
      "deepskyblue": "#00bfff",
      "dimgray": "#696969",
      "dodgerblue": "#1e90ff",
      "firebrick": "#b22222",
      "floralwhite": "#fffaf0",
      "forestgreen": "#228b22",
      "fuchsia": "#ff00ff",
      "gainsboro": "#dcdcdc",
      "ghostwhite": "#f8f8ff",
      "gold": "#ffd700",
      "goldenrod": "#daa520",
      "gray": "#808080",
      "green": "#008000",
      "greenyellow": "#adff2f",
      "honeydew": "#f0fff0",
      "hotpink": "#ff69b4",
      "indianred ": "#cd5c5c",
      "indigo": "#4b0082",
      "ivory": "#fffff0",
      "khaki": "#f0e68c",
      "lavender": "#e6e6fa",
      "lavenderblush": "#fff0f5",
      "lawngreen": "#7cfc00",
      "lemonchiffon": "#fffacd",
      "lightblue": "#add8e6",
      "lightcoral": "#f08080",
      "lightcyan": "#e0ffff",
      "lightgoldenrodyellow": "#fafad2",
      "lightgrey": "#d3d3d3",
      "lightgreen": "#90ee90",
      "lightpink": "#ffb6c1",
      "lightsalmon": "#ffa07a",
      "lightseagreen": "#20b2aa",
      "lightskyblue": "#87cefa",
      "lightslategray": "#778899",
      "lightsteelblue": "#b0c4de",
      "lightyellow": "#ffffe0",
      "lime": "#00ff00",
      "limegreen": "#32cd32",
      "linen": "#faf0e6",
      "magenta": "#ff00ff",
      "maroon": "#800000",
      "mediumaquamarine": "#66cdaa",
      "mediumblue": "#0000cd",
      "mediumorchid": "#ba55d3",
      "mediumpurple": "#9370d8",
      "mediumseagreen": "#3cb371",
      "mediumslateblue": "#7b68ee",
      "mediumspringgreen": "#00fa9a",
      "mediumturquoise": "#48d1cc",
      "mediumvioletred": "#c71585",
      "midnightblue": "#191970",
      "mintcream": "#f5fffa",
      "mistyrose": "#ffe4e1",
      "moccasin": "#ffe4b5",
      "navajowhite": "#ffdead",
      "navy": "#000080",
      "oldlace": "#fdf5e6",
      "olive": "#808000",
      "olivedrab": "#6b8e23",
      "orange": "#ffa500",
      "orangered": "#ff4500",
      "orchid": "#da70d6",
      "palegoldenrod": "#eee8aa",
      "palegreen": "#98fb98",
      "paleturquoise": "#afeeee",
      "palevioletred": "#d87093",
      "papayawhip": "#ffefd5",
      "peachpuff": "#ffdab9",
      "peru": "#cd853f",
      "pink": "#ffc0cb",
      "plum": "#dda0dd",
      "powderblue": "#b0e0e6",
      "purple": "#800080",
      "red": "#ff0000",
      "rosybrown": "#bc8f8f",
      "royalblue": "#4169e1",
      "saddlebrown": "#8b4513",
      "salmon": "#fa8072",
      "sandybrown": "#f4a460",
      "scarlet": "#ff2400",
      "seagreen": "#2e8b57",
      "seashell": "#fff5ee",
      "sienna": "#a0522d",
      "silver": "#c0c0c0",
      "skyblue": "#87ceeb",
      "slateblue": "#6a5acd",
      "slategray": "#708090",
      "snow": "#fffafa",
      "springgreen": "#00ff7f",
      "steelblue": "#4682b4",
      "tan": "#d2b48c",
      "teal": "#008080",
      "thistle": "#d8bfd8",
      "tomato": "#ff6347",
      "turquoise": "#40e0d0",
      "violet": "#ee82ee",
      "wheat": "#f5deb3",
      "white": "#ffffff",
      "whitesmoke": "#f5f5f5",
      "yellow": "#ffff00",
      "yellowgreen": "#9acd32"
    }[name.toLowerCase()];
  } catch(err) {
    console.log(err);
  }
} // hex color values obsolete

"use strict"
/* An Array of CSS color name selections */
const AllColors = [ 'AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Black',
  'Blue','BlueViolet','Brass','BrightGold','Bronze','Brown','CadetBlue','Chocolate','Copper',
  'Coral','Crimson','Cyan','DarkBlue','DarkBrown','DarkCyan','DarkGoldenRod','DarkGray','DarkGreen',	 
  'DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkPurple','DarkSalmon',	 
  'DarkSlateBlue','DarkSlateGray','DarkTan','DarkTurquoise','DarkViolet','DarkWood','DimGray',	 
  'DustyRose','FeldSpar','FireBrick','ForestGreen','Gold','GoldenRod','Gray','Green','GreenCopper', 
  'GreenYellow','HotPink','HunterGreen','IndianRed','Indigo','Ivory','Khaki','Lavender','LightBlue',	 
  'LightCoral','LightCyan','LightGray','LightGreen','LightPink','LightSteelBlue','LightWood','Lime',
  'LimeGreen','Magenta','MandarinOrange','Maroon','MediumAquaMarine','MediumBlue','MediumForestGreen', 
  'MediumGoldenRod','MediumOrchid','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise', 
  'MediumVioletRed','MidNightBlue','MintCream','MistyRose','NavyBlue','NeonBlue','NeonPink',	 
  'NewMidnightBlue','NewTan','OldGold','Olive','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen',	 
  'PaleTurquoise','Pink','Plum','PowderBlue','Purple','Quartz','Red','RichBlue','RoyalBlue','SaddleBrown',
  'Salmon','SandyBrown','Scarlet','SeaGreen','Silver','SkyBlue','SlateBlue','Snow','SpicyPink',
  'SpringGreen','SteelBlue','SummerSky','Tan','Teal','Thistle','Tomato','Turquoise','VeryDarkBrown',
  'VeryDarkGray','Violet','VioletRed','Wheat','White','Yellow','YellowGreen'];
  
const HighContrast = ['aqua','aquamarine','blue','blueviolet','cadetblue','crimson','cyan',
  'darkblue','darkcyan','darkgoldenrod','darkgreen','firebrick','forestgreen','gold',
  'goldenrod','green','greenyellow','indianred','indigo','khaki','lavender','lightblue',
  'lightgreen','lightsteelblue','lime','limegreen','magenta','maroon','mediumaquamarine',
  'mediumblue','mediumorchid','mediumslateblue','mediumspringgreen','mediumturquoise', 
  'mediumvioletred','mintcream','mistyrose','olive','orange','orangered','orchid',
  'palegoldenrod','palegreen','paleturquoise','pink','plum','powderblue','purple','royalblue',
  'saddlebrown','salmon','sandybrown','scarlet','seagreen','silver','skyblue','slateblue',
  'snow','springgreen','steelblue','tan','teal','thistle','tomato','turquoise','violet',
  'wheat','white','yellow','yellowgreen'];

/*===> Functions for Color format Coversion and other Utilites <===*/

/**************************************************************/
/* This Function Returns either a light or a dark text color, */
/* based upon it's associated background-color.               */
/* NOTE: defaults to White/Black                              */
/**************************************************************/
function pickTextColorBasedOnBgColorAdvanced(bgColor, lightColor = "white", darkColor = "black") {
  var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  var uicolors = [r / 255, g / 255, b / 255];
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  var L = (0.2126 * c[0]) + (0.1352 * c[1]) + (0.0722 * c[2]);
  return (L > 0.179) ? darkColor : lightColor;
}

/*********************************************************************/
/* This function takes Hex color values and turns them into rgba()   */
/* Arguments: c = Color as a Hex value & a = opacity value attribute */
/*********************************************************************/
function hex2rgb(c, a) {
  if (c.split('')[0] === '#') c = c.substr(1);
  var r = parseInt(c.slice(0,2), 16),
      g = parseInt(c.slice(2,4), 16),
      b = parseInt(c.slice(4,6), 16),
      a = 0.5;
  return 'rgba('+ r +','+ g +','+ b + ',' + a + ')';
}

/*********************************************************************/
/* This function takes RGBA color values and turns them into Hex val */
/*********************************************************************/
function rgba2hex(orig) {
  var a, isPercent,
  rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
  alpha = (rgb && rgb[4] || "").trim(),
  hex = rgb ?
  (rgb[1] | 1 << 8).toString(16).slice(1) +
  (rgb[2] | 1 << 8).toString(16).slice(1) +
  (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

  if (alpha !== "") { a = alpha; }
  else { a = 01; }
  hex = "#" + hex;

  return hex;
}

