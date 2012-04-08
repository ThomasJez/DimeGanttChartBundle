<?php
namespace Dime\GanttChartBundle\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Dime\InvoiceBundle\TimeTrackerServiceClient\TimeTrackerServiceClient;

class GanttChartController extends Controller
{
  /**
   *
   * generates the environment for the ganttchart and the form
   * for editing the start data of the ganttchart
   */
  public function indexAction(Request $request)
  {
    $chart_start = $this->getDoctrine()->getRepository('DimeGanttChartBundle:GanttConfig')->findOneByKey('start');
    $defaultData=array('start' => $chart_start->getValue());
    $builder=$this->createFormBuilder($defaultData);
    $builder->add('start','text');
    $form=$builder->getForm();
    if ($request->getMethod() == 'POST') {
      $form->bindRequest($request);    
      if ($form->isValid()) {
        $data=$form->getData();
        $start=$data['start'];
        $chart_start->setValue($start);
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($chart_start);
        $em->flush();
      }
    }
    return $this->render('DimeGanttChartBundle:GanttChart:index.html.twig', array('form' => $form->createView()));
  }

  /**
   * 
   * prepares and submits the data for the ganttchart
   */
  public function ajaxAction()
  {
    $chart_start=$this->getDoctrine()->getRepository('DimeGanttChartBundle:GanttConfig')->findOneByKey('start')->getValue();
    $tscl = new TimeTrackerServiceClient($this);
    $activities = $tscl->getAPIResult('get_activities');
    $i = 0;
    $maschinen = array();
    $j = 0;
    $vorgaenge = array();
    foreach ($activities as $activity) {
      $timeslices=$tscl->timeslicesByActivity($activity['id']);
      foreach ($timeslices as $timeslice) {
        $vorgaenge[$j] = array();
        $vorgaenge[$j]['y'] = $i;
        $abs_start = $timeslice['startedAt'];
        $rel_start = intval((strtotime($abs_start)-strtotime($chart_start))/3600);
        $vorgaenge[$j]['x'] = $rel_start;
        $dauer = $timeslice['duration'];
        $vorgaenge[$j++]['l'] = $dauer/3600+1;
      }
      $maschinen[$i++] = $activity['description'];
    }
    $services = $tscl->getAPIResult('get_services');
    $g_services=array();  
    foreach ($services as $service) {
      $g_service= array('name' => $service['name'], 'rate' => $service['rate']);
      $g_service['rate'] /= 10;
      $g_services[] = $service;
    }
    $start = strtotime($chart_start);
    $data = json_encode(array('maschinen' => $maschinen, 'vorgaenge' => $vorgaenge, 'services' => $g_services, 'start' => $start));
    return new Response($data);
  }
}