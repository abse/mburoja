// Apply validated saved preferences before CSS to avoid a preference flash.
(()=>{try{const root=document.documentElement;for(const [key,values,fallback] of [
 ['theme',['system','light','dark'],'system'],['textSize',['normal','large','larger'],'normal'],
 ['arabicFont',['hamdullah','kitab','amiri','noto','abay','latif','system'],'hamdullah'],['latinFont',['system','roboto','poppins','open-sans','lato','montserrat','georgia'],'system'],
 ['lineSpacing',['normal','comfortable','wide'],'normal']]){
 const value=localStorage.getItem('mburoja.'+key);if(values.includes(value)&&value!==fallback)root.dataset[key]=value;
}}catch{}})();
