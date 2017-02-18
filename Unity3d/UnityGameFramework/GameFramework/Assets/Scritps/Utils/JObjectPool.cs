using System;
using System.Collections.Generic;
using System.Text;

namespace JUnityGameFramework
{
    public class JObjectPool<T>  
        where T: JPoolableObject, new()
        
    {
        List<T> m_ObjectPool = null;
        int m_MaxSize = 100;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="size"> Maximum Pool Size, Default Size is 100</param>
        public JObjectPool()
        {
            m_ObjectPool = new List<T>();
            m_MaxSize = 100;
            Init();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="size"> Maximum Pool Size</param>
        public JObjectPool(int size)
        {
            m_ObjectPool = new List<T>();
            m_MaxSize = size;
            Init();
        }

        /// <summary>
        /// Try to get new Object from Pool
        /// </summary>
        /// <param name="args">Initial Arguments</param>
        /// <returns>Object or Null</returns>
        public T Create(object[] args)
        {
            for (int i = 0; i < m_ObjectPool.Count; i++)
            {
                if (m_ObjectPool[i].CanRecycle)
                {
                    m_ObjectPool[i].Recycle(args);
                    return m_ObjectPool[i];
                }
            }
            return null;
        }

        /// <summary>
        /// Destroy Object which created from this pool
        /// </summary>
        /// <param name="obj"></param>
        public void Destroy(T obj)
        {
            for (int i = 0; i < m_ObjectPool.Count; i++)
            {
                if (obj == m_ObjectPool[i])
                {
                    m_ObjectPool[i].Reset();
                }
            }
        }

        public void Clear()
        {
            for (int i = 0; i < m_ObjectPool.Count; i++)
            {
                   m_ObjectPool[i].Reset();
             
            }
        }

        /// <summary>
        /// Init Pool Array
        /// </summary>
        private void Init()
        {
            m_ObjectPool.Clear();
            for (int i = 0; i < m_MaxSize; i++)
            {
                m_ObjectPool.Add(new T());
            }
        }
    }
}
