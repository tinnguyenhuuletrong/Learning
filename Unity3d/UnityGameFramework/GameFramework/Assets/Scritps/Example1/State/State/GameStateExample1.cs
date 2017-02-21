using JUnityGameFramework;
using UnityEngine;

public class GameStateExample1 : JGameLogicStateBase {

    public Vector3 MCPosition { get; set; }
    public bool IsOnGround {get; set;}
    public bool IsGameOver {get; private set;}
    public int Coin {get; set;}

    public void OnGameOver() {
        IsGameOver = true;
        this.RaiseEvent(0, null);
    }
}