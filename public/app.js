(function(){

    var app = new Vue({
        el: 'main',
        data: {
            images: [],
            imageId: void 0,
            showUpload: false
        },

        mounted() {
            var vm = this
            axios.get('/images')
                .then(response => {
                    vm.images = response.data.images
                })
                .catch(e => console.log("There was an error with GET /image", e))
        },

        methods: {
            showImage(id) {
                this.imageId = id
                var img = this.images.find(img => img.id == id)
                if (img) {
                    // document.body.style.overflow = 'hidden';
                }
            },

            hideImage() {
                this.imageId = null
                document.body.style.overflow = ''
                location.hash = ''
            },

            toggleUploadForm() {
                this.showUpload = !this.showUpload
            },

            addImage(image) {
                this.images.unshift(image)
            }
        }
    })

    Vue.component('upload-form', {
        template: '#upload-form-template',
        data() {
            return {
                formStuff: {
                    title: '',
                    description: '',
                    username: '',
                    file: null
                }
            }
        },

        methods: {
            upload(e) {
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

            chooseFile(e) {
                this.formStuff.file = e.target.files[0];
            },

            hide(){
                this.$emit('hide')
            }
        }
    })

    Vue.component('single-image', {
        template: '#single-image-template',
        props: [ 'imageId' ],
        data() {
            return {
                image: {
                    title: '',
                    description: '',
                    username: ''
                }
            }
        },
        watch: {
            imageId() {
                this.imageId ? this.getImage() : this.hide()
            }
        },
        mounted() {
            this.getImage()
        },
        methods: {
            getImage() {
                var component = this

                axios.get('/image/' + this.imageId).then(response => {
                    component.image = response.data.image
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
            hide(e) {
                this.$emit('hide')
            }
        }

    })

    addEventListener('hashchange', () => {
        const imageId = location.hash.slice(1)
        app.showImage(imageId)
    })

})()
