import { Pipe } from "@angular/core";

@Pipe({
	name: "dateMMDDYYYY"
})
export class DatePipe {
	transform(value: string, caseType: string = 'date'): string {
    if(value !== null && value.length > 0) {
      let date = value.split(/[\sT]/);
      let aux = (date[0].split("T")[0]).split("-");
      return (aux.length == 3 ? aux[1] + "/" + aux[2] + "/" + aux[0] : "") + ((date.length > 1 && caseType == 'time')? " " + date[1] : "");
    }
    return;
  }
}
