
namespace JUnityGameFramework
{
    public abstract class JGameLogicMiddleware 
    {
        // PreActionHook
        //  Return true to excute next Middleware
        public virtual bool PreActionHook(JGameAction action) {
			return true;
		}

        // PostActionHook
        //  Return true to excute next Middleware
        public virtual bool PostActionHook(JGameAction action) {
			return true;
		}

        // PreStateHook
        //  Return true to excute next Middleware
        public virtual bool PreStateHook(JGameLogicStateBase state) {
            return true;
        }

        // PostStateHook
        //  Return true to excute next Middleware
        public virtual bool PostStateHook(JGameLogicStateBase state) {
            return true;
        }

        // Reset
        public virtual void Reset(JGameLogicStateBase currentState) {

		}
    }
}