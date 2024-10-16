
export let dateOptions = {
    dateFormat: localStorage.getItem('currentFormat') ?
        localStorage.getItem('currentFormat') : 'MM-dd-yyyy',
    pickerFormat: getPickerFormat()
};
export let timeZone = {
    location: localStorage.getItem('currentLocation') ? localStorage.getItem('currentLocation') : 'America/Kentucky/Monticello',
};

function getPickerFormat() {
    // format hints from the document
    // (d = Day not leading zero,
    //     dd = Day with leading zero,
    //     m = Month not leading zero,
    //     mm = Month with leading zero,
    //     mmm = Month as a text,
    //     yyyy = Year four digit)

    const formats = ['d.m.yyyy',
        'dd.mm.yyyy',
        'yyyy-m-d',
        'yyyy-mm-dd',
        'd mmm yyyy',
        'dd mmm yyyy'];

    let value = 'mm-dd-yyyy';
    return value;

}
