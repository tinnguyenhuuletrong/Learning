using System.Collections.Generic;

namespace JUnityGameFramework
{
	public sealed class JGameAction : JPoolableObject
	{
		public string Name { get; private set; }
        public Dictionary<string, object> Params {get; private set;}

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
            Params.Clear();

            if(args.Length > 0) {
                Name = args[0].ToString();
            }
        }

        // public
        public bool GetParamAsBool(string name) {
            if(!Params.ContainsKey(name))
                return false;
            string tmp = Params[name].ToString();
            return tmp == "True";
        }

	}
}