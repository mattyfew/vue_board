(function(){

    var app = new Vue({
        el: 'main',
        data: {
            images: [],
            imageId: void 0,
            showUpload: false
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
                // this.imageId = void 0;
                console.log("running hide image");
                this.imageId = null;
                document.body.style.overflow = '';
                location.hash = '';
            },

            toggleUploadForm: function() {
                this.showUpload = !this.showUpload
            },

            addImage: function(image) {
                console.log("in this bitch");
                this.images.unshift(image)
            }
        }
    })

    Vue.component('upload-form', {
        template: '#upload-form-template',
        data: function() {
            return {
                formStuff: {
                    title: '',
                    description: '',
                    username: '',
                    file: null
                },
            }
        },
        methods: {
            upload: function(e) {
                e.preventDefault()
                const vm = this

                const formData = new FormData()
                formData.append('file', this.formStuff.file)
                formData.append('title', this.formStuff.title)
                formData.append('description', this.formStuff.description)
                formData.append('username', this.formStuff.username)

                axios.post('/upload-image', formData)
                    .then(response => {
                        this.$emit('sendimage', response.data.image)
                        vm.formStuff = {}
                        document.querySelector('input[type="file"]').value = ''
                    })
            },

            chooseFile: function(e) {
                this.formStuff.file = e.target.files[0];
            },

            hide: function(){
                console.log("running hide upload-form")
                this.$emit('hide')
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
                    // component.image = response.data.results

                    // component.comments = response.data.comments;

                    /**
                        component.title = response.data.results.title
                        component.description = response.data.results.description
                        component.username = response.data.results.username
                        component.image = response.data.results.image
                     */
                })
            },
            hide: function() {
                console.log("running hide")
                this.$emit('hide')
            }
        }

    })

    addEventListener('hashchange',  function() {
        const imageId = location.hash.slice(1)
        app.showImage(imageId)
    })

})()
