const Desklet = imports.ui.desklet;
const St = imports.gi.St;
const Mainloop = imports.mainloop;

function MyDesklet(metadata, desklet_id) {
    this._init(metadata, desklet_id);
}

MyDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function(metadata, desklet_id) {
        Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);

        // Container to hold multiple labels (VERTICAL layout)
        this.container = new St.BoxLayout({
            vertical: true
        });

        // Main time label
        this.timeLabel = new St.Label({
            text: "Loading...",
            style_class: "clock-time-label"
        });

        // Under text label (weekday + month + day)
        this.dateLabel = new St.Label({
            text: "Loading...",
            style_class: "clock-date-label"
        });

        // Add labels to container
        this.container.add(this.timeLabel);
        this.container.add(this.dateLabel);

        // Set container as desklet content ONCE
        this.setContent(this.container);

        // Start updating time
        this._updateTime();
    },

    _updateTime: function() {
        let now = new Date();

        // ----- TIME -----
        let hour24 = now.getHours();
        let minute = now.getMinutes();

        let hour12 = hour24 % 12;
        if (hour12 === 0) hour12 = 12;

        let ampm = hour24 >= 12 ? "PM" : "AM";
        let minutePadded = minute < 10 ? "0" + minute : minute;

        let timeString = `${hour12}:${minutePadded} ${ampm}`;

        // ----- DATE -----
        let weekdayNumber = now.getDay(); // 0–6
        let dayOfMonth = now.getDate();   // 1–31
        let monthNumber = now.getMonth(); // 0–11

        let weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        let months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        let dateString = `${weekdays[weekdayNumber]}, ${months[monthNumber]} ${dayOfMonth}`;

        // Update labels
        this.timeLabel.set_text(timeString);
        this.dateLabel.set_text(dateString);

        // Update every second
        this.timeout = Mainloop.timeout_add_seconds(1, () => {
            this._updateTime();
            return false;
        });
    },

    on_desklet_removed: function() {
        if (this.timeout) {
            Mainloop.source_remove(this.timeout);
        }
    }
};

function main(metadata, desklet_id) {
    return new MyDesklet(metadata, desklet_id);
}
