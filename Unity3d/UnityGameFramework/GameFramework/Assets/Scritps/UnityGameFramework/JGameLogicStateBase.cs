using System;
using System.Collections.Generic;

namespace JUnityGameFramework
{
	public abstract class JGameLogicStateBase
	{
		// private
		List<JGameLogicReducerBase> mReducerLists;
		List<JGameLogicMiddleware> mMiddleware;
		List<JGameAction> mActionList;

		JObjectPool<JGameAction> mActionPool;

		object[] mTmpActionParams;

		// Props
		private JEventEmitter Event { get; set; }

		// Constructor
		public JGameLogicStateBase() {
			Event = new JEventEmitter();
			mReducerLists = new List<JGameLogicReducerBase>();
			mMiddleware = new List<JGameLogicMiddleware>();

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

		public void RegisterMiddleware(JGameLogicMiddleware middleware) {
			mMiddleware.Add(middleware);
		}


		// Virtual Methods
		public virtual List<string> ListAllEvents() {
			return new List<string>();
		}

		public virtual string ToJson() {
			return string.Empty;
		}

		public virtual bool LoadFromJSon(string data) {
			return false;
		}

		// Hook
		protected virtual void PreActionHook(JGameAction action) {
			foreach(var item in mMiddleware) {
				item.PreActionHook(action);
			}
		}

		protected virtual void PostActionHook(JGameAction action) {
			foreach(var item in mMiddleware) {
				item.PostActionHook(action);
			}
		}

		protected virtual void PreStateHook() {
			foreach(var item in mMiddleware) {
				item.PreStateHook(this);
			}
		}

		protected virtual void PostStateHook() {
			foreach(var item in mMiddleware) {
				item.PostStateHook(this);
			}
		}

		// Processing
		public void OnAction(JGameAction action) {
			PreActionHook(action);
			foreach (var item in mReducerLists)
			{
				if(item.OnAction(action, this))
					break;
			}
			PostActionHook(action);
		}

		public void Update() {
			PreStateHook();
			foreach(var item in mActionList) {
				this.OnAction(item);
				mActionPool.Destroy(item);
			}
			mActionList.Clear();
			PostStateHook();

			Event.FlushEmitDelay();
		}

		public virtual void Reset() {
			foreach (var item in mReducerLists)
			{
				item.Reset(this);
			}
			foreach (var item in mMiddleware)
			{
				item.Reset(this);
			}
		}

		// Action Factory
		public JGameAction CreateAction(string name) {
			mTmpActionParams[0] = name;
			return mActionPool.Create(mTmpActionParams);
		}
		
		//Utils
		public void RegisterEvent(int name, Action<object> callback) {
			Event.Register(name, callback);
		}

		public void UnRegisterEvent(int name, Action<object> callback) {
			Event.UnRegister(name, callback);
		}

		public void RaiseEvent(int name, object param) {
			Event.EmitDelay(name, param);
		}

	}
}