
function parseFloatOrNull(text: string): number { try { return Number.parseFloat(text); } catch (err) { return null; } }

function NUMATT(e: Element, n: string): number { if (!e) return null; return parseFloatOrNull(ATT(e, n)); }

function ATT(e: Element, n: string): string { return e.getAttribute(n); }

function array(collection: HTMLCollection | NodeListOf<Element>): Element[] {
    let array = [];
    let n = collection.length;
    for (let i = 0; i < n; i++) array.push(collection.item(i));
    return array;
}

const IVA = "002";

export class CFDI {

    // DONE
    Total: number = null;
    SubTotal: number = null;
    TotalImpuestosTrasladados: number = null;
    TotaldeTraslados: number = null;

    // MADEUP
    TotalIvaTrasladado: number = null;

    // TODO
    /*
    Version: string = null;
    Serie: string = null;
    Folio: string = null;
    Fecha: string = null;
    FormaPago: string = null;
    NoCertificado: string = null;
    Certificado: string = null;
    CondicionesDePago: string = null;
    Moneda: string = null;
    TipoCambio: number = null;
    TipoDeComprobante: string = null;
    MetodoPago: string = null;
    LugarExpedicion: string = null;
    Sello: string = null;
    */

    public static parseFile(file: File): Promise<CFDI> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            //reader.onloadstart = e => console.log('loadstart');
            //reader.onprogress = e => console.log('progress');
            //reader.onload = e => console.log('load');
            reader.onloadend = e => resolve(this.parse(reader.result as string));
            reader.onabort = e => reject(e);
            reader.onerror = e => reject(e);
            reader.readAsText(file);
        });
    }

    public static parse(xml: string): CFDI {

        let parser = new DOMParser();
        let document = parser.parseFromString(xml, 'text/xml');

        let comprobante = document.querySelector('Comprobante');
        let comprobanteChildren = array(comprobante.children);
        let impuestos = comprobanteChildren.find(e => e.tagName == 'cfdi:Impuestos');
        let complemento = comprobanteChildren.find(e => e.tagName == 'cfdi:Complemento');

        let cfdi = new CFDI();

        cfdi.Total = NUMATT(comprobante, 'Total');
        cfdi.SubTotal = NUMATT(comprobante, 'SubTotal');
        cfdi.TotalImpuestosTrasladados = NUMATT(impuestos, 'TotalImpuestosTrasladados');

        if (impuestos !== undefined){ // TOTAL IVA
            let traslados = array(impuestos.querySelectorAll('Traslados Traslado'));
            cfdi.TotalIvaTrasladado = traslados
                .filter(e => ATT(e, "Impuesto") == IVA)
                .map(e => NUMATT(e, "Importe"))
                .filter(n => n)
                .reduce((a, b) => a + b, 0);
        } else cfdi.TotalIvaTrasladado = 0;

        if (complemento !== undefined){ // TOTAL IVA
            let implocal = array(complemento.querySelectorAll('ImpuestosLocales'));
            cfdi.TotaldeTraslados = implocal
                .map(e => NUMATT(e, "TotaldeTraslados"))
                .filter(n => n)
                .reduce((a, b) => a + b, 0);
        } else cfdi.TotaldeTraslados = 0;

        cfdi.TotalImpuestosTrasladados = parseFloatOrNull((cfdi.TotalImpuestosTrasladados + cfdi.TotaldeTraslados).toFixed(2));

        console.log(cfdi);

        return cfdi;
    }
}