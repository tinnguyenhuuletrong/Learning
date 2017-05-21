using NUnit.Framework;
using System;
using JTask;

namespace UnitTest
{
    [TestFixture()]
    public class RepeatTask
    {
        [Test()]
		public void RepeatTaskBasic()
		{
			JTaskManager.ClearAllTask();
			int runningCount = 0;
			int frameCount = 0;

			JBaseTask simpleTask = new JSimpleTask(() =>
			{
				runningCount++;
				Console.WriteLine("Interval Doing: " + runningCount + " Frame:" + frameCount);
			});

			JBaseTask repeatTask = new JRepeatTask(simpleTask, 1);
			JTaskManager.AddTask(repeatTask);


			Console.WriteLine("start");
			while (!JTaskManager.IsAllDone())
			{
				frameCount++;
				Console.WriteLine("..");
				JTaskManager.Update(0.1f);
				if (runningCount >= 2)
                    JTaskManager.RemoveTask(repeatTask._ticket);
			}

			//Console.WriteLine(repeatTask.Status);
			//Console.WriteLine(frameCount);

            Assert.AreEqual(runningCount, 2);
            Assert.AreEqual(frameCount, 22);
		}

        [Test()]
		public void RepeatTaskLongRun()
		{
			JTaskManager.ClearAllTask();
			int runningCount = 0;
			int frameCount = 0;

			JBaseTask simpleTask = new JSimpleTask(() =>
			{
				runningCount++;
				Console.WriteLine("Interval Doing: " + runningCount + " Frame:" + frameCount);
			}, 1);

			JBaseTask repeatTask = new JRepeatTask(simpleTask, 1);
			JTaskManager.AddTask(repeatTask);

			Console.WriteLine("start");
			while (!JTaskManager.IsAllDone())
			{
				frameCount++;
				Console.WriteLine("..");
				JTaskManager.Update(0.1f);
				if (runningCount >= 2)
					break;
			}

			//Console.WriteLine(repeatTask.Status);
			//Console.WriteLine(frameCount);

			Assert.AreEqual(runningCount, 2);
			Assert.AreEqual(frameCount, 40);
		}
    }
}
