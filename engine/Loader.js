;(function(){
    'use strict'
    class Loader {
        constructor(){
            this.LoadOrder ={
                images:[],
                jsons:[] 
            }
            this.resources = {
                images:[],
                jsons:[]
            }
        }
        
        addImage(name,src){
            this.LoadOrder.images.push({name,src})
        }
        
        addJson(name,address){
            this.LoadOrder.jsons.push({name,address})
        }

        load(callback){
            const promises =[]
            for(const imageData of this.LoadOrder.images){
                const {name,src} = imageData
                const promise = Loader
                    .LoadImage(src)
                    .then(image =>{
                        this.resources.images[name] = image
                        if(this.LoadOrder.images.includes(imageData)){
                            const index = this.LoadOrder.images.indexOf(imageData)
                            this.LoadOrder.images.splice(index,1)
                        }
                    })
                promises.push(promise)
            }

            for(const jsonData of this.LoadOrder.jsons){
                const {name,address} = jsonData
                const promise = Loader
                    .LoadJson(address)
                    .then(image =>{
                        this.resources.jsons[name] = image
                        if(this.LoadOrder.jsons.includes(jsonData)){
                            const index = this.LoadOrder.images.indexOf(jsonData)
                            this.LoadOrder.jsons.splice(index,1)
                        }
                    })
                promises.push(promise)
            }

            Promise.all(promises).then( callback)
         }
        static LoadImage(src){
            return new Promise((resolve,reject) => {
                try{
                    const image = new Image
                    image.onload =() => resolve(image)
                    image.src = src
                }
                catch(err){
                    reject(err)
                }
            })
        }

        static LoadJson(address){
            return new Promise((resolve,reject) => {
                fetch(address)
                    .then(result => result.json())
                    .then(result => resolve(result))
                    .catch(err => reject(err))
            })
        }
    }

    window.GameEngine = window.GameEngine||{}
    window.GameEngine.Loader = Loader
})();