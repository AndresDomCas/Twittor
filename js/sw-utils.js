//Este archvio permite ser un auxiliar para almacenar la logica y pasarlo al service worker

//Guardar en el cache dinamico
function actualizarCacheDinamico( dynamicCache,req,res ){
    //Validacion de que si la respuesta lo hace,quiere decir que la respuesta tiene datos que se almacenaran en cache
    if (res.ok) {
        return caches.open(dynamicCache).then(cache =>{
            //Almacenar en cache la request
            //Se clona la respuesta
            cache.put(req,res.clone());

            //Y se retorna el res.clonde()
            return res.clone();
        });
    }else{
        return res;
    }
    
}