angular
    .module('mutantBatch')
    .component('mutantBatch', {
        bindings: {
            data: '<'
        },
        controller: function ($timeout, uploadFile, Upload) {
            var ctrl = this;
            ctrl.uploadFiles = function (file, errFiles) {
                ctrl.f = file;
                ctrl.errFile = errFiles && errFiles[0];
                if (file) {
                    uploadFile.uploadFile('/wd_upload', file).then(function (response) {
                        console.log(response);
                    });
                        file.upload = Upload.upload({
                            url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                            data: {file: file}
                        });
                        file.upload.then(function (response) {
                            $timeout(function () {
                                file.result = response.data;
                            });
                        }, function (response) {
                            if (response.status > 0)
                                ctrl.errorMsg = response.status + ': ' + response.data;
                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });
                    }
                };

            ctrl.metaModel = {

            };

            },
                templateUrl
            :
            '/static/wiki/js/angular_templates/mutant-batch.html'
        });

