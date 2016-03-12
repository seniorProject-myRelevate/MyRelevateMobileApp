angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope, $ionicModal, $cordovaNetwork, $rootScope, $timeout, $location) {
   document.addEventListener("deviceready", function () {

        $scope.network = $cordovaNetwork.getNetwork();
        $scope.isOnline = $cordovaNetwork.isOnline();
        $scope.$apply();

        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            $scope.isOnline = true;
            $scope.network = $cordovaNetwork.getNetwork();

            $scope.$apply();
        })

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.log("got offline");
            $scope.isOnline = false;
            $scope.network = $cordovaNetwork.getNetwork();

            $scope.$apply();
        })

  }, false);
})

.controller('AuthCtrl', function($scope, $state, $location, $rootScope, $cordovaNetwork, Users){
  $scope.email = '';
  $scope.password = '';
  $scope.errorMessage = null;
  $scope.Login = function(username, password) {
    if(true)
    {
      if(Users.get(username,password))
      {
          $location.path('/app/about');
      }
      else
      {
        $scope.errorMessage = 'Invalid email and/or password';
        $state.reload();
      }
    }
    else
    {
      alert("No network connection found");
    }
  };
  $scope.ToRegister = function() {
    $location.path('/register');
  };
  $scope.Exit = function() {
     navigator.app.exitApp();
  };
})

.controller('AboutCtrl', function($scope, $location, $ionicScrollDelegate){
  $scope.PintrestLink = 'https://www.pinterest.com/MyRelevate';
    $scope.YoutubeLink = 'https://www.youtube.com/channel/UCEh98DlXgjw_ZuNEEnEbLtA';
    $scope.TwitterLink = 'https://twitter.com/myrelevate';
    $scope.FacebookLink = 'https://www.facebook.com/MyRelevate';
  $scope.readMore = false;
  $scope.ToMedia = function(link){
    var ref = window.open(encodeURI(link), '_system', 'transitionstyle=crossdissolve,toolbarposition=top,location=yes');
    }
  $scope.MoreInfo = function()
  {
    $scope.readMore = !$scope.readMore;
    if(!$scope.readMore)
    {
      $ionicScrollDelegate.scrollTop();
    }
    else
    {
      $ionicScrollDelegate.scrollBottom();
    }

    $location.reload();
  }
})
.controller('RegCtrl', function($scope, $state, $location, Users){
    $scope.email = '';
    $scope.password = '';
    $scope.confirmPass = '';
    $scope.errorMessage = '';
    $scope.Confirm = function(email, password, confirmPass) {
      if(password.length > 8)
      {
        if(password == confirmPass)
        {
            if($scope.checkEmailValid(email))
            {
              Users.add(email, password);
              $location.path('/app/about');
            }
           else
           {
              $scope.errorMessage = 'Invalid email';
              $state.reload();
            }
          }
          else
          {
          $scope.errorMessage = 'Passwords do not match';
          $state.reload();
          }
        }
        else
        {
         $scope.errorMessage = 'Password must be at least 9 characters long';
         $state.reload();
        }
    };

    $scope.checkEmailValid  = function(email)
    {
      return (!Users.getEmail(email) && email.length>8)
    }

    $scope.ToLogin = function(){
      $location.path('/auth');
    };
})

//Controller for all templates.
.controller('MenuCtrl', function($scope, $window, $location, $stateParams, $ionicHistory){

    $scope.screenWidth = $window.innerWidth;
    if($scope.screenWidth > 450)
    {
      $scope.comString = "Community";
      $scope.newsString= "NewsFeed";
      $scope.logString = "LogOut";
    }

    $scope.ToNewsFeed = function() {
      $ionicHistory.clearHistory();
      $location.path('/app/newsfeed').replace();
    };

    $scope.ToCommunity = function() {
      $ionicHistory.clearHistory();
      $location.path('/app/community').replace();
    };

    $scope.LogOut = function() {
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
      $location.path('/auth');
      $scope.apply();
      $location.replace();
    };

    $scope.Exit = function() {
        navigator.app.exitApp();
    };

    $scope.OnMobile = function(){
      return $scope.screenWidth <= 375;
    }
})

//Controller for the quizzes display page.
.controller('QuizzesCtrl', function($scope, Quizzes) {
  $scope.quizzes = Quizzes.all();
  $scope.allQuizzesFinished = function(){
    return !$scope.quizzes.length;
  }
})

//Controller for the journaling page.
.controller('JournalCtrl', function($scope, Journals){
  $scope.journals = Journals.all().reverse();
  $scope.newEntry = '';
  $scope.title = '';
  $scope.submitJournal = function(str, title){
    Journals.add(str, title);
    $scope.journals = Journals.all().reverse();
    $scope.newEntry = '';
    $scope.title = '';
    $scope.Clear();
    $location.path('/app/journal');
  };

  $scope.Clear = function(){
        document.getElementById("journalEntry").value = '';
        document.getElementById("journalTitle").value = '';
  };
})

//Controller for the individual quiz pages.
.controller('QuizCtrl', function($scope, $stateParams, $ionicHistory, Quizzes) {
  $scope.quiz = Quizzes.get($stateParams.quizId);
  //$scope.questions = $scope.quiz.questions;
  $scope.quizFinished = function(quiz){
    Quizzes.remove(quiz);
    $ionicHistory.goBack();
  }
})

