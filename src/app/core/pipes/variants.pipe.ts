import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";


@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    transform(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}


@Pipe({ name: 'variantClassification' })
export class VariantClassificaitonPipe implements PipeTransform {
    constructor() { }
    transform(classification: string) {
        return classification.split(' ').join("-")
    }
}
