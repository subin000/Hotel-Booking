import React from 'react'
import Uploadhotel from './Uploadhotel';
import Roomupload from './Roomupload';
import {useState} from 'react';
import {Button} from 'react-bootstrap'

export default function Adminroute() {

    function Component1() {
        return <Uploadhotel/>;
      }
      
      function Component2() {
        return <Roomupload/>;
      }

    const [showComponent, setShowComponent] = useState(false);

  return (
    <div style={{textAlign : 'center'}}>
      <Button variant="primary" onClick={() => setShowComponent(true)}>
  Upload a Hotel
</Button>
<Button variant="secondary" onClick={() => setShowComponent(false)}>
  Upload a room
</Button>
{showComponent? <Component1 /> : <Component2 />}
    </div>
  )
}
