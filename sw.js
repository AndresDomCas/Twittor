/* APP SHELL */

//Importando scripts que se ubican en otra carpeta
importScripts('js/sw-utils.js'); //Se añade al app shell

//Declaracion de 3 variables para segmentar los caches 
const CACHE_STATIC_NAME    = 'static-v0.2';
const CACHE_DYNAMIC_NAME   = 'dynamic-V0.2';
const CACHE_DYNAMIC_LIMIT  = 50;
const CACHE_INMUTABLE_NAME = 'inmutable-v0.1';

//Contenido necesario de la app shell para que la aplicacion o web funcione
const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

//Contenido que no se va a modificar jamas
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//Instalacion del service worker
self.addEventListener('install',e=>{
    //Almacenar el cache estatico(static) y el inmutable
    const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache=>{
        cache.addAll(APP_SHELL);
    });

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache=>{
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    e.waitUntil( Promise.all([cacheStatic,cacheInmutable]) );
});

//Eliminacion de las diferentes versiones del cache que sea diferente al actual
self.addEventListener('activate',e=>{
    //Aqui se obtiene todos los nombres de los caches que contiene en la aplicacion o en el hosting 
    const respuesta= caches.keys().then(keys=>{
        keys.forEach(key=>{
            if (key !== CACHE_STATIC_NAME && key.includes('static')) {
                //Aqui se eliminara si es una version diferente de la reciente
                return caches.delete(key);
            }

            if (key !== CACHE_DYNAMIC_NAMEs && key.includes('dynamic')) {
                //Aqui se eliminara si es una version diferente de la reciente
                return caches.delete(key);
            }

        });
    });

    e.waitUntil(respuesta);
});

//Cache
self.addEventListener('fetch',e=>{
    //Verificar si en el  cache existe un request   
    const respuesta= caches.match(e.request).then(res=>{
        if (res) {
            return res;
        }else{
            //Estrategia cache with network fallback
            return fetch(e.request).then( newRes=>{
                //Se ejecuta la funcion creada en js/sw-utils.js
                return actualizarCacheDinamico(CACHE_DYNAMIC_NAME,e.request,newRes);
            });
        }
        
    });

    e.respondWith(respuesta);
});
