$(function() {
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();


	$('#calendar-holder').fullCalendar({
			header : {
				left : 'prev, next, today',
				center : 'title',
				right : 'month,agendaWeek,agendaDay,'
			},
			allDaySlot : false,
			dayClick : function(date, jsEvent, view) {
				$('#calendar-holder').fullCalendar('changeView', 'agendaDay');
				$('#calendar-holder').fullCalendar('gotoDate', date);
			},
			droppable : true,
			drop : function(date, allDay, jsEvent, ui) {
				if($('#calendar-holder').fullCalendar('getView').name == 'month') {
					if(date.hours() == 0) {
						date.hours(8);
					}
				}
				var element = this;
				$.ajax({
					url : Routing.generate('fullcalendar_event_dropped'),
					data : {
						date : date.utc().format(),
						id : this.id,
						installationId: $(this).prop('installationId')
					},
                    success : function(data, textStatus, jqXHR) {
                        $('#calendar-holder').fullCalendar('renderEvent',
                            data, true);
                        $(element).remove();

                        if (data.error) {
                            $('#calendar-failed-modal #error').text(data.errorMessage);
                            $('#calendar-failed-modal').modal();
                        } else {
                            var startText = new moment.unix(data.start);
                            $('#calendar-added-modal #engineer-name').text(data.title);
                            $('#calendar-added-modal #engineer-start').text(startText.format('dddd, MMMM Do YYYY, h:mm:ss a'));
                            $('#calendar-added-modal').modal();
                        }
                    }
				});
			},
			firstDay : 1,
			lazyFetching : true,
			weekNumbers : false,
			theme : false,
			timeFormat : 'hh:mm',
			eventSources : [ {
				url : Routing.generate('fullcalendar_loader'),
				type : 'POST',
				error : function() {
				}
			} ],
			eventClick : function(event) {
				$('#calendar-remove-modal #event_id').val(event.id);
				$('#calendar-remove-modal').modal();
			},
			editable : true,
			eventDrop : function(event, delta, revertFunc, jsEvent, ui, view) {
				$.ajax({
					url : Routing.generate('fullcalendar_event_dragged'),
					data : {
						id: event.id,
						start: event.start.utc().format(),
						end: event.end.utc().format()
					},
					success : function(data) {
						$('#calendar-holder').fullCalendar('renderEvent',
							data, true);
					},
					error : function(jqXHR, textStatus, errorThrown) {
						revertFunc();
						alert('Could not move event: ' + errorThrown);
					}
				});
			},
            eventResize: function(event, delta, revertFunc) {
                $.ajax({
                    url : Routing.generate('fullcalendar_event_dragged'),
                    data : {
                        id: event.id,
                        start: event.start.utc().format(),
                        end: event.end.utc().format()
                    },
                    success : function(data) {
                        $('#calendar-holder').fullCalendar('renderEvent',
                            data, true);
                    },
                    error : function(jqXHR, textStatus, errorThrown) {
                        revertFunc();
                        alert('Could not move event: ' + errorThrown);
                    }
                });

            },
			eventRender: function (event, element) {
				$("<i class=\"icon-remove-sign\" style=\"float: right\"></i>").insertAfter(element.find('.fc-title'));
			},
      eventOverlap: false
		});
});
