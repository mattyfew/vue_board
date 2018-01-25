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
            },
            imageId: void 0
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
            },

            showImage: function(id) {
                this.imageId = id;
                var img = this.images.find(function(img) {
                    return img.id == id;
                });
                if (img) {
                    // document.body.style.overflow = 'hidden';
                }
            },

            hideImage: function() {
                this.imageId = void 0;
                document.body.style.overflow = '';
                location.hash = '';
            }
        }
    })


    Vue.component('single-image', {
        template: '#single-image-template',
        props: [ 'imageId' ],
        data: function() {
            return {
                image: void 0
            }
        },
        watch: {
            imageId: function() {
                this.imageId ? this.getImage() : this.hide();
            }
        },
        mounted: function() {
            this.getImage();
        },
        methods: {
            getImage: function() {
                console.log("running getImage");
                var component = this;

                axios.get('/image/' + this.imageId).then(function(response) {
                    component.image = response.data.image;
                    // component.comments = response.data.comments;
                })
            },
            hide: function() {
                console.log("running hide");
                this.$emit('hide');
            }
        }

    })

    addEventListener('hashchange',  function() {
        const imageId = location.hash.slice(1)
        app.showImage(imageId)
    })

})()
