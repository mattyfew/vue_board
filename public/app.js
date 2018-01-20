(function(){


    var app = new Vue({
        el: 'main',
        data: {
            images: []
        },
        mounted: function() {
            console.log("running mounted")
            var vm = this
            axios.get('/images')
                .then(response => {
                    vm.images = response.data.images
                    console.log(vm.images);
                })
                .catch(e => console.log("There was an error with GET /image", e))
        },
        methods: {
            upload: function() {
                console.log("running upload method")
            }
        }
    })




    addEventListener('hashchange',  function() {
        app.showImage(location.hash.slice(1))
    })

})()
