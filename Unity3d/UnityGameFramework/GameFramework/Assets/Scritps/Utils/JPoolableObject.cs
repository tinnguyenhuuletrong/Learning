using System;
using System.Collections.Generic;
using System.Text;

namespace JUnityGameFramework
{
    public class JPoolableObject
    {
        public JPoolableObject()
        {
            CanRecycle = true;
        }

        /// <summary>
        /// Called when Object Destroyed
        /// </summary>
        public virtual void Reset()
        {
            CanRecycle = true;
        }

        /// <summary>
        /// Called when Object Reused
        /// </summary>
        public virtual void Recycle(params object[] args)
        {
            CanRecycle = false;
        }

        /// <summary>
        /// Determine is it object in used or not
        /// </summary>
        public bool CanRecycle { get; set; }
    }
}
