define(function(){

this["JST"] = this["JST"] || {};

this["JST"]["test/fixtures/template.html"] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='<head><title data-binding="obj.title">'+
((__t=(typeof  obj.title !== 'undefined' ?  obj.title  : ''))==null?'':__t)+
'</title></head>';
return __p;
};

  return this["JST"];

});