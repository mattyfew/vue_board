(function(){


    var app = new Vue({
        el: 'main',

        data: {},

        mounted: function() {
            console.log("running mounted")
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
