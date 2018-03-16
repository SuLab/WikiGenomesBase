'use strict';
angular.module('helpForm')
    .controller('helpFormCtrl', function() {
        
        this.submit = function() {
            console.log("Subject: " + this.subject);
            console.log("Name: " + this.name);
            console.log("Email: " + this.email);
            console.log("Description: " + this.description);
            this.submitted = true;
        };
        
    })
    .component('helpForm', {
        templateUrl: '/static/wiki/js/angular_templates/help-form.html',
        controller: 'helpFormCtrl',
        bindings: {
            subject: '<'
        } 
    });