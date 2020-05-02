package main

import (
	"context"
	"flag"
	"math/rand"
	"time"

	"github.com/pborman/uuid"
	"github.com/uber-common/cadence-samples/cmd/samples/common"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/client"
	"go.uber.org/cadence/worker"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

// ApplicationName is the task list for this sample
const ApplicationName = "timerGroup"

// This is registration process where you register all your workflows
// and activity function handlers.
func init() {
	workflow.Register(SampleTimerWorkflow)
	activity.Register(orderProcessingActivity)
	activity.Register(sendEmailActivity)
}

// SampleTimerWorkflow workflow decider
func SampleTimerWorkflow(ctx workflow.Context, processingTimeThreshold time.Duration) error {
	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Minute,
		StartToCloseTimeout:    time.Minute,
		HeartbeatTimeout:       time.Second * 20,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	childCtx, cancelHandler := workflow.WithCancel(ctx)
	selector := workflow.NewSelector(ctx)

	// In this sample case, we want to demo a use case where the workflow starts a long running order processing operation
	// and in the case that the processing takes too long, we want to send out a notification email to user about the delay,
	// but we won't cancel the operation. If the operation finishes before the timer fires, then we want to cancel the timer.

	var processingDone bool
	f := workflow.ExecuteActivity(ctx, orderProcessingActivity)
	selector.AddFuture(f, func(f workflow.Future) {
		processingDone = true
		// cancel timerFuture
		cancelHandler()
	})

	// use timer future to send notification email if processing takes too long
	timerFuture := workflow.NewTimer(childCtx, processingTimeThreshold)
	selector.AddFuture(timerFuture, func(f workflow.Future) {
		if !processingDone {
			// processing is not done yet when timer fires, send notification email
			workflow.ExecuteActivity(ctx, sendEmailActivity).Get(ctx, nil)
		}
	})

	// wait the timer or the order processing to finish
	selector.Select(ctx)

	// now either the order processing is finished, or timer is fired.
	if !processingDone {
		// processing not done yet, so the handler for timer will send out notification email.
		// we still want the order processing to finish, so wait on it.
		selector.Select(ctx)
	}

	workflow.GetLogger(ctx).Info("Workflow completed.")
	return nil
}

func orderProcessingActivity(ctx context.Context) error {
	logger := activity.GetLogger(ctx)
	logger.Info("sampleActivity processing started.")
	timeNeededToProcess := time.Second * time.Duration(rand.Intn(10))
	time.Sleep(timeNeededToProcess)
	logger.Info("sampleActivity done.", zap.Duration("duration", timeNeededToProcess))
	return nil
}

func sendEmailActivity(ctx context.Context) error {
	activity.GetLogger(ctx).Info("sendEmailActivity sending notification email as the process takes long time.")
	return nil
}

// This needs to be done as part of a bootstrap step when the process starts.
// The workers are supposed to be long running.
func startWorkers(h *common.SampleHelper) {
	// Configure worker options.
	workerOptions := worker.Options{
		MetricsScope:                       h.Scope,
		Logger:                             h.Logger,
		MaxConcurrentActivityExecutionSize: 3,
	}

	h.StartWorkers(h.Config.DomainName, ApplicationName, workerOptions)
}

func startWorkflow(h *common.SampleHelper) {
	workflowOptions := client.StartWorkflowOptions{
		ID:                              "timer_" + uuid.New(),
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    time.Minute,
		DecisionTaskStartToCloseTimeout: time.Minute,
	}
	h.StartWorkflow(workflowOptions, SampleTimerWorkflow, time.Second*3)
}

func main() {
	var mode string
	flag.StringVar(&mode, "m", "trigger", "Mode is worker or trigger.")
	flag.Parse()

	var h common.SampleHelper
	h.SetupServiceConfig()

	switch mode {
	case "worker":
		startWorkers(&h)

		// The workers are supposed to be long running process that should not exit.
		// Use select{} to block indefinitely for samples, you can quit by CMD+C.
		select {}
	case "trigger":
		startWorkflow(&h)
	}
}
