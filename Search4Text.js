"use strict"

let listItems = [];
let actionItems = [];

const States = Object.freeze({
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'San Juan': 'SJ',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
});

function LookupFullStateName(abbr) {
    let result = "";
    for(let State in States){
        if(States[State] === abbr) {
            result = State;
            break;
        }
    }
    return result;
}

const regx = Object.freeze({
    AlphaNumeric_Many: /^[\',.:;\$\x20a-zA-Z0-9\-]+$/g,
    AlphaOnly_Many: /^[\x20A-Za-z]+$/g,
    NumericOnly_Many: /^[0-9]+$/g,
    Counties: /(boroughs)|(co\.)|(county)|(parish)|(prsh)/gi,
    Streets: /(street)|(st)|(road)|(rd)|(drive)|(dr)|(boulivard)|(blvd)|(court)|(ct)|(circle)|(cir)|(trail)|(trl)|(fm)|(rr)|(common)|(cmn)/gi,
    Saint: /(st.)|(st)|(saint)/gi
});

/*===> Helper functions <===*/
function arrayRemoveVal(arr, value) {
    if (value === undefined)
        return arr.filter(function(ele){ return ele != ele; });
    else
        return arr.filter(function(ele){ return ele != value; });
}

function isNumber(n) { 
    return !isNaN(parseInt(n)) && !isNaN(n - 0);
}

function clearSelectableChoices() {
    const Selector = CustomElementSelector.IconBoxBtn5.Selector;
    const inputField = CustomElementSelector.IconBoxBtn5.InputField;
    const buttons = CustomElementSelector.IconBoxBtn5.Buttons;
    while (Selector.firstChild) Selector.removeChild(Selector.firstChild);
    inputField.value = "";
    Selector.style.display = 'none';
    listItems = arrayRemoveVal(listItems);
    actionItems = arrayRemoveVal(actionItems);
    CustomElementSelector.IconBoxBtn5.Buttons = arrayRemoveVal(buttons);
}

function sanitizeText( searchstring = '' ) {
        if(searchstring === '') return;
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
        const reg = /[&<>"'/]/ig;
        return searchstring.replace(reg, (match)=>(map[match]));
}

function CatagorizeSearchString(searchstring = '') {
    if(searchstring === '') return;
    let TypeSearch = "NoMatch";
    let SS = searchstring, sslength = SS.length;
    let done = false, match = '', temp2 = [], chars = null, loc = 0, words = ["hello"];
    const doesMatch = 0, doesnotMatch = -1; 
    if(!done) {
        temp2[0] = searchstring.toLocaleLowerCase();
        for(let state in States) {
            if(temp2[0].length == 2) {
                match = temp2[0].localeCompare(States[state].toLocaleLowerCase());
                if (match === doesMatch) {
                    TypeSearch = 'State'; 
                    done = true;  
                }
            } else {
                    match = temp2[0].localeCompare(state.toLocaleLowerCase());
                    if (match === doesMatch) {
                        TypeSearch = 'State'; 
                        done = true;
                    }      
            }
        }
    }
    if(!done) {
        words = searchstring.split(' ');
        if( words.length === 1 && isNumber(words[0]) )
        {
            TypeSearch = 'ZipCode';
            done = true;
        }
    }
    if(!done) {
        if(searchstring.indexOf(',') !== doesnotMatch) 
            SS = searchstring.split(',');
        words = (SS instanceof Array) ? SS[0].split(' ') : SS.split(' ');
        temp2[0] = words[words.length-1].match(regx.Counties);
        if(temp2[0]) {
            loc = SS.indexOf(temp2[0]);
            temp2[1] = SS.substring(0, loc);
            if (temp2[1].toString().split('').length >= 2)
            {
                TypeSearch = 'County';
                done = true; 
            }
        }
    }
    if(!done) {
        if(searchstring.indexOf(",") !== -1) {
            temp2 = searchstring.trim().split(',');
            words = temp2[0].trim().split(' ');
            if( temp2[1].split('').length <= 3 && !isNumber(words[0]) )
            {
                TypeSearch = 'City'; 
                done = true;  
            }
        }
    }
    if(!done) {
        words = searchstring.trim().split(' ');
        if (words.length > 1) {
            chars = words[1].match(regx.Streets);
            if( isNumber(words[0]) || words[1].localeCompare(chars) === doesMatch )
            {
                TypeSearch = 'Address'; 
                done = true;  
            }
        }
    }
    if(!done) {
        chars = searchstring.match(regx.AlphaOnly_Many);
        if (chars !== null && searchstring.trim().localeCompare(chars) === doesMatch) {
            TypeSearch = 'Name';
            done = true;
        }
    }
    if(!done) { TypeSearch = "NoMatch"; }
    
    return TypeSearch;
}

function getKey(searchKey, obj1) {
    let match = false;
    Object.keys(obj1).forEach(key => {
        if(key === searchKey) 
            match = true;
    });
    if(match)
        return obj1[searchKey];
    else 
        return '';
}

function StandardizeRecordFormat(Record) {
    const NewRecord =    {
        "Address1": "",
        "Address2": "",
        "City": " ",
        "State": "",
        "ZIP": 0,
        "County": "",
        "Name": "Lookup ",
        "Callout1": "",
        "Callout2": "",
        "WeekNumber": 0,
        "GroupLetter": "A0",
        "Latitude": 0,
        "Longitude": 0,
        "Formatted": undefined
    };

    const rec = Record;
    const keys =  Object.keys(rec);
    keys.forEach(key => {
        switch(key) {
            case 'name':
                NewRecord.Name = rec[key];
            case 'housenumber':
                NewRecord.Address1 += rec[key];
                break;
            case 'street':
            case 'address_line1':
                NewRecord.Address1 += rec[key];
                break;
            case 'address_line2':
                NewRecord.Address2 = rec[key];
                break;
            case 'city':
            case 'town':
                NewRecord.City = rec[key];
                break;
            case 'state':
                NewRecord.State = rec[key];
                break;
            case 'postcode':
                NewRecord.ZIP = rec[key];
                break;
            case 'county':
                NewRecord.County = rec[key];
                break;
            case 'lon':
                NewRecord.Longitude = parseFloat(rec[key]);
                break;
            case 'lat':
                NewRecord.Latitude = parseFloat(rec[key]);
                break;
            case 'formatted':
                NewRecord.Formatted = rec[key];
                break;
            default:
                break;            
        };
    });
    return NewRecord;
}
/*===> This function is only called by SearchMarkerData() mainly for address info <===*/
function ListChoices(TypeSearch, searchstring, Records) {
    let StrCompare = "", EqivCompare = "", itemToCompare = "",
        baseToCompare = "", SS_State = "", SS_City = "", temp = "",
        SS_Zipcode = "";

    if(searchstring.indexOf(",") !== -1) {
        temp = searchstring.trim().split(",");
        switch(temp.length) {
            case 1:
                if( temp[1].split('').length === 2 ) // if word after 1st comma's length of chars === 2
                    SS_State = temp[1].trim().toLocaleUpperCase();
                if( temp[1].split('').length > 2 && subtemp.length === 0 ) // if word after 1st comma's length of chars > 2
                    SS_City = temp[1].trim().toLocaleLowerCase();
                break;
            case 2:
                let subtemp = temp[2].trim().split(' '); // if more than 1 string
                SS_City = temp[1].trim().toLocaleLowerCase();
                if( temp[2].split('').length === 2 ) // if word after 1st comma's length of chars === 2
                    SS_State = temp[1].trim().toLocaleUpperCase();
                if(subtemp && subtemp.length === 2) {
                    SS_Zipcode = subtemp[1].trim();
                    SS_State = subtemp[0].trim().toLocaleLowerCase();
                } 
                break;
            default:
                break;
        };
    } 

    Records.forEach(record => {
        let Matches = false,  words;
        let limit = (temp.length === 0) ? 1 : temp.length;
        for(let i=0; i < limit; i++) {
            const ProcessState = ['NameOrAddressOnly', 'CityOrState', 'StateOrStateAndZip' ];
            let City = record.City.toLocaleLowerCase();
            let AbbrStateName = record.State.toLocaleUpperCase();
            switch(ProcessState[i]) {
                case 'NameOrAddressOnly':
                    itemToCompare = getKey(TypeSearch, record);
                    if( typeof itemToCompare === 'string' ) itemToCompare = itemToCompare.toLocaleLowerCase();

                    if(searchstring.indexOf(',') !== -1)
                        /*===> Isolate to only the Address <===*/
                        baseToCompare = searchstring.trim().split(',')[0].toLocaleLowerCase();
                    else
                        /*===> whole Address or Persons Name only <===*/
                        baseToCompare = searchstring.trim().toLocaleLowerCase();

                    words = baseToCompare.split('\x20');
                    if( TypeSearch === 'Address1' && !isNumber(words[0]) ) {
                        /**********************************************/
                        /* adjust the record for matching street name */
                        /* only by removing leading number in address */
                        /**********************************************/
                        words = itemToCompare.split('\x20');
                        words.splice(0, 1);
                        itemToCompare = words.join();
                    }
                    /*===> the below was done for debugging purposes  <===*/
                    StrCompare = baseToCompare.localeCompare(itemToCompare); //straight string compare
                    EqivCompare = false; // Compare for word matches and Equivalent Sound
                    //console.log(`StrCompare = ${StrCompare}, EqvCompare = ${EqvCompare}`);

                    /*===> Main Compare <===*/
                    if((StrCompare == 0 || EqivCompare) && (SS_State === "" || SS_State.localeCompare(record.State) === 0)) Matches = true; 
                    
                    break;
                case 'CityOrState':
                    if( SS_City ) Match = Match && ((SS_City.localeCompare(City) === 0) ? true : false);
                    else if( SS_State ) Match = Match && ((SS_State.localeCompare(AbbrStateName) === 0) ? true : false);
                    break;
                case 'StateOrStateAndZip':
                    let Zipcode = record.ZIP;
                    if( SS_State ) Match = Match && ((SS_State.localeCompare(AbbrStateName) === 0) ? true : false);
                    if( SS_Zipcode ) Match = Match && ((SS_Zipcode.localeCompare(Zipcode) === 0) ? true : false);
                    break;
                default:
                    break;
            };
        }
        if( Matches ) listItems.push(record);
    });
     
    return listItems.length > 0;
}

/*===> Main Decision Loop <===*/
function Lookup(searchstring) {
    let result = false;

    let ss = sanitizeText(searchstring);

    const TypeSearch = CatagorizeSearchString(ss);
   
    clearSelectableChoices();

    switch(TypeSearch) {
        case 'ZipCode':
            result = SearchZipcodeData(TypeSearch, ss);
            if(!result) { 
              result = confirm('Want me to search for the {ZipCode} on the Web?') ? GEOcodeInfo(TypeSearch, ss) : false;
            }
            break;
        case 'County':          
            result = SearchMarkerData('Name', ss) || SearchCountyData(TypeSearch, ss);
            break;
        case 'City':    
            result = confirm('Want to search for this {City,State} on the Web?') ? GEOcodeInfo(TypeSearch, ss) : false;
            break;
        case 'Address':
            result = SearchMarkerData(TypeSearch, ss);
            if( !result ) alert(`Sorry could find "${searchstring}" in the Marker's Data Records!`);
            if(!result) {
              result = confirm('Want to search for this {Address} on the Web?') ? GEOcodeInfo(TypeSearch, ss) : false;
            }
            break;
        case 'State':
            result = SearchStateData(TypeSearch, ss);
            if( !result ) alert(`Sorry could find "${searchstring}" in the USA States Data Records!`);
            break;
        case 'Name':
            result = SearchMarkerData(TypeSearch, ss);
            if( !result ) alert(`Sorry could find "${searchstring}" in the Marker's Data Records!`);
            break;
        default:
            break;
    };

    setTimeout(() => { map_globals.map.spin(false); }, 180); 
    
    return listItems.length > 0;
}
/*===> Various Lookup Functions base upon need <===*/
function SearchStateData(TypeSearch, searchstring) {
    if( TypeSearch !== 'State' || typeof searchstring != 'string' || searchstring === '') return false;
    
    const thisState = searchstring.toLocaleLowerCase();

    $.ajax({
        url: './GeoJSON/US_StateLines.json',
        type: 'GET',
        data: { },
        async: false,
        success: function(data) {   // get State GEOJSON file
                                    data.features.forEach(State => {
                                        if( State.properties.name.toLocaleLowerCase().localeCompare(thisState) === 0 ) {
                                            const record = {
                                                'name': thisState,
                                                'formatted': `State of ${thisState}`,      
                                            };
                                            const NewRecord = StandardizeRecordFormat(record);
                                            const bbox = L.geoJSON(State).getBounds();
                                            const point = bbox.getCenter();
                                            NewRecord.Latitude = point.lat;
                                            NewRecord.Longitude = point.lng;
                                            NewRecord.bbox = bbox;
                                            actionItems[listItems.length] = bbox;
                                            listItems.push(NewRecord);
                                        }
                                    });
                                },
        error: function() { alert(`This Error Occured in SearchStateData lookup\n${status}`) },
        dataType: "json"
    });

    return listItems.length > 0;
}

function SearchCountyData(TypeSearch, searchstring) {
    if( TypeSearch !== 'County' || typeof searchstring != 'string' || searchstring === '') return false;
    const SaintStr      = searchstring.match(regx.Saint);

    if(SaintStr) {
        let temp        = searchstring.replace(SaintStr,"St.");
        searchstring    = temp;
    }
    const typeName      = searchstring.match(regx.Counties);
    const TypeOfCounty  = ` ${typeName}, `;
    const locNo         = searchstring.indexOf(typeName) -1;
    const thisCounty    = (searchstring.substring(0,locNo)).toLocaleLowerCase();

    $.ajax({
        url: './GeoJSON/US_StateCounty_Boundaries.json',
        type: 'GET',
        data: { },
        async: false,
        success: function(data) {   // get county GEOJSON file
                                    let counter = 0;
                                    let SS_State = "";
                                    if(searchstring.indexOf(",") !== -1) {
                                        let temp = searchstring.trim().split(",");
                                        if( temp.length === 2) SS_State = temp[1].trim();
                                    } else {
                                        switch(typeName[0]) {
                                            case 'Parish':
                                            case 'Prsh':
                                                let temp = data.features.filter(StateCounty => {
                                                    return StateCounty.properties.STATE === '22';
                                                });
                                                data.features = temp;
                                                break;
                                            case 'Boroughs': {
                                                let temp = data.features.filter(StateCounty => {
                                                    return StateCounty.properties.STATE === '02';
                                                });
                                                data.features = temp;
                                                break;
                                            }
                                            default:
                                                break;
                                        }
                                    }
                                    data.features.forEach(StateCounty => {
                                        if( StateCounty.properties.NAME.toLocaleLowerCase().localeCompare(thisCounty) === 0 ) {
                                            let State = SearchKeyValue(StateCounty.properties.STATE);
                                            const AbbrStateName = States[State];
                                            if(SS_State === "" || SS_State.split('').length === 2 && AbbrStateName.indexOf(SS_State) === 0) { 
                                                const record = {
                                                    'name': thisCounty,
                                                    'county': thisCounty,
                                                    'state': AbbrStateName,
                                                    'formatted': thisCounty.toLocaleUpperCase() + TypeOfCounty + AbbrStateName
                                                };
                                                const NewRecord = StandardizeRecordFormat(record);
                                                const bbox = L.geoJSON(StateCounty).getBounds();
                                                const point = bbox.getCenter();
                                                NewRecord.Latitude = point.lat;
                                                NewRecord.Longitude = point.lng;
                                                NewRecord.bbox = bbox;
                                                actionItems[listItems.length] = bbox;
                                                listItems.push(NewRecord);
                                                counter++; 
                                            }
                                        }
                                    });
                                },
        error: function() { alert(`This Error Occured in SearchCountyData lookup\n${status}`) },
        dataType: "json"
    });
    return listItems.length > 0;
}

function SearchZipcodeData(TypeSearch, searchstring) {  
    if( TypeSearch !== 'ZipCode' || typeof searchstring != 'string' || searchstring === '') return false;
    let thisZipcode;
    if(searchstring.indexOf('-') != -1)
        thisZipcode = searchstring.split('-')[0].trim();
    else
        thisZipcode = searchstring.trim();

    $.ajax({
        url: './GeoJSON/US_ZipCode_Boundaries.json',
        type: 'GET',
        data: { },
        async: false,
        success: function(data) {   // get Zipcode GEOJSON file
                data.features.forEach(ZipcodeArea => {
                    let CurrentZipcode = ZipcodeArea.properties.ZCTA5CE10;
                    if( CurrentZipcode.localeCompare(thisZipcode) === 0 ) {
                        let State = ZipCodeToStateName(thisZipcode);
                        const AbbrStateName = States[State];
                        const record = {
                            'name': thisZipcode,
                            'county': "unknown",
                            'state': AbbrStateName,
                            'formatted': thisZipcode + " Zipcode, "
                        };
                        const NewRecord = StandardizeRecordFormat(record);
                        const bbox = L.geoJSON(ZipcodeArea).getBounds();
                        const point = bbox.getCenter();
                        NewRecord.Latitude = point.lat;
                        NewRecord.Longitude = point.lng;
                        NewRecord.bbox = bbox;
                        actionItems[listItems.length] = bbox;
                        listItems.push(NewRecord);
                    }
                });
            },
        error: function() { alert(`This Error Occured in SearchZipcodeData lookup\n${status}`) },
        dataType: "json"
    });
    return listItems.length > 0; 
}

function GEOcodeInfo(TypeSearch, searchstring) {
    let result = [];
    result[0] = typeof TypeSearch !== 'string';
    result[1] = TypeSearch === '';
    result[2] = searchstring === '';
    let totalresult = false;
    result.forEach(result => totalresult = totalresult || result );
    if(totalresult) return false;

    const url = 'https://api.geoapify.com/v1' +
                `/geocode/autocomplete?text=${searchstring}&` +
                `apiKey=${map_globals.API_token}`;
    $.ajax({
        type: "get",
        url: url,
        data: { format: 'json'},
        async: false,
        success: function(data,status) {
            if(status === "success") {
                if (data.features.length === 0) 
                    return false;
                else {
                    const Records = data.features;
                    /*===> validate results <===*/
                    Records.forEach((record,index) => {
                        let name, city, county, address, targetState, actualState;
                        const NewRecord = StandardizeRecordFormat(record.properties);
                        let filterout = true;
                        switch(TypeSearch) {
                            case 'City':
                                    filterout = false; 
                                break;
                            case 'County':
                                name = NewRecord.Name.toLocaleLowerCase();
                                county = NewRecord.County.toLocaleLowerCase();
                                targetState = searchstring.split(',')[1].trim().split(' ')[0];
                                actualState = NewRecord.State.split(',')[0];
                                if( 
                                    name.localeCompare(county) !== 0 || 
                                    targetState.localeCompare(States[resultState]) !== 0
                                  )
                                { 
                                      filterout = false; 
                                }
                                break;
                            case 'Address':
                                filterout = false; 
                                break;
                            default:
                                break;
                        };
                        if( filterout === false ) {
                            listItems.push(NewRecord);
                            if(record.bbox) {
                                let bbox = record.bbox;
                                record.bbox = [ [bbox[1], bbox[0]], [bbox[3], bbox[2]] ];
                                actionItems[index] = record.bbox;
                            }
                        }
                    });
                    return listItems.length > 0;
                }
            }
        },
        error: function() { alert(`This Error Occured in GEOcode lookup\n${status}`) },
        dataType: "json",
    });

    return false;
}

function SearchMarkerData(TypeSearch, searchstring) {
    let result = [];

    // Validate Parameters
    result[0] = typeof TypeSearch !== 'string';
    result[1] = TypeSearch === '';
    result[2] = searchstring === '';
    let totalresult = false;
    result.forEach(result => totalresult = totalresult || result);
    if(totalresult) return false;

    let Records = convertJSONtoObject(map_globals.data);

    let ConvertType;
    switch(TypeSearch) {
        case 'Name':
            ConvertType = 'Name';
            break;
        case 'City':
            ConvertType = 'City';  
            break;
        case 'Address':
            ConvertType = 'Address1'; 
            break;
        default:
            break;
    };

    let counter = ListChoices(ConvertType, searchstring, Records);

    return counter > 0;
}
