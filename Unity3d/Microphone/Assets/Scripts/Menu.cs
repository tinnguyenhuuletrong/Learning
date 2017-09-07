using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Menu : MonoBehaviour {

	public void GotoScene(string sceneName) {
		UnityEngine.SceneManagement.SceneManager.LoadScene(sceneName);
	}
}
