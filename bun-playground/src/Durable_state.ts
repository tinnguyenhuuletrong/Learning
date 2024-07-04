enum EStep {
  step_begin = "step_begin",
  step_1 = "step_1",
  step_2 = "step_2",
  step_end = "step_end",
}
type DurableStateIterator = {
  needSave: boolean;
  activeStep: EStep;
};
type DurableStateReturn = {
  isEnd: boolean;
  waitFor?: any;
};

class DurableState {
  step!: EStep;
  private state: Record<string, any> = {};

  async *exec(): AsyncIterator<DurableStateIterator, DurableStateReturn> {
    let hasNext = true;
    while (hasNext) {
      switch (this.step) {
        case EStep.step_begin: {
          // Do something
          // Move to step 1
          this.step = EStep.step_1;
          yield { needSave: true, activeStep: this.step };
          break;
        }
        case EStep.step_1: {
          // Do something
          // Move to step 2
          this.step = EStep.step_2;
          yield { needSave: true, activeStep: this.step };
          break;
        }
        case EStep.step_2: {
          // Do something
          // Move to step end
          for (let i = 0; i < 3; i++) {
            console.log("\t", "do some work", i / 3);
            yield { needSave: false, activeStep: this.step };
          }
          console.log("\t", "work done");
          this.step = EStep.step_end;
          yield { needSave: true, activeStep: this.step };
          break;
        }
        default: {
          hasNext = false;
          break;
        }
      }
    }

    return { isEnd: true };
  }

  toJSON() {
    return { step: this.step, state: this.state };
  }

  fromJSON(data: any) {
    this.step = data.step;
    this.state = data.state;
  }
}

async function main() {
  const ins = new DurableState();
  ins.step = EStep.step_begin;

  let saveData: any = null;
  console.log("----------------------------");
  console.log("Run 1");
  console.log("----------------------------");
  {
    let work = ins.exec();
    let it = await work.next();
    let maxIter = 3;
    while (!it.done) {
      it = await work.next();
      console.log("it:", --maxIter, "->", it);
      if (maxIter <= 0) break;
    }
    if (!it.done) {
      console.log("not done");
      saveData = ins.toJSON();
      console.log("saved data:", saveData);
    }
  }

  // resume later
  console.log("----------------------------");
  console.log("Run 2");
  console.log("----------------------------");
  {
    ins.fromJSON(saveData);
    let work = ins.exec();
    let it = await work.next();
    let maxIter = 5;
    while (!it.done) {
      it = await work.next();
      console.log("it:", --maxIter, "->", it);
      if (maxIter <= 0) break;
    }
    console.log("finalValue:", it.value);
  }
}
main();
