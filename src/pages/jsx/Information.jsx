import  { useState } from 'react';
import '../css/Information.css'
import { Accordion } from 'react-bootstrap';
import Plus from '../../components/jsx/Plus';
import ScrollToTopButton from '../../components/jsx/ScrollToTopButton';
import { useTranslation } from 'react-i18next';

function Information () {
  const { t } = useTranslation();
  
  
  
  const trip = [{title: (t`information.a`), link: 'visa'}, {title: (t`information.b`), link: 'language'}, {title: (t`information.c`), link: 'traffic'}, {title: (t`information.d`), link: 'season'}, 
    {title: (t`information.e`), link: 'provide'}, {title: (t`information.f`), link: 'exchange and card'}, {title: (t`information.g`), link: 'standard'}]

  return ( 
    <div id='Information'>
      <div className='Bmargin'>
      {
        trip.map((n, index) => {
          return(     
            <span key={index}><a className='button' href={`#${n.link}`}>{n.title}</a></span>
          )
        })
      }
      </div> 
      <div className='center'>
        <br />
        <img className='introduceimg' src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/255px-Flag_of_South_Korea.svg.png'></img>
        <br />
        
        <p className='introduce'>
            {t`information.top-title-1`}<br /> 
            {t`information.top-title-2`}<br />
            {t`information.top-title-3`}
        </p>
      </div>
      <div className="visa-guide">
        <div id='visa'>&nbsp;</div>
        <h1>{t`information.middle-title-1`}</h1>
        <p>
           {t`information.begin-1`}<br /><br />
           {/* <button className='one' onClick={() => setModalShow(true)}>비자가 필요한 나라의 경우를 위해 비자 신청 절차와 필요한 서류 안내</button> */}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>{t`information.title-1-1`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-1-1-1`}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>{t`information.title-1-2`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-1-2-1`}<br/><br/>
        {t`information.title-text-1-2-2`} <br /><br/>
        {t`information.title-text-1-2-3`}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>{t`information.title-1-3`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-1-3-1`}<br /><br />
        {t`information.title-text-1-3-2`}<br /><br />
        {t`information.title-text-1-3-3`}<br /><br />
        {t`information.title-text-1-3-4`}<br /><br />
        <Plus/>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header><h5>{t`information.title-1-4`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-1-4-1`}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header><h5>{t`information.title-1-5`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-1-5-1`}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="5">
        <Accordion.Header><h5>{t`information.title-1-6`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-1-6-1`}</b>{t`information.title-text-1-6-2`}<br />
        <b>{t`information.title-text-1-6-3`}</b>{t`information.title-text-1-6-4`}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
           
        </p>
        <div id='language'>&nbsp;</div><br />
        <h1>{t`information.middle-title-2`}</h1>
        <p>
           {t`information.begin-2`}<br /><br/>
           {/*<button className='one' onClick={() => setModalShow2(true)}>한국 여행에 필요한 기본적인 언어 표현 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>{t`information.title-2-1`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-2-1-1`}<br /><br />
        {t`information.title-text-2-1-2`}<br /><br />
        {t`information.title-text-2-1-3`}<br /><br />
        {t`information.title-text-2-1-4`}<br /><br />
        {t`information.title-text-2-1-5`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>{t`information.title-2-2`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-2-2-1`}<br /><br />
        {t`information.title-text-2-2-2`}<br /><br />
        {t`information.title-text-2-2-3`}<br /><br />
        {t`information.title-text-2-2-4`}<br /><br />
        {t`information.title-text-2-2-5`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>{t`information.title-2-3`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-2-3-1`}<br /><br />
        {t`information.title-text-2-3-2`}<br /><br />
        {t`information.title-text-2-3-3`}<br /><br />
        {t`information.title-text-2-3-4`}<br /><br />
        {t`information.title-text-2-3-5`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header><h5>{t`information.title-2-4`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-2-4-1`}<br /><br />
        {t`information.title-text-2-4-2`}<br /><br />
        {t`information.title-text-2-4-3`}<br /><br />
        {t`information.title-text-2-4-4`}<br /><br />
        {t`information.title-text-2-4-5`}<br /><br />
        {t`information.title-text-2-4-6`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header><h5>{t`information.title-2-5`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-2-5-1`}<br /><br />
        {t`information.title-text-2-5-2`}<br /><br />
        {t`information.title-text-2-5-3`}<br /><br />
        {t`information.title-text-2-5-4`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="5">
        <Accordion.Header><h5>{t`information.title-2-6`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-2-6-1`}<br /><br />
        {t`information.title-text-2-6-2`}<br /><br />
        {t`information.title-text-2-6-3`}<br /><br />
        {t`information.title-text-2-6-4`}<br /><br />
        {t`information.title-text-2-6-5`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
       <div id='traffic'>&nbsp;</div><br />
        </p>
        <h1>{t`information.middle-title-3`}</h1>
        <p>
           {t`information.begin-3`}<br /><br />
           {/*<button className='one' onClick={() => setModalShow3(true)}>대중교통 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>{t`information.title-3-1`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-3-1-1`}</b>{t`information.title-text-3-1-2`}<br /><br />
        <b>{t`information.title-text-3-1-3`}</b>{t`information.title-text-3-1-4`}<br /><br />
        <b>{t`information.title-text-3-1-5`}</b>{t`information.title-text-3-1-6`}<br /> 
        {t`information.title-text-3-1-7`}<br /><br />
       <b>{t`information.title-text-3-1-8`}</b>{t`information.title-text-3-1-9`}


        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>{t`information.title-3-2`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-3-2-1`}</b>{t`information.title-text-3-2-2`}<br />
        {t`information.title-text-3-2-3`}<br />
        {t`information.title-text-3-2-4`}<br />
        {t`information.title-text-3-2-5`}<br /><br />
        <b>{t`information.title-text-3-2-6`}</b>{t`information.title-text-3-2-7`}<br /><br />
        <b>{t`information.title-text-3-2-8`}</b>{t`information.title-text-3-2-9`}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>{t`information.title-3-3`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-3-3-1`}</b>:<br /><br />
        <b>{t`information.title-text-3-3-2`}</b>{t`information.title-text-3-3-3`}<br />
        <b>{t`information.title-text-3-3-4`}</b>{t`information.title-text-3-3-5`}<br />
        <b>{t`information.title-text-3-3-6`}</b>{t`information.title-text-3-3-7`}<br /><br />
        <b>{t`information.title-text-3-3-8`}</b>:<br /><br />
        {t`information.title-text-3-3-9`}<br /><br />
        {t`information.title-text-3-3-10`}<br /><br />
        {t`information.title-text-3-3-11`}<br /><br />

        </Accordion.Body>
      </Accordion.Item>

    </Accordion>
      <div id='season'>&nbsp;</div><br />
        </p>
        <h1>{t`information.middle-title-4`}</h1>
        <p>
           {t`information.begin-4`}<br /><br />
           {/*<button className='one' onClick={() => setModalShow4(true)}>각 계절별 주의사항과 팁 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>{t`information.title-4-1`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-4-1-1`}<br /><br />
        <b>{t`information.title-text-4-1-2`}</b><br />
        {t`information.title-text-4-1-3`}<br />
        &nbsp;&nbsp;{t`information.title-text-4-1-4`}<br /> &nbsp;&nbsp;&nbsp;&nbsp;{t`information.title-text-4-1-5`}<br />
        &nbsp;&nbsp;{t`information.title-text-4-1-6`}<br /><br />
        <b>{t`information.title-text-4-1-7`}</b><br />{t`information.title-text-4-1-8`}<br /><br />
        <b>{t`information.title-text-4-1-9`}</b><br />
        {t`information.title-text-4-1-10`}<br />
        {t`information.title-text-4-1-11`}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>{t`information.title-4-2`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-4-2-1`}<br /><br />
        <b>{t`information.title-text-4-2-2`}</b><br />
        {t`information.title-text-4-2-3`}<br />
        {t`information.title-text-4-2-4`}<br />
        {t`information.title-text-4-2-5`}<br /><br />
        <b>{t`information.title-text-4-2-6`}</b><br />
        {t`information.title-text-4-2-7`}<br /><br />
        <b>{t`information.title-text-4-2-8`}</b><br />{t`information.title-text-4-2-9`}<br /><br />
        <b>{t`information.title-text-4-2-10`}</b><br />
        {t`information.title-text-4-2-11`}<br />
        {t`information.title-text-4-2-12`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>{t`information.title-4-3`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-4-3-1`}<br /><br />
        <b>{t`information.title-text-4-3-2`}</b><br />
        {t`information.title-text-4-3-3`}<br />
        {t`information.title-text-4-3-4`}<br />
        {t`information.title-text-4-3-5`}<br /><br />
        <b>{t`information.title-text-4-3-6`}</b><br />{t`information.title-text-4-3-7`}<br /><br />
        <b>{t`information.title-text-4-3-8`}</b><br />
        {t`information.title-text-4-3-9`}<br />
        {t`information.title-text-4-3-10`}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header><h5>{t`information.title-4-4`}</h5></Accordion.Header>
        <Accordion.Body>
        {t`information.title-text-4-4-1`}<br /><br />
        <b>{t`information.title-text-4-4-2`}</b><br />
        {t`information.title-text-4-4-3`}<br />
        {t`information.title-text-4-4-4`}<br />
        {t`information.title-text-4-4-5`}<br /><br />
        <b>{t`information.title-text-4-4-6`}</b>{t`information.title-text-4-4-7`}<br /><br />
        <b>{t`information.title-text-4-4-8`}</b><br />
        {t`information.title-text-4-4-9`}<br />
        {t`information.title-text-4-4-10`}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
      <br />
       <p>
       <b>{t`information.reference-1`}</b><br />
       {t`information.reference-1-1`}<br /><br />
       {t`information.reference-1-2`}<br /><br />
       {t`information.reference-1-3`}<br /><br />

       </p>
       <div id='provide'>&nbsp;</div><br />
        </p>
        <h1>{t`information.middle-title-5`}</h1>
        <p>
           {t`information.begin-5-1`} <br />
           {t`information.begin-5-2`}<br /><br />
           {/*<button className='one' onClick={() => setModalShow5(true)}>비상 상황 대비 방법 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>{t`information.title-5-1`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-5-1-1`}</b><br />
        {t`information.title-text-5-1-2`})<br /><br />
        {t`information.title-text-5-1-3`}<br /><br />
        {t`information.title-text-5-1-4`}<br /><br />
        {t`information.title-text-5-1-5`}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>{t`information.title-5-2`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-5-2-1`}</b>{t`information.title-text-5-2-2`}<br /><br />
        <b>{t`information.title-text-5-2-3`}</b>{t`information.title-text-5-2-4`}<br /><br />
        <b>{t`information.title-text-5-2-5`}</b>{t`information.title-text-5-2-6`}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>{t`information.title-5-3`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-5-3-1`}</b>{t`information.title-text-5-3-2`}<br /><br />
        <b>{t`information.title-text-5-3-3`}</b>{t`information.title-text-5-3-4`}
        </Accordion.Body>
      </Accordion.Item>

    </Accordion>
      <br />
       <p>
       <h4>{t`information.reference-2`}</h4>
       <b>{t`information.reference-2-1`}</b>{t`information.reference-2-2`}<br /><br />
       <b>{t`information.reference-2-3`}</b>{t`information.reference-2-4`}<br /><br />
       <b>{t`information.reference-2-5`}</b>{t`information.reference-2-6`}

       </p>
       <div id='exchange and card'>&nbsp;</div><br /> 
        </p>
        <h1>{t`information.middle-title-6`}</h1>
        <p>
           {t`information.begin-6`}<br /><br />
           {/*<button className='one' onClick={() => setModalShow6(true)}>환전할 장소 및 유의사항 안내와 카드 사용 여부 및 유의사항 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>{t`information.title-6-1`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-6-1-1`}</b> <br />
        {t`information.title-text-6-1-2`}<br /><br />
        {t`information.title-text-6-1-3`}<br /><br />
        {t`information.title-text-6-1-4`}<br /><br /><br />
        <b>{t`information.title-text-6-1-5`}</b> <br />
        {t`information.title-text-6-1-6`}<br /><br />
        {t`information.title-text-6-1-7`}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>{t`information.title-6-2`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-6-2-1`}</b><br /><br />
        {t`information.title-text-6-2-2`}<br />
        {t`information.title-text-6-2-3`}<br /><br /><br />
        <b>{t`information.title-text-6-2-4`}</b><br /><br />
        {t`information.title-text-6-2-5`}<br /><br />
        {t`information.title-text-6-2-6`}<br /><br />
        {t`information.title-text-6-2-7`}<br />
        </Accordion.Body>
      </Accordion.Item>

    </Accordion>
      <br />
      <h5>{t`information.reference-3`}</h5>
      <p>
      {t`information.reference-3-1`}
      </p>
      <div id='standard'>&nbsp;</div><br />
        </p>
        <h1>{t`information.middle-title-7`}</h1>
        <p>
           {t`information.begin-7`}<br /><br />
           {/*<button className='one' onClick={() => setModalShow7(true)}>규범과 법률 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>{t`information.title-7-1`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-7-1-1`}</b>{t`information.title-text-7-1-2`}<br /><br />
        <b>{t`information.title-text-7-1-3`}</b>{t`information.title-text-7-1-4`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>{t`information.title-7-2`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-7-2-1`}</b>{t`information.title-text-7-2-2`}<br /><br />
        <b>{t`information.title-text-7-2-3`}</b>{t`information.title-text-7-2-4`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>{t`information.title-7-3`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-7-3-1`}</b>{t`information.title-text-7-3-2`}<br /><br />
        <b>{t`information.title-text-7-3-3`}</b>{t`information.title-text-7-3-4`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header><h5>{t`information.title-7-4`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-7-4-1`}</b>{t`information.title-text-7-4-2`}<br /><br />
        <b>{t`information.title-text-7-4-3`}</b>{t`information.title-text-7-4-4`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header><h5>{t`information.title-7-5`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-7-5-1`}</b>{t`information.title-text-7-5-2`}<br /><br />
        <b>{t`information.title-text-7-5-3`}</b>{t`information.title-text-7-5-4`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="5">
        <Accordion.Header><h5>{t`information.title-7-6`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-7-6-1`}</b>{t`information.title-text-7-6-2`}<br /><br />
        <b>{t`information.title-text-7-6-3`}</b>{t`information.title-text-7-6-4`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="6">
        <Accordion.Header><h5>{t`information.title-7-7`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-7-7-1`}</b>{t`information.title-text-7-7-2`}<br /><br />
        <b>{t`information.title-text-7-7-3`}</b>{t`information.title-text-7-7-4`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="7">
        <Accordion.Header><h5>{t`information.title-7-8`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-7-8-1`}</b>{t`information.title-text-7-8-2`}<br /><br />
        <b>{t`information.title-text-7-8-3`}</b>{t`information.title-text-7-8-4`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="8">
        <Accordion.Header><h5>{t`information.title-7-9`}</h5></Accordion.Header>
        <Accordion.Body>
        <b>{t`information.title-text-7-9-1`}</b>{t`information.title-text-7-9-2`}<br /><br />
        <b>{t`information.title-text-7-9-3`}</b>{t`information.title-text-7-9-4`}<br /><br />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <br />
       <b>
       {t`information.reference-4`}
       </b>
          
        </p>
      </div>
      <ScrollToTopButton />
    </div>
  )
}

export default Information