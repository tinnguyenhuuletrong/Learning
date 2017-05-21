using System;
namespace JTask
{

    public enum ETaskStatus
    {
        Waiting,
        Processing,
        Pause,
        Done
    }

    public enum ETaskRunningStatus
    {
        Done,
        Pause,
        Running
    }

    public abstract class JBaseTask
    {
        static uint UDID;

        public JBaseTask()
        {
            _ticket = UDID++;
            Status = ETaskStatus.Waiting;
        }

        internal virtual void OnStart()
        {
            Status = ETaskStatus.Processing;
        }

        internal virtual void OnPause()
        {
            Status = ETaskStatus.Pause;
        }

        internal virtual void OnDone()
        {
            Status = ETaskStatus.Done;
        }

        internal virtual ETaskRunningStatus Update(float dt)
        {
            return ETaskRunningStatus.Done;
        }

        public readonly uint _ticket;

        public ETaskStatus Status
        {
            get;
            protected set;
        }
    }
}
