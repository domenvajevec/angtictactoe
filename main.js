var ticTacRef, IDs, whoAmI;
var winningCombos = [ ["0","1","2"],["3","4","5"],["6","7","8"],["0","3","6"],["1","4","7"],["2","5","8"],["0","4","8"],["2","4","6"] ];
var audioX = new Audio("audio/XBeep.mp3");
var audioO = new Audio("audio/OBeep.mp3");


//begin angular app
var ticTacToeApp = angular.module('ticTacToeApp', ["firebase"]);

// begin angular controller 
ticTacToeApp.controller('TicTacToeCtrl', function($scope, $firebase, $timeout){

	//firebase database setup
	ticTacRef = new Firebase("https://wargamestictactoe.firebaseio.com/");
	$scope.fbRoot = $firebase(ticTacRef);

 	
 	$scope.fbRoot.$on("loaded", function() {
		IDs = $scope.fbRoot.$getIndex();
		
		if(IDs.length == 0){
	 		$scope.fbRoot.$add( { board : ['','','','','','','','',''],
 	 			currentPlayer : true , playerX : [''], playerO : [''], scoreX : 0, scoreO : 0,
 	 			 gameCounter : 1, turnCounter : 0, XTaken : false} );
			$scope.fbRoot.$on("change", function() {
				IDs = $scope.fbRoot.$getIndex();
				$scope.obj = $scope.fbRoot.$child(IDs[0]);
			});
		} else {
			$scope.obj = $scope.fbRoot.$child(IDs[0]);
		}
	}); 	

 	//run screenplay handler
 	$scope.fbRoot.$on("change", function(){

    	var gc = $scope.obj.gameCounter;
    	var tc = $scope.obj.turnCounter;

    	//play X and O audio alternatively
    	if ($scope.obj.currentPlayer == true){playSound("O");}
    	if ($scope.obj.currentPlayer == false){playSound("X");}

		// console.log("screenplay(): Game Counter: "+ gc + " Turn counter: " + tc + " scoreX: " +
		//  $scope.obj.scoreX + " scoreO: " + $scope.obj.scoreO);
		if($scope.obj.scoreX==3){playVideo(video15, 44000);}
		if($scope.obj.scoreO==3){playVideo(video16, 19000);}
		if(gc == 1 && tc == 2){playVideo(video2, 14000);}
		if(gc == 2 && tc == 6){playVideo(video8, 13000);}
		if(gc == 4 && tc == 5){playVideo(video9, 19400);}
		if(gc == 5 && tc == 7){playVideo(video10, 10000);}
		if(gc == 2 && tc == 0){playVideo(video5, 2300);}
		if($scope.obj.scoreO == 2 ){playVideo(video9, 19400);}

		//stalemate
		if ($scope.obj.turnCounter == 9 && !$scope.checkWin($scope.obj.playerX) && !$scope.checkWin($scope.obj.playerO)){
			playVideo(video17, 2700);
			$scope.resetBoard();
		}
 	})


 	// set first person to play to be playerX
	$scope.isXTaken = function(){
		if( ($scope.obj.board.indexOf("X") == -1 && $scope.obj.XTaken == false) || whoAmI == "X"){
			whoAmI = "X";
			$scope.obj.XTaken = true;
			$scope.obj.$save();
		} else { 
			whoAmI = "O";
		}
	};

	//zero out board after every win or stalemate
    $scope.resetBoard = function(){
    	console.log("in resetBoard()");
    	$scope.obj.currentPlayer = true; 
		$scope.obj.turnCounter = 0;
	    $scope.obj.playerX = [''];
	    $scope.obj.playerO = [''];
	    $scope.obj.board = ['','','','','','','','',''];
 	 	$scope.obj.gameCounter++;
 	 	$scope.obj.$save();
	}

	//zero out entire database for new game 
	$scope.resetGame = function(){
		ticTacRef.remove();
		ticTacRef = new Firebase("https://wargamestictactoe.firebaseio.com/");
	    $scope.fbRoot = $firebase(ticTacRef);
	    $scope.resetBoard();
	    $scope.obj.gameCounter = 1;
	    $scope.obj.XTaken = false;
	    $scope.obj.scoreX = 0;
	    $scope.obj.scoreO = 0;
	    $scope.obj.$save();
	}

// main play function begin - ng-click on playfield 

 	$scope.changeState = function(index){

 		$scope.isXTaken();
 		console.log("currentPlayer: " + $scope.obj.currentPlayer + " ** whoAmiI = " + whoAmI + " ** XTaken: " + $scope.obj.XTaken);
		
		//check if cell is empty
	    if($scope.obj.board[index] == '' ){ 
	    	//check player
			if (whoAmI == "X" && $scope.obj.currentPlayer == true){ 
				// playSound("X");
				$scope.obj.playerX.push(index);
				$scope.obj.board[index] = "X";
				$scope.changePlayer();
				// check for win
				if ($scope.checkWin($scope.obj.playerX)){
					$scope.obj.scoreX++;
				}

			} 

			else if (whoAmI == "O" && $scope.obj.currentPlayer == false) {
				$scope.obj.playerO.push(index);
				// playSound("O");
				$scope.obj.board[index] = "O";
				$scope.changePlayer();
				if ($scope.checkWin($scope.obj.playerO)){
					$scope.obj.scoreO++;
				}
			}

			else { // logic for player blocked from playing opponents move
				alert("Yo, wait your turn there, fancypants!");
				$scope.obj.turnCounter--;
			}

		} else { //  logic for clicking on a field that has been occupied
			alert ("Yo, it's occupied!");
			$scope.obj.turnCounter--;
		}

		$scope.obj.turnCounter++;
		$scope.obj.$save();
		// $scope.screenplay();
    } //end changeState

    $scope.changePlayer = function(){
		$scope.obj.currentPlayer = ($scope.obj.currentPlayer ? false : true);
	};

	//display images - ng-class in html
	$scope.showX = function(cellIndexValue){
		if(cellIndexValue === 'X'){return true;}
	};

	$scope.showO = function(cellIndexValue){
		if(cellIndexValue === 'O'){return true;}
	};


	$scope.checkWin = function(player){
		player.sort();
	    for (var i = 0; i < 8; i++){
	        var win = 0;
	        for (var j = 0; j < player.length; j++){
	     	    for (var k = 0; k < 3; k++){
	     		    if(player[j] == winningCombos[i][k]){
	     			    win++;
	     		    }
	     	    }

	     	    if (win == 3){
	     	    	$scope.resetBoard();
		     		return true;
	     	    }
	        }
	    }
	    return false;
    };	

 

 
}); //end angular controller

//helper functions

playVideo = function(videoNum, timeoutNumber){

	var insertVideo = document.getElementById('videoPlay');
	var disappear = document.getElementById("wrapper");
	disappear.style.opacity="0.0";
	insertVideo.innerHTML = videoNum;

	setTimeout(function(){
		insertVideo.innerHTML="";
		disappear.style.opacity="1";
	},timeoutNumber);
};

playSound = function(player){
 	player === "X" ? audioX.play() : audioO.play();
};






