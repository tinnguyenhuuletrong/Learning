using System;
using System.Collections.Generic;

namespace JUnityGameFramework
{
    class JEventEmitter
    {
        private Dictionary<int, List<Action<object>>> m_EventDB = new Dictionary<int, List<Action<object>>>();
        private Dictionary<int, object> m_DelayEventList = new Dictionary<int, object>();

        public void Emit(int eventName, object param)
        {
            if(m_EventDB.ContainsKey(eventName))
            {
                List<Action<object>> handler = m_EventDB[eventName];
                int length = handler.Count;
                for (int i = 0; i < length; i++)
                {
                    handler[i].Invoke(param);
                }
            }
        }

        public void EmitDelay(int eventName, object param)
        {
            m_DelayEventList[eventName] = param;
        }

        public void FlushEmitDelay()
        {
            foreach (KeyValuePair<int, object> item in m_DelayEventList)
            {
                Emit(item.Key, item.Value);
            }
            m_DelayEventList.Clear();
        }

        public void Register(int eventName, Action<object> callback)
        {
            if(!m_EventDB.ContainsKey(eventName))
            {
                m_EventDB[eventName] = new List<Action<object>>();
            }

            m_EventDB[eventName].Add(callback);
        }

        public void UnRegister(int eventName, Action<object> callback)
        {
            if (!m_EventDB.ContainsKey(eventName))
                return;
            m_EventDB[eventName].Remove(callback);
        }


    }
}
