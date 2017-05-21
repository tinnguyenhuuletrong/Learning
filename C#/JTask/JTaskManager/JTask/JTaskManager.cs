using System;
using System.Collections.Generic;

namespace JTask
{
    public static class JTaskManager
    {
        static readonly List<JBaseTask> _waitingTask = new List<JBaseTask>();
        static readonly List<JBaseTask> _runningTask = new List<JBaseTask>();
        static readonly List<JBaseTask> _doneTask = new List<JBaseTask>();

        public static void ClearAllTask()
        {
            _waitingTask.Clear();
            _runningTask.Clear();
            _doneTask.Clear();
        }

        public static bool IsAllDone()
        {
            return _runningTask.Count == 0 && _waitingTask.Count == 0;
        }

        public static void AddTask(JBaseTask task)
        {
            _waitingTask.Add(task);
        }

        public static void RemoveTask(uint udid)
        {
            JBaseTask item = GetTaskWithID(udid);
            if (item != null)
                _runningTask.Remove((item));

            item = GetTaskWithID(udid, _waitingTask);
            if (item != null)
                _runningTask.Remove((item));
        }

        public static JBaseTask GetTaskWithID(uint udid, List<JBaseTask> taskList = null)
        {
            if (taskList == null)
                taskList = _runningTask;

            int len = taskList.Count;
            for (int i = 0; i < len; i++)
            {
                JBaseTask item = taskList[i];
                if (item._ticket == udid)
                {
                    return item;
                }
            }
            return null;
        }

        public static void Update(float dt)
        {
            // Add Running Task
            if (_waitingTask.Count > 0)
            {
                foreach (var item in _waitingTask)
                {
                    item.OnStart();
                    _runningTask.Add(item);
                }
                _waitingTask.Clear();
            }


            // Update Running Task
            if (_runningTask.Count > 0)
            {
                foreach (var item in _runningTask)
                {
                    if (item.Status == ETaskStatus.Processing && item.Update(dt) == ETaskRunningStatus.Done)
                    {
                        _doneTask.Add(item);
                    }
                }
            }


            // If Done Task 
            if (_doneTask.Count > 0)
            {
                foreach (var item in _doneTask)
                {
                    _runningTask.Remove(item);
                    item.OnDone();
                }
                _doneTask.Clear();
            }
        }
    }
}
