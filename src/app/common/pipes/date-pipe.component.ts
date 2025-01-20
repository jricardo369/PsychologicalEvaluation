import { Pipe } from "@angular/core";

@Pipe({
	name: "dateMMDDYYYY"
})
export class DatePipe {
	transform(value: string): string {
    let aux = (value.split("T")[0]).split("-");
    return aux.length == 3 ? aux[1] + "/" + aux[2] + "/" + aux[0] : "";
  }
}
