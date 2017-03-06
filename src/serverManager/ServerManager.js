(function(){
let app = angular.module('ServerManager',['ngAnimate','ui.router','ngStorage'])

app.config(function($stateProvider,$urlRouterProvider){
  $stateProvider.state('login',{
    url: '/',
    templateUrl: 'login.html',
    controller: 'LoginController',
    controllerAs: 'login'
  })
  $stateProvider.state('list',{
    url: '/login',
    templateUrl: 'list.html',
    controller: 'ListController',
    controllerAs: 'list'
  })
  $stateProvider.state('edit',{
    url: '/edit?id',
    params:{
      id: ''
    },
    templateUrl: 'edit.html',
    controller: 'EditController',
    controllerAs: 'edit'
  })
  $urlRouterProvider.otherwise('/')
})

class ListController {
  constructor($localStorage){
    this.storage = $localStorage
    this.storage.servers = this.storage.servers || {}
  }
  remove(server){
    if(confirm(`Are you sure you want to remove ${server.name}?`))
    {
      delete this.storage.servers[server.name]   
    }
  }
  connect(server){

  }
}
app.controller('ListController',ListController)

class EditController {
  constructor($localStorage,$stateParams,$state){
    this.storage = $localStorage
    this.state = $state
    this.server = {}
    let current = this.storage.servers[$stateParams.id]
    this.server.name = $stateParams.id
    if(current){
      for(let k in current){
        this.server[k] = current[k] 
      }
    }
  }
  save(){
    this.storage.servers[this.server.name] = this.server
    this.state.go('list')
  }
}
app.controller('EditController',EditController)

class LoginController {
  constructor($localStorage,$stateParams,$state){
    this.storage = $localStorage
    this.state = $state    
  }
}
app.controller('LoginController',LoginController)

})()