using System.Collections.Generic;

namespace JUnityGameFramework
{
	public sealed class JGameAction : JPoolableObject
	{
		public string Name { get; private set; }
        public object Params {get; set;}

        public JGameAction() {
            Params = new Dictionary<string, object>();
        }

        // Override
        public override void Reset()
        {
            CanRecycle = true;
        }

        /// <summary>
        /// Called when Object Reused
        /// </summary>
        public override void Recycle(params object[] args)
        {
            CanRecycle = false;
            Params = null;

            if(args.Length > 0) {
                Name = args[0].ToString();
            }
        }

	}
}