<?php

namespace ADesigns\CalendarBundle\Event;

use Symfony\Component\EventDispatcher\Event;

use ADesigns\CalendarBundle\Entity\EventEntity;

/**
 * Event used to store EventEntitys
 *
 * @author Mike Yudin <mikeyudin@gmail.com>
 */
class CalendarEvent extends Event
{
    const CONFIGURE = 'calendar.load_events';

    private $id;

    private $startDatetime;

    private $endDatetime;

    private $userId;

    private $events;

    /**
     * Constructor method requires a start and end time for event listeners to use.
     *
     * @param \DateTime $start Begin datetime to use
     * @param \DateTime $end End datetime to use
     */
    public function __construct(\DateTime $start, \DateTime $end, $userId = null)
    {
        $this->startDatetime = $start;
        $this->endDatetime = $end;
        $this->userId = $userId;
        $this->events = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getEvents()
    {
        return $this->events;
    }

    /**
     * If the event isn't already in the list, add it
     *
     * @param EventEntity $event
     * @return CalendarEvent $this
     */
    public function addEvent(EventEntity $event)
    {
        if (!$this->events->contains($event)) {
            $this->events[] = $event;
        }

        return $this;
    }

    public function getStartDatetime()
    {
        return $this->startDatetime;
    }

    public function getEndDatetime()
    {
        return $this->endDatetime;
    }

    public function getUserId()
    {
        return $this->userId;
    }

    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

  	public function getId()
    {
  		  return $this->id;
  	}

  	public function setId($id)
    {
  		$this->id = $id;
  		  return $this;
  	}
}
