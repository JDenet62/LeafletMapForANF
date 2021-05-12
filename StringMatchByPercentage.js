function compare(c, u) {
    //ca = correct answer array (Collection of all correct answer)
    let ca = c.split(",");
    //u = array of user answer words cleaned using custom clean function
    u = clean(u);
    for (var z = 0; z < ca.length; z++) {
        //caa = a single correct answer word array (collection of words of a single correct answer)
        let caa = $.trim(ca[z]).split(" "); //get a word
        let NMatchingWords = 0; //count of matching words
        caa.forEach((item,index) => { // iterate through the letters in the word
            if( 
                item != null &&
                item != ""  &&
                u[index] != null &&
                u[index] != ""
              ) 
            {
                    let word1 = item;
                    let word2 = u[index];
                    let Wa = soundex(word1);
                    let Wb = soundex(word2);
                    if (Wa != null && Wb != null && Wa === Wb) NMatchingWords++;
                    else if (word2.indexOf(word1) > -1) NMatchingWords++;
            }
        });
        const matchN = [0.0,1.0,0.5,0.67,0.75,0.8];
        if ( (NMatchingWords / caa.length) > matchN[caa.length] ) return true;
    }
    return false;
}

// create object listing the SOUNDEX values for each letter
// -1 indicates that the letter is not coded, but is used for coding
//  0 indicates that the letter is omitted for modern census archives
//    but acts like -1 for older census archives
//  1 is for BFPV
//  2 is for CGJKQSXZ
//  3 is for DT
//  4 is for L
//  5 is for MN
//  6 is for R
function makesoundex() {
    this.a = -1
    this.b = 1
    this.c = 2
    this.d = 3
    this.e = -1
    this.f = 1
    this.g = 2
    this.h = 0
    this.i = -1
    this.j = 2
    this.k = 2
    this.l = 4
    this.m = 5
    this.n = 5
    this.o = -1
    this.p = 1
    this.q = 2
    this.r = 6
    this.s = 2
    this.t = 3
    this.u = -1
    this.v = 1
    this.w = 0
    this.x = 2
    this.y = -1
    this.z = 2
}

var sndx = new makesoundex()

// check to see that the input is valid
// function isSurname(name) {
//     if (name == "" || name == null) {
//         return false
//     } else {
//         for (var i = 0; i < name.length; i++) {
//             var letter = name.charAt(i)
//             if (!(letter >= 'a' && letter <= 'z' || letter >= 'A' && letter <= 'Z')) {
//                 return false
//             }
//         }
//     }
//     return true
// }

// // Collapse out directly adjacent sounds
// // 1. Assume that surname.length>=1
// // 2. Assume that surname contains only lowercase letters
// function collapse(surname) {
//     if (surname.length == 1) {
//         return surname
//     }
//     var right = collapse(surname.substring(1, surname.length))
//     if (sndx[surname.charAt(0)] == sndx[right.charAt(0)]) {
//         return surname.charAt(0) + right.substring(1, right.length)
//     }
//     return surname.charAt(0) + right
// }

// // Collapse out directly adjacent sounds using the new National Archives method
// // 1. Assume that surname.length>=1
// // 2. Assume that surname contains only lowercase letters
// // 3. H and W are completely ignored
// function omit(surname) {
//     if (surname.length == 1) {
//         return surname
//     }
//     var right = omit(surname.substring(1, surname.length))
//     if (!sndx[right.charAt(0)]) {
//         return surname.charAt(0) + right.substring(1, right.length)
//     }
//     return surname.charAt(0) + right
// }

// // Output the coded sequence
// function output_sequence(seq) {
//     var output = seq.charAt(0).toUpperCase() // Retain first letter
//     output += "-" // Separate letter with a dash
//     var stage2 = seq.substring(1, seq.length)
//     var count = 0
//     for (var i = 0; i < stage2.length && count < 3; i++) {
//         if (sndx[stage2.charAt(i)] > 0) {
//             output += sndx[stage2.charAt(i)]
//             count++
//         }
//     }
//     for (; count < 3; count++) {
//         output += "0"
//     }
//     return output
// }

// Compute the SOUNDEX code for the surname
var soundex = function(s) {
    var a = s.toLowerCase().split(''),
        f = a.shift(),
        r = '',
        codes = { a: '', e: '', i: '', o: '', u: '', b: 1, f: 1, p: 1, v: 1, c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2, d: 3, t: 3, l: 4, m: 5, n: 5, r: 6 };

    r = f + 
        a
        .map(function(v, i, a) {
            return codes[v]
        })
        .filter(function(v, i, a) {
            return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
        })
        .join('');

    return (r + '000').slice(0, 4).toUpperCase();
};

function clean(u) {
    
    var u = u.replace('\,','');
    u = u.toLowerCase().split(" ");
    var cw = ["garbage"];// array of words to exclude

    var n = [];
    for (var y = 0; y < u.length; y++) {
        var test = false;
        for (var z = 0; z < cw.length; z++) {
            if (u[y] != "" && u[y] != cw[z]) {
                test = true;
                break;
            }
        }
        if (test) {
            //Don't use & or $ in comparison
            var val = u[y].replace("$", "").replace("&", "");
            n.push(val);
        }
    }
    return n;
}