using System;
namespace JTask
{
    public class JSimpleTask : JBaseTask
    {
        readonly float delaySec;
        float timerSec;
        Action job;

        public JSimpleTask(Action job, long delaySec = 0)
        {
            this.job = job;
            this.delaySec = delaySec;
        }

        internal override void OnStart()
        {
            base.OnStart();
            timerSec = 0;
        }

        internal override void OnDone()
        {
            if (job != null) job();
            base.OnDone();
        }

        internal override ETaskRunningStatus Update(float dt)
        {
            timerSec += dt;

            if (timerSec >= delaySec)
                return ETaskRunningStatus.Done;
            
            return ETaskRunningStatus.Running;
        }
    }
}
