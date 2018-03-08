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
                },
                commentForm: {
                    comment: '',
                    username: ''
                },
                comments: []
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
                axios.get('/image/' + this.imageId).then(response => {
                    this.image = response.data.image
                    this.comments = response.data.comments
                })
            },

            submitComment(e) {
                axios.post(`/comment/${this.imageId}`, {
                    comment: this.commentForm.comment,
                    username: this.commentForm.username
                })
                .then(res => {
                    this.comments.push(res.data.comment)
                }).catch(err => console.log("There was an error with POST /comment", err))

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
