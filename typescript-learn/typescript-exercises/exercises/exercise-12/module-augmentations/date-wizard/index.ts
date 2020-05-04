// This enabled module augmentation mode.
import "date-wizard";

declare module "date-wizard" {
  // Add your module extensions here.
  interface DateDetails {
    hours: number;
  }

  function pad(s: string | number): string;
}
