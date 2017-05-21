using NUnit.Framework;
using System;
using JTask;

namespace UnitTest
{
    [TestFixture()]
    public class PromiseTask
    {
        [Test()]
		public void PromiseTaskBasic()
		{
			JTaskManager.ClearAllTask();
			int frameCount = 0;
			int frameToDoneTask = 5;

			JPromiseTask promiseTask1 = new JPromiseTask((task, dt) =>
			{

				if (frameCount >= frameToDoneTask)
				{
					Console.WriteLine("Task 1 done at " + frameCount);
					task.Resolve(1);
				}
			});

			JTaskManager.AddTask(promiseTask1);

			Console.WriteLine("start");
			while (!JTaskManager.IsAllDone())
			{
				frameCount++;
				Console.WriteLine("..");
				JTaskManager.Update(0.1f);
			}

			//Console.WriteLine(frameCount);
			//Console.WriteLine("Promise result: " + promiseTask1.SuccessData);

            Assert.AreEqual(5, frameCount);
            Assert.AreEqual(promiseTask1.SuccessData, 1);
		}

        [Test()]
		public void PromiseTaskChainSuccess()
		{
			JTaskManager.ClearAllTask();
			int frameCount = 0;

			JPromiseTask promiseTask1 = new JPromiseTask((task, dt) =>
			{
				Console.WriteLine("Task 1 done at " + frameCount);
				task.Resolve(1);
			});

			JPromiseTask.PromiseTaskUpdateDelegate tmp = (task, dt) =>
			{
                
				Console.WriteLine("Task 2 done at " + frameCount);

                //Previous args
                Assert.AreEqual(1, task.Args);

				task.Resolve(2);
			};

			promiseTask1.Then(tmp);
			
			JTaskManager.AddTask(promiseTask1);

			Console.WriteLine("start");
			while (!JTaskManager.IsAllDone())
			{
				frameCount++;
				Console.WriteLine("..");
				JTaskManager.Update(0.1f);
			}

            Assert.AreEqual(2, frameCount);
		}

        [Test()]
		public void PromiseTaskChainError()
		{
			JTaskManager.ClearAllTask();
			int frameCount = 0;

			JPromiseTask promiseTask1 = new JPromiseTask((task, dt) =>
			{
				String k = null;
				k.Replace('1', '2');

				Console.WriteLine("Task 1 done at " + frameCount);
				task.Resolve(1);
			});

			JPromiseTask.PromiseTaskUpdateDelegate errorHandler = (task, dt) =>
			{
				Console.WriteLine("Exception at " + frameCount + " -> " + task.Args);
                Assert.NotNull(task.Args);

				task.Resolve(null);
			};

			JPromiseTask.PromiseTaskUpdateDelegate tmp = (task, dt) =>
			{
				Console.WriteLine("Task 2 done at " + frameCount);
				task.Resolve(2);
			};

			promiseTask1.Then(tmp);
			promiseTask1.Catch(errorHandler);

			JTaskManager.AddTask(promiseTask1);

			Console.WriteLine("start");
			while (!JTaskManager.IsAllDone())
			{
				frameCount++;
				Console.WriteLine("..");
				JTaskManager.Update(0.1f);
			}

			Assert.AreEqual(frameCount, 2);
		}
    }
}
