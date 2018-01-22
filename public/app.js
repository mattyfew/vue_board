(function(){


    var app = new Vue({
        el: 'main',
        data: {
            images: [],
            formStuff: {
                title: '',
                description: '',
                username: '',
                file: null
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
            chooseFile: function(e) {
                this.formStuff.file = e.target.files[0];
            },

            upload: function(e) {
                e.preventDefault()

                const formData = new FormData()
                formData.append('file', this.formStuff.file)
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
