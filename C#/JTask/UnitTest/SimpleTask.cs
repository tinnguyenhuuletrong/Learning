using NUnit.Framework;
using System;
using JTask;

namespace UnitTest
{
    [TestFixture()]
    public class SimpleTask
    {
        [Test()]
        public void SimpleTaskBasic()
        {
			JTaskManager.ClearAllTask();
			JBaseTask scheduleTask = new JSimpleTask(() =>
			{
				Console.WriteLine("Do it now");
			});

			JTaskManager.AddTask(scheduleTask);

			int count = 0;
			Console.WriteLine("start");
			while (!JTaskManager.IsAllDone())
			{
				count++;
				Console.WriteLine("..");
				JTaskManager.Update(0.1f);
			}

            Assert.AreEqual(scheduleTask.Status, ETaskStatus.Done);
            Assert.AreEqual(count, 1);
        }

        [Test()]
		public void SimpleTaskWithDelay()
		{
			JTaskManager.ClearAllTask();
			JBaseTask scheduleTask = new JSimpleTask(() =>
			{
				Console.WriteLine("After 1sec");
			}, 1);

			JTaskManager.AddTask(scheduleTask);

			int count = 0;
			Console.WriteLine("start");
			while (!JTaskManager.IsAllDone())
			{
				count++;
				Console.WriteLine("..");
				JTaskManager.Update(0.1f);
			}

			Assert.AreEqual(scheduleTask.Status, ETaskStatus.Done);
			Assert.AreEqual(count, 10);
		}

        [Test()]
		public void SimpleTaskWithDelayCancel()
		{
			JTaskManager.ClearAllTask();
			JBaseTask scheduleTask = new JSimpleTask(() =>
			{
				Console.WriteLine("After 1sec");
			}, 1);

			JTaskManager.AddTask(scheduleTask);

			int count = 0;
			Console.WriteLine("start");
			while (!JTaskManager.IsAllDone())
			{
				count++;
				Console.WriteLine("..");
				JTaskManager.Update(0.1f);
				if (count == 5)
				{
					JTaskManager.RemoveTask(scheduleTask._ticket);
				}
			}

            Assert.AreEqual(scheduleTask.Status, ETaskStatus.Processing);
			Assert.AreEqual(count, 5);
		}
    }
}
