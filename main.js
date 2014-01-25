var ticTacRef, IDs, whoAmI;
var winningCombos = [ ["0","1","2"],["3","4","5"],["6","7","8"],["0","3","6"],["1","4","7"],["2","5","8"],["0","4","8"],["2","4","6"] ];


var ticTacToeApp = angular.module('ticTacToeApp', ["firebase"]);

ticTacToeApp.controller('TicTacToeCtrl', function($scope, $firebase, $timeout){

	ticTacRef = new Firebase("https://wargamestictactoe.firebaseio.com/");
	$scope.fbRoot = $firebase(ticTacRef);

 	
 	$scope.fbRoot.$on("loaded", function() {
		IDs = $scope.fbRoot.$getIndex();
		
		if(IDs.length == 0){
	 		$scope.fbRoot.$add( { board:['','','','','','','','',''],
 	 			currentPlayer:true , playerX: [''], playerO: [''], scoreX: 0, scoreO: 0,
 	 			 gameCounter: 1, turnCounter: 0} );
			$scope.fbRoot.$on("change", function() {
				IDs = $scope.fbRoot.$getIndex();
				$scope.obj = $scope.fbRoot.$child(IDs[0]);
			});
		} else {
			$scope.obj = $scope.fbRoot.$child(IDs[0]);
		}
	}); 	

	$scope.isXTaken = function(){
		if($scope.obj.board.indexOf("X") == -1 || whoAmI == "X"){
			whoAmI = "X";
		} else { 
			whoAmI = "O";
		}
		console.log(whoAmI);
	};

    $scope.resetBoard = function(){
    	$scope.currentPlayer = true ; //uncomment for X to start every game
		$scope.obj.turnCounter = 0;
	    $scope.obj.playerX = [''];
	    $scope.obj.playerO = [''];
	    $scope.obj.board = ['','','','','','','','',''];
 	 	$scope.obj.gameCounter++;
 	 	$scope.obj.$save();
	}

 	$scope.changeState = function(index){
 		$scope.isXTaken();
 		console.log("currentPlayer: " + $scope.obj.currentPlayer + "whoAmiI = " + whoAmI);
 		// console.log("Who am i:" + whoAmI);
		
	    if($scope.obj.board[index] == '' ){ //if cell is empty

			if (whoAmI == "X" && $scope.obj.currentPlayer == true){ //&& (snapshot.board.indexOf("X")== -1)) ||  and player is X
				playSound("X");
				$scope.obj.playerX.push(index);
				$scope.obj.board[index] = "X";
				$scope.changePlayer();

				
				if ($scope.checkWin($scope.obj.playerX)){
					$scope.obj.scoreX++;
				}

			} 

			else if (whoAmI == "O" && $scope.obj.currentPlayer == false) {
				$scope.obj.playerO.push(index);
				playSound("O");
				$scope.obj.board[index] = "O";
				$scope.changePlayer();

				if ($scope.checkWin($scope.obj.playerO)){
					$scope.obj.scoreO++;
				}
			}

			else {
				alert("Yo, don't be playing this move bro!");
				$scope.obj.turnCounter--;
			}

		} else {
			alert ("Yo, occupied dude!");
			$scope.obj.turnCounter--;
		}
		$scope.obj.turnCounter++;
		$scope.screenplay();
		$scope.obj.$save();
    }

    $scope.changePlayer = function(){
		$scope.obj.currentPlayer = ($scope.obj.currentPlayer ? false : true);
	};

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
	     	    	// setTimeout(function(){$scope.resetBoard();},1500);
	     		return true;
	     	    }
	        }
	    }
	    return false;
    };	

    $scope.screenplay = function(){
    	console.log("In screenplay");

		console.log("screenplay(): Game Counter: "+ $scope.obj.gameCounter + " Turn counter: " + $scope.obj.turnCounter);
		// if($scope.obj.playerXScore==3){playVideo(video15, 85000)}
		
		if($scope.obj.gameCounter == 1 && $scope.obj.turnCounter == 3){console.log("playingVideo"); playVideo(video2, 14000);}
		// if($scope.obj.gameCounter == 1 && $scope.obj.turnCounter == 6){playVideo(video8, 13000);}
		// if($scope.obj.gameCounter == 2 && $scope.obj.turnCounter == 1){playVideo(video3, 4000);}
		// if($scope.obj.gameCounter == 2 && $scope.obj.turnCounter == 6){playVideo(video9, 19400);}
		// if($scope.obj.gameCounter == 3 && $scope.obj.turnCounter == 3){playVideo(video10, 10000);}
		// if($scope.obj.gameCounter == 2 && $scope.obj.turnCounter == 2){playVideo(video9, 20000);}


		if ($scope.obj.turnCounter == 9 && !$scope.checkWin($scope.obj.playerX) && !$scope.checkWin($scope.obj.playerO)){
			playVideo(video17, 2700);
			$scope.resetBoard();
		}
	};

 
}); //end controller

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
 	var audioX = new Audio("audio/XBeep.mp3");
 	var audioO = new Audio("audio/OBeep.mp3");
 	player === "X" ? audioX.play() : audioO.play();
};


// isXTaken();



