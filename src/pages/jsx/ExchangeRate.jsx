import { useTranslation } from 'react-i18next';
import '../css/ExchangeRate.css'
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import NaverMap from '../../components/jsx/NaverMap';


function ExchangeRate() {
  const { t } = useTranslation();
  const [rateValue, setRateValue] = useState('usd');
  const [rateValue2, setRateValue2] = useState('krw');
  const [century, setCentury] = useState('');
  const [inputValue, setInputValue] = useState(1);
  const [inputValue2, setInputValue2] = useState();
  const [rateCheck, setRateCheck] = useState([]);
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const curr = {
    'krw' : t`exchange.kor-curr`,
    'usd' : t`exchange.us-curr`,
    'eur' : t`exchange.eu-curr`,
    'cny' : t`exchange.cn-curr`,
    'jpy' : t`exchange.jp-curr`
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setInputValue2(event.target.value * century)
  };
  const handleInputChange2 = (event) => {
    setInputValue2(event.target.value);
    setInputValue(event.target.value / century)
  };
  const handleChange = (event) => {
    setRateValue(event.target.value);
  };
  const handleChange2 = (event) => {
    setRateValue2(event.target.value);
  };

  useEffect(() => {
    fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${rateValue}.json`)
    .then((response) => response.json())
    .then((data) => {
      const up = (data[rateValue][rateValue2])
      setCentury(up);
      setInputValue2(inputValue * up)
    })
  }, [rateValue, rateValue2]);

  useEffect(() => {
    fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json`)
    .then((response) => response.json())
    .then((data) => {
      setRateCheck([
        {
          'country' : t`exchange.us`,
          'currency' : 'usd',
          'rate' : 1 / data.krw.usd
        },
        {
          'country' : t`exchange.eu`,
          'currency' : 'eur',
          'rate' : 1 / data.krw.eur
        },
        {
          'country' : t`exchange.cn`,
          'currency' : 'cny',
          'rate' : 1 / data.krw.cny
        },
        {
          'country' : t`exchange.jp`,
          'currency' : 'jpy',
          'rate' : 1 / data.krw.jpy
        },
      ])
    })
  }, [t]);

    // 서울 TOP5 검색
    useEffect(() => {
      const clientId = import.meta.env.VITE_NAVER_API_ID;
      const clientSecret = import.meta.env.VITE_NAVER_API_SECRET;
      
      const fetchSpots = async () => {
        setIsLoading(true);
        try {
          const { data } = await axios.get("/api/v1/search/local.json", {
            params: {
              query: "환전소",
              display: 5,
              sort: "comment",
            },
            headers: {
              "X-Naver-Client-Id": clientId,
              "X-Naver-Client-Secret": clientSecret,
            },
          });

          console.log(data.items)
          
          setSpots(data.items.map(item => ({
            addr: item.address,
            link: item.link,
            lon: item.mapx / 10000000, // 경도
            lat: item.mapy / 10000000, // 위도
            title: item.title.replace(/<[^>]*>/g, '') // HTML 태그 제거
          })) || []);
        } catch (error) {
          console.error("검색 오류:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchSpots();
    }, []);

  return(
    <Container>      
      <div id='ExchangeRate'>
        <section>
          <h2>{t`exchange.title`}</h2>         
            <div className='inner'>
            <div className='excr_box'>
              <div className='slc_box'>
                
                <select value={rateValue} onChange={handleChange}>
                  <option value="krw">{t`exchange.kor`}</option>
                  <option value="usd">{t`exchange.us`}</option>
                  <option value="eur">{t`exchange.eu`}</option>
                  <option value="cny">{t`exchange.cn`}</option>
                  <option value="jpy">{t`exchange.jp`}</option>
                </select>
              </div>

              <div className='num'>
                <label for='num' className='u_hc'>&nbsp;&nbsp;</label>
                <input value={inputValue} onChange={handleInputChange} placeholder={t`exchange.placeholder`}  type='number' id='num' className='input' />
              
              <div className='recite'>
                <span className='nb_txt'>{Number(inputValue).toLocaleString()} {curr[rateValue]}</span>
              </div>
              </div>
            </div>
            <div className='excr_eq'><span>=</span></div>
            <div className='excr_box'>
            <div className='slc_box'>

            <select value={rateValue2} onChange={handleChange2}>
                <option value="krw">{t`exchange.kor`}</option>
                <option value="usd">{t`exchange.us`}</option>
                <option value="eur">{t`exchange.eu`}</option>
                <option value="cny">{t`exchange.cn`}</option>
                <option value="jpy">{t`exchange.jp`}</option>
            </select>
            

            </div>
            <div className='num'>
                <label for='num' className='u_hc'>&nbsp;&nbsp;</label>
                <input value={inputValue2} onChange={handleInputChange2} placeholder={t`exchange.placeholder`}  type='number' id='num' className='input' />
                                
            <div className='recite'>
                <span className='nb_txt'>{Number(inputValue2).toLocaleString()} {curr[rateValue2]} </span>
              </div>
              </div>
            </div>
          </div>
        </section>
        <div className='item-box'>
          {
            rateCheck.map((data) => {
              return (
                <div className='rate-item'>
                  <span className='country'>{data.country}</span>  
                  <span className='currency'>&nbsp;&nbsp;&nbsp;{data.currency}</span> 
                  <p className='rate'>{Number(data.rate).toFixed(2)}</p>
                </div>
              )
            })
          }
        </div>
        <div>
          <NaverMap items={[spots]}  zoom={13}/>
        </div>
      </div>
    </Container>
  )
}

export default ExchangeRate