//Controller for the newsfeed page.
.controller('NewsFeedCtrl', function($scope, $ionicHistory, $location, News, Contributors, Favorites){
  $scope.news = News.all();
  $scope.contributors = Contributors.all();
  $scope.goToArticle = function(articleId){
      $location.path('/app/newsfeed/'+articleId);
  }
  $scope.AddFavorite = function(id){
    if(Favorites.add(id)){
      document.getElementById("article_"+id).innerHTML= "Unfavorite";
   }
   else{
      document.getElementById("article_"+id).innerHTML = "Favorite";
   }
  }
})

//Controller for the individual news article page. NOT ACTIVE
.controller('NewsArticleCtrl', function($scope, $stateParams, $ionicHistory, News, Contributors, Tags, Favorites){
  $scope.newsArticle = News.get($stateParams.newsArticleId);
  $scope.contributor = Contributors.get($scope.newsArticle.author);
  $scope.tags = Tags.get($scope.newsArticle.tags);
  $scope.AddFavorite = function(id){
    if(Favorites.add(id)){
      document.getElementById("article_"+id).innerHTML= "Unfavorite";
   }
   else{
      document.getElementById("article_"+id).innerHTML = "Favorite";
   }
  }
  $scope.OpenPDF = function(pdf){
    window.open(encodeURI(pdf), '_system');
  }
})

//Controller for the community page. NOT ACTIVE
.controller('CommunityCtrl', function($scope){

})

.controller('SearchCtrl', function($scope, $compile, $sce, Tags, Contributors, News){
  $scope.query = "";
  $scope.contentForm = $sce.trustAsHtml("<h1>Search contributors and articles by tag, seperated by commas (Ex: Marriage, Children, Infidelity).</h1>");
  $scope.queryAccepted = false;
  $scope.contributors =  [];
  $scope.news = [];
  $scope.Request = function(form){
    return ($scope.queryAccepted);
  }
  $scope.Search= function(query){
    alert("Start");
    if(query.length == 0)
    {
      alert("Zero");
      $scope.contentForm = $sce.trustAsHTML("<h1>Please enter a valid query before searching</h1>")
      $scope.queryAccepted = false;
      alert("Scope length is 0");
    }
    var list = query.split(",");
    if(list.length == 0)
    {
      alert("Split fail");
      $scope.contentForm = $sce.trustAsHTML("<h1>No matching results found!</h1>");
      $scope.queryAccepted = false;
      alert("list length is 0");
    }
    else
    {
     for(var item in list)
     {
       item.trim();
     }
     alert(list);
     $scope.tags = Tags.getIds(list);
     $scope.contributors = Contributors.getByTags($scope.tags);
     $scope.news = Newsfeed.getByTags($scope.tags);
     $scope.queryAccepted = true;
    }
    $route.reload();
  }
})

.controller('ContributorsCtrl', function($scope, $http, Contributors){
  $scope.contributors = Contributors.all();
})

.controller('ContributorCtrl', function($scope, $stateParams, $location, Contributors, News, Tags, Favorites){
  $scope.contributor = Contributors.get($stateParams.contributorId);
  $scope.articles = News.getByAuthor($stateParams.contributorId);
  $scope.tags = Tags.get($scope.contributor.expertiseAreas);
  $scope.goToArticle = function(articleId){
      $location.path('/app/newsfeed/'+articleId);
  }
  $scope.AddFavorite = function(id){
    if(Favorites.add(id))
    {
      document.getElementById("article_"+id).innerHTML= "Unfavorite";
    }
    else
    {
      document.getElementById("article_"+id).innerHTML = "Favorite";
    }
  }
})

.controller('FavoritesCtrl', function($scope, $location, Contributors, News, Tags, Favorites){
  $scope.contributors = Contributors.all();
  $scope.news = News.getByList(Favorites.all());
})

.controller('MyDataCtrl', function($scope, $stateParams, $location){
   $scope.OnKeyUp_RelStatus = "";
   $scope.dataValues = [];

  $scope.personData =
   {
     currentRelationship : 'Single',
     currentRelationshipLength : null,
     relationshipCount : null,
     numChild : null,
     numStepChild : null
   };


   $scope.HashData = function(section)
   {
      var urlParam = '';
      switch(section)
      {
      case 1:
      urlParam = '' + $scope.personData.currentRelationshipLength + ':' +
      $scope.personData.relationshipCount + ':' +
      $scope.personData.numChild + ':' +
      $scope.personData.numStepChild + ':';
      break;
      }
      return urlParam;
   };

   var getKeyboardEventResult = function (keyEvent, keyEventDesc)
   {
    return keyEventDesc + " (keyCode: " + (window.event ? keyEvent.keyCode : keyEvent.which) + ")";
   };

   $scope.onKeyUp = function($event, Form, Value)
   {
    $scope.OnKeyUp_RelStatus = getKeyboardEventResult($event, "Key up");
    $scope.dataValues[Form] = Value;
    if(Value < 0)
    {
      $scope.dataValues[Form] = 0;
    }
    else if(Value > 100)
    {
      $scope.dataValues[Form] = 100;
    }
   };

   $scope.ToLifeEvents = function(id)
   {
      $location.path('/app/mydata/mydataInit/'+$scope.HashData(id)+'/');
   };
});