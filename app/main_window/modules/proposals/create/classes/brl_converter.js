export class BrlConverter {

    strToSanitizedFloat(value) {
        const sanitizedValue = String(value).replace(/\D/g, '');
        return parseFloat(sanitizedValue);
    }

    floatToBrl(value) {
        const brlValue = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return brlValue;
    }

    brlToFloat(value) {
        const sanitizedValue = String(value).replace("R$", "").replace(".", "").replace(",", ".").trim();
        const floatValue = parseFloat(sanitizedValue);
        return floatValue;
    }

}