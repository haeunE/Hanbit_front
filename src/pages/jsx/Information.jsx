import  { useState } from 'react';
import '../css/Information.css'
import { Accordion } from 'react-bootstrap';
import Plus from '../../components/jsx/Plus';
import ScrollToTopButton from '../../components/jsx/ScrollToTopButton';

function Information () {
  
  
  
  const trip = [{title: '#비자', link: 'visa'}, {title: '#언어', link: 'language'}, {title: '#교통', link: 'traffic'}, {title: '#계절', link: 'season'}, 
    {title: '#치안 및 안전', link: 'provide'}, {title: '#환전과 카드', link: 'exchange and card'}, {title: '#규범과 법률', link: 'standard'}]

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
            한국은 관광하기에 매우 편리한 나라입니다. 기본적인 기초 정보를 알고 여행을 시작하면 더욱 즐거운 경험을 할 수 있습니다.<br /> 
            각종 교통수단, 의료시설, 그리고 안전한 환경을 잘 활용하면서 한국의 다양한 매력을 경험해 보세요!<br />
            아래는 한국 여행에 필요한 기초적인 정보들을 소개합니다.
        </p>
      </div>
      <div className="visa-guide">
        <div id='visa'>&nbsp;</div>
        <h1>비자</h1>
        <p>
           한국 여행을 위해 입국 허가를 받으려면 비자가 필요합니다. 일부 국가에 대해 비자 면제를 제공하기도합니다.<br /><br />
           {/* <button className='one' onClick={() => setModalShow(true)}>비자가 필요한 나라의 경우를 위해 비자 신청 절차와 필요한 서류 안내</button> */}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>1. 비자 종류 확인</h5></Accordion.Header>
        <Accordion.Body>
        -관광 비자 (C-3): 가장 일반적인 관광 비자로, 최대 90일까지 한국에 체류할 수 있습니다.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>2. 비자 신청 자격</h5></Accordion.Header>
        <Accordion.Body>
        2.1 한국을 방문할 목적이 관광, 가족 방문 등 합법적인 이유여야 합니다.<br/><br/>
        2.2 입국 후 일정 기간(보통 90일 이하) 체류 예정이어야 합니다. <br /><br/>
        2.3 신청자는 경제적으로 자립할 수 있어야 하며, 귀국 의사가 있어야 합니다.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>3. 비자 신청 절차</h5></Accordion.Header>
        <Accordion.Body>
        3.1비자 신청서 제출 신청서와 서류를 준비한 후, 한국 대사관이나 영사관에 제출합니다. 일부 대사관에서는 온라인 비자 신청을 지원하기도 하므로, 해당 국가의 한국 대사관 웹사이트를 통해 확인하는 것이 좋습니다.<br /><br />
        3.2 비자 수수료 납부 비자 신청 시 수수료를 납부해야 합니다. 수수료는 비자 종류, 국적에 따라 다를 수 있으며, 대개 현금이나 카드로 결제 가능합니다.<br /><br />
        3.3 비자 심사 대사관에서 서류를 심사한 후, 결과를 통보합니다. 심사 기간은 대개 3-5일 정도 소요되며, 경우에 따라 추가 서류 요청이나 인터뷰가 있을 수 있습니다.<br /><br />
        3.4 비자 발급 비자가 승인되면 여권에 비자가 붙여져 발급됩니다.이후 대사관이나 영사관에서 비자를 수령하면 됩니다.<br /><br />
        <Plus/>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header><h5>4. 비자 면제 국가</h5></Accordion.Header>
        <Accordion.Body>
        한국은 일부 국가에 대해 비자 면제를 제공하기도 합니다. 예를 들어, 일본, 미국, 유럽연합(EU) 국가 등에서 단기 관광을 목적으로 방문할 경우 비자가 면제되거나 도착 후 비자를 받을 수 있는 경우도 있습니다.
        비자 면제 국가 목록은 한국 외교부 웹사이트에서 확인할 수 있으며, 방문 목적이나 체류 기간에 따라 세부 규정이 다를 수 있습니다.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header><h5>5. 체류 기간 연장</h5></Accordion.Header>
        <Accordion.Body>
        한국에 입국한 후 체류 기간을 연장하고 싶다면, 출입국관리사무소에 신청하여 연장할 수 있습니다. 
        그러나 일반적으로 관광 비자의 경우 연장에 제한이(90일) 있을 수 있으므로, 입국 전에 연장이 가능한지 미리 확인하는 것이 좋습니다. 
        만약 연장이 불가능한 경우, 출국 후 새로운 비자를 신청해야 할 수 있습니다.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="5">
        <Accordion.Header><h5>6. 기타 유의사항</h5></Accordion.Header>
        <Accordion.Body>
        <b>여권 유효 기간:</b> 여권의 유효기간이 비자 신청 전 최소 6개월 이상 남아 있어야 합니다.<br />
        <b>비자 거부 가능성:</b> 신청서나 서류에 허위가 있을 경우 비자가 거부될 수 있습니다.<br /> 또한, 이전에 한국에서 불법 체류한 기록이 있는 경우 비자가 거부될 수 있습니다.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
           
        </p>
        <div id='language'>&nbsp;</div><br />
        <h1>언어</h1>
        <p>
           한국의 공식 언어는 고유의 문자 체계인 한글을 사용하는 한국어입니다. 한국인이라면 대부분 한국어를 씁니다.<br /><br />
           {/*<button className='one' onClick={() => setModalShow2(true)}>한국 여행에 필요한 기본적인 언어 표현 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>1. 응답 표현</h5></Accordion.Header>
        <Accordion.Body>
        네 (Ne): Yes<br /><br />
        아니요 (Aniyo): No<br /><br />
        알아요 (Arayo): I know<br /><br />
        몰라요 (Mollayo): I don’t know<br /><br />
        괜찮아요 (Gwaenchana-yo): It's okay / I'm fine<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>2. 감사와 사과</h5></Accordion.Header>
        <Accordion.Body>
        감사합니다 (Gamsahamnida): Thank you (공식적, 격식)<br /><br />
        고마워요 (Gomawoyo): Thank you (친근한 표현)<br /><br />
        미안합니다 (Mianhamnida): I'm sorry (공식적)<br /><br />
        미안해요 (Mianhaeyo): I'm sorry (친근한 표현)<br /><br />
        괜찮아요 (Gwaenchana-yo): It's okay / I'm fine<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>3. 인사말</h5></Accordion.Header>
        <Accordion.Body>
        안녕하세요 (Annyeonghaseyo): Hello (일반적이고 예의 있는 인사)<br /><br />
        안녕 (Annyeong): Hi / Bye (친한 사람에게)<br /><br />
        좋은 아침이에요 (Joeun achim-ieyo): Good morning<br /><br />
        안녕히 가세요 (Annyeonghi gaseyo): Goodbye (상대방이 떠날 때)<br /><br />
        안녕히 계세요 (Annyeonghi gyeseyo): Goodbye (자신이 떠날 때)<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header><h5>4. 의문문 (질문 표현)</h5></Accordion.Header>
        <Accordion.Body>
        이게 뭐에요? (Ige mwoeyo?): What is this?<br /><br />
        어디에요? (Eodieyo?): Where is it?<br /><br />
        몇 시에요? (Myeot sieyo?): What time is it?<br /><br />
        얼마에요? (Eolmaeyo?): How much is it?<br /><br />
        왜요? (Waeyo?): Why?<br /><br />
        어떻게 가요? (Eotteoke gayo?): How do I get there?<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header><h5>5. 길 묻기</h5></Accordion.Header>
        <Accordion.Body>
        이 길 맞아요? (I gil majayo?): Is this the right way?<br /><br />
        왼쪽으로 가세요 (Oenjjog-euro gaseyo): Go left<br /><br />
        오른쪽으로 가세요 (Oreunjjog-euro gaseyo): Go right<br /><br />
        직진하세요 (Jikjin haseyo): Go straight<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="5">
        <Accordion.Header><h5>6. 기타</h5></Accordion.Header>
        <Accordion.Body>
        이해해요 (Ihaehaeyo): I understand<br /><br />
        다시 한 번 말해 주세요 (Dashi han beon malhae juseyo): Please say it again<br /><br />
        천천히 말해 주세요 (Cheoncheonhi malhae juseyo): Please speak slowly<br /><br />
        영어 할 수 있어요? (Yeongeo hal su isseoyo?): Can you speak English?<br /><br />
        도와줄 수 있나요? (Dowajul su innayo?): Can you help me?<br /><br />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
       <div id='traffic'>&nbsp;</div><br />
        </p>
        <h1>교통</h1>
        <p>
           한국의 교통 시스템은 매우 발달되어 있고, 다양한 교통 수단이 효율적으로 운영되고 있습니다.<br /><br />
           {/*<button className='one' onClick={() => setModalShow3(true)}>대중교통 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>1. 지하철 이용 팁</h5></Accordion.Header>
        <Accordion.Body>
        <b>지하철 요금</b>: 기본요금은 1.500원이고, 10km부터 1km당 100원이 추가됩니다.<br /><br />
        <b>지하철 노선도</b>: 서울 지하철은 1호선부터 9호선까지 있으며, 각 노선은 다른 색깔로 구분되어 있어 따라가기가 쉽습니다. 
        대부분의 역에는 영어 안내도 제공되므로, 큰 역에서는 영어로도 정보를 확인할 수 있습니다.<br /><br />
        <b>역에서의 유의사항</b>:환승 시에는 출구를 잘 확인해야 합니다.<br />
         한 번 더 탑승할 때는 환승할인이 적용되므로, 환승 정보를 미리 체크하는 것이 좋습니다.<br />
        지하철 티켓을 잃어버리지 않도록 주의하세요.<br /> 
        카드로 이용하면 걱정 없이 사용 가능하지만, 현금을 이용할 경우 티켓을 잃어버리면 추가 요금이 부과될 수 있습니다.<br /><br />
       <b>혼잡 시간</b> : 서울 지하철은 출퇴근 시간(7-9시, 6-8시)에 매우 붐빕니다. 여유를 두고 이동하는 것이 좋습니다.


        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>2. 버스 이용 팁</h5></Accordion.Header>
        <Accordion.Body>
        <b>버스 노선</b>: 서울을 비롯한 대부분의 대도시에서는 파랑버스, 초록버스, 빨간버스 등으로 구분됩니다.<br />
        파랑버스는 지하철역과 지역 간 이동하는 버스입니다.<br />
        초록버스는 동네 내부를 순환하는 버스입니다.<br />
        빨간버스는 지하철과 고속도로를 연결하는 고급형 버스입니다.<br /><br />
        <b>버스 정류장</b>: 대부분의 정류장은 영어로도 표시되어 있어 막히는 길을 피하고 싶다면 쉽게 목적지까지 가는 버스를 찾을 수 있습니다.<br /><br />
        <b>교통카드</b>: 버스를 탑승할 때는 카드 리더기에 카드를 찍고 하차할 때도 찍어야 합니다. 버스에서 현금을 낼 수 없으므로 반드시 교통카드를 준비해야 합니다.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>3. 택시 이용 팁</h5></Accordion.Header>
        <Accordion.Body>
        <b>1. 택시 승차 방법</b>:<br /><br />
        <b>일반 택시</b>: 도로에서 손을 흔들어 택시를 호출할 수 있습니다.<br />
        <b>택시 호출 앱</b>: 스마트폰 앱(예: 카카오T, T-map 등)을 통해 택시를 호출할 수 있습니다.<br />
        <b>택시 승강장</b> : 공항, 기차역, 버스 터미널 등에는 지정된 택시 승강장이 있으니 해당 장소에서 대기하거나, 승강장에서 택시를 이용하세요.<br /><br />
        <b>2. 기본 요금 및 요금 체계</b>:<br /><br />
        기본 요금은 지역에 따라 다르며, 서울을 기준으로 기본 요금은 4,800원입니다.<br /><br />
        거리 및 시간 요금은 택시 미터기에서 자동으로 계산됩니다.<br /><br />
        심야 할증: 밤 12시부터 오전 4시까지 탑승 시 기본 요금의 20%가 추가됩니다.<br /><br />

        </Accordion.Body>
      </Accordion.Item>

    </Accordion>
      <div id='season'>&nbsp;</div><br />
        </p>
        <h1>계절</h1>
        <p>
           한국은 사계절이 뚜렷한 나라로, 계절마다 날씨와 여행 환경이 많이 달라집니다.<br /><br />
           {/*<button className='one' onClick={() => setModalShow4(true)}>각 계절별 주의사항과 팁 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>1. 봄 (3월 ~ 5월)</h5></Accordion.Header>
        <Accordion.Body>
        봄은 한국에서 가장 아름다운 계절 중 하나로, 꽃들이 만개하고 날씨도 매우 쾌적합니다. 하지만 일부 주의할 점들이 있습니다.<br /><br />
        <b>주요 팁</b>:<br />
        벚꽃 시즌 (3월 말 ~ 4월 초):<br />
        &nbsp;&nbsp;-벚꽃이 만개하는 시기에는 많은 사람들이 벚꽃 축제에 참여하거나 벚꽃이 피는 명소를 방문합니다.<br /> &nbsp;&nbsp;&nbsp;&nbsp;서울의 여의도 한강공원, 진해, 경주 등이 유명한 벚꽃 명소입니다.<br />
        &nbsp;&nbsp;-벚꽃을 구경할 때 미세먼지가 있을 수 있으니, 마스크나 안경을 준비하는 것이 좋습니다.<br /><br />
        <b>날씨</b>:<br /> 날씨는 온화하지만 아침저녁으로 기온 차가 크므로 가벼운 겉옷과 스웨터를 준비하는 것이 좋습니다. 
        바람이 많이 불면 쌀쌀할 수 있으니 가벼운 자켓을 챙기는 것이 유용합니다.<br /><br />
        <b>주의사항</b>:<br />
        -미세먼지: 봄에는 미세먼지가 심한 날이 많습니다. 날씨가 흐리거나 먼지가 있는 날은 마스크를 착용하는 것이 좋습니다.<br />
        -알레르기: 꽃가루나 나무에서 나오는 알레르기 물질로 인해 알레르기 증상이 있을 수 있습니다. 약국에서 항히스타민제를 구입할 수 있으니 미리 대비하세요.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>2. 여름 (6월 ~ 8월)</h5></Accordion.Header>
        <Accordion.Body>
        여름은 덥고 습한 날씨가 특징으로, 장마와 태풍이 있을 수 있습니다.<br /><br />
        <b>주요 팁</b>:<br />
        장마철 (6월 말 ~ 7월 초):<br />
        -비가 자주 오는 시기로, 우산을 꼭 준비해야 합니다. 가벼운 우비나 휴대용 우산을 챙기는 것이 좋습니다. <br />
        -여름철에는 실내 활동을 많이 해야 할 수도 있으니, 실내 관광지나 박물관, 미술관 등을 고려해 보세요.<br /><br />
        <b>여름휴가</b>:<br />
        -여름에는 해변이나 계곡을 찾는 여행객들이 많습니다. 서울에서 기차나 버스를 타고 강릉, 속초, 제주도 등을 방문하면 여름의 바다를 즐길 수 있습니다.<br /><br />
        <b>날씨</b>:<br /> 덥고 습한 날씨가 지속되므로 가벼운 옷과 모자, 선크림을 챙기는 것이 좋습니다.<br /><br />
        <b>주의사항</b>:<br />
        -습도와 더위: 여름철은 매우 덥고 습하므로 수분 보충이 중요합니다. 탈수 방지를 위해 물을 자주 마시고, 햇볕 차단을 철저히 해야 합니다. 또한, 모자와 썬크림을 준비하는 것이 필수입니다.<br />
        -태풍: 8월경에는 태풍이 발생할 수 있습니다. 여행 중 태풍이 예상된다면 기상 예보를 체크하고, 외출을 자제하는 것이 좋습니다.<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>3. 가을 (9월 ~ 11월)</h5></Accordion.Header>
        <Accordion.Body>
        가을은 한국에서 가장 여행하기 좋은 시기 중 하나로, 날씨가 시원하고 경치도 아름답습니다.<br /><br />
        <b>주요 팁</b>:<br />
        단풍 시즌 (10월 중순 ~ 11월 초):<br />
        -가을은 단풍이 절정에 달하는 시기로, 설악산, 북한산, 지리산 등의 산을 방문하면 아름다운 단풍을 볼 수 있습니다.<br />
        -가을 단풍을 즐길 때는 산책이나 하이킹을 즐기기 좋은 날씨이므로 편안한 신발을 준비하세요.<br /><br />
        <b>날씨</b>:<br /> 여름의 더위가 사라지고 기온이 시원해지므로 얇은 겉옷이나 자켓을 준비하는 것이 좋습니다.<br /><br />
        <b>주의사항</b>:<br />
        -일교차: 가을은 낮과 밤의 기온 차가 크기 때문에 가벼운 옷과 함께 따뜻한 옷을 챙겨야 합니다. 외출 시 자켓이나 카디건을 준비하는 것이 좋습니다.<br />
        -미세먼지: 가을에도 미세먼지가 있을 수 있으므로, 마스크를 준비하는 것이 좋습니다.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header><h5>4. 겨울 (12월 ~ 2월)</h5></Accordion.Header>
        <Accordion.Body>
        겨울은 매우 춥고 눈이 자주 오는 계절입니다. 눈 덮인 풍경을 즐길 수 있지만, 추위와 눈에 대비해야 합니다.<br /><br />
        <b>주요 팁</b>:<br />
        겨울 스포츠:<br />
        -겨울에는 스키나 스노보드를 즐길 수 있는 강원도 지역(예: 평창, 용평, 휘닉스파크)으로 떠나는 여행객들이 많습니다. 겨울 스포츠를 즐길 계획이라면 미리 예약을 하는 것이 좋습니다.<br />
        -온천이나 스파도 겨울에 인기 있는 여행지입니다. 서울 근교에 있는 온천도 겨울철에 편안하게 즐길 수 있습니다.<br /><br />
        <b>날씨</b>: 겨울은 매우 추운 날씨가 지속되므로 두꺼운 겨울 옷과 장갑, 목도리 등을 준비하세요. 눈이 많이 오는 지역에서는 방수가 되는 옷과 신발을 준비하는 것이 좋습니다.<br /><br />
        <b>주의사항</b>:<br />
        -추위: 겨울은 매우 추울 수 있으므로 보온성 있는 의류를 준비하세요. 특히, 핫팩이나 장갑을 챙기면 더욱 편리합니다.<br />
        -눈과 빙판길: 눈이 내리면 빙판길에 미끄러울 수 있으니, 미끄럼 방지가 되는 신발을 준비하세요. 눈이 많이 내리는 날에는 외출을 자제하는 것이 안전합니다.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
      <br />
       <p>
       <b>기타 공통 팁</b><br />
      -일기예보 체크: 한국은 기후가 급변할 수 있기 때문에, 날씨 예보를 자주 확인하는 것이 중요합니다.<br /><br />
      -의약품 준비: 계절에 따라 알레르기 약이나 방한용품을 준비하는 것이 좋습니다. 특히 겨울에는 보습제나 기타 피부 관리 제품을 준비하는 것도 유용합니다.<br /><br />
      -외출 시 준비물: 외출할 때는 우산이나 여행용 배터리 등을 준비하면 날씨나 기타 불편에 대비할 수 있습니다.<br /><br />

       </p>
       <div id='provide'>&nbsp;</div><br />
        </p>
        <h1>치안 및 안전</h1>
        <p>
           한국은 세계에서 가장 안전한 나라 중 하나로 꼽히며, 범죄율이 매우 낮습니다. <br />
           그러나 기본적인 안전 수칙을 지키고, 외출 시 소지품 관리와 교통 안전에 신경을 쓰는 것이 중요합니다.<br /><br />
           {/*<button className='one' onClick={() => setModalShow5(true)}>비상 상황 대비 방법 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>1. 비상 연락처 확인</h5></Accordion.Header>
        <Accordion.Body>
        <b>비상 연락처</b>:<br />
        경찰(police): 112 (한국어와 영어로 대응 가능)<br /><br />
        소방 및 구급차(firefighting): 119 (응급 상황 시 신속하게 대응)<br /><br />
        한국 관광공사 1330: 외국인을 위한 긴급 지원 서비스로, 다국어(영어, 중국어, 일본어 등)로 대응 가능<br /><br />
        여행지 주변의 경찰서 및 병원 위치를 사전에 확인해 두면 유용합니다.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>2. 분실물 관리</h5></Accordion.Header>
        <Accordion.Body>
        <b>분실 시 신고</b>: 한국에서 여권이나 지갑을 분실한 경우, 가까운 경찰서나 여권 분실 신고 센터에 신고하여 도움을 받을 수 있습니다.<br /><br />
        <b>여권 분실 시</b>: 여권 분실 신고 후, 대사관에 연락하여 새 여권을 발급받아야 합니다.<br /><br />
        <b>분실물 센터:</b> 주요 역이나 공항, 대형 쇼핑몰 등에는 분실물 센터가 있으며, 여기에 문의하면 분실물의 위치를 확인할 수 있습니다.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>3. 자연재해 및 기상 상황</h5></Accordion.Header>
        <Accordion.Body>
        <b>태풍 및 장마철</b>: 한국의 여름은 태풍이나 장마가 발생할 수 있는 시기입니다. 날씨가 악화될 경우, 외출을 피하고 
        실내에서 안전하게 대피하는 것이 좋습니다. <br /><br />
        <b>눈길 및 빙판길</b>: 겨울에는 눈이 내릴 수 있습니다. 빙판길에서는 미끄러질 수 있으니 미끄럼 방지 신발을 준비하거나, 핫팩을 챙겨 몸을 따뜻하게 유지하세요.
        </Accordion.Body>
      </Accordion.Item>

    </Accordion>
      <br />
       <p>
       <h4>유용한 팁</h4>
       <b>여행 보험</b>: 예상치 못한 사고나 질병에 대비해 여행 보험에 가입하는 것이 좋습니다. 의료비나 취소 수수료 등을 보장하는 보험을 선택하는 것이 유용합니다.<br /><br />
       <b>응급처치 키트 준비</b>: 기본적인 응급처치 키트(붕대, 소독약, 진통제 등)를 챙겨두면 유용합니다.<br /><br />
       <b>언어 문제</b>: 한국어가 어려울 수 있기 때문에, 간단한 영어 표현이나 구글 번역기를 사용하여 의사소통을 할 수 있도록 준비하세요.

       </p>
       <div id='exchange and card'>&nbsp;</div><br /> 
        </p>
        <h1>환전과 카드</h1>
        <p>
           한국에서는 환전과 카드 사용이 모두 편리하게 이루어질 수 있지만, 몇 가지 유의할 점이 있습니다.<br /><br />
           {/*<button className='one' onClick={() => setModalShow6(true)}>환전할 장소 및 유의사항 안내와 카드 사용 여부 및 유의사항 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>1. 환전</h5></Accordion.Header>
        <Accordion.Body>
        <b>환전할 장소</b>: <br />
        공항: 한국의 주요 국제공항(인천공항, 김포공항 등)에는 환전소가 있습니다. 다만, 공항 환전소는 환율이 다소 불리할 수 있으므로 큰 금액을 환전하기보다는 소액만 환전하고, 나머지는 시내에서 환전하는 것이 좋습니다.<br /><br />
        은행: 서울과 주요 도시의 은행에서 외환을 환전할 수 있습니다. 여권을 제시해야 하며, 영업시간에만 환전이 가능하므로 사전에 확인하는 것이 좋습니다.<br /><br />
        환전소: 시내에 있는 외환 환전소들은 환율이 비교적 좋고, 수수료가 낮은 경우가 많습니다.<br /><br /><br />
        <b>환전 시 유의사항</b>: <br />
        환율과 수수료: 환율은 시기와 장소에 따라 다를 수 있습니다. 공항보다는 시내 환전소나 은행이 더 유리할 수 있으므로 여러 곳을 비교하는 것이 좋습니다.<br /><br />
        현금 소지 한도: 한국에 들어올 때 1만 달러 이상을 소지하고 있으면 신고해야 합니다. 이는 한국에서 환전할 때도 동일한 규정이 적용됩니다.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>2. 카드 사용</h5></Accordion.Header>
        <Accordion.Body>
        <b>카드 사용 가능 여부</b><br /><br />
        Visa, MasterCard, JCB, American Express 등 주요 국제 카드 브랜드는 거의 대부분의 가맹점에서 사용됩니다.<br />
        다만, 일부 소규모 가게나 전통 시장에서는 현금만 받는 경우도 있으므로 카드 사용이 불편할 수 있습니다.<br /><br /><br />
        <b>카드 사용 시 유의사항</b><br /><br />
        카드 승인 국가: 자신의 카드가 해외 사용이 가능한지 확인하는 것이 중요합니다. 특히 인터넷 쇼핑이나 자동화기기(ATM)에서 카드 결제를 시도할 때 카드가 거절될 수 있으므로, 카드사의 해외 사용 설정을 확인해보세요.<br /><br />
        카드 수수료: 해외 카드 사용 시 결제 금액에 따라 수수료가 부과될 수 있습니다. 예를 들어, 카드사에서 해외 결제 시 환전 수수료가 추가될 수 있습니다.<br /><br />
        신용카드 사용 시: 신용카드로 결제 시, 현금처럼 결제 즉시 금액이 빠져나가지 않고 후불제로 결제가 이루어집니다. 신용카드를 사용할 때는 월별 한도를 설정하거나, 해외 결제에 대한 알림 서비스를 설정하는 것이 좋습니다.<br />
        </Accordion.Body>
      </Accordion.Item>

    </Accordion>
      <br />
      <h5>참고</h5>
      <p>
      한국에서는 팁 문화가 없습니다.
      </p>
      <div id='standard'>&nbsp;</div><br />
        </p>
        <h1>규범과 법률</h1>
        <p>
           한국은 전통적으로 매우 예의와 규범을 중시하는 문화가 있으며, 그에 따라 사회적인 행동이나 법률이 특정한 방식으로 자리잡고 있습니다.<br /><br />
           {/*<button className='one' onClick={() => setModalShow7(true)}>규범과 법률 안내</button>*/}
           <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><h5>1. 존댓말과 예의</h5></Accordion.Header>
        <Accordion.Body>
        <b>존댓말 사용</b>: 한국에서는 나이, 직급, 사회적 위치에 따라 적절한 존댓말을 사용하는 것이 중요합니다. 예를 들어, 나이가 많거나 직장에서 상사는 반드시 존댓말을 써야 하며, 그렇지 않으면 예의가 없는 행동으로 간주됩니다. 이런 차이를 잘 모르고 반말을 사용할 경우 불쾌감을 줄 수 있습니다.<br /><br />
        <b>연장자 우대</b>: 연장자에게 존경을 표시하는 것이 한국 사회에서 중요한 규범입니다. 예를 들어, 식사를 시작할 때 어른이 먼저 숟가락을 들기 전에 시작하지 않는 것이 일반적입니다.<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h5>2. 음주 문화와 예절</h5></Accordion.Header>
        <Accordion.Body>
        <b>음주 예절</b>: 한국에서는 술자리가 중요한 사회적 행사로 여겨지며, 술을 따를 때도 예의가 있습니다. 보통 나이가 많은 사람이 다른 사람의 술잔을 채워주며, 반대로 젊은 사람이 나이가 많은 사람에게 술을 따를 때는 두 손으로 잔을 들어야 합니다.<br /><br />
        <b>술자리에서의 행동</b>: 술을 마실 때 고개를 돌려서 마시는 것이 예의입니다. 또한, 상대방이 술을 더 이상 마시지 않으려고 할 때 강제로 권하는 것이 부적절할 수 있습니다.<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h5>3. 법적 규제와 사회적 제한</h5></Accordion.Header>
        <Accordion.Body>
        <b>흡연과 금연 구역</b>: 한국에서는 공공장소에서 흡연을 엄격하게 제한하고 있으며, 금연 구역에서는 흡연이 법적으로 금지됩니다. 특히, 거리나 공공장소에서 담배를 피우는 것은 다른 사람에게 불쾌감을 줄 수 있기 때문에 주의해야 합니다.<br /><br />
        <b>음주 운전</b>: 한국에서는 음주운전이 매우 심각한 범죄로 취급됩니다. 혈중 알콜 농도가 0.03% 이상이면 음주운전으로 간주되며, 음주 측정을 거부하면 더 큰 처벌을 받을 수 있습니다. 또한, 음주 측정을 거부하면 면허 취소나 징역형이 부과될 수 있습니다.<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header><h5>4. 시간과 약속</h5></Accordion.Header>
        <Accordion.Body>
        <b>시간 엄수</b>: 한국에서는 시간을 매우 중요하게 생각합니다. 약속을 지키지 않거나 늦는 것은 큰 실례로 여겨지며, 심지어 상대방이 시간을 지키지 않으면 신뢰를 잃을 수 있습니다.<br /><br />
        <b>약속 변경</b>: 약속을 갑자기 변경하거나 취소하는 것 또한 한국에서는 부정적인 인식을 받을 수 있습니다. 특히 직장 내에서의 약속 변경은 업무의 신뢰성에 큰 영향을 미칠 수 있습니다.<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header><h5>5. 교통 법규</h5></Accordion.Header>
        <Accordion.Body>
        <b>불법 주정차</b>: 한국에서는 불법 주정차에 대해 엄격한 규제가 있으며, 과태료를 부과받을 수 있습니다. 특히, 길거리에서의 불법 주정차가 빈번히 일어날 수 있는데, 이는 교통 흐름에 방해가 되기 때문에 경찰이 단속을 자주 합니다.<br /><br />
        <b>보행자 보호구역</b>: 보행자 보호구역에서는 차량이 보행자를 양보해야 하며, 이를 무시하고 보행자가 건널 때 차량이 지나가면 교통법규 위반으로 처벌을 받을 수 있습니다.<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="5">
        <Accordion.Header><h5>6. 전통적 관습과 예절</h5></Accordion.Header>
        <Accordion.Body>
        <b>명절과 선물</b>: 한국에서는 명절이나 중요한 기념일에 선물을 주고받는 것이 중요한 문화적 관습입니다. 특히 설날이나 추석 때는 가족 간의 선물이 중요하며, 고위직 상사에게도 선물을 주는 것이 일반적입니다.<br /><br />
        <b>가족 중심 사회</b>: 한국은 전통적으로 가족을 중시하는 사회입니다. 예를 들어, 결혼식이나 장례식에서는 가족의 역할이 매우 중요하며, 이러한 행사에 참석하는 것이 사회적 의무로 여겨질 수 있습니다.<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="6">
        <Accordion.Header><h5>7. 성범죄와 성적 행동</h5></Accordion.Header>
        <Accordion.Body>
        <b>성희롱과 성범죄</b>: 성희롱이나 성범죄에 대한 법적 규제는 매우 엄격합니다. 성희롱을 당한 사람이 피해를 주장할 경우, 법적 처벌을 받을 수 있으며, 이로 인해 사회적 이미지에도 큰 타격을 입을 수 있습니다.<br /><br />
        <b>성적 표현과 이미지</b>: 한국에서는 공공장소에서 지나치게 공개적인 성적 행동을 하는 것에 대해 사회적으로 강한 반대가 있습니다. 따라서, 외국인들이 한국에서 적당한 사회적 규범을 지키는 것이 중요합니다.<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="7">
        <Accordion.Header><h5>8. 기타 법률 및 사회적 규범</h5></Accordion.Header>
        <Accordion.Body>
        <b>불법 다운로드 및 저작권</b>: 한국에서는 저작권 보호가 엄격하며, 불법 다운로드나 불법 스트리밍은 법적으로 처벌받을 수 있습니다. 이런 문제는 기술적으로도 많이 단속되고 있습니다.<br /><br />
        <b>외국인 등록법</b>: 외국인으로서 한국에 장기 체류하려면 외국인 등록을 해야 하며, 이를 하지 않으면 불법 체류자로 간주될 수 있습니다. 외국인 등록증을 가지고 있어야 체류 기간 연장이나 취업 등이 가능합니다.<br /><br />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="8">
        <Accordion.Header><h5>9. 민감한 주제</h5></Accordion.Header>
        <Accordion.Body>
        <b>정치적인 발언과 행동</b>: 한국에서는 정치적인 이슈에 대해 신중하게 접근하는 것이 중요합니다. 특히 역사적 사건이나 정치적인 문제에 대해 민감한 발언을 하면 논란을 일으킬 수 있습니다.<br /><br />
        <b>국민의 의무</b>: 군 복무는 한국 남성에게 필수적인 의무입니다. 외국인이라도 군 복무를 마친 남성에게는 특별한 존경을 표하는 경우가 많습니다.<br /><br />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <br />
       <b>
       이러한 사회적 규범과 법률들은 한국 사회의 특수한 문화적 맥락을 반영하고 있기 때문에 외국인들이 이를 인지하고 존중하는 것이 중요합니다.
       </b>
          
        </p>
      </div>
      <ScrollToTopButton />
    </div>
  )
}

export default Information