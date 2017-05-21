using System;

namespace JTask
{
    class MainClass
    {
        public static void Main()
        {
            SimpleTask();
            SimpleTaskWithDelay();
            SimpleTaskWithDelayCancel();
            RepeatTask();
            RepeatTaskLongRun();

            PromiseTaskBasic();
            PromiseTaskChainSuccess();
            PromiseTaskChainError();
        }

        static void RepeatTask()
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
                    break;
            }

            Console.WriteLine(repeatTask.Status);
            Console.WriteLine(frameCount);
        }

        static void RepeatTaskLongRun()
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

            Console.WriteLine(repeatTask.Status);
            Console.WriteLine(frameCount);
        }

        static void SimpleTask()
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

            Console.WriteLine(scheduleTask.Status);
            Console.WriteLine(count);
        }

        static void SimpleTaskWithDelay()
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

            Console.WriteLine(scheduleTask.Status);
            Console.WriteLine(count);
        }

        static void SimpleTaskWithDelayCancel()
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

            Console.WriteLine(scheduleTask.Status);
            Console.WriteLine(count);
        }

        static void PromiseTaskBasic()
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

            Console.WriteLine(frameCount);
            Console.WriteLine("Promise result: " + promiseTask1.SuccessData);
        }

        static void PromiseTaskChainSuccess()
        {
            JTaskManager.ClearAllTask();
            int frameCount = 0;

            JPromiseTask promiseTask1 = new JPromiseTask((task, dt) =>
            {
                Console.WriteLine("Task 1 done at " + frameCount);
                task.Resolve(1);
            });

            JPromiseTask.PromiseTaskUpdateDelegate errorHandler = (task, dt) =>
            {
                Console.WriteLine("Exception at " + frameCount + " -> " + task.ErrorData);
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

            Console.WriteLine(frameCount);
        }

        static void PromiseTaskChainError()
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

            Console.WriteLine(frameCount);
        }
    }
}
