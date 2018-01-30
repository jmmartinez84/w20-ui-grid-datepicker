var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.edit', 'addressFormatter']);
 
angular.module('addressFormatter', []).filter('address', function () {
  return function (input) {
      return input.street + ', ' + input.city + ', ' + input.state + ', ' + input.zip;
  };
});
 
app.controller('MainCtrl', function ($scope, $http, $timeout) {
  var vm = this;
 
  vm.gridOptions = {  };
 
  vm.storeFile = function( gridRow, gridCol, files ) {
    // ignore all but the first file, it can only select one anyway
    // set the filename into this column
    gridRow.entity.filename = files[0].name;
 
    // read the file and set it into a hidden column, which we may do stuff with later
    var setFile = function(fileContent){
      gridRow.entity.file = fileContent.currentTarget.result;
      // put it on scope so we can display it - you'd probably do something else with it
      vm.lastFile = fileContent.currentTarget.result;
      $scope.$apply();
    };
    var reader = new FileReader();
    reader.onload = setFile;
    reader.readAsText( files[0] );
  };
 
  vm.gridOptions.columnDefs = [
    { name: 'id', enableCellEdit: false, width: '10%' },
    { name: 'name', displayName: 'Name (editable)', width: '20%' },
    { name: 'age', displayName: 'Age' , type: 'number', width: '10%' },
    { name: 'gender', displayName: 'Gender', editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%',
      cellFilter: 'mapGender', editDropdownValueLabel: 'gender', editDropdownOptionsArray: [
      { id: 1, gender: 'male' },
      { id: 2, gender: 'female' }
    ] },
    { name: 'registered', displayName: 'Registered' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '20%' },
    { name: 'address', displayName: 'Address', type: 'object', cellFilter: 'address', width: '30%' },
    { name: 'address.city', displayName: 'Address (even rows editable)', width: '20%',
      cellEditableCondition: function(scope){
        return scope.rowRenderIndex%2;
      }
    },
    { name: 'isActive', displayName: 'Active', type: 'boolean', width: '10%' },
    { name: 'pet', displayName: 'Pet', width: '20%', editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownRowEntityOptionsArrayPath: 'foo.bar[0].options', editDropdownIdLabel: 'value'
    },
    { name: 'status', displayName: 'Status', width: '20%', editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapStatus',
      editDropdownOptionsFunction: function(rowEntity, colDef) {
        var single;
        var married = {id: 3, value: 'Married'};
        if (rowEntity.gender === 1) {
          single = {id: 1, value: 'Bachelor'};
          return [single, married];
        } else {
          single = {id: 2, value: 'Nubile'};
          return $timeout(function() {
            return [single, married];
          }, 100);
        }
      }
    },
    { name: 'filename', displayName: 'File', width: '20%', editableCellTemplate: 'ui-grid/fileChooserEditor',
      editFileChooserCallback: vm.storeFile }
 	];
 
 	vm.msg = {};
 
 	vm.gridOptions.onRegisterApi = function(gridApi) {
  		//set gridApi on scope
  		vm.gridApi = gridApi;
  		gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
  				vm.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
  				$scope.$apply();
    });
  };
 
  $http.get('/data/500_complex.json')
    .then(function(response) {
      var data = response.data;
 
      for(i = 0; i < data.length; i++){
        data[i].registered = new Date(data[i].registered);
        data[i].gender = data[i].gender==='male' ? 1 : 2;
        if (i % 2) {
          data[i].pet = 'fish'
          data[i].foo = {bar: [{baz: 2, options: [{value: 'fish'}, {value: 'hamster'}]}]}
        }
        else {
          data[i].pet = 'dog'
          data[i].foo = {bar: [{baz: 2, options: [{value: 'dog'}, {value: 'cat'}]}]}
        }
      }
      vm.gridOptions.data = data;
    });
})
 
.filter('mapGender', function() {
  var genderHash = {
    1: 'male',
    2: 'female'
  };
 
  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
})
 
.filter('mapStatus', function() {
  var genderHash = {
    1: 'Bachelor',
    2: 'Nubile',
    3: 'Married'
  };
 
  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
})
;