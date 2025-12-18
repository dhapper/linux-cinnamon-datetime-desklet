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

        // Create text label
        this.label = new St.Label({
            text: "Loading...",
            style_class: "clock-label"
        });

        // Add label directly as desklet content
        this.setContent(this.label);

        // Start updating time
        this._updateTime();
    },

    _updateTime: function() {
        // Current date/time
        let now = new Date();

        // Extract values
        let hour24 = now.getHours();     // 0–23
        let minute = now.getMinutes();  // 0–59

        // Convert to 12-hour format
        let hour12 = hour24 % 12;
        if (hour12 === 0) {
            hour12 = 12;
        }

        // AM / PM
        let ampm = hour24 >= 12 ? "PM" : "AM";

        // Pad minutes
        let minutePadded = minute < 10 ? "0" + minute : minute;

        // Build custom string: HH:MM PM
        let timeString = `${hour12}:${minutePadded} ${ampm}`;

        // Update label
        this.label.set_text(timeString);

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
