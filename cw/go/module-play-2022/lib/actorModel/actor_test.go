package actor_system

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/ian-kent/go-log/log"
)

type TestTask struct {
	id    int
	delay time.Duration
}

func (task *TestTask) Execute(ctx context.Context) {
	log.Debug("Exe task %d by actorId %d", task.id, ctx.Value(ContextActorId{}))
	<-time.After(task.delay)
}

func TestTaskActor(t *testing.T) {
	wg := sync.WaitGroup{}
	actor := CreateTaskActor(&wg, 1, 20)

	for i := 0; i < 10; i++ {
		actor.AddTask(&TestTask{id: i, delay: 1 * time.Second})
		log.Debug("added task %d", i)
	}

	actor.Stop()
}

func TestAssignerActor(t *testing.T) {
	wg := sync.WaitGroup{}
	actor := CreateAssignerActor(&wg, "test_assigner", &AssignerActorConfig{
		taskQueueSize:      20,
		poolSize:           5,
		taskActorQueueSize: 2,
	})

	go actor.Start()

	for i := 0; i < 10; i++ {
		actor.AddTask(&TestTask{id: i})
		log.Debug("added task %d", i)
	}

	actor.Stop()
}

func TestSystemActor(t *testing.T) {
	wg := sync.WaitGroup{}
	system := CreateActorSystem("test_system", &AssignerActorConfig{
		taskQueueSize:      20,
		poolSize:           2,
		taskActorQueueSize: 2,
	})

	for i := 0; i < 100; i++ {
		system.SubmitTask(&TestTask{id: i, delay: 20 * time.Millisecond})
		log.Debug("added task %d", i)
	}

	system.Shutdown(&wg)
	wg.Wait()
}
