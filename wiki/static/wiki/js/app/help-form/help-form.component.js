angular.module('helpForm')
    .controller('helpFormCtrl', function($http) {
        'use strict';
        
        this.name = "";
        this.email = "";
        this.description = "";
        
        this.submit = function() {
            this.submitted = true;
            
            if (this.subject == undefined) {
                this.subject = "Chlambase Help";
            }
            
            var body = 'Name: ' + this.name + 
            '\nSender: ' + this.email + 
            '\nUrl: ' + window.location.href +
            '\nDescription: ' + this.description;
            
            var url = 'email?subject=' + encodeURIComponent(this.subject) + '&body=' + encodeURIComponent(body);
            
            $http.get(url).then(function (response) {
               console.log("Submitted request!"); 
            }, function(response) {
                console.log("Error submitting request");
            });
            
        };
        
    })
    .component('helpForm', {
        templateUrl: '/static/wiki/js/angular_templates/help-form.html',
        controller: 'helpFormCtrl'
    });