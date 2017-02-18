namespace JUnityGameFramework
{
	public abstract class JGameLogicReducerBase
	{
		public virtual void Reset(JGameLogicStateBase currentState) {

		}

		public virtual bool OnAction(JGameAction action, JGameLogicStateBase currentState) {
			return false;
		}
	}
}