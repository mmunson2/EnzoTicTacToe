# Firebase Info

## Basic Data Structuring
Firebase uses a JSON style data structure with key/branch style storage. For the tic-tac-toe app there are two basic branches that will be needed to support multiplayer funcationality and tracking of games won/moves made. 

### User

We need to store info on the user like games won, name, settings, etc. The basic strcuture will look something like:

```json
{
	"users": {
		"chip01": {
			"name": "Chip Kirchner",
         "countdown": 20,
         "timeLimit": 30,
			"games: {
				"1": true,
				"2": true,
				"3": true,
			}
		}
	}
}
```

Here "users" is the start of the branch holding user info and "chip01" is the start of a unique user's branch containing all thier info. All the user centric info like display name, settings info like turn timelimits and games histroy will be stored here. 


### Games

Games structure will need to store a unique id for the game, the players of the game, the game board, the moves players make, and the winner when the game is over.

```josn
{
	"games":{
		"1":{
			"members":{
				"chip01": "x",
				"david01": "o",
			}
			"board": [2,1,2,2,0,1,2,2,2],
			"moves":{
				"1": ["chip01",timestamp,[0,0,0,0,0,0,1,0,0]]
				"2": ["david01",timestamp,[0,0,1,0,0,0,0,0,0]]
			}
			"currentPlayer": "x",
         "winnerPlayer": null,
         "hasGameEnded": false,
		}
	}
}
```

##Using Firebase

The easiest way to use firebase will be to push the state of the board or user when it is updated and then 'listen' for any updates that come through in our react code. 

The set the state of a board something like the following code is used.

'''javascript
var tempState = this.state;
firebase.database().ref('board/${gameID}').set(tempState);
'''

This will set the branch in 'board' that the specified gameID to be the same as the current state of the game.

To listen for changes we need to add a componentDidMount() function to our component so that when our component is fully rendered we start listening for changes in the data base. It should look something like this:

'''javascript
componentDidMount() {
   const boardRef = firebase.database().ref('board/${gameID}');
   boardRef.on('value', (snapshot) => {
      this.setState(snapshot.val(), () => {
         this.processBoard();
      });
   });
}
'''

Here we create the boardRef variable at the branch for this gameID. 
*By calling the "boardRef.on ('value', (snapshot)..." function we complete some action when the database is updated. 
*Snapshot will be equal to whatever value the database has at that moment in time.
*We use the this.setState(snapshot.val() to update the database to the new value and then,
*Call processBoard() in the call back for setState in order to update the visuals/make AI moves as needed after getting new values.