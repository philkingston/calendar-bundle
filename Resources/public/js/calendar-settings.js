$(function() {
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	

	$('#calendar-holder').fullCalendar({
			header : {
				left : 'prev, next',
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
					if(date.getHours() == 0) {
						date.setHours(8);
					}
				}
				var element = this;
				$.ajax({
					url : Routing.generate('fullcalendar_event_dropped'),
					data : {
						date : date,
						id : this.id,
						installationId: $(this).prop('installationId')
					},
					success : function(data, textStatus, jqXHR) {
						$('#calendar-holder').fullCalendar('renderEvent',
							data, true);
						$(element).remove();
						$('#calendar-added-modal #engineer-name').text(data.title);
						$('#calendar-added-modal #engineer-start').text(data.start);
						$('#calendar-added-modal').modal();
					}
				});
			},
			firstDay : 1,
			lazyFetching : true,
			weekNumbers : true,
			theme : false,
			timeFormat : {
				// for agendaWeek and agendaDay
				agenda : 'hh:mm', // 5:00 - 6:30

				// for all other views
				'' : 'hh:mm' // 7p
			},
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
			eventDrop : function(event, dayDelta, minuteDelta, allDay,
								 revertFunc, jsEvent, ui, view) {
				$.ajax({
					url : Routing.generate('fullcalendar_event_dragged'),
					data : event
				});
			},
			eventRender: function (event, element) {
				$("<i class=\"icon-remove-sign\" style=\"float: right\"></i>").insertAfter(element.find('.fc-title'));
			},
            eventOverlap: false
		});
});
