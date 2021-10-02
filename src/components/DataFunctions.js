
export function RunObj(id, date) {
    const numMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    var schedule = new Date(date);
    var dow = days[schedule.getDay()];
    var fullMonth = months[schedule.getMonth()];
    var month = numMonths[schedule.getMonth()];
    var day = schedule.getDate();
    var year = schedule.getFullYear();

    var options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };

    var time = schedule.toLocaleString('en-US', options);

    var sendDate = {
        id: id,
        dateNum: month+'/'+day+'/'+year,
        date: fullMonth+'/'+day+'/'+year,
        time: time,
        dow: dow
    }

    return sendDate;
}
