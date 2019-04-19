export function write (txt) {
    document.body.append(txt);
    document.body.append(document.createElement('br'));
}
export function validate (txt) {
    try {
        JSON.parse(txt);
    } catch(e) {
        write('error validating JSON:' + e);
        return;
    }
}
export function validateAndWrite (txt) {
    validate(txt);
    write(txt);
}
