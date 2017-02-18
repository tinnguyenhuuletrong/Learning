using System.Collections.Generic;

namespace JUnityGameFramework
{
	public abstract class JGameLogicStateBase
	{
		// private
		List<JGameLogicReducerBase> mReducerLists;
		List<JGameAction> mActionList;

		JObjectPool<JGameAction> mActionPool;

		object[] mTmpActionParams;

		// Props
		internal JEventEmitter Event { get; private set; }

		// Constructor
		public JGameLogicStateBase() {
			Event = new JEventEmitter();
			mReducerLists = new List<JGameLogicReducerBase>();
			mActionList = new List<JGameAction>();
			mActionPool = new JObjectPool<JGameAction>();
			mTmpActionParams = new object[1];
		}

		// Public Methods
		public void AddAction(JGameAction action) {
			mActionList.Add(action);
		}

		public void RegisterReducer(JGameLogicReducerBase reducer) {
			mReducerLists.Add(reducer);
		}


		// Virtual Methods
		public virtual List<string> ListAllEvents() {
			return new List<string>();
		}

		public virtual void ToJson() {

		}

		public virtual void LoadFromJSon() {

		}

		// Hook
		protected virtual void PreActionHook(JGameAction action) {

		}

		protected virtual void PostActionHook(JGameAction action) {
			
		}

		protected virtual void PreStateHook() {

		}

		protected virtual void PostStateHook() {

		}

		// Processing
		public void OnAction(JGameAction action) {
			PreActionHook(action);
			foreach (var item in mReducerLists)
			{
				item.OnAction(action, this);
			}
			PostActionHook(action);
		}

		public void Update() {
			PreStateHook();
			foreach(var item in mActionList) {
				this.OnAction(item);
				mActionPool.Destroy(item);
			}
			PostStateHook();
			mActionList.Clear();
		}

		// Action Factory
		public JGameAction CreateAction(string name) {
			mTmpActionParams[0] = name;
			return mActionPool.Create(mTmpActionParams);
		}

	}
}