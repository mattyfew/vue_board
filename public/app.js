(function(){


    var app = new Vue({
        el: 'main',
        data: {
            images: [],
            formStuff: {
                title: '',
                description: '',
                username: ''
            }

        },
        mounted: function() {
            var vm = this
            axios.get('/images')
                .then(response => {
                    vm.images = response.data.images
                })
                .catch(e => console.log("There was an error with GET /image", e))
        },
        methods: {
            upload: function(e) {
                e.preventDefault()

                // let file = $('input[type="file"]').get(0).files[0]
                // const file = document.querySelector('input[type="file"]').files[0]
                const file = document.querySelector('input[type="file"]').files
                let formData = new FormData()
                formData.append('file', file)
                formData.append('title', this.formStuff.title)
                formData.append('description', this.formStuff.description)
                formData.append('username', this.formStuff.username)


                axios.post('/upload-image', formData)
                    .then(response => {
                        console.log(response)
                    })
            }
        }
    })




    addEventListener('hashchange',  function() {
        app.showImage(location.hash.slice(1))
    })

})()
