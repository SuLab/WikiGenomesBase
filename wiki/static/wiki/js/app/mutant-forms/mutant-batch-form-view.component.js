angular
    .module('mutantBatch')
    .component('mutantBatch', {
        bindings: {
            data: '<'
        },
        controller: function (Upload) {
            var ctrl = this;
            ctrl.submit = function () {
                console.log(ctrl.file);
                if (ctrl.file) {
                    ctrl.upload(ctrl.file);
                    console.log('thing');
                }
            };

            // upload on file select or drop
            ctrl.upload = function (file) {
                Upload.upload({
                    url: '/wd_upload',
                    data: {file: file, 'username': ctrl.username}
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            };


        },
        templateUrl: '/static/wiki/js/angular_templates/mutant-batch.html'
    });

