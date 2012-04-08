<?php

namespace Dime\GanttChartBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Dime\GanttChartBundle\Entity\GanttConfig
 *
 * @ORM\Table(name="gantt_config")
 * @ORM\Entity
 */
class GanttConfig
{
    /**
     * @var integer $id
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string $key
     *
     * @ORM\Column(name="key", type="string", length=255)
     */
    private $key;

    /**
     * @var text $value
     *
     * @ORM\Column(name="value", type="text")
     */
    private $value;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set key
     *
     * @param string $key
     * @return GanttConfig
     */
    public function setKey($key)
    {
        $this->key = $key;
        return $this;
    }

    /**
     * Get key
     *
     * @return string 
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * Set value
     *
     * @param text $value
     * @return GanttConfig
     */
    public function setValue($value)
    {
        $this->value = $value;
        return $this;
    }

    /**
     * Get value
     *
     * @return text 
     */
    public function getValue()
    {
        return $this->value;
    }
}