#pragma strict

var players = new Hashtable();

function spawnPlayer(player : NetworkPlayer) {
	Debug.Log("Spawning player game object for player " + player);
	var ply : PlayerInfo = GameObject.FindObjectOfType(PlayerInfo);
	var go : GameObject = Network.Instantiate(ply.playerPrefab, Vector3.up*3, Quaternion.identity, 0);
	players[player] = go;
}

function deletePlayer(player : NetworkPlayer) {
	Debug.Log("Deleting player game object for player " + player);
 	var go : GameObject = players[player];
 	Network.RemoveRPCs(go.networkView.viewID); // remove buffered Instantiate calls
	Network.Destroy(go); // destroy the game object on all clienst
	players.Remove(player); // remove player from server list
}

@RPC
function handlePlayerInput(player: NetworkPlayer, vertical: float, horizontal: float) {
	Debug.Log("Received move from player " + player);
 	var go : GameObject = players[player];
 	go.transform.position = go.transform.position + Vector3.right*horizontal;
 	go.transform.position = go.transform.position + Vector3.forward*vertical;
}


