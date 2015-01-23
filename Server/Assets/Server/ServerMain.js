#pragma strict

function OnGUI ()
{
 	if (Network.peerType == NetworkPeerType.Disconnected) {
        GUILayout.Label("Network server is not running.");
        if (GUILayout.Button ("Start Server"))
		{				
			startServer();	
		}
    }
    else {
    	if (Network.peerType == NetworkPeerType.Connecting)
        	GUILayout.Label("Network server is starting up...");
    	else { 
        	GUILayout.Label("Network server is running.");        	
        	showServerInformation(); 	
        	showClientInformation();
        }
        if (GUILayout.Button ("Stop Server"))
		{				
			stopServer();	
		}
    }
}

var listenPort = 25000;
var maxClients = 5;

function startServer() {
	Network.InitializeServer(maxClients, listenPort, false);	
}

function stopServer() {
	Network.Disconnect();
}

function OnServerInitialized() {
 	Debug.Log("Network server initialized and ready");
}

function OnDisconnectedFromServer(info : NetworkDisconnection) {
	Debug.Log("Network server disconnected");	
}

@script RequireComponent(ServerPlayerManager)
private var spm : ServerPlayerManager;
function Awake() {
	spm = gameObject.GetComponent(ServerPlayerManager);
}

function OnPlayerConnected(player: NetworkPlayer) {	
	Debug.Log("Player " + player + "  connected from ip/port: " + player.ipAddress + "/" + player.port);
	spm.spawnPlayer(player);
}

function OnPlayerDisconnected(player : NetworkPlayer) {
	Debug.Log("Player disconnected");	
	spm.deletePlayer(player);
}

function showClientInformation() {
	GUILayout.Label("Clients: " + Network.connections.Length + "/" + maxClients);
    for(var p: NetworkPlayer in Network.connections) {
		GUILayout.Label(" Player " + p + " from ip/port: " + p.ipAddress + "/" + p.port);	
	}
}

function showServerInformation() {
	GUILayout.Label("IP: " + Network.player.ipAddress + " Port: " + Network.player.port);  
}