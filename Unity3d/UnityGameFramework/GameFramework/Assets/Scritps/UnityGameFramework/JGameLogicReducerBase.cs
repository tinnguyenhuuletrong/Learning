namespace JUnityGameFramework
{
	public abstract class JGameLogicReducerBase
	{
		public virtual bool OnAction(JGameAction action, JGameLogicStateBase currentState) {
			return false;
		}
	}
}