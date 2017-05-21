using System;
namespace JTask
{
	public class JRepeatTask : JBaseTask
	{
		readonly float intervalSec;
		float timerSec;
        readonly JBaseTask job;

        public JRepeatTask(JBaseTask job, long intervalSec = 0)
		{
			this.job = job;
			this.intervalSec = intervalSec;
		}

		internal override void OnStart()
		{
			base.OnStart();
			timerSec = 0;
		}

		internal override ETaskRunningStatus Update(float dt)
		{
            if (job.Status == ETaskStatus.Processing)
                return ETaskRunningStatus.Running;
            
			timerSec += dt;

            if (timerSec >= intervalSec) {
                JTaskManager.AddTask(job);
                timerSec = 0;
            }

			return ETaskRunningStatus.Running;
		}
	}
}
