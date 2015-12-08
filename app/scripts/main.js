var   createEntry = $('#createEntry'),
      newEntry = $('#newEntry'),
      closer = $('.closer'),
      start = $('#startBtn'),
      started = 0;


createEntry.click(function() {
  newEntry.show();
});

closer.click(function() {
  newEntry.hide();
});

start.click(function() {
  if (started == 0) {
    start.html("Stop");
    started = 1;
  } else if (started == 1) {
    start.html("Start");
    started = 0;
  }
});
