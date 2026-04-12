import { computed, signal, effect } from "./signalDIY";

function playWithSubcrible() {
  const count = signal(0);

  // Somewhere in the application
  count.suscribe((newValue) => {
    console.log("Count changed to:", newValue);
  });

  // Anytime and anywhere in the application
  count.value += 10;
  // "Count changed to: 1"
}

function playWithPull() {
  const count = signal(1);
  const doubleCount = computed(() => count.value * 2);
  const plusOne = computed(() => doubleCount.value + 1);

  // Update the signal…
  count.value = 5;

  // plusOne.value -> trigger computed function -> build dep tree along with this ( via magic signal.value get method)
  console.log(plusOne.value); // 11

  // update -> setDirty for all tree built
  count.value = 20;

  // trigger recomputed
  console.log(plusOne.value); // 41
}

function playWithEffect() {
  const count = signal(1);
  const doubleCount = computed(() => count.value * 2);
  const doublePlusOne = computed(() => doubleCount.value + 1);

  // 1st trigger -> build the dep tree along with this
  effect(() => console.log("effect doublePlusOne=", doublePlusOne.value));

  // update -> setDirty for all tree built
  count.value = 5;
}

async function main() {
  console.log(
    Bun.color("green", "ansi") + "Signal subcrible (push): " + "\x1b[0m",
  );
  playWithSubcrible();
  console.log(
    Bun.color("green", "ansi") + "Signal computed (pull): " + "\x1b[0m",
  );
  playWithPull();

  console.log(
    Bun.color("green", "ansi") + "Signal effect (linked): " + "\x1b[0m",
  );
  playWithEffect();
}
main();
