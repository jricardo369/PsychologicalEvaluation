import { Pipe } from "@angular/core";

@Pipe({
	name: "phone"
})
export class PhonePipe {
	transform(value: string): string {
    return value.replace(/(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
  }
}
