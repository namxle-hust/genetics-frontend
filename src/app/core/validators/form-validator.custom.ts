import { AbstractControl } from "@angular/forms";

export const minLengthArray = (min: number) => {
    return (c: AbstractControl): { [key: string]: any } | null => {
        if (c.value.length >= min)
            return null;

        return { MinLengthArray: true };
    }
}


export const lengthArray = (total: number) => {
    return (c: AbstractControl): { [key: string]: any } | null => {
        if (c.value.length == total)
            return null;

        return { LengthArray: true };
    }
}

export const maxLengthArray = (max: number) => {
    return (c: AbstractControl): { [key: string]: any } | null => {
        if (c.value.length < max)
            return null;

        return { MaxLengthArray: true };
    }
}