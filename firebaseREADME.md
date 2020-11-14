# Firebase Info

## Basic Data Structuring
Firebase uses a JSON style data structure with key/branch style storage. For the tic-tac-toe app there are two basic branches that will be needed to support multiplayer funcationality and tracking of games won/moves made. 

### User

We need to store info on the user like games won, name, etc. The basic strcuture will look something like:

```json
{
	"users": {
		"chip01": {
			"name": "Chip Kirchner",
			"score": "100/231",
			"games: {
				"1": true,
				"2": true,
				"3": true,
			}
		}
	}
}
```

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
			"board": [null,"x",null,null,"o","x",null,null,null],
			"moves":{
				"1": ["chip01",timestamp,[0,0,0,0,0,0,1,0,0]]
				"2": ["david01",timestamp,[0,0,1,0,0,0,0,0,0]]
			}
			"currentPlayer": "chip01",
            "winnerPlayer": null,
            "hasGameEnded": false,
		}
	}
}
```
