package actor_system

import (
	"context"
	"sync"

	"github.com/ian-kent/go-log/log"
)

//-------------------
// Interface
//-------------------

type IActor interface {
	AddTask(task Task) error
	Start()
	Stop()
}

type ContextActorId struct{}

type Task interface {
	Execute(context.Context)
}

type IActorSystem interface {
	Run()
	SubmitTask(task Task) error
	Shutdown(shutdownWG *sync.WaitGroup)
}

//-------------------
// Implement - ActorSystem
//-------------------

type ActorSystem struct {
	name     string
	assigner IActor
	wg       *sync.WaitGroup
	// tracker  *tracker.Tracker
}

func (system *ActorSystem) Run() {
	defer system.wg.Done()
	system.wg.Add(1)

	log.Debug("actor system %s started \n", system.name)
	// start the assigner in seprate go routine
	go system.assigner.Start()
}

func (system *ActorSystem) SubmitTask(task Task) error {
	// adding submitted task to assigner
	return system.assigner.AddTask(task)
}

func (system *ActorSystem) Shutdown(wg *sync.WaitGroup) {
	defer wg.Done()
	wg.Add(1)

	system.assigner.Stop()
	system.wg.Wait()
	// system.tracker.Shutdown()
	log.Debug("actor system: %s shutdown completed ", system.name)
}

//-------------------
// Implement - AssignerActor
//-------------------

type AssignerActorConfig struct {
	taskQueueSize      int
	poolSize           int
	taskActorQueueSize int
}

type AssignerActor struct {
	name     string
	closeSig chan bool
	tasks    chan Task
	*AssignerActorConfig

	assignerIndex int
	pool          []IActor
	poolLock      *sync.Mutex
	wg            *sync.WaitGroup
}

func (actor *AssignerActor) Start() {
	defer actor.wg.Done()
	actor.wg.Add(1)
	log.Debug("AssignerActor: %s. start - poolSize - %d", actor.name, actor.poolSize)

	for i := 0; i < actor.poolSize; i++ {
		var ins IActor = CreateTaskActor(actor.wg, i, actor.taskActorQueueSize)
		actor.pool = append(actor.pool, ins)
	}

	log.Debug("AssignerActor: %s. live", actor.name)

	for task := range actor.tasks {
		actor.poolLock.Lock()
		workerIndex := actor.assignerIndex % len(actor.pool)
		worker := actor.pool[workerIndex]
		actor.assignerIndex += 1
		actor.poolLock.Unlock()

		err := worker.AddTask(task)
		if err != nil {
			break
		}
	}

	log.Debug("AssignerActor: %s. closing", actor.name)

	for i := 0; i < len(actor.pool); i++ {
		actor.pool[i].Stop()
	}

	log.Debug("AssignerActor: %s. closed", actor.name)

	actor.closeSig <- true
}

func (actor *AssignerActor) Stop() {
	close(actor.tasks)
	<-actor.closeSig
}

func (actor *AssignerActor) AddTask(task Task) error {
	actor.tasks <- task
	return nil
}

//-------------------
// Implement - TaskActor
//-------------------

type TaskActor struct {
	id       int
	closeSig chan bool
	wg       *sync.WaitGroup
	tasks    chan Task
}

func (actor *TaskActor) Start() {
	defer actor.wg.Done()
	actor.wg.Add(1)
	log.Debug("Actor: %d. start", actor.id)

	ctx := context.Background()
	ctx = context.WithValue(ctx, ContextActorId{}, actor.id)

	for task := range actor.tasks {
		task.Execute(ctx)
	}
	log.Debug("Actor: %d. stop", actor.id)
	actor.closeSig <- true
}

func (actor *TaskActor) Stop() {
	close(actor.tasks)
	<-actor.closeSig
}

func (actor *TaskActor) AddTask(task Task) error {
	log.Debug("Actor: %d. AddTask Queue len - %d", actor.id, len(actor.tasks))
	actor.tasks <- task
	return nil
}

//-------------------
// Factory
//-------------------

func CreateAssignerActor(wg *sync.WaitGroup, name string, config *AssignerActorConfig) IActor {
	return &AssignerActor{
		name:                name,
		closeSig:            make(chan bool),
		tasks:               make(chan Task, config.taskQueueSize),
		AssignerActorConfig: config,
		assignerIndex:       0,
		pool:                []IActor{},
		poolLock:            &sync.Mutex{},
		wg:                  wg,
	}
}

func CreateTaskActor(wg *sync.WaitGroup, id int, queueSize int) IActor {
	var actor = &TaskActor{
		id:       id,
		closeSig: make(chan bool),
		wg:       wg,
		tasks:    make(chan Task, queueSize),
	}
	go actor.Start()
	return actor
}

func CreateActorSystem(name string, config *AssignerActorConfig) IActorSystem {
	wg := &sync.WaitGroup{}

	system := ActorSystem{
		name:     name,
		assigner: CreateAssignerActor(wg, name, config),
		wg:       wg,
	}

	go system.Run()

	return &system
}
