import { Pipe } from "@angular/core";

@Pipe({
	name: "dateYYYYMMDD"
})
export class DatePipe {
	transform(value: string): string {
    return value ? value.split("T")[0].replace(/-/g, '/') : "";
  }
}
