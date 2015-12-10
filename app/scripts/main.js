const
    sortByTime = (a, b) => a.time - b.time,
    states = {
        IDLE: Symbol('idle'),
        RUNNING: Symbol('running'),
        STOPPED: Symbol('stopped')
    };

class Application {

    constructor(options) {
        this.collection = JSON.parse(localStorage.getItem('entries') || "[]");
        this.state = states.IDLE;
        this.stopwatch = new Stopwatch();
        this.options = options;

        this.renderEntries();

        this.options.$createEntry.on('click', this.onToggleButton.bind(this));
        this.options.$closer.on('click', this.onToggleButton.bind(this));
        this.options.$start.on('click', this.onStateChange.bind(this));
        setInterval(this.updateTimer.bind(this), 5);
    }

    onToggleButton() {
        this.options.$newEntry.toggle();
    }

    onStateChange() {
        switch (this.state) {
            case states.IDLE: this._stop(); break;
            case states.RUNNING: this._save(); break;
            case states.STOPPED: this._idle(); break;
        }
    }

    updateTimer() {
        this.options.$timer.html(
            this.stopwatch.toString()
        );
    }

    renderEntries() {
        const html = this.collection.map(({ name, friendly }) => (
            `<tr><td>${name}</td><td>${friendly}</td></tr>`
        )).join('');

        this.options.$entries.html(html);
    }

    setState(state) {
        this.state = state;
    }

    _stop() {
        if (!this.options.$name.val()) {
            return;
        }

        this.setState(states.RUNNING);
        this.stopwatch.start();
        this.options.$start.html("Stop");
    }

    _save() {
        this.setState(states.STOPPED);

        this.collection.push({
            name: this.options.$name.val(),
            time: this.stopwatch.getElapsed(),
            friendly: this.stopwatch.toString()
        });
        this.collection.sort(sortByTime);
        localStorage.setItem('entries', JSON.stringify(this.collection));

        this.renderEntries();
        this.stopwatch.pause();
        this.options.$start.html("Save");
    }

    _idle() {
        this.setState(states.IDLE);
        this.stopwatch.stop();

        this.options.$newEntry.hide();
        this.options.$name.val('');
        this.options.$start.html("Start");
    }
}

$(function() {
    new Application({
        $createEntry: $('#createEntry'),
        $newEntry: $('#newEntry'),
        $closer: $('.closer'),
        $start: $('#startBtn'),
        $name: $('#yourName'),
        $timer: $('.timer'),
        $entries: $('#entries')
    });
});
