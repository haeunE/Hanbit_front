import { useTranslation } from 'react-i18next';
import '../css/ExchangeRate.css'
import { useState, useEffect } from 'react';


function ExchangeRate() {
  const { t } = useTranslation();
  
  const curr = {
    'krw' : t`exchange.kor-curr`,
    'usd' : t`exchange.us-curr`,
    'eur' : t`exchange.eu-curr`,
    'cny' : t`exchange.cn-curr`,
    'jpy' : t`exchange.jp-curr`
  }

  const [rateValue, setRateValue] = useState('usd');

  const [rateValue2, setRateValue2] = useState('krw');

  const [century, setCentury] = useState('');

  const [inputValue, setInputValue] = useState(1);

  const [inputValue2, setInputValue2] = useState();

  const [rateCheck, setRateCheck] = useState([]);


  

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

  return(
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
    </div>
  )
}

export default ExchangeRate