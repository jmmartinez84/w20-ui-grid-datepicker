define([
    '{angular}/angular',
    '{angular-resource}/angular-resource',
    '{bootstrap-datepicker}/js/bootstrap-datepicker',
    '{modernizr}',
    '[css]!{bootstrap-datepicker}/css/bootstrap-datepicker3'

], function(angular) {
    'use strict';

	var module = angular.module('content', ['ngResource',  'w20ComponentsGrid','ui.grid.selection', 'ui.grid.edit']);

    module.directive('uiGridEditDatepicker', ['$timeout', '$document', 'uiGridConstants', 'uiGridEditConstants', function($timeout, $document, uiGridConstants, uiGridEditConstants) {
        return {
            template: function(element, attrs) {	
               // var html = '<div class="datepicker-wrapper" ><input type="text" uib-datepicker-popup datepicker-append-to-body="true" is-open="isOpen" ng-model="datePickerValue" ng-change="changeDate($event)" popup-placement="auto top"/></div>';
                var html;
                if(Modernizr.inputtypes.date){
                    html = '<div class="datepicker-calendar"><input type="date"class="datepicker-calendar" ng-change="changeDate()" ng-model="date"></input></div>';
                }else{
                    html = '<div class="datepicker-calendar"><input data-provide="datepicker" ng-model="date"  ng-change="changeDate()" ></input></div>';
                }
               
                return html;
            },
            require: ['?^uiGrid', '?^uiGridRenderContainer'],
            scope: true,
            compile: function() {
                return {
                    pre: function($scope, $elm, $attrs) {
    
                    },
                    post: function($scope, $elm, $attrs, controllers) {
                        
                        var uiGridCtrl = controllers[0];
                        var renderContainerCtrl = controllers[1];
                        if(Modernizr.inputtypes.date){
                            $scope.date = new Date($scope.row.entity[$scope.col.field]);
                        }else{
                            $scope.date = (new Date($scope.row.entity[$scope.col.field])).toLocaleDateString()
                            $('input[data-provide=datepicker]').datepicker('show');
                        }
                       /*
                        var uiGridCtrl = controllers[0];
                        var renderContainerCtrl = controllers[1];
    */
                        var onWindowClick = function (evt) {
                            var classNamed = angular.element(evt.target).attr('class');
                            if (classNamed) {
                                var inDatepicker = (classNamed.indexOf('datepicker-calendar') > -1);
                                if (!inDatepicker && evt.target.nodeName !== "INPUT") {
                                    $scope.stopEdit(evt);
                                }
                            }
                            else {
                                $scope.stopEdit(evt);
                            }
                        };
    
                      /*  var onCellClick = function (evt) {
                            angular.element(document.querySelectorAll('.ui-grid-cell-contents')).off('click', onCellClick);
                            $scope.stopEdit(evt);
                        };
    */
                        $scope.changeDate = function (evt) {
                            $scope.row.entity[$scope.col.field] = $scope.date;
                        };
    
                        $scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function (evt, a, b, c) {
                            if (uiGridCtrl.grid.api.cellNav) {
                                uiGridCtrl.grid.api.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                                    $scope.stopEdit();
                                });
                            } else {
                                //angular.element(document.querySelectorAll('.ui-grid-cell-contents')).on('click', onCellClick);
                            }
                            angular.element(window).on('click', onWindowClick);
                        });
    
                        $scope.$on('$destroy', function () {
                           // angular.element(window).off('click', onWindowClick);
                            //$('body > .dropdown-menu, body > div > .dropdown-menu').remove();
                        });
    
                        $scope.stopEdit = function(evt) {
                            $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                        };
    
                      /*  $elm.on('keydown', function(evt) {
                            switch (evt.keyCode) {
                                case uiGridConstants.keymap.ESC:
                                    evt.stopPropagation();
                                    $scope.$emit(uiGridEditConstants.events.CANCEL_CELL_EDIT);
                                    break;
                            }
                            if (uiGridCtrl && uiGridCtrl.grid.api.cellNav) {
                                evt.uiGridTargetRenderContainerId = renderContainerCtrl.containerId;
                                if (uiGridCtrl.cellNav.handleKeyDown(evt) !== null) {
                                    $scope.stopEdit(evt);
                                }
                            } else {
                                switch (evt.keyCode) {
                                    case uiGridConstants.keymap.ENTER:
                                    case uiGridConstants.keymap.TAB:
                                        evt.stopPropagation();
                                        evt.preventDefault();
                                        $scope.stopEdit(evt);
                                        break;
                                }
                            }
                            return true;
                        });*/
                    }
                };
            }
        };
    }]);
	module.controller('ContentController', [ '$scope', function($scope) {

        $scope.gridOptions = {
            enableCellSelection: true,
            enableRowSelection: false,
            enableCellEdit: true,
            onRegisterApi: function(gridApi){
                $scope.gridApi = gridApi;
            },
            columnDefs: [
                { name: 'id', enableCellEdit: false, width: '10%' },
                { name: 'name', displayName: 'Name (editable)', width: '20%' },
                { name: 'age', displayName: 'Age' , type: 'number', width: '10%' },
                { name: 'registered', displayName: 'Registered' , type: 'date', editableCellTemplate: '<div><div ui-grid-edit-datepicker ></div>', cellFilter: 'date:"yyyy-MM-dd"', width: '20%' }
            ],
            data:[
                {
                    "name":"John Doe",
                    "age":"52",
                    "registered":new Date("2004-06-21T11:22:00+02:00"),
                    "isActive":true
                },
                {
                    "name":"Mary Appleseed",
                    "age":"44",
                    "registered":new Date("1994-08-15T22:58:01+05:00"),
                    "isActive":true
                }
            ]
        };
        $scope.datepickerOptions = {};

	}]);

	return {
		angularModules : [ 'content' ]
	};
});
