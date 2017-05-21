using System;
namespace JTask
{
    public class JPromiseTask : JBaseTask
    {
        public delegate void PromiseTaskUpdateDelegate(JPromiseTask task, float dt);

        bool hasFullFill;
        JPromiseTask onResolve;
        JPromiseTask onReject;
        PromiseTaskUpdateDelegate updateJob;
        public JPromiseTask(PromiseTaskUpdateDelegate updateJob, object args = null)
        {
            this.Args = args;
            this.updateJob = updateJob;
            onResolve = null;
            onReject = null;
            hasFullFill = false;
        }

        public static implicit operator JPromiseTask(PromiseTaskUpdateDelegate d)
        {
            return new JPromiseTask(d);
        }

        internal override ETaskRunningStatus Update(float dt)
        {
            // Dummy Promise. Resolve intermediately
            if (updateJob == null)
                Resolve(null);

            try
            {
                // Update task
                updateJob(this, dt);
            }
            catch (Exception ex)
            {
                Reject(ex);
            }


            // If full fill. Stop this task
            if (hasFullFill)
                return ETaskRunningStatus.Done;

            return ETaskRunningStatus.Running;
        }

        internal override void OnDone()
        {
            base.OnDone();

            if (onReject != null && ErrorData != null)
            {
                onReject.Args = ErrorData;
                JTaskManager.AddTask(onReject);
            }

            if (onResolve != null && SuccessData != null)
            {
                onResolve.Args = SuccessData;
                JTaskManager.AddTask(onResolve);
            }
        }

        /// <summary>
        /// Call to Resolve this promise
        /// </summary>
        /// <returns>The resolve.</returns>
        /// <param name="userData">Resolved data.</param>
        public void Resolve(object userData)
        {
            if (hasFullFill)
                return;

            this.SuccessData = userData;
            hasFullFill = true;
        }

        /// <summary>
        /// Call to Reject this promise
        /// </summary>
        /// <returns>The reject.</returns>
        /// <param name="errorData">Error data.</param>
        public void Reject(object errorData)
        {
            if (hasFullFill)
                return;

            this.ErrorData = errorData;
            hasFullFill = true;
        }

        /// <summary>
        /// Chain next promise. Called if this promise success
        /// </summary>
        /// <returns>The then.</returns>
        /// <param name="nextTask">Next task.</param>
        public JPromiseTask Then(JPromiseTask nextTask)
        {
            this.onResolve = nextTask;
            return nextTask;
        }

        /// <summary>
        /// Catch error promise. Called if this promisee error / expection raised
        /// </summary>
        /// <returns>The catch.</returns>
        /// <param name="nextTask">Next task.</param>
        public JPromiseTask Catch(JPromiseTask nextTask)
        {
            this.onReject = nextTask;
            return nextTask;
        }

        public object SuccessData
        {
            get;
            private set;
        }

        public object ErrorData
        {
            get;
            private set;
        }

        public object Args
        {
            get;
            private set;
        }
    }
}
