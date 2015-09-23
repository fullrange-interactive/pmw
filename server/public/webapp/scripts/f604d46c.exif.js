(function(){function a(a){return!!a.exifdata}function b(a,b){b=b||a.match(/^data\:([^\;]+)\;base64,/im)[1]||"",a=a.replace(/^data\:([^\;]+)\;base64,/gim,"");for(var c=atob(a),d=c.length,e=new ArrayBuffer(d),f=new Uint8Array(e),g=0;d>g;g++)f[g]=c.charCodeAt(g);return e}function c(a,b){var c=new XMLHttpRequest;c.open("GET",a,!0),c.responseType="blob",c.onload=function(){(200==this.status||0===this.status)&&b(this.response)},c.send()}function d(a,d){function g(b){var c=e(b),g=f(b);a.exifdata=c||{},a.iptcdata=g||{},d&&d.call(a)}if(a.src)if(/^data\:/i.test(a.src)){var h=b(a.src);g(h)}else if(/^blob\:/i.test(a.src)){var i=new FileReader;i.onload=function(a){g(a.target.result)},c(a.src,function(a){i.readAsArrayBuffer(a)})}else{var j=new XMLHttpRequest;j.onload=function(){if(200!=this.status&&0!==this.status)throw"Could not load image";g(j.response),j=null},j.open("GET",a.src,!0),j.responseType="arraybuffer",j.send(null)}else if(window.FileReader&&(a instanceof window.Blob||a instanceof window.File)){var i=new FileReader;i.onload=function(a){l&&console.log("Got file of length "+a.target.result.byteLength),g(a.target.result)},i.readAsArrayBuffer(a)}}function e(a){var b=new DataView(a);if(l&&console.log("Got file of length "+a.byteLength),255!=b.getUint8(0)||216!=b.getUint8(1))return l&&console.log("Not a valid JPEG"),!1;for(var c,d=2,e=a.byteLength;e>d;){if(255!=b.getUint8(d))return l&&console.log("Not a valid marker at offset "+d+", found: "+b.getUint8(d)),!1;if(c=b.getUint8(d+1),l&&console.log(c),225==c)return l&&console.log("Found 0xFFE1 marker"),k(b,d+4,b.getUint16(d+2)-2);d+=2+b.getUint16(d+2)}}function f(a){var b=new DataView(a);if(l&&console.log("Got file of length "+a.byteLength),255!=b.getUint8(0)||216!=b.getUint8(1))return l&&console.log("Not a valid JPEG"),!1;for(var c=2,d=a.byteLength,e=function(a,b){return 56===a.getUint8(b)&&66===a.getUint8(b+1)&&73===a.getUint8(b+2)&&77===a.getUint8(b+3)&&4===a.getUint8(b+4)&&4===a.getUint8(b+5)};d>c;){if(e(b,c)){var f=b.getUint8(c+7);f%2!==0&&(f+=1),0===f&&(f=4);var h=c+8+f,i=b.getUint16(c+6+f);return g(a,h,i)}c++}}function g(a,b,c){for(var d,e,f,g,h,i=new DataView(a),k={},l=b;b+c>l;)28===i.getUint8(l)&&2===i.getUint8(l+1)&&(g=i.getUint8(l+2),g in t&&(f=i.getInt16(l+3),h=f+5,e=t[g],d=j(i,l+5,f),k.hasOwnProperty(e)?k[e]instanceof Array?k[e].push(d):k[e]=[k[e],d]:k[e]=d)),l++;return k}function h(a,b,c,d,e){var f,g,h,j=a.getUint16(c,!e),k={};for(h=0;j>h;h++)f=c+12*h+2,g=d[a.getUint16(f,!e)],!g&&l&&console.log("Unknown tag: "+a.getUint16(f,!e)),k[g]=i(a,f,b,c,e);return k}function i(a,b,c,d,e){var f,g,h,i,k,l,m=a.getUint16(b+2,!e),n=a.getUint32(b+4,!e),o=a.getUint32(b+8,!e)+c;switch(m){case 1:case 7:if(1==n)return a.getUint8(b+8,!e);for(f=n>4?o:b+8,g=[],i=0;n>i;i++)g[i]=a.getUint8(f+i);return g;case 2:return f=n>4?o:b+8,j(a,f,n-1);case 3:if(1==n)return a.getUint16(b+8,!e);for(f=n>2?o:b+8,g=[],i=0;n>i;i++)g[i]=a.getUint16(f+2*i,!e);return g;case 4:if(1==n)return a.getUint32(b+8,!e);for(g=[],i=0;n>i;i++)g[i]=a.getUint32(o+4*i,!e);return g;case 5:if(1==n)return k=a.getUint32(o,!e),l=a.getUint32(o+4,!e),h=new Number(k/l),h.numerator=k,h.denominator=l,h;for(g=[],i=0;n>i;i++)k=a.getUint32(o+8*i,!e),l=a.getUint32(o+4+8*i,!e),g[i]=new Number(k/l),g[i].numerator=k,g[i].denominator=l;return g;case 9:if(1==n)return a.getInt32(b+8,!e);for(g=[],i=0;n>i;i++)g[i]=a.getInt32(o+4*i,!e);return g;case 10:if(1==n)return a.getInt32(o,!e)/a.getInt32(o+4,!e);for(g=[],i=0;n>i;i++)g[i]=a.getInt32(o+8*i,!e)/a.getInt32(o+4+8*i,!e);return g}}function j(a,b,c){var d="";for(n=b;b+c>n;n++)d+=String.fromCharCode(a.getUint8(n));return d}function k(a,b){if("Exif"!=j(a,b,4))return l&&console.log("Not valid EXIF data! "+j(a,b,4)),!1;var c,d,e,f,g,i=b+6;if(18761==a.getUint16(i))c=!1;else{if(19789!=a.getUint16(i))return l&&console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),!1;c=!0}if(42!=a.getUint16(i+2,!c))return l&&console.log("Not valid TIFF data! (no 0x002A)"),!1;var k=a.getUint32(i+4,!c);if(8>k)return l&&console.log("Not valid TIFF data! (First offset less than 8)",a.getUint32(i+4,!c)),!1;if(d=h(a,i,i+k,q,c),d.ExifIFDPointer){f=h(a,i,i+d.ExifIFDPointer,p,c);for(e in f){switch(e){case"LightSource":case"Flash":case"MeteringMode":case"ExposureProgram":case"SensingMethod":case"SceneCaptureType":case"SceneType":case"CustomRendered":case"WhiteBalance":case"GainControl":case"Contrast":case"Saturation":case"Sharpness":case"SubjectDistanceRange":case"FileSource":f[e]=s[e][f[e]];break;case"ExifVersion":case"FlashpixVersion":f[e]=String.fromCharCode(f[e][0],f[e][1],f[e][2],f[e][3]);break;case"ComponentsConfiguration":f[e]=s.Components[f[e][0]]+s.Components[f[e][1]]+s.Components[f[e][2]]+s.Components[f[e][3]]}d[e]=f[e]}}if(d.GPSInfoIFDPointer){g=h(a,i,i+d.GPSInfoIFDPointer,r,c);for(e in g){switch(e){case"GPSVersionID":g[e]=g[e][0]+"."+g[e][1]+"."+g[e][2]+"."+g[e][3]}d[e]=g[e]}}return d}var l=!1,m=this,o=function(a){return a instanceof o?a:this instanceof o?void(this.EXIFwrapped=a):new o(a)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=o),exports.EXIF=o):m.EXIF=o;var p=o.Tags={36864:"ExifVersion",40960:"FlashpixVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37500:"MakerNote",37510:"UserComment",40964:"RelatedSoundFile",36867:"DateTimeOriginal",36868:"DateTimeDigitized",37520:"SubsecTime",37521:"SubsecTimeOriginal",37522:"SubsecTimeDigitized",33434:"ExposureTime",33437:"FNumber",34850:"ExposureProgram",34852:"SpectralSensitivity",34855:"ISOSpeedRatings",34856:"OECF",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureBias",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37396:"SubjectArea",37386:"FocalLength",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41492:"SubjectLocation",41493:"ExposureIndex",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRation",41989:"FocalLengthIn35mmFilm",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",40965:"InteroperabilityIFDPointer",42016:"ImageUniqueID"},q=o.TiffTags={256:"ImageWidth",257:"ImageHeight",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer",40965:"InteroperabilityIFDPointer",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",274:"Orientation",277:"SamplesPerPixel",284:"PlanarConfiguration",530:"YCbCrSubSampling",531:"YCbCrPositioning",282:"XResolution",283:"YResolution",296:"ResolutionUnit",273:"StripOffsets",278:"RowsPerStrip",279:"StripByteCounts",513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength",301:"TransferFunction",318:"WhitePoint",319:"PrimaryChromaticities",529:"YCbCrCoefficients",532:"ReferenceBlackWhite",306:"DateTime",270:"ImageDescription",271:"Make",272:"Model",305:"Software",315:"Artist",33432:"Copyright"},r=o.GPSTags={0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential"},s=o.StringValues={ExposureProgram:{0:"Not defined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{0:"Unknown",1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},SensingMethod:{1:"Not defined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},SceneType:{1:"Directly photographed"},CustomRendered:{0:"Normal process",1:"Custom process"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},GainControl:{0:"None",1:"Low gain up",2:"High gain up",3:"Low gain down",4:"High gain down"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},SubjectDistanceRange:{0:"Unknown",1:"Macro",2:"Close view",3:"Distant view"},FileSource:{3:"DSC"},Components:{0:"",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"}},t={120:"caption",110:"credit",25:"keywords",55:"dateCreated",80:"byline",85:"bylineTitle",122:"captionWriter",105:"headline",116:"copyright",15:"category"};o.getData=function(b,c){return(b instanceof Image||b instanceof HTMLImageElement)&&!b.complete?!1:(a(b)?c&&c.call(b):d(b,c),!0)},o.getTag=function(b,c){return a(b)?b.exifdata[c]:void 0},o.getAllTags=function(b){if(!a(b))return{};var c,d=b.exifdata,e={};for(c in d)d.hasOwnProperty(c)&&(e[c]=d[c]);return e},o.pretty=function(b){if(!a(b))return"";var c,d=b.exifdata,e="";for(c in d)d.hasOwnProperty(c)&&(e+="object"==typeof d[c]?d[c]instanceof Number?c+" : "+d[c]+" ["+d[c].numerator+"/"+d[c].denominator+"]\r\n":c+" : ["+d[c].length+" values]\r\n":c+" : "+d[c]+"\r\n");return e},o.readFromBinaryFile=function(a){return e(a)},"function"==typeof define&&define.amd&&define("exif-js",[],function(){return o})}).call(this);