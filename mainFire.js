var ticTacToeApp = angular.module('ticTacToeApp', ["firebase"]);

ticTacToeApp.controller('TicTacToeCtrl', function($scope, $firebase){


	var ticTacRef = new Firebase("https://wargamestictactoe.firebaseio.com/");
	$scope.cells = $firebase(ticTacRef);
 	$scope.cells.$add( ['','','','','','','','',''];
 	$scope.currentPlayer = {val: true}; 
 	var winningCombos = [ ["0","1","2"],["3","4","5"],["6","7","8"],["0","3","6"],["1","4","7"],["2","5","8"],["0","4","8"],["2","4","6"] ];
 	$scope.playerX = [];
 	$scope.playerO = [];
 	var gameCounter = 0;
 	var turnCounter = 0;
    $scope.scoreX = 0;
    $scope.scoreO = 0;
 	
    $scope.resetBoard = function(){
		$scope.occupiedFields = [false,false,false,false,false,false,false,false,false];
		// $scope.currentPlayer.val = true ; //uncomment for X to start every game
		turnCounter = 0;
	    $scope.playerX = [];
	    $scope.playerO = [];
	    $scope.cells = ['','','','','','','','',''];
 	 	gameCounter++;

	}
 	$scope.changeState = function(index){
 		
 		console.log("$scope.occupiedFields[index]=" + $scope.occupiedFields[index]);
	    if($scope.occupiedFields[index] !== true){ //check if field is occupied
	   
			if ($scope.currentPlayer.val === true){
				console.log(playerX);
				// displayImage(playerX);
				// this.innerHTML = playerXImg + "<audio src=\"audio/XBeep.mp3\" autoplay></audio>";
				$scope.playerX.push(index);
				$scope.cells[index] = "X";
				$scope.occupiedFields[index] = true;
				$scope.playerX.sort();
				if ($scope.checkWin($scope.playerX)){
					$scope.scoreX++;
				}
			} else {
				// this.innerHTML = playerOImg + "<audio src=\"audio/OBeep.mp3\" autoplay></audio>";;
				$scope.playerO.push(index);
				$scope.cells[index] = "O";
				$scope.playerO.sort();
				$scope.occupiedFields[index] = true;
				if ($scope.checkWin($scope.playerO)){
					$scope.scoreO++;
				}
			}
			console.log("Score: X-" + $scope.scoreX + "   O- " + $scope.scoreO);
			$scope.changePlayer();
		} else {
			alert ("Yo, occupied dude!");
			turnCounter--;
		}
		$scope.checkTurn();
		// console.log("occupiedFields: [" + $scope.occupiedFields + "]");
    }

    $scope.changePlayer = function(){
		$scope.currentPlayer.val = ($scope.currentPlayer.val == true ? false : true);
	};
	$scope.showX = function(cellIndexValue){
		if(cellIndexValue === 'X'){
			return true;
		}
	}
	$scope.showO = function(cellIndexValue){
		console.log("show cellIndex value - showO : " + cellIndexValue);
		if(cellIndexValue === 'O'){
			return true;
		}
	}
	

	$scope.checkWin = function(player){
	    for (var i = 0; i < 8; i++){
	        var win = 0;
	        for (var j = 0; j < player.length; j++){
	     	    for (var k = 0; k < 3; k++){
	     	    	console.log("player[j]= "+ player[j] + " winningCombos[i][k] = "+ winningCombos[i][k]);
	     		    if(player[j] == winningCombos[i][k]){
	     			    win++;
	     			    // console.log("win: "+win+ " ")
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
    }	

    $scope.checkTurn = function(){
		turnCounter++;
		console.log("checkTurn(): Game Counter: "+ gameCounter + " Turn counter: " + turnCounter);
		// if($scope.playerXScore==3){playVideo(video15, 85000)}
		
		// if(gameCounter == 1 && turnCounter == 3){playVideo(video2, 14000);}
		// if(gameCounter == 1 && turnCounter == 6){playVideo(video8, 13000);}
		// if(gameCounter == 2 && turnCounter == 1){playVideo(video3, 4000);}
		// if(gameCounter == 2 && turnCounter == 2){playVideo(video9, 19400);}
		// if(gameCounter == 3 && turnCounter == 3){playVideo(video10, 10000);}
		// if(gameCounter == 2 && turnCounter == 2){playVideo(video9, 20000);}


		if (turnCounter == 9 && !$scope.checkWin(playerX) && !$scope.checkWin(playerO)){
			// gameCounter--;
			playVideo(video17, 2700);
			$scope.resetBoard();
		}
	}	

	
	$scope.resetBoard();
	// $scope.beginGame();
}); //end Ctrl



playVideo = function(videoNum, timeoutNumber){

	var insertVideo = document.getElementById('videoPlay');
	var disappear = document.getElementById("wrapper");
	disappear.style.opacity="0.0";
	insertVideo.innerHTML = videoNum;

	setTimeout(function(){insertVideo.innerHTML="";
	disappear.style.opacity="1";},timeoutNumber);
}

// displayImage = function(player){
// 	if player
// }


