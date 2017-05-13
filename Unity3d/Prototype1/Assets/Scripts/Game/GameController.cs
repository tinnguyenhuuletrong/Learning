using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameController : MonoBehaviour {

    public AnimationCurve DifficultyCurve;
    public float MaxRound = 20;
    public GameObject CirclePrefab;
    public GameObject AreaPrefab;
    public Text ScoreText;

	private FollowTarget GameCamera;
    private AreaController AreaController;

    private GameObject AreaGameObject;
    private CircleController MC;
    private List<CircleController> Enemies;

    private bool hasInput = false;
    private Vector3 inputPos = Vector3.zero;
    private bool roundPlaying = false;


	public float _positionLevel = 0;
    public float _randomRange = 5;
    public float _difficultyScale = 2;
    public float _roundNumber = 0;


    public static GameController Instance;

    private void Awake()
    {
        Instance = this;
    }

    // Use this for initialization
    void Start () {
        Init();

        MC = SpawnCircle(Vector3.zero);
        Enemies = new List<CircleController>();

        UpdateMC(MC);
	}

	// ------------------------------------------------------- //
    //  Initial functions
	// ------------------------------------------------------- //
	void Init() {
        AreaGameObject = Instantiate(AreaPrefab, Vector3.zero, Quaternion.identity);

		GameCamera = FindObjectOfType<FollowTarget>() as FollowTarget;

		AreaController = AreaGameObject.GetComponent<AreaController>();
    }

    CircleController SpawnCircle(Vector3 position) {
        GameObject ins = Instantiate(CirclePrefab, position, Quaternion.identity);
        return ins.GetComponent<CircleController>();
    }

    void UpdateMC(CircleController target) {
        MC.transform.position = target.transform.position;
		MC.SetAsMC();
		GameCamera.target = MC.transform;
    }

	// ------------------------------------------------------- //
    //  Game Round
	// ------------------------------------------------------- //
	Vector3 GetLevelStartPos() {
        return MC.transform.position;
    }

    void ClearOldRoundData() {
        foreach (var item in Enemies)
        {
            item.DestroyMe();
        }
        Enemies.Clear();
    }




	// ------------------------------------------------------- //
    //  Game Round Begin
    //      1. Spawn Random Enemies
	// ------------------------------------------------------- //
    void SpawnNewRound() {
        ClearOldRoundData();

        _roundNumber++;

        _difficultyScale = DifficultyCurve.Evaluate(_roundNumber / MaxRound);
        Debug.Log(_difficultyScale);

        // Round Paramaters
        int numEnemies = 2 + (int)Mathf.Round((_difficultyScale) * 1);
        float minSize = 1;
        float maxSize = _randomRange - _difficultyScale * 1;
        float minAreaSize = (_randomRange + minSize) + _difficultyScale * 2;
        float roundTime = 5 * _difficultyScale;

        Vector2 center = GetLevelStartPos();
        for (int i = 0; i < numEnemies; i++)
        {
            Vector2 randUnit = Random.insideUnitCircle;
            Vector2 offset = randUnit * (maxSize - minSize + 1) + randUnit * minSize;

            CircleController obj = SpawnCircle(offset + center);
            obj.color = Color.red;
            Enemies.Add(obj);
		}

        roundPlaying = true;

		// Start Area
		AreaController.StopScaleDown();
        AreaController.SyncPosition(MC.transform.position);
		AreaController.BeginScaleDown(minAreaSize, roundTime, () =>
		{
            roundPlaying = false;
            GameOver();
		});
    }

    void UpdateLogic() {
        if (!(hasInput && roundPlaying))
            return;

        int mask = LayerMask.GetMask("Character");

        Collider2D tmp = Physics2D.OverlapPoint(inputPos, mask, 0);

        if (tmp == null)
            return;

        CircleController target = tmp.gameObject.GetComponent<CircleController>();
        bool isInRange = AreaController.OverlapCircle(target);

        if( isInRange )
        {
			UpdateMC(target);
            // Update scoring here

            ScoreText.text = "Score: " + _roundNumber.ToString();

			SpawnNewRound();
        }
    }

    void GameOver() {
		Debug.Log("GameOver");

        StartOptions.Instance.OpenMainmenu();

		//UnityEngine.SceneManagement.SceneManager.LoadScene(UnityEngine.SceneManagement.SceneManager.GetActiveScene().name);
    }


    void RestetValue() {
        _roundNumber = 0;
        ScoreText.text = "Score: " + _roundNumber.ToString();
        ClearOldRoundData();
    }

    public void PlayGame() {
        RestetValue();
        SpawnNewRound();
    }

	// -------------------------------------------------------
	// Update is called once per frame
	// -------------------------------------------------------
	void Update () {
        
        UpdateInputMouse();

        UpdateLogic();

        if (Input.GetKeyUp(KeyCode.A))
        {

            AreaController.SyncPosition(transform.position);
            AreaController.BeginScaleDown(5, 5, () =>
            {
                Debug.Log("Done!");
            });
        }
        else if (Input.GetKeyUp(KeyCode.B))
        {
            SpawnNewRound();
        }
	}

	// ------------------------------------------------------- //
	// Input functions
	// ------------------------------------------------------- //
	void UpdateInputMouse()
	{
        if (!Input.GetMouseButtonDown(0))
		{
			hasInput = false;
			return;
		}

		hasInput = true;
		Vector2 scenePos = Input.mousePosition;
		Vector3 worldPos = Camera.main.ScreenToWorldPoint(scenePos);
		inputPos = worldPos;
        inputPos.z = 0;
	}
}
